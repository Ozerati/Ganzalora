import React from 'react';

/* ═══════════════════════════════════════════════════════
   TRAVEL BROCHURE CARD — 10. sınıf B bölümü
   PDF orijinaline birebir uygun:
   - City Name üstte noktalı çizgi
   - 4 ayrı mavi çerçeveli kare kutu
   - Başlık kutunun dışında üstünde
   - İkon kutunun sol üst köşesinde (sticker)
   - Kutunun geri kalanı boş yazı alanı
   ═══════════════════════════════════════════════════════ */

const CATEGORIES = [
  { label: 'a. Accommodation', emoji: '\u{1F3E8}' },
  { label: 'b. Transportation', emoji: '\u{1F68C}' },
  { label: 'c. Traditional Dishes', emoji: '\u{1F372}' },
  { label: 'd. Historic Sites', emoji: '\u{1F3DB}\uFE0F' },
];

interface TravelBrochureCardProps {
  items: string[];
  answerTexts?: string[];
}

export function TravelBrochureCard({ items, answerTexts }: TravelBrochureCardProps) {
  return (
    <div>
      {/* City Name */}
      <div style={{ textAlign: 'center', marginBottom: '4mm' }}>
        <span style={{ fontSize: '11pt', fontWeight: 800 }}>City Name: </span>
        <span style={{
          display: 'inline-block',
          width: '55%',
          borderBottom: '1.5px dotted #666',
          fontSize: '11pt',
          minHeight: '16px',
          verticalAlign: 'bottom',
        }}>
          {answerTexts?.[0]
            ? <span style={{ color: '#dc2626', fontWeight: 700 }}>{answerTexts[0]}</span>
            : '\u00A0'
          }
        </span>
      </div>

      {/* 4 Category Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '3mm',
      }}>
        {CATEGORIES.map((cat, i) => (
          <div key={i}>
            {/* Title ABOVE the box */}
            <div style={{
              fontSize: '8.5pt',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: '1.5mm',
              color: '#000',
            }}>
              {cat.label}
            </div>

            {/* Blue-bordered square box */}
            <div style={{
              border: '2px solid #9fa8da',
              borderRadius: '6px',
              background: '#fff',
              aspectRatio: '1',
              position: 'relative',
              minHeight: '80px',
            }}>
              {/* Emoji sticker in top-left */}
              <span style={{
                position: 'absolute',
                top: '4px',
                left: '6px',
                fontSize: '28px',
                lineHeight: 1,
              }}>
                {cat.emoji}
              </span>

              {/* Answer text (only shown in answer key mode) */}
              {answerTexts?.[i + 1] && (
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '6px',
                  right: '6px',
                  fontSize: '7.5pt',
                  color: '#dc2626',
                  fontWeight: 700,
                }}>
                  {answerTexts[i + 1]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
