import type { FormEvent } from 'react';
import type { Category, CreateProduct, Product } from '@niaga/shared';

type Props = {
  categories: Category[];
  // Set when editing; the parent should key this form by product id so defaults refresh.
  product?: Product;
  onSubmit: (values: CreateProduct) => Promise<boolean>;
  onCancel?: () => void;
};

export function ProductForm({ categories, product, onSubmit, onCancel }: Props) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get('name')),
      price: Number(data.get('price')),
      categoryId: String(data.get('categoryId')) || null,
    };
    if ((await onSubmit(values)) && !product) form.reset();
  }

  return (
    <form onSubmit={submit} aria-label={product ? `Ubah ${product.name}` : 'Tambah produk'}>
      <label>
        Nama produk <input name="name" defaultValue={product?.name} required maxLength={100} autoComplete="off" />
      </label>
      <label>
        Harga (Rp) <input name="price" type="number" defaultValue={product?.price} required min={0} max={100_000_000} step={1} />
      </label>
      <label>
        Kategori{' '}
        <select name="categoryId" defaultValue={product?.categoryId ?? ''}>
          <option value="">Tanpa kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">{product ? 'Simpan produk' : 'Tambah produk'}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Batal
        </button>
      )}
    </form>
  );
}
