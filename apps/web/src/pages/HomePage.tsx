import { Link } from 'react-router';
import type { Me } from '@niaga/shared';

type Props = { me: Me; onLogout: () => void };

const tiles = [
  { to: '/jual', label: 'Jual', hint: 'Catat penjualan dan cetak struk', owner: false },
  { to: '/shift', label: 'Shift', hint: 'Buka dan tutup shift, hitung kas', owner: false },
  { to: '/riwayat', label: 'Riwayat hari ini', hint: 'Transaksi dan struk hari ini', owner: false },
  { to: '/laporan', label: 'Laporan', hint: 'Penjualan per hari, produk, kasir', owner: true },
  { to: '/katalog', label: 'Katalog', hint: 'Produk, harga, dan kategori', owner: true },
  { to: '/kasir', label: 'Kelola kasir', hint: 'Tambah kasir dan reset password', owner: true },
];

export function HomePage({ me, onLogout }: Props) {
  return (
    <main className="page">
      <header className="page-head">
        <h1>{me.tenant.name}</h1>
        <p className="muted">
          {me.name} · {me.role === 'owner' ? 'Owner' : 'Kasir'}
        </p>
      </header>
      <ul className="tiles">
        {tiles
          .filter((t) => !t.owner || me.role === 'owner')
          .map((t) => (
            <li key={t.to}>
              <Link to={t.to} className={t.to === '/jual' ? 'primary' : undefined}>
                {t.label}
                <span>{t.hint}</span>
              </Link>
            </li>
          ))}
      </ul>
      <p>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </p>
    </main>
  );
}
