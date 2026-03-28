// ============================================================
// Not Hesaplama - Roster Tab (Öğrenci Listesi Tablosu)
// Dynamic columns, editable headers, editable cells
// Always renders 40 student rows, print-ready
// ============================================================

import React, { useCallback, useMemo, useRef } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import A4Paper from '../A4Paper';
import type { RosterColumn } from '../../types';

// Dinamik öğrenci sayısı — context'ten gelir

// --------------- Shared Styles ---------------

const inputCls =
  'w-full rounded border border-transparent bg-[#fffbeb] px-1 py-0.5 text-center text-xs font-bold text-slate-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 print:border-none print:bg-transparent print:shadow-none';

const thCls =
  'border border-slate-300 bg-gray-100 px-2 py-2 text-[10px] font-semibold text-slate-700 uppercase tracking-wide print:bg-gray-100';

const tdCls =
  'border border-slate-300 px-1 py-0.5 text-center text-xs print:border-slate-300';

// --------------- Main Component ---------------

export default function RosterTab() {
  const { state, dispatch, currentStudents, currentTermState } = useNotHesaplama();
  const { columns, cells } = currentTermState.roster;
  const colCounter = useRef(columns.length);

  // Always use all 40 students
  const allStudents = useMemo(
    () => currentStudents,
    [currentStudents],
  );

  // --------------- Column Management ---------------

  const handleAddColumn = useCallback(() => {
    colCounter.current += 1;
    const key = `col_${Date.now()}_${colCounter.current}`;
    const newCol: RosterColumn = { key, label: `Sütun ${colCounter.current}` };
    const newColumns = [...columns, newCol];

    const term = state.activeTerm;
    const termState = state.termStates[term];
    dispatch({
      type: 'LOAD_STATE',
      payload: {
        termStates: {
          ...state.termStates,
          [term]: {
            ...termState,
            roster: {
              ...termState.roster,
              columns: newColumns,
            },
          },
        },
        isDirty: true,
      } as Partial<typeof state>,
    });
  }, [columns, dispatch, state]);

  const handleRemoveLastColumn = useCallback(() => {
    if (columns.length === 0) return;

    dispatch({ type: 'PUSH_UNDO', payload: 'Sütun silme öncesi' });

    const removedCol = columns[columns.length - 1];
    const newColumns = columns.slice(0, -1);

    // Clean up cells for the removed column
    const newCells = { ...cells };
    for (const studentId of Object.keys(newCells)) {
      const sid = Number(studentId);
      if (newCells[sid] && removedCol) {
        const { [removedCol.key]: _, ...rest } = newCells[sid];
        newCells[sid] = rest;
      }
    }

    const term = state.activeTerm;
    const termState = state.termStates[term];
    dispatch({
      type: 'LOAD_STATE',
      payload: {
        termStates: {
          ...state.termStates,
          [term]: {
            ...termState,
            roster: {
              columns: newColumns,
              cells: newCells,
            },
          },
        },
        isDirty: true,
      } as Partial<typeof state>,
    });
  }, [columns, cells, dispatch, state]);

  // --------------- Header Edit ---------------

  const handleHeaderChange = useCallback(
    (colKey: string, newLabel: string) => {
      const newColumns = columns.map((c) =>
        c.key === colKey ? { ...c, label: newLabel } : c,
      );

      const term = state.activeTerm;
      const termState = state.termStates[term];
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          termStates: {
            ...state.termStates,
            [term]: {
              ...termState,
              roster: {
                ...termState.roster,
                columns: newColumns,
              },
            },
          },
          isDirty: true,
        } as Partial<typeof state>,
      });
    },
    [columns, dispatch, state],
  );

  // --------------- Cell Edit ---------------

  const handleCellChange = useCallback(
    (studentId: number, colKey: string, value: string) => {
      const newCells = { ...cells };
      if (!newCells[studentId]) {
        newCells[studentId] = {};
      }
      newCells[studentId] = { ...newCells[studentId], [colKey]: value };

      const term = state.activeTerm;
      const termState = state.termStates[term];
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          termStates: {
            ...state.termStates,
            [term]: {
              ...termState,
              roster: {
                ...termState.roster,
                cells: newCells,
              },
            },
          },
          isDirty: true,
        } as Partial<typeof state>,
      });
    },
    [cells, dispatch, state],
  );

  // --------------- Render ---------------

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-lg font-bold text-slate-800">
          Öğrenci Listesi Tablosu
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddColumn}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Sütun Ekle
          </button>

          <button
            type="button"
            onClick={handleRemoveLastColumn}
            disabled={columns.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
            Son Sütunu Sil
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-200 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Yazdır
          </button>
        </div>
      </div>

      {/* Info */}
      <p className="text-xs text-slate-500 print:hidden">
        Özel sütunlar ekleyerek kendi tablonuzu oluşturun. Sütun başlığına tıklayarak düzenleyebilirsiniz.
        Şu an {columns.length} özel sütun mevcut.
      </p>

      {/* Table */}
      <A4Paper orientation="portrait">
        <table className="w-full border-collapse text-xs print:text-[10px]">
          <thead>
            <tr>
              <th className={`${thCls} w-10 text-center`}>SIRA</th>
              <th className={`${thCls} w-16 text-center`}>OKUL NO</th>
              <th className={`${thCls} min-w-[140px] text-left`}>ADI SOYADI</th>
              {columns.map((col) => (
                <th key={col.key} className={`${thCls} min-w-[80px] text-center`}>
                  <input
                    type="text"
                    value={col.label}
                    onChange={(e) => handleHeaderChange(col.key, e.target.value)}
                    className="w-full rounded border border-dashed border-slate-300 bg-transparent px-1 py-0.5 text-center text-[10px] font-semibold text-slate-600 transition focus:border-blue-400 focus:bg-blue-50 focus:outline-none print:border-none print:bg-transparent"
                    title="Sütun başlığını düzenle"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allStudents.map((s, idx) => (
              <tr
                key={s.id}
                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-gray-50'}${!s.name.trim() ? ' student-row-empty' : ''}`}
              >
                <td className={`${tdCls} text-[10px] font-medium text-slate-400`}>{idx + 1}</td>
                <td className={`${tdCls} font-mono text-[10px] font-bold`}>{s.number}</td>
                <td className={`${tdCls} text-left text-[11px] font-medium text-slate-700`}>
                  {s.name}
                </td>
                {columns.map((col) => (
                  <td key={col.key} className={tdCls}>
                    <input
                      type="text"
                      value={cells[s.id]?.[col.key] ?? ''}
                      onChange={(e) => handleCellChange(s.id, col.key, e.target.value)}
                      className={inputCls}
                      placeholder=""
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </A4Paper>
    </div>
  );
}
