// ============================================================
// Not Hesaplama - Pure Calculation Functions
// ============================================================

import type { Student, ScoreOrExempt, CalcResult, SpeakResult } from '../types';

// --------------- Helpers ---------------

/**
 * Parse a raw score value to number or 'G'.
 * Returns 0 for invalid / empty values.
 */
export function parseScore(v: string | number | null | undefined): number | 'G' {
  if (v === 'G' || v === 'g' || v === 'Giremedi' || v === 'Muaf') return 'G';
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : v;
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Fisher-Yates shuffle (in-place).
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --------------- Core: distribute ---------------

/**
 * Distribute `total` into `count` buckets randomly.
 * Each bucket is at most `maxPer` and values are multiples of `step`.
 * Returns an array of length `count` that sums to `total`.
 *
 * If total is 'G', returns an array of zeros (exempt student).
 */
export function distribute(
  total: ScoreOrExempt,
  count: number,
  maxPer: number = 100,
  step: number = 1
): number[] {
  if (total === 'G' || count <= 0) {
    return new Array(Math.max(count, 0)).fill(0);
  }

  const t = typeof total === 'number' ? total : 0;
  if (t <= 0) return new Array(count).fill(0);

  // Normalize to step units
  const units = Math.round(t / step);
  const maxUnits = Math.round(maxPer / step);

  // Validate feasibility
  if (units > count * maxUnits) {
    // Cannot fit; fill as much as possible
    const result = new Array(count).fill(maxPer);
    let remaining = t - count * maxPer;
    // Won't be perfect but avoids crash
    if (remaining > 0) result[0] += remaining;
    return result;
  }

  // Allocate unit by unit with shuffled bucket order
  const buckets = new Array(count).fill(0);
  let remaining = units;

  while (remaining > 0) {
    // Create index array and shuffle for fairness
    const indices = shuffle(Array.from({ length: count }, (_, i) => i));
    for (const idx of indices) {
      if (remaining <= 0) break;
      if (buckets[idx] < maxUnits) {
        buckets[idx]++;
        remaining--;
      }
    }
  }

  // Shuffle final order for randomness
  shuffle(buckets);

  // Convert back to real values
  return buckets.map((u) => u * step);
}

// --------------- Speaking distribution ---------------

/**
 * Convert a raw speaking total (0-100) into 5-criteria distribution.
 * Each criterion is 0-20, sum equals the total.
 */
export function makeSpeakingDistFromTotal(rawTotal: number): SpeakResult {
  const total = Math.max(0, Math.min(100, Math.round(rawTotal)));
  const data = distribute(total, 5, 20, 1);
  return { total, data };
}

// --------------- Score formulas ---------------

/**
 * Foreign language score: W * 0.50 + L * 0.25 + S * 0.25
 */
export function calculateLangScore(w: number, l: number, s: number): number {
  return Math.round(w * 0.5 + l * 0.25 + s * 0.25);
}

/**
 * Turkish (Edebiyat) score: W * 0.70 + L * 0.15 + S * 0.15
 */
export function calculateEdScore(w: number, l: number, s: number): number {
  return Math.round(w * 0.7 + l * 0.15 + s * 0.15);
}

/**
 * Build a CalcResult from written, listening, speaking using a formula fn.
 */
export function makeCalcResult(
  w: number,
  l: number,
  s: number,
  formula: (w: number, l: number, s: number) => number
): CalcResult {
  return {
    w,
    l,
    s,
    r: formula(w, l, s),
  };
}

// --------------- Theme calculations ---------------

/**
 * Recalculate all theme-related fields for a student based on their target.
 *
 * Logic:
 *  1. If target is 'G' or <= 0, zero everything out.
 *  2. Distribute target across 4 theme25Parts (each 0-25, sum = target).
 *  3. Each themeTotal = theme25Part * 4 (scaled to 100).
 *  4. Distribute each themeTotal into per-theme criterion scores.
 *
 * The number of criteria per theme is taken from the existing themes arrays
 * (default 5 criteria per theme).
 */
export function calculateThemes(student: Student): Student {
  const s = { ...student };
  const themeKeys: Array<'1' | '2' | '3' | '4'> = ['1', '2', '3', '4'];

  if (s.target === 'G' || (typeof s.target === 'number' && s.target <= 0)) {
    // Zero everything
    for (const k of themeKeys) {
      s.theme25Parts = { ...s.theme25Parts, [k]: 0 };
      s.themeTotals = { ...s.themeTotals, [k]: 0 };
      s.themes = { ...s.themes, [k]: s.themes[k].map(() => 0) };
    }
    return s;
  }

  const target = s.target as number;

  // Step 1: Distribute target across 4 parts, each max 25
  const parts = distribute(target, 4, 25, 1);
  const newParts: Record<string, number> = {};
  const newTotals: Record<string, number> = {};
  const newThemes: Record<string, number[]> = {};

  for (let i = 0; i < themeKeys.length; i++) {
    const k = themeKeys[i];
    newParts[k] = parts[i];

    // Step 2: Scale to 100-based total
    const total = parts[i] * 4;
    newTotals[k] = total;

    // Step 3: Distribute total into per-criteria scores
    const criteriaCount = s.themes[k]?.length || 5;
    const maxPerCriteria = Math.ceil(100 / criteriaCount);
    newThemes[k] = distribute(total, criteriaCount, maxPerCriteria, 1);
  }

  s.theme25Parts = newParts as Record<'1' | '2' | '3' | '4', number>;
  s.themeTotals = newTotals as Record<'1' | '2' | '3' | '4', number>;
  s.themes = newThemes as Record<'1' | '2' | '3' | '4', number[]>;

  return s;
}

// --------------- Batch recalc ---------------

/**
 * Recalculate all derived fields for a student.
 * Useful after importing or changing targets.
 */
export function recalculateStudent(student: Student): Student {
  let s = calculateThemes(student);

  // Recalculate calcEd results
  for (const sem of ['1', '2'] as const) {
    const ed = s.calcEd[sem];
    s = {
      ...s,
      calcEd: {
        ...s.calcEd,
        [sem]: { ...ed, r: calculateEdScore(ed.w, ed.l, ed.s) },
      },
    };

    const ya = s.calcYa[sem];
    s = {
      ...s,
      calcYa: {
        ...s.calcYa,
        [sem]: { ...ya, r: calculateLangScore(ya.w, ya.l, ya.s) },
      },
    };
  }

  return s;
}
