// ============================================================
// Not Hesaplama - Beden Eğitimi Tab
// Sub-tabs: perf1/2 (Performans), uyg1/2 (Uygulama)
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import A4Paper from '../A4Paper';
import type { SemesterKey, Student } from '../../types';
import { distribute } from '../../utils/calculations';
import { BE_CRITERIA } from '../../utils/constants';

// --------------- Constants ---------------

type BedenSubTab = 'perf1' | 'perf2' | 'uyg1' | 'uyg2';

const SUB_TAB_LABELS: { id: BedenSubTab; label: string; semester: SemesterKey }[] = [
  { id: 'perf1', label: 'Performans 1. Dönem', semester: '1' },
  { id: 'perf2', label: 'Performans 2. Dönem', semester: '2' },
  { id: 'uyg1', label: 'Uygulama 1. Dönem', semester: '1' },
  { id: 'uyg2', label: 'Uygulama 2. Dönem', semester: '2' },
];

const EVIDENCE_TEXT: Record<string, string> = {
  perf1: 'ÖĞRENME KANITI: Performans Değerlendirme - 1. Dönem',
  perf2: 'ÖĞRENME KANITI: Performans Değerlendirme - 2. Dönem',
  uyg1: 'ÖĞRENME KANITI: Uygulama Sınavı - 1. Dönem',
  uyg2: 'ÖĞRENME KANITI: Uygulama Sınavı - 2. Dönem',
};

// --------------- Shared Styles ---------------

const thBase =
  'border border-slate-300 px-0.5 py-1 text-[8px] font-semibold text-slate-700';
const tdBase =
  'border border-slate-300 px-0 py-0 text-center text-[8px]';
const inputCls =
  'w-full rounded-none border-none bg-[#fffbeb] px-0 py-0.5 text-center text-[8px] font-bold text-slate-800 focus:bg-blue-50 focus:outline-none';

// --------------- Main Component ---------------

export default function BedenTab() {
  const { state, dispatch, currentStudents } = useNotHesaplama();
  const activeSubTab = (state.activeSubTab['bedenEgitimi'] ?? 'perf1') as BedenSubTab;

  const setSubTab = useCallback(
    (subTabId: BedenSubTab) => {
      dispatch({ type: 'SET_ACTIVE_SUB_TAB', payload: { tabId: 'bedenEgitimi', subTabId } });
    },
    [dispatch],
  );

  // All 40 students (render even when empty)
  const allStudents = currentStudents;

  const currentTabMeta = SUB_TAB_LABELS.find((t) => t.id === activeSubTab)!;
  const semester = currentTabMeta.semester;
  const isPerf = activeSubTab.startsWith('perf');

  // Get criteria based on sub-tab
  const criteria = isPerf
    ? BE_CRITERIA.perf
    : activeSubTab === 'uyg1'
      ? BE_CRITERIA.uyg1
      : BE_CRITERIA.uyg2;

  const distField = isPerf ? 'bePerfDist' : 'beUygDist';

  // --------------- Handlers ---------------

  const handleDistChange = useCallback(
    (studentId: number, criterionIdx: number, raw: string) => {
      const n = parseInt(raw, 10);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(20, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: {
          id: studentId,
          fieldPath: `${distField}.${semester}.${criterionIdx}`,
          value,
        },
      });
    },
    [dispatch, distField, semester],
  );

  const handleAutoDistribute = useCallback(() => {
    dispatch({ type: 'PUSH_UNDO', payload: 'Otomatik dağıtım öncesi' });

    allStudents.forEach((s) => {
      if (!s.name.trim()) return;
      const target = typeof s.target === 'number' ? s.target : 0;
      const dist = distribute(target, criteria.length, 20, 1);
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: {
          id: s.id,
          fieldPath: `${distField}.${semester}`,
          value: dist,
        },
      });
    });
  }, [dispatch, allStudents, criteria.length, distField, semester]);

  // --------------- Vertical header cell ---------------

  const VerticalStudentHeader = ({ s, idx }: { s: Student; idx: number }) => (
    <th className={`${thBase} bg-gray-100`} style={{ width: '22px', minWidth: '22px', maxWidth: '22px', height: '140px', padding: '2px 1px' }}>
      <div className="flex flex-col items-center h-full">
        <span className="text-[7px] text-slate-400 border-b border-slate-300 w-full text-center pb-0.5 mb-0.5">{s.number || (idx + 1)}</span>
        <span
          className="whitespace-nowrap text-[7px] font-medium text-slate-600 flex-1 flex items-center"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {s.name || `${idx + 1}`}
        </span>
      </div>
    </th>
  );

  // --------------- Render ---------------

  return (
    <div className="space-y-4">

      {/* Header + auto distribute */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          {isPerf ? 'Performans Değerlendirme' : 'Uygulama Puanları'} &mdash; {semester}. Dönem
        </h3>
        <button
          type="button"
          onClick={handleAutoDistribute}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.97]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Otomatik Dağıt
        </button>
      </div>

      {/* Table */}
      <A4Paper orientation="landscape">
        <table className="w-full border-collapse text-xs">
          <thead>
            {/* Evidence text + class name header row */}
            <tr className="bg-gray-100">
              <th className={`${thBase} text-center`} colSpan={2}>
                <div className="text-[10px] font-bold text-slate-600">
                  {EVIDENCE_TEXT[activeSubTab]}
                </div>
              </th>
              {allStudents.map((s, idx) => (
                <VerticalStudentHeader key={s.id} s={s} idx={idx} />
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Criteria rows */}
            {criteria.map((criterion, ci) => (
              <tr
                key={ci}
                className={ci % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {/* Row number */}
                <td className={`${tdBase} w-8 text-slate-400 font-medium`}>{ci + 1}</td>
                {/* Criterion label */}
                <td className={`${tdBase} text-left px-1 text-[7px] text-slate-600 whitespace-nowrap`} style={{ minWidth: '120px', maxWidth: '160px' }}>
                  {criterion}
                </td>
                {/* Student score cells */}
                {allStudents.map((s) => {
                  const dist = (s as Record<string, unknown>)[distField] as Record<SemesterKey, number[]> | undefined;
                  const values = dist?.[semester] ?? [];
                  const val = values[ci] ?? 0;

                  return (
                    <td key={s.id} className={tdBase}>
                      <input
                        type="text"
                        value={val || ''}
                        onChange={(e) => handleDistChange(s.id, ci, e.target.value)}
                        className={inputCls}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* TOPLAM PUAN row */}
            <tr className="bg-gray-100">
              <td colSpan={2} className={`${tdBase} font-bold text-slate-800 text-right px-3`}>
                TOPLAM PUAN
              </td>
              {allStudents.map((s) => {
                const dist = (s as Record<string, unknown>)[distField] as Record<SemesterKey, number[]> | undefined;
                const values = dist?.[semester] ?? [];
                const total = values.reduce((a: number, b: number) => a + b, 0);

                return (
                  <td key={s.id} className={`${tdBase} font-bold text-slate-800`}>
                    {total}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </A4Paper>
    </div>
  );
}
