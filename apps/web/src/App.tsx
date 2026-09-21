import { useEffect, useState } from 'react';
import type { Me } from '@niaga/shared';
import { getMe, logout } from './api/auth.api';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

// ponytail: session state picks the page, no router; add one when there is a second signed-in page.
export function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const loadMe = () => getMe().then(setMe).catch((e: unknown) => setError(String(e)));

  useEffect(() => {
    loadMe();
  }, []);

  if (me === undefined) return <main>{error ?? 'Loading…'}</main>;
  if (!me) return <LoginPage onLoggedIn={loadMe} />;
  return <HomePage me={me} onLogout={() => logout().then(() => setMe(null))} />;
}
