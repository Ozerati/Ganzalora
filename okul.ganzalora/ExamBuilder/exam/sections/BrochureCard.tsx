import React from 'react';
import type { BrochureData } from '../types';

/* ═══════════════════════════════════════════════════════
   BROCHURE CARD — HTML/CSS component
   ═══════════════════════════════════════════════════════ */
export function BrochureCard({ b }: { b: BrochureData }) {
  const e = b.emoji || '\u{1F33F}';
  // Emoji sets based on theme
  const emojiSets: Record<string, { row: string; footer: string; dots: string }> = {
    '\u{1F333}': { row: '\u{1F333}\u{1F331}\u{1F33F}\u{1F340}\u{1F333}', footer: '\u{1F332}\u{1F333}\u{1F334}\u{1F332}\u{1F333}', dots: '\u{1F91D}\u{1F49A}\u{1F30D}' },
    '\u{1F30A}': { row: '\u{1F30A}\u{1F42C}\u{1F41A}\u{1F980}\u{1F30A}', footer: '\u{1F3D6}\uFE0F\u{1F420}\u{1F988}\u{1F40B}\u{1F3D6}\uFE0F', dots: '\u{1F91D}\u{1F499}\u{1F30F}' },
    '\u2764\uFE0F': { row: '\u2764\uFE0F\u{1F9E3}\u{1F372}\u{1F3E0}\u2764\uFE0F', footer: '\u{1FAC2}\u{1F9E4}\u{1F525}\u{1FAC2}\u{1F9E4}', dots: '\u{1F91D}\u{1F9E1}\u{1F3E0}' },
    '\u{1F3C3}': { row: '\u{1F3C3}\u26BD\u{1F3C6}\u{1F3AF}\u{1F3C3}', footer: '\u{1F947}\u{1F3C5}\u{1F396}\uFE0F\u{1F947}\u{1F3C5}', dots: '\u{1F91D}\u{1F4AA}\u{1F3DF}\uFE0F' },
  };
  const set = emojiSets[e] || emojiSets['\u{1F333}'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '33% 34% 33%', border: '1.5px solid #a5d6a7', borderRadius: '10px', overflow: 'hidden', background: '#fff', fontSize: '8pt', lineHeight: 1.4, height: '200px' }}>
      {/* ══ Column 1: Organization ══ */}
      <div style={{ background: 'linear-gradient(180deg, #f1f8e9 0%, #e8f5e9 100%)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', borderRight: '1.5px dashed #c8e6c9' }}>
        <div style={{ background: 'linear-gradient(135deg, #66bb6a, #81c784)', color: '#fff', textAlign: 'center', padding: '5px 8px', borderRadius: '20px', fontWeight: 800, fontSize: '8pt', letterSpacing: '1px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
          {e} SAVE THE DATE {e}
        </div>
        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '9pt', color: '#388e3c', letterSpacing: '0.3px' }}>
          {b.orgName}
        </div>
        <div style={{ background: '#f9fbe7', border: '1px solid #aed581', borderRadius: '6px', padding: '4px 6px', textAlign: 'center', color: '#558b2f', fontSize: '8pt', fontStyle: 'italic', fontWeight: 600 }}>
          {b.slogan}
        </div>
        <div style={{ fontSize: '7.5pt', color: '#37474f', lineHeight: 1.35, flex: 1 }}>
          {b.description}
        </div>
        <div style={{ textAlign: 'center', fontSize: '14pt', lineHeight: 1, letterSpacing: '2px' }}>
          {set.row}
        </div>
      </div>

      {/* ══ Column 2: Campaign ══ */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'linear-gradient(180deg, #ffffff 0%, #f9fbe7 100%)' }}>
        <div style={{ fontSize: '18pt', lineHeight: 1 }}>{e}</div>
        <div style={{ fontSize: '12pt', fontWeight: 900, color: '#43a047', textAlign: 'center', lineHeight: 1.15, letterSpacing: '0.3px' }}>
          {b.campaignTitle}
        </div>
        <div style={{ width: '70%', height: '1.5px', background: 'linear-gradient(90deg, transparent, #81c784, transparent)', margin: '2px 0' }} />
        <div style={{ fontSize: '8pt', color: '#555', textAlign: 'center', lineHeight: 1.4 }}>
          {'\u{1F4C5}'} {b.campaignDetails}
        </div>
        <div style={{ fontSize: '8pt', color: '#333', textAlign: 'center', lineHeight: 1.4, background: '#f1f8e9', borderRadius: '4px', padding: '3px 6px', width: '100%' }}>
          {'\u{1F3AF}'} <strong>Aim:</strong> {b.campaignAim}
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: 'auto' }}>
          {[...set.footer].filter(c => c.trim()).slice(0, 5).map((t, i) => <span key={i} style={{ fontSize: '10pt' }}>{t}</span>)}
        </div>
      </div>

      {/* ══ Column 3: CTA ══ */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', background: 'linear-gradient(180deg, #e8eaf6 0%, #e3f2fd 100%)', borderLeft: '1.5px dashed #90caf9' }}>
        <div style={{ background: 'linear-gradient(135deg, #42a5f5, #64b5f6)', color: '#fff', textAlign: 'center', padding: '5px 8px', borderRadius: '20px', fontWeight: 800, fontSize: '8pt', letterSpacing: '0.5px', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
          {'\u270B'} {b.callToAction}
        </div>
        <div style={{ textAlign: 'center', fontSize: '6.5pt', color: '#546e7a', fontWeight: 600, letterSpacing: '1px' }}>{'\u{1F4F1}'} REGISTER ONLINE:</div>
        {b.website && (
          <div style={{ background: '#fff', border: '1px solid #90caf9', borderRadius: '6px', padding: '4px 6px', textAlign: 'center', color: '#1976d2', fontSize: '8pt', fontWeight: 700 }}>
            {'\u{1F310}'} {b.website}
          </div>
        )}
        <div style={{ background: 'linear-gradient(135deg, #66bb6a, #81c784)', color: '#fff', textAlign: 'center', padding: '5px 8px', borderRadius: '20px', fontWeight: 800, fontSize: '7.5pt', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
          {'\u{1F49A}'} DONATE &amp; SUPPORT
        </div>
        <div style={{ fontSize: '7.5pt', color: '#37474f', textAlign: 'center', lineHeight: 1.35, flex: 1 }}>
          {'\u{1F4B0}'} {b.donationInfo}
        </div>
        <div style={{ textAlign: 'center', fontSize: '10pt', letterSpacing: '3px' }}>
          {set.dots}
        </div>
      </div>
    </div>
  );
}
