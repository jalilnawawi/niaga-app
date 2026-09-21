import type { Order } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { order: Order; tenantName: string };

const time = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

// The .receipt class is the only thing index.html's print CSS leaves visible.
export function Receipt({ order, tenantName }: Props) {
  return (
    <section className="receipt" aria-label={`Struk #${order.number}`}>
      <h2>{tenantName}</h2>
      <p>
        Struk #{order.number} · {time.format(new Date(order.createdAt))}
        <br />
        Kasir: {order.cashierName}
      </p>
      <table>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.productId}>
              <td>
                {i.name} × {i.qty}
              </td>
              <td>{rupiah.format(i.price * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Total {rupiah.format(order.total)}
        <br />
        {order.paymentMethod === 'cash' ? `Tunai ${rupiah.format(order.paid)} · Kembali ${rupiah.format(order.change)}` : 'QRIS'}
      </p>
      {order.status === 'void' && <p>VOID: {order.voidReason}</p>}
    </section>
  );
}
