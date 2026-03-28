// ============================================================
// Not Hesaplama - Edebiyat Tab (Türk Dili ve Edebiyatı)
// Sub-tabs: Tema 1-4, theme25, speak, calc
// Exact table structures from original HTML
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import A4Paper from '../A4Paper';
import type { Student, SemesterKey, ThemeKey } from '../../types';
import { calculateEdScore } from '../../utils/calculations';
import { SPEAKING_CRITERIA, CALC_WEIGHTS } from '../../utils/constants';

// --------------- Theme Criteria Data (exact from old HTML) ---------------

interface ThemeCriterion {
  cat: string;
  desc: string;
}

const THEME_CRITERIA: Record<ThemeKey, ThemeCriterion[]> = {
  '1': [
    { cat: '1. KONUYA HAKİMİYET', desc: 'Konuşma konusuna hakimdir.' },
    { cat: '1. KONUYA HAKİMİYET', desc: 'Konuyla ilgili bilgi ve gözlemlerini paylaşır.' },
    { cat: '1. KONUYA HAKİMİYET', desc: 'Konuşmasını bir plan dahilinde yapar.' },
    { cat: '2. DİL BİLGİSİ', desc: 'Dil bilgisi kurallarına uygun konuşur.' },
    { cat: '2. DİL BİLGİSİ', desc: 'Kelimeleri doğru telaffuz eder.' },
    { cat: '2. DİL BİLGİSİ', desc: 'Konuşmasında uygun geçiş ifadelerini kullanır.' },
    { cat: '3. SÖZ VARLIĞI', desc: 'Zengin bir söz varlığı ile konuşur.' },
    { cat: '3. SÖZ VARLIĞI', desc: 'Yeni öğrendiği kelimeleri konuşmasında kullanır.' },
    { cat: '4. AKICILIK', desc: 'Akıcı ve anlaşılır bir şekilde konuşur.' },
    { cat: '4. AKICILIK', desc: 'Konuşmasında gereksiz tekrarlardan kaçınır.' },
    { cat: '5. BEDEN DİLİ', desc: 'Beden dilini etkili bir şekilde kullanır.' },
    { cat: '5. BEDEN DİLİ', desc: 'Göz teması kurarak konuşur.' },
    { cat: '5. BEDEN DİLİ', desc: 'Ses tonunu ve vurgusunu doğru kullanır.' },
  ],
  '2': [
    { cat: '1. KONUYA HAKİMİYET', desc: 'Konuşma konusuna hakimdir.' },
    { cat: '1. KONUYA HAKİMİYET', desc: 'Konuyla ilgili bilgi ve gözlemlerini paylaşır.' },
    { cat: '1. KONUYA HAKİMİYET', desc: 'Konuşmasını bir plan dahilinde yapar.' },
    { cat: '2. DİL BİLGİSİ', desc: 'Dil bilgisi kurallarına uygun konuşur.' },
    { cat: '2. DİL BİLGİSİ', desc: 'Kelimeleri doğru telaffuz eder.' },
    { cat: '2. DİL BİLGİSİ', desc: 'Konuşmasında uygun geçiş ifadelerini kullanır.' },
    { cat: '3. SÖZ VARLIĞI', desc: 'Zengin bir söz varlığı ile konuşur.' },
    { cat: '3. SÖZ VARLIĞI', desc: 'Yeni öğrendiği kelimeleri konuşmasında kullanır.' },
    { cat: '3. SÖZ VARLIĞI', desc: 'Deyim ve atasözlerini yerinde kullanır.' },
    { cat: '4. AKICILIK', desc: 'Akıcı ve anlaşılır bir şekilde konuşur.' },
    { cat: '4. AKICILIK', desc: 'Konuşmasında gereksiz tekrarlardan kaçınır.' },
    { cat: '5. BEDEN DİLİ', desc: 'Beden dilini etkili bir şekilde kullanır.' },
    { cat: '5. BEDEN DİLİ', desc: 'Göz teması kurarak konuşur.' },
    { cat: '5. BEDEN DİLİ', desc: 'Ses tonunu ve vurgusunu doğru kullanır.' },
  ],
  '3': [
    { cat: '1. KONUYA UYGUNLUK', desc: 'Yazısı konuyla ilgilidir.' },
    { cat: '1. KONUYA UYGUNLUK', desc: 'Ana fikri açık ve net ifade eder.' },
    { cat: '2. ANLATIM BÜTÜNLÜĞÜ', desc: 'Yazısında giriş-gelişme-sonuç bölümleri vardır.' },
    { cat: '2. ANLATIM BÜTÜNLÜĞÜ', desc: 'Paragraflar arası geçişler tutarlıdır.' },
    { cat: '3. DİL BİLGİSİ', desc: 'Dil bilgisi kurallarına uygun yazar.' },
    { cat: '3. DİL BİLGİSİ', desc: 'Cümleleri doğru ve anlamlıdır.' },
    { cat: '4. SÖZ VARLIĞI', desc: 'Zengin bir söz varlığı kullanır.' },
    { cat: '4. SÖZ VARLIĞI', desc: 'Anlatım bozukluğu yapmaz.' },
    { cat: '5. YAZIM KURALLARI', desc: 'Yazım kurallarına uyar.' },
    { cat: '5. YAZIM KURALLARI', desc: 'Noktalama işaretlerini doğru kullanır.' },
  ],
  '4': [
    { cat: '1. KONUYA UYGUNLUK', desc: 'Yazısı konuyla ilgilidir.' },
    { cat: '1. KONUYA UYGUNLUK', desc: 'Ana fikri açık ve net ifade eder.' },
    { cat: '1. KONUYA UYGUNLUK', desc: 'Yardımcı fikirleri destekleyici niteliktedir.' },
    { cat: '2. ANLATIM BÜTÜNLÜĞÜ', desc: 'Yazısında giriş-gelişme-sonuç bölümleri vardır.' },
    { cat: '2. ANLATIM BÜTÜNLÜĞÜ', desc: 'Paragraflar arası geçişler tutarlıdır.' },
    { cat: '3. DİL BİLGİSİ', desc: 'Dil bilgisi kurallarına uygun yazar.' },
    { cat: '3. DİL BİLGİSİ', desc: 'Cümleleri doğru ve anlamlıdır.' },
    { cat: '3. DİL BİLGİSİ', desc: 'Uygun bağlaçlar ve geçiş ifadeleri kullanır.' },
    { cat: '4. SÖZ VARLIĞI', desc: 'Zengin bir söz varlığı kullanır.' },
    { cat: '4. SÖZ VARLIĞI', desc: 'Anlatım bozukluğu yapmaz.' },
    { cat: '5. YAZIM KURALLARI', desc: 'Yazım kurallarına uyar.' },
    { cat: '5. YAZIM KURALLARI', desc: 'Noktalama işaretlerini doğru kullanır.' },
    { cat: '5. YAZIM KURALLARI', desc: 'Sayfa düzeni ve okunaklılığa dikkat eder.' },
  ],
};

// --------------- Sub-tab config ---------------

type EdebiyatSubTab = '1' | '2' | '3' | '4' | 'theme25' | 'speak' | 'calc';

const SUB_TAB_LABELS: { id: EdebiyatSubTab; label: string }[] = [
  { id: '1', label: 'Tema 1 Konuşma' },
  { id: '2', label: 'Tema 2 Konuşma' },
  { id: '3', label: 'Tema 3 Yazma' },
  { id: '4', label: 'Tema 4 Yazma' },
  { id: 'theme25', label: 'Performans Değerlendirme' },
  { id: 'speak', label: 'Konuşma Sınavı' },
  { id: 'calc', label: 'Not Hesaplama' },
];

// Dinamik öğrenci sayısı — context'ten gelir

// --------------- Shared Styles ---------------

// Landscape styles — compact for horizontal theme tables (40 student columns)
const landscapeInput =
  'w-full rounded-none border-none bg-[#fffbeb] px-0 py-0.5 text-center text-[8px] font-bold text-slate-800 focus:bg-blue-50 focus:outline-none';

const landscapeTh =
  'border border-slate-300 bg-gray-100 px-0.5 py-1 text-[8px] font-semibold text-slate-700';

const landscapeTd =
  'border border-slate-300 px-0 py-0 text-center text-[8px]';

const totalRowCls =
  'bg-gray-100';

const landscapeTotalCell =
  'border border-slate-300 px-0 py-0 text-center text-[8px] font-bold text-slate-800';

// Portrait styles — comfortable for vertical tables (speak, calc, theme25)
const portraitTh =
  'border border-slate-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-slate-700';

const portraitTd =
  'border border-slate-300 px-2 py-2 text-center text-sm';

const portraitInput =
  'w-20 rounded border border-slate-200 bg-[#fffbeb] px-2 py-1.5 text-center text-sm font-bold text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30';

const portraitTotalCell =
  'border border-slate-300 px-2 py-2 text-center text-sm font-bold text-slate-800';

// --------------- Helper: compute rowspan groups ---------------

function computeRowSpans(criteria: ThemeCriterion[]): { cat: string; rowSpan: number; startIdx: number }[] {
  const groups: { cat: string; rowSpan: number; startIdx: number }[] = [];
  let i = 0;
  while (i < criteria.length) {
    const cat = criteria[i].cat;
    let count = 0;
    const startIdx = i;
    while (i < criteria.length && criteria[i].cat === cat) {
      count++;
      i++;
    }
    groups.push({ cat, rowSpan: count, startIdx });
  }
  return groups;
}

// --------------- Sub-tab: Horizontal Theme Table ---------------

interface HorizontalThemeTableProps {
  themeKey: ThemeKey;
  students: Student[];
  dispatch: ReturnType<typeof useNotHesaplama>['dispatch'];
}

function HorizontalThemeTable({ themeKey, students, dispatch }: HorizontalThemeTableProps) {
  const criteria = THEME_CRITERIA[themeKey];
  const rowSpanGroups = useMemo(() => computeRowSpans(criteria), [criteria]);

  // Build a set of indices that start a new category
  const catStartIndices = useMemo(() => {
    const map = new Map<number, { cat: string; rowSpan: number }>();
    for (const g of rowSpanGroups) {
      map.set(g.startIdx, { cat: g.cat, rowSpan: g.rowSpan });
    }
    return map;
  }, [rowSpanGroups]);

  const handleScoreChange = useCallback(
    (studentId: number, criterionIdx: number, raw: string) => {
      const n = parseInt(raw, 10);
      const maxPerCriterion = Math.ceil(100 / criteria.length);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(maxPerCriterion, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: {
          id: studentId,
          fieldPath: `themes.${themeKey}.${criterionIdx}`,
          value,
        },
      });
    },
    [dispatch, themeKey, criteria.length],
  );

  return (
    <A4Paper orientation="landscape">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={`${landscapeTh} sticky left-0 z-20 text-left text-[7px]`} style={{ minWidth: '60px', maxWidth: '80px' }}>
              ÖLÇÜTLER
            </th>
            <th className={`${landscapeTh} sticky left-[60px] z-20 text-left text-[7px]`} style={{ minWidth: '120px', maxWidth: '160px' }}>
              AÇIKLAMALAR
            </th>
            {students.map((s, si) => (
              <th key={s.id} className={`${landscapeTh}`} style={{ width: '22px', minWidth: '22px', maxWidth: '22px', height: '140px', padding: '2px 1px' }}>
                <div className="flex flex-col items-center h-full">
                  <span className="text-[7px] text-slate-400 border-b border-slate-300 w-full text-center pb-0.5 mb-0.5">{s.number || (si + 1)}</span>
                  <span
                    className="whitespace-nowrap text-[7px] font-medium text-slate-600 flex-1 flex items-center"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    title={s.name || `#${si + 1}`}
                  >
                    {s.name || '\u00A0'}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((criterion, ci) => {
            const catInfo = catStartIndices.get(ci);
            return (
              <tr key={ci} className={ci % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {catInfo && (
                  <td
                    rowSpan={catInfo.rowSpan}
                    className={`${landscapeTd} sticky left-0 z-10 bg-white text-left text-[7px] font-bold text-slate-700 px-0.5`}
                    style={{ verticalAlign: 'middle', minWidth: '60px', maxWidth: '80px' }}
                  >
                    {catInfo.cat}
                  </td>
                )}
                <td className={`${landscapeTd} sticky left-[60px] z-10 bg-white text-left text-[7px] px-0.5`} style={{ minWidth: '120px', maxWidth: '160px' }}>
                  {criterion.desc}
                </td>
                {students.map((s) => {
                  const scores = s.themes[themeKey] ?? [];
                  return (
                    <td key={s.id} className={landscapeTd}>
                      <input
                        type="number"
                        min={0}
                        max={Math.ceil(100 / criteria.length)}
                        value={scores[ci] ?? 0}
                        onChange={(e) => handleScoreChange(s.id, ci, e.target.value)}
                        className={landscapeInput}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* TOPLAM PUAN row */}
          <tr className={totalRowCls}>
            <td colSpan={2} className={`${landscapeTotalCell} sticky left-0 z-10 bg-gray-100 text-left px-1`}>
              TOPLAM PUAN
            </td>
            {students.map((s) => (
              <td key={s.id} className={landscapeTotalCell}>
                {s.themeTotals[themeKey] ?? 0}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </A4Paper>
  );
}

// --------------- Sub-tab: Theme25 (Performans Özeti) ---------------

interface Theme25PanelProps {
  students: Student[];
  dispatch: ReturnType<typeof useNotHesaplama>['dispatch'];
}

function Theme25Panel({ students, dispatch }: Theme25PanelProps) {
  const handleTargetChange = useCallback(
    (studentId: number, raw: string) => {
      if (raw.toUpperCase() === 'G') {
        dispatch({
          type: 'UPDATE_STUDENT_FIELD',
          payload: { id: studentId, fieldPath: 'target', value: 'G' },
        });
        return;
      }
      const n = parseInt(raw, 10);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: { id: studentId, fieldPath: 'target', value },
      });
    },
    [dispatch],
  );

  const handleBookChange = useCallback(
    (studentId: number, sem: SemesterKey, raw: string) => {
      const n = parseInt(raw, 10);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: { id: studentId, fieldPath: `tdeBooks.${sem}`, value },
      });
    },
    [dispatch],
  );

  return (
    <A4Paper orientation="landscape">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={`${portraitTh} w-10 text-center`}>SIRA</th>
            <th className={`${portraitTh} w-16 text-center`}>OKUL NO</th>
            <th className={`${portraitTh} min-w-[140px] text-left`}>ADI SOYADI</th>
            <th className={`${portraitTh} w-16 text-center`}>1.Tema Konuşma(25)</th>
            <th className={`${portraitTh} w-16 text-center`}>2.Tema Konuşma(25)</th>
            <th className={`${portraitTh} w-16 text-center`}>1.Tema Yazma(25)</th>
            <th className={`${portraitTh} w-16 text-center`}>2.Tema Yazma(25)</th>
            <th className={`${portraitTh} w-16 text-center`}>1.Performans Notu(100)</th>
            <th className={`${portraitTh} w-16 text-center`}>1.Tema Kitap(100)</th>
            <th className={`${portraitTh} w-16 text-center`}>2.Tema Kitap(100)</th>
            <th className={`${portraitTh} w-16 text-center`}>2.Performans Notu(100)</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => {
            const t1 = s.theme25Parts['1'] ?? 0;
            const t2 = s.theme25Parts['2'] ?? 0;
            const t3 = s.theme25Parts['3'] ?? 0;
            const t4 = s.theme25Parts['4'] ?? 0;
            const perf1 = t1 + t2 + t3 + t4;
            const book1 = s.tdeBooks['1'] ?? 0;
            const book2 = s.tdeBooks['2'] ?? 0;
            const bookPerf = Math.round((book1 + book2) / 2);

            return (
              <tr
                key={s.id}
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
              >
                <td className={`${portraitTd} text-xs font-medium text-slate-400`}>{idx + 1}</td>
                <td className={`${portraitTd} font-mono text-xs font-bold`}>{s.number}</td>
                <td className={`${portraitTd} text-left text-sm font-medium text-slate-700`}>
                  {s.name}
                </td>
                {/* Theme 1 Konuşma (25) */}
                <td className={`${portraitTd} font-mono text-slate-600`}>{t1}</td>
                {/* Theme 2 Konuşma (25) */}
                <td className={`${portraitTd} font-mono text-slate-600`}>{t2}</td>
                {/* Theme 1 Yazma (25) - maps to theme3 */}
                <td className={`${portraitTd} font-mono text-slate-600`}>{t3}</td>
                {/* Theme 2 Yazma (25) - maps to theme4 */}
                <td className={`${portraitTd} font-mono text-slate-600`}>{t4}</td>
                {/* 1. Performans Notu (100) = target, editable */}
                <td className={portraitTd}>
                  <input
                    type="text"
                    value={s.target === 'G' ? 'G' : (typeof s.target === 'number' ? s.target : 0)}
                    onChange={(e) => handleTargetChange(s.id, e.target.value)}
                    className={portraitInput}
                  />
                </td>
                {/* 1.Tema Kitap (100) */}
                <td className={portraitTd}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={book1}
                    onChange={(e) => handleBookChange(s.id, '1', e.target.value)}
                    className={portraitInput}
                  />
                </td>
                {/* 2.Tema Kitap (100) */}
                <td className={portraitTd}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={book2}
                    onChange={(e) => handleBookChange(s.id, '2', e.target.value)}
                    className={portraitInput}
                  />
                </td>
                {/* 2. Performans Notu (100) = bookPerf (avg of book1 and book2) */}
                <td className={`${portraitTd} font-bold text-slate-800`}>
                  {bookPerf}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </A4Paper>
  );
}

// --------------- Sub-tab: Speaking Exam ---------------

interface SpeakPanelProps {
  students: Student[];
  dispatch: ReturnType<typeof useNotHesaplama>['dispatch'];
}

function SpeakPanel({ students, dispatch }: SpeakPanelProps) {
  const [exam, setExam] = useState<SemesterKey>('1');
  const criteria = SPEAKING_CRITERIA.edebiyat;

  const handleChange = useCallback(
    (studentId: number, criterionIdx: number, raw: string) => {
      const n = parseInt(raw, 10);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(20, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: {
          id: studentId,
          fieldPath: `speakEd.${exam}.data.${criterionIdx}`,
          value,
        },
      });
      const student = students.find((s) => s.id === studentId);
      if (student) {
        const data = [...student.speakEd[exam].data];
        data[criterionIdx] = value;
        const total = data.reduce((a, b) => a + b, 0);
        dispatch({
          type: 'UPDATE_STUDENT_FIELD',
          payload: { id: studentId, fieldPath: `speakEd.${exam}.total`, value: total },
        });
      }
    },
    [dispatch, exam, students],
  );

  return (
    <div className="space-y-3">
      {/* Exam selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Sınav:</span>
        {(['1', '2'] as SemesterKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setExam(k)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
              exam === k
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
              <th className={`${portraitTh} w-10 text-center`}>SIRA</th>
              <th className={`${portraitTh} w-16 text-center`}>OKUL NO</th>
              <th className={`${portraitTh} min-w-[140px] text-left`}>ADI SOYADI</th>
              {criteria.map((c, i) => (
                <th key={i} className={`${portraitTh} w-16 text-center`}>
                  {c} (20)
                </th>
              ))}
              <th className={`${portraitTh} w-16 text-center`}>TOPLAM</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => {
              const speakData = s.speakEd[exam];
              return (
                <tr
                  key={s.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                >
                  <td className={`${portraitTd} text-xs font-medium text-slate-400`}>{idx + 1}</td>
                  <td className={`${portraitTd} font-mono text-xs font-bold`}>{s.number}</td>
                  <td className={`${portraitTd} text-left text-sm font-medium text-slate-700`}>
                    {s.name}
                  </td>
                  {criteria.map((_, ci) => (
                    <td key={ci} className={portraitTd}>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={speakData.data[ci] ?? 0}
                        onChange={(e) => handleChange(s.id, ci, e.target.value)}
                        className={portraitInput}
                      />
                    </td>
                  ))}
                  <td className={portraitTotalCell}>
                    {speakData.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </A4Paper>
    </div>
  );
}

// --------------- Sub-tab: Calc (Not Hesaplama) ---------------

interface CalcPanelProps {
  students: Student[];
  dispatch: ReturnType<typeof useNotHesaplama>['dispatch'];
}

function CalcPanel({ students, dispatch }: CalcPanelProps) {
  const [exam, setExam] = useState<SemesterKey>('1');
  const weights = CALC_WEIGHTS.edebiyat;

  const handleChange = useCallback(
    (studentId: number, field: 'w' | 'l' | 's', raw: string) => {
      const n = parseInt(raw, 10);
      const value = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: {
          id: studentId,
          fieldPath: `calcEd.${exam}.${field}`,
          value,
        },
      });
      const student = students.find((s) => s.id === studentId);
      if (student) {
        const calc = { ...student.calcEd[exam], [field]: value };
        const r = calculateEdScore(calc.w, calc.l, calc.s);
        dispatch({
          type: 'UPDATE_STUDENT_FIELD',
          payload: { id: studentId, fieldPath: `calcEd.${exam}.r`, value: r },
        });
      }
    },
    [dispatch, exam, students],
  );

  return (
    <div className="space-y-3">
      {/* Exam selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Sınav:</span>
        {(['1', '2'] as SemesterKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setExam(k)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
              exam === k
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {k}. Sınav
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        {weights.labels[0]} + {weights.labels[1]} + {weights.labels[2]}
      </p>

      <A4Paper orientation="portrait">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className={`${portraitTh} w-10 text-center`}>SIRA</th>
              <th className={`${portraitTh} w-16 text-center`}>OKUL NO</th>
              <th className={`${portraitTh} min-w-[140px] text-left`}>ADI SOYADI</th>
              <th className={`${portraitTh} w-20 text-center`}>{weights.labels[0]}</th>
              <th className={`${portraitTh} w-20 text-center`}>{weights.labels[1]}</th>
              <th className={`${portraitTh} w-20 text-center`}>{weights.labels[2]}</th>
              <th className={`${portraitTh} w-20 text-center`}>SONUÇ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => {
              const calc = s.calcEd[exam];
              return (
                <tr
                  key={s.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
                >
                  <td className={`${portraitTd} text-xs font-medium text-slate-400`}>{idx + 1}</td>
                  <td className={`${portraitTd} font-mono text-xs font-bold`}>{s.number}</td>
                  <td className={`${portraitTd} text-left text-sm font-medium text-slate-700`}>
                    {s.name}
                  </td>
                  {(['w', 'l', 's'] as const).map((f) => (
                    <td key={f} className={portraitTd}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={calc[f]}
                        onChange={(e) => handleChange(s.id, f, e.target.value)}
                        className={portraitInput}
                      />
                    </td>
                  ))}
                  <td className={portraitTotalCell}>
                    {calc.r}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </A4Paper>
    </div>
  );
}

// --------------- Main EdebiyatTab ---------------

export default function EdebiyatTab() {
  const { state, dispatch, currentStudents } = useNotHesaplama();
  const activeSubTab = (state.activeSubTab['edebiyat'] ?? '1') as EdebiyatSubTab;

  const setSubTab = useCallback(
    (subTabId: EdebiyatSubTab) => {
      dispatch({ type: 'SET_ACTIVE_SUB_TAB', payload: { tabId: 'edebiyat', subTabId } });
    },
    [dispatch],
  );

  // Always use all 40 students (render even when empty)
  const allStudents = useMemo(
    () => currentStudents,
    [currentStudents],
  );

  return (
    <div className="space-y-4">
      {/* Sub-tab content — sub-tab butonları TabBar'da */}
      {(activeSubTab === '1' || activeSubTab === '2' || activeSubTab === '3' || activeSubTab === '4') && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Tema {activeSubTab} &mdash; {activeSubTab <= '2' ? 'Konuşma' : 'Yazma'} Performansı
          </h3>
          <HorizontalThemeTable
            themeKey={activeSubTab as ThemeKey}
            students={allStudents}
            dispatch={dispatch}
          />
        </div>
      )}

      {activeSubTab === 'theme25' && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Performans Değerlendirme Özeti
          </h3>
          <Theme25Panel students={allStudents} dispatch={dispatch} />
        </div>
      )}

      {activeSubTab === 'speak' && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Konuşma Sınavı (Edebiyat)
          </h3>
          <SpeakPanel students={allStudents} dispatch={dispatch} />
        </div>
      )}

      {activeSubTab === 'calc' && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Not Hesaplama (Edebiyat)
          </h3>
          <CalcPanel students={allStudents} dispatch={dispatch} />
        </div>
      )}
    </div>
  );
}
