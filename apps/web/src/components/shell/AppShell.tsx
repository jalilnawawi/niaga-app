import { NavLink, Outlet } from 'react-router';
import type { Me } from '@niaga/shared';

type Props = { me: Me };

// Phone shows the first four links in a bottom bar; owner pages are reached from Beranda there.
const links = [
  { to: '/', label: 'Beranda', owner: false },
  { to: '/jual', label: 'Jual', owner: false },
  { to: '/riwayat', label: 'Riwayat', owner: false },
  { to: '/shift', label: 'Shift', owner: false },
  { to: '/katalog', label: 'Katalog', owner: true },
  { to: '/kasir', label: 'Kasir', owner: true },
  { to: '/laporan', label: 'Laporan', owner: true },
];

export function AppShell({ me }: Props) {
  return (
    <div className="shell">
      <nav className="nav" aria-label="Navigasi utama">
        <p className="nav-brand">Niaga</p>
        <ul>
          {links
            .filter((l) => !l.owner || me.role === 'owner')
            .map((l) => (
              <li key={l.to} className={l.owner ? 'rail-only' : undefined}>
                <NavLink to={l.to} end>
                  {l.label}
                </NavLink>
              </li>
            ))}
        </ul>
        <p className="nav-user">
          {me.name}
          <br />
          <span className="muted">{me.role === 'owner' ? 'Owner' : 'Kasir'}</span>
        </p>
      </nav>
      <Outlet />
    </div>
  );
}
