import { z } from 'zod';
import type { Me } from './auth.dto';
import { signupSchema } from './auth.dto';

export const createCashierSchema = signupSchema.pick({ email: true, password: true, name: true });

export const updateUserSchema = z
  .object({ active: z.boolean(), password: signupSchema.shape.password })
  .partial()
  .refine((v) => Object.keys(v).length > 0);

export type CreateCashier = z.infer<typeof createCashierSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type User = Omit<Me, 'tenant'> & { active: boolean };
