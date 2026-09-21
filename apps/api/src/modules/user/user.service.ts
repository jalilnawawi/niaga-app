import type { CreateCashier, UpdateUser, User } from '@niaga/shared';
import type { Db } from '../../db/client';
import { AppError } from '../../lib/errors';
import { hashPassword } from '../../lib/password';
import * as authService from '../auth/auth.service';
import type { UserRow } from './user.model';
import * as repo from './user.repository';

const toUser = ({ id, email, name, role, active }: UserRow): User => ({ id, email, name, role, active });

export const listUsers = async (db: Db, tenantId: string) => (await repo.listUsers(db, tenantId)).map(toUser);

export async function createCashier(db: Db, tenantId: string, input: CreateCashier) {
  const user = await repo.insertUser(db, {
    tenantId,
    email: input.email,
    name: input.name,
    role: 'cashier',
    passwordHash: await hashPassword(input.password),
  });
  // Email is unique across tenants; the constraint decides, insert skipped on conflict.
  if (!user) throw new AppError(409, 'email_taken');
  return toUser(user);
}

// Owners manage cashiers only; the owner account is not editable here.
export async function updateCashier(db: Db, tenantId: string, id: string, input: UpdateUser) {
  const target = await repo.findUserById(db, tenantId, id);
  if (!target) throw new AppError(404, 'user_not_found');
  if (target.role !== 'cashier') throw new AppError(403, 'forbidden');

  const user = await repo.updateUser(db, tenantId, id, {
    active: input.active,
    passwordHash: input.password && (await hashPassword(input.password)),
  });
  await authService.revokeSessions(db, id);
  return toUser(user!);
}
