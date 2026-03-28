import React from 'react';

/* ═══════════════════════════════════════════════════════
   CHRONOLOGICAL ORDER ITEM — HTML/CSS
   ═══════════════════════════════════════════════════════ */
export function ChronoItem({ item, idx, answerNum }: { item: string; idx: number; answerNum?: number }) {
  const letter = String.fromCharCode(97 + idx);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      {/* Circle — shows answer number in red if answerKey */}
      <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: `2.5px solid ${answerNum ? '#dc2626' : '#3f51b5'}`, background: '#fff', flexShrink: 0, boxShadow: '0 1px 3px rgba(63,81,181,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12pt', fontWeight: 800, color: '#dc2626' }}>
        {answerNum || ''}
      </div>
      {/* Rounded statement box */}
      <div style={{ flex: 1, border: '1.5px solid #5c6bc0', borderRadius: '8px', background: 'linear-gradient(135deg, #f5f5ff 0%, #e8eaf6 100%)', padding: '6px 10px', fontSize: '9pt', color: '#1a237e', boxShadow: '0 1px 3px rgba(63,81,181,0.1)' }}>
        <span style={{ color: '#3f51b5', fontWeight: 800, marginRight: '5px', fontSize: '9.5pt' }}>{letter}.</span>
        {item}
      </div>
    </div>
  );
}
