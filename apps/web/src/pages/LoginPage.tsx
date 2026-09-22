import { useState } from 'react';
import { loginSchema, signupSchema } from '@niaga/shared';
import { login, signup } from '../api/auth.api';
import { errorMessage } from '../api/error-message';
import { AuthForm } from '../components/auth/AuthForm';
import type { AuthMode } from '../components/auth/AuthForm';

type Props = { onLoggedIn: () => void };

export function LoginPage({ onLoggedIn }: Props) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);

  async function submit(values: Record<string, string>) {
    setError(null);
    try {
      if (mode === 'login') await login(loginSchema.parse(values));
      else await signup(signupSchema.parse(values));
      onLoggedIn();
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  return (
    <main className="auth">
      <div className="card">
        <header className="page-head">
          <h1 className="wordmark">Niaga</h1>
          <p className="muted">Kasir untuk stand kaki lima</p>
        </header>
        <AuthForm mode={mode} error={error} onSubmit={submit} onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')} />
      </div>
    </main>
  );
}
