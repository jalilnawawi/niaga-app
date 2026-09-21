import { Hono } from 'hono';
import { salesReportQuerySchema } from '@niaga/shared';
import type { Env } from '../../env';
import { validate } from '../../lib/validate';
import { requireAuth, requireRole } from '../auth/auth.middleware';
import * as reportService from './report.service';

export const reportController = new Hono<Env>()
  .use(requireAuth, requireRole('owner'))
  .get('/sales', validate('query', salesReportQuerySchema), async (c) =>
    c.json(await reportService.getSalesReport(c.var.db, c.var.user.tenant.id, c.req.valid('query'))),
  );
