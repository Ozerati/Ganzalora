// ============================================================
// Not Hesaplama - Notify Modal (Success)
// Green-accented notification with checkmark
// ============================================================

import React, { useEffect, useRef } from 'react';

interface NotifyModalProps {
  message: string;
  onClose: () => void;
}

export default function NotifyModal({ message, onClose }: NotifyModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Auto-close after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-sm overflow-hidden border-2 border-green-400 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon + Content */}
        <div className="px-6 py-5 flex items-start gap-4">
          {/* Success Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-green-700 mb-1">
              Başarılı
            </h3>
            <p className="text-sm text-slate-600 break-words">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Bottom progress bar (auto-close indicator) */}
        <div className="h-1 bg-green-100">
          <div
            className="h-full bg-green-500 animate-[shrink_2.5s_linear_forwards]"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Keyframe for progress bar */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
