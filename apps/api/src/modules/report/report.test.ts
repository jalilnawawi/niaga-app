import { describe, expect, test } from 'bun:test';
import app from '../../index';

// Needs the docker compose DB with migrations applied: DATABASE_URL=... bun test
const DATABASE_URL = process.env.DATABASE_URL;
describe.skipIf(!DATABASE_URL)('reports', () => {
  const env = { DATABASE_URL: DATABASE_URL!, WEB_ORIGIN: 'http://localhost:5173', AUTH_LIMITER: { limit: async () => ({ success: true }) } };
  const call = (method: string, path: string, body?: unknown, cookie = '') =>
    app.request(path, {
      method,
      headers: { 'Content-Type': 'application/json', Origin: env.WEB_ORIGIN, Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    }, env);
  const sid = (res: Response) => res.headers.get('Set-Cookie')!.split(';')[0]!;
  const email = (who: string) => `${who}-${crypto.randomUUID()}@test.local`;
  const login = async (emailAddr: string) => {
    const cookie = sid(await call('POST', '/auth/login', { email: emailAddr, password: 'password1' }));
    await call('POST', '/shifts', { openingCash: 0 }, cookie);
    return cookie;
  };
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const report = (cookie: string, from = today, to = today) => call('GET', `/reports/sales?from=${from}&to=${to}`, undefined, cookie);

  test('sales per day, product and cashier; voids excluded; owner only; tenant isolated', async () => {
    const ownerEmail = email('owner');
    await call('POST', '/auth/signup', { email: ownerEmail, password: 'password1', name: 'Budi', tenantName: 'Stand' });
    const owner = await login(ownerEmail);
    const cashierEmail = email('cashier');
    await call('POST', '/users', { email: cashierEmail, password: 'password1', name: 'Sari' }, owner);
    const cashier = await login(cashierEmail);
    const product = async (name: string, price: number) =>
      ((await (await call('POST', '/catalog/products', { name, price, categoryId: null }, owner)).json()) as { id: string }).id;
    const teh = await product('Es teh', 5000);
    const nasi = await product('Nasi goreng', 15000);
    const sell = async (cookie: string, items: object[], payment: object) =>
      ((await (await call('POST', '/orders', { items, payment }, cookie)).json()) as { id: string }).id;

    await sell(cashier, [{ productId: teh, qty: 2 }, { productId: nasi, qty: 1 }], { method: 'cash', paid: 25000 });
    await sell(owner, [{ productId: teh, qty: 1 }], { method: 'qris' });
    const voided = await sell(cashier, [{ productId: nasi, qty: 3 }], { method: 'cash', paid: 45000 });
    await call('POST', `/orders/${voided}/void`, { reason: 'batal' }, owner);
    await call('PATCH', `/catalog/products/${teh}`, { name: 'Es teh manis' }, owner);

    const res = await report(owner);
    expect(res.status).toBe(200);
    expect((await res.json()) as object).toEqual({
      days: [{ date: today, orders: 2, total: 30000, cash: 25000, qris: 5000 }],
      products: [
        { productId: teh, name: 'Es teh manis', qty: 3, total: 15000 },
        { productId: nasi, name: 'Nasi goreng', qty: 1, total: 15000 },
      ],
      cashiers: [
        { cashierId: expect.any(String), name: 'Sari', orders: 1, total: 25000 },
        { cashierId: expect.any(String), name: 'Budi', orders: 1, total: 5000 },
      ],
    });

    expect((await (await report(owner, '2000-01-01', '2000-01-31')).json()) as object).toEqual({ days: [], products: [], cashiers: [] });
    expect((await report(cashier)).status).toBe(403);
    expect((await report(owner, today, '2000-01-01')).status).toBe(400);
    expect((await report(owner, '2024-01-01', '2025-06-01')).status).toBe(400);

    const other = sid(await call('POST', '/auth/signup', { email: email('other'), password: 'password1', name: 'X', tenantName: 'X' }));
    expect((await (await report(other)).json()) as object).toEqual({ days: [], products: [], cashiers: [] });
  }, 30_000);
});
