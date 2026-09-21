import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sql } from 'drizzle-orm';
import type { Health } from '@niaga/shared';
import { createDb } from './db/client';
import type { Env } from './env';

const app = new Hono<Env>()
  .use('*', (c, next) =>
    cors({ origin: c.env.WEB_ORIGIN, credentials: true })(c, next),
  )
  .get('/health', (c) =>
    c.json<Health>({ status: 'ok', time: new Date().toISOString() }),
  )
  .get('/health/db', async (c) => {
    const db = createDb(c.env.DATABASE_URL);
    await db.execute(sql`select 1`);
    return c.json({ status: 'ok' as const });
  });

export type AppType = typeof app;
export default app;
