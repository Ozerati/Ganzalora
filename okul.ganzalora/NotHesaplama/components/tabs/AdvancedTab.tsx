// ============================================================
// Not Hesaplama - Advanced Tab (Diğer Dersler / Performans)
// Sub-sections: Performans, Sınav, Dil, Proje
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import A4Paper from '../A4Paper';
import { distribute } from '../../utils/calculations';
import {
  ADV_PERF_CRITERIA,
  ADV_PERF_9I,
  ADV_9I_SCORE_BY_TOTAL,
  ADV_PERF_12I,
  scoreToGrade,
} from '../../utils/constants';
import type { AdvPerfScheme, AdvPerfKey, SemesterKey, Student } from '../../types';

// --------------- Constants ---------------

type SubSection = 'perf' | 'exam' | 'lang' | 'project';

const SUB_SECTIONS: { id: SubSection; label: string }[] = [
  { id: 'perf', label: 'Performans' },
  { id: 'exam', label: 'Sınav' },
  { id: 'lang', label: 'Dil' },
  { id: 'project', label: 'Proje' },
];

const PERF_SCHEME_OPTIONS: { id: AdvPerfScheme; label: string }[] = [
  { id: 'standard20', label: 'Standart (20 kriter)' },
  { id: 'alt9i', label: 'Alternatif (9 kriter)' },
  { id: 'alt12i', label: 'Alternatif (12 kriter)' },
];

const PERF_KEYS: AdvPerfKey[] = ['1', '2', '3'];
const SEM_KEYS: SemesterKey[] = ['1', '2'];
// Dinamik öğrenci sayısı — context'ten gelir

function getCriteriaCount(scheme: AdvPerfScheme): number {
  switch (scheme) {
    case 'standard20': return 20;
    case 'alt9i': return 9;
    case 'alt12i': return 12;
  }
}

// --------------- Category rowspan helper for standard20 ---------------

interface CategoryGroup {
  name: string;
  startIdx: number;
  count: number;
}

function buildCategoryGroups(): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  let currentCat = '';
  let startIdx = 0;
  let count = 0;

  ADV_PERF_CRITERIA.forEach((c, i) => {
    if (c.cat !== currentCat) {
      if (count > 0) {
        groups.push({ name: currentCat, startIdx, count });
      }
      currentCat = c.cat;
      startIdx = i;
      count = 1;
    } else {
      count++;
    }
  });
  if (count > 0) {
    groups.push({ name: currentCat, startIdx, count });
  }
  return groups;
}

const CATEGORY_GROUPS = buildCategoryGroups();

// --------------- Shared styles ---------------

// Landscape styles — compact for horizontal performance tables (40 student columns)
const thBase =
  'border border-slate-300 px-0.5 py-1 text-[8px] font-semibold text-slate-700';
const tdBase =
  'border border-slate-300 px-0 py-0 text-center text-[8px]';
const inputCls =
  'w-full rounded-none border-none bg-[#fffbeb] px-0 py-0.5 text-center text-[8px] font-bold text-slate-800 focus:bg-blue-50 focus:outline-none';

// Portrait styles — comfortable for vertical tables (exam, lang, project)
const portraitTh =
  'border border-slate-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-slate-700';
const portraitTd =
  'border border-slate-300 px-2 py-2 text-center text-sm';
const portraitInput =
  'w-20 rounded border border-slate-200 bg-[#fffbeb] px-2 py-1.5 text-center text-sm font-bold text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30';

// --------------- Shared Sub-components ---------------

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-4 border border-slate-300">
      <h3 className="mb-3 text-base font-bold text-slate-700">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ScoreInput({
  value,
  onChange,
  placeholder = '0',
  className = '',
}: {
  value: number | string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-16 rounded-lg border border-transparent bg-[#fffbeb] px-2 py-1.5 text-center text-sm font-bold text-slate-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 ${className}`}
    />
  );
}

// --------------- Main Component ---------------

export default function AdvancedTab() {
  const { state, currentStudents, dispatch } = useNotHesaplama();
  const [activeSection, setActiveSection] = useState<SubSection>('perf');
  const [activePerfKey, setActivePerfKey] = useState<AdvPerfKey>('1');
  const [activeExamSem, setActiveExamSem] = useState<SemesterKey>('1');
  const [activeLangSem, setActiveLangSem] = useState<SemesterKey>('1');

  const scheme = state.advPerfScheme;
  const criteriaCount = getCriteriaCount(scheme);

  // All 40 students (render even when empty)
  const allStudents = currentStudents;

  // --------------- Dispatch helpers ---------------

  const updateField = useCallback(
    (id: number, fieldPath: string, value: unknown) => {
      dispatch({ type: 'UPDATE_STUDENT_FIELD', payload: { id, fieldPath, value } });
    },
    [dispatch],
  );

  const parseNum = (raw: string): number => {
    if (raw.toUpperCase() === 'G') return 0;
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
  };

  // --------------- Auto-distribute ---------------

  const handleAutoDistributePerf = useCallback(() => {
    dispatch({ type: 'PUSH_UNDO', payload: 'Performans otomatik dağıtım öncesi' });
    allStudents.forEach((s) => {
      if (!s.name.trim()) return;
      const total = s.advPerf[parseInt(activePerfKey) - 1] ?? 0;
      const maxPer = scheme === 'standard20' ? 5 : 12;
      const dist = distribute(total, criteriaCount, maxPer);

      const fieldBase =
        scheme === 'standard20'
          ? `advPerfDist.${activePerfKey}`
          : scheme === 'alt9i'
            ? `advPerfAlt.${activePerfKey}`
            : `advPerf12Dist.${activePerfKey}`;

      updateField(s.id, fieldBase, dist);
    });
  }, [allStudents, activePerfKey, scheme, criteriaCount, dispatch, updateField]);

  const handleAutoDistributeExam = useCallback(() => {
    dispatch({ type: 'PUSH_UNDO', payload: 'Sınav otomatik dağıtım öncesi' });
  }, [dispatch]);

  const handleAutoDistributeLang = useCallback(() => {
    dispatch({ type: 'PUSH_UNDO', payload: 'Dil otomatik dağıtım öncesi' });
    allStudents.forEach((s) => {
      if (!s.name.trim()) return;
      const lang = s.advLang[activeLangSem];
      const total = lang.y + lang.d + lang.k;
      if (total > 0) {
        const avg = Math.round(total / 3);
        updateField(s.id, `advLang.${activeLangSem}.o`, avg);
      }
    });
  }, [allStudents, activeLangSem, dispatch, updateField]);

  // --------------- Helper: vertical header cell ---------------

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

  // ===============================================================
  // RENDER: PERFORMANS - standard20
  // ===============================================================

  const renderPerfStandard20 = () => {
    const perfIdx = parseInt(activePerfKey) - 1;

    return (
      <A4Paper orientation="landscape">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className={`${thBase} text-center`} rowSpan={2}>ÖLÇÜTLER</th>
              <th className={`${thBase} text-center`} rowSpan={2}>AÇIKLAMALAR</th>
              {allStudents.map((s, idx) => (
                <VerticalStudentHeader key={s.id} s={s} idx={idx} />
              ))}
            </tr>
          </thead>
          <tbody>
            {ADV_PERF_CRITERIA.map((criterion, rowIdx) => {
              // Determine if this row starts a new category
              const catGroup = CATEGORY_GROUPS.find((g) => g.startIdx === rowIdx);

              return (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {catGroup && (
                    <td
                      className={`${tdBase} bg-gray-100 font-bold text-slate-700 text-[7px]`}
                      rowSpan={catGroup.count}
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', minWidth: '1.2rem', maxWidth: '1.5rem' }}
                    >
                      {catGroup.name}
                    </td>
                  )}
                  <td className={`${tdBase} text-left text-[7px] text-slate-600 whitespace-nowrap px-1`} style={{ minWidth: '120px', maxWidth: '160px' }}>
                    {criterion.desc}
                  </td>
                  {allStudents.map((s) => {
                    const dist = s.advPerfDist[activePerfKey] ?? [];
                    const val = dist[rowIdx] ?? 0;
                    return (
                      <td key={s.id} className={tdBase}>
                        <input
                          type="text"
                          value={val || ''}
                          onChange={(e) => {
                            const newDist = [...(s.advPerfDist[activePerfKey] ?? [])];
                            while (newDist.length <= rowIdx) newDist.push(0);
                            newDist[rowIdx] = parseNum(e.target.value);
                            updateField(s.id, `advPerfDist.${activePerfKey}`, newDist);
                          }}
                          className={inputCls}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* TOPLAM PUAN row */}
            <tr className="bg-gray-100">
              <td colSpan={2} className={`${tdBase} font-bold text-slate-800 text-right px-3`}>
                TOPLAM PUAN
              </td>
              {allStudents.map((s) => {
                const dist = s.advPerfDist[activePerfKey] ?? [];
                const total = dist.reduce((a: number, b: number) => a + b, 0);
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
    );
  };

  // ===============================================================
  // RENDER: PERFORMANS - alt9i
  // ===============================================================

  const renderPerfAlt9i = () => {
    const groups = ADV_PERF_9I.groups;
    const levels = ADV_PERF_9I.levels;

    return (
      <A4Paper orientation="portrait">
        <table className="w-full border-collapse text-xs">
          <thead>
            {/* Group names row */}
            <tr className="bg-gray-100">
              <th className={`${thBase} text-center`} rowSpan={2}>SIRA</th>
              <th className={`${thBase} text-center`} rowSpan={2}>OKUL NO</th>
              <th className={`${thBase} text-center`} rowSpan={2}>ADI SOYADI</th>
              {groups.map((g, gi) => (
                <th key={gi} className={`${thBase} text-center`} colSpan={levels.length}>
                  <span
                    className="inline-block text-[9px] font-bold text-slate-600"
                  >
                    {g.name}
                  </span>
                </th>
              ))}
              <th className={`${thBase} text-center`} rowSpan={2}>TOPLAM</th>
              <th className={`${thBase} text-center`} rowSpan={2}>NOT</th>
            </tr>
            {/* Level labels row */}
            <tr className="bg-gray-100">
              {groups.map((g, gi) =>
                levels.map((lvl, li) => (
                  <th key={`${gi}-${li}`} className={`${thBase} text-center text-[9px] w-8`}>
                    <div className="flex flex-col items-center">
                      <span>{lvl}</span>
                      <span className="text-[8px] text-slate-400">({g.points[li]})</span>
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {allStudents.map((s, idx) => {
              const altDist = s.advPerfAlt[activePerfKey] ?? [];
              // Calculate total from selected levels
              let total = 0;
              const selectedLevels: (number | null)[] = [];
              groups.forEach((g, gi) => {
                const selectedLevel = altDist[gi] ?? null;
                selectedLevels.push(selectedLevel);
                if (selectedLevel !== null && selectedLevel >= 0 && selectedLevel < levels.length) {
                  total += g.points[selectedLevel];
                }
              });

              // Find closest mapping for grade
              const keys = Object.keys(ADV_9I_SCORE_BY_TOTAL).map(Number).sort((a, b) => a - b);
              let closestKey = 0;
              for (const k of keys) {
                if (k <= total) closestKey = k;
              }
              const grade = scoreToGrade(total);

              return (
                <tr
                  key={s.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                >
                  <td className={`${tdBase} text-slate-400 font-medium`}>{idx + 1}</td>
                  <td className={`${tdBase} font-mono`}>{s.number}</td>
                  <td className={`${tdBase} text-left px-2 font-medium text-slate-700 whitespace-nowrap`}>
                    {s.name || '\u00A0'}
                  </td>
                  {groups.map((g, gi) =>
                    levels.map((_, li) => {
                      const isSelected = selectedLevels[gi] === li;
                      return (
                        <td
                          key={`${gi}-${li}`}
                          className={`${tdBase} cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-100'
                              : 'hover:bg-blue-50'
                          }`}
                          onClick={() => {
                            const newDist = [...(s.advPerfAlt[activePerfKey] ?? Array(groups.length).fill(null))];
                            while (newDist.length < groups.length) newDist.push(null);
                            newDist[gi] = isSelected ? null : li;
                            updateField(s.id, `advPerfAlt.${activePerfKey}`, newDist);
                          }}
                        >
                          {isSelected ? (
                            <span className="font-bold text-blue-600">{g.points[li]}</span>
                          ) : (
                            <span className="text-slate-300">&middot;</span>
                          )}
                        </td>
                      );
                    })
                  )}
                  <td className={`${tdBase} font-bold text-slate-800`}>{total}</td>
                  <td className={`${tdBase} font-bold text-slate-800`}>{grade === 'G' ? 'G' : grade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </A4Paper>
    );
  };

  // ===============================================================
  // RENDER: PERFORMANS - alt12i
  // ===============================================================

  const renderPerfAlt12i = () => {
    const criteria = ADV_PERF_12I.criteria;
    const points = ADV_PERF_12I.points; // [2,3,4,5]

    return (
      <A4Paper orientation="landscape">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className={`${thBase} text-center`} rowSpan={2}>ÖLÇÜTLER</th>
              <th className={`${thBase} text-center text-[9px]`} rowSpan={2}>
                PUAN<br/>({points.join('-')})
              </th>
              {allStudents.map((s, idx) => (
                <VerticalStudentHeader key={s.id} s={s} idx={idx} />
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((crit, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className={`${tdBase} text-left text-[7px] text-slate-600 whitespace-nowrap px-1`} style={{ minWidth: '120px', maxWidth: '160px' }}>
                  {rowIdx + 1}. {crit}
                </td>
                <td className={`${tdBase} text-[9px] text-slate-400`}>
                  {points[0]}-{points[points.length - 1]}
                </td>
                {allStudents.map((s) => {
                  const dist = s.advPerf12Dist[activePerfKey] ?? [];
                  const val = dist[rowIdx] ?? 0;
                  return (
                    <td key={s.id} className={tdBase}>
                      <input
                        type="text"
                        value={val || ''}
                        onChange={(e) => {
                          const newDist = [...(s.advPerf12Dist[activePerfKey] ?? [])];
                          while (newDist.length <= rowIdx) newDist.push(0);
                          newDist[rowIdx] = parseNum(e.target.value);
                          updateField(s.id, `advPerf12Dist.${activePerfKey}`, newDist);
                        }}
                        className={inputCls}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* TOPLAM PUAN row */}
            <tr className="bg-gray-100">
              <td className={`${tdBase} font-bold text-slate-800 text-right px-3`}>
                TOPLAM PUAN
              </td>
              <td className={tdBase}></td>
              {allStudents.map((s) => {
                const dist = s.advPerf12Dist[activePerfKey] ?? [];
                const total = dist.reduce((a: number, b: number) => a + b, 0);
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
    );
  };

  // ===============================================================
  // RENDER: PERFORMANS (all schemes)
  // ===============================================================

  const renderPerformans = () => (
    <SectionCard title="Performans Notları">
      {/* Scheme selector */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-semibold text-slate-500">
          Dağılım Şeması
        </label>
        <div className="flex gap-2">
          {PERF_SCHEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => dispatch({ type: 'SET_ADV_PERF_SCHEME', payload: opt.id })}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                scheme === opt.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Perf key selector */}
      <div className="mb-4 flex items-center gap-2">
        {PERF_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setActivePerfKey(k)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activePerfKey === k
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Performans {k}
          </button>
        ))}

        <button
          type="button"
          onClick={handleAutoDistributePerf}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.97]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Otomatik Dağıt
        </button>
      </div>

      {/* Render scheme-specific table */}
      {scheme === 'standard20' && renderPerfStandard20()}
      {scheme === 'alt9i' && renderPerfAlt9i()}
      {scheme === 'alt12i' && renderPerfAlt12i()}
    </SectionCard>
  );

  // ===============================================================
  // RENDER: SINAV (Exam)
  // ===============================================================

  const renderExam = () => (
    <SectionCard title="Sınav Notları">
      <div className="mb-4 flex items-center gap-2">
        {SEM_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setActiveExamSem(k)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeExamSem === k
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sınav {k}
          </button>
        ))}

        <button
          type="button"
          onClick={handleAutoDistributeExam}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.97]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Otomatik Dağıt
        </button>
      </div>

      <A4Paper orientation="portrait">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className={`${portraitTh} w-14 text-center`}>SIRA</th>
              <th className={`${portraitTh} w-24 text-center`}>OKUL NO</th>
              <th className={`${portraitTh} w-16 text-center`}>DURUM</th>
              <th className={`${portraitTh} text-left`}>ADI SOYADI</th>
              <th className={`${portraitTh} w-20 text-center`}>PUAN</th>
              <th className={`${portraitTh} w-16 text-center`}>NOT</th>
            </tr>
          </thead>
          <tbody>
            {allStudents.map((s, idx) => {
              const score = s.advExam[activeExamSem] ?? 0;
              const grade = scoreToGrade(score);
              const durum = s.name.trim() ? (s.target === 'G' ? 'Muaf' : '') : '';

              return (
                <tr
                  key={s.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                >
                  <td className={`${portraitTd} text-xs font-medium text-slate-400`}>{idx + 1}</td>
                  <td className={`${portraitTd} font-mono text-xs`}>{s.number}</td>
                  <td className={`${portraitTd} text-xs text-slate-500`}>{durum}</td>
                  <td className={`${portraitTd} text-left px-2 font-medium text-slate-700`}>
                    {s.name || '\u00A0'}
                  </td>
                  <td className={portraitTd}>
                    <input
                      type="text"
                      value={score || ''}
                      onChange={(e) => updateField(s.id, `advExam.${activeExamSem}`, parseNum(e.target.value))}
                      className={portraitInput}
                    />
                  </td>
                  <td className={`${portraitTd} font-bold text-slate-800`}>
                    {score > 0 ? (grade === 'G' ? 'G' : grade) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </A4Paper>
    </SectionCard>
  );

  // ===============================================================
  // RENDER: DİL (Lang)
  // ===============================================================

  const renderLang = () => (
    <SectionCard title="Dil Notları">
      <div className="mb-4 flex items-center gap-2">
        {SEM_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setActiveLangSem(k)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeLangSem === k
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Dönem {k}
          </button>
        ))}

        <button
          type="button"
          onClick={handleAutoDistributeLang}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.97]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Otomatik Dağıt
        </button>
      </div>

      <A4Paper orientation="portrait">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className={`${portraitTh} w-14 text-center`}>SIRA</th>
              <th className={`${portraitTh} w-24 text-center`}>OKUL NO</th>
              <th className={`${portraitTh} w-16 text-center`}>DURUM</th>
              <th className={`${portraitTh} text-left`}>ADI SOYADI</th>
              <th className={`${portraitTh} w-16 text-center`}>Y</th>
              <th className={`${portraitTh} w-16 text-center`}>D</th>
              <th className={`${portraitTh} w-16 text-center`}>K</th>
              <th className={`${portraitTh} w-16 text-center`}>ORT.</th>
            </tr>
          </thead>
          <tbody>
            {allStudents.map((s, idx) => {
              const lang = s.advLang[activeLangSem];
              const durum = s.name.trim() ? (s.target === 'G' ? 'Muaf' : '') : '';

              return (
                <tr
                  key={s.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                >
                  <td className={`${portraitTd} text-xs font-medium text-slate-400`}>{idx + 1}</td>
                  <td className={`${portraitTd} font-mono text-xs`}>{s.number}</td>
                  <td className={`${portraitTd} text-xs text-slate-500`}>{durum}</td>
                  <td className={`${portraitTd} text-left px-2 font-medium text-slate-700`}>
                    {s.name || '\u00A0'}
                  </td>
                  <td className={portraitTd}>
                    <input
                      type="text"
                      value={lang.y || ''}
                      onChange={(e) => updateField(s.id, `advLang.${activeLangSem}.y`, parseNum(e.target.value))}
                      className={portraitInput}
                    />
                  </td>
                  <td className={portraitTd}>
                    <input
                      type="text"
                      value={lang.d || ''}
                      onChange={(e) => updateField(s.id, `advLang.${activeLangSem}.d`, parseNum(e.target.value))}
                      className={portraitInput}
                    />
                  </td>
                  <td className={portraitTd}>
                    <input
                      type="text"
                      value={lang.k || ''}
                      onChange={(e) => updateField(s.id, `advLang.${activeLangSem}.k`, parseNum(e.target.value))}
                      className={portraitInput}
                    />
                  </td>
                  <td className={portraitTd}>
                    <input
                      type="text"
                      value={lang.o || ''}
                      onChange={(e) => updateField(s.id, `advLang.${activeLangSem}.o`, parseNum(e.target.value))}
                      className={`${portraitInput} bg-[#fffbeb]`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </A4Paper>
    </SectionCard>
  );

  // ===============================================================
  // RENDER: PROJE (Project)
  // ===============================================================

  const renderProject = () => (
    <SectionCard title="Proje Notları">
      <A4Paper orientation="portrait">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className={`${portraitTh} w-14 text-center`}>SIRA</th>
              <th className={`${portraitTh} w-24 text-center`}>OKUL NO</th>
              <th className={`${portraitTh} w-16 text-center`}>DURUM</th>
              <th className={`${portraitTh} text-left`}>ADI SOYADI</th>
              <th className={`${portraitTh} w-20 text-center`}>PUAN</th>
              <th className={`${portraitTh} w-16 text-center`}>NOT</th>
            </tr>
          </thead>
          <tbody>
            {allStudents.map((s, idx) => {
              const rawScore = s.advProject;
              const isExempt = rawScore === 'G';
              const score = isExempt ? 0 : (rawScore as number);
              const grade = isExempt ? 'G' : scoreToGrade(score);
              const durum = s.name.trim() ? (isExempt ? 'Muaf' : '') : '';

              return (
                <tr
                  key={s.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                >
                  <td className={`${portraitTd} text-xs font-medium text-slate-400`}>{idx + 1}</td>
                  <td className={`${portraitTd} font-mono text-xs`}>{s.number}</td>
                  <td className={`${portraitTd} text-xs text-slate-500`}>{durum}</td>
                  <td className={`${portraitTd} text-left px-2 font-medium text-slate-700`}>
                    {s.name || '\u00A0'}
                  </td>
                  <td className={portraitTd}>
                    <input
                      type="text"
                      value={isExempt ? 'G' : (score || '')}
                      onChange={(e) => {
                        const v = e.target.value;
                        const val = v.toUpperCase() === 'G' ? 'G' : parseNum(v);
                        updateField(s.id, 'advProject', val);
                      }}
                      className={portraitInput}
                    />
                  </td>
                  <td className={`${portraitTd} font-bold text-slate-800`}>
                    {score > 0 || isExempt ? (grade === 'G' ? 'G' : grade) : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </A4Paper>
    </SectionCard>
  );

  // ===============================================================
  // MAIN RENDER
  // ===============================================================

  return (
    <div className="space-y-4">
      {/* ---- Header ---- */}
      <h2 className="text-lg font-bold text-slate-800">
        Diğer Dersler / İleri Modül
      </h2>

      {/* ---- Sub-section tabs ---- */}
      <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-sm">
        {SUB_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeSection === sec.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ---- Active section content ---- */}
      {activeSection === 'perf' && renderPerformans()}
      {activeSection === 'exam' && renderExam()}
      {activeSection === 'lang' && renderLang()}
      {activeSection === 'project' && renderProject()}
    </div>
  );
}
