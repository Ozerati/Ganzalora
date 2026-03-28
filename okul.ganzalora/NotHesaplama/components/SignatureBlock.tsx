// ============================================================
// İmza Bloğu — A4 kağıdının altında görünen imza alanları
// ============================================================

import { useNotHesaplama } from '../context/NotHesaplamaContext';

export default function SignatureBlock() {
  const { state } = useNotHesaplama();
  const { meta } = state;
  const { teacher, principal, vicePrincipal } = meta.sigs;

  const hasTeacher = teacher.trim() !== '';
  const hasPrincipal = principal.trim() !== '';
  const hasVice = vicePrincipal.trim() !== '';

  if (!hasTeacher && !hasPrincipal && !hasVice) return null;

  return (
    <div className="mt-10 pt-6 border-t border-slate-200">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center text-sm">
        {/* Öğretmen */}
        {hasTeacher && (
          <div className="flex flex-col items-center gap-8">
            <div className="w-32 border-b border-slate-400" />
            <p className="font-semibold text-slate-800">{teacher}</p>
            <p className="text-xs text-slate-500">Öğretmen</p>
          </div>
        )}

        {/* Müdür Yardımcısı */}
        {hasVice && (
          <div className="flex flex-col items-center gap-8">
            <div className="w-32 border-b border-slate-400" />
            <p className="font-semibold text-slate-800">{vicePrincipal}</p>
            <p className="text-xs text-slate-500">Müdür Yardımcısı</p>
          </div>
        )}

        {/* Müdür */}
        {hasPrincipal && (
          <div className="flex flex-col items-center gap-8">
            <div className="w-32 border-b border-slate-400" />
            <p className="font-semibold text-slate-800">{principal}</p>
            <p className="text-xs text-slate-500">Okul Müdürü</p>
          </div>
        )}
      </div>
    </div>
  );
}
