import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { and, eq, gt } from 'drizzle-orm';
import type { Me } from '@niaga/shared';
import { sessions, tenants, users } from '../db/schema';
import type { Env } from '../env';

const COOKIE = 'sid';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

async function sha256(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

// Sets the cookie and returns the insert unexecuted, so signup can batch it with the user rows.
// Wrapped in an object: returning the thenable query from an async function would run it.
export async function newSession(c: Context<Env>, userId: string) {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, '0')).join('');
  const expiresAt = new Date(Date.now() + TTL_MS);
  setCookie(c, COOKIE, token, { httpOnly: true, secure: true, sameSite: 'Lax', path: '/', expires: expiresAt });
  return { insert: c.var.db.insert(sessions).values({ id: await sha256(token), userId, expiresAt }) };
}

export async function endSession(c: Context<Env>) {
  const token = getCookie(c, COOKIE);
  if (token) await c.var.db.delete(sessions).where(eq(sessions.id, await sha256(token)));
  deleteCookie(c, COOKIE, { path: '/', secure: true });
}

// ponytail: fixed 30-day expiry, no sliding renewal and no expired-row cleanup; add a cron when the table grows.
export const requireAuth = createMiddleware<Env & { Variables: { user: Me } }>(async (c, next) => {
  const token = getCookie(c, COOKIE);
  if (!token) return c.json({ error: 'unauthorized' }, 401);
  const [row] = await c.var.db
    .select({ user: users, tenant: tenants })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .innerJoin(tenants, eq(tenants.id, users.tenantId))
    .where(and(eq(sessions.id, await sha256(token)), gt(sessions.expiresAt, new Date())));
  if (!row) return c.json({ error: 'unauthorized' }, 401);
  const { id, email, name, role } = row.user;
  c.set('user', { id, email, name, role, tenant: { id: row.tenant.id, name: row.tenant.name } });
  await next();
});
