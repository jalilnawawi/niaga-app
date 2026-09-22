import type { CartLine } from '../../types/cart';
import { rupiah } from '../ui/rupiah';

type Props = { lines: CartLine[]; onQty: (productId: string, qty: number) => void };

export function Cart({ lines, onQty }: Props) {
  if (lines.length === 0) return <p className="muted">Nota masih kosong. Pilih produk.</p>;
  return (
    <ul className="cart-lines">
      {/* Printed column heads of the nota; each line already names its own parts for screen readers. */}
      <li className="cart-head" aria-hidden="true">
        <span>Barang</span>
        <span className="num">Jumlah</span>
      </li>
      {lines.map(({ product, qty }) => (
        <li key={product.id}>
          <span className="line-name">{product.name}</span>
          <span className="stepper">
            <button type="button" onClick={() => onQty(product.id, qty - 1)} aria-label={`Kurangi ${product.name}`}>
              −
            </button>
            <output aria-label={`Jumlah ${product.name}`}>{qty}</output>
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
