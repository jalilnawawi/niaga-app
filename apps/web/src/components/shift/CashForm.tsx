import { useState } from 'react';
import type { FormEvent } from 'react';

type Props = { label: string; submitLabel: string; onSubmit: (amount: number) => Promise<boolean> };

// One rupiah amount: the opening float or the closing count.
export function CashForm({ label, submitLabel, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    if (await onSubmit(Number(amount))) setAmount('');
    setBusy(false);
  }

  return (
    <form onSubmit={submit} aria-label={submitLabel}>
      <label>
        {label} (Rp) <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min={0} step={1} />
      </label>
      <button type="submit" disabled={busy}>
        {submitLabel}
      </button>
    </form>
  );
}
