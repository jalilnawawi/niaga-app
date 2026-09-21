import { describe, expect, test } from 'bun:test';
import app from '../index';
import { hashPassword, verifyPassword } from './password';

test('password hash round-trips', async () => {
  const hash = await hashPassword('correct horse');
  expect(await verifyPassword('correct horse', hash)).toBe(true);
  expect(await verifyPassword('wrong horse', hash)).toBe(false);
});

// Needs the docker compose DB with migrations applied: DATABASE_URL=... bun test
const DATABASE_URL = process.env.DATABASE_URL;
describe.skipIf(!DATABASE_URL)('auth flow', () => {
  const env = { DATABASE_URL: DATABASE_URL!, WEB_ORIGIN: 'http://localhost:5173' };
  const email = `owner-${crypto.randomUUID()}@test.local`;
  const post = (path: string, body: unknown, cookie = '') =>
    app.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: env.WEB_ORIGIN, Cookie: cookie },
      body: JSON.stringify(body),
    }, env);
  const sid = (res: Response) => res.headers.get('Set-Cookie')!.split(';')[0]!;

  test('signup, me, logout, login', async () => {
    const signup = await post('/auth/signup', { email: email.toUpperCase(), password: 'password1', name: 'Budi', tenantName: 'Bakso Budi' });
    expect(signup.status).toBe(201);

    const me = await app.request('/auth/me', { headers: { Cookie: sid(signup) } }, env);
    expect(await me.json()).toMatchObject({ email, role: 'owner', tenant: { name: 'Bakso Budi' } });

    expect((await post('/auth/signup', { email, password: 'password1', name: 'X', tenantName: 'X' })).status).toBe(409);

    await post('/auth/logout', {}, sid(signup));
    expect((await app.request('/auth/me', { headers: { Cookie: sid(signup) } }, env)).status).toBe(401);

    expect((await post('/auth/login', { email, password: 'wrongpass' })).status).toBe(401);
    const login = await post('/auth/login', { email, password: 'password1' });
    expect((await app.request('/auth/me', { headers: { Cookie: sid(login) } }, env)).status).toBe(200);
  });

  // Cross-site JSON posts need a CORS preflight; form posts don't, so csrf() must block them.
  test('rejects cross-site form post', async () => {
    const res = await app.request('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'https://evil.example' },
      body: '',
    }, env);
    expect(res.status).toBe(403);
  });
});
