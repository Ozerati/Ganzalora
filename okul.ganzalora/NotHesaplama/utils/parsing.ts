// ============================================================
// Not Hesaplama - e-Okul Paste Parser
// ============================================================

import type { PreviewRow } from '../types';

/**
 * Parse a raw score cell value from e-Okul paste.
 * Returns a number (0-100) or 'G' for exempt/absent.
 */
export function parseScore(v: string | number | null): number | 'G' {
  if (v === null || v === undefined) return 0;
  const s = String(v).trim();
  if (s === '') return 0;

  // Turkish keywords for exempt
  const exemptKeywords = ['g', 'giremedi', 'muaf', 'katılmadı', 'devamsız'];
  if (exemptKeywords.includes(s.toLowerCase())) return 'G';

  const n = parseFloat(s.replace(',', '.'));
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Convert Turkish-specific characters to ASCII uppercase.
 * This is used for case-insensitive matching of Turkish text.
 */
export function trAsciiUpper(s: string): string {
  const map: Record<string, string> = {
    'ç': 'C', 'Ç': 'C',
    'ğ': 'G', 'Ğ': 'G',
    'ı': 'I', 'İ': 'I',
    'i': 'I',
    'ö': 'O', 'Ö': 'O',
    'ş': 'S', 'Ş': 'S',
    'ü': 'U', 'Ü': 'U',
  };

  let result = '';
  for (const ch of s) {
    result += map[ch] ?? ch.toUpperCase();
  }
  return result;
}

// --------------- Column detection helpers ---------------

interface ColumnMap {
  noIdx: number;
  nameIdx: number;
  sinav1Idx: number;
  sinav2Idx: number;
  perf1Idx: number;
  perf2Idx: number;
  uyg1Idx: number;
  uyg2Idx: number;
  projeIdx: number;
  muafIdx: number;
}

/**
 * Known header aliases for column detection.
 * e-Okul uses various Turkish header names.
 */
const HEADER_PATTERNS: Record<keyof ColumnMap, string[]> = {
  noIdx:    ['OKUL NO', 'NO', 'OGRENCI NO', 'SIRA NO'],
  nameIdx:  ['ADI SOYADI', 'AD SOYAD', 'OGRENCI ADI', 'ADI VE SOYADI'],
  sinav1Idx: ['1. SINAV', 'YAZILI 1', '1.YAZILI', 'SINAV1', '1. YAZILI SINAV'],
  sinav2Idx: ['2. SINAV', 'YAZILI 2', '2.YAZILI', 'SINAV2', '2. YAZILI SINAV'],
  perf1Idx:  ['1. PERFORMANS', 'PERF 1', 'PERFORMANS1', '1.PERFORMANS', '1. PERFORMANS NOTU'],
  perf2Idx:  ['2. PERFORMANS', 'PERF 2', 'PERFORMANS2', '2.PERFORMANS', '2. PERFORMANS NOTU'],
  uyg1Idx:   ['1. UYGULAMA', 'UYG 1', 'UYGULAMA1', '1.UYGULAMA'],
  uyg2Idx:   ['2. UYGULAMA', 'UYG 2', 'UYGULAMA2', '2.UYGULAMA'],
  projeIdx:  ['PROJE', 'PROJE NOTU'],
  muafIdx:   ['MUAF', 'MUAFIYET'],
};

function findColumnIndex(headers: string[], patterns: string[]): number {
  const normalized = headers.map((h) => trAsciiUpper(h.trim()));
  for (const pat of patterns) {
    const normalPat = trAsciiUpper(pat);
    const idx = normalized.indexOf(normalPat);
    if (idx !== -1) return idx;
  }
  // Fuzzy: check if any header contains the pattern
  for (const pat of patterns) {
    const normalPat = trAsciiUpper(pat);
    const idx = normalized.findIndex((h) => h.includes(normalPat));
    if (idx !== -1) return idx;
  }
  return -1;
}

function detectColumns(headers: string[]): Partial<ColumnMap> {
  const map: Partial<ColumnMap> = {};
  for (const [key, patterns] of Object.entries(HEADER_PATTERNS)) {
    const idx = findColumnIndex(headers, patterns);
    if (idx !== -1) {
      (map as any)[key] = idx;
    }
  }
  return map;
}

// --------------- Main Parser ---------------

/**
 * Parse raw TSV text pasted from e-Okul into structured PreviewRow[].
 *
 * Steps:
 *  1. Split input by newlines, then each line by TAB.
 *  2. Find the header row (contains both "OKUL NO" and "ADI SOYADI" or similar).
 *  3. Map detected columns to field indices.
 *  4. Parse subsequent data rows into PreviewRow objects.
 *  5. Skip empty rows or rows where both no and name are missing.
 */
export function parseEokulPaste(raw: string): PreviewRow[] {
  if (!raw || !raw.trim()) return [];

  const lines = raw.split(/\r?\n/).map((line) => line.split('\t'));
  const results: PreviewRow[] = [];

  // Step 1: Find header row
  let headerIdx = -1;
  let colMap: Partial<ColumnMap> = {};

  for (let i = 0; i < lines.length; i++) {
    const row = lines[i];
    const joined = trAsciiUpper(row.join(' '));

    // Must contain both student number and name indicators
    const hasNo = joined.includes('OKUL NO') || joined.includes('NO');
    const hasName = joined.includes('ADI SOYADI') || joined.includes('ADI VE SOYADI') || joined.includes('AD SOYAD');

    if (hasNo && hasName) {
      colMap = detectColumns(row);
      // Verify we have at least no and name columns
      if (colMap.noIdx !== undefined && colMap.nameIdx !== undefined) {
        headerIdx = i;
        break;
      }
    }
  }

  if (headerIdx === -1 || colMap.noIdx === undefined || colMap.nameIdx === undefined) {
    return [];
  }

  // Step 2: Parse data rows after header
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cells = lines[i];
    if (!cells || cells.length < 2) continue;

    const no = cells[colMap.noIdx]?.trim() ?? '';
    const name = cells[colMap.nameIdx]?.trim() ?? '';

    // Skip empty rows
    if (!no && !name) continue;
    // Skip if no looks like a header repeat
    if (trAsciiUpper(no) === 'OKUL NO') continue;

    const row: PreviewRow = { no, name };

    const getCell = (idx: number | undefined): string | null => {
      if (idx === undefined || idx < 0 || idx >= cells.length) return null;
      const v = cells[idx]?.trim();
      return v || null;
    };

    if (colMap.sinav1Idx !== undefined) row.sinav1 = parseScore(getCell(colMap.sinav1Idx));
    if (colMap.sinav2Idx !== undefined) row.sinav2 = parseScore(getCell(colMap.sinav2Idx));
    if (colMap.perf1Idx !== undefined) row.perf1 = parseScore(getCell(colMap.perf1Idx));
    if (colMap.perf2Idx !== undefined) row.perf2 = parseScore(getCell(colMap.perf2Idx));
    if (colMap.uyg1Idx !== undefined) row.uyg1 = parseScore(getCell(colMap.uyg1Idx));
    if (colMap.uyg2Idx !== undefined) row.uyg2 = parseScore(getCell(colMap.uyg2Idx));
    if (colMap.projeIdx !== undefined) row.proje = parseScore(getCell(colMap.projeIdx));

    if (colMap.muafIdx !== undefined) {
      const muafVal = getCell(colMap.muafIdx);
      row.muaf = muafVal !== null && trAsciiUpper(muafVal) !== '' &&
        ['EVET', 'E', 'X', '1', 'MUAF'].includes(trAsciiUpper(muafVal));
    }

    results.push(row);
  }

  return results;
}
