// ============================================================
// Sınıf Yönetimi — Oluştur, Seç, Sil, Geçiş
// ============================================================

import React, { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface SinifYonetimiTabProps {
  onSaveClass: (name: string) => Promise<void>;
  onLoadClass: (name: string) => Promise<void>;
  onGetClassList: () => Promise<string[]>;
  activeClass: string;
  onClassChange: (name: string) => void;
}

export default function SinifYonetimiTab({
  onSaveClass,
  onLoadClass,
  onGetClassList,
  activeClass,
  onClassChange,
}: SinifYonetimiTabProps) {
  const [classList, setClassList] = useState<string[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const userId = sessionStorage.getItem('nh_user_id') || '';

  const refreshList = useCallback(async () => {
    const list = await onGetClassList();
    setClassList(list);
  }, [onGetClassList]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreate = async () => {
    const name = newClassName.trim();
    if (!name) return;
    if (classList.includes(name)) {
      showMsg('error', `"${name}" zaten mevcut!`);
      return;
    }
    setLoading(true);
    try {
      await onSaveClass(name);
      onClassChange(name);
      setNewClassName('');
      await refreshList();
      showMsg('success', `"${name}" oluşturuldu`);
    } catch {
      showMsg('error', 'Oluşturma hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (name: string) => {
    setLoading(true);
    try {
      await onLoadClass(name);
      onClassChange(name);
      showMsg('success', `"${name}" yüklendi`);
    } catch {
      showMsg('error', 'Yükleme hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`"${name}" sınıfını silmek istediğinize emin misiniz?`)) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'notHesaplamaUserData', userId, 'data', `class_${name}`));
      // Sınıf listesinden kaldır
      const listRef = doc(db, 'notHesaplamaUserData', userId, 'data', '_classList');
      const listSnap = await getDoc(listRef);
      if (listSnap.exists()) {
        const { setDoc } = await import('firebase/firestore');
        const current: string[] = listSnap.data().classes || [];
        await setDoc(listRef, { classes: current.filter(c => c !== name) });
      }
      if (activeClass === name) onClassChange('');
      await refreshList();
      showMsg('success', `"${name}" silindi`);
    } catch {
      showMsg('error', 'Silme hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!activeClass) { showMsg('error', 'Önce bir sınıf seçin'); return; }
    setLoading(true);
    try {
      await onSaveClass(activeClass);
      showMsg('success', `"${activeClass}" kaydedildi`);
    } catch {
      showMsg('error', 'Kaydetme hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Başlık */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">Sınıf Yönetimi</h2>
        <p className="text-sm text-slate-500 mt-0.5">Sınıf oluşturun, aralarında geçiş yapın veya silin.</p>
      </div>

      {/* Bildirim */}
      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Yeni Sınıf Oluştur */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Yeni Sınıf Oluştur</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
            placeholder="Sınıf adı (Örn: 9/A)"
            className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
          />
          <button
            onClick={handleCreate}
            disabled={!newClassName.trim() || loading}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm disabled:opacity-50 active:scale-[0.98]"
          >
            + Oluştur
          </button>
        </div>
      </div>

      {/* Aktif Sınıf */}
      {activeClass && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase">Aktif Sınıf</p>
              <p className="text-xl font-extrabold text-indigo-700 mt-0.5">{activeClass}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17,21 17,13 7,13 7,21" />
                <polyline points="7,3 7,8 15,8" />
              </svg>
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Kayıtlı Sınıflar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-3">
          Kayıtlı Sınıflar
          <span className="ml-2 text-xs font-normal text-slate-400">({classList.length} sınıf)</span>
        </h3>

        {classList.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">Henüz sınıf oluşturulmamış</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {classList.map(cls => {
              const isActive = cls === activeClass;
              return (
                <div
                  key={cls}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${
                    isActive
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    )}
                    <span className={`text-sm font-bold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {cls}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!isActive && (
                      <button
                        onClick={() => handleLoad(cls)}
                        disabled={loading}
                        className="px-3 py-1 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        Yükle
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cls)}
                      disabled={loading}
                      className="px-2 py-1 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                      title="Sil"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
