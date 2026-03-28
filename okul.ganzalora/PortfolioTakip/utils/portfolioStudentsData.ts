import bundledPortfolioStudents from '../data/portfolioStudents.json';
import type { JsonObject, JsonValue } from '../../../types/index';
import {
  loadStudentsFromFirestore,
  saveStudentsToFirestore,
  clearStudentsFromFirestore,
} from '../../../lib/portfolioFirestore';

export type PortfolioStudentEntry = {
  no: number;
  ad: string;
};

export type PortfolioStudentsData = Record<string, PortfolioStudentEntry[]>;

function isPortfolioStudentEntry(entry: PortfolioStudentEntry | null): entry is PortfolioStudentEntry {
  return entry !== null;
}

function normalizeStudentEntry(entry: JsonValue): PortfolioStudentEntry | null {
  if (!entry || typeof entry !== 'object') return null;

  const record = entry as JsonObject;
  const schoolNo = Number(record.no);
  const studentName = String(record.ad || '').trim();

  if (!Number.isFinite(schoolNo) || !studentName) {
    return null;
  }

  return {
    no: schoolNo,
    ad: studentName,
  };
}

export function normalizePortfolioStudentsData(rawData: JsonValue): PortfolioStudentsData | null {
  if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
    return null;
  }

  const normalizedData = Object.entries(rawData as JsonObject).reduce<PortfolioStudentsData>((accumulator, [classKey, students]) => {
    const normalizedClassKey = String(classKey || '').trim().toUpperCase();
    if (!normalizedClassKey || !Array.isArray(students)) {
      return accumulator;
    }

    const normalizedStudents = students
      .map((student) => normalizeStudentEntry(student))
      .filter(isPortfolioStudentEntry)
      .sort((left, right) => left.no - right.no);

    if (normalizedStudents.length > 0) {
      accumulator[normalizedClassKey] = normalizedStudents;
    }

    return accumulator;
  }, {});

  return Object.keys(normalizedData).length > 0 ? normalizedData : null;
}

/** Bundled fallback — Firestore erişilemezse kullanılır */
export function loadBundledStudentsData(): PortfolioStudentsData {
  return normalizePortfolioStudentsData(bundledPortfolioStudents) || {};
}

/** Firestore'dan öğrenci listesini yükle */
export async function loadPortfolioStudentsDataAsync(): Promise<{ data: PortfolioStudentsData; source: 'firestore' | 'sample' }> {
  try {
    const firestoreData = await loadStudentsFromFirestore();
    if (firestoreData && Object.keys(firestoreData).length > 0) {
      return { data: firestoreData, source: 'firestore' };
    }
  } catch (err) {
    console.warn('[portfolioStudentsData] Firestore load failed, using bundled', err);
  }

  return { data: loadBundledStudentsData(), source: 'sample' };
}

/** Firestore'a öğrenci listesi kaydet */
export async function savePortfolioStudentsOverride(rawData: JsonValue): Promise<PortfolioStudentsData> {
  const normalizedData = normalizePortfolioStudentsData(rawData);

  if (!normalizedData) {
    throw new Error('invalid-portfolio-students-data');
  }

  await saveStudentsToFirestore(normalizedData);
  return normalizedData;
}

/** Firestore'daki öğrenci listesini temizle */
export async function clearPortfolioStudentsOverride(): Promise<void> {
  await clearStudentsFromFirestore();
}
