import type { Login, Me, Signup } from '@niaga/shared';
import type { Db } from '../../db/client';
import { AppError } from '../../lib/errors';
import * as repo from './auth.repository';
import { hashPassword, verifyPassword } from './password';

const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

// Session id is the SHA-256 of the cookie token, so a leaked sessions table cannot be replayed.
async function sessionId(token: string) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))));
}

export type Session = { token: string; expiresAt: Date };

async function newSession(db: Db, userId: string) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const expiresAt = new Date(Date.now() + TTL_MS);
  // Wrapped in an object: returning the thenable query from an async function would run it.
  return { session: { token, expiresAt }, insert: repo.insertSession(db, { id: await sessionId(token), userId, expiresAt }) };
}

export async function signup(db: Db, input: Signup): Promise<Session> {
  if (await repo.findUserByEmail(db, input.email)) throw new AppError(409, 'email_taken');

  const tenantId = crypto.randomUUID();
  const userId = crypto.randomUUID();
  const { session, insert } = await newSession(db, userId);
  // neon-http has no interactive transactions; batch runs these in one.
  await db.batch([
    repo.insertTenant(db, { id: tenantId, name: input.tenantName }),
    repo.insertUser(db, {
      id: userId,
      tenantId,
      email: input.email,
      name: input.name,
      role: 'owner',
      passwordHash: await hashPassword(input.password),
    }),
    insert,
  ]);
  return session;
}

export async function login(db: Db, input: Login): Promise<Session> {
  const user = await repo.findUserByEmail(db, input.email);
  // ponytail: unknown email returns faster than a wrong password; signup's 409 already reveals emails anyway.
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AppError(401, 'invalid_credentials');
  }
  const { session, insert } = await newSession(db, user.id);
  await insert;
  return session;
}

export async function logout(db: Db, token: string) {
  await repo.deleteSession(db, await sessionId(token));
}

// ponytail: fixed 30-day expiry, no sliding renewal and no expired-row cleanup; add a cron when the table grows.
export async function getMe(db: Db, token: string): Promise<Me | undefined> {
  const row = await repo.findSessionUser(db, await sessionId(token));
  if (!row) return undefined;
  const { id, email, name, role } = row.user;
  return { id, email, name, role, tenant: { id: row.tenant.id, name: row.tenant.name } };
}
