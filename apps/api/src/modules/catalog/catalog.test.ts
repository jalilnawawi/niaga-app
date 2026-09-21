import { describe, expect, test } from 'bun:test';
import app from '../../index';

// Needs the docker compose DB with migrations applied: DATABASE_URL=... bun test
const DATABASE_URL = process.env.DATABASE_URL;
describe.skipIf(!DATABASE_URL)('catalog', () => {
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

  test('owner manages categories and products, cashier only reads', async () => {
    const owner = await signup('owner');
    const cashierEmail = email('cashier');
    await call('POST', '/users', { email: cashierEmail, password: 'password1', name: 'Sari' }, owner);
    const cashier = sid(await call('POST', '/auth/login', { email: cashierEmail, password: 'password1' }));

    const created = await call('POST', '/catalog/categories', { name: '  Minuman ' }, owner);
    expect(created.status).toBe(201);
    const category = (await created.json()) as { id: string };
    expect(category).toMatchObject({ name: 'Minuman' });

    const res = await call('POST', '/catalog/products', { name: 'Es teh', price: 5000, categoryId: category.id }, owner);
    expect(res.status).toBe(201);
    const product = (await res.json()) as { id: string };
    expect(product).toMatchObject({ name: 'Es teh', price: 5000, categoryId: category.id, active: true });

    expect((await call('POST', '/catalog/products', { name: 'X', price: 1.5, categoryId: null }, owner)).status).toBe(400);
    expect((await call('POST', '/catalog/products', { name: 'X', price: -1, categoryId: null }, owner)).status).toBe(400);

    // Partial update keeps the other fields, including `active`.
    const deactivated = await call('PATCH', `/catalog/products/${product.id}`, { active: false }, owner);
    expect(await deactivated.json()).toMatchObject({ active: false, price: 5000 });
    expect(await (await call('PATCH', `/catalog/products/${product.id}`, { price: 6000 }, owner)).json()).toMatchObject({ active: false });

    // A used category cannot be deleted; an unused one can.
    expect((await call('DELETE', `/catalog/categories/${category.id}`, undefined, owner)).status).toBe(409);
    await call('PATCH', `/catalog/products/${product.id}`, { categoryId: null }, owner);
    expect((await call('DELETE', `/catalog/categories/${category.id}`, undefined, owner)).status).toBe(200);
    expect((await call('DELETE', `/catalog/categories/${category.id}`, undefined, owner)).status).toBe(404);

    expect(await (await call('GET', '/catalog/products', undefined, cashier)).json()).toHaveLength(1);
    expect((await call('POST', '/catalog/categories', { name: 'Makanan' }, cashier)).status).toBe(403);
    expect((await call('PATCH', `/catalog/products/${product.id}`, { price: 1 }, cashier)).status).toBe(403);
  }, 30_000);

  test('tenants cannot see or use each other catalog', async () => {
    const a = await signup('a');
    const b = await signup('b');
    const category = (await (await call('POST', '/catalog/categories', { name: 'A' }, a)).json()) as { id: string };
    const product = (await (await call('POST', '/catalog/products', { name: 'A', price: 1, categoryId: null }, a)).json()) as { id: string };

    expect(await (await call('GET', '/catalog/categories', undefined, b)).json()).toHaveLength(0);
    expect((await call('POST', '/catalog/products', { name: 'B', price: 1, categoryId: category.id }, b)).status).toBe(400);
    expect((await call('PATCH', `/catalog/products/${product.id}`, { price: 2 }, b)).status).toBe(404);
    expect((await call('PATCH', `/catalog/categories/${category.id}`, { name: 'B' }, b)).status).toBe(404);
    expect((await call('DELETE', `/catalog/categories/${category.id}`, undefined, b)).status).toBe(404);
  }, 30_000);
});
