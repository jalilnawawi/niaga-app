import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import type { ZodType } from 'zod';
import { AppError } from './errors';

// zValidator with the app's error shape: invalid input becomes 400 { error: 'invalid_input' } via app.onError.
export const validate = <Target extends keyof ValidationTargets, Schema extends ZodType>(target: Target, schema: Schema) =>
  zValidator(target, schema, (result) => {
    if (!result.success) throw new AppError(400, 'invalid_input');
  });
