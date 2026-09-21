import { describe, expect, test } from 'bun:test';
import app from '../../index';

// Needs the docker compose DB with migrations applied: DATABASE_URL=... bun test
const DATABASE_URL = process.env.DATABASE_URL;
describe.skipIf(!DATABASE_URL)('shifts', () => {
  const env = { DATABASE_URL: DATABASE_URL!, WEB_ORIGIN: 'http://localhost:5173', AUTH_LIMITER: { limit: async () => ({ success: true }) } };
  const call = (method: string, path: string, body?: unknown, cookie = '') =>
    app.request(path, {
      method,
      headers: { 'Content-Type': 'application/json', Origin: env.WEB_ORIGIN, Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    }, env);
  const sid = (res: Response) => res.headers.get('Set-Cookie')!.split(';')[0]!;
  const email = (who: string) => `${who}-${crypto.randomUUID()}@test.local`;
  const json = async (res: Response | Promise<Response>) => (await res).json() as Promise<Record<string, unknown>>;

  test('drawer count: opening + paid cash sales, QRIS and voids excluded, difference recorded', async () => {
    const owner = sid(await call('POST', '/auth/signup', { email: email('owner'), password: 'password1', name: 'Owner', tenantName: 'Stand' }));
    const cashierEmail = email('cashier');
    await call('POST', '/users', { email: cashierEmail, password: 'password1', name: 'Sari' }, owner);
    const cashier = sid(await call('POST', '/auth/login', { email: cashierEmail, password: 'password1' }));
    const teh = ((await json(call('POST', '/catalog/products', { name: 'Es teh', price: 5000, categoryId: null }, owner))).id) as string;
    const sell = (payment: object) => json(call('POST', '/orders', { items: [{ productId: teh, qty: 2 }], payment }, cashier));

    expect(await json(call('GET', '/shifts/current', undefined, cashier))).toBeNull();
    expect(await sell({ method: 'qris' })).toEqual({ error: 'shift_not_open' });
    expect((await call('POST', '/shifts/current/close', { countedCash: 0 }, cashier)).status).toBe(409);

    const opened = await call('POST', '/shifts', { openingCash: 100_000 }, cashier);
    expect(opened.status).toBe(201);
    expect(await opened.json()).toMatchObject({ cashierName: 'Sari', openingCash: 100_000, closedAt: null, difference: null });
    expect(await json(call('POST', '/shifts', { openingCash: 0 }, cashier))).toEqual({ error: 'shift_already_open' });

    await sell({ method: 'cash', paid: 20_000 }); // +10.000 in the drawer after change
    await sell({ method: 'qris' });
    const voided = await sell({ method: 'cash', paid: 10_000 });
    await call('POST', `/orders/${voided.id}/void`, { reason: 'batal' }, owner);

    // The owner's own shift is separate from the cashier's.
    expect(await json(call('GET', '/shifts/current', undefined, owner))).toBeNull();

    const closed = await json(call('POST', '/shifts/current/close', { countedCash: 108_000 }, cashier));
    expect(closed).toMatchObject({ expectedCash: 110_000, countedCash: 108_000, difference: -2_000 });
    expect(closed.closedAt).toBeString();
    expect(await json(call('GET', '/shifts/current', undefined, cashier))).toBeNull();

    expect((await call('GET', '/shifts', undefined, cashier)).status).toBe(403);
    const list = (await (await call('GET', '/shifts', undefined, owner)).json()) as { id: string }[];
    expect(list.map((s) => s.id)).toEqual([closed.id as string]);

    const other = sid(await call('POST', '/auth/signup', { email: email('other'), password: 'password1', name: 'X', tenantName: 'X' }));
    expect(await (await call('GET', '/shifts', undefined, other)).json()).toHaveLength(0);
  }, 30_000);
});
