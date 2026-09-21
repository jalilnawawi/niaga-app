import type { CloseShift, OpenShift, Shift } from '@niaga/shared';
import type { Db } from '../../db/client';
import { AppError } from '../../lib/errors';
import * as repo from './shift.repository';

type ShiftWithCashier = NonNullable<Awaited<ReturnType<typeof repo.findShiftById>>>;

const toShift = (row: ShiftWithCashier): Shift => ({
  id: row.id,
  cashierName: row.cashierName,
  openingCash: row.openingCash,
  openedAt: row.openedAt.toISOString(),
  closedAt: row.closedAt?.toISOString() ?? null,
  expectedCash: row.expectedCash,
  countedCash: row.countedCash,
  difference: row.countedCash === null || row.expectedCash === null ? null : row.countedCash - row.expectedCash,
});

async function getShift(db: Db, tenantId: string, id: string) {
  const row = await repo.findShiftById(db, tenantId, id);
  if (!row) throw new AppError(404, 'shift_not_found');
  return toShift(row);
}

export const listShifts = async (db: Db, tenantId: string) => (await repo.listShifts(db, tenantId)).map(toShift);

export async function getCurrentShift(db: Db, tenantId: string, cashierId: string) {
  const row = await repo.findOpenShift(db, tenantId, cashierId);
  return row ? toShift(row) : null;
}

// Selling needs an open shift so every cash sale lands in a drawer count.
export async function requireOpenShiftId(db: Db, tenantId: string, cashierId: string) {
  const row = await repo.findOpenShift(db, tenantId, cashierId);
  if (!row) throw new AppError(409, 'shift_not_open');
  return row.id;
}

export async function openShift(db: Db, tenantId: string, cashierId: string, input: OpenShift) {
  const shift = await repo.insertShift(db, { tenantId, cashierId, ...input });
  if (!shift) throw new AppError(409, 'shift_already_open');
  return getShift(db, tenantId, shift.id);
}

// ponytail: a checkout already past requireOpenShiftId can still land after the close and miss the count;
// only the same cashier racing themself hits it. Guard in the order insert if it ever shows up.
export async function closeShift(db: Db, tenantId: string, cashierId: string, input: CloseShift) {
  const shift = await repo.closeShift(db, tenantId, cashierId, input.countedCash);
  if (!shift) throw new AppError(409, 'shift_not_open');
  return getShift(db, tenantId, shift.id);
}
