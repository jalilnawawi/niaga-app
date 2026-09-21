import type { SalesReport } from '@niaga/shared';
import type { Column } from '../../types/table';
import { DataTable } from '../ui/DataTable';

type Props = { report: SalesReport; from: string; to: string };

const dayColumns: Column<SalesReport['days'][number]>[] = [
  { header: 'Tanggal', value: (r) => r.date },
  { header: 'Transaksi', value: (r) => r.orders },
  { header: 'Tunai', value: (r) => r.cash, money: true },
  { header: 'QRIS', value: (r) => r.qris, money: true },
  { header: 'Total', value: (r) => r.total, money: true },
];

const productColumns: Column<SalesReport['products'][number]>[] = [
  { header: 'Produk', value: (r) => r.name },
  { header: 'Qty', value: (r) => r.qty },
  { header: 'Total', value: (r) => r.total, money: true },
];

const cashierColumns: Column<SalesReport['cashiers'][number]>[] = [
  { header: 'Kasir', value: (r) => r.name },
  { header: 'Transaksi', value: (r) => r.orders },
  { header: 'Total', value: (r) => r.total, money: true },
];

export function SalesReportTables({ report, from, to }: Props) {
  const file = (name: string) => `penjualan-${name}-${from}_${to}.csv`;
  return (
    <>
      <DataTable caption="Per hari" columns={dayColumns} rows={report.days} filename={file('harian')} />
      <DataTable caption="Per produk" columns={productColumns} rows={report.products} filename={file('produk')} />
      <DataTable caption="Per kasir" columns={cashierColumns} rows={report.cashiers} filename={file('kasir')} />
    </>
  );
}
