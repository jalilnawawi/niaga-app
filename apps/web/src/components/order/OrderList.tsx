import type { Order } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { orders: Order[]; onShow: (order: Order) => void; onVoid?: (order: Order) => void };

const time = new Intl.DateTimeFormat('id-ID', { timeStyle: 'short', timeZone: 'Asia/Jakarta' });

export function OrderList({ orders, onShow, onVoid }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Jam</th>
            <th scope="col">Kasir</th>
            <th scope="col">Metode</th>
            <th scope="col" className="num">Total</th>
            <th scope="col">Status</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className={o.status === 'void' ? 'off' : undefined}>
              <td>#{o.number}</td>
              <td>{time.format(new Date(o.createdAt))}</td>
              <td>{o.cashierName}</td>
              <td>{o.paymentMethod === 'cash' ? 'Tunai' : 'QRIS'}</td>
              <td className="num">{o.status === 'void' ? <s>{rupiah.format(o.total)}</s> : rupiah.format(o.total)}</td>
              <td className={o.status === 'void' ? 'bad' : undefined}>{o.status === 'void' ? `Void: ${o.voidReason}` : 'Lunas'}</td>
              <td className="actions">
                <button type="button" onClick={() => onShow(o)}>
                  Struk
                </button>
                {onVoid && o.status === 'paid' && (
                  <button type="button" className="danger" onClick={() => onVoid(o)}>
                    Void
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
