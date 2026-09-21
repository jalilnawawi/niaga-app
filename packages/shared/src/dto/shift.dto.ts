import { z } from 'zod';
import { rupiahSchema } from './common.dto';

export const openShiftSchema = z.object({ openingCash: rupiahSchema });

export const closeShiftSchema = z.object({ countedCash: rupiahSchema });

export type OpenShift = z.infer<typeof openShiftSchema>;
export type CloseShift = z.infer<typeof closeShiftSchema>;

// expectedCash, countedCash and difference are null while the shift is open.
export type Shift = {
  id: string;
  cashierName: string;
  openingCash: number;
  openedAt: string;
  closedAt: string | null;
  expectedCash: number | null;
  countedCash: number | null;
  // counted - expected: negative means cash is missing.
  difference: number | null;
};
