/**
 * Centralized XLSX adapter built on top of `exceljs`.
 *
 * Replaces the previous `xlsx` (SheetJS) dependency, which had unresolved
 * high-severity vulnerabilities. Exposes a small surface area used across
 * the app for importing and exporting trade data.
 */
export interface ParsedSheet {
  name: string;
  /** Rows as arrays of cell values (header detection handled by caller). */
  rows: unknown[][];
}

export interface ParsedWorkbook {
  sheetNames: string[];
  sheets: ParsedSheet[];
}

/** Parse an .xlsx / .xls / .xlsm file into a normalized structure. */
export async function parseXLSX(file: File): Promise<ParsedWorkbook> {
  const buffer = await file.arrayBuffer();
  return parseXLSXBuffer(buffer);
}

/** Same as `parseXLSX` but accepts a raw ArrayBuffer. */
export async function parseXLSXBuffer(buffer: ArrayBuffer): Promise<ParsedWorkbook> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);

  const sheets: ParsedSheet[] = [];
  wb.eachSheet((ws) => {
    const rows: unknown[][] = [];
    ws.eachRow({ includeEmpty: false }, (row) => {
      // row.values is 1-indexed; drop the leading undefined slot.
      const values = (row.values as unknown[]).slice(1).map((v) => normalizeCell(v));
      rows.push(values);
    });
    sheets.push({ name: ws.name, rows });
  });

  return {
    sheetNames: sheets.map((s) => s.name),
    sheets,
  };
}

function normalizeCell(v: unknown): unknown {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object') {
    const obj = v as { text?: string; result?: unknown; richText?: { text: string }[]; hyperlink?: string };
    if (Array.isArray(obj.richText)) return obj.richText.map((r) => r.text).join('');
    if (typeof obj.text === 'string') return obj.text;
    if (obj.result !== undefined) return obj.result;
    if (typeof obj.hyperlink === 'string') return obj.hyperlink;
  }
  return v;
}

export interface ExportSheet {
  name: string;
  /** Array of plain row objects. Keys become column headers. */
  data: Record<string, unknown>[];
  /** Optional column widths in characters, applied in order. */
  columnWidths?: number[];
}

/** Build an .xlsx file from one or more sheets and trigger a browser download. */
export async function writeXLSXFile(
  filename: string,
  sheets: ExportSheet[],
): Promise<void> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  wb.created = new Date();

  for (const sheet of sheets) {
    const ws = wb.addWorksheet(sheet.name);
    if (sheet.data.length === 0) continue;

    const headers = Object.keys(sheet.data[0]);
    ws.columns = headers.map((h, i) => ({
      header: h,
      key: h,
      width: sheet.columnWidths?.[i] ?? Math.max(10, h.length + 2),
    }));
    ws.getRow(1).font = { bold: true };

    for (const row of sheet.data) {
      ws.addRow(row);
    }
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
