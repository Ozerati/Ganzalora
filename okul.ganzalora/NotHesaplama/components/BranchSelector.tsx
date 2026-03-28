// ============================================================
// Branş Seçimi — Giriş sonrası ilk ekran
// Yabancı Dil / Türk Dili ve Edebiyatı / Beden Eğitimi / Diğer Branşlar
// ============================================================

import type { TabId } from '../types';

export type Branch = 'yabanci' | 'edebiyat' | 'beden' | 'diger';

interface BranchSelectorProps {
  onSelect: (branch: Branch) => void;
}

const BRANCHES: { id: Branch; name: string; desc: string; color: string; iconBg: string; defaultTab: TabId; icon: JSX.Element }[] = [
  {
    id: 'yabanci',
    name: 'Yabancı Dil',
    desc: 'Konuşma sınavı, not hesaplama, e-Okul aktarma',
    color: 'border-t-rose-500',
    iconBg: 'bg-rose-50 text-rose-600',
    defaultTab: 'yabanci',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    id: 'edebiyat',
    name: 'Türk Dili ve Edebiyatı',
    desc: 'Tema performansı, konuşma, yazma, kitap okuma',
    color: 'border-t-red-500',
    iconBg: 'bg-red-50 text-red-600',
    defaultTab: 'edebiyat',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    id: 'beden',
    name: 'Beden Eğitimi',
    desc: 'Performans değerlendirme, uygulama sınavı',
    color: 'border-t-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
    defaultTab: 'bedenEgitimi',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a3 3 0 01-3 3H9a3 3 0 01-3-3" />
        <path d="M4 6h16" />
        <path d="M2 10h4" /><path d="M18 10h4" />
        <line x1="4" y1="6" x2="4" y2="14" /><line x1="20" y1="6" x2="20" y2="14" />
        <line x1="2" y1="10" x2="2" y2="14" /><line x1="22" y1="10" x2="22" y2="14" />
      </svg>
    ),
  },
  {
    id: 'diger',
    name: 'Diğer Branşlar',
    desc: 'Performans, sınav, proje, dil dersleri',
    color: 'border-t-indigo-500',
    iconBg: 'bg-indigo-50 text-indigo-600',
    defaultTab: 'ileriModul',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export { BRANCHES };

export default function BranchSelector({ onSelect }: BranchSelectorProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Branşınızı Seçin</h2>
        <p className="text-sm text-slate-500 mt-1">İlgili modüller ve tablolar gösterilecek</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {BRANCHES.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b.id)}
            className={`
              group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 border-t-4 ${b.color}
              bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]
              text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40
            `}
          >
            <div className={`w-14 h-14 rounded-xl ${b.iconBg} flex items-center justify-center shrink-0 transition group-hover:scale-110`}>
              {b.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">{b.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
