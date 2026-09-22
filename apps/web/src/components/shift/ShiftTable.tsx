import type { Shift } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { shifts: Shift[] };

const time = new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Jakarta' });
const money = (n: number | null) => (n === null ? '–' : rupiah.format(n));

// Shortage says so in words; the red only backs it up.
function Difference({ value }: { value: number | null }) {
  if (value === null || value === 0) return <>{money(value)}</>;
  if (value > 0) return <>+{rupiah.format(value)}</>;
  return <span className="bad">Kurang {rupiah.format(-value)}</span>;
}

export function ShiftTable({ shifts }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Kasir</th>
            <th scope="col">Buka</th>
            <th scope="col">Tutup</th>
            <th scope="col" className="num">Modal awal</th>
            <th scope="col" className="num">Seharusnya</th>
            <th scope="col" className="num">Dihitung</th>
            <th scope="col" className="num">Selisih</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s) => (
            <tr key={s.id}>
              <td>{s.cashierName}</td>
              <td>{time.format(new Date(s.openedAt))}</td>
              <td>{s.closedAt ? time.format(new Date(s.closedAt)) : 'Masih buka'}</td>
              <td className="num">{rupiah.format(s.openingCash)}</td>
              <td className="num">{money(s.expectedCash)}</td>
              <td className="num">{money(s.countedCash)}</td>
              <td className="num">
                <Difference value={s.difference} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
