import { boolean, index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.model';

export const roleEnum = pgEnum('role', ['owner', 'cashier']);

export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().defaultRandom(),
    tenantId: uuid()
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    email: text().notNull().unique(),
    name: text().notNull(),
    passwordHash: text().notNull(),
    role: roleEnum().notNull(),
    active: boolean().notNull().default(true),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index().on(t.tenantId)],
);

export type UserRow = typeof users.$inferSelect;
