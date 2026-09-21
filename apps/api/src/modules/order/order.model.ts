import { sql } from 'drizzle-orm';
import { bigint, check, date, foreignKey, index, integer, pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { products } from '../catalog/catalog.model';
import { shifts } from '../shift/shift.model';
import { tenants } from '../tenant/tenant.model';
import { users } from '../user/user.model';

export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'qris']);
export const orderStatusEnum = pgEnum('order_status', ['paid', 'void']);

// The stand's calendar day; receipt numbers restart at 1 on it.
export const jakartaToday = sql`(now() at time zone 'Asia/Jakarta')::date`;

// An order is created already paid (cash counted or QRIS confirmed by the cashier), so there is no pending state.
export const orders = pgTable(
  'orders',
  {
    id: uuid().primaryKey().defaultRandom(),
    tenantId: uuid()
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    businessDate: date().notNull().default(jakartaToday),
    number: integer().notNull(),
    cashierId: uuid()
      .notNull()
      .references(() => users.id),
    // The cashier's open shift at sale time; its cash sales make up the drawer's expected cash.
    shiftId: uuid().notNull(),
    // Rupiah. bigint: 100 items × 999 qty × max price overflows int4.
    total: bigint({ mode: 'number' }).notNull(),
    // Rupiah handed over; change = paid - total.
    paid: bigint({ mode: 'number' }).notNull(),
    paymentMethod: paymentMethodEnum().notNull(),
    status: orderStatusEnum().notNull().default('paid'),
    voidReason: text(),
    voidedById: uuid().references(() => users.id),
    voidedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.tenantId, t.businessDate, t.number),
    // (id, tenantId) is the target of order_items' composite FK.
    unique().on(t.id, t.tenantId),
    index().on(t.tenantId, t.shiftId),
    foreignKey({ columns: [t.shiftId, t.tenantId], foreignColumns: [shifts.id, shifts.tenantId] }),
    check('orders_total_nonnegative', sql`${t.total} >= 0`),
    check('orders_paid_covers_total', sql`${t.paid} >= ${t.total}`),
    check('orders_qris_exact', sql`${t.paymentMethod} <> 'qris' or ${t.paid} = ${t.total}`),
    check(
      'orders_void_fields',
      sql`(${t.status} = 'void') = (${t.voidReason} is not null and ${t.voidedById} is not null and ${t.voidedAt} is not null)`,
    ),
  ],
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid().primaryKey().defaultRandom(),
    tenantId: uuid()
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    orderId: uuid().notNull(),
    productId: uuid()
      .notNull()
      .references(() => products.id),
    // Snapshot at sale time: later catalog edits must not change past receipts.
    name: text().notNull(),
    price: integer().notNull(),
    qty: integer().notNull(),
  },
  (t) => [
    index().on(t.tenantId, t.orderId),
    check('order_items_price_nonnegative', sql`${t.price} >= 0`),
    check('order_items_qty_positive', sql`${t.qty} > 0`),
    foreignKey({ columns: [t.orderId, t.tenantId], foreignColumns: [orders.id, orders.tenantId] }).onDelete('cascade'),
  ],
);

export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
