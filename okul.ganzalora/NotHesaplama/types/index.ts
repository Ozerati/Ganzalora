// ============================================================
// Not Hesaplama - Type Definitions
// ============================================================

// --------------- Primitive Unions ---------------

export type TabId =
  | 'onizleme'
  | 'liste'
  | 'roster'
  | 'edebiyat'
  | 'yabanci'
  | 'bedenEgitimi'
  | 'ileriModul'
  | 'yoklama'
  | 'analiz'
  | 'sinavTakvimi'
  | 'sinifYonetimi';

export type SubTabId =
  | 'tema'
  | 'kitap'
  | 'konusmaEd'
  | 'konusmaYa'
  | 'hesaplamaEd'
  | 'hesaplamaYa'
  | 'advPerf'
  | 'advExam'
  | 'advLang'
  | 'advProject'
  | 'beUyg'
  | 'bePerf';

export type AdvPerfScheme = 'standard20' | 'alt9i' | 'alt12i';

export type ThemeKey = '1' | '2' | '3' | '4';
export type SemesterKey = '1' | '2';
export type AdvPerfKey = '1' | '2' | '3';

// --------------- Score Helpers ---------------

/** A numeric score (0-100) or 'G' meaning exempt (Giremedi / Muaf). */
export type ScoreOrExempt = number | 'G';

export interface CalcResult {
  w: number; // Written exam
  l: number; // Listening / oral
  s: number; // Speaking
  r: number; // Result (computed)
}

export interface SpeakResult {
  data: number[]; // Per-criteria scores (typically 5 items)
  total: number;  // Sum
}

// --------------- Student ---------------

export interface Student {
  id: number;        // 0-39
  number: string;    // School number
  name: string;      // Full name
  target: ScoreOrExempt; // Target score or 'G'

  // Türk Dili ve Edebiyatı: Tema Performansı
  themes: Record<ThemeKey, number[]>;       // Per-theme criterion scores
  themeTotals: Record<ThemeKey, number>;     // Per-theme totals (theme25Parts * 4)
  theme25Parts: Record<ThemeKey, number>;    // Distribution parts (each 0-25, sum = target)
  tdeBooks: Record<SemesterKey, number>;     // Book reading scores

  // Speaking tests
  speakEd: Record<SemesterKey, SpeakResult>;
  speakYa: Record<SemesterKey, SpeakResult>;

  // Calculation (hesaplama) tests
  calcEd: Record<SemesterKey, CalcResult>;
  calcYa: Record<SemesterKey, CalcResult>;

  // Advanced Module (İleri Modül)
  advPerf: [number, number, number];
  advPerfDist: Record<AdvPerfKey, number[]>;
  advPerfAlt: Record<AdvPerfKey, number[] | null>;
  advPerf12Dist: Record<AdvPerfKey, number[]>;
  advExam: Record<SemesterKey, number>;
  advLang: Record<SemesterKey, { y: number; d: number; k: number; o: number }>;
  advProject: ScoreOrExempt;

  // Beden Eğitimi
  beUyg: Record<SemesterKey, number>;
  beUygDist: Record<SemesterKey, number[]>;
  bePerfDist: Record<SemesterKey, number[]>;
}

// --------------- Preview / e-Okul Parse ---------------

export interface PreviewRow {
  no: string;
  name: string;
  sinav1?: number | 'G';
  sinav2?: number | 'G';
  perf1?: number | 'G';
  perf2?: number | 'G';
  uyg1?: number | 'G';
  uyg2?: number | 'G';
  proje?: number | 'G';
  muaf?: boolean;
}

// --------------- Roster ---------------

export interface RosterColumn {
  key: string;
  label: string;
}

export interface RosterCells {
  [studentId: number]: {
    [columnKey: string]: string;
  };
}

// --------------- Paste Exclude ---------------

export interface PasteExclude {
  [studentId: number]: boolean;
}

// --------------- Meta ---------------

export interface Meta {
  schoolName: string;
  sigs: {
    teacher: string;
    principal: string;
    vicePrincipal: string;
  };
  eokulPastes: {
    [courseKey: string]: string; // raw pasted text keyed by course
  };
}

// --------------- UI State ---------------

export interface UIState {
  activeTab: TabId;
  activeSubTab: SubTabId;
  selectedStudent: number;       // index 0-39
  advPerfScheme: AdvPerfScheme;
  showPreview: boolean;
  editingCell: string | null;
}

// --------------- Term State (full state for one term) ---------------

export interface TermState {
  students: Student[];
  ui: UIState;
  meta: Meta;
  preview: PreviewRow[];
  roster: {
    columns: RosterColumn[];
    cells: RosterCells;
  };
  pasteExclude: PasteExclude;
}
