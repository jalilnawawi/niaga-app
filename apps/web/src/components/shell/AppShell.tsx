import { NavLink, Outlet } from 'react-router';
import type { Me } from '@niaga/shared';
import { navLinks } from './nav-links';

type Props = { me: Me; onLogout: () => void };

const item = (to: string, label: string) => (
  <li key={to}>
    <NavLink to={to} end>
      {label}
    </NavLink>
  </li>
);

// Phone: bottom bar with Beranda plus the cashier links; owner pages and Keluar are reached from Beranda.
export function AppShell({ me, onLogout }: Props) {
  const owner = me.role === 'owner';
  return (
    <div className="shell">
      <nav className="nav" aria-label="Navigasi utama">
        <p className="nav-brand">Niaga</p>
        <ul>
          {item('/', 'Beranda')}
          {navLinks.filter((l) => !l.owner).map((l) => item(l.to, l.label))}
        </ul>
        {owner && (
          <>
            <p className="nav-group" id="nav-pemilik">
              Pemilik
            </p>
            <ul className="rail-only" aria-labelledby="nav-pemilik">
              {navLinks.filter((l) => l.owner).map((l) => item(l.to, l.label))}
            </ul>
          </>
        )}
        <div className="nav-user">
          <p>
            {me.name}
            <br />
            <span className="muted">{owner ? 'Owner' : 'Kasir'}</span>
          </p>
          <button type="button" className="link" onClick={onLogout}>
            Keluar
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
