import type { Product } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { products: Product[]; qtyOf: (productId: string) => number; onAdd: (product: Product) => void };

export function ProductGrid({ products, qtyOf, onAdd }: Props) {
  return (
    <ul className="product-grid">
      {products.map((p) => {
        const qty = qtyOf(p.id);
        return (
          <li key={p.id}>
            <button type="button" onClick={() => onAdd(p)}>
              {p.name}
              <span className="price">
                {rupiah.format(p.price)}
                {qty > 0 && <b aria-label={`${qty} di keranjang`}>{qty}</b>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
