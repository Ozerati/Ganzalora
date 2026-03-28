// ============================================================
// Not Hesaplama - Preview / e-Okul Import Tab (Önizleme)
// Full table structures for lang, other, pe modes
// All editable cells, always renders 40 student rows
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';

import { parseEokulPaste } from '../../utils/parsing';
import type { PreviewRow } from '../../types';

type EokulMode = 'lang' | 'other' | 'pe';

const MODE_OPTIONS: { id: EokulMode; label: string }[] = [
  { id: 'lang', label: 'Dil Dersleri' },
  { id: 'other', label: 'Diğer Dersler' },
  { id: 'pe', label: 'Beden Eğitimi' },
];

const MAX_STUDENTS = 40;

// --------------- Shared Styles ---------------

const inputCls =
  'w-12 rounded border border-transparent bg-[#fffbeb] px-0.5 py-0.5 text-center text-[10px] font-bold text-slate-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30';

const thCls =
  'border border-slate-300 bg-gray-100 px-1 py-1 text-[9px] font-semibold text-slate-700 uppercase tracking-wide';

const tdCls =
  'border border-slate-300 px-1 py-0.5 text-center text-[10px]';

const totalCellCls =
  'border border-slate-300 px-1 py-0.5 text-center text-[10px] font-bold text-slate-800';

// --------------- Extended PreviewRow for all columns ---------------

interface FullPreviewRow {
  no: string;
  name: string;
  // Lang mode - exam 1 nested
  s1y?: number; s1d?: number; s1k?: number; s1ort?: number;
  // Lang mode - exam 2 nested
  s2y?: number; s2d?: number; s2k?: number; s2ort?: number;
  // Exams 3-6 (simple)
  sinav3?: number; sinav4?: number; sinav5?: number; sinav6?: number;
  // Perf 1-3
  perf1?: number; perf2?: number; perf3?: number;
  // Uyg 1-3
  uyg1?: number; uyg2?: number; uyg3?: number;
  // Project
  proje?: number | 'G';
  // Muaf
  muaf?: boolean;
  // Calculated
  puan?: number;
  // Simple mode
  sinav1?: number | 'G';
  sinav2?: number | 'G';
}

function makeEmptyRows(count: number): FullPreviewRow[] {
  return Array.from({ length: count }, (_, i) => ({
    no: '',
    name: '',
  }));
}

export default function PreviewTab() {
  const { state, dispatch, currentStudents } = useNotHesaplama();

  const [mode, setMode] = useState<EokulMode>('lang');
  const [pasteText, setPasteText] = useState('');
  const [parsedRows, setParsedRows] = useState<PreviewRow[]>([]);
  const [editableRows, setEditableRows] = useState<FullPreviewRow[]>(makeEmptyRows(MAX_STUDENTS));

  // Merge student data into editable rows
  useMemo(() => {
    const rows: FullPreviewRow[] = [];
    for (let i = 0; i < MAX_STUDENTS; i++) {
      const s = currentStudents[i];
      rows.push({
        no: s?.number || '',
        name: s?.name || '',
        // Initialize with existing parsed data or defaults
        ...editableRows[i],
        no: s?.number || editableRows[i]?.no || '',
        name: s?.name || editableRows[i]?.name || '',
      });
    }
    // Don't setState during render - we just use current data
    return rows;
  }, [currentStudents]);

  // --------------- Parse on textarea change ---------------

  const handlePasteChange = useCallback((text: string) => {
    setPasteText(text);
    if (text.trim()) {
      const rows = parseEokulPaste(text);
      setParsedRows(rows);
      // Map parsed rows to editable rows
      const newEditable = makeEmptyRows(MAX_STUDENTS);
      rows.forEach((r, i) => {
        if (i < MAX_STUDENTS) {
          newEditable[i] = { ...newEditable[i], ...r };
        }
      });
      setEditableRows(newEditable);
    } else {
      setParsedRows([]);
      setEditableRows(makeEmptyRows(MAX_STUDENTS));
    }
  }, []);

  // --------------- Cell edit handler ---------------

  const handleCellChange = useCallback(
    (rowIdx: number, field: keyof FullPreviewRow, raw: string) => {
      setEditableRows((prev) => {
        const next = [...prev];
        const row = { ...next[rowIdx] };
        if (field === 'muaf') {
          (row as Record<string, unknown>)[field] = raw === 'true';
        } else if (field === 'no' || field === 'name') {
          (row as Record<string, unknown>)[field] = raw;
        } else if (raw.toUpperCase() === 'G') {
          (row as Record<string, unknown>)[field] = 'G';
        } else {
          const n = parseInt(raw, 10);
          (row as Record<string, unknown>)[field] = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
        }
        next[rowIdx] = row;
        return next;
      });
    },
    [],
  );

  // --------------- Import ---------------

  const handleImport = useCallback(() => {
    const dataToImport = editableRows.filter((r) => r.no || r.name);
    if (dataToImport.length === 0) return;

    dispatch({ type: 'PUSH_UNDO', payload: 'e-Okul içe aktarma öncesi' });
    dispatch({
      type: 'IMPORT_EOKUL_DATA',
      payload: dataToImport.map((row) => ({
        no: row.no,
        name: row.name,
      })),
    });
  }, [editableRows, dispatch]);

  // --------------- Render: Lang Mode Table ---------------

  const renderLangTable = () => {
    const rows = editableRows;
    return (
      <table className="w-full border-collapse text-[10px]">
        <thead>
          {/* Top header row with groups */}
          <tr>
            <th rowSpan={2} className={`${thCls} w-8 text-center`}>#</th>
            <th rowSpan={2} className={`${thCls} w-14 text-center`}>OKUL NO</th>
            <th rowSpan={2} className={`${thCls} min-w-[100px] text-left`}>ADI SOYADI</th>
            <th colSpan={4} className={`${thCls} text-center`}>1. SINAV</th>
            <th colSpan={4} className={`${thCls} text-center`}>2. SINAV</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>3. SINAV</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>4. SINAV</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>5. SINAV</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>6. SINAV</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>PERF 1</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>PERF 2</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>PERF 3</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>UYG 1</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>UYG 2</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>UYG 3</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>PROJE</th>
            <th rowSpan={2} className={`${thCls} w-8 text-center`}>M</th>
            <th rowSpan={2} className={`${thCls} w-10 text-center`}>PUAN</th>
          </tr>
          {/* Sub-header for nested exam columns */}
          <tr>
            <th className={`${thCls} w-8 text-center`}>Y</th>
            <th className={`${thCls} w-8 text-center`}>D</th>
            <th className={`${thCls} w-8 text-center`}>K</th>
            <th className={`${thCls} w-8 text-center`}>Ort</th>
            <th className={`${thCls} w-8 text-center`}>Y</th>
            <th className={`${thCls} w-8 text-center`}>D</th>
            <th className={`${thCls} w-8 text-center`}>K</th>
            <th className={`${thCls} w-8 text-center`}>Ort</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const s1ort = Math.round(((row.s1y || 0) * 0.7 + (row.s1d || 0) * 0.15 + (row.s1k || 0) * 0.15));
            const s2ort = Math.round(((row.s2y || 0) * 0.7 + (row.s2d || 0) * 0.15 + (row.s2k || 0) * 0.15));
            return (
              <tr
                key={idx}
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!row.name.trim() ? ' student-row-empty' : ''}`}
              >
                <td className={`${tdCls} text-[9px] font-medium text-slate-400`}>{idx + 1}</td>
                <td className={tdCls}>
                  <input type="text" value={row.no} onChange={(e) => handleCellChange(idx, 'no', e.target.value)} className={inputCls} />
                </td>
                <td className={`${tdCls} text-left`}>
                  <input type="text" value={row.name} onChange={(e) => handleCellChange(idx, 'name', e.target.value)} className={`${inputCls} w-full text-left`} />
                </td>
                {/* Exam 1: Y/D/K/Ort */}
                <td className={tdCls}><input type="number" min={0} max={100} value={row.s1y ?? 0} onChange={(e) => handleCellChange(idx, 's1y', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.s1d ?? 0} onChange={(e) => handleCellChange(idx, 's1d', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.s1k ?? 0} onChange={(e) => handleCellChange(idx, 's1k', e.target.value)} className={inputCls} /></td>
                <td className={totalCellCls}>{s1ort}</td>
                {/* Exam 2: Y/D/K/Ort */}
                <td className={tdCls}><input type="number" min={0} max={100} value={row.s2y ?? 0} onChange={(e) => handleCellChange(idx, 's2y', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.s2d ?? 0} onChange={(e) => handleCellChange(idx, 's2d', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.s2k ?? 0} onChange={(e) => handleCellChange(idx, 's2k', e.target.value)} className={inputCls} /></td>
                <td className={totalCellCls}>{s2ort}</td>
                {/* Exams 3-6 */}
                <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav3 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav3', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav4 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav4', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav5 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav5', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav6 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav6', e.target.value)} className={inputCls} /></td>
                {/* Perf 1-3 */}
                <td className={tdCls}><input type="number" min={0} max={100} value={row.perf1 ?? 0} onChange={(e) => handleCellChange(idx, 'perf1', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.perf2 ?? 0} onChange={(e) => handleCellChange(idx, 'perf2', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.perf3 ?? 0} onChange={(e) => handleCellChange(idx, 'perf3', e.target.value)} className={inputCls} /></td>
                {/* Uyg 1-3 */}
                <td className={tdCls}><input type="number" min={0} max={100} value={row.uyg1 ?? 0} onChange={(e) => handleCellChange(idx, 'uyg1', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.uyg2 ?? 0} onChange={(e) => handleCellChange(idx, 'uyg2', e.target.value)} className={inputCls} /></td>
                <td className={tdCls}><input type="number" min={0} max={100} value={row.uyg3 ?? 0} onChange={(e) => handleCellChange(idx, 'uyg3', e.target.value)} className={inputCls} /></td>
                {/* Proje */}
                <td className={tdCls}>
                  <input
                    type="text"
                    value={row.proje === 'G' ? 'G' : (row.proje ?? 0)}
                    onChange={(e) => handleCellChange(idx, 'proje', e.target.value)}
                    className={inputCls}
                  />
                </td>
                {/* Muaf checkbox */}
                <td className={tdCls}>
                  <input
                    type="checkbox"
                    checked={row.muaf ?? false}
                    onChange={(e) => handleCellChange(idx, 'muaf', String(e.target.checked))}
                    className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                {/* Calculated puan */}
                <td className={totalCellCls}>
                  {row.puan ?? 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // --------------- Render: Other Mode Table ---------------

  const renderOtherTable = () => {
    const rows = editableRows;
    return (
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr>
            <th className={`${thCls} w-8 text-center`}>#</th>
            <th className={`${thCls} w-14 text-center`}>OKUL NO</th>
            <th className={`${thCls} min-w-[120px] text-left`}>ADI SOYADI</th>
            <th className={`${thCls} w-12 text-center`}>1. SINAV</th>
            <th className={`${thCls} w-12 text-center`}>2. SINAV</th>
            <th className={`${thCls} w-12 text-center`}>3. SINAV</th>
            <th className={`${thCls} w-12 text-center`}>4. SINAV</th>
            <th className={`${thCls} w-12 text-center`}>5. SINAV</th>
            <th className={`${thCls} w-12 text-center`}>6. SINAV</th>
            <th className={`${thCls} w-12 text-center`}>PERF 1</th>
            <th className={`${thCls} w-12 text-center`}>PERF 2</th>
            <th className={`${thCls} w-12 text-center`}>PERF 3</th>
            <th className={`${thCls} w-12 text-center`}>PROJE</th>
            <th className={`${thCls} w-8 text-center`}>M</th>
            <th className={`${thCls} w-12 text-center`}>PUAN</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!row.name.trim() ? ' student-row-empty' : ''}`}
            >
              <td className={`${tdCls} text-[9px] font-medium text-slate-400`}>{idx + 1}</td>
              <td className={tdCls}>
                <input type="text" value={row.no} onChange={(e) => handleCellChange(idx, 'no', e.target.value)} className={inputCls} />
              </td>
              <td className={`${tdCls} text-left`}>
                <input type="text" value={row.name} onChange={(e) => handleCellChange(idx, 'name', e.target.value)} className={`${inputCls} w-full text-left`} />
              </td>
              <td className={tdCls}><input type="text" value={row.sinav1 === 'G' ? 'G' : (row.sinav1 ?? 0)} onChange={(e) => handleCellChange(idx, 'sinav1', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="text" value={row.sinav2 === 'G' ? 'G' : (row.sinav2 ?? 0)} onChange={(e) => handleCellChange(idx, 'sinav2', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav3 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav3', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav4 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav4', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav5 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav5', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.sinav6 ?? 0} onChange={(e) => handleCellChange(idx, 'sinav6', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.perf1 ?? 0} onChange={(e) => handleCellChange(idx, 'perf1', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.perf2 ?? 0} onChange={(e) => handleCellChange(idx, 'perf2', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.perf3 ?? 0} onChange={(e) => handleCellChange(idx, 'perf3', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}>
                <input type="text" value={row.proje === 'G' ? 'G' : (row.proje ?? 0)} onChange={(e) => handleCellChange(idx, 'proje', e.target.value)} className={inputCls} />
              </td>
              <td className={tdCls}>
                <input type="checkbox" checked={row.muaf ?? false} onChange={(e) => handleCellChange(idx, 'muaf', String(e.target.checked))} className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              </td>
              <td className={totalCellCls}>{row.puan ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // --------------- Render: PE Mode Table ---------------

  const renderPeTable = () => {
    const rows = editableRows;
    return (
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr>
            <th className={`${thCls} w-8 text-center`}>#</th>
            <th className={`${thCls} w-14 text-center`}>OKUL NO</th>
            <th className={`${thCls} min-w-[120px] text-left`}>ADI SOYADI</th>
            <th className={`${thCls} w-12 text-center`}>UYG 1</th>
            <th className={`${thCls} w-12 text-center`}>UYG 2</th>
            <th className={`${thCls} w-12 text-center`}>UYG 3</th>
            <th className={`${thCls} w-12 text-center`}>PERF 1</th>
            <th className={`${thCls} w-12 text-center`}>PERF 2</th>
            <th className={`${thCls} w-12 text-center`}>PERF 3</th>
            <th className={`${thCls} w-12 text-center`}>PROJE</th>
            <th className={`${thCls} w-8 text-center`}>M</th>
            <th className={`${thCls} w-12 text-center`}>PUAN</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}${!row.name.trim() ? ' student-row-empty' : ''}`}
            >
              <td className={`${tdCls} text-[9px] font-medium text-slate-400`}>{idx + 1}</td>
              <td className={tdCls}>
                <input type="text" value={row.no} onChange={(e) => handleCellChange(idx, 'no', e.target.value)} className={inputCls} />
              </td>
              <td className={`${tdCls} text-left`}>
                <input type="text" value={row.name} onChange={(e) => handleCellChange(idx, 'name', e.target.value)} className={`${inputCls} w-full text-left`} />
              </td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.uyg1 ?? 0} onChange={(e) => handleCellChange(idx, 'uyg1', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.uyg2 ?? 0} onChange={(e) => handleCellChange(idx, 'uyg2', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.uyg3 ?? 0} onChange={(e) => handleCellChange(idx, 'uyg3', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.perf1 ?? 0} onChange={(e) => handleCellChange(idx, 'perf1', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.perf2 ?? 0} onChange={(e) => handleCellChange(idx, 'perf2', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}><input type="number" min={0} max={100} value={row.perf3 ?? 0} onChange={(e) => handleCellChange(idx, 'perf3', e.target.value)} className={inputCls} /></td>
              <td className={tdCls}>
                <input type="text" value={row.proje === 'G' ? 'G' : (row.proje ?? 0)} onChange={(e) => handleCellChange(idx, 'proje', e.target.value)} className={inputCls} />
              </td>
              <td className={tdCls}>
                <input type="checkbox" checked={row.muaf ?? false} onChange={(e) => handleCellChange(idx, 'muaf', String(e.target.checked))} className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              </td>
              <td className={totalCellCls}>{row.puan ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // --------------- Render ---------------

  return (
    <div className="space-y-4">
      {/* ---- Header ---- */}
      <h2 className="text-lg font-bold text-slate-800">
        e-Okul Önizleme ve İçe Aktarma
      </h2>

      {/* ---- Mode Selector ---- */}
      <div className="rounded-xl bg-white p-4 border border-slate-300">
        <label className="mb-2 block text-sm font-semibold text-slate-600">
          Ders Türü
        </label>
        <div className="flex gap-2">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMode(opt.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === opt.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Paste Area ---- */}
      <div className="rounded-xl bg-white p-4 border border-slate-300">
        <label className="mb-2 block text-sm font-semibold text-slate-600">
          e-Okul Verisini Yapıştırın
        </label>
        <textarea
          value={pasteText}
          onChange={(e) => handlePasteChange(e.target.value)}
          placeholder="e-Okul not çizelgesinden tüm hücreleri seçip buraya yapıştırın..."
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />

        {parsedRows.length > 0 && (
          <p className="mt-2 text-sm text-emerald-600">
            {parsedRows.length} öğrenci algılandı.
          </p>
        )}
      </div>

      {/* ---- Preview Table ---- */}
      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        {mode === 'lang' && renderLangTable()}
        {mode === 'other' && renderOtherTable()}
        {mode === 'pe' && renderPeTable()}
      </div>

      {/* ---- Import Button ---- */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleImport}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.97]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          İçe Aktar
        </button>
      </div>
    </div>
  );
}
