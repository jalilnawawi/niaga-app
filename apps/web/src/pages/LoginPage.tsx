import { useState } from 'react';
import { loginSchema, signupSchema } from '@niaga/shared';
import { login, signup } from '../api/auth.api';
import { ApiError } from '../api/client';
import { AuthForm } from '../components/auth/AuthForm';
import type { AuthMode } from '../components/auth/AuthForm';

const MESSAGES: Record<string, string> = {
  email_taken: 'Email sudah terdaftar.',
  invalid_credentials: 'Email atau password salah.',
};

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
      if (e instanceof ApiError) setError(MESSAGES[e.code] ?? e.code);
      // zod's parse throws ZodError; web has no direct zod import to instanceof against.
      else if (e instanceof Error && e.name === 'ZodError') setError((e as unknown as { issues: { message: string }[] }).issues[0]!.message);
      else setError(String(e));
    }
  }

  return (
    <main>
      <h1>Niaga</h1>
      <AuthForm mode={mode} error={error} onSubmit={submit} onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')} />
    </main>
  );
}
