// ============================================================
// Not Hesaplama - String Formatting Utilities
// ============================================================

/**
 * Escape HTML special characters to prevent XSS.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return input.replace(/[&<>"']/g, (ch) => map[ch]);
}

/**
 * Map a main course key to its full Turkish uppercase label.
 */
export function getCourseLabelUp(main: string): string {
  const map: Record<string, string> = {
    edebiyat: 'TÜRK DİLİ VE EDEBİYATI',
    konusma: 'KONUŞMA VE YAZMA',
    hesaplama: 'HESAPLAMA',
    ileriModul: 'İLERİ MODÜL',
    bedenEgitimi: 'BEDEN EĞİTİMİ VE SPOR',
    ingilizce: 'İNGİLİZCE',
    matematik: 'MATEMATİK',
    fizik: 'FİZİK',
    kimya: 'KİMYA',
    biyoloji: 'BİYOLOJİ',
    tarih: 'TARİH',
    cografya: 'COĞRAFYA',
    felsefe: 'FELSEFE',
    din: 'DİN KÜLTÜRÜ VE AHLAK BİLGİSİ',
  };
  return map[main] ?? main.toUpperCase();
}

/**
 * Build a full content/sub-section label in uppercase.
 */
export function getContentLabelUp(main: string, sub: string, examKey?: string): string {
  const courseLabel = getCourseLabelUp(main);

  const subMap: Record<string, string> = {
    tema: 'TEMA PERFORMANSI',
    kitap: 'KİTAP OKUMA',
    konusmaEd: 'KONUŞMA (EDEBİYAT)',
    konusmaYa: 'KONUŞMA (YABANCI DİL)',
    hesaplamaEd: 'HESAPLAMA (EDEBİYAT)',
    hesaplamaYa: 'HESAPLAMA (YABANCI DİL)',
    advPerf: 'PERFORMANS',
    advExam: 'SINAV',
    advLang: 'YABANCI DİL',
    advProject: 'PROJE',
    beUyg: 'UYGULAMA',
    bePerf: 'PERFORMANS',
  };

  const subLabel = subMap[sub] ?? sub.toUpperCase();
  const exam = examKey ? ` - ${examKey}` : '';

  return `${courseLabel} / ${subLabel}${exam}`;
}

/**
 * Return the current academic year label.
 * Academic year runs Sep-Jun: if current month >= September, year is YYYY-(YYYY+1).
 * Otherwise, (YYYY-1)-YYYY.
 */
export function academicYearLabel(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed: 0=Jan, 8=Sep
  const year = now.getFullYear();

  if (month >= 8) {
    // September or later
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

/**
 * Normalize a name string for roster matching (key generation).
 * - Turkish ASCII folding
 * - Uppercase
 * - Remove extra whitespace
 * - Trim
 */
export function rosterNormName(s: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'C', 'Ç': 'C',
    'ğ': 'G', 'Ğ': 'G',
    'ı': 'I', 'İ': 'I',
    'i': 'I',
    'ö': 'O', 'Ö': 'O',
    'ş': 'S', 'Ş': 'S',
    'ü': 'U', 'Ü': 'U',
  };

  let result = '';
  for (const ch of s) {
    result += turkishMap[ch] ?? ch.toUpperCase();
  }

  // Collapse whitespace and trim
  return result.replace(/\s+/g, ' ').trim();
}
