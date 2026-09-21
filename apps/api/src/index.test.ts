import { describe, expect, test } from 'bun:test';
import { healthSchema } from '@niaga/shared';
import app from './index';

// Any well-formed URL: neon() validates it eagerly but only connects on the first query.
const env = { DATABASE_URL: 'postgres://u:p@localhost/db', WEB_ORIGIN: 'http://localhost:5173' };

describe('GET /health', () => {
  test('returns ok', async () => {
    const res = await app.request('/health', {}, env);
    expect(res.status).toBe(200);
    expect(healthSchema.safeParse(await res.json()).success).toBe(true);
  });

  test('allows only the web origin', async () => {
    const allowed = await app.request('/health', { headers: { Origin: env.WEB_ORIGIN } }, env);
    expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe(env.WEB_ORIGIN);

    const other = await app.request('/health', { headers: { Origin: 'https://evil.example' } }, env);
    expect(other.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});
