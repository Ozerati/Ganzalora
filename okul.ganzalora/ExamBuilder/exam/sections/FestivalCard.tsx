import React from 'react';

/* ═══════════════════════════════════════════════════════
   FESTIVAL CARD — 10. sınıf E bölümü
   PDF referansı: Herb Festival kart formatı
   Görsel yok — emoji + HTML/CSS ile kart tasarımı
   ═══════════════════════════════════════════════════════ */

// Festival temasına göre emoji seti
const THEME_EMOJIS: Record<string, { main: string; side: string[]; accent: string }> = {
  'TULIP': { main: '\u{1F337}', side: ['\u{1F337}', '\u{1F33B}', '\u{1F33A}', '\u{1F338}'], accent: '#e91e63' },
  'HERB': { main: '\u{1F33F}', side: ['\u{1F33F}', '\u{1F331}', '\u{1F96C}', '\u{1F375}'], accent: '#2e7d32' },
  'BALLOON': { main: '\u{1F388}', side: ['\u{1F388}', '\u{26F0}\uFE0F', '\u{1F305}', '\u{1F3DC}\uFE0F'], accent: '#e65100' },
  'FILM': { main: '\u{1F3AC}', side: ['\u{1F3AC}', '\u{1F3C6}', '\u{1F39E}\uFE0F', '\u{2B50}'], accent: '#f57c00' },
  'DEFAULT': { main: '\u{1F389}', side: ['\u{1F389}', '\u{1F38A}', '\u{2728}', '\u{1F3B6}'], accent: '#1565c0' },
};

function detectTheme(passage: string): keyof typeof THEME_EMOJIS {
  const lower = passage.toLowerCase();
  if (lower.includes('tulip')) return 'TULIP';
  if (lower.includes('herb') || lower.includes('ala\u00e7at')) return 'HERB';
  if (lower.includes('balloon') || lower.includes('cappadocia')) return 'BALLOON';
  if (lower.includes('film') || lower.includes('cinema') || lower.includes('orange')) return 'FILM';
  return 'DEFAULT';
}

interface FestivalInfo {
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
  body: string[];
  highlights: string[];
}

function parseFestival(passage: string): FestivalInfo {
  const lines = passage.split('\n').map(l => l.replace(/\*\*/g, '').trim()).filter(l => l);
  const info: FestivalInfo = { title: '', subtitle: '', details: [], body: [], highlights: [] };

  let phase: 'title' | 'content' = 'title';

  for (const line of lines) {
    if (phase === 'title') {
      if (!info.title) { info.title = line; continue; }
      if (!info.subtitle) { info.subtitle = line; phase = 'content'; continue; }
    }

    if (line.startsWith('-') || line.startsWith('\u2022')) {
      info.highlights.push(line.replace(/^[-\u2022]\s*/, ''));
      continue;
    }

    const colonMatch = line.match(/^(Location|Time|Purpose|Date|Period|Every):\s*(.+)/i);
    if (colonMatch) {
      info.details.push({ label: colonMatch[1], value: colonMatch[2] });
      continue;
    }

    if (line.toLowerCase().includes('main events') || line.toLowerCase().includes('highlights')) {
      continue; // header, skip
    }

    if (line.length > 20) {
      info.body.push(line);
    }
  }

  return info;
}

interface FestivalCardProps {
  passage: string;
  imageUrl?: string;
  items: string[];
  answerTexts?: string[];
}

export function FestivalCard({ passage, items, answerTexts }: FestivalCardProps) {
  const fi = items.filter(it => it.trim());
  const theme = detectTheme(passage);
  const emojis = THEME_EMOJIS[theme];
  const info = parseFestival(passage);

  const isTableFormat = fi.length > 0 && fi[0].includes(':') && !fi[0].match(/^\d+\./);

  return (
    <div>
      {/* Festival Kart */}
      <div style={{
        border: '2px solid #999',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '4mm',
        position: 'relative',
        background: '#fff',
        overflow: 'hidden',
      }}>
        {/* Sağ üst emoji dekorasyon */}
        <div style={{
          position: 'absolute', top: '10px', right: '14px',
          display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center',
        }}>
          {emojis.side.slice(0, 3).map((e, i) => (
            <span key={i} style={{ fontSize: i === 0 ? '28px' : '20px', lineHeight: 1, opacity: i === 0 ? 1 : 0.7 }}>{e}</span>
          ))}
        </div>

        {/* Başlık */}
        <div style={{
          fontSize: '14pt', fontWeight: 900,
          textAlign: 'center', marginBottom: '2px',
          letterSpacing: '0.5px',
        }}>
          {emojis.main} {info.title}
        </div>

        {/* Alt başlık */}
        {info.subtitle && (
          <div style={{
            fontSize: '10pt', fontWeight: 700, fontStyle: 'italic',
            color: emojis.accent, textAlign: 'center', marginBottom: '8px',
          }}>
            {info.subtitle}
          </div>
        )}

        {/* Bilgi satırları */}
        <div style={{ fontSize: '9pt', lineHeight: 1.7, paddingRight: '55px' }}>
          {info.details.map((d, i) => (
            <div key={i}>
              <strong>{d.label}:</strong> {d.value}
            </div>
          ))}
          {info.body.length > 0 && info.details.length > 0 && (
            <div style={{ marginTop: '2px' }}>
              <strong>Purpose:</strong> {info.body[0]}
            </div>
          )}
        </div>

        {/* Highlights */}
        {info.highlights.length > 0 && (
          <div style={{ marginTop: '6px' }}>
            <div style={{ fontSize: '9pt', fontWeight: 800, marginBottom: '3px' }}>
              Main Events & Highlights
            </div>
            {info.highlights.map((h, i) => (
              <div key={i} style={{ fontSize: '8.5pt', lineHeight: 1.6, paddingLeft: '10px' }}>
                • {h}
              </div>
            ))}
          </div>
        )}

        {/* Body text (eğer detail/highlight yoksa) */}
        {info.highlights.length === 0 && info.body.length > 0 && (
          <div style={{ fontSize: '9pt', lineHeight: 1.6, marginTop: '6px', paddingRight: '55px' }}>
            {info.body.map((b, i) => (
              <div key={i} style={{ marginBottom: '3px' }}>{b}</div>
            ))}
          </div>
        )}
      </div>

      {/* Tablo formatı (Name of Event / Location / Date / Food) */}
      {isTableFormat && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
          <thead>
            <tr>
              {fi.map((item, i) => {
                const label = item.split(':')[0].replace(/^\d+\.\s*/, '').trim();
                return (
                  <th key={i} style={{
                    border: '1.5px solid #555', padding: '4px 8px',
                    fontWeight: 700, textAlign: 'left', background: '#f5f5f5',
                  }}>{label}</th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {fi.map((_, i) => (
                <td key={i} style={{ border: '1.5px solid #555', padding: '4px 8px', height: '10mm' }}>
                  {i + 1}. {answerTexts?.[i] && (
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>{answerTexts[i]}</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}

      {/* Soru formatı (1. What is... / 2. Where is...) */}
      {!isTableFormat && fi.map((item, i) => (
        <div key={i} style={{ fontSize: '9pt', marginBottom: '2.5mm', display: 'flex', alignItems: 'flex-end', gap: '2mm' }}>
          <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{item}</span>
          {answerTexts?.[i] ? (
            <span style={{ color: '#dc2626', fontWeight: 700, borderBottom: '2px solid #dc2626', padding: '0 2mm', flexShrink: 0 }}>{answerTexts[i]}</span>
          ) : (
            <span style={{ borderBottom: '1px dotted #888', flex: 1, minWidth: '20mm' }}>&nbsp;</span>
          )}
        </div>
      ))}
    </div>
  );
}
