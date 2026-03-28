import React, { lazy, Suspense } from 'react';
const PdfViewer = lazy(() => import('./PdfViewer'));
// ExamBuilder moved to App.tsx as separate segment
import kemalAtayLogo from '../../../assets/Kemal atay.png';

const ContactFormAdmin = lazy(() => import('../../../components/ContactFormAdmin'));
import { runPrintProfile } from '../../../utils/printManager';
import {
  clearPortfolioStudentsOverride,
  loadBundledStudentsData,
  loadPortfolioStudentsDataAsync,
  savePortfolioStudentsOverride,
} from '../utils/portfolioStudentsData';
import {
  loadStateFromFirestore,
  saveStateToFirestore,
} from '../../../lib/portfolioFirestore';
import {
  CONTROL_OPTIONS,
  OZENILMIS_INDEX,
  calculateScoreFromModes,
  exportBackupFile,
  formatClassLabel,
  getAssignmentColumns,
  getCellLateMode,
  getCellMode,
  getAssignmentKey,
  getLateAssignmentKey,
  getNextCellMode,
  getNextLateMode,
  getNextRowStatus,
  getRowStatus,
} from '../utils/portfolioUtils';
import type { ClassState } from '../utils/portfolioUtils';
function useI18n() {
  const tr: Record<string, string> = {
    'common.adminPortfolio.title': 'Portfolio Takip Sistemi',
    'common.adminPortfolio.backToProgramArrow': '← Geri',
    'common.adminPortfolio.control': 'Kontrol',
    'common.adminPortfolio.lateModeClosed': 'Gecikme Modu Kapalı',
    'common.adminPortfolio.lateModeOpen': 'Gecikme Modu Açık',
    'common.adminPortfolio.clearAllMarks': 'Tüm İşaretleri Temizle',
    'common.adminPortfolio.loadStudentList': 'Öğrenci Listesi Yükle',
    'common.adminPortfolio.resetList': 'Listeyi Sıfırla',
    'common.adminPortfolio.saveBackup': 'Yedeği Kaydet',
    'common.adminPortfolio.loadBackup': 'Yedeği Yükle',
    'common.adminPortfolio.scoringGuide': 'Puanlama Rehberi',
    'common.adminPortfolio.contactForms': 'İletişim Formları',
    'common.adminPortfolio.studentListSample': 'Örnek Liste',
    'common.adminPortfolio.studentListLocal': 'Yerel Liste',
    'common.adminPortfolio.noSavedRecordForClass': 'Bu sınıf için kayıt yok',
    'common.adminPortfolio.adminOnly': '',
    'common.adminPortfolio.classControlTrackingTitle': 'Sınıf Kontrol Takip Tablosu',
    'common.adminPortfolio.pointColumn': 'Puan',
    'common.adminPortfolio.notSaved': 'Kaydedilmedi. KAYDET ile kalıcı yapın.',
    'common.adminPortfolio.lastSavedPrefix': 'Son kayıt:',
    'common.adminPortfolio.confirmClearTitle': 'Tüm işaretler silinsin mi?',
    'common.adminPortfolio.confirmClearBody': 'Bu sınıf ve kontrol için tüm veriler sıfırlanacak.',
    'common.adminPortfolio.confirmResetStudentsTitle': 'Liste sıfırlansın mı?',
    'common.adminPortfolio.confirmResetStudentsBody': 'Örnek listeye dönülecek.',
    'common.adminPortfolio.savedNotification': 'Kaydedildi!',
    'common.adminPortfolio.allMarksCleared': 'Tüm işaretler temizlendi',
    'common.actions.saveUpper': 'KAYDET',
    'common.actions.printOutput': 'Yazdır',
    'common.table.order': 'Sıra',
    'common.student.schoolNo': 'Okul No',
    'common.student.nameSurname': 'Adı Soyadı',
  };
  return { t: (key: string, fallback?: string) => tr[key] || fallback || key, language: 'tr' };
}

function getColumnTheme(index: number) {
  if (index <= 3) {
    return {
      headerClass: 'bg-gradient-to-b from-sky-100 to-sky-200 text-sky-900',
      cellClass: 'bg-sky-50/60',
      buttonClass: 'border-sky-300 bg-white/95 text-slate-700',
    };
  }

  if (index === 4) {
    return {
      headerClass: 'bg-gradient-to-b from-emerald-100 to-emerald-200 text-emerald-900',
      cellClass: 'bg-emerald-50/60',
      buttonClass: 'border-emerald-300 bg-white/95 text-slate-700',
    };
  }

  if (index === 5) {
    return {
      headerClass: 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-900',
      cellClass: 'bg-amber-50/60',
      buttonClass: 'border-amber-300 bg-white/95 text-slate-700',
    };
  }

  return {
    headerClass: 'bg-gradient-to-b from-violet-100 to-violet-200 text-violet-900',
    cellClass: 'bg-violet-50/60',
    buttonClass: 'border-violet-300 bg-white/95 text-slate-700',
  };
}


function getCellVisual(mode: string) {
  if (mode === 'full') {
    return {
      title: 'Tam',
      className: 'border-slate-400 bg-white text-slate-700',
      icon: 'full',
      iconClass: 'text-emerald-600',
    };
  }

  if (mode === 'partial') {
    return {
      title: 'Yarım +',
      className: 'border-slate-400 bg-white text-slate-700',
      icon: 'partial',
      iconClass: 'text-amber-700',
    };
  }

  if (mode === 'late1') {
    return {
      title: 'Geç Seviye 1',
      className: 'border-slate-400 bg-white text-slate-700',
      icon: 'late1',
      iconClass: 'text-amber-500',
    };
  }

  if (mode === 'late2') {
    return {
      title: 'Geç Seviye 2',
      className: 'border-slate-400 bg-white text-slate-700',
      icon: 'late2',
      iconClass: 'text-amber-600',
    };
  }

  if (mode === 'late3') {
    return {
      title: 'Geç Seviye 3',
      className: 'border-slate-400 bg-white text-slate-700',
      icon: 'late3',
      iconClass: 'text-amber-700',
    };
  }

  return {
    title: 'Boş',
    className: 'border-slate-400 bg-white text-slate-700',
    icon: 'none',
    iconClass: 'text-rose-600',
  };
}

function FullCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PartialMinusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.8" fill="#FDE68A" stroke="#D97706" strokeWidth="1.8" />
      <path d="M7.2 12h9.6" stroke="#92400E" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function NoneSlashCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M7.5 16.5 16.5 7.5" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 10.8 6.8 7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z" />
      <path d="M18.5 13.5 17.9 15.4 16 16l1.9.6.6 1.9.6-1.9 1.9-.6-1.9-.6-.6-1.9Z" />
      <path d="M6 14.5 5.4 16.4 3.5 17l1.9.6.6 1.9.6-1.9 1.9-.6-1.9-.6L6 14.5Z" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9V4h12v5" />
      <rect x="4" y="9" width="16" height="8" rx="2" />
      <path d="M7 17h10v3H7z" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function RowStatusIcon({ status }: { status: string }) {
  if (status === 'locked') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8 12h8" />
      </svg>
    );
  }

  if (status === 'absent') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M7.5 16.5 16.5 7.5" />
      </svg>
    );
  }

  if (status === 'gelmedi') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.2 8.2 15.8 15.8" />
        <path d="M15.8 8.2 8.2 15.8" />
      </svg>
    );
  }

  if (status === 'raporlu') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="6" y="4.5" width="12" height="15" rx="2" />
        <path d="M9 9.5h6" />
        <path d="M9 13h6" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12.5 10.8 15 16 9" />
    </svg>
  );
}

export default function AdminPortfolioPanel({ currentUser, onClose, isAdmin = false }: { currentUser: { email?: string } | null; onClose: () => void; isAdmin?: boolean }) {
  const { t, language } = useI18n();
  const hasAccess = isAdmin && !!currentUser;

  const [studentDirectory, setStudentDirectory] = React.useState(() => loadBundledStudentsData());
  const [studentListSource, setStudentListSource] = React.useState<'firestore' | 'sample'>('sample');
  const [isSyncing, setIsSyncing] = React.useState(true);
  const classKeys = React.useMemo(() => Object.keys(studentDirectory).sort(), [studentDirectory]);
  const [activeClass, setActiveClass] = React.useState(() => Object.keys(loadBundledStudentsData()).sort()[0] || '9A');
  const [activeControl, setActiveControl] = React.useState(1);
  const [isLateMode, setIsLateMode] = React.useState(false);
  const [state, setState] = React.useState<ClassState>({});
  const [saveText, setSaveText] = React.useState('');
  const [isDirty, setIsDirty] = React.useState(false);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = React.useState(false);
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = React.useState(false);
  const [isYaziliOpen, setIsYaziliOpen] = React.useState(false);
  const [yaziliPreviewFile, setYaziliPreviewFile] = React.useState<string | null>(null);
  // ExamBuilder is now a separate segment in App.tsx
  const [_isPrintMode, setIsPrintMode] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const studentListInputRef = React.useRef<HTMLInputElement>(null);

  const yaziliFiles = React.useMemo(() => [
    { name: 'Written Exam - Senaryo 1', pdf: '/yazili/senaryo1-exam.pdf', docx: '/yazili/senaryo1-exam.docx' },
    { name: 'Written Exam - Senaryo 2', pdf: '/yazili/senaryo2-exam.pdf', docx: '/yazili/senaryo2-exam.docx' },
    { name: 'Written Exam - Senaryo 3', pdf: '/yazili/senaryo3-exam.pdf', docx: '/yazili/senaryo3-exam.docx' },
    { name: 'Soru Havuzu', pdf: '/yazili/soru-havuzu.pdf', docx: '/yazili/soru-havuzu.docx' },
    { name: 'Answer Key - Senaryo 1', pdf: '/yazili/senaryo1-key.pdf' },
    { name: 'Answer Key - Senaryo 2', pdf: '/yazili/senaryo2-key.pdf' },
    { name: 'Answer Key - Senaryo 3', pdf: '/yazili/senaryo3-key.pdf' },
  ], []);

  // İlk yüklemede Firestore'dan öğrenci listesini çek
  React.useEffect(() => {
    let cancelled = false;
    loadPortfolioStudentsDataAsync().then(({ data, source }) => {
      if (cancelled) return;
      setStudentDirectory(data);
      setStudentListSource(source);
    });
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (classKeys.length === 0) return;
    if (!classKeys.includes(activeClass)) {
      setActiveClass(classKeys[0]);
    }
  }, [activeClass, classKeys]);

  React.useEffect(() => {
    if (!isGuideOpen && !isYaziliOpen) return undefined;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (yaziliPreviewFile) { setYaziliPreviewFile(null); return; }
        setIsGuideOpen(false);
        setIsYaziliOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isGuideOpen, isYaziliOpen, yaziliPreviewFile]);

  React.useEffect(() => {
    const onBeforePrint = () => setIsPrintMode(true);
    const onAfterPrint = () => {
      setIsPrintMode(false);
      document.body.classList.remove('printing-admin-portfolio');
    };

    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  const students = React.useMemo(() => {
    const list = studentDirectory[activeClass] || [];
    return list.map((student, index) => ({
      sira: index + 1,
      no: student.no,
      ad: student.ad,
    }));
  }, [activeClass, studentDirectory]);

  const assignmentColumns = React.useMemo(() => getAssignmentColumns(activeControl), [activeControl]);
  const classLabel = React.useMemo(() => formatClassLabel(activeClass), [activeClass]);
  const nameColumnWidthCh = React.useMemo(() => {
    const longest = students.reduce((maxLen, student) => Math.max(maxLen, String(student.ad || '').length), 18);
    // Keep the column close to the longest name while preventing overly wide layouts.
    return Math.min(Math.max(longest + 2, 18), 30);
  }, [students]);

  const renderedRows = React.useMemo(() => {
    return students.map((student) => {
      const studentState = state[String(student.no)] || {};
      const rowStatus = getRowStatus(studentState);
      const rowLocked = rowStatus !== 'normal';

      return {
        ...student,
        rowLocked,
        rowStatus,
        cellModes: assignmentColumns.map((_, index) => getCellMode(studentState, index)),
        lateModes: assignmentColumns.map((_, index) => getCellLateMode(studentState, index)),
      };
    });
  }, [students, state, assignmentColumns]);

  const renderedRowsWithScore = React.useMemo(() => {
    return renderedRows.map((row) => ({
      ...row,
      score: calculateScoreFromModes(row.cellModes, row.lateModes),
    }));
  }, [renderedRows]);

  const hasSavedRecord = saveText.startsWith(t('common.adminPortfolio.lastSavedPrefix', 'Son kayıt:'));
  const saveTextDisplay = isDirty ? t('common.adminPortfolio.notSaved', 'Kaydedilmedi. KAYDET ile kalici yapin.') : saveText;
  const tableColumnCount = assignmentColumns.length + 4;

  const applyDraftState = React.useCallback((nextState: ClassState) => {
    setState(nextState);
    setIsDirty(true);
  }, []);

  const handleSave = React.useCallback(async () => {
    setIsSyncing(true);
    try {
      const savedAt = await saveStateToFirestore(activeClass, activeControl, state);
      setSaveText(`${t('common.adminPortfolio.lastSavedPrefix', 'Son kayıt:')} ${new Date(savedAt).toLocaleString('tr-TR')}`);
      setIsDirty(false);
    } catch (err) {
      console.warn('[AdminPortfolio] Firestore save failed', err);
      setSaveText('Kaydetme hatası! Tekrar deneyin.');
    } finally {
      setIsSyncing(false);
    }
  }, [activeClass, activeControl, state, t]);

  React.useEffect(() => {
    let cancelled = false;
    setState({});
    setIsDirty(false);
    setIsSyncing(true);
    setSaveText('Yükleniyor...');

    loadStateFromFirestore(activeClass, activeControl).then((result) => {
      if (cancelled) return;
      if (result) {
        setState(result.state);
        if (result.lastSaved) {
          setSaveText(`${t('common.adminPortfolio.lastSavedPrefix', 'Son kayıt:')} ${new Date(result.lastSaved).toLocaleString('tr-TR')}`);
        } else {
          setSaveText(t('common.adminPortfolio.noSavedRecordForClass', 'Bu sınıf için kayıt bulunmuyor.'));
        }
      } else {
        setSaveText(t('common.adminPortfolio.noSavedRecordForClass', 'Bu sınıf için kayıt bulunmuyor.'));
      }
    }).catch(() => {
      if (!cancelled) setSaveText('Sunucu bağlantı hatası!');
    }).finally(() => {
      if (!cancelled) setIsSyncing(false);
    });

    return () => { cancelled = true; };
  }, [activeClass, activeControl, language]);

  const setRowStatus = React.useCallback((schoolNo: string | number, nextStatus: string) => {
    const key = String(schoolNo);
    const current = state[key] && typeof state[key] === 'object' ? state[key] : {};

    const nextState = {
      ...state,
      [key]: {
        ...current,
        _rowStatus: nextStatus,
        _locked: nextStatus === 'locked',
      },
    };

    if (nextStatus === 'normal') {
      delete nextState[key]._rowStatus;
      delete nextState[key]._locked;
    }

    applyDraftState(nextState);
  }, [state, applyDraftState]);

  const cycleRowStatus = React.useCallback((schoolNo: string | number) => {
    const key = String(schoolNo);
    const current = state[key] && typeof state[key] === 'object' ? state[key] : {};
    const nextStatus = getNextRowStatus(getRowStatus(current));
    setRowStatus(schoolNo, nextStatus);
  }, [state, setRowStatus]);

  const cycleCell = React.useCallback((schoolNo: string | number, assignmentIndex: number, clickCount = 1) => {
    const key = String(schoolNo);
    const current = state[key] && typeof state[key] === 'object' ? state[key] : {};

    if (getRowStatus(current) !== 'normal') return;

    const assignmentKey = getAssignmentKey(assignmentIndex);
    const lateAssignmentKey = getLateAssignmentKey(assignmentIndex);
    const currentMode = getCellMode(current, assignmentIndex);
    const currentLateMode = getCellLateMode(current, assignmentIndex);
    const nextStudent = { ...current };

    if (isLateMode && assignmentIndex !== OZENILMIS_INDEX) {
      if (currentMode === 'none') return;
      // Prevent accidental double-click from promoting G0 to G1.
      if (currentLateMode === 'late0' && clickCount > 1) return;
      const nextLateMode = getNextLateMode(currentLateMode);
      if (nextLateMode === 'none') {
        delete nextStudent[lateAssignmentKey];
      } else {
        nextStudent[lateAssignmentKey] = nextLateMode;
      }
    } else {
      const nextMode = getNextCellMode(currentMode, assignmentIndex);
      if (nextMode === 'none') {
        delete nextStudent[assignmentKey];
        if (assignmentIndex !== OZENILMIS_INDEX) {
          delete nextStudent[lateAssignmentKey];
        }
      } else {
        nextStudent[assignmentKey] = nextMode;
      }
    }

    const nextState = {
      ...state,
      [key]: nextStudent,
    };

    applyDraftState(nextState);
  }, [state, applyDraftState, isLateMode]);

  const clearAll = React.useCallback(() => {
    if (!window.confirm(t('common.adminPortfolio.confirmClearMarks', 'Tum işaretler temizlensin mi? Getirmedi, Gelmedi, Devamsız ve Raporlu satırlar korunur.'))) return;

    const nextState: ClassState = {};
    students.forEach((student) => {
      const key = String(student.no);
      const rowStatus = getRowStatus(state[key]);
      if (rowStatus === 'locked') {
        nextState[key] = { _rowStatus: 'locked', _locked: true };
      }
      if (rowStatus === 'absent') {
        nextState[key] = { _rowStatus: 'absent' };
      }
      if (rowStatus === 'gelmedi') {
        nextState[key] = { _rowStatus: 'gelmedi' };
      }
      if (rowStatus === 'raporlu') {
        nextState[key] = { _rowStatus: 'raporlu' };
      }
    });

    applyDraftState(nextState);
  }, [students, state, applyDraftState, t]);

  const handleExport = React.useCallback(() => {
    exportBackupFile(state, `${activeClass}-kontrol-${activeControl}`);
  }, [state, activeClass, activeControl]);

  const handlePrint = React.useCallback(async () => {
    await runPrintProfile({
      profile: 'adminPortfolio',
      beforePrint: () => setIsPrintMode(true),
      afterPrint: () => setIsPrintMode(false),
      printImpl: async () => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            window.print();
          });
        });
        await new Promise((resolve) => setTimeout(resolve, 80));
      },
    });
  }, []);

  const handleImportFile = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const importedState = parsed?.state && typeof parsed.state === 'object' ? parsed.state : parsed;

      if (!importedState || typeof importedState !== 'object') {
        window.alert(t('common.adminPortfolio.invalidBackupFile', 'Geçersiz yedek dosyası.'));
        return;
      }

      applyDraftState(importedState);
      window.alert(t('common.adminPortfolio.backupLoadedSaveReminder', 'Yedek yüklendi. Kalici olmasi için KAYDET tusuna basin.'));
    } catch {
      window.alert(t('common.adminPortfolio.fileReadError', 'Dosya okunurken hata olustu.'));
    } finally {
      event.target.value = '';
    }
  }, [applyDraftState, t]);


  const handleResetStudentList = React.useCallback(async () => {
    if (!window.confirm(t('common.adminPortfolio.confirmResetStudentList', 'Öğrenci listesi sıfırlansın ve örnek listeye dönülsün mü?'))) return;

    setIsSyncing(true);
    try {
      await clearPortfolioStudentsOverride();
      setStudentDirectory(loadBundledStudentsData());
      setStudentListSource('sample');
    } catch (err) {
      console.warn('[AdminPortfolio] Reset student list failed', err);
    } finally {
      setIsSyncing(false);
    }
  }, [t]);

  const handleImportStudentList = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const directoryPayload = parsed?.students || parsed?.data || parsed;
      setIsSyncing(true);
      const nextDirectory = await savePortfolioStudentsOverride(directoryPayload);
      setStudentDirectory(nextDirectory);
      setStudentListSource('firestore');
      window.alert(t('common.adminPortfolio.studentListLoadedInfo', 'Öğrenci listesi sunucuya kaydedildi.'));
    } catch {
      window.alert(t('common.adminPortfolio.invalidStudentListFile', 'Geçersiz öğrenci listesi dosyası. Beklenen format: { "9A": [{ "no": 1, "ad": "..." }] }.'));
    } finally {
      setIsSyncing(false);
      event.target.value = '';
    }
  }, [t]);

  if (!hasAccess) {
    return (
      <div className="m-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
        {t('common.adminPortfolio.adminOnly', 'Bu alan yalnızca yetkili admin hesabı için açıktır.')}
      </div>
    );
  }

  return (
    <div className="print-table-container h-full w-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 print-surface">
      <style>{`@page { size: A4 portrait; margin: 8mm; } @media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } html, body, #root { background: #fff !important; height: auto !important; min-height: 0 !important; overflow: visible !important; } .no-print { display: none !important; } .print-surface { background: #fff !important; height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; } .print-main, .print-layout, .print-left { display: block !important; height: auto !important; min-height: 0 !important; overflow: visible !important; padding: 0 !important; } .print-toolbar { display: none !important; } .print-table-card { border: none !important; box-shadow: none !important; border-radius: 0 !important; overflow: visible !important; display: block !important; } .print-table-wrap { overflow: visible !important; height: auto !important; max-height: none !important; -ms-overflow-style: none !important; scrollbar-width: none !important; display: block !important; } .print-table-wrap::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; } .print-table { width: 100% !important; max-width: 100% !important; min-width: 0 !important; table-layout: auto !important; border-collapse: collapse !important; font-size: 12px !important; page-break-inside: auto !important; } tr { page-break-inside: avoid !important; page-break-after: auto !important; } .print-table-outer { padding-right: 2mm !important; display: block !important; width: 100% !important; max-width: 100% !important; overflow: visible !important; } .print-table thead { display: table-header-group !important; } .print-table th, .print-table td { width: auto !important; min-width: 0 !important; max-width: none !important; border: 1px solid #64748b !important; } .print-table thead tr:last-child th { height: auto !important; padding-top: 6px !important; padding-bottom: 6px !important; width: auto !important; min-width: 0 !important; max-width: none !important; } .print-table th, .print-table td { padding: 4px 5px !important; } .print-table .print-name-cell, .print-table .print-name-cell * { font-size: 12px !important; } .print-score-badge { min-height: 32px !important; min-width: 50px !important; border-width: 1px !important; font-size: 16px !important; padding: 0 8px !important; margin: 0 auto !important; display: inline-flex !important; } .print-title-main { font-size: 22px !important; line-height: 1.1 !important; font-weight: 900 !important; letter-spacing: 0.03em !important; text-align: center !important; border: none !important; } .print-title-sub { font-size: 16px !important; line-height: 1.3 !important; font-weight: 900 !important; border: none !important; } .print-title-row { display: flex !important; align-items: center !important; justify-content: center !important; gap: 10px !important; } .print-title-logo { width: 60px !important; height: 60px !important; object-fit: contain !important; } .print-school-header { padding: 11px 14px !important; background: #fff !important; background-image: none !important; border: 1px solid #64748b !important; } .print-class-header { padding: 12px 14px !important; background: #fff !important; background-image: none !important; border: 1px solid #64748b !important; border-top: none !important; } button { border-width: 1px !important; } svg { display: inline-block !important; } .planner-root-shell { height: auto !important; overflow: visible !important; } .admin-portfolio-shell { height: auto !important; overflow: visible !important; } .planner-root-shell::-webkit-scrollbar, .admin-portfolio-shell::-webkit-scrollbar { display: none !important; } .print-left-fixed-col { z-index: 30 !important; background: #fff !important; border: 1px solid #64748b !important; box-shadow: inset 0 0 0 1px #64748b !important; } .print-table td.sticky, .print-table th.sticky { z-index: 25 !important; } tr[style] td { background-image: none !important; } }`}</style>
      <div className="print-main flex min-h-full flex-col gap-2 p-2 md:p-3">
        <div className="print-toolbar sticky top-0 z-40 rounded-xl border border-slate-300 bg-white/95 p-2 shadow-sm backdrop-blur md:p-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-700 hover:border-slate-500"
                >
                  {t('common.adminPortfolio.backToProgramArrow', '← Programa Dön')}
                </button>
                <h2 className="text-base font-extrabold text-slate-900 md:text-lg">{t('common.adminPortfolio.title', 'Admin Portfolyo Paneli')}</h2>
              </div>
            </div>
            <div className="flex w-full gap-2 overflow-x-auto pb-1 md:w-auto md:flex-wrap md:overflow-visible">
              {classKeys.map((classKey) => (
                <button
                  key={classKey}
                  type="button"
                  onClick={() => setActiveClass(classKey)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold transition md:text-sm ${
                    classKey === activeClass
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-600'
                  }`}
                >
                  {classKey}
                </button>
              ))}
            </div>
            <div className="flex w-full gap-1.5 overflow-x-auto pb-1 md:w-auto md:overflow-visible">
              {CONTROL_OPTIONS.map((controlNo) => (
                <button
                  key={controlNo}
                  type="button"
                  onClick={() => setActiveControl(controlNo)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold transition md:text-xs ${
                    controlNo === activeControl
                      ? 'border-indigo-700 bg-indigo-700 text-white shadow-sm'
                      : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-400'
                  }`}
                >
                  {controlNo}. {t('common.adminPortfolio.control', 'Kontrol')}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 hidden flex-wrap gap-1.5 md:flex">
            <button
              type="button"
              onClick={() => setIsLateMode((prev) => !prev)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold md:text-sm ${isLateMode ? 'border-amber-700 bg-amber-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-600'}`}
            >
              {isLateMode ? t('common.adminPortfolio.lateModeOpen', 'Geç Modu: Açık (0-1-2-3)') : t('common.adminPortfolio.lateModeClosed', 'Geç Modu: Kapali')}
            </button>
            <button type="button" onClick={clearAll} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold hover:border-slate-600 md:text-sm">{t('common.adminPortfolio.clearAllMarks', 'Tum İşaretleri Temizle')}</button>
            <button type="button" onClick={handleSave} className="rounded-lg border border-emerald-700 bg-emerald-700 px-2.5 py-1.5 text-xs font-bold text-white md:text-sm">{t('common.actions.saveUpper', 'KAYDET')}</button>
            <button type="button" onClick={handleExport} className="rounded-lg border border-slate-800 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-white md:text-sm">{t('common.adminPortfolio.saveBackup', 'Yedek Kaydet')}</button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-blue-900 bg-blue-900 px-2.5 py-1.5 text-xs font-bold text-white md:text-sm">{t('common.adminPortfolio.loadBackup', 'Yedek Yükle')}</button>
            <button type="button" onClick={() => studentListInputRef.current?.click()} className="rounded-lg border border-violet-800 bg-violet-800 px-2.5 py-1.5 text-xs font-bold text-white md:text-sm">{t('common.adminPortfolio.loadStudentList', 'Öğrenci Listesi Yükle')}</button>
            <button type="button" onClick={handleResetStudentList} className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-xs font-bold text-violet-800 md:text-sm">{t('common.adminPortfolio.resetList', 'Listeyi Sifirla')}</button>
            <button type="button" onClick={handlePrint} className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-700 px-2.5 py-1.5 text-xs font-bold text-white md:text-sm">
              <PrintIcon />
              {t('common.actions.printOutput', 'Çıktı Al')}
            </button>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="no-print rounded-lg border border-emerald-700 bg-emerald-700 px-2.5 py-1.5 text-xs font-bold text-white md:text-sm"
            >
              {t('common.adminPortfolio.scoringGuide', 'Puanlama Rehberi')}
            </button>
            <button
              type="button"
              onClick={() => setIsContactFormOpen((prev) => !prev)}
              className={`no-print rounded-lg border px-2.5 py-1.5 text-xs font-bold md:text-sm ${isContactFormOpen ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:border-indigo-500'}`}
            >
              {t('common.adminPortfolio.contactForms', 'İletişim Formları')}
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
            <input ref={studentListInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportStudentList} />
            <div className={`rounded-md border px-2 py-1 text-[11px] font-semibold md:text-xs ${studentListSource !== 'sample' ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              {studentListSource === 'firestore'
                ? 'Öğrenci listesi: Sunucu'
                : t('common.adminPortfolio.studentListSample', 'Öğrenci listesi: Örnek veri')}
            </div>
            <div className={`ml-auto flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold md:text-xs ${isDirty ? 'border-orange-200 bg-orange-50 text-orange-700' : hasSavedRecord ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              {isSyncing && (
                <svg className="h-3 w-3 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {saveTextDisplay}
            </div>
          </div>

          <div className="mt-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileActionsOpen((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"
            >
              {isMobileActionsOpen ? t('common.adminPortfolio.hideActions', 'Aksiyonlari Gizle') : t('common.adminPortfolio.actions', 'Aksiyonlar')}
            </button>

            {isMobileActionsOpen && (
              <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <button
                  type="button"
                  onClick={() => setIsLateMode((prev) => !prev)}
                  className={`rounded-md border px-2 py-1.5 text-[10px] font-semibold ${isLateMode ? 'border-amber-700 bg-amber-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
                >
                  {isLateMode ? t('common.adminPortfolio.lateModeOpenShort', 'Geç Modu Acik') : t('common.adminPortfolio.lateModeClosedShort', 'Geç Modu Kapali')}
                </button>
                <button type="button" onClick={clearAll} className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-700">{t('common.actions.clear', 'Temizle')}</button>
                <button type="button" onClick={handleSave} className="rounded-md border border-emerald-700 bg-emerald-700 px-2 py-1.5 text-[10px] font-semibold text-white">{t('common.actions.saveUpper', 'KAYDET')}</button>
                <button type="button" onClick={handleExport} className="rounded-md border border-slate-700 bg-slate-700 px-2 py-1.5 text-[10px] font-semibold text-white">{t('common.adminPortfolio.saveBackup', 'Yedek Kaydet')}</button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border border-blue-800 bg-blue-800 px-2 py-1.5 text-[10px] font-semibold text-white">{t('common.adminPortfolio.loadBackup', 'Yedek Yükle')}</button>
                <button type="button" onClick={() => studentListInputRef.current?.click()} className="rounded-md border border-violet-800 bg-violet-800 px-2 py-1.5 text-[10px] font-semibold text-white">{t('common.adminPortfolio.loadListShort', 'Liste Yükle')}</button>
                <button type="button" onClick={handleResetStudentList} className="rounded-md border border-violet-200 bg-violet-50 px-2 py-1.5 text-[10px] font-semibold text-violet-800">{t('common.adminPortfolio.resetList', 'Listeyi Sifirla')}</button>
                <button type="button" onClick={handlePrint} className="rounded-md border border-slate-700 bg-slate-700 px-2 py-1.5 text-[10px] font-semibold text-white">{t('common.actions.printOutput', 'Çıktı Al')}</button>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="col-span-2 rounded-md border border-emerald-700 bg-emerald-700 px-2 py-1.5 text-[10px] font-semibold text-white"
                >
                  {t('common.adminPortfolio.scoringGuide', 'Puanlama Rehberi')}
                </button>
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  className="col-span-2 rounded-md border border-slate-400 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-700"
                >
                  {t('common.adminPortfolio.backToProgramArrow', '← Programa Dön')}
                </button>
                <div className={`col-span-2 rounded-md border px-2 py-1 text-[10px] font-semibold ${studentListSource !== 'sample' ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  {studentListSource === 'local'
                    ? t('common.adminPortfolio.studentListLocal', 'Öğrenci listesi: Yerel özel veri')
                    : t('common.adminPortfolio.studentListSample', 'Öğrenci listesi: Anonim örnek veri')}
                </div>
                <div className={`col-span-2 flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold ${isDirty ? 'border-orange-200 bg-orange-50 text-orange-700' : hasSavedRecord ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                  {isSyncing && (
                    <svg className="h-3 w-3 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {saveTextDisplay}
                </div>
              </div>
            )}
          </div>
        </div>

        {isContactFormOpen && (
          <div className="no-print rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm">
            <Suspense fallback={<div className="p-4 text-sm text-slate-400 animate-pulse">Yükleniyor…</div>}>
              <ContactFormAdmin />
            </Suspense>
          </div>
        )}

        <div className="print-layout min-h-0 flex-1">
          <div className="print-left min-h-0 flex flex-col items-center gap-2">
            <div className="print-table-card min-h-0 w-full max-w-[1480px] flex-1 overflow-visible rounded-2xl border border-slate-300 bg-white shadow-sm">
              <div
                className="print-table-wrap h-full max-h-[72dvh] overflow-auto overscroll-contain md:max-h-[78dvh]"
                style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
              >
                <div className="print-table-outer mx-auto flex w-max items-start pr-12 md:pr-14">
                <table className="print-table mx-auto min-w-[820px] border-separate border-spacing-0 text-[12px] text-slate-900 md:min-w-[1080px] md:text-base">
              <thead>
                <tr>
                  <th
                    colSpan={tableColumnCount}
                    className="print-school-header border border-slate-500/70 bg-white px-3 py-3.5 text-center text-[14px] font-extrabold tracking-[0.01em] text-slate-900 md:text-[16px]"
                  >
                    <div className="print-title-row flex items-center justify-center gap-2.5">
                      <img src={kemalAtayLogo} alt="Kemal Atay" className="print-title-logo h-12 w-12 rounded-md object-contain" />
                      <p className="print-title-main text-center text-[13px] font-black tracking-[0.03em] text-slate-800 md:text-[18px]">
                        KEMAL ATAY MESLEKİ VE TEKNİK
                        <br />
                        ANADOLU LİSESİ
                      </p>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={tableColumnCount}
                    className="print-class-header border border-slate-500/70 bg-white px-3 py-3 text-center"
                  >
                    <p className="print-title-sub text-[14px] font-extrabold text-slate-900 md:text-[19px]">
                      {t('common.adminPortfolio.classControlTrackingTitle', '{{classLabel}} Sınıfi 2. Dönem Portfolyo {{control}}. Kontrol Takip Çizelgesi', { classLabel, control: activeControl })}
                    </p>
                  </th>
                </tr>
                <tr>
                  <th className="print-left-fixed-col sticky top-0 left-0 z-30 h-6 border border-slate-500/70 bg-gradient-to-b from-slate-100 to-slate-200 px-1 py-2.5 text-center w-10">{t('common.table.order', 'Sıra')}</th>
                  <th className="print-left-fixed-col sticky top-0 left-10 z-30 h-6 border border-slate-500/70 bg-gradient-to-b from-slate-100 to-slate-200 px-1 py-2.5 text-center w-14">{t('common.student.schoolNo', 'Okul No')}</th>
                  <th
                    className="print-left-fixed-col sticky top-0 left-24 z-30 h-6 border border-slate-500/70 bg-gradient-to-b from-slate-100 to-slate-200 px-2 py-2.5 text-left whitespace-nowrap"
                    style={{ width: `${nameColumnWidthCh}ch`, minWidth: `${nameColumnWidthCh}ch` }}
                  >
                    {t('common.student.nameSurname', 'Adı Soyadı')}
                  </th>
                  {assignmentColumns.map((label, idx) => {
                    const columnTheme = getColumnTheme(idx);
                    return (
                      <th key={label} className={`sticky top-0 z-20 h-6 border border-slate-500/70 px-2 py-2.5 text-center w-24 whitespace-pre-line leading-tight ${columnTheme.headerClass}`}>
                        {label}
                      </th>
                    );
                  })}
                  <th className="sticky top-0 z-20 h-6 border border-slate-500/70 bg-gradient-to-b from-slate-100 to-slate-200 px-2 py-2.5 text-center min-w-[120px]">{t('common.adminPortfolio.scoreOutOf25', 'Puan (25)')}</th>
                </tr>
              </thead>
              <tbody>
                {renderedRowsWithScore.map((row) => {
                  const hasRowBadge = row.rowStatus !== 'normal';
                  const rowClass = hasRowBadge || isLateMode ? '' : 'hover:bg-blue-50/40';
                  const stickyCellHoverClass = hasRowBadge
                    ? 'bg-white text-slate-900 group-hover:bg-slate-100'
                    : isLateMode
                      ? 'bg-inherit'
                      : 'bg-inherit group-hover:bg-blue-50/40';
                  const rowStyle = hasRowBadge
                    ? { backgroundImage: 'repeating-linear-gradient(135deg, rgba(148,163,184,0.12) 0px, rgba(148,163,184,0.12) 8px, transparent 8px, transparent 16px)' }
                    : undefined;
                  const rowRibbonClass =
                    row.rowStatus === 'locked'
                      ? 'border-amber-500/90 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 shadow-[0_2px_8px_rgba(217,119,6,0.30)]'
                      : row.rowStatus === 'gelmedi'
                        ? 'border-orange-500/90 bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950 shadow-[0_2px_8px_rgba(234,88,12,0.28)]'
                        : row.rowStatus === 'absent'
                          ? 'border-rose-500/90 bg-gradient-to-br from-rose-400 to-rose-600 text-rose-950 shadow-[0_2px_8px_rgba(225,29,72,0.30)]'
                          : 'border-sky-500/90 bg-gradient-to-br from-cyan-400 to-sky-600 text-sky-950 shadow-[0_2px_8px_rgba(2,132,199,0.28)]';
                  const rowRibbonText =
                    row.rowStatus === 'locked'
                      ? t('common.status.notBroughtUpper', 'GETIRMEDI')
                      : row.rowStatus === 'gelmedi'
                        ? t('common.status.notPresentUpper', 'GELMEDI')
                        : row.rowStatus === 'absent'
                          ? t('common.status.absentUpper', 'DEVAMSIZ')
                          : t('common.status.reportedUpper', 'RAPORLU');
                  const rowRibbonVisibility = 'opacity-90 group-hover:opacity-100';
                  const rowRibbonSizeClass =
                    row.rowStatus === 'locked'
                      ? 'min-w-[126px]'
                      : row.rowStatus === 'gelmedi'
                        ? 'min-w-[112px]'
                        : row.rowStatus === 'absent'
                          ? 'min-w-[106px]'
                          : 'min-w-[110px]';
                  const scoreToneClass =
                    row.score.baseScore < 10
                      ? 'border-rose-300/80 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700 shadow-[0_2px_8px_rgba(244,63,94,0.18)]'
                      : row.score.baseScore < 18
                        ? 'border-amber-300/80 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 shadow-[0_2px_8px_rgba(245,158,11,0.18)]'
                        : 'border-emerald-300/80 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.18)]';
                  const scoreValue = row.score.totalScore;
                  const scoreDisplay = scoreValue === 0 ? '0.0' : scoreValue.toFixed(1);
                  const assignmentAreaWidthPx = assignmentColumns.length * 96;
                  const rowStatusButtonClass =
                    row.rowStatus === 'normal'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : row.rowStatus === 'locked'
                        ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : row.rowStatus === 'gelmedi'
                          ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
                          : row.rowStatus === 'absent'
                            ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100';
                  const rowStatusText =
                    row.rowStatus === 'normal'
                      ? t('common.status.open', 'Acik')
                      : row.rowStatus === 'locked'
                        ? t('common.status.notBrought', 'Getirmedi')
                        : row.rowStatus === 'gelmedi'
                          ? t('common.status.notPresent', 'Gelmedi')
                          : row.rowStatus === 'absent'
                            ? t('common.status.absent', 'Devamsız')
                            : t('common.status.reported', 'Raporlu');

                  return (
                  <tr key={row.no} className={`group relative ${rowClass}`} style={rowStyle}>
                    <td className={`print-left-fixed-col sticky left-0 z-20 border border-slate-500/70 px-1 py-2.5 text-center text-[12px] font-semibold ${stickyCellHoverClass}`}>{row.sira}</td>
                    <td className={`print-left-fixed-col sticky left-10 z-20 border border-slate-500/70 px-1 py-2.5 text-center text-[12px] font-semibold ${stickyCellHoverClass}`}>{row.no}</td>
                    <td
                      className={`print-left-fixed-col print-name-cell sticky left-24 z-20 border border-slate-500/70 px-2 py-2.5 text-[13px] font-semibold whitespace-nowrap ${stickyCellHoverClass}`}
                      style={{ width: `${nameColumnWidthCh}ch`, minWidth: `${nameColumnWidthCh}ch` }}
                    >
                      <div className="relative flex items-center justify-between gap-2 overflow-visible">
                        <span>{row.ad}</span>
                      </div>
                    </td>
                    {row.cellModes.map((mode, idx) => {
                      const visual = getCellVisual(mode);
                      const lateMode = row.lateModes[idx];
                      const columnTheme = getColumnTheme(idx);
                      const isOzenilmisColumn = assignmentColumns[idx].startsWith('Özenilmiş');
                      const isChecked = mode !== 'none';
                      const isLateCellMode = isLateMode && !isOzenilmisColumn;
                      const isLateBlocked = isLateCellMode && (hasRowBadge || mode === 'none');
                      const ozenVisualClass = hasRowBadge ? 'border-slate-300 bg-slate-100/75 text-slate-500' : 'border-violet-300 bg-white/95 text-slate-700 hover:bg-violet-50 transition-colors';
                      const defaultVisualClass = columnTheme.buttonClass + ' hover:opacity-80 transition-opacity';
                      const finalCellClass = hasRowBadge ? 'border-slate-300 bg-slate-100/75 text-slate-500' : isOzenilmisColumn ? ozenVisualClass : defaultVisualClass;
                      const ozenIconClass = hasRowBadge ? 'text-slate-400' : isChecked ? 'text-indigo-600' : 'text-rose-600';
                      const valueIconClass = hasRowBadge ? 'text-slate-400' : (visual.iconClass || '');
                      const lateCellClass =
                        isLateBlocked
                          ? 'border-slate-500 bg-gradient-to-br from-slate-500 to-slate-700 text-white'
                          : lateMode === 'none'
                            ? 'border-amber-400 bg-gradient-to-br from-amber-100 to-yellow-200 text-amber-900'
                            : 'border-amber-400 bg-gradient-to-br from-amber-100 to-yellow-200 text-amber-900';
                      const lateCellText =
                        isLateBlocked
                          ? 'X'
                          : lateMode === 'late0' || lateMode === 'none'
                            ? 'G0'
                            : lateMode === 'late1'
                              ? 'G1'
                              : lateMode === 'late2'
                                ? 'G2'
                                : lateMode === 'late3'
                                  ? 'G3'
                                  : 'G0';
                      const lateCellTitle =
                        hasRowBadge
                          ? t('common.adminPortfolio.lockedByStatus', 'Durum nedeniyle kilitli')
                          : mode === 'none'
                            ? t('common.adminPortfolio.emptyCellNoLate', 'Boş hücre: Geç seviyesi uygulanamaz')
                            : t('common.adminPortfolio.lateLevel', 'Geç seviyesi: {{level}}', { level: lateCellText });
                      const cellButtonTitle = isLateCellMode ? lateCellTitle : visual.title;
                      return (
                        <td key={`${row.no}-${idx}`} className={`border border-slate-500/70 px-1.5 py-2 text-center relative overflow-visible ${hasRowBadge ? 'bg-slate-100/70' : columnTheme.cellClass}`}>
                          {idx === 0 && row.rowStatus !== 'normal' && (
                            <div
                              className={`pointer-events-none absolute left-0 top-1/2 z-10 -translate-y-1/2 ${rowRibbonVisibility}`}
                              style={{ width: `${assignmentAreaWidthPx}px` }}
                            >
                              <span className={`mx-auto inline-flex h-7 ${rowRibbonSizeClass} -rotate-[2deg] items-center justify-center gap-1 rounded-[6px] border px-2.5 text-[11px] font-extrabold uppercase tracking-[0.01em] ring-1 ring-white/80 ${rowRibbonClass}`}>
                                <RowStatusIcon status={row.rowStatus} />
                                {rowRibbonText}
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            disabled={row.rowLocked || (isLateCellMode && mode === 'none')}
                            onClick={(event) => cycleCell(row.no, idx, event.detail)}
                            className={`relative inline-flex items-center justify-center border text-sm font-semibold ${isLateCellMode ? '' : 'transition'} disabled:cursor-not-allowed disabled:opacity-50 ${isLateCellMode ? 'h-9 w-full rounded-md px-1 md:h-10' : 'h-9 w-9 rounded-full md:h-10 md:w-10'} ${isLateCellMode ? lateCellClass : finalCellClass}`}
                          >
                            {isLateCellMode ? (
                              <span className="text-[14px] font-black tracking-[0.02em] md:text-[16px]">{lateCellText}</span>
                            ) : isOzenilmisColumn ? (
                              <span className={ozenIconClass}>{isChecked ? <SparklesIcon /> : <NoneSlashCircleIcon />}</span>
                            ) : (
                              !isLateMode && (
                                <span className={valueIconClass}>
                                  {visual.icon === 'full' && <FullCheckIcon />}
                                  {visual.icon === 'partial' && <PartialMinusIcon />}
                                  {visual.icon === 'none' && <NoneSlashCircleIcon />}
                                </span>
                              )
                            )}
                          </button>
                        </td>
                      );
                    })}
                    <td className={`relative overflow-visible border border-slate-500/70 px-2 py-2.5 text-center ${hasRowBadge ? 'bg-slate-100/70' : ''}`}>
                      <div className={`print-score-badge mx-auto inline-flex min-h-[42px] min-w-[82px] items-center justify-center rounded-xl border-2 px-3 py-1 text-[30px] font-black leading-none tracking-[-0.02em] tabular-nums ${scoreToneClass}`}>
                        {scoreDisplay}
                      </div>
                      <button
                        type="button"
                        onClick={() => cycleRowStatus(row.no)}
                        className={`no-print absolute left-full top-1/2 z-20 ml-2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm transition focus:outline-none ${rowStatusButtonClass}`}
                        aria-label={t('common.adminPortfolio.changeStatusAria', 'Durumu değiştir ({{status}})', { status: rowStatusText })}
                      >
                        <RowStatusIcon status={row.rowStatus} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Button — Yazılı Sınavlar */}
        <div className="no-print fixed bottom-6 right-6 z-[1400]">
          <div className="group">
            <button
              type="button"
              onClick={() => setIsYaziliOpen(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-600 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </button>
            <span className="pointer-events-none absolute bottom-1/2 right-full mr-3 translate-y-1/2 whitespace-nowrap rounded-lg border border-indigo-200 bg-indigo-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              Yazili Sinavlar
            </span>
          </div>
        </div>

        {/* Yazılı Panel Modal */}
        {isYaziliOpen && !yaziliPreviewFile && (
          <div
            className="no-print fixed inset-0 z-[1500] flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm"
            onClick={() => setIsYaziliOpen(false)}
            onKeyDown={(event) => { if (event.key === 'Escape') setIsYaziliOpen(false); }}
            role="button"
            tabIndex={0}
            aria-label="Yazılı panelini kapat"
          >
            <div className="w-full max-w-lg rounded-2xl border border-slate-300 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-indigo-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <p className="text-base font-extrabold text-slate-900">Yazılı Sınavlar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsYaziliOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-500 transition"
                >
                  Kapat
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4">
                <div className="space-y-2">
                  {yaziliFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50/50"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <span className="truncate text-sm font-semibold text-slate-800">{file.name}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setYaziliPreviewFile(file.pdf)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-rose-700 transition hover:border-rose-400 hover:bg-rose-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          PDF
                        </button>
                        {file.docx && (
                          <a
                            href={file.docx}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Düzenle
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Yazılı PDF Viewer */}
        {yaziliPreviewFile && (
          <div
            className="no-print fixed inset-0 z-[1600] flex flex-col bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setYaziliPreviewFile(null)}
            onKeyDown={(event) => { if (event.key === 'Escape') setYaziliPreviewFile(null); }}
            role="button"
            tabIndex={0}
            aria-label="PDF görüntüleyiciyi kapat"
          >
            <div className="flex items-center justify-between bg-white/95 px-4 py-3 shadow-md backdrop-blur" onClick={(event) => event.stopPropagation()}>
              <p className="truncate text-sm font-bold text-slate-800">
                {yaziliFiles.find((f) => f.pdf === yaziliPreviewFile)?.name || 'PDF'}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={yaziliPreviewFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-500 transition"
                >
                  Yeni Sekmede Aç
                </a>
                <button
                  type="button"
                  onClick={() => setYaziliPreviewFile(null)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-500 transition"
                >
                  Kapat
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-b-lg" onClick={(event) => event.stopPropagation()}>
              <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-slate-400 animate-pulse">Yükleniyor…</div>}>
                <PdfViewer src={yaziliPreviewFile!} />
              </Suspense>
            </div>
          </div>
        )}

        {isGuideOpen && (
          <div
            className="no-print fixed inset-0 z-[1500] flex items-center justify-center bg-slate-900/35 p-3"
            onClick={() => setIsGuideOpen(false)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setIsGuideOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={t('common.adminPortfolio.closeScoringGuideAria', 'Puanlama rehberini kapat')}
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-slate-900">{t('common.adminPortfolio.scoringGuide', 'Puanlama Rehberi')}</p>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(false)}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                >
                  {t('common.actions.close', 'Kapat')}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">{t('common.adminPortfolio.scoringIntro', '25 baz puan + Ozenilmis secilirse 5 bonus.')}</p>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                  <p className="font-semibold text-slate-800">{t('common.adminPortfolio.weights', 'Agirliklar')}</p>
                  <p className="mt-1">{t('common.adminPortfolio.majorHomeworkWeight', 'Büyük Ödev: 7')}</p>
                  <p>{t('common.adminPortfolio.homeworkAndBookWeight', '4 Odev + Kitap Kontrolu: 3.6')}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                  <p className="font-semibold text-slate-800">{t('common.adminPortfolio.cellValue', 'Hücre Değeri')}</p>
                  <p>{t('common.adminPortfolio.cellValueLegend', 'Tam: %100 | Yarim: %50 | Boş: %0')}</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2">
                  <p className="font-semibold text-amber-900">{t('common.adminPortfolio.lateSubmission', 'Geç Getirme')}</p>
                  <p>{t('common.adminPortfolio.lateG0', 'G0: Geç getirmedi, x1.00')}</p>
                  <p>{t('common.adminPortfolio.lateG1', 'G1: Geç getirdi, x0.90')}</p>
                  <p>{t('common.adminPortfolio.lateG2', 'G2: Daha gec getirdi, x0.75')}</p>
                  <p>{t('common.adminPortfolio.lateG3', 'G3: Cok gec getirdi, x0.50')}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                  <p className="font-semibold text-slate-800">{t('common.adminPortfolio.cap', 'Tavan')}</p>
                  <p>{t('common.adminPortfolio.maxTotal', 'Azami toplam: 30')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
