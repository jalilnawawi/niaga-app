import { z } from 'zod';

export const healthSchema = z.object({
  status: z.literal('ok'),
  time: z.iso.datetime(),
});

export type Health = z.infer<typeof healthSchema>;
