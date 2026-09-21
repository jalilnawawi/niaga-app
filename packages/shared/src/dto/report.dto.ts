import { z } from 'zod';

const DAY_MS = 86_400_000;

// Business dates (YYYY-MM-DD, Asia/Jakarta), both inclusive, at most a year.
export const salesReportQuerySchema = z
  .object({ from: z.iso.date(), to: z.iso.date() })
  .refine((q) => q.from <= q.to, 'Tanggal awal harus sebelum tanggal akhir.')
  .refine((q) => Date.parse(q.to) - Date.parse(q.from) < 366 * DAY_MS, 'Rentang maksimal 366 hari.');

export type SalesReportQuery = z.infer<typeof salesReportQuerySchema>;

// Paid orders only; voided sales are excluded everywhere. Money in rupiah.
export type SalesReport = {
  days: { date: string; orders: number; total: number; cash: number; qris: number }[];
  products: { productId: string; name: string; qty: number; total: number }[];
  cashiers: { cashierId: string; name: string; orders: number; total: number }[];
};
