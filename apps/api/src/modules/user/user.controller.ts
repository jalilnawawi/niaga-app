import { Hono } from 'hono';
import { createCashierSchema, updateUserSchema, idParamSchema } from '@niaga/shared';
import type { Env } from '../../env';
import { validate } from '../../lib/validate';
import { requireAuth, requireRole } from '../auth/auth.middleware';
import * as userService from './user.service';

export const userController = new Hono<Env>()
  .use(requireAuth, requireRole('owner'))
  .get('/', async (c) => c.json(await userService.listUsers(c.var.db, c.var.user.tenant.id)))
  .post('/', validate('json', createCashierSchema), async (c) =>
    c.json(await userService.createCashier(c.var.db, c.var.user.tenant.id, c.req.valid('json')), 201),
  )
  .patch('/:id', validate('param', idParamSchema), validate('json', updateUserSchema), async (c) =>
    c.json(await userService.updateCashier(c.var.db, c.var.user.tenant.id, c.req.valid('param').id, c.req.valid('json'))),
  );
