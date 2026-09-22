import type { Category, Product } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onToggleActive: (product: Product) => void;
};

export function ProductTable({ products, categories, onEdit, onToggleActive }: Props) {
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? '—';

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Nama</th>
            <th scope="col" className="num">Harga</th>
            <th scope="col">Kategori</th>
            <th scope="col">Status</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className={p.active ? undefined : 'off'}>
              <td>{p.name}</td>
              <td className="num">{rupiah.format(p.price)}</td>
              <td>{categoryName(p.categoryId)}</td>
              <td>{p.active ? 'Aktif' : 'Nonaktif'}</td>
              <td className="actions">
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
    </div>
  );
}
