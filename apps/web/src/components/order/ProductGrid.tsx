import type { Product } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { products: Product[]; onAdd: (product: Product) => void };

export function ProductGrid({ products, onAdd }: Props) {
  if (products.length === 0) return <p>Belum ada produk aktif.</p>;
  return (
    <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
      {products.map((p) => (
        <li key={p.id}>
          <button type="button" onClick={() => onAdd(p)} style={{ width: '100%', minHeight: '4rem' }}>
            {p.name}
            <br />
            {rupiah.format(p.price)}
          </button>
        </li>
      ))}
    </ul>
  );
}
