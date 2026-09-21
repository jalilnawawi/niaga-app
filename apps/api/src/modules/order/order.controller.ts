import { Hono } from 'hono';
import { createOrderSchema, idParamSchema, voidOrderSchema } from '@niaga/shared';
import type { Env } from '../../env';
import { validate } from '../../lib/validate';
import { requireAuth, requireRole } from '../auth/auth.middleware';
import * as orderService from './order.service';

export const orderController = new Hono<Env>()
  .use(requireAuth)
  // Today's orders (Asia/Jakarta); date ranges come with reports.
  .get('/', async (c) => c.json(await orderService.listTodayOrders(c.var.db, c.var.user.tenant.id)))
  .post('/', validate('json', createOrderSchema), async (c) =>
    c.json(await orderService.createOrder(c.var.db, c.var.user.tenant.id, c.var.user.id, c.req.valid('json')), 201),
  )
  .post('/:id/void', requireRole('owner'), validate('param', idParamSchema), validate('json', voidOrderSchema), async (c) =>
    c.json(
      await orderService.voidOrder(c.var.db, c.var.user.tenant.id, c.var.user.id, c.req.valid('param').id, c.req.valid('json')),
    ),
  );
