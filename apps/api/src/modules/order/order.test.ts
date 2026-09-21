import { describe, expect, test } from 'bun:test';
import app from '../../index';

// Needs the docker compose DB with migrations applied: DATABASE_URL=... bun test
const DATABASE_URL = process.env.DATABASE_URL;
describe.skipIf(!DATABASE_URL)('orders', () => {
  const env = { DATABASE_URL: DATABASE_URL!, WEB_ORIGIN: 'http://localhost:5173', AUTH_LIMITER: { limit: async () => ({ success: true }) } };
  const call = (method: string, path: string, body?: unknown, cookie = '') =>
    app.request(path, {
      method,
      headers: { 'Content-Type': 'application/json', Origin: env.WEB_ORIGIN, Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    }, env);
  const sid = (res: Response) => res.headers.get('Set-Cookie')!.split(';')[0]!;
  const email = (who: string) => `${who}-${crypto.randomUUID()}@test.local`;
  const signup = async (who: string) =>
    sid(await call('POST', '/auth/signup', { email: email(who), password: 'password1', name: who, tenantName: who }));
  const product = async (owner: string, name: string, price: number) =>
    ((await (await call('POST', '/catalog/products', { name, price, categoryId: null }, owner)).json()) as { id: string }).id;

  test('cashier sells with cash and QRIS; receipt keeps sale-time price', async () => {
    const owner = await signup('owner');
    const cashierEmail = email('cashier');
    await call('POST', '/users', { email: cashierEmail, password: 'password1', name: 'Sari' }, owner);
    const cashier = sid(await call('POST', '/auth/login', { email: cashierEmail, password: 'password1' }));
    const teh = await product(owner, 'Es teh', 5000);
    const nasi = await product(owner, 'Nasi goreng', 15000);

    const cash = await call('POST', '/orders', { items: [{ productId: teh, qty: 2 }, { productId: nasi, qty: 1 }], payment: { method: 'cash', paid: 30000 } }, cashier);
    expect(cash.status).toBe(201);
    expect(await cash.json()).toMatchObject({ number: 1, total: 25000, paid: 30000, change: 5000, paymentMethod: 'cash', status: 'paid', cashierName: 'Sari' });

    const qris = await call('POST', '/orders', { items: [{ productId: teh, qty: 1 }], payment: { method: 'qris' } }, cashier);
    expect(await qris.json()).toMatchObject({ number: 2, total: 5000, paid: 5000, change: 0, paymentMethod: 'qris' });

    const short = await call('POST', '/orders', { items: [{ productId: teh, qty: 1 }], payment: { method: 'cash', paid: 4999 } }, cashier);
    expect(short.status).toBe(400);
    expect((await short.json()) as object).toEqual({ error: 'insufficient_payment' });
    const dup = { items: [{ productId: teh, qty: 1 }, { productId: teh, qty: 1 }], payment: { method: 'qris' } };
    expect((await call('POST', '/orders', dup, cashier)).status).toBe(400);

    await call('PATCH', `/catalog/products/${teh}`, { price: 6000, active: false }, owner);
    const sold = await call('POST', '/orders', { items: [{ productId: teh, qty: 1 }], payment: { method: 'qris' } }, cashier);
    expect((await sold.json()) as object).toEqual({ error: 'product_unavailable' });

    const today = (await (await call('GET', '/orders', undefined, cashier)).json()) as { number: number; items: object[] }[];
    expect(today.map((o) => o.number)).toEqual([2, 1]);
    expect(today[1]!.items).toContainEqual({ productId: teh, name: 'Es teh', price: 5000, qty: 2 });
  }, 30_000);

  test('concurrent checkouts get distinct receipt numbers', async () => {
    const owner = await signup('owner');
    const teh = await product(owner, 'Es teh', 5000);
    const body = { items: [{ productId: teh, qty: 1 }], payment: { method: 'qris' } };
    const results = await Promise.all([1, 2, 3].map(() => call('POST', '/orders', body, owner)));
    expect(results.map((r) => r.status)).toEqual([201, 201, 201]);
    const numbers = await Promise.all(results.map(async (r) => ((await r.json()) as { number: number }).number));
    expect(numbers.sort()).toEqual([1, 2, 3]);
  }, 30_000);

  test('only the owner voids, with a reason, once; tenants are isolated', async () => {
    const owner = await signup('owner');
    const other = await signup('other');
    const cashierEmail = email('cashier');
    await call('POST', '/users', { email: cashierEmail, password: 'password1', name: 'Sari' }, owner);
    const cashier = sid(await call('POST', '/auth/login', { email: cashierEmail, password: 'password1' }));
    const teh = await product(owner, 'Es teh', 5000);
    const body = { items: [{ productId: teh, qty: 1 }], payment: { method: 'qris' } };
    const order = (await (await call('POST', '/orders', body, cashier)).json()) as { id: string };

    expect((await call('POST', '/orders', body, other)).status).toBe(400);
    expect(await (await call('GET', '/orders', undefined, other)).json()).toHaveLength(0);
    expect((await call('POST', `/orders/${order.id}/void`, { reason: 'x' }, other)).status).toBe(404);

    expect((await call('POST', `/orders/${order.id}/void`, { reason: 'salah input' }, cashier)).status).toBe(403);
    expect((await call('POST', `/orders/${order.id}/void`, { reason: '  ' }, owner)).status).toBe(400);
    const voided = await call('POST', `/orders/${order.id}/void`, { reason: 'salah input' }, owner);
    expect(await voided.json()).toMatchObject({ status: 'void', voidReason: 'salah input' });
    expect((await call('POST', `/orders/${order.id}/void`, { reason: 'lagi' }, owner)).status).toBe(409);
    expect((await call('POST', `/orders/${crypto.randomUUID()}/void`, { reason: 'x' }, owner)).status).toBe(404);
  }, 30_000);
});
