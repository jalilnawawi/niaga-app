import { and, eq, gt } from 'drizzle-orm';
import type { Db } from '../../db/client';
import { sessions, tenants, users } from './auth.model';

// Auth runs before a tenant is known, so these lookups are global by design: emails are unique across tenants.
export async function findUserByEmail(db: Db, email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function findSessionUser(db: Db, sessionId: string) {
  const [row] = await db
    .select({ user: users, tenant: tenants })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .innerJoin(tenants, eq(tenants.id, users.tenantId))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())));
  return row;
}

// Inserts return the unexecuted query so the service can db.batch() them atomically.
export const insertTenant = (db: Db, values: typeof tenants.$inferInsert) => db.insert(tenants).values(values);

export const insertUser = (db: Db, values: typeof users.$inferInsert) => db.insert(users).values(values);

export const insertSession = (db: Db, values: typeof sessions.$inferInsert) => db.insert(sessions).values(values);

export async function deleteSession(db: Db, sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
