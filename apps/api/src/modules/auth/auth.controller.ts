import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, signupSchema } from '@niaga/shared';
import { createDb } from '../../db/client';
import type { Env } from '../../env';
import { clearSessionCookie, getSessionToken, requireAuth, setSessionCookie } from './auth.middleware';
import * as authService from './auth.service';

export const authController = new Hono<Env>()
  .use('*', async (c, next) => {
    c.set('db', createDb(c.env.DATABASE_URL));
    await next();
  })
  .post('/signup', zValidator('json', signupSchema), async (c) => {
    setSessionCookie(c, await authService.signup(c.var.db, c.req.valid('json')));
    return c.json({ ok: true as const }, 201);
  })
  .post('/login', zValidator('json', loginSchema), async (c) => {
    setSessionCookie(c, await authService.login(c.var.db, c.req.valid('json')));
    return c.json({ ok: true as const });
  })
  .post('/logout', async (c) => {
    const token = getSessionToken(c);
    if (token) await authService.logout(c.var.db, token);
    clearSessionCookie(c);
    return c.json({ ok: true as const });
  })
  .get('/me', requireAuth, (c) => c.json(c.var.user));
