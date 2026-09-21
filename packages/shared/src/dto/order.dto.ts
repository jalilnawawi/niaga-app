import { z } from 'zod';

const cartItemSchema = z.object({ productId: z.uuid(), qty: z.number().int().min(1).max(999) });

const paymentSchema = z.discriminatedUnion('method', [
  // Rupiah handed over by the customer.
  z.object({ method: z.literal('cash'), paid: z.number().int().min(0).max(1_000_000_000_000) }),
  // Static QRIS: the cashier checks the customer's banking app and confirms; paid equals total.
  z.object({ method: z.literal('qris') }),
]);

export const createOrderSchema = z.object({
  items: z
    .array(cartItemSchema)
    .min(1)
    .max(100)
    .refine((items) => new Set(items.map((i) => i.productId)).size === items.length, 'Produk dobel di keranjang.'),
  payment: paymentSchema,
});

export const voidOrderSchema = z.object({ reason: z.string().trim().min(1).max(200) });

export type CartItem = z.infer<typeof cartItemSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type VoidOrder = z.infer<typeof voidOrderSchema>;

export type OrderItem = { productId: string; name: string; price: number; qty: number };

export type Order = {
  id: string;
  // Receipt number, restarts at 1 each businessDate (YYYY-MM-DD, Asia/Jakarta).
  number: number;
  businessDate: string;
  createdAt: string;
  cashierName: string;
  paymentMethod: 'cash' | 'qris';
  total: number;
  paid: number;
  change: number;
  status: 'paid' | 'void';
  voidReason: string | null;
  items: OrderItem[];
};
