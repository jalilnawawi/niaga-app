import { z } from 'zod';

export const categorySchema = z.object({ name: z.string().trim().min(1).max(50) });

const productSchema = z.object({
  name: z.string().trim().min(1).max(100),
  // Rupiah.
  price: z.number().int().min(0).max(100_000_000),
  categoryId: z.uuid().nullable(),
  active: z.boolean(),
});

export const createProductSchema = productSchema.extend({ active: productSchema.shape.active.default(true) });

// Built from the default-free schema so a partial update never resets `active`.
export const updateProductSchema = productSchema.partial().refine((v) => Object.keys(v).length > 0);

export type CategoryInput = z.infer<typeof categorySchema>;
export type CreateProduct = z.input<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

export type Category = CategoryInput & { id: string };
export type Product = z.infer<typeof productSchema> & { id: string };
