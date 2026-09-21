import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import type { Me } from '@niaga/shared';
import type { Env } from '../../env';
import type { Session } from './auth.service';
import { getMe } from './auth.service';

const COOKIE = 'sid';

export const getSessionToken = (c: Context) => getCookie(c, COOKIE);

export function setSessionCookie(c: Context, { token, expiresAt }: Session) {
  setCookie(c, COOKIE, token, { httpOnly: true, secure: true, sameSite: 'Lax', path: '/', expires: expiresAt });
}

export function clearSessionCookie(c: Context) {
  deleteCookie(c, COOKIE, { path: '/', secure: true });
}

// Puts the signed-in user on c.var.user; other modules read the tenant from there.
export const requireAuth = createMiddleware<Env & { Variables: { user: Me } }>(async (c, next) => {
  const token = getSessionToken(c);
  const user = token && (await getMe(c.var.db, token));
  if (!user) return c.json({ error: 'unauthorized' }, 401);
  c.set('user', user);
  await next();
});

// Use after requireAuth.
export const requireRole = (role: Me['role']) =>
  createMiddleware<Env & { Variables: { user: Me } }>(async (c, next) => {
    if (c.var.user.role !== role) return c.json({ error: 'forbidden' }, 403);
    await next();
  });

type EmailInput = { in: { json: { email: string } }; out: { json: { email: string } } };

// Use after validate('json', ...): caps password guessing per IP and per targeted (normalised) email.
export const authRateLimit = createMiddleware<Env, string, EmailInput>(async (c, next) => {
  const { email } = c.req.valid('json');
  const ip = c.req.header('cf-connecting-ip') ?? 'unknown';
  const results = await Promise.all([`ip:${ip}`, `email:${email}`].map((key) => c.env.AUTH_LIMITER.limit({ key })));
  if (results.some((r) => !r.success)) return c.json({ error: 'too_many_attempts' }, 429);
  await next();
});
