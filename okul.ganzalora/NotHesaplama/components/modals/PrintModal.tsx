// ============================================================
// Not Hesaplama - Print Modal
// Yazdır + PDF İndir (jsPDF + html2canvas)
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

type Orientation = 'portrait' | 'landscape';

interface PrintModalProps {
  onClose: () => void;
}

export default function PrintModal({ onClose }: PrintModalProps) {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [pdfLoading, setPdfLoading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Tarayıcı yazdırma diyaloğu
  const handlePrint = () => {
    const styleId = 'nh-print-orientation';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = orientation === 'landscape'
      ? '@media print { @page { size: A4 landscape !important; margin: 8mm; } }'
      : '@media print { @page { size: A4 portrait !important; margin: 8mm; } }';

    onClose();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
        setTimeout(() => { if (styleEl) styleEl.textContent = ''; }, 500);
      });
    });
  };

  // jsPDF + html2canvas ile PDF indirme
  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas-pro'),
      ]);

      const isLandscape = orientation === 'landscape';

      // no-print elemanlarını gizle
      const noPrintEls = document.querySelectorAll('.no-print');
      noPrintEls.forEach(el => (el as HTMLElement).style.display = 'none');

      // Boş öğrenci satırlarını gizle
      const emptyRows = document.querySelectorAll('tr.student-row-empty');
      emptyRows.forEach(el => (el as HTMLElement).style.display = 'none');

      const DPI_SCALE = 3;

      // A4 boyutları (mm)
      const pageW = isLandscape ? 297 : 210;
      const pageH = isLandscape ? 210 : 297;
      const margin = 8;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;

      const doc = new jsPDF({
        orientation: isLandscape ? 'l' : 'p',
        unit: 'mm',
        format: 'a4',
      });

      // .pdf-page elemanları varsa her birini ayrı sayfa yap
      const pdfPages = document.querySelectorAll('.pdf-page');
      const targets = pdfPages.length > 0
        ? Array.from(pdfPages) as HTMLElement[]
        : [document.querySelector('main') || document.body] as HTMLElement[];

      for (let i = 0; i < targets.length; i++) {
        if (i > 0) doc.addPage();

        const canvas = await html2canvas.default(targets[i], {
          scale: DPI_SCALE,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: targets[i].scrollWidth,
        });

        const imgW = canvas.width;
        const imgH = canvas.height;

        // Genişliğe sığdır, yükseklik taşarsa oranla küçült
        const scaleToFitW = contentW / (imgW / DPI_SCALE);
        let usedW = contentW;
        let usedH = (imgH / DPI_SCALE) * scaleToFitW;

        if (usedH > contentH) {
          const shrink = contentH / usedH;
          usedW *= shrink;
          usedH = contentH;
        }

        const offsetX = margin + (contentW - usedW) / 2;
        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        doc.addImage(imgData, 'JPEG', offsetX, margin, usedW, usedH);
      }

      // Dosya adı
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      const fileName = `not-hesaplama-${orientation}-${timestamp}.pdf`;
      doc.save(fileName);

      // Gizlenen elemanları geri getir
      noPrintEls.forEach(el => (el as HTMLElement).style.display = '');
      emptyRows.forEach(el => (el as HTMLElement).style.display = '');

      onClose();
    } catch (err) {
      console.error('PDF oluşturma hatası:', err);
      alert('PDF oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Yazdır / PDF İndir</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-slate-600 mb-4">Sayfa yönünü seçin:</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {([
              { value: 'portrait' as Orientation, label: 'Dikey', icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="9" y1="18" x2="15" y2="18" /></svg> },
              { value: 'landscape' as Orientation, label: 'Yatay', icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="18" y1="15" x2="18" y2="9" /></svg> },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setOrientation(opt.value)}
                className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                  orientation === opt.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {opt.icon}
                <span className="text-sm font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition">
            İptal
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6,9 6,2 18,2 18,9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
              </svg>
              Yazdır
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {pdfLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  PDF Hazırlanıyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  PDF İndir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
