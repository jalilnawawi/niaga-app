import type { FormEvent } from 'react';

type Props = { onSubmit: (values: Record<string, string>) => Promise<boolean> };

export function CashierForm({ onSubmit }: Props) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (await onSubmit(Object.fromEntries(new FormData(form)) as Record<string, string>)) form.reset();
  }

  return (
    <form onSubmit={submit} aria-label="Tambah kasir" className="stack">
      <label>
        Nama <input name="name" required maxLength={100} autoComplete="off" />
      </label>
      <label>
        Email <input name="email" type="email" required autoComplete="off" />
      </label>
      <label>
        Password <input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" />
      </label>
      <button type="submit" className="primary">
        Tambah kasir
      </button>
    </form>
  );
}
