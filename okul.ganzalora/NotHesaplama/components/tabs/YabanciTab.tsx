// ============================================================
// Not Hesaplama - Yabanci Dil Tab
// Sub-tabs: speak (Konuşma Sınavı), calc (Not Hesaplama)
// Uses SPEAKING_CRITERIA.yabanci and CALC_WEIGHTS.yabanci
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import A4Paper from '../A4Paper';
import type { SemesterKey } from '../../types';
import { calculateLangScore } from '../../utils/calculations';
import { SPEAKING_CRITERIA, CALC_WEIGHTS } from '../../utils/constants';

// --------------- Constants ---------------

type YabanciSubTab = 'speak' | 'calc';

const SUB_TAB_LABELS: { id: YabanciSubTab; label: string }[] = [
  { id: 'speak', label: 'Konuşma Sınavı' },
  { id: 'calc', label: 'Not Hesaplama' },
];

// Dinamik öğrenci sayısı — context'ten gelir

// --------------- Shared Styles (Portrait) ---------------

const inputCls =
  'w-20 rounded border border-slate-200 bg-[#fffbeb] px-2 py-1.5 text-center text-sm font-bold text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30';

const thCls =
  'border border-slate-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-slate-700';

const tdCls =
  'border border-slate-300 px-2 py-2 text-center text-sm';

const totalCellCls =
  'border border-slate-300 px-2 py-2 text-center text-sm font-bold text-slate-800';

// --------------- Main Component ---------------

export default function YabanciTab() {
  const { state, dispatch, currentStudents } = useNotHesaplama();
  const activeSubTab = (state.activeSubTab['yabanci'] ?? 'speak') as YabanciSubTab;
  const [speakExam, setSpeakExam] = useState<SemesterKey>('1');
  const [calcExam, setCalcExam] = useState<SemesterKey>('1');

  const setSubTab = useCallback(
    (subTabId: YabanciSubTab) => {
      dispatch({ type: 'SET_ACTIVE_SUB_TAB', payload: { tabId: 'yabanci', subTabId } });
    },
    [dispatch],
  );

  // Always render all 40 students
  const allStudents = useMemo(
    () => currentStudents,
    [currentStudents],
  );

  const speakCriteria = SPEAKING_CRITERIA.yabanci;
  const calcWeights = CALC_WEIGHTS.yabanci;

  // --------------- Speaking handlers ---------------

  const handleSpeakChange = useCallback(
    (studentId: number, criterionIdx: number, raw: string) => {
      const n = parseInt(raw, 10);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(20, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: {
          id: studentId,
          fieldPath: `speakYa.${speakExam}.data.${criterionIdx}`,
          value,
        },
      });
      const student = currentStudents.find((s) => s.id === studentId);
      if (student) {
        const data = [...student.speakYa[speakExam].data];
        data[criterionIdx] = value;
        const total = data.reduce((a, b) => a + b, 0);
        dispatch({
          type: 'UPDATE_STUDENT_FIELD',
          payload: { id: studentId, fieldPath: `speakYa.${speakExam}.total`, value: total },
        });
      }
    },
    [dispatch, speakExam, currentStudents],
  );

  // --------------- Calc handlers ---------------

  const handleCalcChange = useCallback(
    (studentId: number, field: 'w' | 'l' | 's', raw: string) => {
      const n = parseInt(raw, 10);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: {
          id: studentId,
          fieldPath: `calcYa.${calcExam}.${field}`,
          value,
        },
      });
      const student = currentStudents.find((s) => s.id === studentId);
      if (student) {
        const calc = { ...student.calcYa[calcExam], [field]: value };
        const r = calculateLangScore(calc.w, calc.l, calc.s);
        dispatch({
          type: 'UPDATE_STUDENT_FIELD',
          payload: { id: studentId, fieldPath: `calcYa.${calcExam}.r`, value: r },
        });
      }
    },
    [dispatch, calcExam, currentStudents],
  );

  // --------------- Render ---------------

  return (
    <div className="space-y-4">

      {/* ---- Konuşma Sınavı ---- */}
      {activeSubTab === 'speak' && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Konuşma Sınavı (Yabancı Dil)
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Sınav:</span>
            {(['1', '2'] as SemesterKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSpeakExam(k)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                  speakExam === k
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {k}. Sınav
              </button>
            ))}
          </div>

          <A4Paper orientation="portrait">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className={`${thCls} w-10 text-center`}>SIRA</th>
                  <th className={`${thCls} w-16 text-center`}>OKUL NO</th>
                  <th className={`${thCls} min-w-[140px] text-left`}>ADI SOYADI</th>
                  {speakCriteria.map((c, i) => (
                    <th key={i} className={`${thCls} w-16 text-center`}>
                      {c} (20)
                    </th>
                  ))}
                  <th className={`${thCls} w-16 text-center`}>TOPLAM</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map((s, idx) => {
                  const speakData = s.speakYa[speakExam];
                  return (
                    <tr
                      key={s.id}
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                    >
                      <td className={`${tdCls} text-[10px] font-medium text-slate-400`}>{idx + 1}</td>
                      <td className={`${tdCls} font-mono text-[10px] font-bold`}>{s.number}</td>
                      <td className={`${tdCls} text-left text-[11px] font-medium text-slate-700`}>
                        {s.name}
                      </td>
                      {speakCriteria.map((_, ci) => (
                        <td key={ci} className={tdCls}>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={speakData.data[ci] ?? 0}
                            onChange={(e) => handleSpeakChange(s.id, ci, e.target.value)}
                            className={inputCls}
                          />
                        </td>
                      ))}
                      <td className={totalCellCls}>
                        {speakData.total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </A4Paper>
        </div>
      )}

      {/* ---- Not Hesaplama ---- */}
      {activeSubTab === 'calc' && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Not Hesaplama (Yabancı Dil)
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Sınav:</span>
            {(['1', '2'] as SemesterKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setCalcExam(k)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                  calcExam === k
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {k}. Sınav
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            {calcWeights.labels[0]} + {calcWeights.labels[1]} + {calcWeights.labels[2]}
          </p>

          <A4Paper orientation="portrait">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className={`${thCls} w-10 text-center`}>SIRA</th>
                  <th className={`${thCls} w-16 text-center`}>OKUL NO</th>
                  <th className={`${thCls} min-w-[140px] text-left`}>ADI SOYADI</th>
                  <th className={`${thCls} w-20 text-center`}>{calcWeights.labels[0]}</th>
                  <th className={`${thCls} w-20 text-center`}>{calcWeights.labels[1]}</th>
                  <th className={`${thCls} w-20 text-center`}>{calcWeights.labels[2]}</th>
                  <th className={`${thCls} w-20 text-center`}>SONUÇ</th>
                </tr>
              </thead>
              <tbody>
                {allStudents.map((s, idx) => {
                  const calc = s.calcYa[calcExam];
                  return (
                    <tr
                      key={s.id}
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                    >
                      <td className={`${tdCls} text-[10px] font-medium text-slate-400`}>{idx + 1}</td>
                      <td className={`${tdCls} font-mono text-[10px] font-bold`}>{s.number}</td>
                      <td className={`${tdCls} text-left text-[11px] font-medium text-slate-700`}>
                        {s.name}
                      </td>
                      {(['w', 'l', 's'] as const).map((f) => (
                        <td key={f} className={tdCls}>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={calc[f]}
                            onChange={(e) => handleCalcChange(s.id, f, e.target.value)}
                            className={inputCls}
                          />
                        </td>
                      ))}
                      <td className={totalCellCls}>
                        {calc.r}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </A4Paper>
        </div>
      )}
    </div>
  );
}
