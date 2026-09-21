import type { Category, Product } from '@niaga/shared';

type Props = {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onToggleActive: (product: Product) => void;
};

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function ProductTable({ products, categories, onEdit, onToggleActive }: Props) {
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? '—';

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Nama</th>
          <th scope="col">Harga</th>
          <th scope="col">Kategori</th>
          <th scope="col">Status</th>
          <th scope="col">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{rupiah.format(p.price)}</td>
            <td>{categoryName(p.categoryId)}</td>
            <td>{p.active ? 'Aktif' : 'Nonaktif'}</td>
            <td>
              <button type="button" onClick={() => onEdit(p)}>
                Ubah
              </button>
              <button type="button" onClick={() => onToggleActive(p)}>
                {p.active ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
