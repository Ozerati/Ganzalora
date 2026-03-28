// =============================================================================
// Not Hesaplama – Constants & Criteria Data
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PerfCriterion {
  cat: string;
  desc: string;
}

export interface PerfGroupScheme {
  levels: string[];
  groups: { name: string; points: number[] }[];
}

export interface PerfCriteriaScheme {
  levels: string[];
  points: number[];
  criteria: string[];
}

export interface BeCriteria {
  perf: string[];
  uyg1: string[];
  uyg2: string[];
}

export interface SpeakingCriteria {
  edebiyat: string[];
  yabanci: string[];
}

export interface CalcWeight {
  w: number;
  l: number;
  s: number;
  labels: [string, string, string];
}

// ---------------------------------------------------------------------------
// 1. ADV_PERF_CRITERIA – standard20 scheme (20 items)
// ---------------------------------------------------------------------------

export const ADV_PERF_CRITERIA: PerfCriterion[] = [
  { cat: '1. DERSE HAZIRLIK', desc: 'Kaynak bilgisi sorgulama.' },
  { cat: '1. DERSE HAZIRLIK', desc: 'Bilgi kaynaklarını kendisi bulur.' },
  { cat: '1. DERSE HAZIRLIK', desc: 'Bilgiyi nereden edineceğini bildiğini söyler.' },
  { cat: '1. DERSE HAZIRLIK', desc: 'Derse değişik yardımcı kaynaklarla gelir.' },
  { cat: '1. DERSE HAZIRLIK', desc: 'Derse hazırlıklı gelir.' },
  { cat: '2. ETKİNLİKLERE KATILIM', desc: 'Kendiliğinden söz alarak görüşünü söyler.' },
  { cat: '2. ETKİNLİKLERE KATILIM', desc: 'Kendisine görüşü sorulduğunda konuşur.' },
  { cat: '2. ETKİNLİKLERE KATILIM', desc: 'Belirttiği görüş ve verdiği örnekler özgündür.' },
  { cat: '2. ETKİNLİKLERE KATILIM', desc: 'Yeni ve özgün sorular sorar.' },
  { cat: '2. ETKİNLİKLERE KATILIM', desc: 'Dersi dinlediğini gösteren özgün sorular sorar.' },
  { cat: '3. ARAŞTIRMA-GÖZLEM', desc: 'Bilgi toplamak için çeşitli kaynaklara başvurur.' },
  { cat: '3. ARAŞTIRMA-GÖZLEM', desc: 'Verilenden farklı kaynakları da araştırır.' },
  { cat: '3. ARAŞTIRMA-GÖZLEM', desc: 'İnceleme ve araştırma ödevlerini özenle yapar.' },
  { cat: '3. ARAŞTIRMA-GÖZLEM', desc: 'Gözlemlerinde mantıklı çıkarımlarda bulunur.' },
  { cat: '3. ARAŞTIRMA-GÖZLEM', desc: 'Araştırma-incelemede genellemeler yapar.' },
  { cat: '4. SUNUM', desc: 'Verilenlerden grafik ve çizelgeler oluşturur.' },
  { cat: '4. SUNUM', desc: 'Yönteme uygun deney yapar.' },
  { cat: '5. UYGULAMA', desc: 'Derslere zamanında girer.' },
  { cat: '5. UYGULAMA', desc: 'Dersin akışını bozmaz.' },
  { cat: '5. UYGULAMA', desc: 'Ödevlerini zamanında hazırlayarak sunar.' },
];

// ---------------------------------------------------------------------------
// 2. ADV_PERF_9I – alt9i scheme (7 groups)
// ---------------------------------------------------------------------------

export const ADV_PERF_9I: PerfGroupScheme = {
  levels: ['KÖTÜ', 'ORTA', 'İYİ', 'PEKİYİ'],
  groups: [
    { name: 'SINIF İÇİ DAVRANIŞ', points: [10, 15, 20, 30] },
    { name: 'DERSE HAZIRLANARAK GELME', points: [5, 8, 10, 15] },
    { name: 'DERSE AKTİF KATILIM (SORU-CEVAP)', points: [5, 8, 10, 15] },
    { name: 'ARKADAŞLARINA VE ÖĞRETMENLERİNE SAYGILI DAVRANMA', points: [2, 5, 8, 10] },
    { name: 'VERİLEN GÖREVLERİ YERİNE GETİRME', points: [3, 5, 8, 10] },
    { name: 'EV ÖDEVLERİNİ ZAMANINDA YAPMA', points: [0, 5, 8, 10] },
    { name: 'DERSİN HUZURUNU BOZMAMA', points: [0, 5, 8, 10] },
  ],
};

// ---------------------------------------------------------------------------
// 3. ADV_9I_SCORE_BY_TOTAL – total → 7-group distribution mapping
// ---------------------------------------------------------------------------

export const ADV_9I_SCORE_BY_TOTAL: Record<number, number[]> = {
  0:   [0, 0, 0, 0, 0, 0, 0],
  25:  [10, 5, 5, 2, 3, 0, 0],
  30:  [10, 5, 5, 5, 5, 0, 0],
  35:  [10, 5, 5, 5, 5, 5, 0],
  40:  [10, 10, 5, 5, 5, 5, 0],
  45:  [10, 10, 10, 5, 5, 5, 0],
  50:  [10, 10, 10, 10, 5, 5, 0],
  55:  [10, 10, 10, 10, 10, 5, 0],
  60:  [10, 10, 10, 10, 10, 10, 0],
  65:  [10, 10, 10, 10, 10, 5, 10],
  70:  [15, 10, 10, 10, 10, 10, 5],
  75:  [15, 15, 10, 10, 10, 10, 5],
  80:  [15, 15, 15, 10, 10, 10, 5],
  85:  [20, 15, 15, 10, 10, 10, 5],
  90:  [30, 15, 15, 10, 10, 5, 5],
  95:  [30, 15, 15, 10, 10, 10, 5],
  100: [30, 15, 15, 10, 10, 10, 10],
};

// ---------------------------------------------------------------------------
// 4. ADV_PERF_12I – alt12i scheme (20 criteria)
// ---------------------------------------------------------------------------

export const ADV_PERF_12I: PerfCriteriaScheme = {
  levels: ['KÖTÜ', 'ORTA', 'İYİ', 'PEKİYİ'],
  points: [2, 3, 4, 5],
  criteria: [
    'Derse hazırlıklı gelme',
    'Öğretim materyallerini bulundurma',
    'Hazırbulunuşluluk düzeyi',
    'Öğrenme öğretme sürecine katılma',
    'Öğrenme öğretme sürecinde notlar alma',
    'Soru ve önerilere cevap verebilme',
    'Fikir yürütme, çıkarımda bulunma',
    'Tahmin ve gözlem yapabilme',
    'Grupla çalışma becerisi',
    'Türkçeyi güzel yazma ve doğru kullanma',
    'Derse karşı tutum (istekli oluş)',
    'Arkadaşlarına gösterdiği saygı',
    'Sınıf içi tartışmalara katılım',
    'Öğrenme öğretme sürecinde soru sorabilme',
    'Verilen görevleri yapabilme',
    'Konuları günlük yaşamla ilişkilendirme',
    'Eleştirel düşünme',
    'Analiz ve sentez yapabilme',
    'Etkinliklerde görev alma',
    'Yaratıcı düşünme becerisi',
  ],
};

// ---------------------------------------------------------------------------
// 5. BE_CRITERIA – Beden Eğitimi
// ---------------------------------------------------------------------------

export const BE_CRITERIA: BeCriteria = {
  perf: [
    'KIYAFET KONTROLÜ (20 PUAN)',
    'DERS ARAÇ GEREÇ KULLANIMI (20 PUAN)',
    'DERSE ZAMANINDA GELME (20 PUAN)',
    'ÖĞRETMENE VE DERSE SAYGI (20 PUAN)',
    'SINIF ARKADAŞLARIYLA İLİŞKİSİ (20 PUAN)',
  ],
  uyg1: [
    'Kavramları açıklayabilme (20 Puan)',
    'Paslaşma becerisi (20 Puan)',
    'Top sürme becerisi (20 Puan)',
    'Top kontrol becerisi (20 Puan)',
    'Vuruş becerisi (20 Puan)',
  ],
  uyg2: [
    'Kavramları açıklayabilme (20 Puan)',
    'Şut becerisi (20 Puan)',
    'Aldatma becerisi (20 Puan)',
    'Hücum becerisi (20 Puan)',
    'Savunma becerisi (20 Puan)',
  ],
};

// ---------------------------------------------------------------------------
// 6. SPEAKING_CRITERIA
// ---------------------------------------------------------------------------

export const SPEAKING_CRITERIA: SpeakingCriteria = {
  edebiyat: ['AKICILIK', 'DİL KULLANIMI', 'BEDEN DİLİ', 'BÜTÜNLÜK', 'İÇERİK'],
  yabanci: ['CONTENT', 'ORGANIZATION', 'VOCABULARY', 'FLUENCY', 'ACCURACY'],
};

// ---------------------------------------------------------------------------
// 7. CALC_WEIGHTS
// ---------------------------------------------------------------------------

export const CALC_WEIGHTS: Record<string, CalcWeight> = {
  edebiyat: { w: 0.70, l: 0.15, s: 0.15, labels: ['YAZILI (%70)', 'DİNLEME (%15)', 'KONUŞMA (%15)'] },
  yabanci:  { w: 0.50, l: 0.25, s: 0.25, labels: ['WRITTEN (%50)', 'LISTENING (%25)', 'SPEAKING (%25)'] },
};

// ---------------------------------------------------------------------------
// 8. GRADE_SCALE – puan → not dönüşümü
// ---------------------------------------------------------------------------

export function scoreToGrade(score: number | 'G'): number | 'G' {
  if (score === 'G') return 'G';
  if (score < 50) return 1;
  if (score < 60) return 2;
  if (score < 70) return 3;
  if (score < 85) return 4;
  return 5;
}
