const cell = (v: string | number) => (typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : String(v));

// Saves rows as a CSV file. The BOM makes Excel read UTF-8 names correctly.
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
