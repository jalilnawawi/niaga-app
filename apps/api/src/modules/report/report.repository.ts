import type { SQL } from 'drizzle-orm';
import { and, asc, between, desc, eq, sql } from 'drizzle-orm';
import type { Db } from '../../db/client';
import { products } from '../catalog/catalog.model';
import { orderItems, orders } from '../order/order.model';
import { users } from '../user/user.model';

// Postgres returns count/sum as bigint/numeric strings over neon-http.
const num = (expr: SQL) => expr.mapWith(Number);

const paidBetween = (tenantId: string, from: string, to: string) =>
  and(eq(orders.tenantId, tenantId), eq(orders.status, 'paid'), between(orders.businessDate, from, to));

export const salesByDay = (db: Db, tenantId: string, from: string, to: string) =>
  db
    .select({
      date: orders.businessDate,
      orders: num(sql`count(*)`),
      total: num(sql`sum(${orders.total})`),
      cash: num(sql`coalesce(sum(${orders.total}) filter (where ${orders.paymentMethod} = 'cash'), 0)`),
      qris: num(sql`coalesce(sum(${orders.total}) filter (where ${orders.paymentMethod} = 'qris'), 0)`),
    })
    .from(orders)
    .where(paidBetween(tenantId, from, to))
    .groupBy(orders.businessDate)
    .orderBy(asc(orders.businessDate));

// Current product name, so a renamed product is one row instead of one per name.
export const salesByProduct = (db: Db, tenantId: string, from: string, to: string) => {
  const total = num(sql`sum(${orderItems.price} * ${orderItems.qty})`);
  return db
    .select({ productId: orderItems.productId, name: products.name, qty: num(sql`sum(${orderItems.qty})`), total })
    .from(orderItems)
    .innerJoin(orders, and(eq(orders.id, orderItems.orderId), eq(orders.tenantId, orderItems.tenantId)))
    .innerJoin(products, eq(products.id, orderItems.productId))
    .where(and(eq(orderItems.tenantId, tenantId), paidBetween(tenantId, from, to)))
    .groupBy(orderItems.productId, products.name)
    .orderBy(desc(total));
};

export const salesByCashier = (db: Db, tenantId: string, from: string, to: string) => {
  const total = num(sql`sum(${orders.total})`);
  return db
    .select({ cashierId: orders.cashierId, name: users.name, orders: num(sql`count(*)`), total })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.cashierId))
    .where(paidBetween(tenantId, from, to))
    .groupBy(orders.cashierId, users.name)
    .orderBy(desc(total));
};
