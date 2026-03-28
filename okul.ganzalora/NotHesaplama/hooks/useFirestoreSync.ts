// ============================================================
// Not Hesaplama - Firestore Sync Hook
// State'i Firestore'a kaydet / Firestore'dan yukle.
// Context icerisinde Firestore islemleri yapilmaz, bu hook uzerinden yapilir.
// ============================================================

import { useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useNotHesaplama } from '../context/NotHesaplamaContext';
import type { NotHesaplamaState } from '../context/NotHesaplamaContext';

// Firestore collection yolu
const COLLECTION = 'notHesaplamaUserData';

/**
 * Firestore kayit yapisi - state'in serializable kismi
 */
interface FirestorePayload {
  version: 2;
  activeTerm: NotHesaplamaState['activeTerm'];
  termStates: NotHesaplamaState['termStates'];
  meta: NotHesaplamaState['meta'];
  advPerfScheme: NotHesaplamaState['advPerfScheme'];
  advLessonName: NotHesaplamaState['advLessonName'];
  activeTab: NotHesaplamaState['activeTab'];
  activeSubTab: NotHesaplamaState['activeSubTab'];
  updatedAt: string;
}

/**
 * State'ten Firestore'a kaydedilecek payload'i cikar.
 * _undoStack, UI-only alanlar vs. haric tutulur.
 */
function stateToPayload(state: NotHesaplamaState): FirestorePayload {
  return {
    version: 2,
    activeTerm: state.activeTerm,
    termStates: state.termStates,
    meta: state.meta,
    advPerfScheme: state.advPerfScheme,
    advLessonName: state.advLessonName,
    activeTab: state.activeTab,
    activeSubTab: state.activeSubTab,
    updatedAt: new Date().toISOString(),
  };
}

// --------------- Hook ---------------

export function useFirestoreSync(userId: string) {
  const { state, dispatch } = useNotHesaplama();
  const savingRef = useRef(false);

  // --- Draft kaydet ---
  const save = useCallback(async () => {
    if (!userId || savingRef.current) return;
    savingRef.current = true;
    dispatch({ type: 'SET_SYNCING', payload: true });

    try {
      const payload = stateToPayload(state);
      const docRef = doc(db, COLLECTION, userId, 'data', '_draft');
      await setDoc(docRef, payload, { merge: false });

      const now = new Date().toISOString();
      dispatch({ type: 'SET_LAST_SAVED', payload: now });
    } catch (err) {
      console.error('[NotHesaplama] Firestore save hatasi:', err);
      throw err;
    } finally {
      savingRef.current = false;
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, [userId, state, dispatch]);

  // --- Draft yukle ---
  const load = useCallback(async () => {
    if (!userId) return;
    dispatch({ type: 'SET_SYNCING', payload: true });

    try {
      const docRef = doc(db, COLLECTION, userId, 'data', '_draft');
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data() as FirestorePayload;
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            activeTerm: data.activeTerm,
            termStates: data.termStates,
            meta: data.meta,
            advPerfScheme: data.advPerfScheme,
            advLessonName: data.advLessonName,
            activeTab: data.activeTab,
            activeSubTab: data.activeSubTab,
            lastSaved: data.updatedAt || '',
          },
        });
      }
    } catch (err) {
      console.error('[NotHesaplama] Firestore load hatasi:', err);
      throw err;
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  }, [userId, dispatch]);

  // --- Sinif kaydet ---
  const saveClass = useCallback(
    async (className: string) => {
      if (!userId || !className) return;
      dispatch({ type: 'SET_SYNCING', payload: true });

      try {
        const payload = stateToPayload(state);
        const docRef = doc(db, COLLECTION, userId, 'data', `class_${className}`);
        await setDoc(docRef, payload, { merge: false });

        // Sinif listesini guncelle
        const listRef = doc(db, COLLECTION, userId, 'data', '_classList');
        const listSnap = await getDoc(listRef);
        const existing: string[] = listSnap.exists()
          ? (listSnap.data().classes as string[]) || []
          : [];

        if (!existing.includes(className)) {
          await setDoc(listRef, { classes: [...existing, className] }, { merge: false });
        }

        const now = new Date().toISOString();
        dispatch({ type: 'SET_LAST_SAVED', payload: now });
      } catch (err) {
        console.error('[NotHesaplama] Sinif kaydetme hatasi:', err);
        throw err;
      } finally {
        dispatch({ type: 'SET_SYNCING', payload: false });
      }
    },
    [userId, state, dispatch],
  );

  // --- Sinif yukle ---
  const loadClass = useCallback(
    async (className: string) => {
      if (!userId || !className) return;
      dispatch({ type: 'SET_SYNCING', payload: true });

      try {
        const docRef = doc(db, COLLECTION, userId, 'data', `class_${className}`);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data() as FirestorePayload;
          dispatch({
            type: 'LOAD_STATE',
            payload: {
              activeTerm: data.activeTerm,
              termStates: data.termStates,
              meta: data.meta,
              advPerfScheme: data.advPerfScheme,
              advLessonName: data.advLessonName,
              activeTab: data.activeTab,
              activeSubTab: data.activeSubTab,
              lastSaved: data.updatedAt || '',
            },
          });
        }
      } catch (err) {
        console.error('[NotHesaplama] Sinif yukleme hatasi:', err);
        throw err;
      } finally {
        dispatch({ type: 'SET_SYNCING', payload: false });
      }
    },
    [userId, dispatch],
  );

  // --- Sinif listesini getir ---
  const getClassList = useCallback(async (): Promise<string[]> => {
    if (!userId) return [];

    try {
      const listRef = doc(db, COLLECTION, userId, 'data', '_classList');
      const snap = await getDoc(listRef);
      if (snap.exists()) {
        return (snap.data().classes as string[]) || [];
      }
      return [];
    } catch (err) {
      console.error('[NotHesaplama] Sinif listesi yukleme hatasi:', err);
      return [];
    }
  }, [userId]);

  // --- Ayarlar kaydet/yukle ---
  const saveSettings = useCallback(
    async (settings: Record<string, unknown>) => {
      if (!userId) return;
      const settingsRef = doc(db, COLLECTION, userId, 'data', '_settings');
      await setDoc(settingsRef, settings, { merge: true });
    },
    [userId],
  );

  const loadSettings = useCallback(async (): Promise<Record<string, unknown> | null> => {
    if (!userId) return null;

    try {
      const settingsRef = doc(db, COLLECTION, userId, 'data', '_settings');
      const snap = await getDoc(settingsRef);
      return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
    } catch (err) {
      console.error('[NotHesaplama] Ayarlar yukleme hatasi:', err);
      return null;
    }
  }, [userId]);

  return {
    save,
    load,
    saveClass,
    loadClass,
    getClassList,
    saveSettings,
    loadSettings,
    isSyncing: state.isSyncing,
    lastSaved: state.lastSaved,
  };
}
