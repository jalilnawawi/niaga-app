import { Hono } from 'hono';
import { categorySchema, createProductSchema, idParamSchema, updateProductSchema } from '@niaga/shared';
import type { Env } from '../../env';
import { validate } from '../../lib/validate';
import { requireAuth, requireRole } from '../auth/auth.middleware';
import * as catalogService from './catalog.service';

// Every signed-in user reads the catalog (cashiers sell from it); only the owner changes it.
const owner = requireRole('owner');

export const catalogController = new Hono<Env>()
  .use(requireAuth)
  .get('/categories', async (c) => c.json(await catalogService.listCategories(c.var.db, c.var.user.tenant.id)))
  .post('/categories', owner, validate('json', categorySchema), async (c) =>
    c.json(await catalogService.createCategory(c.var.db, c.var.user.tenant.id, c.req.valid('json')), 201),
  )
  .patch('/categories/:id', owner, validate('param', idParamSchema), validate('json', categorySchema), async (c) =>
    c.json(await catalogService.updateCategory(c.var.db, c.var.user.tenant.id, c.req.valid('param').id, c.req.valid('json'))),
  )
  .delete('/categories/:id', owner, validate('param', idParamSchema), async (c) => {
    await catalogService.deleteCategory(c.var.db, c.var.user.tenant.id, c.req.valid('param').id);
    return c.json({ ok: true as const });
  })
  .get('/products', async (c) => c.json(await catalogService.listProducts(c.var.db, c.var.user.tenant.id)))
  .post('/products', owner, validate('json', createProductSchema), async (c) =>
    c.json(await catalogService.createProduct(c.var.db, c.var.user.tenant.id, c.req.valid('json')), 201),
  )
  .patch('/products/:id', owner, validate('param', idParamSchema), validate('json', updateProductSchema), async (c) =>
    c.json(await catalogService.updateProduct(c.var.db, c.var.user.tenant.id, c.req.valid('param').id, c.req.valid('json'))),
  );
