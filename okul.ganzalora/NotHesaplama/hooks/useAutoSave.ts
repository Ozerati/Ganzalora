// ============================================================
// Not Hesaplama - Auto Save Hook
// State degistiginde debounce ile otomatik kayit yapar.
// ============================================================

import { useEffect, useRef, useCallback } from 'react';

const DEFAULT_DELAY_MS = 500;

/**
 * Debounce'lu otomatik kayit hook'u.
 *
 * @param saveFn - Kayit fonksiyonu (async)
 * @param state - Izlenecek state (degistiginde kayit tetiklenir)
 * @param delayMs - Debounce suresi (ms, varsayilan 500)
 */
export function useAutoSave(
  saveFn: () => Promise<void>,
  state: unknown,
  delayMs: number = DEFAULT_DELAY_MS,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveFnRef = useRef(saveFn);
  const mountedRef = useRef(true);
  const isFirstRender = useRef(true);
  const isSavingRef = useRef(false);

  // saveFn degistiginde ref'i guncelle (stale closure onlemi)
  saveFnRef.current = saveFn;

  // Unmount temizligi
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // State degistiginde debounce ile kayit
  useEffect(() => {
    // Ilk renderda kaydetme (mount sirasinda gereksiz kayit)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Onceki timer'i iptal et
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      if (!mountedRef.current || isSavingRef.current) return;

      isSavingRef.current = true;
      try {
        await saveFnRef.current();
      } catch (err) {
        console.error('[NotHesaplama] AutoSave hatasi:', err);
      } finally {
        if (mountedRef.current) {
          isSavingRef.current = false;
        }
      }
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state, delayMs]);

  /**
   * Debounce beklemeden hemen kaydet.
   */
  const saveNow = useCallback(async () => {
    // Bekleyen timer'i iptal et
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isSavingRef.current) return;

    isSavingRef.current = true;
    try {
      await saveFnRef.current();
    } catch (err) {
      console.error('[NotHesaplama] SaveNow hatasi:', err);
      throw err;
    } finally {
      if (mountedRef.current) {
        isSavingRef.current = false;
      }
    }
  }, []);

  return { saveNow };
}
