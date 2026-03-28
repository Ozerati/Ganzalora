import React from 'react';

/* ═══════════════════════════════════════════════════════
   POSTER / INVITATION CARD — HTML/CSS
   ═══════════════════════════════════════════════════════ */
export function PosterCard({ items, imageUrl, answerTexts }: { items: string[]; imageUrl?: string; answerTexts?: string[] }) {
  const fi = items.filter(it => it.trim());
  return (
    <div style={{ border: '2px solid #7e57c2', borderRadius: '12px', background: '#fff', overflow: 'hidden', display: 'flex', height: '140px', boxShadow: '0 2px 6px rgba(126,87,194,0.12)' }}>
      {/* Left: decorative panel */}
      <div style={{ width: '22%', background: 'linear-gradient(180deg, #ede7f6 0%, #d1c4e9 50%, #b39ddb 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 6px', gap: '6px', borderRight: '2px dashed #b39ddb', flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} crossOrigin="anonymous" />
        ) : (
          <>
            <span style={{ fontSize: '24pt' }}>🎉</span>
            <span style={{ fontSize: '18pt' }}>🐾</span>
            <span style={{ fontSize: '14pt' }}>📋</span>
            <div style={{ background: '#7e57c2', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontSize: '6pt', fontWeight: 800, letterSpacing: '1px' }}>INVITATION</div>
          </>
        )}
      </div>
      {/* Right: form fields */}
      <div style={{ flex: 1, padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '7px', justifyContent: 'center' }}>
        {fi.map((item, i) => {
          const parts = item.split(':');
          const label = parts[0] + ':';
          const icons = ['🎯', '📅', '📍', '🤝', '✨'];
          return (
            <div key={i} style={{ fontSize: '9pt', color: '#1a1a2e', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '10pt' }}>{icons[i % icons.length]}</span>
              <span style={{ fontWeight: 700, color: '#4a148c' }}>{label}</span>
              {answerTexts?.[i] ? (
                <span style={{ color: '#dc2626', fontWeight: 700, borderBottom: '2px solid #dc2626', flex: 1, padding: '0 2px' }}>{answerTexts[i]}</span>
              ) : (
                <span style={{ borderBottom: '1.5px dashed #b39ddb', flex: 1, minHeight: '14px', display: 'inline-block' }}>&nbsp;</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
