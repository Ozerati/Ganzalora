// ============================================================
// Not Hesaplama - NavBar (Top Navigation / Controls)
// Glassmorphism style, fully responsive
// ============================================================

import React, { useState } from 'react';
import { useNotHesaplama } from '../context/NotHesaplamaContext';
import type { SemesterKey } from '../types';

interface NavBarProps {
  onCalculate: () => void;
  onPrint: () => void;
  onUndo: () => void;
  onSaveClass?: (name: string) => Promise<void>;
  onLoadClass?: (name: string) => Promise<void>;
  onDeleteClass?: (name: string) => Promise<void>;
  onGetClassList?: () => Promise<string[]>;
  onSave?: () => Promise<void>;
}

// --------------- SVG Icons ---------------

const IconCalculate = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="10" y2="10" />
    <line x1="14" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="10" y2="14" />
    <line x1="14" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="10" y2="18" />
    <line x1="14" y1="18" x2="16" y2="18" />
  </svg>
);

const IconPrint = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 6,2 18,2 18,9" />
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const IconUndo = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1,4 1,10 7,10" />
    <path d="M3.51 15a9 9 0 105.64-11.36L1 10" />
  </svg>
);

const IconSave = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

// --------------- Component ---------------

export default function NavBar({ onCalculate, onPrint, onUndo, onSaveClass, onLoadClass, onDeleteClass, onGetClassList, onSave }: NavBarProps) {
  const { state, dispatch } = useNotHesaplama();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [classList, setClassList] = useState<string[]>([]);
  const [classListLoaded, setClassListLoaded] = useState(false);

  const { meta, activeTerm, isDirty, isSyncing, lastSaved } = state;

  // --------------- Handlers ---------------

  const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_META', payload: { schoolName: e.target.value } });
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_META',
      payload: { sigs: { ...meta.sigs, teacher: e.target.value } },
    });
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_META',
      payload: { sigs: { ...meta.sigs, principal: e.target.value } },
    });
  };

  const handleVicePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_META',
      payload: { sigs: { ...meta.sigs, vicePrincipal: e.target.value } },
    });
  };

  const handleTermChange = (term: SemesterKey) => {
    dispatch({ type: 'SET_ACTIVE_TERM', payload: term });
  };

  const handleClearStudents = () => {
    dispatch({ type: 'PUSH_UNDO', payload: 'Öğrenci listesi temizle' });
    dispatch({ type: 'CLEAR_ALL_STUDENTS' });
  };

  // Sınıf listesini yükle (ilk açılışta ve save/delete sonrası)
  const refreshClassList = async () => {
    if (!onGetClassList) return;
    const list = await onGetClassList();
    setClassList(list);
    setClassListLoaded(true);
  };

  React.useEffect(() => {
    if (!classListLoaded) refreshClassList();
  }, [classListLoaded]);

  const handleCreateClass = async () => {
    const name = newClassName.trim();
    if (!name || !onSaveClass) return;
    // Yeni sınıf oluştur — mevcut veriyi temizle
    dispatch({ type: 'PUSH_UNDO', payload: 'Yeni sınıf oluştur' });
    dispatch({ type: 'CLEAR_ALL_STUDENTS' });
    setClassName(name);
    setNewClassName('');
    await onSaveClass(name);
    await refreshClassList();
  };

  const handleSaveClass = async () => {
    if (!className.trim() || !onSaveClass) return;
    await onSaveClass(className.trim());
    await refreshClassList();
  };

  const handleLoadClass = async (name: string) => {
    if (!name || !onLoadClass) return;
    setClassName(name);
    await onLoadClass(name);
  };

  const handleDeleteClass = async () => {
    if (!className.trim() || !onDeleteClass) return;
    if (!confirm(`"${className}" sınıfı silinsin mi?`)) return;
    await onDeleteClass(className.trim());
    setClassName('');
    await refreshClassList();
  };

  const handleSaveDraft = async () => {
    if (onSave) await onSave();
  };

  // --------------- Render ---------------

  return (
    <header className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-3">
        {/* Row 1: Title + Status */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Not Dağıtım Sistemi
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {isSyncing && (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Kaydediliyor...
              </span>
            )}
            {isDirty && !isSyncing && (
              <span className="text-amber-500 font-medium">Kaydedilmemiş değişiklikler</span>
            )}
            {lastSaved && !isDirty && (
              <span className="text-green-600">Son kayıt: {lastSaved}</span>
            )}
          </div>
        </div>

        {/* Row 2: Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Aktif sınıf göstergesi */}
          {className && (
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
              Sınıf: {className}
            </span>
          )}

          {/* Kaydet */}
          {className && (
            <button
              onClick={handleSaveClass}
              title="Sınıfı kaydet"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
            >
              <IconSave /> Kaydet
            </button>
          )}

          {/* Undo */}
          <button
            onClick={onUndo}
            title="Geri Al (Ctrl+Z)"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <IconUndo />
          </button>

          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          {/* School Name */}
          <input
            type="text"
            value={meta.schoolName}
            onChange={handleSchoolNameChange}
            placeholder="Okul Adı"
            className="flex-1 min-w-[180px] px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
          />

          {/* Term Selector */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            {(['1', '2'] as SemesterKey[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTermChange(t)}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTerm === t
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}. Dönem
              </button>
            ))}
          </div>

          {/* Settings toggle */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            title="Ayarlar"
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition shadow-sm ${
              settingsOpen
                ? 'bg-emerald-500 text-white'
                : 'border border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <IconSettings />
            <span className="hidden sm:inline">Ayarlar</span>
            <IconChevron open={settingsOpen} />
          </button>
        </div>

        {/* Settings Panel (collapsible) */}
        {settingsOpen && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Teacher */}
              <div>
                <label className="block text-xs font-medium text-emerald-700 mb-1">
                  Öğretmen Adı / Unvanı
                </label>
                <input
                  type="text"
                  value={meta.sigs.teacher}
                  onChange={handleTeacherChange}
                  placeholder="Öğretmen adı"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-emerald-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                />
              </div>

              {/* Principal */}
              <div>
                <label className="block text-xs font-medium text-emerald-700 mb-1">
                  Müdür (isteğe bağlı)
                </label>
                <input
                  type="text"
                  value={meta.sigs.principal}
                  onChange={handlePrincipalChange}
                  placeholder="Okul müdürü"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-emerald-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                />
              </div>

              {/* Vice Principal */}
              <div>
                <label className="block text-xs font-medium text-emerald-700 mb-1">
                  Müdür Yardımcısı (isteğe bağlı)
                </label>
                <input
                  type="text"
                  value={meta.sigs.vicePrincipal}
                  onChange={handleVicePrincipalChange}
                  placeholder="Müdür yardımcısı"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-emerald-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Row 3: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hesapla */}
          <button
            onClick={onCalculate}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-sm shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.98]"
          >
            <IconCalculate />
            Hesapla
          </button>

          {/* Yazdır / PDF */}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-sm shadow-slate-500/25 hover:shadow-slate-500/40 transition-all active:scale-[0.98]"
          >
            <IconPrint />
            Yazdır / PDF
          </button>

          {/* Taslak Kaydet */}
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-sm"
          >
            <IconSave />
            Taslak Kaydet
          </button>
        </div>
      </div>
    </header>
  );
}
