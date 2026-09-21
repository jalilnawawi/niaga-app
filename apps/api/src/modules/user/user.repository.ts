import { and, asc, eq } from 'drizzle-orm';
import type { Db } from '../../db/client';
import type { UserRow } from './user.model';
import { users } from './user.model';

export const listUsers = (db: Db, tenantId: string) =>
  db.select().from(users).where(eq(users.tenantId, tenantId)).orderBy(asc(users.createdAt));

export async function findUserById(db: Db, tenantId: string, id: string) {
  const [user] = await db.select().from(users).where(and(eq(users.tenantId, tenantId), eq(users.id, id)));
  return user;
}

export async function insertUser(db: Db, values: typeof users.$inferInsert) {
  const [user] = await db.insert(users).values(values).onConflictDoNothing({ target: users.email }).returning();
  return user;
}

export async function updateUser(db: Db, tenantId: string, id: string, values: Partial<Pick<UserRow, 'active' | 'passwordHash'>>) {
  const [user] = await db
    .update(users)
    .set(values)
    .where(and(eq(users.tenantId, tenantId), eq(users.id, id)))
    .returning();
  return user;
}
