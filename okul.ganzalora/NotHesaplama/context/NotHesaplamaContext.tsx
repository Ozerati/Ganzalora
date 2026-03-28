// ============================================================
// Not Hesaplama - React Context & Reducer
// Tum state yonetimi burada. Firestore islemleri hook'ta kalir.
// ============================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
  type Dispatch,
} from 'react';

import type {
  TabId,
  SubTabId,
  AdvPerfScheme,
  TermState,
  Meta,
  Student,
  SemesterKey,
} from '../types';

// --------------- State Shape ---------------

export interface NotHesaplamaState {
  activeTerm: SemesterKey;
  termStates: Record<SemesterKey, TermState>;
  meta: Meta;
  activeTab: TabId;
  activeSubTab: Record<string, string>; // tab bazli sub-tab secimi
  advPerfScheme: AdvPerfScheme;
  advEditMode: boolean;
  advLessonName: string;
  isDirty: boolean;
  isSyncing: boolean;
  lastSaved: string;
  // Undo stack (context icerisinde tutuluyor)
  _undoStack: Array<{ label: string; snapshot: Omit<NotHesaplamaState, '_undoStack'> }>;
}

// --------------- Action Types ---------------

export type NotHesaplamaAction =
  | { type: 'SET_ACTIVE_TERM'; payload: SemesterKey }
  | { type: 'SET_ACTIVE_TAB'; payload: TabId }
  | { type: 'SET_ACTIVE_SUB_TAB'; payload: { tabId: string; subTabId: string } }
  | { type: 'UPDATE_STUDENT_FIELD'; payload: { id: number; fieldPath: string; value: unknown } }
  | { type: 'UPDATE_META'; payload: Partial<Meta> }
  | { type: 'IMPORT_EOKUL_DATA'; payload: Array<{ no: string; name: string; [k: string]: unknown }> }
  | { type: 'CALCULATE_ALL' }
  | { type: 'SET_ADV_PERF_SCHEME'; payload: AdvPerfScheme }
  | { type: 'TOGGLE_ADV_EDIT_MODE' }
  | { type: 'SET_ADV_LESSON_NAME'; payload: string }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: string }
  | { type: 'CLEAR_ALL_STUDENTS' }
  | { type: 'ADD_STUDENTS'; payload: number }
  | { type: 'REMOVE_LAST_STUDENT' }
  | { type: 'UNDO' }
  | { type: 'PUSH_UNDO'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<NotHesaplamaState> };

// --------------- Defaults ---------------

const DEFAULT_STUDENTS = 30;
const MAX_STUDENTS = 60;

function makeDefaultStudent(id: number): Student {
  const emptyCalc = { w: 0, l: 0, s: 0, r: 0 };
  const emptySpeak = { data: [0, 0, 0, 0, 0], total: 0 };
  return {
    id,
    number: '',
    name: '',
    target: 0,
    themes: { '1': [], '2': [], '3': [], '4': [] },
    themeTotals: { '1': 0, '2': 0, '3': 0, '4': 0 },
    theme25Parts: { '1': 25, '2': 25, '3': 25, '4': 25 },
    tdeBooks: { '1': 0, '2': 0 },
    speakEd: { '1': { ...emptySpeak }, '2': { ...emptySpeak } },
    speakYa: { '1': { ...emptySpeak }, '2': { ...emptySpeak } },
    calcEd: { '1': { ...emptyCalc }, '2': { ...emptyCalc } },
    calcYa: { '1': { ...emptyCalc }, '2': { ...emptyCalc } },
    advPerf: [0, 0, 0],
    advPerfDist: { '1': [], '2': [], '3': [] },
    advPerfAlt: { '1': null, '2': null, '3': null },
    advPerf12Dist: { '1': [], '2': [], '3': [] },
    advExam: { '1': 0, '2': 0 },
    advLang: {
      '1': { y: 0, d: 0, k: 0, o: 0 },
      '2': { y: 0, d: 0, k: 0, o: 0 },
    },
    advProject: 0,
    beUyg: { '1': 0, '2': 0 },
    beUygDist: { '1': [], '2': [] },
    bePerfDist: { '1': [], '2': [] },
  };
}

function makeDefaultTermState(): TermState {
  return {
    students: Array.from({ length: DEFAULT_STUDENTS }, (_, i) => makeDefaultStudent(i)),
    ui: {
      activeTab: 'edebiyat',
      activeSubTab: 'tema',
      selectedStudent: 0,
      advPerfScheme: 'standard20',
      showPreview: false,
      editingCell: null,
    },
    meta: {
      schoolName: '',
      sigs: { teacher: '', principal: '', vicePrincipal: '' },
      eokulPastes: {},
    },
    preview: [],
    roster: { columns: [], cells: {} },
    pasteExclude: {},
  };
}

function makeDefaultMeta(): Meta {
  return {
    schoolName: '',
    sigs: { teacher: '', principal: '', vicePrincipal: '' },
    eokulPastes: {},
  };
}

export function makeInitialState(): NotHesaplamaState {
  return {
    activeTerm: '1',
    termStates: {
      '1': makeDefaultTermState(),
      '2': makeDefaultTermState(),
    },
    meta: makeDefaultMeta(),
    activeTab: 'edebiyat',
    activeSubTab: {},
    advPerfScheme: 'standard20',
    advEditMode: false,
    advLessonName: '',
    isDirty: false,
    isSyncing: false,
    lastSaved: '',
    _undoStack: [],
  };
}

// --------------- Helper: Nested field set ---------------

/**
 * Iç içe nesne alanini güncelle.
 * fieldPath: "themes.1.0" gibi dot-separated path
 */
function setNestedField(obj: Record<string, unknown>, fieldPath: string, value: unknown): Record<string, unknown> {
  const keys = fieldPath.split('.');
  const result = { ...obj };
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = current[key];
    if (Array.isArray(next)) {
      current[key] = [...next];
    } else if (typeof next === 'object' && next !== null) {
      current[key] = { ...(next as Record<string, unknown>) };
    } else {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return result;
}

// --------------- Reducer ---------------

const MAX_UNDO = 20;

function notHesaplamaReducer(
  state: NotHesaplamaState,
  action: NotHesaplamaAction,
): NotHesaplamaState {
  switch (action.type) {
    case 'SET_ACTIVE_TERM':
      return { ...state, activeTerm: action.payload };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'SET_ACTIVE_SUB_TAB':
      return {
        ...state,
        activeSubTab: {
          ...state.activeSubTab,
          [action.payload.tabId]: action.payload.subTabId,
        },
      };

    case 'UPDATE_STUDENT_FIELD': {
      const { id, fieldPath, value } = action.payload;
      if (id >= MAX_STUDENTS) return state;
      const term = state.activeTerm;
      const termState = state.termStates[term];
      // Otomatik genişleme: id mevcut sayıdan büyükse yeni öğrenci ekle
      let students = [...termState.students];
      while (students.length <= id) {
        students.push(makeDefaultStudent(students.length));
      }
      const student = { ...students[id] };
      const updated = setNestedField(student as unknown as Record<string, unknown>, fieldPath, value);
      students[id] = updated as unknown as Student;

      return {
        ...state,
        isDirty: true,
        termStates: {
          ...state.termStates,
          [term]: { ...termState, students },
        },
      };
    }

    case 'UPDATE_META':
      return {
        ...state,
        isDirty: true,
        meta: { ...state.meta, ...action.payload },
      };

    case 'IMPORT_EOKUL_DATA': {
      const term = state.activeTerm;
      const termState = state.termStates[term];
      const students = [...termState.students];

      action.payload.forEach((row, idx) => {
        if (idx >= MAX_STUDENTS) return;
        students[idx] = {
          ...students[idx],
          number: row.no || students[idx].number,
          name: row.name || students[idx].name,
        };
      });

      return {
        ...state,
        isDirty: true,
        termStates: {
          ...state.termStates,
          [term]: { ...termState, students },
        },
      };
    }

    case 'CALCULATE_ALL': {
      // Hesaplamalari tetikle - gercek hesaplama fonksiyonlari
      // utils/calculations'dan gelecek, simdilik state'i dirty olmaktan cikariyoruz
      return { ...state };
    }

    case 'SET_ADV_PERF_SCHEME':
      return { ...state, advPerfScheme: action.payload, isDirty: true };

    case 'TOGGLE_ADV_EDIT_MODE':
      return { ...state, advEditMode: !state.advEditMode };

    case 'SET_ADV_LESSON_NAME':
      return { ...state, advLessonName: action.payload, isDirty: true };

    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };

    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload, isDirty: false };

    case 'CLEAR_ALL_STUDENTS': {
      const term = state.activeTerm;
      const termState = state.termStates[term];
      return {
        ...state,
        isDirty: true,
        termStates: {
          ...state.termStates,
          [term]: {
            ...termState,
            students: Array.from({ length: DEFAULT_STUDENTS }, (_, i) => makeDefaultStudent(i)),
          },
        },
      };
    }

    case 'ADD_STUDENTS': {
      const term2 = state.activeTerm;
      const ts2 = state.termStates[term2];
      const count = Math.min(action.payload, MAX_STUDENTS - ts2.students.length);
      if (count <= 0) return state;
      const newStudents = [
        ...ts2.students,
        ...Array.from({ length: count }, (_, i) => makeDefaultStudent(ts2.students.length + i)),
      ];
      return {
        ...state,
        isDirty: true,
        termStates: {
          ...state.termStates,
          [term2]: { ...ts2, students: newStudents },
        },
      };
    }

    case 'REMOVE_LAST_STUDENT': {
      const term3 = state.activeTerm;
      const ts3 = state.termStates[term3];
      if (ts3.students.length <= 1) return state;
      return {
        ...state,
        isDirty: true,
        termStates: {
          ...state.termStates,
          [term3]: { ...ts3, students: ts3.students.slice(0, -1) },
        },
      };
    }

    case 'PUSH_UNDO': {
      // Mevcut state'in snapshot'ini undo stack'e ekle
      const { _undoStack, ...rest } = state;
      const snapshot = structuredClone(rest);
      const newStack = [..._undoStack, { label: action.payload, snapshot }];
      // Max sinirini koru
      if (newStack.length > MAX_UNDO) {
        newStack.shift();
      }
      return { ...state, _undoStack: newStack };
    }

    case 'UNDO': {
      if (state._undoStack.length === 0) return state;
      const newStack = [...state._undoStack];
      const last = newStack.pop()!;
      return {
        ...last.snapshot,
        _undoStack: newStack,
      } as NotHesaplamaState;
    }

    case 'LOAD_STATE': {
      // Firestore'dan veya baska kaynaktan gelen state'i yukle
      return {
        ...state,
        ...action.payload,
        isDirty: false,
        _undoStack: state._undoStack, // undo stack'i koruyoruz
      };
    }

    default:
      return state;
  }
}

// --------------- Context ---------------

interface NotHesaplamaContextValue {
  state: NotHesaplamaState;
  dispatch: Dispatch<NotHesaplamaAction>;
  // Kisa yollar (convenience helpers)
  currentTermState: TermState;
  currentStudents: Student[];
}

const NotHesaplamaContext = createContext<NotHesaplamaContextValue | null>(null);

// --------------- Provider ---------------

interface NotHesaplamaProviderProps {
  children: ReactNode;
  initialState?: Partial<NotHesaplamaState>;
}

export function NotHesaplamaProvider({ children, initialState }: NotHesaplamaProviderProps) {
  const [state, dispatch] = useReducer(
    notHesaplamaReducer,
    initialState ? { ...makeInitialState(), ...initialState } : makeInitialState(),
  );

  const currentTermState = useMemo(
    () => state.termStates[state.activeTerm],
    [state.termStates, state.activeTerm],
  );

  const currentStudents = useMemo(
    () => currentTermState.students,
    [currentTermState],
  );

  const value = useMemo<NotHesaplamaContextValue>(
    () => ({ state, dispatch, currentTermState, currentStudents }),
    [state, dispatch, currentTermState, currentStudents],
  );

  return (
    <NotHesaplamaContext.Provider value={value}>
      {children}
    </NotHesaplamaContext.Provider>
  );
}

// --------------- Hook ---------------

export function useNotHesaplama(): NotHesaplamaContextValue {
  const ctx = useContext(NotHesaplamaContext);
  if (!ctx) {
    throw new Error('useNotHesaplama must be used within a NotHesaplamaProvider');
  }
  return ctx;
}

// Re-export initial state factory
export { makeDefaultStudent, makeDefaultTermState };
