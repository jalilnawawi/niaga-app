import type { CartLine } from '../../types/cart';
import { rupiah } from '../ui/rupiah';

type Props = { lines: CartLine[]; onQty: (productId: string, qty: number) => void };

export function Cart({ lines, onQty }: Props) {
  if (lines.length === 0) return <p className="muted">Keranjang kosong. Pilih produk.</p>;
  return (
    <ul className="cart-lines">
      {lines.map(({ product, qty }) => (
        <li key={product.id}>
          <span>{product.name}</span>
          <span className="stepper">
            <button type="button" onClick={() => onQty(product.id, qty - 1)} aria-label={`Kurangi ${product.name}`}>
              −
            </button>
            {qty}
            <button type="button" onClick={() => onQty(product.id, qty + 1)} aria-label={`Tambah ${product.name}`} disabled={qty >= 999}>
              +
            </button>
          </span>
          <span className="num">{rupiah.format(product.price * qty)}</span>
        </li>
      ))}
    </ul>
  );
}
