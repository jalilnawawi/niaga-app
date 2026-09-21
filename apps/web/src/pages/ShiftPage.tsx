import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Me, Shift } from '@niaga/shared';
import { closeShiftSchema, openShiftSchema } from '@niaga/shared';
import { errorMessage } from '../api/error-message';
import { closeShift, getCurrentShift, listShifts, openShift } from '../api/shift.api';
import { CashForm } from '../components/shift/CashForm';
import { ShiftTable } from '../components/shift/ShiftTable';
import { rupiah } from '../components/ui/rupiah';
import { useAction } from '../hooks/use-action';

type Props = { me: Me };

const time = new Intl.DateTimeFormat('id-ID', { timeStyle: 'short', timeZone: 'Asia/Jakarta' });

export function ShiftPage({ me }: Props) {
  const isOwner = me.role === 'owner';
  const [current, setCurrent] = useState<Shift | null | undefined>(undefined);
  const [closed, setClosed] = useState<Shift | null>(null);
  const [all, setAll] = useState<Shift[] | null>(null);
  const { error, notice, setError, run } = useAction();

  useEffect(() => {
    getCurrentShift()
      .then(setCurrent)
      .catch((e: unknown) => setError(errorMessage(e)));
    if (isOwner) listShifts().then(setAll).catch((e: unknown) => setError(errorMessage(e)));
  }, [isOwner, setError]);

  const open = (openingCash: number) =>
    run(async () => {
      const shift = await openShift(openShiftSchema.parse({ openingCash }));
      setCurrent(shift);
      setClosed(null);
      setAll((prev) => prev && [shift, ...prev]);
    }, 'Shift dibuka.');

  const close = (countedCash: number) =>
    run(async () => {
      const shift = await closeShift(closeShiftSchema.parse({ countedCash }));
      setCurrent(null);
      setClosed(shift);
      setAll((prev) => prev?.map((s) => (s.id === shift.id ? shift : s)) ?? null);
    }, 'Shift ditutup.');

  return (
    <main>
      <p>
        <Link to="/">← Beranda</Link> · <Link to="/jual">Kasir</Link>
      </p>
      <h1>Shift</h1>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {current === undefined && !error && <p>Loading…</p>}
      {current === null && <CashForm label="Modal awal di laci" submitLabel="Buka shift" onSubmit={open} />}
      {current && (
        <>
          <p>
            Shift dibuka {time.format(new Date(current.openedAt))} dengan modal {rupiah.format(current.openingCash)}.
          </p>
          <CashForm label="Uang tunai di laci" submitLabel="Tutup shift" onSubmit={close} />
        </>
      )}
      {closed && <ShiftTable shifts={[closed]} />}
      {all && (
        <section aria-labelledby="all-shifts">
          <h2 id="all-shifts">Semua shift</h2>
          {all.length === 0 ? <p>Belum ada shift.</p> : <ShiftTable shifts={all} />}
        </section>
      )}
    </main>
  );
}
