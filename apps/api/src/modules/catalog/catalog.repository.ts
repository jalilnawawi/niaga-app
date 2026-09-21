import { and, asc, eq, inArray, notExists } from 'drizzle-orm';
import type { Db } from '../../db/client';
import type { CategoryRow, ProductRow } from './catalog.model';
import { categories, products } from './catalog.model';

export const listCategories = (db: Db, tenantId: string) =>
  db.select().from(categories).where(eq(categories.tenantId, tenantId)).orderBy(asc(categories.name));

export async function findCategoryById(db: Db, tenantId: string, id: string) {
  const [category] = await db.select().from(categories).where(and(eq(categories.tenantId, tenantId), eq(categories.id, id)));
  return category;
}

export async function insertCategory(db: Db, values: typeof categories.$inferInsert) {
  const [category] = await db.insert(categories).values(values).returning();
  return category!;
}

export async function updateCategory(db: Db, tenantId: string, id: string, values: Pick<CategoryRow, 'name'>) {
  const [category] = await db
    .update(categories)
    .set(values)
    .where(and(eq(categories.tenantId, tenantId), eq(categories.id, id)))
    .returning();
  return category;
}

// Deletes only when no product uses the category; returns undefined otherwise (or when it does not exist).
export async function deleteUnusedCategory(db: Db, tenantId: string, id: string) {
  const [category] = await db
    .delete(categories)
    .where(
      and(
        eq(categories.tenantId, tenantId),
        eq(categories.id, id),
        notExists(db.select().from(products).where(and(eq(products.tenantId, tenantId), eq(products.categoryId, id)))),
      ),
    )
    .returning();
  return category;
}

export const listProducts = (db: Db, tenantId: string) =>
  db.select().from(products).where(eq(products.tenantId, tenantId)).orderBy(asc(products.name));

export const findActiveProducts = (db: Db, tenantId: string, ids: string[]) =>
  db
    .select()
    .from(products)
    .where(and(eq(products.tenantId, tenantId), eq(products.active, true), inArray(products.id, ids)));

export async function insertProduct(db: Db, values: typeof products.$inferInsert) {
  const [product] = await db.insert(products).values(values).returning();
  return product!;
}

export async function updateProduct(
  db: Db,
  tenantId: string,
  id: string,
  values: Partial<Pick<ProductRow, 'name' | 'price' | 'categoryId' | 'active'>>,
) {
  const [product] = await db
    .update(products)
    .set(values)
    .where(and(eq(products.tenantId, tenantId), eq(products.id, id)))
    .returning();
  return product;
}
