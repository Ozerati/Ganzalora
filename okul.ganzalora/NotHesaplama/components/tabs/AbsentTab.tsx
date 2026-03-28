// ============================================================
// Not Hesaplama - Absent Tab (Sınava Girmeyenler)
// Shows students who missed exams (score = 0 or 'G')
// ============================================================

import React, { useMemo, useState } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import A4Paper from '../A4Paper';
import type { Student, SemesterKey } from '../../types';

// --------------- Types ---------------

type ExamFilter = string;

interface AbsentRecord {
  studentId: number;
  number: string;
  name: string;
  detail: string;
}

// --------------- Branş bazlı sınav seçenekleri ---------------

const EXAM_OPTIONS_BY_BRANCH: Record<string, { id: string; label: string }[]> = {
  yabanci: [
    { id: 'calcYa_1', label: '1. Sınav (Yazılı+Dinleme+Konuşma)' },
    { id: 'calcYa_2', label: '2. Sınav (Yazılı+Dinleme+Konuşma)' },
  ],
  edebiyat: [
    { id: 'calcEd_1', label: '1. Sınav (Yazılı+Dinleme+Konuşma)' },
    { id: 'calcEd_2', label: '2. Sınav (Yazılı+Dinleme+Konuşma)' },
  ],
  beden: [
    { id: 'beUyg_1', label: '1. Uygulama Sınavı' },
    { id: 'beUyg_2', label: '2. Uygulama Sınavı' },
  ],
  diger: [
    { id: 'advExam_1', label: '1. Sınav' },
    { id: 'advExam_2', label: '2. Sınav' },
    { id: 'advPerf', label: 'Performans' },
    { id: 'advProject', label: 'Proje' },
  ],
};

// --------------- Helper: extract absent records ---------------

function getAbsentRecords(
  students: Student[],
  exam: ExamFilter,
): AbsentRecord[] {
  const named = students.filter((s) => s.name.trim() !== '');
  const records: AbsentRecord[] = [];
  const [type, key] = exam.split('_') as [string, SemesterKey | undefined];

  for (const s of named) {
    let raw: number | string | 'G' | undefined;
    let detail = '';

    switch (type) {
      case 'calcYa':
        raw = s.calcYa[key!]?.r;
        detail = `Yabancı Dil ${key}. Sınav`;
        break;
      case 'calcEd':
        raw = s.calcEd[key!]?.r;
        detail = `Edebiyat ${key}. Sınav`;
        break;
      case 'beUyg':
        raw = s.beUyg[key!];
        detail = `Beden Eğitimi ${key}. Uygulama`;
        break;
      case 'advExam':
        raw = s.advExam[key!];
        detail = `${key}. Sınav`;
        break;
      case 'advPerf':
        // Performans 1-3 kontrol
        for (let p = 0; p < 3; p++) {
          const pVal = s.advPerf[p];
          if (pVal === 0 || pVal === undefined) {
            records.push({ studentId: s.id, number: s.number, name: s.name, detail: `Performans ${p + 1}` });
          }
        }
        continue; // döngüye devam, aşağıdaki push'a gitme
      case 'advProject':
        raw = s.advProject;
        detail = 'Proje';
        break;
      default:
        continue;
    }

    // G = girmedi, K = kopya, 0 = boş → sınava girmemiş
    const isAbsent = raw === 'G' || raw === 'g' || raw === 'K' || raw === 'k' || raw === 0 || raw === undefined;
    if (isAbsent) {
      records.push({ studentId: s.id, number: s.number, name: s.name, detail });
    }
  }

  return records;
}

// --------------- Component ---------------

export default function AbsentTab() {
  const { state, currentStudents } = useNotHesaplama();

  const branch = (sessionStorage.getItem('nh_branch') || 'diger') as string;
  const examOptions = EXAM_OPTIONS_BY_BRANCH[branch] || EXAM_OPTIONS_BY_BRANCH['diger'];

  const [exam, setExam] = useState<ExamFilter>(examOptions[0]?.id || 'advExam_1');

  const students = currentStudents;

  const absentRecords = useMemo(
    () => getAbsentRecords(students, exam),
    [students, exam],
  );

  // --------------- Render ---------------

  return (
    <div className="space-y-4">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          Sınava Girmeyenler
        </h2>
        {absentRecords.length > 0 && (
          <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-700">
            {absentRecords.length} kayıt
          </span>
        )}
      </div>

      {/* ---- Filters ---- */}
      <div className="rounded-xl bg-white p-4 border border-slate-300">
        <div className="flex flex-wrap gap-6">
          {/* Scope */}
          {/* Dönem bilgisi */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Dönem</label>
            <div className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              {state.activeTerm === '2' ? '2. Dönem' : '1. Dönem'}
            </div>
          </div>

          {/* Sınav seçimi */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Sınav</label>
            <div className="flex flex-wrap gap-1.5">
              {examOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExam(opt.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    exam === opt.id
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Results Table ---- */}
      <A4Paper orientation="portrait">
        {absentRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <svg className="mb-3 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">Eksik kayıt bulunamadı</p>
            <p className="mt-1 text-xs">Tüm öğrenciler ilgili değerlendirmelere katılmış görünüyor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-red-50">
                  <th className="w-12 border-b border-slate-300 px-3 py-3 text-center font-semibold text-slate-500">
                    #
                  </th>
                  <th className="border-b border-slate-300 px-3 py-3 text-left font-semibold text-slate-500">
                    Okul No
                  </th>
                  <th className="border-b border-slate-300 px-3 py-3 text-left font-semibold text-slate-500">
                    Adı Soyadı
                  </th>
                  <th className="border-b border-slate-300 px-3 py-3 text-left font-semibold text-slate-500">
                    Detay
                  </th>
                </tr>
              </thead>
              <tbody>
                {absentRecords.map((rec, idx) => (
                  <tr
                    key={`${rec.studentId}-${rec.detail}-${idx}`}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50/50`}
                  >
                    <td className="border-b border-slate-200 px-3 py-2 text-center text-xs text-slate-400">{idx + 1}</td>
                    <td className="border-b border-slate-200 px-3 py-2 font-mono text-xs text-slate-600">{rec.number}</td>
                    <td className="border-b border-slate-200 px-3 py-2 font-medium text-slate-700">{rec.name}</td>
                    <td className="border-b border-slate-200 px-3 py-2 text-sm text-slate-500">{rec.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </A4Paper>
    </div>
  );
}
