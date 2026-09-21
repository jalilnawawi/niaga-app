import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { sql } from 'drizzle-orm';
import type { Health } from '@niaga/shared';
import { auth } from './auth/routes';
import { createDb } from './db/client';
import type { Env } from './env';

const app = new Hono<Env>()
  .use('*', (c, next) =>
    cors({ origin: c.env.WEB_ORIGIN, credentials: true })(c, next),
  )
  // Cookie auth: reject cross-site form posts by Origin.
  .use('*', (c, next) => csrf({ origin: c.env.WEB_ORIGIN })(c, next))
  .get('/health', (c) =>
    c.json<Health>({ status: 'ok', time: new Date().toISOString() }),
  )
  .get('/health/db', async (c) => {
    const db = createDb(c.env.DATABASE_URL);
    await db.execute(sql`select 1`);
    return c.json({ status: 'ok' as const });
  })
  .route('/auth', auth);

export type AppType = typeof app;
export default app;
