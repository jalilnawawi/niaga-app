import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import type { Me } from '@niaga/shared';
import { getMe, logout } from './api/auth.api';
import { CatalogPage } from './pages/CatalogPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { PosPage } from './pages/PosPage';
import { ShiftPage } from './pages/ShiftPage';
import { UsersPage } from './pages/UsersPage';

export function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const loadMe = () => getMe().then(setMe).catch((e: unknown) => setError(String(e)));

  useEffect(() => {
    loadMe();
  }, []);

  if (me === undefined) return <main>{error ?? 'Loading…'}</main>;
  if (!me) return <LoginPage onLoggedIn={loadMe} />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage me={me} onLogout={() => logout().then(() => setMe(null))} />} />
        <Route path="/jual" element={<PosPage me={me} />} />
        <Route path="/riwayat" element={<OrdersPage me={me} />} />
        <Route path="/shift" element={<ShiftPage me={me} />} />
        {me.role === 'owner' && <Route path="/kasir" element={<UsersPage />} />}
        {me.role === 'owner' && <Route path="/katalog" element={<CatalogPage />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
