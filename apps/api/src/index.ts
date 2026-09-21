import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { sql } from 'drizzle-orm';
import type { Health } from '@niaga/shared';
import { createDb } from './db/client';
import type { Env } from './env';
import { AppError } from './lib/errors';
import { authController } from './modules/auth/auth.controller';
import { catalogController } from './modules/catalog/catalog.controller';
import { orderController } from './modules/order/order.controller';
import { shiftController } from './modules/shift/shift.controller';
import { userController } from './modules/user/user.controller';

const app = new Hono<Env>()
  .use('*', (c, next) =>
    cors({ origin: c.env.WEB_ORIGIN, credentials: true })(c, next),
  )
  // Cookie auth: reject cross-site form posts by Origin.
  .use('*', (c, next) => csrf({ origin: c.env.WEB_ORIGIN })(c, next))
  .use('*', async (c, next) => {
    c.set('db', createDb(c.env.DATABASE_URL));
    await next();
  })
  .get('/health', (c) =>
    c.json<Health>({ status: 'ok', time: new Date().toISOString() }),
  )
  .get('/health/db', async (c) => {
    await c.var.db.execute(sql`select 1`);
    return c.json({ status: 'ok' as const });
  })
  .route('/auth', authController)
  .route('/users', userController)
  .route('/catalog', catalogController)
  .route('/orders', orderController)
  .route('/shifts', shiftController);

app.onError((err, c) => {
  if (err instanceof AppError) return c.json({ error: err.code }, err.status);
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ error: 'internal' }, 500);
});

export type AppType = typeof app;
export default app;
