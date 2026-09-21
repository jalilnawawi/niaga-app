import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Tenants and users live here until they get endpoints of their own; then move each to its module.
export const roleEnum = pgEnum('role', ['owner', 'cashier']);

export const tenants = pgTable('tenants', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  tenantId: uuid()
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  email: text().notNull().unique(),
  name: text().notNull(),
  passwordHash: text().notNull(),
  role: roleEnum().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

// id is the SHA-256 of the cookie token, so a leaked sessions table cannot be replayed.
export const sessions = pgTable('sessions', {
  id: text().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
});
