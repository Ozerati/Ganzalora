// ============================================================
// Not Hesaplama - Analysis Tab (Sınav Analizi)
// Statistics: mean, median, mode, min, max, participation
// ============================================================

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNotHesaplama } from '../../context/NotHesaplamaContext';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import A4Paper from '../A4Paper';
import type { Student, SemesterKey } from '../../types';

// --------------- Types ---------------

type ScopeFilter = 'current' | 'all';
type TermFilter = SemesterKey;
type ExamFilter = string; // dinamik

interface Stats {
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  total: number;
  participated: number;
  participationRate: number;
}

// --------------- Constants ---------------

const SCOPE_OPTIONS: { id: ScopeFilter; label: string }[] = [
  { id: 'current', label: 'Bu Sınıf' },
  { id: 'all', label: 'Tüm Sınıflar' },
];

const TERM_OPTIONS: { id: TermFilter; label: string }[] = [
  { id: '1', label: '1. Dönem' },
  { id: '2', label: '2. Dönem' },
];

// Branş bazlı sınav seçenekleri
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
  ],
};

// Tüm branşlar için fallback
const ALL_EXAM_OPTIONS = [
  { id: 'calcYa_1', label: 'Yabancı Dil 1. Sınav' },
  { id: 'calcYa_2', label: 'Yabancı Dil 2. Sınav' },
  { id: 'calcEd_1', label: 'Edebiyat 1. Sınav' },
  { id: 'calcEd_2', label: 'Edebiyat 2. Sınav' },
  { id: 'beUyg_1', label: 'Beden Eğitimi 1. Uygulama' },
  { id: 'beUyg_2', label: 'Beden Eğitimi 2. Uygulama' },
  { id: 'advExam_1', label: 'Diğer Branş 1. Sınav' },
  { id: 'advExam_2', label: 'Diğer Branş 2. Sınav' },
];

// --------------- Stat calculation ---------------

function calculateStats(scores: number[]): Stats {
  // -1 = G (girmedi), 0 = puan yok/boş, >0 = gerçek puan
  // Sınava girenler: 0 dahil (0 puan aldı ama girdi), -1 hariç (girmedi)
  const girenler = scores.filter((s) => s >= 0 && s !== 0); // puanı > 0 olanlar girmiş sayılır
  // Daha doğrusu: ismi olan ama G olmayan herkes sınava girmiştir
  // G = -1 → girmedi, 0 = henüz puan girilmemiş, >0 = sınava girdi
  const valid = scores.filter((s) => s > 0); // gerçek puan alanlar
  const girmeyenler = scores.filter((s) => s === -1).length;
  const total = scores.filter((s) => s !== 0).length; // 0'lar (boş) hariç toplam kayıtlı öğrenci
  const participated = valid.length; // sınava girip puan alan

  if (valid.length === 0) {
    return {
      mean: 0,
      median: 0,
      mode: 0,
      min: 0,
      max: 0,
      total,
      participated: 0,
      participationRate: 0,
    };
  }

  // Mean
  const sum = valid.reduce((a, b) => a + b, 0);
  const mean = sum / valid.length;

  // Median
  const sorted = [...valid].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

  // Mode
  const freq = new Map<number, number>();
  for (const v of valid) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  let maxFreq = 0;
  let mode = 0;
  for (const [val, count] of freq) {
    if (count > maxFreq) {
      maxFreq = count;
      mode = val;
    }
  }

  return {
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    mode,
    min: Math.min(...valid),
    max: Math.max(...valid),
    total,
    participated,
    participationRate: total > 0 ? Math.round((participated / total) * 100) : 0,
  };
}

// exam format: "type_key" örn: "calcYa_1", "advExam_2", "beUyg_1"
// -1 = G/K (girmedi/kopya), 0 = boş, >0 = puan
function extractScores(
  students: Student[],
  exam: ExamFilter,
  _term: TermFilter, // artık kullanılmıyor, exam id'sinden çekiliyor
): number[] {
  const named = students.filter((s) => s.name.trim() !== '');
  const [type, key] = exam.split('_') as [string, SemesterKey];

  return named.map((s) => {
    let raw: number | string | 'G' | undefined;
    switch (type) {
      case 'calcYa':
        raw = s.calcYa[key]?.r;
        break;
      case 'calcEd':
        raw = s.calcEd[key]?.r;
        break;
      case 'beUyg':
        raw = s.beUyg[key];
        break;
      case 'advExam':
        raw = s.advExam[key];
        break;
      default:
        raw = 0;
    }
    // G = girmedi, K = kopya → -1 (sınava girmiş sayılmaz)
    if (raw === 'G' || raw === 'g' || raw === 'K' || raw === 'k') return -1;
    return typeof raw === 'number' ? raw : 0;
  });
}

// --------------- Stat Card ---------------

function StatCard({
  label,
  value,
  accent = 'blue',
}: {
  label: string;
  value: string | number;
  accent?: 'blue' | 'emerald' | 'violet' | 'amber' | 'red' | 'slate';
}) {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    slate: 'from-slate-500 to-slate-600',
  };

  return (
    <div className="rounded-xl bg-white p-4 border border-slate-300">
      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 bg-gradient-to-r bg-clip-text text-2xl font-extrabold text-transparent ${colorMap[accent]}`}
      >
        {value}
      </p>
    </div>
  );
}

// --------------- Score Distribution Bar ---------------

function DistributionBar({ scores }: { scores: number[] }) {
  const valid = scores.filter((s) => s > 0);
  if (valid.length === 0) return null;

  const ranges = [
    { label: '0-24', min: 0, max: 24, color: 'bg-red-400' },
    { label: '25-44', min: 25, max: 44, color: 'bg-orange-400' },
    { label: '45-54', min: 45, max: 54, color: 'bg-amber-400' },
    { label: '55-69', min: 55, max: 69, color: 'bg-yellow-400' },
    { label: '70-84', min: 70, max: 84, color: 'bg-emerald-400' },
    { label: '85-100', min: 85, max: 100, color: 'bg-blue-500' },
  ];

  const counts = ranges.map((r) => ({
    ...r,
    count: valid.filter((s) => s >= r.min && s <= r.max).length,
  }));

  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="rounded-xl bg-white p-4 border border-slate-300">
      <h3 className="mb-3 text-sm font-bold text-slate-700">
        Puan Dağılımı
      </h3>
      <div className="space-y-2">
        {counts.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-14 text-right text-xs font-medium text-slate-500">
              {r.label}
            </span>
            <div className="flex-1">
              <div className="h-6 w-full overflow-hidden rounded-lg bg-slate-100">
                <div
                  className={`h-full rounded-lg transition-all duration-500 ${r.color}`}
                  style={{
                    width: `${Math.max((r.count / maxCount) * 100, r.count > 0 ? 4 : 0)}%`,
                  }}
                />
              </div>
            </div>
            <span className="w-8 text-right text-xs font-bold text-slate-600">
              {r.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------- Student Scores Table ---------------

function ScoresTable({
  students,
  exam,
  term,
}: {
  students: Student[];
  exam: ExamFilter;
  term: TermFilter;
}) {
  const named = students.filter((s) => s.name.trim() !== '');

  return (
    <A4Paper orientation="portrait">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-12 border-b border-slate-300 px-3 py-3 text-center font-semibold text-slate-500">
              #
            </th>
            <th className="border-b border-slate-300 px-3 py-3 text-left font-semibold text-slate-500">
              Okul No
            </th>
            <th className="border-b border-slate-300 px-3 py-3 text-left font-semibold text-slate-500">
              Adı Soyadı
            </th>
            <th className="w-24 border-b border-slate-300 px-3 py-3 text-center font-semibold text-slate-500">
              Puan
            </th>
            </tr>
          </thead>
          <tbody>
            {named.map((s, idx) => {
              const [type, key] = exam.split('_') as [string, SemesterKey];
              let raw: number | string | undefined;
              switch (type) {
                case 'calcYa': raw = s.calcYa[key]?.r; break;
                case 'calcEd': raw = s.calcEd[key]?.r; break;
                case 'beUyg': raw = s.beUyg[key]; break;
                case 'advExam': raw = s.advExam[key]; break;
                default: raw = 0;
              }
              const score = (raw === 'G' || raw === 'K' || raw === 'g' || raw === 'k') ? 0 : (typeof raw === 'number' ? raw : 0);

              const getBadgeColor = (v: number) => {
                if (v === 0) return 'bg-slate-100 text-slate-400';
                if (v < 45) return 'bg-red-100 text-red-700';
                if (v < 55) return 'bg-amber-100 text-amber-700';
                if (v < 70) return 'bg-yellow-100 text-yellow-700';
                if (v < 85) return 'bg-emerald-100 text-emerald-700';
                return 'bg-blue-100 text-blue-700';
              };

              return (
                <tr
                  key={s.id}
                  className={`transition-colors ${
                    idx % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50'
                  } hover:bg-blue-50/50`}
                >
                  <td className="border-b border-slate-200 px-3 py-2 text-center text-xs text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 font-mono text-xs text-slate-600">
                    {s.number}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 font-medium text-slate-700">
                    {s.name}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 text-center">
                    <span
                      className={`inline-block min-w-[2.5rem] rounded-lg px-2 py-0.5 text-xs font-bold ${getBadgeColor(score)}`}
                    >
                      {score}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </A4Paper>
  );
}

// --------------- Main Component ---------------

export default function AnalysisTab() {
  const { state, currentStudents } = useNotHesaplama();

  // Branş bilgisini sessionStorage'dan al
  const branch = (sessionStorage.getItem('nh_branch') || 'diger') as string;
  const examOptions = EXAM_OPTIONS_BY_BRANCH[branch] || ALL_EXAM_OPTIONS;

  const [scope, setScope] = useState<ScopeFilter>('current');
  const term = state.activeTerm; // NavBar'daki dönem seçimini kullan
  const [exam, setExam] = useState<ExamFilter>(examOptions[0]?.id || 'advExam_1');

  const students = useMemo(() => {
    if (scope === 'all') {
      return state.termStates[term].students;
    }
    return currentStudents;
  }, [scope, term, state.termStates, currentStudents]);

  const scores = useMemo(
    () => extractScores(students, exam, term),
    [students, exam, term],
  );

  const stats = useMemo(() => calculateStats(scores), [scores]);

  // --------------- Render ---------------

  return (
    <div className="space-y-4">
      {/* ---- Header ---- */}
      <h2 className="text-lg font-bold text-slate-800">
        Sınav Analizi
      </h2>

      {/* ---- Filters ---- */}
      <div className="rounded-xl bg-white p-4 border border-slate-300">
        <div className="flex flex-wrap gap-6">
          {/* Scope */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Kapsam
            </label>
            <div className="flex gap-1.5">
              {SCOPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScope(opt.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    scope === opt.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dönem bilgisi — NavBar'dan geliyor */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Dönem
            </label>
            <div className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              {term === '2' ? '2. Dönem' : '1. Dönem'}
            </div>
          </div>

          {/* Exam */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Sınav
            </label>
            <div className="flex gap-1.5">
              {examOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExam(opt.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                    exam === opt.id
                      ? 'bg-violet-600 text-white shadow-sm'
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

      {/* ---- Statistics Cards ---- */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Ortalama" value={stats.mean} accent="blue" />
        <StatCard label="Ortanca" value={stats.median} accent="emerald" />
        <StatCard label="Tepe Değer" value={stats.mode} accent="violet" />
        <StatCard label="Min" value={stats.min} accent="red" />
        <StatCard label="Max" value={stats.max} accent="amber" />
        <StatCard
          label="Katılım"
          value={`${stats.participationRate}%`}
          accent="slate"
        />
      </div>

      {/* ---- Participation info ---- */}
      <div className="rounded-xl bg-white p-4 border border-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">
                {stats.participated}
              </span>{' '}
              / {stats.total} öğrenci sınava katıldı
            </p>
          </div>
          <div className="h-3 w-48 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${stats.participationRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* ---- Distribution Chart ---- */}
      <DistributionBar scores={scores} />

      {/* ---- Detailed Scores Table (sadece veri varsa) ---- */}
      {stats.participated > 0 && (
        <ScoresTable students={students} exam={exam} term={term} />
      )}

      {/* ════════════════════════════════════════════════════════════
          MEB Sınav Sonuç Değerlendirme Formu — Aktif Sınıf
          ════════════════════════════════════════════════════════════ */}
      <SinavSonucDegerlendirmeFormu
        stats={stats}
        scores={scores}
        exam={exam}
        term={term}
        meta={state.meta}
      />

      {/* ════════════════════════════════════════════════════════════
          Tüm Sınıflar İçin Toplu Form
          ════════════════════════════════════════════════════════════ */}
      <TumSiniflarFormu exam={exam} term={term} meta={state.meta} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MEB Sınav Sonuç Değerlendirme Tutanağı (Resmi Format)
// ═══════════════════════════════════════════════════════════

const TELAFI_SATIRLARI = [
  'Ders İçi Konu Tekrarı',
  'Bakanlık Destek Materyalleri',
  'Çalışma Kâğıdı',
  'EBA Uygulamaları',
  'MEBİ Uygulamaları',
  'DYK Çalışmaları',
  'Diğer (Açıklamasını Yazınız)',
];

function SinavSonucDegerlendirmeFormu({
  stats,
  scores,
  term,
  meta,
  sinifAdi,
}: {
  stats: Stats;
  scores: number[];
  exam: ExamFilter;
  term: TermFilter;
  meta: { schoolName: string; sigs: { teacher: string; principal: string; vicePrincipal: string } };
  sinifAdi?: string;
}) {
  const [formData, setFormData] = React.useState({
    ilce: '',
    ders: '',
    sinif: sinifAdi || '',
    sinavTarihi: '',
    sinavAdi: '',
    eksik: ['', '', ''],
    telafiTarih: Array.from({ length: 3 }, () => Array(7).fill('')),
  });

  const valid = scores.filter(s => s > 0);
  const count049 = valid.filter(s => s < 50).length;
  const count5069 = valid.filter(s => s >= 50 && s < 70).length;
  const count70100 = valid.filter(s => s >= 70).length;
  const donemNo = term === '2' ? '2' : '1';

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const updateEksik = (idx: number, value: string) => setFormData(prev => {
    const eksik = [...prev.eksik];
    eksik[idx] = value;
    return { ...prev, eksik };
  });
  const updateTelafiTarih = (eksikIdx: number, telafiIdx: number, value: string) => setFormData(prev => {
    const t = prev.telafiTarih.map(row => [...row]);
    t[eksikIdx][telafiIdx] = value;
    return { ...prev, telafiTarih: t };
  });

  const [imzaOgretmen, setImzaOgretmen] = React.useState(meta.sigs.teacher || '');
  const [imzaZumre, setImzaZumre] = React.useState(meta.sigs.vicePrincipal || '');
  const [imzaMudur, setImzaMudur] = React.useState(meta.sigs.principal || '');

  // 13 sütunluk grid — Word dosyasının birebir kopyası
  const c = 'border border-black'; // cell border
  const i = 'w-full bg-transparent border-none outline-none font-inherit'; // input
  const y = 'background: #f0c000'; // yellow

  return (
    <div className="mt-6 pdf-page">
      <h2 className="text-lg font-bold text-slate-800 mb-3 no-print">Sınav Sonuç Değerlendirme Tutanağı</h2>

      <A4Paper orientation="portrait" showSignature={false}>
        <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '12px', lineHeight: 1.4, color: '#000' }}>

          {/* ═══ BAŞLIK ═══ */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <tbody><tr>
              <td style={{ width: '60px', verticalAlign: 'middle', paddingRight: '8px' }}>
                <img src="/meb-logo.png" alt="" style={{ width: '56px', height: '56px' }} />
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#c00', lineHeight: 1.1 }}>İSTANBUL</div>
                <div style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1.2 }}>İL MİLLİ EĞİTİM MÜDÜRLÜĞÜ</div>
              </td>
              <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.15 }}>SINAV SONUÇ DEĞERLENDİRME</div>
                <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.15 }}>TUTANAĞI</div>
              </td>
            </tr></tbody>
          </table>

          {/* ═══ 13-SÜTUN ANA TABLO — Word birebir ═══ */}
          <table className={c} style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.69%' }} />
              <col style={{ width: '7.72%' }} />
            </colgroup>
            <tbody>
              {/* Row 0: İlçe / Okul */}
              <tr>
                <td className={c} colSpan={2} style={{ padding: '5px 8px', fontWeight: 700 }}>İlçe</td>
                <td className={c} colSpan={3} style={{ padding: '5px 8px' }}>
                  <input type="text" value={formData.ilce} onChange={e => update('ilce', e.target.value)} className={i} />
                </td>
                <td className={c} colSpan={3} style={{ padding: '5px 8px', fontWeight: 700, textAlign: 'center' }}>Okul</td>
                <td className={c} colSpan={5} style={{ padding: '5px 8px' }}>
                  <input type="text" value={formData.okul || meta.schoolName} onChange={e => update('okul' as string, e.target.value)} className={i} />
                </td>
              </tr>

              {/* Row 1: Ders / Sınav Tarihi */}
              <tr>
                <td className={c} colSpan={2} style={{ padding: '5px 8px', fontWeight: 700 }}>Ders</td>
                <td className={c} colSpan={3} style={{ padding: '5px 8px' }}>
                  <input type="text" value={formData.ders} onChange={e => update('ders', e.target.value)} className={i} list="ders-form2" />
                  <datalist id="ders-form2">
                    {['Yabancı Dil','Matematik','Türk Dili Edebiyatı','Fizik','Kimya','Biyoloji','Tarih','Coğrafya','Felsefe','Din Kültürü ve Ahlak Bilgisi','Psikoloji','Sağlık Bilgisi','Beden Eğitimi','T.C İnkılap Tarihi ve Atatürkçülük'].map(d => <option key={d} value={d} />)}
                  </datalist>
                </td>
                <td className={c} colSpan={3} style={{ padding: '5px 8px', fontWeight: 700, textAlign: 'center' }}>Sınav Tarihi</td>
                <td className={c} colSpan={5} style={{ padding: '5px 8px' }}>
                  <input type="text" value={formData.sinavTarihi} onChange={e => update('sinavTarihi', e.target.value)} className={i} />
                </td>
              </tr>

              {/* Row 2: Sınıf / Sınav Adı */}
              <tr>
                <td className={c} colSpan={2} style={{ padding: '5px 8px', fontWeight: 700 }}>Sınıf</td>
                <td className={c} colSpan={3} style={{ padding: '5px 8px' }}>
                  <input type="text" value={formData.sinif} onChange={e => update('sinif', e.target.value)} className={i} />
                </td>
                <td className={c} colSpan={3} style={{ padding: '5px 8px', fontWeight: 700, textAlign: 'center' }}>Sınav Adı</td>
                <td className={c} colSpan={5} style={{ padding: '5px 8px' }}>
                  <input type="text" value={formData.sinavAdi || '.... Dönem .... Ortak Yazılı Sınavı'} onChange={e => update('sinavAdi', e.target.value)} className={i} />
                </td>
              </tr>

              {/* Row 3: 1. Bölüm — sarı başlık */}
              <tr>
                <td className={c} colSpan={2} style={{ padding: '5px 8px', fontWeight: 700, background: '#f0c000' }}>1. Bölüm</td>
                <td className={c} colSpan={11} style={{ padding: '5px 8px', background: '#f0c000' }}>Öğrencilerin Puan Dağılımı</td>
              </tr>

              {/* Row 4: Puan dağılımı — 8 hücre tek satırda */}
              <tr>
                <td className={c} colSpan={3} style={{ padding: '6px 6px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '11px' }}>
                  Sınava Giren Öğrenci<br />Sayısı
                </td>
                <td className={c} colSpan={1} style={{ padding: '4px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <input type="text" value={stats.participated ? String(stats.participated) : ''} readOnly className={i} style={{ fontSize: '14px', fontWeight: 700, textAlign: 'center' }} />
                </td>
                <td className={c} colSpan={3} style={{ padding: '6px 6px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '11px' }}>
                  0-49 Arası Puan Alan<br />Öğrenci Sayısı
                </td>
                <td className={c} colSpan={1} style={{ padding: '4px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <input type="text" value={count049 ? String(count049) : ''} readOnly className={i} style={{ fontSize: '14px', fontWeight: 700, textAlign: 'center' }} />
                </td>
                <td className={c} colSpan={2} style={{ padding: '6px 6px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '11px' }}>
                  50-69 Arası Puan Alan<br />Öğrenci Sayısı
                </td>
                <td className={c} colSpan={1} style={{ padding: '4px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <input type="text" value={count5069 ? String(count5069) : ''} readOnly className={i} style={{ fontSize: '14px', fontWeight: 700, textAlign: 'center' }} />
                </td>
                <td className={c} colSpan={1} style={{ padding: '6px 6px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '11px' }}>
                  70-100 Arası<br />Puan Alan<br />Öğrenci Sayısı
                </td>
                <td className={c} colSpan={1} style={{ padding: '4px', textAlign: 'center', verticalAlign: 'middle' }}>
                  <input type="text" value={count70100 ? String(count70100) : ''} readOnly className={i} style={{ fontSize: '14px', fontWeight: 700, textAlign: 'center' }} />
                </td>
              </tr>

              {/* Row 5: 2. Bölüm — sarı başlık */}
              <tr>
                <td className={c} colSpan={2} style={{ padding: '5px 8px', fontWeight: 700, background: '#f0c000' }}>2. Bölüm</td>
                <td className={c} colSpan={11} style={{ padding: '5px 8px', background: '#f0c000', fontSize: '11px' }}>
                  Eksik Öğrenme Çıktılarının Belirlenmesi ve Telafi Çalışmalarının Planlanması
                </td>
              </tr>

              {/* Row 6: Eksik Öğrenme Çıktıları header (rowSpan=2) + Gelişim Planı */}
              <tr>
                <td className={c} colSpan={1} rowSpan={2} style={{ padding: '6px 8px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '11px' }}>&nbsp;</td>
                <td className={c} colSpan={5} rowSpan={2} style={{ padding: '6px 8px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '11px' }}>
                  Eksik Öğrenme Çıktıları<br />
                  <span style={{ fontWeight: 400, fontSize: '12px' }}>(Sınav sonuçları analiz edildiğinde öğrencilerin<br /><u>en az</u> başarı gösterdiği 3 soruya ait öğrenme<br />çıktıları yer almalıdır.)</span>
                </td>
                <td className={c} colSpan={7} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>Gelişim Planı</td>
              </tr>

              {/* Row 7: Planlanan Çalışmalar / Tarih (rowSpan continuation) */}
              <tr>
                <td className={c} colSpan={5} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>Planlanan Çalışmalar</td>
                <td className={c} colSpan={2} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>Tarih</td>
              </tr>

              {/* Rows 8-28: 3 × 7 telafi blokları */}
              {[0, 1, 2].map(ei => (
                <React.Fragment key={ei}>
                  {TELAFI_SATIRLARI.map((t, ti) => (
                    <tr key={`${ei}-${ti}`}>
                      {ti === 0 && (
                        <>
                          <td className={c} rowSpan={7} style={{ padding: '6px 8px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700, fontSize: '12px' }}>
                            {ei + 1}.
                          </td>
                          <td className={c} colSpan={5} rowSpan={7} style={{ padding: '6px 8px', verticalAlign: 'top', fontSize: '12px' }}>
                            <textarea
                              value={formData.eksik[ei]}
                              onChange={e => updateEksik(ei, e.target.value)}
                              style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '11px', minHeight: '130px', background: 'transparent', fontFamily: 'inherit' }}
                              placeholder=""
                            />
                          </td>
                        </>
                      )}
                      <td className={c} style={{ padding: '1px 2px' }}>&nbsp;</td>
                      <td className={c} colSpan={4} style={{ padding: '4px 8px', fontSize: '11px' }}>{t}</td>
                      <td className={c} colSpan={2} style={{ padding: '6px 8px' }}>
                        <input type="text" value={formData.telafiTarih[ei][ti]} onChange={e => updateTelafiTarih(ei, ti, e.target.value)} className={i} style={{ fontSize: '12px', textAlign: 'center' }} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Row 29: İmza başlıkları */}
              <tr>
                <td className={c} colSpan={4} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>Öğretmenin Adı Soyadı</td>
                <td className={c} colSpan={5} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>Zümre Başkanının Adı Soyadı</td>
                <td className={c} colSpan={4} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>Okul Müdürünün Adı Soyadı</td>
              </tr>

              {/* Row 30: İmza isimleri */}
              <tr>
                <td className={c} colSpan={4} style={{ padding: '6px 8px', textAlign: 'center', height: '35px' }}>
                  <input type="text" value={imzaOgretmen} onChange={e => setImzaOgretmen(e.target.value)} className={i} style={{ textAlign: 'center' }} />
                </td>
                <td className={c} colSpan={5} style={{ padding: '6px 8px', textAlign: 'center', height: '35px' }}>
                  <input type="text" value={imzaZumre} onChange={e => setImzaZumre(e.target.value)} className={i} style={{ textAlign: 'center' }} />
                </td>
                <td className={c} colSpan={4} style={{ padding: '6px 8px', textAlign: 'center', height: '35px' }}>
                  <input type="text" value={imzaMudur} onChange={e => setImzaMudur(e.target.value)} className={i} style={{ textAlign: 'center' }} />
                </td>
              </tr>

              {/* Row 31: İmza label */}
              <tr>
                <td className={c} colSpan={4} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>İmza</td>
                <td className={c} colSpan={5} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>İmza</td>
                <td className={c} colSpan={4} style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>İmza</td>
              </tr>

              {/* Row 32: İmza boşluk */}
              <tr>
                <td className={c} colSpan={4} style={{ height: '35px' }}>&nbsp;</td>
                <td className={c} colSpan={5} style={{ height: '35px' }}>&nbsp;</td>
                <td className={c} colSpan={4} style={{ height: '35px' }}>&nbsp;</td>
              </tr>
            </tbody>
          </table>

        </div>
      </A4Paper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Tüm Sınıflar İçin Toplu Form Oluşturma
// ═══════════════════════════════════════════════════════════

interface ClassData {
  className: string;
  students: Student[];
  stats: Stats;
  scores: number[];
}

function TumSiniflarFormu({
  exam,
  term,
  meta,
}: {
  exam: ExamFilter;
  term: TermFilter;
  meta: { schoolName: string; sigs: { teacher: string; principal: string; vicePrincipal: string } };
}) {
  const [classList, setClassList] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const userId = sessionStorage.getItem('nh_user_id') || '';

  const handleLoadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Sınıf listesini çek
      const listRef = doc(db, 'notHesaplamaUserData', userId, 'data', '_classList');
      const listSnap = await getDoc(listRef);
      if (!listSnap.exists()) { setLoading(false); return; }
      const classNames: string[] = listSnap.data().classes || [];

      const results: ClassData[] = [];

      for (const cls of classNames) {
        const clsRef = doc(db, 'notHesaplamaUserData', userId, 'data', `class_${cls}`);
        const clsSnap = await getDoc(clsRef);
        if (!clsSnap.exists()) continue;

        const data = clsSnap.data();
        const termState = data.termStates?.[term];
        if (!termState?.students) continue;

        const students: Student[] = termState.students;
        const scores = extractScores(students, exam, term);
        const stats = calculateStats(scores);

        results.push({ className: cls, students, stats, scores });
      }

      setClassList(results);
      setLoaded(true);
    } catch (err) {
      console.error('Sınıf verileri yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, exam, term]);

  if (!loaded) {
    return (
      <div className="mt-6 text-center no-print">
        <button
          onClick={handleLoadAll}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md hover:shadow-lg transition active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Sınıflar yükleniyor...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              Tüm Sınıflar İçin Form Oluştur
            </>
          )}
        </button>
        <p className="text-xs text-slate-400 mt-2">Kayıtlı tüm sınıfların Sınav Sonuç Değerlendirme Formu oluşturulur</p>
      </div>
    );
  }

  if (classList.length === 0) {
    return (
      <div className="mt-6 text-center text-sm text-slate-500">
        Kayıtlı sınıf bulunamadı.
        <button onClick={() => setLoaded(false)} className="ml-2 text-indigo-600 underline">Tekrar dene</button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between no-print">
        <h2 className="text-lg font-bold text-slate-800">
          Tüm Sınıflar — {classList.length} Sınıf
        </h2>
        <button onClick={() => setLoaded(false)} className="text-xs text-slate-500 underline">Kapat</button>
      </div>

      {classList.map((cls) => (
        <SinavSonucDegerlendirmeFormu
          key={cls.className}
          stats={cls.stats}
          scores={cls.scores}
          exam={exam}
          term={term}
          meta={meta}
          sinifAdi={cls.className}
        />
      ))}
    </div>
  );
}
