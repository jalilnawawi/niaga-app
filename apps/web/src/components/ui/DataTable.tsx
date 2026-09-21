import type { Column } from '../../types/table';
import { downloadCsv } from './csv';
import { rupiah } from './rupiah';

type Props<Row> = { caption: string; columns: Column<Row>[]; rows: Row[]; filename: string };

export function DataTable<Row>({ caption, columns, rows, filename }: Props<Row>) {
  const csv = () => downloadCsv(filename, [columns.map((c) => c.header), ...rows.map((r) => columns.map((c) => c.value(r)))]);
  return (
    <section>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.header}>{c.money ? rupiah.format(Number(c.value(r))) : c.value(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={csv} disabled={rows.length === 0}>
        Unduh CSV: {caption}
      </button>
    </section>
  );
}
