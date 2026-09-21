import type { SalesReport, SalesReportQuery } from '@niaga/shared';
import type { Db } from '../../db/client';
import * as repo from './report.repository';

export async function getSalesReport(db: Db, tenantId: string, { from, to }: SalesReportQuery): Promise<SalesReport> {
  const [days, products, cashiers] = await Promise.all([
    repo.salesByDay(db, tenantId, from, to),
    repo.salesByProduct(db, tenantId, from, to),
    repo.salesByCashier(db, tenantId, from, to),
  ]);
  return { days, products, cashiers };
}
