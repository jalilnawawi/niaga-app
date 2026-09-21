import { Hono } from 'hono';
import { closeShiftSchema, openShiftSchema } from '@niaga/shared';
import type { Env } from '../../env';
import { validate } from '../../lib/validate';
import { requireAuth, requireRole } from '../auth/auth.middleware';
import * as shiftService from './shift.service';

// A user only opens and closes their own shift; the owner sees everyone's.
export const shiftController = new Hono<Env>()
  .use(requireAuth)
  .get('/', requireRole('owner'), async (c) => c.json(await shiftService.listShifts(c.var.db, c.var.user.tenant.id)))
  .get('/current', async (c) => c.json(await shiftService.getCurrentShift(c.var.db, c.var.user.tenant.id, c.var.user.id)))
  .post('/', validate('json', openShiftSchema), async (c) =>
    c.json(await shiftService.openShift(c.var.db, c.var.user.tenant.id, c.var.user.id, c.req.valid('json')), 201),
  )
  .post('/current/close', validate('json', closeShiftSchema), async (c) =>
    c.json(await shiftService.closeShift(c.var.db, c.var.user.tenant.id, c.var.user.id, c.req.valid('json'))),
  );
