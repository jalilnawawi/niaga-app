import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateOrder } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { total: number; onPay: (payment: CreateOrder['payment']) => Promise<boolean> };

const notes = [
  { value: 100_000, className: 'rp100' },
  { value: 50_000, className: 'rp50' },
  { value: 20_000, className: 'rp20' },
  { value: 10_000, className: 'rp10' },
];

export function PaymentForm({ total, onPay }: Props) {
  const [method, setMethod] = useState<'cash' | 'qris'>('cash');
  const [paid, setPaid] = useState('');
  const [busy, setBusy] = useState(false);
  const change = Number(paid) - total;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const ok = await onPay(method === 'cash' ? { method, paid: Number(paid) } : { method });
    setBusy(false);
    if (ok) setPaid('');
  }

  return (
    <form onSubmit={submit} aria-label="Pembayaran" className="stack">
      <p className="board total-board">
        Total <strong>{rupiah.format(total)}</strong>
      </p>
      <fieldset>
        <legend>Metode bayar</legend>
        <div className="segmented">
          <label>
            <input type="radio" name="method" checked={method === 'cash'} onChange={() => setMethod('cash')} /> Tunai
          </label>
          <label>
            <input type="radio" name="method" checked={method === 'qris'} onChange={() => setMethod('qris')} /> QRIS
          </label>
        </div>
      </fieldset>
      {method === 'cash' ? (
        <>
          <div className="quick-cash" role="group" aria-label="Uang cepat">
            {notes.map((n) => (
              <button key={n.value} type="button" className={n.className} disabled={n.value < total} onClick={() => setPaid(String(n.value))}>
                {rupiah.format(n.value)}
              </button>
            ))}
            <button type="button" className="exact" onClick={() => setPaid(String(total))}>
              Uang pas
            </button>
          </div>
          {paid !== '' && (
            <p className={change >= 0 ? 'change' : 'change short'} aria-live="polite">
              {change >= 0 ? `Kembalian ${rupiah.format(change)}` : `Kurang ${rupiah.format(-change)}`}
            </p>
          )}
          <label>
            Uang diterima (Rp)
            <input type="number" inputMode="numeric" value={paid} onChange={(e) => setPaid(e.target.value)} required min={total} step={1} />
          </label>
          <button type="submit" className="primary big pay" disabled={busy}>
            Bayar tunai
          </button>
        </>
      ) : (
        <>
          <p>Cek notifikasi pembayaran QRIS {rupiah.format(total)} sebelum menandai lunas.</p>
          <button type="submit" className="primary big pay" disabled={busy}>
            Tandai lunas (QRIS)
          </button>
        </>
      )}
    </form>
  );
}
