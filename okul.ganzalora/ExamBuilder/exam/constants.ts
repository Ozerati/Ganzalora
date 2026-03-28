import questionBank from '../../data/examQuestionBank.json';
import type { ExamSection } from './types';

export const GROUP_LETTERS_12 = ['A', 'B', 'C', 'D', 'E', 'T', 'Ö'];
export const GROUP_LETTERS_10 = ['A', 'B', 'T', 'Ö'];
export const GROUP_LETTERS_9 = ['A', 'B', 'C', 'T', 'Ö'];

export function getTypeLabel(typeId: string) {
  return questionBank.questionTypes.find((t) => t.id === typeId)?.label || typeId;
}
export function gid() { return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
export function emptySection(num: number): ExamSection {
  return { id: gid(), label: String(num), type: 'reading-qa', scoring: '4x5=20', instruction: '', passage: '', items: [''] };
}
export function calcPoints(s: string) { const m = s.match(/=(\d+)/); return m ? parseInt(m[1], 10) : 0; }

/* ─── Color palette for groups ─── */
export const GROUP_COLORS_12: Record<string, { bg: string; border: string; text: string; ring: string; light: string }> = {
  A: { bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-700', ring: 'shadow-blue-300', light: 'bg-blue-50' },
  B: { bg: 'bg-rose-600', border: 'border-rose-600', text: 'text-rose-700', ring: 'shadow-rose-300', light: 'bg-rose-50' },
  C: { bg: 'bg-amber-600', border: 'border-amber-600', text: 'text-amber-700', ring: 'shadow-amber-300', light: 'bg-amber-50' },
  D: { bg: 'bg-emerald-600', border: 'border-emerald-600', text: 'text-emerald-700', ring: 'shadow-emerald-300', light: 'bg-emerald-50' },
  E: { bg: 'bg-violet-600', border: 'border-violet-600', text: 'text-violet-700', ring: 'shadow-violet-300', light: 'bg-violet-50' },
  T: { bg: 'bg-teal-600', border: 'border-teal-600', text: 'text-teal-700', ring: 'shadow-teal-300', light: 'bg-teal-50' },
  'Ö': { bg: 'bg-orange-600', border: 'border-orange-600', text: 'text-orange-700', ring: 'shadow-orange-300', light: 'bg-orange-50' },
};
export const GROUP_COLORS_9: Record<string, { bg: string; border: string; text: string; ring: string; light: string }> = {
  A: { bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-700', ring: 'shadow-blue-300', light: 'bg-blue-50' },
  B: { bg: 'bg-rose-600', border: 'border-rose-600', text: 'text-rose-700', ring: 'shadow-rose-300', light: 'bg-rose-50' },
  C: { bg: 'bg-violet-600', border: 'border-violet-600', text: 'text-violet-700', ring: 'shadow-violet-300', light: 'bg-violet-50' },
  T: { bg: 'bg-teal-600', border: 'border-teal-600', text: 'text-teal-700', ring: 'shadow-teal-300', light: 'bg-teal-50' },
  'Ö': { bg: 'bg-orange-600', border: 'border-orange-600', text: 'text-orange-700', ring: 'shadow-orange-300', light: 'bg-orange-50' },
};
