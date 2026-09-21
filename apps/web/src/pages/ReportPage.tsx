import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import type { SalesReport, SalesReportQuery } from '@niaga/shared';
import { salesReportQuerySchema } from '@niaga/shared';
import { errorMessage } from '../api/error-message';
import { getSalesReport } from '../api/report.api';
import { SalesReportTables } from '../components/report/SalesReportTables';
import { rupiah } from '../components/ui/rupiah';

// en-CA formats as YYYY-MM-DD, the business date format.
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

export function ReportPage() {
  const [query, setQuery] = useState<SalesReportQuery>(() => ({ from: today(), to: today() }));
  const [form, setForm] = useState(query);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSalesReport(query)
      .then(setReport)
      .catch((e: unknown) => setError(errorMessage(e)));
  }, [query]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = salesReportQuerySchema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0]!.message);
    setError(null);
    setReport(null);
    setQuery(parsed.data);
  }

  const total = report?.days.reduce((sum, d) => sum + d.total, 0) ?? 0;

  return (
    <main>
      <p>
        <Link to="/">← Beranda</Link>
      </p>
      <h1>Laporan penjualan</h1>
      <form onSubmit={submit} aria-label="Rentang tanggal">
        <label>
          Dari <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required />
        </label>{' '}
        <label>
          Sampai <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required />
        </label>{' '}
        <button type="submit">Tampilkan</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {!report && !error && <p>Loading…</p>}
      {report && (
        <>
          <p>
            {report.days.reduce((n, d) => n + d.orders, 0)} transaksi lunas · {rupiah.format(total)} (void tidak dihitung)
          </p>
          <SalesReportTables report={report} from={query.from} to={query.to} />
        </>
      )}
    </main>
  );
}
