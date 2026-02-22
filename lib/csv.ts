/**
 * Escape a value for CSV (wrap in quotes if contains comma, newline, or double quote).
 */
export function escapeCsvCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[,"\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/**
 * Build CSV string from header row and data rows.
 */
export function buildCsv(headers: string[], rows: (string | number)[][]): string {
  const headerLine = headers.map(escapeCsvCell).join(',')
  const dataLines = rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
  return [headerLine, ...dataLines].join('\r\n')
}

/**
 * Trigger download of a CSV file in the browser.
 */
export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
