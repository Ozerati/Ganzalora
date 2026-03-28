// ============================================================
// Not Hesaplama - Student List Tab (Öğrenci Listesi)
// Bulk paste + editable 40-row table
// ============================================================

import React, { useCallback, useRef, useState } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import A4Paper from '../A4Paper';

const MAX_STUDENTS = 60;

export default function StudentListTab() {
  const { currentStudents, dispatch } = useNotHesaplama();
  const [pasteText, setPasteText] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // --------------- Handlers ---------------

  const handleFieldChange = useCallback(
    (id: number, field: 'number' | 'name' | 'target', raw: string) => {
      let value: string | number = raw;
      if (field === 'target') {
        if (raw.toUpperCase() === 'G') {
          value = 'G' as unknown as number;
        } else {
          const n = parseInt(raw, 10);
          value = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
        }
      }
      dispatch({
        type: 'UPDATE_STUDENT_FIELD',
        payload: { id, fieldPath: field, value },
      });
    },
    [dispatch],
  );

  const handleBulkPaste = useCallback(() => {
    if (!pasteText.trim()) return;

    dispatch({ type: 'PUSH_UNDO', payload: 'Toplu yapıştırma öncesi' });

    const lines = pasteText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    lines.forEach((line, idx) => {
      if (idx >= MAX_STUDENTS) return;
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const no = parts[0]?.trim() ?? '';
        const name = parts[1]?.trim() ?? '';
        if (no) {
          dispatch({
            type: 'UPDATE_STUDENT_FIELD',
            payload: { id: idx, fieldPath: 'number', value: no },
          });
        }
        if (name) {
          dispatch({
            type: 'UPDATE_STUDENT_FIELD',
            payload: { id: idx, fieldPath: 'name', value: name },
          });
        }
      }
    });

    setPasteText('');
    setShowPasteArea(false);
  }, [pasteText, dispatch]);

  const handleClearAll = useCallback(() => {
    dispatch({ type: 'PUSH_UNDO', payload: 'Liste temizleme öncesi' });
    dispatch({ type: 'CLEAR_ALL_STUDENTS' });
  }, [dispatch]);

  // --------------- Render ---------------

  const filledCount = currentStudents.filter((s) => s.name.trim() !== '').length;

  return (
    <div className="space-y-4">
      {/* ---- Header Bar ---- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">
            Öğrenci Listesi
          </h2>
          <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
            {filledCount} / {currentStudents.length} satır
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Satır Ekle */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'ADD_STUDENTS', payload: 5 })}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.97]"
          >
            + 5 Satır
          </button>

          {/* Son Satırı Sil */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'REMOVE_LAST_STUDENT' })}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 shadow-sm transition hover:bg-slate-50 active:scale-[0.97]"
          >
            − Satır
          </button>

          <button
            type="button"
            onClick={() => setShowPasteArea((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Toplu Yapıştır
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-100 active:scale-[0.97]"
          >
            Temizle
          </button>
        </div>
      </div>

      {/* ---- Bulk Paste Area ---- */}
      {showPasteArea && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <p className="mb-2 text-sm text-slate-600">
            e-Okul&apos;dan kopyaladığınız öğrenci listesini buraya yapıştırın.
            Her satırda <strong>Okul No</strong> ve <strong>Adı Soyadı</strong> tab ile ayrılmış olmalı.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="1234\tAhmet Yılmaz\n1235\tMehmet Kaya\n..."
            rows={6}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleBulkPaste}
              disabled={!pasteText.trim()}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Yapıştır ve Uygula
            </button>
          </div>
        </div>
      )}

      {/* ---- Student Table ---- */}
      <A4Paper orientation="portrait">
        <div ref={tableRef}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-16 border border-slate-300 px-3 py-3 text-center text-sm font-bold text-slate-700">
                  Sıra
                </th>
                <th className="w-32 border border-slate-300 px-3 py-3 text-center text-sm font-bold text-slate-700">
                  Okul No
                </th>
                <th className="border border-slate-300 px-3 py-3 text-left text-sm font-bold text-slate-700">
                  Adı Soyadı
                </th>
                <th className="w-28 border border-slate-300 px-3 py-3 text-center text-sm font-bold text-slate-700">
                  Hedef Puan
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, idx) => (
                <tr
                  key={student.id}
                  className={`transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  } hover:bg-blue-50/50${!student.name.trim() ? ' student-row-empty' : ''}`}
                >
                  {/* Sıra */}
                  <td className="border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-500">
                    {idx + 1}
                  </td>

                  {/* Okul No */}
                  <td className="border border-slate-200 px-2 py-1.5">
                    <input
                      type="text"
                      value={student.number}
                      onChange={(e) => handleFieldChange(student.id, 'number', e.target.value)}
                      className="w-full rounded border border-slate-200 bg-[#fffbeb] px-2 py-2 text-center text-sm font-bold text-slate-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                      placeholder="—"
                    />
                  </td>

                  {/* Adı Soyadı */}
                  <td className="border border-slate-200 px-2 py-1.5">
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleFieldChange(student.id, 'name', e.target.value)}
                      className="w-full rounded border border-slate-200 bg-[#fffbeb] px-3 py-2 text-sm font-bold text-slate-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                      placeholder="—"
                    />
                  </td>

                  {/* Hedef Puan */}
                  <td className="border border-slate-200 px-2 py-1.5">
                    <input
                      type="text"
                      value={student.target === 'G' ? 'G' : student.target || ''}
                      onChange={(e) => handleFieldChange(student.id, 'target', e.target.value)}
                      className="w-full rounded border border-slate-200 bg-[#fffbeb] px-2 py-2 text-center text-sm font-bold text-slate-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </A4Paper>
    </div>
  );
}
