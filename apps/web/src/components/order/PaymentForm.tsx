import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateOrder } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { total: number; onPay: (payment: CreateOrder['payment']) => Promise<boolean> };

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
    <form onSubmit={submit} aria-label="Pembayaran">
      <p>
        <strong>Total {rupiah.format(total)}</strong>
      </p>
      <fieldset>
        <legend>Metode bayar</legend>
        <label>
          <input type="radio" name="method" checked={method === 'cash'} onChange={() => setMethod('cash')} /> Tunai
        </label>{' '}
        <label>
          <input type="radio" name="method" checked={method === 'qris'} onChange={() => setMethod('qris')} /> QRIS
        </label>
      </fieldset>
      {method === 'cash' ? (
        <>
          <label>
            Uang diterima (Rp){' '}
            <input type="number" value={paid} onChange={(e) => setPaid(e.target.value)} required min={total} step={1} />
          </label>
          {paid !== '' && <p>{change >= 0 ? `Kembalian ${rupiah.format(change)}` : `Kurang ${rupiah.format(-change)}`}</p>}
          <button type="submit" disabled={busy}>
            Bayar tunai
          </button>
        </>
      ) : (
        <>
          <p>Cek notifikasi pembayaran QRIS {rupiah.format(total)} sebelum menandai lunas.</p>
          <button type="submit" disabled={busy}>
            Tandai lunas (QRIS)
          </button>
        </>
      )}
    </form>
  );
}
