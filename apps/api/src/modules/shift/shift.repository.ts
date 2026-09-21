import type { SQL } from 'drizzle-orm';
import { and, desc, eq, getTableColumns, isNull, sql } from 'drizzle-orm';
import type { Db } from '../../db/client';
import { orders } from '../order/order.model';
import { users } from '../user/user.model';
import { shifts } from './shift.model';

const selectShifts = (db: Db, tenantId: string, filter: SQL | undefined) =>
  db
    .select({ ...getTableColumns(shifts), cashierName: users.name })
    .from(shifts)
    .innerJoin(users, eq(users.id, shifts.cashierId))
    .where(and(eq(shifts.tenantId, tenantId), filter));

const isOpenFor = (cashierId: string) => and(eq(shifts.cashierId, cashierId), isNull(shifts.closedAt));

export async function findOpenShift(db: Db, tenantId: string, cashierId: string) {
  const [shift] = await selectShifts(db, tenantId, isOpenFor(cashierId));
  return shift;
}

export async function findShiftById(db: Db, tenantId: string, id: string) {
  const [shift] = await selectShifts(db, tenantId, eq(shifts.id, id));
  return shift;
}

// ponytail: newest 100 only; date-range filtering comes with the reports in phase 5.
export const listShifts = (db: Db, tenantId: string) =>
  selectShifts(db, tenantId, undefined).orderBy(desc(shifts.openedAt)).limit(100);

// Undefined when the cashier already has an open shift (the partial unique index rejects it).
export async function insertShift(db: Db, values: { tenantId: string; cashierId: string; openingCash: number }) {
  const [shift] = await db.insert(shifts).values(values).onConflictDoNothing().returning({ id: shifts.id });
  return shift;
}

// Expected cash is computed in the same statement that closes the shift. Undefined when no shift is open.
export async function closeShift(db: Db, tenantId: string, cashierId: string, countedCash: number) {
  const cashSales = db
    .select({ sum: sql`coalesce(sum(${orders.total}), 0)` })
    .from(orders)
    .where(
      and(
        eq(orders.tenantId, tenantId),
        eq(orders.shiftId, shifts.id),
        eq(orders.paymentMethod, 'cash'),
        eq(orders.status, 'paid'),
      ),
    );
  const [shift] = await db
    .update(shifts)
    .set({ closedAt: new Date(), countedCash, expectedCash: sql`${shifts.openingCash} + (${cashSales})` })
    .where(and(eq(shifts.tenantId, tenantId), isOpenFor(cashierId)))
    .returning({ id: shifts.id });
  return shift;
}
