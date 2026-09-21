import type { SalesReportQuery } from '@niaga/shared';
import { client, unwrap } from './client';

export const getSalesReport = (query: SalesReportQuery) => client.reports.sales.$get({ query }).then(unwrap);
