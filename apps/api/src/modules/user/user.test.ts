import { describe, expect, test } from 'bun:test';
import app from '../../index';

// Needs the docker compose DB with migrations applied: DATABASE_URL=... bun test
const DATABASE_URL = process.env.DATABASE_URL;
describe.skipIf(!DATABASE_URL)('cashier management', () => {
  const env = { DATABASE_URL: DATABASE_URL!, WEB_ORIGIN: 'http://localhost:5173' };
  const call = (method: string, path: string, body?: unknown, cookie = '') =>
    app.request(path, {
      method,
      headers: { 'Content-Type': 'application/json', Origin: env.WEB_ORIGIN, Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    }, env);
  const sid = (res: Response) => res.headers.get('Set-Cookie')!.split(';')[0]!;
  const email = (who: string) => `${who}-${crypto.randomUUID()}@test.local`;

  test('owner creates, deactivates and resets a cashier', async () => {
    const owner = sid(await call('POST', '/auth/signup', { email: email('owner'), password: 'password1', name: 'Budi', tenantName: 'Bakso Budi' }));
    const cashierEmail = email('cashier');

    const created = await call('POST', '/users', { email: cashierEmail, password: 'password1', name: 'Sari' }, owner);
    expect(created.status).toBe(201);
    const cashier = (await created.json()) as { id: string };
    expect(cashier).toMatchObject({ email: cashierEmail, role: 'cashier', active: true });
    expect((await call('POST', '/users', { email: cashierEmail, password: 'password1', name: 'X' }, owner)).status).toBe(409);

    const list = (await (await call('GET', '/users', undefined, owner)).json()) as unknown[];
    expect(list).toHaveLength(2);

    // Cashier session works, but owner-only routes are forbidden.
    const cashierSid = sid(await call('POST', '/auth/login', { email: cashierEmail, password: 'password1' }));
    expect((await call('GET', '/users', undefined, cashierSid)).status).toBe(403);

    // Deactivation signs the cashier out and blocks login.
    expect((await call('PATCH', `/users/${cashier.id}`, { active: false }, owner)).status).toBe(200);
    expect((await call('GET', '/auth/me', undefined, cashierSid)).status).toBe(401);
    expect((await call('POST', '/auth/login', { email: cashierEmail, password: 'password1' })).status).toBe(403);

    await call('PATCH', `/users/${cashier.id}`, { active: true, password: 'password2' }, owner);
    expect((await call('POST', '/auth/login', { email: cashierEmail, password: 'password2' })).status).toBe(200);

    expect((await call('PATCH', `/users/${cashier.id}`, {}, owner)).status).toBe(400);
    expect((await call('PATCH', '/users/not-a-uuid', { active: false }, owner)).status).toBe(400);
  }, 30_000); // Many PBKDF2 hashes.

  test('owner cannot touch another tenant or the owner account', async () => {
    const a = await call('POST', '/auth/signup', { email: email('a'), password: 'password1', name: 'A', tenantName: 'A' });
    const b = sid(await call('POST', '/auth/signup', { email: email('b'), password: 'password1', name: 'B', tenantName: 'B' }));
    const aMe = (await (await call('GET', '/auth/me', undefined, sid(a))).json()) as { id: string };

    expect((await call('PATCH', `/users/${aMe.id}`, { active: false }, b)).status).toBe(404);
    expect((await call('PATCH', `/users/${aMe.id}`, { active: false }, sid(a))).status).toBe(403);
  }, 30_000);
});
