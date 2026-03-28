import React from 'react';
import type { ExamSection, TeacherSlot } from '../types';
import { ANSWER_KEYS_9, ANSWER_KEYS_10, ANSWER_KEYS } from '../answerKeys';
import { BrochureCard } from './BrochureCard';
import { NewspaperCard } from './NewspaperCard';
import { ChronoItem } from './ChronoItem';
import { PosterCard } from './PosterCard';
import { TravelBrochureCard } from './TravelBrochureCard';
import { FestivalCard } from './FestivalCard';
import kemalAtayLogo from '../../../../../assets/Kemal atay.png';

/* ═══ Helpers ═══ */
export function RichText({ text }: { text: string }) {
  // Splits by \n\n into paragraphs, converts **word** to <strong>
  const paragraphs = text.split(/\n\n/);
  return (
    <>
      {paragraphs.map((para, pi) => {
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={pi} style={{ marginBottom: paragraphs.length > 1 ? '6px' : '0', marginTop: 0 }}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const word = part.slice(2, -2);
                return <strong key={i} style={{ fontWeight: 800 }}>{word}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   A4 PAGE — HTML/CSS WYSIWYG
   ═══════════════════════════════════════════════════════ */
export function ExamPage({
  pageNum,
  groupLetter,
  sections,
  schoolName,
  examTitle,
  academicYear,
  teachers,
  grayscale,
  innerRef,
  layout,
  answerKey,
  pageBreakAfter,
  gradeLevel: gl = '12',
  hideFooter,
}: {
  pageNum: 1 | 2;
  groupLetter: string;
  sections: ExamSection[];
  schoolName: string;
  examTitle: string;
  academicYear: string;
  teachers: TeacherSlot[];
  grayscale: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
  layout: any;
  answerKey?: boolean;
  pageBreakAfter?: number;
  gradeLevel?: '9' | '10' | '11' | '12';
  hideFooter?: boolean;
}) {
  const answers9 = answerKey && gl === '9' ? ANSWER_KEYS_9[groupLetter] : null;
  const answers10 = answerKey && gl === '10' ? ANSWER_KEYS_10[groupLetter] : null;
  const answers12 = answerKey && gl !== '9' ? ANSWER_KEYS[groupLetter] : null;
  const answers = answers12 as Record<string, string[]> | null;
  const breakAt = pageBreakAfter ?? 2;
  const page1Secs = sections.slice(0, breakAt);
  const page2Secs = sections.slice(breakAt);
  const secs = pageNum === 1 ? page1Secs : page2Secs;
  const ft = teachers.filter(t => t.name.trim());
  const L = layout;

  return (
    <div
      ref={innerRef}
      style={{
        width: '210mm',
        height: '297mm',
        padding: `${L.topMargin}mm ${L.sideMargin}mm 12mm`,
        background: '#fff',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        color: '#1a1a1a',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        filter: grayscale ? 'grayscale(1) contrast(1.15)' : 'none',
      }}
    >
      {/* Page 1 header */}
      {pageNum === 1 && (
        <>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2mm' }}>
            {/* Big group letter */}
            <div style={{ fontSize: `${L.groupLetterSize}pt`, fontWeight: 900, color: '#1e1e1e', lineHeight: 1, marginRight: '4mm', minWidth: '16mm' }}>
              {groupLetter}
            </div>
            {/* School name + exam title centered */}
            <div style={{ flex: 1, textAlign: 'center', paddingTop: '1mm' }}>
              <div style={{ fontSize: `${L.schoolNameSize}pt`, fontWeight: 600, color: '#141414' }}>
                {academicYear} {schoolName}
              </div>
              <div style={{ fontSize: `${L.examTitleSize}pt`, fontWeight: 500, color: '#141414', marginTop: '1mm' }}>
                {groupLetter === 'Ö' ? 'ÖRNEK SINAV' : examTitle}
              </div>
            </div>
            {/* School logo */}
            <img src={kemalAtayLogo} alt="" style={{ width: '14mm', height: '14mm', objectFit: 'contain', marginLeft: '4mm' }} crossOrigin="anonymous" />
          </div>
          {/* Double decorative line */}
          <div style={{ borderTop: '2.2px solid #323232', marginBottom: '1.5mm' }} />
          <div style={{ borderTop: '0.5px solid #323232', marginBottom: `${L.gapLineToInfo}mm` }} />
          {/* Answer key label */}
          {answerKey && (
            <div style={{ textAlign: 'center', marginBottom: '2mm' }}>
              <span style={{ background: '#dc2626', color: '#fff', padding: '2px 12px', borderRadius: '4px', fontSize: '11pt', fontWeight: 800, letterSpacing: '2px' }}>CEVAP ANAHTARI</span>
            </div>
          )}
          {/* Student info */}
          <div style={{ display: 'flex', gap: '10mm', fontSize: `${L.studentInfoSize}pt`, marginBottom: `${L.gapInfoToSection}mm` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', flex: 2 }}>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Name &ndash; Surname:</span>
              <span style={{ flex: 1, borderBottom: '1px solid #000', marginLeft: '4mm', minHeight: '14px' }}>&nbsp;</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', flex: 1 }}>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Class:</span>
              <span style={{ flex: 1, borderBottom: '1px solid #000', marginLeft: '4mm', minHeight: '14px' }}>&nbsp;</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', flex: 1 }}>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Number:</span>
              <span style={{ flex: 1, borderBottom: '1px solid #000', marginLeft: '4mm', minHeight: '14px' }}>&nbsp;</span>
            </div>
          </div>
        </>
      )}

      {/* Sections */}
      {secs.map((sec, si) => {
        const sectionIdx = pageNum === 1 ? si : si + breakAt;
        const sl = sec.label || String.fromCharCode(65 + sectionIdx);
        const fi = sec.items.filter(it => it.trim());

        // C2 workplace-table: onceki section imageGrid ise zaten orada render edildi, skip
        if (sec.type === 'workplace-table' && si > 0) {
          const prevSec = secs[si - 1];
          if (prevSec && prevSec.imageGrid && prevSec.imageGrid.length > 0) return null;
        }

        return (
          <div key={sec.id} style={{ marginBottom: `${L.gapBetweenSections + 2}mm` }}>
            {/* Section header */}
            <div style={{ fontSize: `${L.sectionHeaderSize}pt`, fontWeight: 600, color: '#000', marginBottom: `${L.gapHeaderToContent + 1}mm`, lineHeight: 1.35 }}>
              {sl}. {sec.instruction}
            </div>

            {/* BROCHURE-FILL */}
            {sec.type === 'brochure-fill' && (
              <>
                {sec.brochure ? (
                  <BrochureCard b={sec.brochure} />
                ) : sec.imageUrl ? (
                  <div style={{ marginBottom: '3mm' }}>
                    <img src={sec.imageUrl} alt="" style={{ width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #ccc' }} crossOrigin="anonymous" />
                  </div>
                ) : null}
                {fi.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm 8mm', marginTop: '3mm' }}>
                    {fi.map((item, i) => (
                      <div key={i} style={{ fontSize: `${L.questionSize}pt`, whiteSpace: 'pre-line', lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 600 }}>{i + 1}. {item}</span>
                        {answers && answers.A?.[i] ? (
                          <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm', borderBottom: '2px solid #dc2626', padding: '0 2mm' }}>{answers.A[i]}</span>
                        ) : !item.includes('\n') ? (
                          <span style={{ borderBottom: '1px dashed #999', display: 'inline-block', width: '30mm', marginLeft: '2mm' }}>&nbsp;</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* WORD-CLUE */}
            {sec.type === 'word-clue' && (
              <>
                {sec.passage.trim() && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4mm' }}>
                    <div style={{ flex: 1, fontSize: `${L.bodyTextSize}pt`, color: '#1e1e1e', lineHeight: 1.5 }}>
                      <RichText text={sec.passage} />
                    </div>
                    {sec.imageUrl && (
                      <div style={{ width: '28%', flexShrink: 0, maxHeight: '45mm', overflow: 'hidden' }}>
                        <img src={sec.imageUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '4px', border: '1px solid #ddd', objectFit: 'cover', objectPosition: 'top' }} crossOrigin="anonymous" />
                      </div>
                    )}
                  </div>
                )}
                {/* Check if matching format (|||) */}
                {fi.some(it => it.includes('|||')) ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginTop: '2mm' }}>
                    {/* Left column: words */}
                    <div style={{ borderRight: '1px dashed #999', paddingRight: '4mm' }}>
                      {fi.map((item, i) => {
                        const word = item.split('|||')[0].trim();
                        return (
                          <div key={i} style={{ fontSize: `${L.questionSize + 1}pt`, marginBottom: '3mm', fontWeight: 600 }}>
                            {word}
                            {answerKey && answers?.B?.[0] && (
                              <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm' }}>
                                → {answers.B[0].split(',').find(p => p.trim().startsWith(`${i+1}`))?.split('→')[1]?.trim() || ''}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Right column: meanings */}
                    <div style={{ paddingLeft: '4mm' }}>
                      {fi.map((item, i) => {
                        const meaning = item.split('|||')[1]?.trim() || '';
                        return (
                          <div key={i} style={{ fontSize: `${L.questionSize + 1}pt`, marginBottom: '3mm' }}>
                            {meaning}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  fi.map((item, i) => (
                    <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2.5mm', whiteSpace: 'pre-line' }}>
                      <span style={{ fontWeight: 600 }}>{i + 1}. {item}</span>
                      {answers && answers.B?.[i] ? (
                        <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm' }}> → {answers.B[i]}</span>
                      ) : !item.includes('\n') ? (
                        <span style={{ borderBottom: '1px dashed #999', display: 'inline-block', width: '50%', marginLeft: '2mm' }}>&nbsp;</span>
                      ) : null}
                    </div>
                  ))
                )}
              </>
            )}

            {/* EMAIL-WRITING / POSTER */}
            {sec.type === 'email-writing' && (
              <>
                {sec.passage.trim() && (
                  <div style={{ background: '#f0f4ff', border: '1.5px solid #7e57c2', borderRadius: '8px', padding: '6px 10px', marginBottom: '3mm', fontSize: `${L.bodyTextSize + 1}pt`, fontWeight: 600, color: '#4a148c', whiteSpace: 'pre-line' }}>
                    {sec.passage}
                  </div>
                )}
                <PosterCard items={sec.items} imageUrl={sec.imageUrl} answerTexts={answerKey ? answers?.C?.map(a => a.replace(/^\(Örnek\) /, '').split(': ').slice(1).join(': ')) : undefined} />
              </>
            )}

            {/* TRAVEL BROCHURE — 10. sınıf */}
            {sec.type === 'travel-brochure' && (
              <>
                {/* Sorular 2 sütunlu */}
                {sec.passage.trim() && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm 8mm', marginBottom: '4mm', fontSize: `${L.bodyTextSize}pt`, color: '#333' }}>
                    {sec.passage.split('\n').filter(l => l.trim()).map((line, li) => (
                      <div key={li}>{line}</div>
                    ))}
                  </div>
                )}
                <TravelBrochureCard items={sec.items} />
              </>
            )}

            {/* CHRONOLOGICAL ORDER */}
            {sec.type === 'chronological-order' && (
              <div>
                {sec.passage.trim() && (
                  <div style={{ background: '#f0f4ff', border: '1.5px solid #5c6bc0', borderRadius: '8px', padding: '6px 10px', marginBottom: '4mm', fontSize: `${L.bodyTextSize + 0.5}pt`, fontWeight: 600, color: '#283593', whiteSpace: 'pre-line' }}>
                    {sec.passage}
                  </div>
                )}
                {sec.imageUrl && (
                  <div style={{ marginBottom: '3mm' }}>
                    <img src={sec.imageUrl} alt="" style={{ width: '50%', maxHeight: '25mm', objectFit: 'contain', borderRadius: '4px', border: '1px solid #ddd', display: 'block', margin: '0 auto' }} crossOrigin="anonymous" />
                  </div>
                )}
                {fi.map((item, i) => (
                  <ChronoItem key={i} item={item} idx={i} answerNum={(() => {
                    if (!answers?.D?.[0]) return undefined;
                    // Parse "e=1, b=2, d=3, a=4, c=5" format
                    const orderStr = answers.D[0];
                    const letter = String.fromCharCode(97 + i);
                    const match = orderStr.match(new RegExp(`${letter}=(\\d)`));
                    return match ? parseInt(match[1]) : undefined;
                  })()} />
                ))}
              </div>
            )}

            {/* PARAPHRASE — newspaper layout */}
            {sec.type === 'paraphrase' && (
              <>
                {sec.passage.trim() && (
                  <NewspaperCard passage={sec.passage} imageUrl={sec.imageUrl} />
                )}
                {/* If items exist (e.g. BEP multiple choice), show them */}
                {fi.length > 0 ? (
                  <div style={{ marginTop: '4mm' }}>
                    {fi.map((item, i) => (
                      <div key={i} style={{ fontSize: `${L.questionSize + 0.5}pt`, marginBottom: '3mm', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                        {item}
                        {answerKey && answers?.E?.[i] && (
                          <span style={{ color: '#dc2626', fontWeight: 700, display: 'block', marginTop: '1mm' }}>✓ {answers.E[i]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Normal: writing lines for paraphrase */
                  answerKey && answers?.E ? (
                    <div style={{ marginTop: '4mm', padding: '3mm', background: '#fef2f2', borderRadius: '4px', border: '1px solid #fecaca' }}>
                      <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '9pt', marginBottom: '2mm' }}>✓ Örnek Cevaplar:</div>
                      {answers.E.map((ans, i) => (
                        <div key={i} style={{ color: '#dc2626', fontWeight: 600, fontSize: '9pt', marginBottom: '1mm', paddingLeft: '3mm' }}>{i + 1}. {ans}</div>
                      ))}
                    </div>
                  ) : (
                  <div style={{ marginTop: '4mm', display: 'flex', flexDirection: 'column', gap: '3mm' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '9pt', color: '#333', whiteSpace: 'nowrap' }}>1.</span>
                      <div style={{ flex: 1, borderBottom: '1px dashed #787878', minHeight: '8mm' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '9pt', color: '#333', whiteSpace: 'nowrap' }}>2.</span>
                      <div style={{ flex: 1, borderBottom: '1px dashed #787878', minHeight: '8mm' }} />
                    </div>
                  </div>
                  )
                )}
              </>
            )}

            {/* PERSON CARDS — 3 kisi yan yana kart grid (picture-verbs harici, o kendi render'ini kullanir) */}
            {sec.personCards && sec.personCards.length > 0 && sec.type !== 'picture-verbs' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sec.personCards.length}, 1fr)`, gap: '4mm', marginBottom: '4mm' }}>
                  {sec.personCards.map((pc, pi) => (
                    <div key={pi} style={{ textAlign: 'center' }}>
                      {pc.imageUrl && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: pc.text ? '3mm' : '1mm' }}>
                          <img src={pc.imageUrl} alt={pc.name} style={{ width: pc.text ? '22mm' : '28mm', height: pc.text ? '22mm' : '28mm', borderRadius: pc.text ? '50%' : '6px', objectFit: 'cover', border: `2px solid ${pc.borderColor || '#90caf9'}` }} crossOrigin="anonymous" />
                        </div>
                      )}
                      {pc.text ? (
                        <div style={{ background: pc.bgColor || '#e3f2fd', borderRadius: '6px', padding: '4px 6px', fontSize: `${L.bodyTextSize}pt`, color: '#333', lineHeight: 1.4 }}>
                          {pc.text}
                        </div>
                      ) : (
                        <div style={{ background: pc.bgColor || '#e3f2fd', borderRadius: '6px', padding: '2px 6px', fontSize: `${L.bodyTextSize}pt`, fontWeight: 600, fontStyle: 'italic', color: '#555' }}>
                          {pc.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {fi.map((item, i) => {
                  const a9 = answers9?.[sec.label]?.[i];
                  const hasBlank = item.includes('____') || item.includes('\n');
                  return (
                    <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2.5mm', whiteSpace: 'pre-line' }}>
                      <span>{item}</span>
                      {a9 ? (
                        <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm', borderBottom: '2px solid #dc2626', padding: '0 2mm' }}>{a9}</span>
                      ) : !hasBlank ? (
                        <span style={{ borderBottom: '1px dotted #888', display: 'inline-block', width: '55%', marginLeft: '2mm' }}>&nbsp;</span>
                      ) : null}
                    </div>
                  );
                })}
              </>
            )}

            {/* INFO CARD — solda fotograf+bilgi karti, sagda cevap satirlari */}
            {sec.infoCard && (
              <div style={{ display: 'flex', gap: '6mm', alignItems: 'flex-start', marginBottom: '3mm' }}>
                {/* Sol: Kart (resim + bilgiler yan yana) */}
                <div style={{ width: '42%', display: 'flex', border: '1.5px solid #b3e5fc', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, #e1f5fe 0%, #fff 100%)' }}>
                  {sec.infoCard.imageUrl && (
                    <img src={sec.infoCard.imageUrl} alt="" style={{ width: '30mm', height: '30mm', objectFit: 'cover', flexShrink: 0 }} crossOrigin="anonymous" />
                  )}
                  <div style={{ padding: '3mm 4mm', fontSize: `${L.bodyTextSize - 0.5}pt`, lineHeight: 1.6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {sec.infoCard.fields.map((f, fi) => (
                      <div key={fi}><strong>{f.label}:</strong> {f.value}</div>
                    ))}
                  </div>
                </div>
                {/* Sag: Cevap satirlari */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4mm' }}>
                  {fi.map((item, i) => {
                    const a9 = answers9?.[sec.label]?.[i];
                    const hasBlank = item.includes('____');
                    return (
                      <div key={i} style={{ fontSize: `${L.questionSize}pt`, display: 'flex', alignItems: 'baseline' }}>
                        <span style={{ whiteSpace: 'nowrap' }}>{item}</span>
                        {a9 ? (
                          <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm', borderBottom: '2px solid #dc2626', padding: '0 2mm' }}>{a9}</span>
                        ) : !hasBlank ? (
                          <span style={{ flex: 1, borderBottom: '1px dotted #888', marginLeft: '2mm', minWidth: '40mm' }}>&nbsp;</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WORKPLACE-TABLE — C2: Zaten C1 imageGrid icinde render ediliyor, ayrica gosterilmez */}
            {sec.type === 'workplace-table' && (() => {
              // Onceki section imageGrid ise, C2 zaten orada render edildi — skip
              const prevSec = secs[si - 1];
              if (prevSec && prevSec.imageGrid && prevSec.imageGrid.length > 0) return null;
              // Degilse standalone render
              return (
                <div style={{ width: '50%' }}>
                  {sec.passage.trim() && (
                    <div style={{ background: '#f0f4ff', border: '1.5px solid #90caf9', borderRadius: '8px', padding: '6px 10px', marginBottom: '3mm', fontSize: `${L.bodyTextSize}pt`, fontWeight: 600, color: '#1565c0', whiteSpace: 'pre-line' }}>
                      <RichText text={sec.passage} />
                    </div>
                  )}
                  {fi.length > 0 && fi[0].includes('→') ? (
                    /* BEP: meslek → isyeri eslestirme */
                    <div>
                      {fi.map((item, i) => {
                        const a9w = answers9?.[sec.label]?.[i];
                        return (
                          <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2.5mm' }}>
                            <span>{item}</span>
                            {a9w ? (
                              <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm', borderBottom: '2px solid #dc2626', padding: '0 2mm' }}>{a9w}</span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${L.questionSize}pt` }}>
                      <thead>
                        <tr><th style={{ border: '1px solid #aaa', padding: '3px 8px', background: '#e3f2fd', fontWeight: 700, textAlign: 'center' }}>Workplaces</th></tr>
                      </thead>
                      <tbody>
                        {[1,2,3,4].map(n => {
                          const a9w = answers9?.[sec.label]?.[n - 1];
                          return (
                            <tr key={n}><td style={{ border: '1px solid #aaa', padding: '3px 8px', height: '6mm' }}>
                              {n}. {a9w && <span style={{ color: '#dc2626', fontWeight: 700 }}>{a9w}</span>}
                            </td></tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })()}

            {/* READING-TEXT — düz metin + sorular, opsiyonel sağ üst dekoratif görsel */}
            {sec.type === 'reading-text' && (
              <>
                <div style={{ position: 'relative', marginBottom: '3mm' }}>
                  {sec.imageUrl && (
                    <img src={sec.imageUrl} alt="" style={{
                      position: 'absolute', top: 0, right: 0,
                      width: '25mm', height: 'auto', opacity: 0.7,
                      borderRadius: '6px',
                    }} crossOrigin="anonymous" />
                  )}
                  <div style={{ fontSize: `${L.bodyTextSize}pt`, color: '#282828', lineHeight: 1.55, paddingRight: sec.imageUrl ? '28mm' : '0' }}>
                    {sec.passage.split('\n').map((line, li) => (
                      <div key={li} style={{ marginBottom: '1px' }}>
                        <RichText text={line} />
                      </div>
                    ))}
                  </div>
                </div>
                {fi.map((item, i) => {
                  const a10 = answers10?.[sec.label]?.[i];
                  return (
                    <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2.5mm', display: 'flex', alignItems: 'flex-end', gap: '2mm' }}>
                      <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{item}</span>
                      {a10 ? (
                        <span style={{ color: '#dc2626', fontWeight: 700, borderBottom: '2px solid #dc2626', padding: '0 2mm', flexShrink: 0 }}>{a10}</span>
                      ) : (
                        <span style={{ borderBottom: '1px dotted #888', flex: 1, minWidth: '20mm' }}>&nbsp;</span>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* FESTIVAL CARD — 10. sınıf E bölümü */}
            {sec.type === 'festival-card' && (
              <FestivalCard passage={sec.passage} imageUrl={sec.imageUrl} items={sec.items} />
            )}

            {/* READING-PORTRAIT — solda portre resim, sagda metin + altinda sorular (D bolumu) */}
            {sec.type === 'reading-portrait' && (
              <>
                <div style={{ display: 'flex', gap: '4mm', marginBottom: '3mm' }}>
                  {sec.imageUrl && (
                    <div style={{ width: '25mm', flexShrink: 0 }}>
                      <img src={sec.imageUrl} alt="" style={{ width: '100%', borderRadius: '6px', border: '1px solid #ddd' }} crossOrigin="anonymous" />
                    </div>
                  )}
                  <div style={{ flex: 1, fontSize: `${L.bodyTextSize}pt`, color: '#282828', lineHeight: 1.5 }}>
                    <RichText text={sec.passage} />
                  </div>
                </div>
                {fi.map((item, i) => {
                  const a9 = answers9?.[sec.label]?.[i];
                  const hasBlank = item.includes('____') || item.includes('True / False');
                  return (
                    <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2.5mm' }}>
                      <span>{item}</span>
                      {a9 ? (
                        <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm', borderBottom: '2px solid #dc2626', padding: '0 2mm' }}>{a9}</span>
                      ) : !hasBlank ? (
                        <span style={{ borderBottom: '1px dotted #888', display: 'inline-block', width: '55%', marginLeft: '2mm' }}>&nbsp;</span>
                      ) : null}
                    </div>
                  );
                })}
              </>
            )}

            {/* PICTURE-VERBS — ustte verbs/places kutusu + resimler + altinda cevap satirlari (E bolumu) */}
            {sec.type === 'picture-verbs' && sec.personCards && (
              <>
                {sec.passage.trim() && (
                  <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '4px 8px', marginBottom: '3mm', fontSize: `${L.bodyTextSize - 0.5}pt`, lineHeight: 1.5, display: 'flex', gap: '8mm', background: '#fafafa' }}>
                    {sec.passage.split('\n').map((line, li) => (
                      <div key={li}><RichText text={line} /></div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sec.personCards.length}, 1fr)`, gap: '3mm', marginBottom: '3mm' }}>
                  {sec.personCards.map((pc, pi) => (
                    <div key={pi} style={{ textAlign: 'center' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ position: 'absolute', top: '2px', left: '4px', background: pc.bgColor || '#e3f2fd', borderRadius: '3px', padding: '0 4px', fontSize: '7pt', fontWeight: 700, color: '#555' }}>{pi + 1}</div>
                        <img src={pc.imageUrl} alt={pc.name} style={{ width: '100%', maxHeight: '30mm', objectFit: 'cover', borderRadius: '6px', border: `2px solid ${pc.borderColor || '#90caf9'}` }} crossOrigin="anonymous" />
                      </div>
                      <div style={{ background: pc.bgColor || '#e3f2fd', borderRadius: '4px', padding: '1px 4px', fontSize: `${L.bodyTextSize - 1}pt`, fontWeight: 600, fontStyle: 'italic', color: '#555', marginTop: '1mm' }}>{pc.name}</div>
                    </div>
                  ))}
                </div>
                {fi.map((item, i) => {
                  const a9 = answers9?.[sec.label]?.[i];
                  const hasBlank = item.includes('____');
                  return (
                    <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2.5mm' }}>
                      <span>{item}</span>
                      {a9 ? (
                        <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm', borderBottom: '2px solid #dc2626', padding: '0 2mm' }}>{a9}</span>
                      ) : !hasBlank ? (
                        <span style={{ borderBottom: '1px dotted #888', display: 'inline-block', width: '80%', marginLeft: '2mm' }}>&nbsp;</span>
                      ) : null}
                    </div>
                  );
                })}
              </>
            )}

            {/* IMAGE GRID — solda metin+C2 tablo, sagda 2x2 resim (C1+C2 birlesik) */}
            {sec.imageGrid && sec.imageGrid.length > 0 && sec.passage.trim() && (
              <>
                <div style={{ display: 'flex', gap: '4mm', marginBottom: '2mm' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: `${L.bodyTextSize - 0.5}pt`, color: '#282828', lineHeight: 1.45, marginBottom: '3mm' }}>
                      <RichText text={sec.passage} />
                    </div>
                    {/* C2 Workplaces tablosu — metnin hemen altinda */}
                    {(() => {
                      const nextSec = secs[si + 1];
                      if (nextSec && nextSec.type === 'workplace-table') {
                        const hasArrowItems = nextSec.items.length > 0 && nextSec.items[0].includes('→');
                        return (
                          <div>
                            <div style={{ fontSize: `${L.sectionHeaderSize}pt`, fontWeight: 600, color: '#000', marginBottom: '2mm', lineHeight: 1.35 }}>
                              {nextSec.label}. {nextSec.instruction}
                            </div>
                            {nextSec.passage.trim() && (
                              <div style={{ background: '#f0f4ff', border: '1.5px solid #90caf9', borderRadius: '8px', padding: '4px 8px', marginBottom: '2mm', fontSize: `${L.bodyTextSize - 0.5}pt`, fontWeight: 600, color: '#1565c0' }}>
                                <RichText text={nextSec.passage} />
                              </div>
                            )}
                            {hasArrowItems ? (
                              <div>
                                {nextSec.items.filter(it => it.trim()).map((item, i) => {
                                  const a9w = answers9?.[nextSec.label]?.[i];
                                  return (
                                    <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2mm' }}>
                                      <span>{i + 1}. {item}</span>
                                      {a9w && <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: '2mm', borderBottom: '2px solid #dc2626', padding: '0 2mm' }}>{a9w}</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <table style={{ width: '70%', borderCollapse: 'collapse', fontSize: `${L.questionSize}pt` }}>
                                <thead>
                                  <tr><th style={{ border: '1px solid #aaa', padding: '2px 6px', background: '#e3f2fd', fontWeight: 700, textAlign: 'center' }}>Workplaces</th></tr>
                                </thead>
                                <tbody>
                                  {[1,2,3,4].map(n => {
                                    const a9w = answers9?.[nextSec.label]?.[n - 1];
                                    return (
                                      <tr key={n}><td style={{ border: '1px solid #aaa', padding: '2px 6px', height: '5mm' }}>
                                        {n}. {a9w && <span style={{ color: '#dc2626', fontWeight: 700 }}>{a9w}</span>}
                                      </td></tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div style={{ width: '42%', flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm' }}>
                    {sec.imageGrid.map((img, gi) => {
                      const a9g = answers9?.[sec.label]?.[gi];
                      return (
                        <div key={gi} style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '1px', left: '3px', background: '#fff', borderRadius: '3px', padding: '0 3px', fontSize: '7pt', fontWeight: 700, color: '#555', border: '1px solid #ddd' }}>{gi + 1}</div>
                          <img src={img} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} crossOrigin="anonymous" />
                          {a9g ? (
                            <div style={{ textAlign: 'center', fontSize: `${L.questionSize - 1}pt`, marginTop: '1mm', color: '#dc2626', fontWeight: 700, borderBottom: '2px solid #dc2626', paddingBottom: '1mm' }}>{a9g}</div>
                          ) : (
                            <div style={{ textAlign: 'center', fontSize: `${L.questionSize - 1}pt`, marginTop: '1mm', borderBottom: '1px dotted #888', paddingBottom: '1mm' }}>&nbsp;</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* DEFAULT fallback */}
            {!sec.personCards && !sec.infoCard && !sec.imageGrid && !['brochure-fill', 'word-clue', 'email-writing', 'travel-brochure', 'reading-text', 'festival-card', 'chronological-order', 'paraphrase', 'reading-portrait', 'picture-verbs', 'workplace-table'].includes(sec.type) && (
              <>
                {sec.imageUrl && (
                  <div style={{ marginBottom: '3mm' }}>
                    <img src={sec.imageUrl} alt="" style={{ width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #ccc' }} crossOrigin="anonymous" />
                  </div>
                )}
                {sec.passage.trim() && (
                  <div style={{ background: '#fafafa', border: '1px solid #ddd', borderRadius: '5px', padding: '6px 10px', fontSize: `${L.bodyTextSize}pt`, color: '#282828', lineHeight: 1.45, marginBottom: '3mm' }}>
                    <RichText text={sec.passage} />
                  </div>
                )}
                {fi.map((item, i) => {
                  const startsWithNum = /^\d+\./.test(item.trim());
                  const hasBlank = item.includes('____');
                  return (
                    <div key={i} style={{ fontSize: `${L.questionSize}pt`, marginBottom: '2mm', whiteSpace: 'pre-line' }}>
                      <span>{startsWithNum ? item : `${i + 1}. ${item}`}</span>
                      {!item.includes('\n') && !hasBlank && <span style={{ borderBottom: '1px dashed #999', display: 'inline-block', width: '50%', marginLeft: '2mm' }}>&nbsp;</span>}
                    </div>
                  );
                })}
                {(sec.type === 'paraphrase' || fi.length === 0) && (
                  <div style={{ marginTop: '3mm' }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} style={{ borderBottom: '1px dashed #787878', height: '7mm' }} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* Footer — teacher signatures (page 2 only) */}
      {pageNum === 2 && ft.length > 0 && !hideFooter && (
        <div style={{ position: 'absolute', bottom: `${L.footerFromBottom}mm`, left: `${L.sideMargin}mm`, right: `${L.sideMargin}mm` }}>
          <div style={{ borderTop: '1.5px solid #3c3c3c', marginBottom: '1.5mm' }} />
          <div style={{ borderTop: '0.4px solid #3c3c3c', marginBottom: '3mm' }} />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ft.length}, 1fr)`, gap: '4px', textAlign: 'center', alignItems: 'end' }}>
            {ft.map((t, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: `${L.footerNameSize}pt`, fontWeight: 400, color: '#0a0a0a', whiteSpace: 'nowrap' }}>{t.name}</div>
                <div style={{ fontSize: `${L.footerNameSize}pt`, fontWeight: 400, color: '#0a0a0a', marginTop: '1px', whiteSpace: 'nowrap' }}>{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
