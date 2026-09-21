import type { CartLine } from '../../types/cart';
import { rupiah } from '../ui/rupiah';

type Props = { lines: CartLine[]; onQty: (productId: string, qty: number) => void };

export function Cart({ lines, onQty }: Props) {
  if (lines.length === 0) return <p>Keranjang kosong. Pilih produk.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Produk</th>
          <th scope="col">Qty</th>
          <th scope="col">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {lines.map(({ product, qty }) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>
              <button type="button" onClick={() => onQty(product.id, qty - 1)} aria-label={`Kurangi ${product.name}`}>
                −
              </button>{' '}
              {qty}{' '}
              <button type="button" onClick={() => onQty(product.id, qty + 1)} aria-label={`Tambah ${product.name}`} disabled={qty >= 999}>
                +
              </button>
            </td>
            <td>{rupiah.format(product.price * qty)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
