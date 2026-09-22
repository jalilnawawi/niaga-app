import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Me, Order, Shift } from '@niaga/shared';
import { errorMessage } from '../api/error-message';
import { listTodayOrders } from '../api/order.api';
import { getCurrentShift } from '../api/shift.api';
import { navLinks } from '../components/shell/nav-links';
import { TodayBoard } from '../components/shell/TodayBoard';

type Props = { me: Me; onLogout: () => void };

const longDate = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'full' });

export function HomePage({ me, onLogout }: Props) {
  const [today, setToday] = useState<{ shift: Shift | null; orders: Order[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCurrentShift(), listTodayOrders()])
      .then(([shift, orders]) => setToday({ shift, orders }))
      .catch((e: unknown) => setError(errorMessage(e)));
  }, []);

  return (
    <main className="page">
      <header className="page-head">
        <h1>{me.tenant.name}</h1>
        <p className="muted">{longDate.format(new Date())}</p>
      </header>
      {error && <p role="alert">{error}</p>}
      {!today && !error && <p>Memuat status hari ini…</p>}
      {today && <TodayBoard shift={today.shift} orders={today.orders} />}
      <ul className="tiles">
        {navLinks
          .filter((t) => !t.owner || me.role === 'owner')
          .map((t) => (
            <li key={t.to}>
              <Link to={t.to}>
                {t.label}
                <span>{t.hint}</span>
              </Link>
            </li>
          ))}
      </ul>
      {/* The rail carries user and Keluar on tablet; the phone bottom bar has no room for them. */}
      <div className="phone-only account">
        <p className="muted">
          Masuk sebagai {me.name} ({me.role === 'owner' ? 'Owner' : 'Kasir'})
        </p>
        <button type="button" onClick={onLogout}>
          Keluar
        </button>
      </div>
    </main>
  );
}
