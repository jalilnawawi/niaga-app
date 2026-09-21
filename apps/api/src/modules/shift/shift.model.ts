import { sql } from 'drizzle-orm';
import { bigint, check, index, pgTable, timestamp, unique, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { tenants } from '../tenant/tenant.model';
import { users } from '../user/user.model';

// One cashier's drawer session: opened with a float, closed with a count. Every order belongs to one.
export const shifts = pgTable(
  'shifts',
  {
    id: uuid().primaryKey().defaultRandom(),
    tenantId: uuid()
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    cashierId: uuid()
      .notNull()
      .references(() => users.id),
    // Rupiah in the drawer at open.
    openingCash: bigint({ mode: 'number' }).notNull(),
    openedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    closedAt: timestamp({ withTimezone: true }),
    // Snapshot at close: opening + paid cash sales. Later voids do not rewrite a closed shift.
    expectedCash: bigint({ mode: 'number' }),
    // Counted by the cashier at close; difference = counted - expected.
    countedCash: bigint({ mode: 'number' }),
  },
  (t) => [
    uniqueIndex('shifts_one_open_per_cashier').on(t.tenantId, t.cashierId).where(sql`${t.closedAt} is null`),
    index().on(t.tenantId, t.openedAt),
    // (id, tenantId) is the target of orders' composite FK.
    unique().on(t.id, t.tenantId),
    check('shifts_opening_nonnegative', sql`${t.openingCash} >= 0`),
    check('shifts_counted_nonnegative', sql`${t.countedCash} >= 0`),
    check(
      'shifts_close_fields',
      sql`(${t.closedAt} is null) = (${t.expectedCash} is null) and (${t.closedAt} is null) = (${t.countedCash} is null)`,
    ),
  ],
);

export type ShiftRow = typeof shifts.$inferSelect;
