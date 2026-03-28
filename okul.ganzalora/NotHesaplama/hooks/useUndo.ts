// ============================================================
// Not Hesaplama - Undo Hook
// structuredClone ile state snapshot'ları tutar.
// ============================================================

import { useCallback, useRef, useState } from 'react';

const DEFAULT_MAX_HISTORY = 20;

interface UndoEntry<T> {
  label: string;
  snapshot: T;
}

/**
 * Basit undo hook'u.
 * State'in snapshot'larını tutar, geri al fonksiyonu sağlar.
 *
 * @param currentState - Mevcut state (snapshot alınacak)
 * @param onRestore - Snapshot geri yüklendiğinde çağırılacak callback
 * @param maxHistory - Maksimum geçmiş sayısı (varsayılan 20)
 */
export function useUndo<T>(
  currentState: T,
  onRestore: (snapshot: T) => void,
  maxHistory: number = DEFAULT_MAX_HISTORY,
) {
  const stackRef = useRef<UndoEntry<T>[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  /**
   * Mevcut state'in bir kopyasını geçmiş stack'ine ekle.
   * @param label - Bu checkpoint'in açıklaması (örn. "Öğrenci güncellendi")
   */
  const pushCheckpoint = useCallback(
    (label: string = '') => {
      const snapshot = structuredClone(currentState);
      const stack = stackRef.current;

      stack.push({ label, snapshot });

      // Max sınırını koru
      while (stack.length > maxHistory) {
        stack.shift();
      }

      setCanUndo(true);
    },
    [currentState, maxHistory],
  );

  /**
   * Son snapshot'a geri dön.
   * Stack boşsa hiçbir şey yapmaz.
   */
  const undo = useCallback(() => {
    const stack = stackRef.current;
    if (stack.length === 0) return;

    const last = stack.pop()!;
    setCanUndo(stack.length > 0);

    // Snapshot'ı geri yükle
    onRestore(structuredClone(last.snapshot));
  }, [onRestore]);

  /**
   * Tüm geçmişi temizle.
   */
  const clearHistory = useCallback(() => {
    stackRef.current = [];
    setCanUndo(false);
  }, []);

  /**
   * Geçmiş stack'indeki eleman sayısı.
   */
  const historyCount = stackRef.current.length;

  return {
    pushCheckpoint,
    undo,
    canUndo,
    clearHistory,
    historyCount,
  };
}
