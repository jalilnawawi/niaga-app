import { sql } from 'drizzle-orm';
import { boolean, check, foreignKey, index, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.model';

export const categories = pgTable(
  'categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    tenantId: uuid()
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  // (id, tenantId) is the target of products' composite FK.
  (t) => [index().on(t.tenantId), unique().on(t.id, t.tenantId)],
);

export const products = pgTable(
  'products',
  {
    id: uuid().primaryKey().defaultRandom(),
    tenantId: uuid()
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    categoryId: uuid(),
    name: text().notNull(),
    // Rupiah.
    price: integer().notNull(),
    active: boolean().notNull().default(true),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index().on(t.tenantId, t.categoryId),
    check('products_price_nonnegative', sql`${t.price} >= 0`),
    // Composite FK: a product can only point at a category of its own tenant. No cascade: deleting a used category fails.
    foreignKey({ columns: [t.categoryId, t.tenantId], foreignColumns: [categories.id, categories.tenantId] }),
  ],
);

export type CategoryRow = typeof categories.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
