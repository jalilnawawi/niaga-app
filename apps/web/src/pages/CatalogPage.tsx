import { useEffect, useState } from 'react';
import type { Category, CreateProduct, Product } from '@niaga/shared';
import { categorySchema, createProductSchema, updateProductSchema } from '@niaga/shared';
import * as catalogApi from '../api/catalog.api';
import { errorMessage } from '../api/error-message';
import { CategoryList } from '../components/catalog/CategoryList';
import { ProductForm } from '../components/catalog/ProductForm';
import { ProductTable } from '../components/catalog/ProductTable';
import { useAction } from '../hooks/use-action';

export function CatalogPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const { error, notice, setError, run } = useAction();

  useEffect(() => {
    Promise.all([catalogApi.listCategories(), catalogApi.listProducts()])
      .then(([c, p]) => {
        setCategories(c);
        setProducts(p);
      })
      .catch((e: unknown) => setError(errorMessage(e)));
  }, [setError]);

  const replaceProduct = (product: Product) => setProducts((prev) => prev?.map((p) => (p.id === product.id ? product : p)) ?? null);

  const createCategory = (name: string) =>
    run(async () => {
      const category = await catalogApi.createCategory(categorySchema.parse({ name }));
      setCategories((prev) => [...(prev ?? []), category]);
    }, 'Kategori ditambahkan.');

  const renameCategory = (id: string, name: string) =>
    run(async () => {
      const category = await catalogApi.updateCategory(id, categorySchema.parse({ name }));
      setCategories((prev) => prev?.map((c) => (c.id === id ? category : c)) ?? null);
    }, 'Kategori diubah.');

  const deleteCategory = (id: string) =>
    run(async () => {
      await catalogApi.deleteCategory(id);
      setCategories((prev) => prev?.filter((c) => c.id !== id) ?? null);
    }, 'Kategori dihapus.');

  const createProduct = (values: CreateProduct) =>
    run(async () => {
      const product = await catalogApi.createProduct(createProductSchema.parse(values));
      setProducts((prev) => [...(prev ?? []), product]);
    }, 'Produk ditambahkan.');

  const saveProduct = (id: string, values: CreateProduct) =>
    run(async () => {
      replaceProduct(await catalogApi.updateProduct(id, updateProductSchema.parse(values)));
      setEditing(null);
    }, 'Produk disimpan.');

  const toggleActive = (product: Product) =>
    run(
      async () => replaceProduct(await catalogApi.updateProduct(product.id, { active: !product.active })),
      product.active ? 'Produk dinonaktifkan.' : 'Produk diaktifkan.',
    );

  return (
    <main className="page">
      <h1>Katalog</h1>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {(categories === null || products === null) && !error && <p>Memuat…</p>}
      {categories && products && (
        <div className="split side-first">
          <CategoryList categories={categories} onCreate={createCategory} onRename={renameCategory} onDelete={deleteCategory} />
          <section className="card" aria-labelledby="products-heading">
            <h2 id="products-heading">Produk</h2>
            {editing ? (
              <ProductForm
                key={editing.id}
                categories={categories}
                product={editing}
                onSubmit={(values) => saveProduct(editing.id, values)}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <ProductForm categories={categories} onSubmit={createProduct} />
            )}
            {products.length === 0 ? (
              <p>Belum ada produk. Tambahkan produk pertama di formulir di atas.</p>
            ) : (
              <ProductTable products={products} categories={categories} onEdit={setEditing} onToggleActive={toggleActive} />
            )}
          </section>
        </div>
      )}
    </main>
  );
}
