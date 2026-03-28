// ============================================================
// Not Hesaplama - Sınav Takvimi Tab
// Tablo formatı, ders bazlı renk kodlu hücreler
// ============================================================

import { useState } from 'react';

type Grup = '911' | '12';

// ── Ders renk haritası ──
const DERS_RENK: Record<string, string> = {
  'Matematik': 'bg-blue-50 text-blue-800',
  'Seçmeli Matematik': 'bg-blue-50 text-blue-800',
  'Fizik': 'bg-cyan-50 text-cyan-800',
  'Kimya': 'bg-teal-50 text-teal-800',
  'Biyoloji': 'bg-green-50 text-green-800',
  'Tarih': 'bg-amber-50 text-amber-800',
  'Coğrafya': 'bg-lime-50 text-lime-800',
  'Seçmeli Coğrafya': 'bg-lime-50 text-lime-800',
  'Felsefe': 'bg-purple-50 text-purple-800',
  'Psikoloji': 'bg-fuchsia-50 text-fuchsia-800',
  'Demokrasi ve İnsan Hakları': 'bg-purple-50 text-purple-800',
  'Yabancı Dil': 'bg-rose-50 text-rose-800',
  'Türk Dili Edebiyatı': 'bg-red-50 text-red-800',
  'Türk Dili ve Edebiyatı': 'bg-red-50 text-red-800',
  'Din Kültürü ve Ahlak Bilgisi': 'bg-emerald-50 text-emerald-800',
  'Temel Dini Bilgiler': 'bg-emerald-50 text-emerald-800',
  'Peygamberimizin Hayatı': 'bg-emerald-50 text-emerald-800',
  'Türk Sosyal Hayatında Aile': 'bg-orange-50 text-orange-800',
  'Ahilik Kültürü ve Girişimcilik': 'bg-orange-50 text-orange-800',
  'Sağlık Bilgisi': 'bg-pink-50 text-pink-800',
  'T.C İnkılap Tarihi ve Atatürkçülük': 'bg-amber-50 text-amber-800',
  'Seçmeli Proje Tasarımı ve Uygulamaları': 'bg-indigo-50 text-indigo-800',
  'E-Ticaret': 'bg-orange-50 text-orange-800',
  'Mesleki Gelişim': 'bg-slate-100 text-slate-600',
};

function dersHucresi(text: string) {
  if (!text) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const isMesleki = line.startsWith('*');
        const label = isMesleki ? line.slice(1) : line;
        const renk = isMesleki ? 'bg-slate-50 text-slate-500 italic' : (DERS_RENK[line] || 'text-slate-700');
        return (
          <div key={i} className={`rounded px-2 py-1 text-sm font-semibold ${renk}`}>
            {label}
          </div>
        );
      })}
    </div>
  );
}

// ── Tablo verileri (Excel'den doğru tarihlerle) ──
const ROWS_911 = [
  { no: 1, date: '30.03.2026', day: 'Pzt', s9_3: 'Yabancı Dil', s9_5: '*Atölye\n*Teknik Resim', s10_4: 'Coğrafya', s10_6: '*Robotik ve Kodlama\n*Bilgisayar Destekli Çizim\n*Makine Meslek Resmi', s11_3: 'Felsefe', s11_5: 'Temel Dini Bilgiler' },
  { no: 2, date: '31.03.2026', day: 'Sal', s9_3: 'Matematik', s9_5: '*Bilgisayarlı Tasarım Uygulamaları', s10_4: 'Biyoloji', s10_6: '*Ağ Sistemleri ve Anahtarlama\n*Makine Elemanları\n*Kimyasal Kinetik', s11_3: 'Sağlık Bilgisi', s11_5: '*Tasarım Programları\n*Yenilikçi Üretim Yöntemleri\n*Mobil Uygulamalar' },
  { no: 3, date: '01.04.2026', day: 'Çar', s9_3: 'Tarih', s9_5: 'Türk Dili Edebiyatı', s10_4: 'Felsefe', s10_6: 'Yabancı Dil', s11_3: 'Psikoloji', s11_5: '*Dijital Ofis Uyg.\n*Organik Kimya' },
  { no: 4, date: '02.04.2026', day: 'Per', s9_3: 'Fizik', s9_5: '*Kimyada Mesleki Hesaplamalar', s10_4: 'Temel Dini Bilgiler', s10_6: '*Atölye 10\n*İmalat İşlemleri\n*Nitel Analiz', s11_3: 'Din Kültürü ve Ahlak Bilgisi', s11_5: '*Bilgisayar Kontrollü Üretim\n*Otomatik Üretim\n*Web Tabanlı Uyg. Geliştirme' },
  { no: 5, date: '03.04.2026', day: 'Cum', s9_3: 'Seçmeli Proje Tasarımı ve Uygulamaları', s9_5: '*Elektroteknik', s10_4: 'Tarih', s10_6: 'Din Kültürü ve Ahlak Bilgisi', s11_3: 'Tarih', s11_5: '*Yazışma ve Dosyalama Teknikleri\n*Bilgisayar Destekli Tasarım\n*Mekatronik Sistemler' },
  { no: 6, date: '06.04.2026', day: 'Pzt', s9_3: 'Kimya', s9_5: 'Mesleki Gelişim', s10_4: 'Demokrasi ve İnsan Hakları', s10_6: '*Nesne Tabanlı Programlama\n*Modelleme Montaj\n*Tasarı Geometri', s11_3: 'Seçmeli Matematik', s11_5: 'Seçmeli Proje Tasarımı ve Uygulamaları' },
  { no: 7, date: '07.04.2026', day: 'Sal', s9_3: 'Peygamberimizin Hayatı', s9_5: '*Programlama Temelleri', s10_4: 'Fizik', s10_6: '*Temel İmalat İşlemleri\n*Sinai Kimya\n*Diksiyon ve Etkili İletişim\n*Sensörler', s11_3: 'Peygamberimizin Hayatı', s11_5: '*Mesleki Yabancı Dil\n*Atölye 11' },
  { no: 8, date: '08.04.2026', day: 'Çar', s9_3: 'Türk Sosyal Hayatında Aile', s9_5: 'Coğrafya', s10_4: 'Kimya', s10_6: 'Ahilik Kültürü ve Girişimcilik', s11_3: 'Seçmeli Coğrafya', s11_5: '*Web Uygulamaları\n*Nicel Analiz' },
  { no: '9a', date: '09.04.2026', day: 'Per', s9_3: 'Din Kültürü ve Ahlak Bilgisi', s9_5: '*Temel Kimya', s10_4: 'Matematik', s10_6: '*Adabı Muaşeret', s11_3: 'Yabancı Dil', s11_5: '*İleri Ofis Prg.\n*Enstrümantal Analiz' },
  { no: '9b', date: '10.04.2026', day: 'Cum', s9_3: 'Biyoloji', s9_5: '*Bilişim Teknolojileri Temelleri', s10_4: 'Türk Dili Edebiyatı', s10_6: '', s11_3: 'Türk Dili Edebiyatı', s11_5: '*Grafik ve Canlandırma' },
];

// Pazartesi/Salı grubu — Pzt ve Sal günlerinde sınava giriyor (gün 1,2,6,7)
const ROWS_12_PT = [
  { no: 1, date: '30.03.2026', day: 'Pzt', d3: 'Türk Dili ve Edebiyatı', d5: '*E-Ticaret' },
  { no: 2, date: '31.03.2026', day: 'Sal', d3: '*Mesleki Matematik\n*Dijital Tasarım\n*Web Uygulamaları', d5: 'Yabancı Dil' },
  { no: 6, date: '06.04.2026', day: 'Pzt', d3: '*Ticaret Hizmetleri\n*Endüstriyel Nicel Analiz', d5: 'Din Kültürü ve Ahlak Bilgisi' },
  { no: 7, date: '07.04.2026', day: 'Sal', d3: 'T.C İnkılap Tarihi ve Atatürkçülük', d5: '*Anorganik Kimya\n*Açık Kay. İşletim Sistemleri' },
];

// Perşembe/Cuma grubu — Per ve Cum günlerinde sınava giriyor (gün 3,4,8,9)
const ROWS_12_PC = [
  { no: 3, date: '02.04.2026', day: 'Per', d3: 'E-Ticaret\n*Mekanizma Çizimleri', d5: '*Endüstriyel Proje\n*Kalıplama Tekniği' },
  { no: 4, date: '03.04.2026', day: 'Cum', d3: 'T.C İnkılap Tarihi ve Atatürkçülük', d5: 'Türk Dili ve Edebiyatı' },
  { no: 8, date: '09.04.2026', day: 'Per', d3: '*Mesleki Matematik\n*İleri PLC', d5: 'Yabancı Dil' },
  { no: 9, date: '10.04.2026', day: 'Cum', d3: 'Din Kültürü ve Ahlak Bilgisi', d5: '*Ticaret Hizmetleri' },
];

const thCls = 'border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-600';
const tdCls = 'border border-slate-200 px-3 py-3';

type SinifFiltre = 'hepsi' | '9' | '10' | '11';

export default function SinavTakvimiTab() {
  const [grup, setGrup] = useState<Grup>('911');
  const [sinifFiltre, setSinifFiltre] = useState<SinifFiltre>('hepsi');

  const show9 = sinifFiltre === 'hepsi' || sinifFiltre === '9';
  const show10 = sinifFiltre === 'hepsi' || sinifFiltre === '10';
  const show11 = sinifFiltre === 'hepsi' || sinifFiltre === '11';
  const colSpanSayisi = (show9 ? 2 : 0) + (show10 ? 2 : 0) + (show11 ? 2 : 0);

  const renderHaftaTablosu = (
    baslik: string,
    rows: typeof ROWS_911,
    _filtre: SinifFiltre,
    s9: boolean, s10: boolean, s11: boolean,
    colSpan: number,
    showTelafi = false,
  ) => (
    <div className="pdf-page bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 flex items-center justify-between">
        <h3 className="text-white font-bold">
          {_filtre === 'hepsi' ? '9 - 10 - 11. Sınıflar' : `${_filtre}. Sınıflar`}
          <span className="ml-2 text-indigo-200 font-normal text-sm">— {baslik}</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className={`${thCls} w-10`}>#</th>
              <th className={`${thCls} w-24`}>Tarih</th>
              {s9 && <th className={`${thCls} text-indigo-700`} colSpan={2}>9. Sınıflar</th>}
              {s10 && <th className={`${thCls} text-emerald-700`} colSpan={2}>10. Sınıflar</th>}
              {s11 && <th className={`${thCls} text-amber-700`} colSpan={2}>11. Sınıflar</th>}
            </tr>
            <tr className="bg-slate-50/50">
              <th className="border border-slate-200" /><th className="border border-slate-200" />
              {s9 && <><th className="border border-slate-200 px-2 py-1 text-xs font-semibold text-indigo-500">3. Ders</th><th className="border border-slate-200 px-2 py-1 text-xs font-semibold text-indigo-500">5. Ders</th></>}
              {s10 && <><th className="border border-slate-200 px-2 py-1 text-xs font-semibold text-emerald-500">4. Ders</th><th className="border border-slate-200 px-2 py-1 text-xs font-semibold text-emerald-500">6. Ders</th></>}
              {s11 && <><th className="border border-slate-200 px-2 py-1 text-xs font-semibold text-amber-500">3. Ders</th><th className="border border-slate-200 px-2 py-1 text-xs font-semibold text-amber-500">5. Ders</th></>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={String(r.no)} className={i % 2 === 1 ? 'bg-slate-50/30' : ''}>
                <td className={`${tdCls} text-center font-bold text-slate-400 text-sm`}>{typeof r.no === 'string' ? r.no.replace('a','').replace('b','') : r.no}</td>
                <td className={`${tdCls} text-center text-sm`}>
                  <span className="font-semibold text-slate-700">{r.date.slice(0,5)}</span>
                  <br /><span className="text-xs text-slate-400">{r.day}</span>
                </td>
                {s9 && <><td className={tdCls}>{dersHucresi(r.s9_3)}</td><td className={tdCls}>{dersHucresi(r.s9_5)}</td></>}
                {s10 && <><td className={tdCls}>{dersHucresi(r.s10_4)}</td><td className={tdCls}>{dersHucresi(r.s10_6)}</td></>}
                {s11 && <><td className={tdCls}>{dersHucresi(r.s11_3)}</td><td className={tdCls}>{dersHucresi(r.s11_5)}</td></>}
              </tr>
            ))}
            {showTelafi && (
              <>
                <tr className="bg-amber-50">
                  <td className={`${tdCls} text-center font-bold text-amber-600 text-sm`}>10</td>
                  <td className={`${tdCls} text-center text-sm font-semibold text-amber-700`}>13.04<br /><span className="text-xs text-slate-400">Pzt</span></td>
                  <td className={`${tdCls} text-center text-sm font-semibold text-amber-600`} colSpan={colSpan}>Telafi Sınavları</td>
                </tr>
                <tr className="bg-amber-50">
                  <td className={`${tdCls} text-center font-bold text-amber-600 text-sm`}>11</td>
                  <td className={`${tdCls} text-center text-sm font-semibold text-amber-700`}>14.04<br /><span className="text-xs text-slate-400">Sal</span></td>
                  <td className={`${tdCls} text-center text-sm font-semibold text-amber-600`} colSpan={colSpan}>Telafi Sınavları</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 print-landscape">
      <div className="text-center no-print">
        <h2 className="text-lg font-bold text-slate-800">Ortak Sınav Takvimi</h2>
        <p className="text-xs text-slate-500">2025-2026 Eğitim Öğretim Yılı — 2. Dönem 1. Ortak Sınav</p>
        <p className="text-xs font-semibold text-indigo-600 mt-0.5">Kemal Atay Mesleki ve Teknik Anadolu Lisesi</p>
      </div>

      <div className="flex justify-center gap-2 no-print">
        {(['911', '12'] as Grup[]).map(g => (
          <button
            key={g}
            onClick={() => setGrup(g)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              grup === g ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {g === '911' ? '9-10-11. Sınıflar' : '12. Sınıflar'}
          </button>
        ))}
      </div>

      {/* ── 9-10-11 ── */}
      {grup === '911' && (
        <div className="space-y-3">
          {/* Sınıf filtresi */}
          <div className="flex justify-center gap-1.5 no-print">
            {([['hepsi', 'Hepsi'], ['9', '9. Sınıf'], ['10', '10. Sınıf'], ['11', '11. Sınıf']] as [SinifFiltre, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSinifFiltre(key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  sinifFiltre === key
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 1. Hafta (Gün 1-5: 30.03 - 03.04) */}
          {renderHaftaTablosu(
            '1. Hafta — 30 Mart - 3 Nisan',
            ROWS_911.slice(0, 5),
            sinifFiltre, show9, show10, show11, colSpanSayisi,
          )}

          {/* 2. Hafta (Gün 6-9 + Telafi: 06.04 - 14.04) */}
          {renderHaftaTablosu(
            '2. Hafta — 6 Nisan - 14 Nisan',
            ROWS_911.slice(5),
            sinifFiltre, show9, show10, show11, colSpanSayisi,
            true, // telafi satırları göster
          )}
        </div>
      )}

      {/* ── 12. Sınıflar ── */}
      {grup === '12' && (
        <div className="space-y-4">
          {[
            { title: 'Pazartesi / Salı Grubu', color: 'from-emerald-500 to-emerald-600', accent: 'text-emerald-700', rows: ROWS_12_PT },
            { title: 'Perşembe / Cuma Grubu', color: 'from-violet-500 to-violet-600', accent: 'text-violet-700', rows: ROWS_12_PC },
          ].map(({ title, color, accent, rows }) => (
            <div key={title} className="pdf-page bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${color} px-6 py-3`}>
                <h3 className="text-white font-bold">12. Sınıflar — {title}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className={`${thCls} w-10`}>#</th>
                      <th className={`${thCls} w-24`}>Tarih</th>
                      <th className={`${thCls} ${accent}`}>3. Ders</th>
                      <th className={`${thCls} ${accent}`}>5. Ders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.no} className={i % 2 === 1 ? 'bg-slate-50/30' : ''}>
                        <td className={`${tdCls} text-center font-bold text-slate-400 text-sm`}>{r.no}</td>
                        <td className={`${tdCls} text-center text-sm`}>
                          <span className="font-semibold text-slate-700">{r.date.slice(0,5)}</span>
                          <br /><span className="text-xs text-slate-400">{r.day}</span>
                        </td>
                        <td className={tdCls}>{dersHucresi(r.d3)}</td>
                        <td className={tdCls}>{dersHucresi(r.d5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-slate-400 pt-2">
        <p>2025-2026 Eğitim Öğretim Yılı — 2. Dönem 1. Ortak Sınav</p>
      </div>
    </div>
  );
}
