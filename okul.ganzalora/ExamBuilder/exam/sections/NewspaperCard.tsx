import React from 'react';

/* ═══════════════════════════════════════════════════════
   NEWSPAPER CARD — HTML/CSS component
   ═══════════════════════════════════════════════════════ */
export function NewspaperCard({ passage, imageUrl }: { passage: string; imageUrl?: string }) {
  const lines = passage.split('\n').filter(l => l.trim());
  const newsTitle = lines.length > 0 ? lines[0] : 'THE DAILY WELLBEING';
  const newsSubtitle = lines.length > 1 ? lines[1] : '';
  const newsBody = lines.slice(2).join(' ').trim() || (lines.length > 0 ? lines[0] : '');

  return (
    <div style={{ border: '2px solid #78909c', borderRadius: '6px', overflow: 'hidden', background: '#faf8f5' }}>
      {/* Newspaper header bar */}
      <div style={{ background: 'linear-gradient(180deg, #eceff1, #cfd8dc)', padding: '6px 12px', textAlign: 'center', borderBottom: '1px solid #b0bec5' }}>
        <span style={{ fontSize: '10pt', fontWeight: 700, color: '#37474f', letterSpacing: '3px', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>
          📰 {newsTitle} 📰
        </span>
      </div>
      {/* Red separator */}
      <div style={{ height: '3.5px', background: 'linear-gradient(90deg, #c62828, #e53935, #c62828)' }} />
      {/* Subtitle */}
      {newsSubtitle && (
        <div style={{ textAlign: 'center', padding: '7px 12px 4px', fontSize: '11pt', fontWeight: 900, color: '#0d0d0d', fontFamily: 'Georgia, serif', letterSpacing: '0.3px' }}>
          {newsSubtitle}
        </div>
      )}
      {/* Content: image left + text right */}
      <div style={{ display: 'flex', gap: '10px', padding: '8px 12px 10px' }}>
        {imageUrl ? (
          <div style={{ width: '30%', flexShrink: 0 }}>
            <img src={imageUrl} alt="" style={{ width: '100%', height: 'auto', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ccc' }} crossOrigin="anonymous" />
          </div>
        ) : (
          <div style={{ width: '25%', flexShrink: 0, background: '#eceff1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}>
            <span style={{ fontSize: '28pt' }}>🧠</span>
          </div>
        )}
        <div style={{ flex: 1, fontSize: '11pt', color: '#1a1a1a', lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
          {newsBody}
        </div>
      </div>
      {/* Footer */}
      <div style={{ background: '#eceff1', padding: '3px 12px', borderTop: '1px solid #cfd8dc', textAlign: 'right', fontSize: '6pt', color: '#78909c', fontStyle: 'italic' }}>
        Your Local News Source • Health & Science
      </div>
    </div>
  );
}
