// ============================================================
// Not Hesaplama - TabBar (Main Tabs + Conditional Sub-tabs)
// Modern pill-style tabs with indigo active gradient
// ============================================================

import React, { useRef, useEffect } from 'react';
import { useNotHesaplama } from '../context/NotHesaplamaContext';
import type { TabId } from '../types';

// --------------- Tab Definitions ---------------

interface TabDef {
  id: string;     // Maps to activeTab in state
  label: string;
  icon: React.ReactNode;
}

interface SubTabDef {
  id: string;
  label: string;
}

const MAIN_TABS: TabDef[] = [
  {
    id: 'onizleme',
    label: 'e-Okul Önizleme',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'liste',
    label: 'Öğrenci Listesi',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: 'roster',
    label: 'Öğrenci Tablosu',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    id: 'edebiyat',
    label: 'Türk Dili ve Edebiyatı',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    id: 'yabanci',
    label: 'Yabancı Dil',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    id: 'bedenEgitimi',
    label: 'Beden Eğitimi',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M6 8H5a4 4 0 000 8h1" />
        <line x1="6" y1="12" x2="18" y2="12" />
        <line x1="6" y1="8" x2="6" y2="16" />
        <line x1="18" y1="8" x2="18" y2="16" />
      </svg>
    ),
  },
  {
    id: 'ileriModul',
    label: 'Diğer Dersler / Performans',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
      </svg>
    ),
  },
  {
    id: 'yoklama',
    label: 'Sınava Girmeyenler',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="18" y1="8" x2="23" y2="13" />
        <line x1="23" y1="8" x2="18" y2="13" />
      </svg>
    ),
  },
  {
    id: 'analiz',
    label: 'Sınav Analizi',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'sinavTakvimi',
    label: 'Sınav Takvimi',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'sinifYonetimi',
    label: 'Sınıf Yönetimi',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

// Sub-tabs per main tab
const SUB_TABS: Record<string, SubTabDef[]> = {
  edebiyat: [
    { id: 'speak', label: 'Konuşma Sınavı' },
    { id: 'calc', label: 'Not Hesaplama' },
    { id: '1', label: '1. Tema Konuşma' },
    { id: '2', label: '2. Tema Konuşma' },
    { id: '3', label: '1. Tema Yazma' },
    { id: '4', label: '2. Tema Yazma' },
    { id: 'theme25', label: 'Performans Ölçeği' },
  ],
  yabanci: [
    { id: 'speak', label: 'Konuşma Sınavı' },
    { id: 'calc', label: 'Not Hesaplama' },
  ],
  bedenEgitimi: [
    { id: 'perf1', label: '1. Performans' },
    { id: 'perf2', label: '2. Performans' },
    { id: 'uyg1', label: 'Uygulama 1' },
    { id: 'uyg2', label: 'Uygulama 2' },
  ],
};

// --------------- Branş → Tab filtresi ---------------
import type { Branch } from './BranchSelector';

const BRANCH_TABS: Record<Branch, string[]> = {
  yabanci:  ['sinifYonetimi', 'onizleme', 'liste', 'roster', 'yabanci', 'yoklama', 'analiz', 'sinavTakvimi'],
  edebiyat: ['sinifYonetimi', 'onizleme', 'liste', 'roster', 'edebiyat', 'yoklama', 'analiz', 'sinavTakvimi'],
  beden:    ['sinifYonetimi', 'onizleme', 'liste', 'roster', 'bedenEgitimi', 'yoklama', 'analiz', 'sinavTakvimi'],
  diger:    ['sinifYonetimi', 'onizleme', 'liste', 'roster', 'ileriModul', 'yoklama', 'analiz', 'sinavTakvimi'],
};

// --------------- Component ---------------

interface TabBarProps {
  branch?: Branch | null;
  onChangeBranch?: () => void;
}

export default function TabBar({ branch, onChangeBranch }: TabBarProps) {
  const { state, dispatch } = useNotHesaplama();
  const { activeTab, activeSubTab } = state;

  const visibleTabIds = branch ? BRANCH_TABS[branch] : MAIN_TABS.map(t => t.id);
  const visibleTabs = MAIN_TABS.filter(t => visibleTabIds.includes(t.id));
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId as TabId });
    // Set default sub-tab if the tab has sub-tabs and none is selected
    const subs = SUB_TABS[tabId];
    if (subs && !activeSubTab[tabId]) {
      dispatch({
        type: 'SET_ACTIVE_SUB_TAB',
        payload: { tabId, subTabId: subs[0].id },
      });
    }
  };

  const handleSubTabClick = (tabId: string, subTabId: string) => {
    dispatch({
      type: 'SET_ACTIVE_SUB_TAB',
      payload: { tabId, subTabId },
    });
  };

  const currentSubTabs = SUB_TABS[activeTab] || null;
  const currentSubTab = activeSubTab[activeTab] || (currentSubTabs ? currentSubTabs[0].id : '');

  return (
    <nav className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Main Tabs */}
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 py-2 -mx-1 px-1"
        >
          {/* Branş değiştir butonu */}
          {branch && onChangeBranch && (
            <button
              onClick={onChangeBranch}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition mr-1 shrink-0"
              title="Branş değiştir"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Branş
            </button>
          )}
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-active={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg
                  whitespace-nowrap transition-all duration-200 flex-shrink-0
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }
                `}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
                {/* Show short label on small screens */}
                <span className="md:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tabs (conditional) */}
      {currentSubTabs && (
        <div className="bg-slate-50/80 border-t border-slate-200">
          <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-1.5 -mx-1 px-1">
              {currentSubTabs.map((sub) => {
                const isActive = currentSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubTabClick(activeTab, sub.id)}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap
                      transition-all duration-200 flex-shrink-0
                      ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }
                    `}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
