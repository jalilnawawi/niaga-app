import type { Order } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { orders: Order[]; onShow: (order: Order) => void; onVoid?: (order: Order) => void };

const time = new Intl.DateTimeFormat('id-ID', { timeStyle: 'short', timeZone: 'Asia/Jakarta' });

export function OrderList({ orders, onShow, onVoid }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col">Jam</th>
          <th scope="col">Kasir</th>
          <th scope="col">Metode</th>
          <th scope="col">Total</th>
          <th scope="col">Status</th>
          <th scope="col">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>#{o.number}</td>
            <td>{time.format(new Date(o.createdAt))}</td>
            <td>{o.cashierName}</td>
            <td>{o.paymentMethod === 'cash' ? 'Tunai' : 'QRIS'}</td>
            <td>{rupiah.format(o.total)}</td>
            <td>{o.status === 'void' ? `Void: ${o.voidReason}` : 'Lunas'}</td>
            <td>
              <button type="button" onClick={() => onShow(o)}>
                Struk
              </button>
              {onVoid && o.status === 'paid' && (
                <button type="button" onClick={() => onVoid(o)}>
                  Void
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
