// ============================================================
// A4 Paper Container - Ekranda A4 kağıdı görünümü sağlar
// Portrait: 210mm × 297mm, Landscape: 297mm × 210mm
// İçerik CSS zoom ile kağıda sığdırılır
// ============================================================

import React from 'react';
import SignatureBlock from './SignatureBlock';

interface A4PaperProps {
  orientation?: 'portrait' | 'landscape';
  children: React.ReactNode;
  className?: string;
  showSignature?: boolean;
  title?: string;
}

export default function A4Paper({
  orientation = 'portrait',
  children,
  className = '',
  showSignature = true,
  title,
}: A4PaperProps) {
  const isLandscape = orientation === 'landscape';

  return (
    <div className="flex justify-center py-4 overflow-x-auto">
      <div
        className={`
          bg-white border border-slate-300 shadow-sm rounded
          overflow-visible
          ${isLandscape ? 'print-landscape' : ''}
          ${className}
        `}
        style={{
          width: isLandscape ? '297mm' : '210mm',
          minHeight: isLandscape ? '210mm' : '297mm',
          padding: isLandscape ? '8mm 6mm' : '10mm 12mm',
          boxSizing: 'border-box',
        }}
      >
        {title && (
          <h2 className="text-center text-sm font-bold uppercase text-slate-800 border-b-2 border-slate-800 pb-2 mb-4">
            {title}
          </h2>
        )}

        <div className="w-full overflow-x-auto">
          {children}
        </div>

        {showSignature && <SignatureBlock />}
      </div>
    </div>
  );
}
