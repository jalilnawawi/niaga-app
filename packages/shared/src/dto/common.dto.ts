import { z } from 'zod';

export const idParamSchema = z.object({ id: z.uuid() });

// An amount of money in whole rupiah.
export const rupiahSchema = z.number().int().min(0).max(1_000_000_000_000);
