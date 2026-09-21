import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Me } from '@niaga/shared';
import { api } from './lib/api';

// ponytail: single-screen auth, no router; add one when there is a second page.
export function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const loadMe = () =>
    api.auth.me.$get().then(async (res) => setMe(res.ok ? await res.json() : null));

  useEffect(() => {
    loadMe().catch((e: unknown) => setError(String(e)));
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const res =
      mode === 'login'
        ? await api.auth.login.$post({ json: { email: f.email!, password: f.password! } })
        : await api.auth.signup.$post({
            json: { email: f.email!, password: f.password!, name: f.name!, tenantName: f.tenantName! },
          });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? `HTTP ${res.status}`);
      return;
    }
    await loadMe();
  }

  async function logout() {
    await api.auth.logout.$post();
    setMe(null);
  }

  if (me === undefined) return <main>{error ?? 'Loading…'}</main>;

  if (me) {
    return (
      <main>
        <h1>Niaga</h1>
        <p>
          {me.name} ({me.role}) · {me.tenant.name}
        </p>
        <button onClick={logout}>Logout</button>
      </main>
    );
  }

  return (
    <main>
      <h1>Niaga</h1>
      <form onSubmit={submit}>
        {mode === 'signup' && (
          <>
            <label>
              Nama <input name="name" required maxLength={100} autoComplete="name" />
            </label>
            <label>
              Nama tenant <input name="tenantName" required maxLength={100} />
            </label>
          </>
        )}
        <label>
          Email <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password{' '}
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>
        <button type="submit">{mode === 'login' ? 'Login' : 'Daftar'}</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
      </button>
    </main>
  );
}
