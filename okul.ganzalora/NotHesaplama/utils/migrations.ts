// ============================================================
// Not Hesaplama - State Migrations & Integrity
// ============================================================

import type {
  Student,
  TermState,
  UIState,
  Meta,
  CalcResult,
  SpeakResult,
  ThemeKey,
  SemesterKey,
  AdvPerfKey,
} from '../types';

// --------------- Defaults ---------------

const STUDENT_COUNT = 40;
const THEME_CRITERIA_COUNT = 5;

function defaultCalcResult(): CalcResult {
  return { w: 0, l: 0, s: 0, r: 0 };
}

function defaultSpeakResult(): SpeakResult {
  return { data: [0, 0, 0, 0, 0], total: 0 };
}

function defaultAdvLang(): { y: number; d: number; k: number; o: number } {
  return { y: 0, d: 0, k: 0, o: 0 };
}

function zeroArray(count: number): number[] {
  return new Array(count).fill(0);
}

// --------------- makeBlankStudent ---------------

/**
 * Create a blank student with all default zero values.
 */
export function makeBlankStudent(id: number): Student {
  return {
    id,
    number: '',
    name: '',
    target: 0,

    // Themes: 4 themes, each with THEME_CRITERIA_COUNT criteria
    themes: {
      '1': zeroArray(THEME_CRITERIA_COUNT),
      '2': zeroArray(THEME_CRITERIA_COUNT),
      '3': zeroArray(THEME_CRITERIA_COUNT),
      '4': zeroArray(THEME_CRITERIA_COUNT),
    },
    themeTotals: { '1': 0, '2': 0, '3': 0, '4': 0 },
    theme25Parts: { '1': 0, '2': 0, '3': 0, '4': 0 },
    tdeBooks: { '1': 0, '2': 0 },

    // Speaking
    speakEd: {
      '1': defaultSpeakResult(),
      '2': defaultSpeakResult(),
    },
    speakYa: {
      '1': defaultSpeakResult(),
      '2': defaultSpeakResult(),
    },

    // Calculation
    calcEd: {
      '1': defaultCalcResult(),
      '2': defaultCalcResult(),
    },
    calcYa: {
      '1': defaultCalcResult(),
      '2': defaultCalcResult(),
    },

    // Advanced module
    advPerf: [0, 0, 0],
    advPerfDist: {
      '1': zeroArray(THEME_CRITERIA_COUNT),
      '2': zeroArray(THEME_CRITERIA_COUNT),
      '3': zeroArray(THEME_CRITERIA_COUNT),
    },
    advPerfAlt: { '1': null, '2': null, '3': null },
    advPerf12Dist: {
      '1': zeroArray(THEME_CRITERIA_COUNT),
      '2': zeroArray(THEME_CRITERIA_COUNT),
      '3': zeroArray(THEME_CRITERIA_COUNT),
    },
    advExam: { '1': 0, '2': 0 },
    advLang: {
      '1': defaultAdvLang(),
      '2': defaultAdvLang(),
    },
    advProject: 0,

    // Beden Egitimi
    beUyg: { '1': 0, '2': 0 },
    beUygDist: {
      '1': zeroArray(THEME_CRITERIA_COUNT),
      '2': zeroArray(THEME_CRITERIA_COUNT),
    },
    bePerfDist: {
      '1': zeroArray(THEME_CRITERIA_COUNT),
      '2': zeroArray(THEME_CRITERIA_COUNT),
    },
  };
}

// --------------- makeInitialState ---------------

function defaultUI(): UIState {
  return {
    activeTab: 'edebiyat',
    activeSubTab: 'tema',
    selectedStudent: 0,
    advPerfScheme: 'standard20',
    showPreview: false,
    editingCell: null,
  };
}

function defaultMeta(): Meta {
  return {
    schoolName: '',
    sigs: {
      teacher: '',
      principal: '',
      vicePrincipal: '',
    },
    eokulPastes: {},
  };
}

/**
 * Create the full initial TermState with 40 blank students.
 */
export function makeInitialState(): TermState {
  const students: Student[] = [];
  for (let i = 0; i < STUDENT_COUNT; i++) {
    students.push(makeBlankStudent(i));
  }

  return {
    students,
    ui: defaultUI(),
    meta: defaultMeta(),
    preview: [],
    roster: {
      columns: [],
      cells: {},
    },
    pasteExclude: {},
  };
}

// --------------- ensureIntegrity ---------------

/**
 * Ensure a (possibly partial or legacy) student object has all required fields.
 * Missing fields are filled with defaults. Existing values are preserved.
 */
export function ensureIntegrity(raw: Partial<Student>): Student {
  const blank = makeBlankStudent(raw.id ?? 0);

  const s: Student = { ...blank, ...raw };

  // Ensure id is a number
  s.id = typeof s.id === 'number' ? s.id : 0;
  s.number = typeof s.number === 'string' ? s.number : '';
  s.name = typeof s.name === 'string' ? s.name : '';

  // Target
  if (s.target !== 'G' && typeof s.target !== 'number') {
    s.target = 0;
  }

  // Themes: ensure all 4 keys exist with arrays
  const themeKeys: ThemeKey[] = ['1', '2', '3', '4'];
  for (const k of themeKeys) {
    if (!Array.isArray(s.themes?.[k])) {
      s.themes = { ...s.themes, [k]: zeroArray(THEME_CRITERIA_COUNT) };
    }
    if (typeof s.themeTotals?.[k] !== 'number') {
      s.themeTotals = { ...s.themeTotals, [k]: 0 };
    }
    if (typeof s.theme25Parts?.[k] !== 'number') {
      s.theme25Parts = { ...s.theme25Parts, [k]: 0 };
    }
  }

  // TDE Books
  const semKeys: SemesterKey[] = ['1', '2'];
  for (const k of semKeys) {
    if (typeof s.tdeBooks?.[k] !== 'number') {
      s.tdeBooks = { ...s.tdeBooks, [k]: 0 };
    }
  }

  // Speaking
  for (const k of semKeys) {
    if (!s.speakEd?.[k] || !Array.isArray(s.speakEd[k].data)) {
      s.speakEd = { ...s.speakEd, [k]: defaultSpeakResult() };
    }
    if (!s.speakYa?.[k] || !Array.isArray(s.speakYa[k].data)) {
      s.speakYa = { ...s.speakYa, [k]: defaultSpeakResult() };
    }
  }

  // Calc
  for (const k of semKeys) {
    if (!s.calcEd?.[k] || typeof s.calcEd[k].w !== 'number') {
      s.calcEd = { ...s.calcEd, [k]: defaultCalcResult() };
    }
    if (!s.calcYa?.[k] || typeof s.calcYa[k].w !== 'number') {
      s.calcYa = { ...s.calcYa, [k]: defaultCalcResult() };
    }
  }

  // Advanced perf
  if (!Array.isArray(s.advPerf) || s.advPerf.length !== 3) {
    s.advPerf = [0, 0, 0];
  }

  const advKeys: AdvPerfKey[] = ['1', '2', '3'];
  for (const k of advKeys) {
    if (!Array.isArray(s.advPerfDist?.[k])) {
      s.advPerfDist = { ...s.advPerfDist, [k]: zeroArray(THEME_CRITERIA_COUNT) };
    }
    // advPerfAlt can be null, that's fine
    if (s.advPerfAlt?.[k] !== null && !Array.isArray(s.advPerfAlt?.[k])) {
      s.advPerfAlt = { ...s.advPerfAlt, [k]: null };
    }
    if (!Array.isArray(s.advPerf12Dist?.[k])) {
      s.advPerf12Dist = { ...s.advPerf12Dist, [k]: zeroArray(THEME_CRITERIA_COUNT) };
    }
  }

  for (const k of semKeys) {
    if (typeof s.advExam?.[k] !== 'number') {
      s.advExam = { ...s.advExam, [k]: 0 };
    }
    if (!s.advLang?.[k] || typeof s.advLang[k].y !== 'number') {
      s.advLang = { ...s.advLang, [k]: defaultAdvLang() };
    }
  }

  if (s.advProject !== 'G' && typeof s.advProject !== 'number') {
    s.advProject = 0;
  }

  // Beden Egitimi
  for (const k of semKeys) {
    if (typeof s.beUyg?.[k] !== 'number') {
      s.beUyg = { ...s.beUyg, [k]: 0 };
    }
    if (!Array.isArray(s.beUygDist?.[k])) {
      s.beUygDist = { ...s.beUygDist, [k]: zeroArray(THEME_CRITERIA_COUNT) };
    }
    if (!Array.isArray(s.bePerfDist?.[k])) {
      s.bePerfDist = { ...s.bePerfDist, [k]: zeroArray(THEME_CRITERIA_COUNT) };
    }
  }

  return s;
}

// --------------- normalizeTermState ---------------

/**
 * Normalize a raw/legacy term state object into a valid TermState.
 * Ensures students array has 40 entries, all with integrity checks.
 */
export function normalizeTermState(raw: any): TermState {
  if (!raw || typeof raw !== 'object') {
    return makeInitialState();
  }

  // Students
  const rawStudents = Array.isArray(raw.students) ? raw.students : [];
  const students: Student[] = [];
  for (let i = 0; i < STUDENT_COUNT; i++) {
    if (rawStudents[i]) {
      students.push(ensureIntegrity({ ...rawStudents[i], id: i }));
    } else {
      students.push(makeBlankStudent(i));
    }
  }

  // UI
  const ui: UIState = {
    activeTab: raw.ui?.activeTab ?? 'edebiyat',
    activeSubTab: raw.ui?.activeSubTab ?? 'tema',
    selectedStudent: typeof raw.ui?.selectedStudent === 'number' ? raw.ui.selectedStudent : 0,
    advPerfScheme: raw.ui?.advPerfScheme ?? 'standard20',
    showPreview: !!raw.ui?.showPreview,
    editingCell: raw.ui?.editingCell ?? null,
  };

  // Meta
  const meta: Meta = {
    schoolName: raw.meta?.schoolName ?? '',
    sigs: {
      teacher: raw.meta?.sigs?.teacher ?? '',
      principal: raw.meta?.sigs?.principal ?? '',
      vicePrincipal: raw.meta?.sigs?.vicePrincipal ?? '',
    },
    eokulPastes: raw.meta?.eokulPastes ?? {},
  };

  return {
    students,
    ui,
    meta,
    preview: Array.isArray(raw.preview) ? raw.preview : [],
    roster: {
      columns: Array.isArray(raw.roster?.columns) ? raw.roster.columns : [],
      cells: raw.roster?.cells ?? {},
    },
    pasteExclude: raw.pasteExclude ?? {},
  };
}
