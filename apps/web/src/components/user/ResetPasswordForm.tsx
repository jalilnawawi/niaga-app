import type { FormEvent } from 'react';

type Props = { userName: string; onSubmit: (password: string) => Promise<boolean> };

export function ResetPasswordForm({ userName, onSubmit }: Props) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (await onSubmit(String(new FormData(form).get('password')))) form.reset();
  }

  return (
    <form onSubmit={submit}>
      <label>
        Password baru untuk {userName}{' '}
        <input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" />
      </label>
      <button type="submit">Reset</button>
    </form>
  );
}
