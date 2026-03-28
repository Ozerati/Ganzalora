import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { ClassState } from '../features/portfolio/utils/portfolioUtils';
import type { PortfolioStudentsData } from '../features/portfolio/utils/portfolioStudentsData';

const COLLECTION = 'portfolyo';
const STUDENTS_COLLECTION = 'portfolyo_students';
const STUDENTS_DOC = 'directory';

function buildDocId(classKey: string, controlNo: number) {
  return `${classKey}_k${controlNo}`;
}

// ── Portfolio State (sınıf + kontrol verisi) ──

export async function loadStateFromFirestore(
  classKey: string,
  controlNo: number,
): Promise<{ state: ClassState; lastSaved: number | null } | null> {
  try {
    const ref = doc(db, COLLECTION, buildDocId(classKey, controlNo));
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      state: (data.state ?? {}) as ClassState,
      lastSaved: data.lastSaved ?? null,
    };
  } catch (err) {
    console.warn('[Firestore] loadState failed, falling back to localStorage', err);
    return null;
  }
}

export async function saveStateToFirestore(
  classKey: string,
  controlNo: number,
  state: ClassState,
): Promise<number> {
  const now = Date.now();
  const ref = doc(db, COLLECTION, buildDocId(classKey, controlNo));
  await setDoc(ref, { state, lastSaved: now, classKey, controlNo });
  return now;
}

// ── Öğrenci Listesi ──

export async function loadStudentsFromFirestore(): Promise<PortfolioStudentsData | null> {
  try {
    const ref = doc(db, STUDENTS_COLLECTION, STUDENTS_DOC);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return (data.directory ?? null) as PortfolioStudentsData | null;
  } catch (err) {
    console.warn('[Firestore] loadStudents failed', err);
    return null;
  }
}

export async function saveStudentsToFirestore(
  directory: PortfolioStudentsData,
): Promise<void> {
  const ref = doc(db, STUDENTS_COLLECTION, STUDENTS_DOC);
  await setDoc(ref, { directory, updatedAt: Date.now() });
}

export async function clearStudentsFromFirestore(): Promise<void> {
  const ref = doc(db, STUDENTS_COLLECTION, STUDENTS_DOC);
  await setDoc(ref, { directory: null, updatedAt: Date.now() });
}

// ── Exam Builder ──

const EXAM_COLLECTION = 'examBuilder';

export interface ExamBuilderState {
  gradeLevel: '9' | '12';
  groups: Record<string, unknown[]>;
  schoolName: string;
  examTitle: string;
  academicYear: string;
  teachers: { name: string; title: string }[];
  layout: Record<string, number>;
  grayscalePdf: boolean;
  isSampleMode: boolean;
}

export async function loadExamBuilderState(): Promise<{ state: ExamBuilderState; lastSaved: number } | null> {
  try {
    const ref = doc(db, EXAM_COLLECTION, 'current');
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      state: data.state as ExamBuilderState,
      lastSaved: data.lastSaved ?? 0,
    };
  } catch (err) {
    console.warn('[Firestore] loadExamBuilderState failed', err);
    return null;
  }
}

export async function saveExamBuilderState(state: ExamBuilderState): Promise<number> {
  const now = Date.now();
  const ref = doc(db, EXAM_COLLECTION, 'current');
  await setDoc(ref, { state, lastSaved: now });
  return now;
}

// ── Not Hesaplama ──

const GRADE_COLLECTION = 'notHesaplama';

export async function loadGradeCalcState(docId: string): Promise<Record<string, unknown> | null> {
  try {
    const ref = doc(db, GRADE_COLLECTION, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as Record<string, unknown>;
  } catch (err) {
    console.warn('[Firestore] loadGradeCalcState failed', err);
    return null;
  }
}

export async function saveGradeCalcState(docId: string, data: Record<string, unknown>): Promise<void> {
  const ref = doc(db, GRADE_COLLECTION, docId);
  await setDoc(ref, { ...data, updatedAt: Date.now() });
}

export async function deleteGradeCalcState(docId: string): Promise<void> {
  const { deleteDoc } = await import('firebase/firestore');
  const ref = doc(db, GRADE_COLLECTION, docId);
  await deleteDoc(ref);
}

export async function listGradeCalcDocs(): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const { collection, getDocs } = await import('firebase/firestore');
  const snap = await getDocs(collection(db, GRADE_COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as Record<string, unknown> }));
}
