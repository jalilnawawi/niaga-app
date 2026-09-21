import type { Shift } from '@niaga/shared';
import { rupiah } from '../ui/rupiah';

type Props = { shifts: Shift[] };

const time = new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Jakarta' });
const money = (n: number | null) => (n === null ? '–' : rupiah.format(n));

export function ShiftTable({ shifts }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Kasir</th>
          <th scope="col">Buka</th>
          <th scope="col">Tutup</th>
          <th scope="col">Modal awal</th>
          <th scope="col">Seharusnya</th>
          <th scope="col">Dihitung</th>
          <th scope="col">Selisih</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map((s) => (
          <tr key={s.id}>
            <td>{s.cashierName}</td>
            <td>{time.format(new Date(s.openedAt))}</td>
            <td>{s.closedAt ? time.format(new Date(s.closedAt)) : 'Masih buka'}</td>
            <td>{rupiah.format(s.openingCash)}</td>
            <td>{money(s.expectedCash)}</td>
            <td>{money(s.countedCash)}</td>
            <td>{s.difference !== null && s.difference > 0 ? `+${rupiah.format(s.difference)}` : money(s.difference)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
