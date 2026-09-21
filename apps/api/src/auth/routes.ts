import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { loginSchema, signupSchema } from '@niaga/shared';
import { createDb } from '../db/client';
import { tenants, users } from '../db/schema';
import type { Env } from '../env';
import { hashPassword, verifyPassword } from './password';
import { endSession, newSession, requireAuth } from './session';

export const auth = new Hono<Env>()
  .use('*', async (c, next) => {
    c.set('db', createDb(c.env.DATABASE_URL));
    await next();
  })
  .post('/signup', zValidator('json', signupSchema), async (c) => {
    const { email, password, name, tenantName } = c.req.valid('json');
    const db = c.var.db;
    const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    if (taken) return c.json({ error: 'email_taken' }, 409);

    const tenantId = crypto.randomUUID();
    const userId = crypto.randomUUID();
    // neon-http has no interactive transactions; batch runs these in one.
    await db.batch([
      db.insert(tenants).values({ id: tenantId, name: tenantName }),
      db.insert(users).values({ id: userId, tenantId, email, name, role: 'owner', passwordHash: await hashPassword(password) }),
      (await newSession(c, userId)).insert,
    ]);
    return c.json({ ok: true as const }, 201);
  })
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json');
    const [user] = await c.var.db.select().from(users).where(eq(users.email, email));
    // ponytail: unknown email returns faster than a wrong password; signup's 409 already reveals emails anyway.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return c.json({ error: 'invalid_credentials' }, 401);
    }
    await (await newSession(c, user.id)).insert;
    return c.json({ ok: true as const });
  })
  .post('/logout', async (c) => {
    await endSession(c);
    return c.json({ ok: true as const });
  })
  .get('/me', requireAuth, (c) => c.json(c.var.user));
