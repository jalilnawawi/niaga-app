// A table column; `money` values show as rupiah on screen and stay plain numbers in CSV.
export type Column<Row> = { header: string; value: (row: Row) => string | number; money?: boolean };
