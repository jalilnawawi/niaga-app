import type { SQL } from 'drizzle-orm';
import { and, desc, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import type { Db } from '../../db/client';
import { users } from '../user/user.model';
import type { OrderItemRow, OrderRow } from './order.model';
import { jakartaToday, orderItems, orders } from './order.model';

const selectOrders = (db: Db, tenantId: string, filter: SQL) =>
  db
    .select({ ...getTableColumns(orders), cashierName: users.name })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.cashierId))
    .where(and(eq(orders.tenantId, tenantId), filter));

export const listTodayOrders = (db: Db, tenantId: string) =>
  selectOrders(db, tenantId, eq(orders.businessDate, jakartaToday)).orderBy(desc(orders.number));

export async function findOrderById(db: Db, tenantId: string, id: string) {
  const [order] = await selectOrders(db, tenantId, eq(orders.id, id));
  return order;
}

export const listOrderItems = (db: Db, tenantId: string, orderIds: string[]) =>
  db
    .select()
    .from(orderItems)
    .where(and(eq(orderItems.tenantId, tenantId), inArray(orderItems.orderId, orderIds)));

type NewOrder = Pick<OrderRow, 'id' | 'tenantId' | 'cashierId' | 'total' | 'paid' | 'paymentMethod'>;

// Unexecuted, for db.batch. Number = today's max + 1; two concurrent inserts collide on the unique constraint.
export function insertOrder(db: Db, values: NewOrder) {
  const next = db
    .select({ n: sql<number>`coalesce(max(${orders.number}), 0) + 1` })
    .from(orders)
    .where(and(eq(orders.tenantId, values.tenantId), eq(orders.businessDate, jakartaToday)));
  return db.insert(orders).values({ ...values, businessDate: jakartaToday, number: sql`(${next})` });
}

export const insertOrderItems = (db: Db, values: Omit<OrderItemRow, 'id'>[]) => db.insert(orderItems).values(values);

// Only a paid order can be voided; returns undefined when not found or already void.
export async function voidOrder(db: Db, tenantId: string, id: string, values: { voidReason: string; voidedById: string }) {
  const [order] = await db
    .update(orders)
    .set({ ...values, status: 'void', voidedAt: new Date() })
    .where(and(eq(orders.tenantId, tenantId), eq(orders.id, id), eq(orders.status, 'paid')))
    .returning({ id: orders.id });
  return order;
}
