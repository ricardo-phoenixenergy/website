// The checks behind the blog post form's comparison table. Each row needs a
// label (it heads the row) and one value per column, in the columns' order;
// otherwise the table on the site shows a gap the editor didn't mean.

export interface TableRowValue {
  label?: string;
  values?: string[];
}

/** True for a complete row, or a warning naming what to fix. Says nothing until the columns are set. */
export function tableRowWarning(row: TableRowValue | undefined, columns: string[] | undefined): true | string {
  if (!row) return true;
  if (!row.label?.trim()) return 'Give the row a label: it heads the row.';
  const count = columns?.length ?? 0;
  if (count === 0) return true;
  const values = row.values?.length ?? 0;
  if (values === count) return true;
  return `This row has ${values} ${values === 1 ? 'value' : 'values'} for ${count} columns. Add one value per column, in the same order.`;
}
