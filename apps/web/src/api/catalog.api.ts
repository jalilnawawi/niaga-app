import type { CategoryInput, CreateProduct, UpdateProduct } from '@niaga/shared';
import { client, unwrap } from './client';

const catalog = client.catalog;

export const listCategories = () => catalog.categories.$get().then(unwrap);

export const createCategory = (json: CategoryInput) => catalog.categories.$post({ json }).then(unwrap);

export const updateCategory = (id: string, json: CategoryInput) =>
  catalog.categories[':id'].$patch({ param: { id }, json }).then(unwrap);

export const deleteCategory = (id: string) => catalog.categories[':id'].$delete({ param: { id } }).then(unwrap);

export const listProducts = () => catalog.products.$get().then(unwrap);

export const createProduct = (json: CreateProduct) => catalog.products.$post({ json }).then(unwrap);

export const updateProduct = (id: string, json: UpdateProduct) =>
  catalog.products[':id'].$patch({ param: { id }, json }).then(unwrap);
