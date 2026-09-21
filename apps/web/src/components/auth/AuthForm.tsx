import type { FormEvent } from 'react';

export type AuthMode = 'login' | 'signup';

type Props = {
  mode: AuthMode;
  error: string | null;
  onSubmit: (values: Record<string, string>) => void;
  onToggleMode: () => void;
};

export function AuthForm({ mode, error, onSubmit, onToggleMode }: Props) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>);
  }

  return (
    <>
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
      <button type="button" onClick={onToggleMode}>
        {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
      </button>
    </>
  );
}
