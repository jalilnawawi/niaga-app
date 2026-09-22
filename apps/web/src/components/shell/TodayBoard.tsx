import { Link } from 'react-router';
import type { Order, Shift } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { shift: Shift | null; orders: Order[] };

const clock = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });

// The kuning board on Beranda: the user's shift and the stand's paid sales today (void excluded).
export function TodayBoard({ shift, orders }: Props) {
  const paid = orders.filter((o) => o.status === 'paid');
  const total = paid.reduce((sum, o) => sum + o.total, 0);
  return (
    <section className="board today" aria-label="Hari ini">
      <div>
        <p>{shift ? `Shift dibuka ${clock.format(new Date(shift.openedAt))}` : 'Shift belum dibuka'}</p>
        <p className="today-sales">
          {paid.length} transaksi · <span className="num">{rupiah.format(total)}</span> hari ini
        </p>
      </div>
      <Link to={shift ? '/jual' : '/shift'} className="button primary">
        {shift ? 'Mulai jual' : 'Buka shift'}
      </Link>
    </section>
  );
}
