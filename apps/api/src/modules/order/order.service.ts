import type { CreateOrder, Order, VoidOrder } from '@niaga/shared';
import type { Db } from '../../db/client';
import { AppError } from '../../lib/errors';
import * as catalogService from '../catalog/catalog.service';
import * as shiftService from '../shift/shift.service';
import type { OrderItemRow } from './order.model';
import * as repo from './order.repository';

type OrderWithCashier = NonNullable<Awaited<ReturnType<typeof repo.findOrderById>>>;

const toOrder = (row: OrderWithCashier, items: OrderItemRow[]): Order => ({
  id: row.id,
  number: row.number,
  businessDate: row.businessDate,
  createdAt: row.createdAt.toISOString(),
  cashierName: row.cashierName,
  paymentMethod: row.paymentMethod,
  total: row.total,
  paid: row.paid,
  change: row.paid - row.total,
  status: row.status,
  voidReason: row.voidReason,
  items: items.filter((i) => i.orderId === row.id).map(({ productId, name, price, qty }) => ({ productId, name, price, qty })),
});

export async function listTodayOrders(db: Db, tenantId: string) {
  const rows = await repo.listTodayOrders(db, tenantId);
  const items = rows.length ? await repo.listOrderItems(db, tenantId, rows.map((r) => r.id)) : [];
  return rows.map((row) => toOrder(row, items));
}

async function getOrder(db: Db, tenantId: string, id: string) {
  const row = await repo.findOrderById(db, tenantId, id);
  if (!row) throw new AppError(404, 'order_not_found');
  return toOrder(row, await repo.listOrderItems(db, tenantId, [id]));
}

// Postgres unique_violation, possibly wrapped by drizzle.
const isUniqueViolation = (e: unknown) => {
  const err = e as { code?: string; cause?: { code?: string } };
  return err.code === '23505' || err.cause?.code === '23505';
};

export async function createOrder(db: Db, tenantId: string, cashierId: string, input: CreateOrder) {
  const shiftId = await shiftService.requireOpenShiftId(db, tenantId, cashierId);
  const products = await catalogService.getActiveProducts(db, tenantId, input.items.map((i) => i.productId));
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = input.items.map(({ productId, qty }) => {
    const product = byId.get(productId);
    if (!product) throw new AppError(400, 'product_unavailable');
    return { productId, name: product.name, price: product.price, qty };
  });

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const paid = input.payment.method === 'cash' ? input.payment.paid : total;
  if (paid < total) throw new AppError(400, 'insufficient_payment');

  const id = crypto.randomUUID();
  const order = { id, tenantId, cashierId, shiftId, total, paid, paymentMethod: input.payment.method };
  const items = lines.map((l) => ({ ...l, tenantId, orderId: id }));
  // Two cashiers checking out at once can take the same receipt number; the loser retries with the next one.
  for (let attempt = 1; ; attempt++) {
    try {
      await db.batch([repo.insertOrder(db, order), repo.insertOrderItems(db, items)]);
      break;
    } catch (e) {
      if (attempt >= 3 || !isUniqueViolation(e)) throw e;
    }
  }
  return getOrder(db, tenantId, id);
}

// Void and refund are the same record for now: the sale no longer counts. Owner-only (controller).
export async function voidOrder(db: Db, tenantId: string, ownerId: string, id: string, input: VoidOrder) {
  if (!(await repo.voidOrder(db, tenantId, id, { voidReason: input.reason, voidedById: ownerId }))) {
    await getOrder(db, tenantId, id);
    throw new AppError(409, 'order_already_void');
  }
  return getOrder(db, tenantId, id);
}
