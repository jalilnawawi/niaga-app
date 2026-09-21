import type { Category, CategoryInput, CreateProduct, Product, UpdateProduct } from '@niaga/shared';
import type { Db } from '../../db/client';
import { AppError } from '../../lib/errors';
import type { CategoryRow, ProductRow } from './catalog.model';
import * as repo from './catalog.repository';

const toCategory = ({ id, name }: CategoryRow): Category => ({ id, name });
const toProduct = ({ id, name, price, categoryId, active }: ProductRow): Product => ({ id, name, price, categoryId, active });

export const listCategories = async (db: Db, tenantId: string) => (await repo.listCategories(db, tenantId)).map(toCategory);

export const createCategory = async (db: Db, tenantId: string, input: CategoryInput) =>
  toCategory(await repo.insertCategory(db, { tenantId, ...input }));

export async function updateCategory(db: Db, tenantId: string, id: string, input: CategoryInput) {
  const category = await repo.updateCategory(db, tenantId, id, input);
  if (!category) throw new AppError(404, 'category_not_found');
  return toCategory(category);
}

export async function deleteCategory(db: Db, tenantId: string, id: string) {
  if (await repo.deleteUnusedCategory(db, tenantId, id)) return;
  if (!(await repo.findCategoryById(db, tenantId, id))) throw new AppError(404, 'category_not_found');
  throw new AppError(409, 'category_in_use');
}

export const listProducts = async (db: Db, tenantId: string) => (await repo.listProducts(db, tenantId)).map(toProduct);

// For selling: inactive and other tenants' products are left out.
export const getActiveProducts = async (db: Db, tenantId: string, ids: string[]) =>
  (await repo.findActiveProducts(db, tenantId, ids)).map(toProduct);

// The composite FK already blocks other tenants' categories; this turns that into a clean 400 instead of a 500.
async function assertCategory(db: Db, tenantId: string, categoryId: string | null | undefined) {
  if (categoryId && !(await repo.findCategoryById(db, tenantId, categoryId))) throw new AppError(400, 'category_not_found');
}

export async function createProduct(db: Db, tenantId: string, input: CreateProduct) {
  await assertCategory(db, tenantId, input.categoryId);
  return toProduct(await repo.insertProduct(db, { tenantId, ...input }));
}

export async function updateProduct(db: Db, tenantId: string, id: string, input: UpdateProduct) {
  await assertCategory(db, tenantId, input.categoryId);
  const product = await repo.updateProduct(db, tenantId, id, input);
  if (!product) throw new AppError(404, 'product_not_found');
  return toProduct(product);
}
