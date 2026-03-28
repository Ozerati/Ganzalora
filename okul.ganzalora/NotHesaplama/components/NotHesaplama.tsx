// ============================================================
// Not Hesaplama - Main Container Component
// ============================================================

import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { NotHesaplamaProvider, useNotHesaplama } from '../context/NotHesaplamaContext';
import { useFirestoreSync } from '../hooks/useFirestoreSync';
import BranchSelector from './BranchSelector';
import type { Branch } from './BranchSelector';
import NavBar from './NavBar';
import TabBar from './TabBar';
import PrintModal from './modals/PrintModal';
import ErrorModal from './modals/ErrorModal';
import NotifyModal from './modals/NotifyModal';

// Lazy-loaded tab content components
const PreviewTab = lazy(() => import('./tabs/PreviewTab'));
const StudentListTab = lazy(() => import('./tabs/StudentListTab'));
const RosterTab = lazy(() => import('./tabs/RosterTab'));
const EdebiyatTab = lazy(() => import('./tabs/EdebiyatTab'));
const YabanciTab = lazy(() => import('./tabs/YabanciTab'));
const BedenTab = lazy(() => import('./tabs/BedenTab'));
const AdvancedTab = lazy(() => import('./tabs/AdvancedTab'));
const AbsentTab = lazy(() => import('./tabs/AbsentTab'));
const AnalysisTab = lazy(() => import('./tabs/AnalysisTab'));
const SinavTakvimiTab = lazy(() => import('./tabs/SinavTakvimiTab'));
const SinifYonetimiTab = lazy(() => import('./tabs/SinifYonetimiTab'));

// --------------- Tab Content Renderer ---------------

function TabContent() {
  const { state } = useNotHesaplama();
  const { activeTab } = state;

  const tabMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
    onizleme: PreviewTab,
    liste: StudentListTab,
    roster: RosterTab,
    edebiyat: EdebiyatTab,
    yabanci: YabanciTab,
    bedenEgitimi: BedenTab,
    ileriModul: AdvancedTab,
    yoklama: AbsentTab,
    analiz: AnalysisTab,
    sinavTakvimi: SinavTakvimiTab,
  };

  const Component = tabMap[activeTab];

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <p>Sekme bulunamadı: {activeTab}</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-slate-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Yükleniyor...</span>
          </div>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

// --------------- Inner Shell (uses context) ---------------

function NotHesaplamaShell({ userId }: { userId: string }) {
  const { state, dispatch } = useNotHesaplama();

  // Branş seçimi
  const [branch, setBranch] = useState<Branch | null>(() => {
    const saved = sessionStorage.getItem('nh_branch') as Branch | null;
    return saved && ['yabanci', 'edebiyat', 'beden', 'diger'].includes(saved) ? saved : null;
  });

  const handleBranchSelect = useCallback((b: Branch) => {
    setBranch(b);
    sessionStorage.setItem('nh_branch', b);
    // Branşa uygun varsayılan tab'ı aç
    const defaultTabs: Record<Branch, string> = { yabanci: 'yabanci', edebiyat: 'edebiyat', beden: 'bedenEgitimi', diger: 'ileriModul' };
    dispatch({ type: 'SET_ACTIVE_TAB', payload: defaultTabs[b] as any });
  }, [dispatch]);

  const handleChangeBranch = useCallback(() => {
    setBranch(null);
    sessionStorage.removeItem('nh_branch');
  }, []);

  // Aktif sınıf adı
  const [activeClassName, setActiveClassName] = useState('');

  // Firestore sync
  const { save, load, saveClass, loadClass, getClassList } = useFirestoreSync(userId);

  // İlk yüklemede Firestore'dan veri çek
  useEffect(() => { load(); }, []);

  // Otomatik kaydetme — state değiştiğinde 2sn sonra kaydet
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // İlk yüklemede kaydetme (Firestore'dan gelen veriyi tekrar yazmamak için)
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      save().catch(console.error);
    }, 2000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [state.activeTab, state.activeSubTab, state.activeTerm, state.termStates, state.meta]);

  // Modal state (local, not in reducer)
  const [printOpen, setPrintOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notify, setNotify] = useState<string | null>(null);

  // Keyboard shortcut: Ctrl+Z for undo
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handlers passed to NavBar
  const handleCalculate = useCallback(() => {
    dispatch({ type: 'PUSH_UNDO', payload: 'Hesapla öncesi' });
    dispatch({ type: 'CALCULATE_ALL' });
    setNotify('Hesaplama tamamlandı.');
  }, [dispatch]);

  const handlePrint = useCallback(() => {
    setPrintOpen(true);
  }, []);

  const handleUndo = useCallback(() => {
    if (state._undoStack.length === 0) {
      setError('Geri alınacak işlem yok.');
      return;
    }
    dispatch({ type: 'UNDO' });
    setNotify('Son işlem geri alındı.');
  }, [dispatch, state._undoStack.length]);

  // Branş seçilmemişse branş seçim ekranı göster
  if (!branch) {
    return (
      <div className="min-h-screen bg-white">
        <BranchSelector onSelect={handleBranchSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* NavBar */}
      <NavBar
        onCalculate={handleCalculate}
        onPrint={handlePrint}
        onUndo={handleUndo}
        onSaveClass={async (name) => { await saveClass(name); setNotify(`"${name}" kaydedildi.`); }}
        onLoadClass={async (name) => { await loadClass(name); setNotify(`"${name}" yüklendi.`); }}
        onDeleteClass={async (name) => {
          const { deleteDoc, doc } = await import('firebase/firestore');
          const { db } = await import('../../../lib/firebase');
          await deleteDoc(doc(db, 'notHesaplamaUserData', userId, 'data', `class_${name}`));
          setNotify(`"${name}" silindi.`);
        }}
        onGetClassList={getClassList}
        onSave={async () => { await save(); setNotify('Taslak kaydedildi.'); }}
      />

      {/* TabBar */}
      <TabBar branch={branch} onChangeBranch={handleChangeBranch} />

      {/* Tab Content */}
      <main className="max-w-[1400px] mx-auto px-2 sm:px-4 py-4">
        {state.activeTab === 'sinifYonetimi' ? (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><span className="text-slate-400 animate-pulse">Yükleniyor...</span></div>}>
            <SinifYonetimiTab
              onSaveClass={async (name) => { await saveClass(name); setNotify(`"${name}" kaydedildi.`); }}
              onLoadClass={async (name) => { await loadClass(name); setNotify(`"${name}" yüklendi.`); }}
              onGetClassList={getClassList}
              activeClass={activeClassName}
              onClassChange={setActiveClassName}
            />
          </Suspense>
        ) : (
          <TabContent />
        )}
      </main>

      {/* Modals */}
      {printOpen && <PrintModal onClose={() => setPrintOpen(false)} />}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      {notify && <NotifyModal message={notify} onClose={() => setNotify(null)} />}
    </div>
  );
}

// --------------- Public Export ---------------

interface NotHesaplamaProps {
  userId: string;
}

export default function NotHesaplama({ userId }: NotHesaplamaProps) {
  return (
    <NotHesaplamaProvider>
      <NotHesaplamaShell userId={userId} />
    </NotHesaplamaProvider>
  );
}
