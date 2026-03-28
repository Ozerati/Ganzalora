import { useState, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/* ═══════════════════════════════════════════════════════
   BELGECEPTION — Hazır Belge Şablonları Oluşturucu
   MEB ve okul belgeleri için otomatik form doldurma
   ═══════════════════════════════════════════════════════ */

interface Template {
  id: string;
  name: string;
  desc: string;
  category: string;
  emoji: string;
}

const CATEGORIES = [
  { id: 'all', label: 'Tümü', emoji: '📋' },
  { id: 'tutanak', label: 'Tutanaklar', emoji: '📝' },
  { id: 'dilekce', label: 'Dilekçeler', emoji: '✉️' },
  { id: 'form', label: 'Formlar', emoji: '📄' },
  { id: 'plan', label: 'Planlar', emoji: '📅' },
  { id: 'liste', label: 'Listeler', emoji: '📊' },
  { id: 'rapor', label: 'Raporlar', emoji: '📈' },
];

const TEMPLATES: Template[] = [
  // Tutanaklar
  { id: 'zumre-tutanak', name: 'Zümre Toplantı Tutanağı', desc: 'Dönem başı/sonu zümre öğretmenler kurulu toplantı tutanağı', category: 'tutanak', emoji: '👥' },
  { id: 'sube-ogretmenler-tutanak', name: 'Şube Öğretmenler Kurulu Tutanağı', desc: 'Sınıf bazlı öğretmenler kurulu toplantı kararları', category: 'tutanak', emoji: '🏫' },
  { id: 'sinav-degerlendirme', name: 'Sınav Sonuç Değerlendirme Tutanağı', desc: 'Yazılı sınav sonuçları analiz ve değerlendirme formu', category: 'tutanak', emoji: '📊' },
  { id: 'ogrenci-gorusme', name: 'Öğrenci Görüşme Tutanağı', desc: 'Öğrenci ile yapılan bireysel görüşme kaydı', category: 'tutanak', emoji: '🗣️' },
  { id: 'veli-gorusme', name: 'Veli Görüşme Tutanağı', desc: 'Veli ile yapılan yüz yüze/telefon görüşme kaydı', category: 'tutanak', emoji: '👨‍👩‍👧' },
  { id: 'disiplin-tutanak', name: 'Disiplin Olay Tutanağı', desc: 'Olumsuz öğrenci davranışı olay tespit tutanağı', category: 'tutanak', emoji: '⚠️' },
  { id: 'nobet-tutanak', name: 'Nöbet Tutanağı', desc: 'Günlük nöbet devir teslim ve olay tutanağı', category: 'tutanak', emoji: '🔔' },
  { id: 'sinav-kopya-tutanak', name: 'Kopya Tespit Tutanağı', desc: 'Sınav sırasında kopya tespiti halinde düzenlenen tutanak', category: 'tutanak', emoji: '🚫' },

  // Dilekçeler
  { id: 'izin-dilekce', name: 'İzin Dilekçesi', desc: 'Mazeret/yıllık/hastalık izin talep dilekçesi', category: 'dilekce', emoji: '🏖️' },
  { id: 'rapor-dilekce', name: 'Rapor Bildirim Dilekçesi', desc: 'Sağlık raporu bildirim ve ek süre talep dilekçesi', category: 'dilekce', emoji: '🏥' },
  { id: 'tayim-dilekce', name: 'Tayin/Nakil Dilekçesi', desc: 'İl içi/il dışı tayin ve nakil talep dilekçesi', category: 'dilekce', emoji: '🚚' },
  { id: 'gorev-dilekce', name: 'Görevlendirme Dilekçesi', desc: 'Ek ders, kulüp, komisyon görevlendirme talebi', category: 'dilekce', emoji: '📌' },
  { id: 'genel-dilekce', name: 'Genel Amaçlı Dilekçe', desc: 'Her türlü resmi yazışma için boş dilekçe şablonu', category: 'dilekce', emoji: '📝' },

  // Formlar
  { id: 'bep-form', name: 'BEP Formu', desc: 'Bireyselleştirilmiş Eğitim Programı hazırlama formu', category: 'form', emoji: '♿' },
  { id: 'performans-degerlendirme', name: 'Performans Değerlendirme Formu', desc: 'Öğrenci performans ödevi değerlendirme kriterleri', category: 'form', emoji: '⭐' },
  { id: 'proje-degerlendirme', name: 'Proje Değerlendirme Formu', desc: 'Öğrenci proje ödevi değerlendirme rubriği', category: 'form', emoji: '🔬' },
  { id: 'ders-gozlem', name: 'Ders Gözlem Formu', desc: 'Aday öğretmen ders gözlem ve değerlendirme formu', category: 'form', emoji: '👀' },
  { id: 'kurum-gozlem', name: 'Kurum Gözlem Formu', desc: 'Aday öğretmen kurum gözlem raporu formu', category: 'form', emoji: '🏢' },
  { id: 'devamsizlik-form', name: 'Devamsızlık Bildirim Formu', desc: 'Öğrenci devamsızlık takip ve bildirim formu', category: 'form', emoji: '❌' },
  { id: 'etkinlik-onay', name: 'Etkinlik Onay Formu', desc: 'Gezi, etkinlik, yarışma katılım onay formu', category: 'form', emoji: '✅' },
  { id: 'materyal-talep', name: 'Materyal/Araç-Gereç Talep Formu', desc: 'Ders materyali ve araç-gereç talep formu', category: 'form', emoji: '🖊️' },

  // Planlar
  { id: 'yillik-plan', name: 'Yıllık Plan', desc: 'Ders yıllık plan şablonu (ünite/kazanım/tarih)', category: 'plan', emoji: '📅' },
  { id: 'gunluk-plan', name: 'Günlük Ders Planı', desc: 'Günlük ders işleniş planı şablonu', category: 'plan', emoji: '📋' },
  { id: 'telafi-plan', name: 'Telafi Eğitimi Planı', desc: 'Eksik ders telafi eğitimi planı', category: 'plan', emoji: '🔄' },
  { id: 'sosyal-etkinlik', name: 'Sosyal Etkinlik Planı', desc: 'Kulüp/sosyal etkinlik yıllık çalışma planı', category: 'plan', emoji: '🎭' },

  // Listeler
  { id: 'sinif-listesi', name: 'Sınıf Listesi', desc: 'Sınıf mevcudu ve öğrenci bilgileri listesi', category: 'liste', emoji: '👩‍🎓' },
  { id: 'yoklama', name: 'Yoklama Listesi', desc: 'Günlük/haftalık yoklama çizelgesi', category: 'liste', emoji: '✔️' },
  { id: 'not-cizelge', name: 'Not Çizelgesi', desc: 'Yazılı/sözlü/performans not kayıt çizelgesi', category: 'liste', emoji: '💯' },
  { id: 'kitap-okuma', name: 'Kitap Okuma Takip Listesi', desc: 'Öğrenci kitap okuma takip ve değerlendirme listesi', category: 'liste', emoji: '📚' },

  // Raporlar
  { id: 'donem-rapor', name: 'Dönem Sonu Raporu', desc: 'Şube/ders bazlı dönem sonu değerlendirme raporu', category: 'rapor', emoji: '📈' },
  { id: 'basari-analiz', name: 'Başarı Analiz Raporu', desc: 'Sınav/dönem bazlı başarı oranı analiz raporu', category: 'rapor', emoji: '📉' },
  { id: 'rehberlik-rapor', name: 'Rehberlik Hizmetleri Çalışma Raporu', desc: 'Aylık rehberlik hizmetleri sınıf çalışma raporu', category: 'rapor', emoji: '🧭' },
  { id: 'bep-rapor', name: 'BEP Değerlendirme Raporu', desc: 'BEP uygulama sonuçları değerlendirme raporu', category: 'rapor', emoji: '📝' },
];

/* ═══════════════════════════════════════════════════════
   Rehberlik Hizmetleri Çalışma Raporu — Ay Listesi
   ═══════════════════════════════════════════════════════ */
const AYLAR = ['Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'] as const;

/* ═══════════════════════════════════════════════════════
   Rehberlik Raporu — Sınıf Seviyesine Göre Otomatik Veri
   ═══════════════════════════════════════════════════════ */
interface HaftaVeri {
  yeterlilikAlani: string;
  kazanim: string;
  etkinlikOzeti: string;
}

type AyVerisi = [HaftaVeri, HaftaVeri, HaftaVeri, HaftaVeri];
type SinifVerisi = Record<string, AyVerisi>;

const SINIF_VERILERI: Record<number, SinifVerisi> = {
  9: {
    'Eylül': [
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'Okulun yakın çevresini, bölümlerini ve okulda çalışan personeli tanır.', etkinlikOzeti: 'Bu hafta yapılan etkinlikte öğrenciler, okula uyum sürecini kolaylaştırmak amacıyla okulun bölümlerini ve personelini tanıma çalışması yaptılar.' },
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'Eğitim öğretim sürecine ilişkin yönetmeliğin kendisini ilgilendiren kısımları hakkında bilgi edinir.', etkinlikOzeti: 'Bu hafta öğrenciler, Ortaöğretim Kurumları Yönetmeliği\'nin öğrenciyi doğrudan ilgilendiren maddelerini incelediler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'İlgi ve hobilerini ayırt eder.', etkinlikOzeti: 'Bu hafta öğrenciler ilgi alanları ve hobileri üzerine farkındalık kazandılar.' },
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'Okulunun ve sınıfının bir üyesi olduğunu fark eder.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, günlük yaşamda sıkça karşılaştıkları temel duyguları tanıdılar.' },
    ],
    'Ekim': [
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Okul hazırlığına ilişkin sorumluluklarını üstlenir.', etkinlikOzeti: 'Bu hafta öğrenciler, geçmiş yaşantılarında "keşke" demek yerine "iyi ki" diyebilecekleri deneyimlerini paylaştılar.' },
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'Okulun eğitsel imkânları hakkında bilgi edinir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, okul içinde yer alan akademik kulüpler, sosyal etkinlikler ve sportif imkânları araştırdılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Yaşam değerlerinin farkına varır.', etkinlikOzeti: 'Bu hafta öğrenciler kişisel değerlerini keşfettiler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Kendi mesleki değerlerinin farkına varır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, farklı meslek gruplarının gerektirdiği temel değerleri incelediler.' },
    ],
    'Kasım': [
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Güçlü ve gelişime açık yönlerini fark eder.', etkinlikOzeti: 'Bu hafta öğrenciler, kendilerini tanıma etkinliği kapsamında güçlü ve gelişime açık yönlerini belirleme çalışması yaptılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Madde bağımlılığının birey üzerindeki etkilerini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, madde bağımlılığının fiziksel ve psikolojik etkileri konusunda farkındalık çalışması yaptılar.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Etkili ders çalışma yöntemlerini kullanır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, verimli ders çalışma teknikleri ve zaman yönetimi konusunda bilgilendirildiler.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Aile içi iletişim becerilerini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, aile içi sağlıklı iletişim kurma yollarını keşfettiler.' },
    ],
    'Aralık': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Akademik başarısını etkileyen faktörleri analiz eder.', etkinlikOzeti: 'Bu hafta öğrenciler, akademik başarılarını etkileyen bireysel ve çevresel faktörleri analiz ettiler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Meslek alanlarını ve özelliklerini araştırır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, farklı meslek alanlarını ve bu alanların gerekliliklerini araştırdılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Duygularını uygun biçimde ifade eder.', etkinlikOzeti: 'Bu hafta öğrenciler, duygularını tanıma ve uygun şekilde ifade etme becerileri üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Akran baskısıyla başa çıkma stratejileri geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, akran baskısı durumlarını tanıma ve başa çıkma yollarını öğrendiler.' },
    ],
    'Ocak': [
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Sınav kaygısının nedenlerini ve sonuçlarını değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, dönem sonu sınav kaygısıyla başa çıkma stratejileri üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Dönem sonuna yönelik hedeflerini gözden geçirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, birinci dönem hedeflerini gözden geçirip ikinci dönem planlarını oluşturdular.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Stresle başa çıkma yollarını uygular.', etkinlikOzeti: 'Bu hafta öğrenciler, sınav dönemi stresini yönetmek için gevşeme teknikleri öğrendiler.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Toplumsal sorumluluk bilinci geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, topluma katkı sağlama ve gönüllülük kavramları üzerinde çalıştılar.' },
    ],
    'Şubat': [
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'İkinci döneme uyum sürecini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, ikinci dönem başlangıcında motivasyon artırıcı etkinlikler yaptılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Yeteneklerini meslek seçimiyle ilişkilendirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, yetenekleri ile meslek alanları arasındaki bağlantıyı keşfettiler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Öğrenme stilini belirler ve buna uygun çalışma planı yapar.', etkinlikOzeti: 'Bu hafta öğrenciler, kendi öğrenme stillerini keşfederek buna uygun ders çalışma yöntemleri geliştirdiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Özgüven ve özsaygı arasındaki farkı kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, özgüven geliştirme ve özsaygıyı koruma üzerine farkındalık çalışması yaptılar.' },
    ],
    'Mart': [
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'İnternet ve sosyal medya kullanımında güvenlik önlemlerini bilir.', etkinlikOzeti: 'Bu hafta öğrenciler, güvenli internet kullanımı ve siber zorbalıktan korunma yollarını öğrendiler.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Hedef belirleme ve planlama becerilerini geliştirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, kısa ve uzun vadeli hedef belirleme çalışması yaptılar.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Farklılıklara saygı gösterir.', etkinlikOzeti: 'Bu hafta öğrenciler, bireysel ve kültürel farklılıklara saygı konusunda farkındalık kazandılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Girişimcilik kavramını ve önemini açıklar.', etkinlikOzeti: 'Bu hafta öğrenciler, girişimcilik ve yenilikçilik kavramları üzerine etkinlik yaptılar.' },
    ],
    'Nisan': [
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Empati becerisini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, empati kurma ve başkalarının perspektifinden bakma becerisi üzerine çalıştılar.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Motivasyonunu artırıcı stratejiler uygular.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, içsel ve dışsal motivasyon kaynaklarını keşfettiler.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Zorbalık ve şiddetin olumsuz etkilerini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, okul ortamında zorbalığı önleme ve şiddete karşı tutum geliştirme çalışması yaptılar.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Sınavlara hazırlanma stratejileri geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, etkili sınav hazırlık teknikleri ve zaman planlaması üzerinde çalıştılar.' },
    ],
    'Mayıs': [
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Eğitim ve meslek seçimi arasındaki ilişkiyi kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, eğitim sürecinin meslek seçimine etkisini değerlendirdiler.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Toplumsal cinsiyet eşitliğinin önemini kavrar.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, toplumsal cinsiyet eşitliği konusunda farkındalık çalışması yaptılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Problem çözme becerilerini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, günlük yaşamda karşılaştıkları problemlere çözüm üretme becerisi üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Yıl sonu akademik değerlendirme yapar.', etkinlikOzeti: 'Bu hafta öğrenciler, yıl boyunca elde ettikleri akademik kazanımları değerlendirdiler.' },
    ],
    'Haziran': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Yaz dönemi için bireysel gelişim planı hazırlar.', etkinlikOzeti: 'Bu hafta öğrenciler, yaz tatili süresince kendilerini geliştirecek etkinlikler planladılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Yıl boyunca edindiği kariyer bilgilerini özetler.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, yıl boyunca keşfettikleri meslek alanlarını ve kariyer hedeflerini gözden geçirdiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Kişisel gelişim sürecini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, yıl başından bu yana yaşadıkları kişisel gelişimi değerlendirdiler.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Yaz döneminde aile ile kaliteli zaman geçirmenin önemini kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, yaz tatilinde aile ile birlikte yapılabilecek sosyal etkinlikleri planladılar.' },
    ],
  },
  10: {
    'Eylül': [
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'Yeni eğitim öğretim yılına ilişkin beklentilerini ifade eder.', etkinlikOzeti: 'Bu hafta öğrenciler, yeni eğitim yılına dair beklenti ve hedeflerini paylaştılar.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Akademik hedeflerini belirler ve planlar.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, ikinci yıl akademik hedeflerini belirleyip eylem planı oluşturdular.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Kişilik özelliklerini tanır ve kabul eder.', etkinlikOzeti: 'Bu hafta öğrenciler, kişilik envanteri çalışmasıyla güçlü yönlerini keşfettiler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'İlgi alanlarını meslek gruplarıyla eşleştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, ilgi alanları ile meslek grupları arasındaki bağlantıyı araştırdılar.' },
    ],
    'Ekim': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Ders çalışma alışkanlıklarını gözden geçirir.', etkinlikOzeti: 'Bu hafta öğrenciler, mevcut çalışma alışkanlıklarını değerlendirip iyileştirme planı yaptılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Sağlıklı yaşam alışkanlıklarının önemini kavrar.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, fiziksel ve ruhsal sağlığı koruma yollarını öğrendiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Duygu düzenleme becerilerini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, olumsuz duygularla başa çıkma ve duygu düzenleme teknikleri üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Akran ilişkilerinde sağlıklı sınırlar koyar.', etkinlikOzeti: 'Bu hafta öğrenciler, arkadaşlık ilişkilerinde sınır koyma ve hayır diyebilme becerisi üzerinde çalıştılar.' },
    ],
    'Kasım': [
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Meslek seçiminde kişisel değerlerin rolünü fark eder.', etkinlikOzeti: 'Bu hafta öğrenciler, kişisel değerlerinin meslek seçimini nasıl etkilediğini keşfettiler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Not alma ve düzenleme tekniklerini kullanır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, etkili not alma stratejileri ve Cornell yöntemi üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Teknoloji bağımlılığının olumsuz etkilerini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, dijital bağımlılık ve ekran süresi yönetimi konusunda farkındalık kazandılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Karar verme sürecini etkileyen faktörleri analiz eder.', etkinlikOzeti: 'Bu hafta öğrenciler, karar verme süreçlerini ve bu süreci etkileyen iç ve dış faktörleri incelediler.' },
    ],
    'Aralık': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Sınav hazırlığı sürecini planlar.', etkinlikOzeti: 'Bu hafta öğrenciler, dönem sonu sınavlarına yönelik çalışma planı oluşturdular.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Aile içi roller ve sorumluluklar hakkında farkındalık kazanır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, aile içinde üstlendikleri roller ve sorumlulukları değerlendirdiler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Farklı eğitim kademelerini ve sınav sistemlerini tanır.', etkinlikOzeti: 'Bu hafta öğrenciler, Türkiye\'deki yükseköğretim sistemini ve sınav yapısını öğrendiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Öz değerlendirme yapma becerisini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, birinci dönem performanslarını öz değerlendirme formu ile analiz ettiler.' },
    ],
    'Ocak': [
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Dönem sonu motivasyonunu koruma stratejileri uygular.', etkinlikOzeti: 'Bu hafta öğrenciler, dönem sonuna doğru azalan motivasyonu artırma teknikleri üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Stres belirtilerini tanır ve stresle başa çıkma yollarını uygular.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, sınav stresi belirtilerini tanıma ve gevşeme teknikleri öğrendiler.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Birinci dönem hedeflerini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, dönem başında belirledikleri hedeflere ne ölçüde ulaştıklarını değerlendirdiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Olumlu düşünce kalıpları geliştirme çalışması yapar.', etkinlikOzeti: 'Bu hafta öğrenciler, olumsuz düşünce kalıplarını fark edip olumlu alternatifler geliştirme çalışması yaptılar.' },
    ],
    'Şubat': [
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'İkinci dönem hedeflerini belirler.', etkinlikOzeti: 'Bu hafta öğrenciler, ikinci dönem için yeni akademik ve kişisel hedefler belirlediler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Meslek araştırması yapma becerisi kazanır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, ilgi duydukları meslek alanlarını detaylı araştırdılar.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'İletişim engellerini tanır ve aşma yolları geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, etkili iletişimin önündeki engelleri ve bunları aşma yollarını öğrendiler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Grup çalışması ve işbirliği becerilerini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, takım çalışması ve işbirlikçi öğrenme becerileri üzerinde çalıştılar.' },
    ],
    'Mart': [
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Beden imgesi ve özsaygı ilişkisini kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, sağlıklı beden imgesi ve özsaygı arasındaki ilişkiyi keşfettiler.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Proje ve ödev yönetimi becerilerini geliştirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, proje planlama ve zaman yönetimi becerileri üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Çatışma çözme stratejileri geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, kişilerarası çatışmaları yapıcı yollarla çözme stratejileri öğrendiler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: '21. yüzyıl becerilerinin meslek yaşamındaki önemini fark eder.', etkinlikOzeti: 'Bu hafta öğrenciler, eleştirel düşünme, yaratıcılık ve dijital okuryazarlık becerilerini incelediler.' },
    ],
    'Nisan': [
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Toplumsal sorumluluk projeleri hakkında bilgi edinir.', etkinlikOzeti: 'Bu hafta öğrenciler, toplum hizmeti ve sosyal sorumluluk projeleri hakkında farkındalık kazandılar.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Okuma alışkanlığının akademik başarıya etkisini değerlendirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, düzenli okuma alışkanlığının öğrenmeye katkısını tartıştılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Ergenlik dönemine özgü duyguları tanır.', etkinlikOzeti: 'Bu hafta öğrenciler, ergenlik döneminde yaşanan duygusal değişimleri fark etme çalışması yaptılar.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Sınav stratejileri ve dikkat artırma tekniklerini uygular.', etkinlikOzeti: 'Bu hafta öğrenciler, sınav anında dikkat ve odaklanma artırma teknikleri üzerinde çalıştılar.' },
    ],
    'Mayıs': [
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Gelecekte sahip olmak istediği mesleği araştırır.', etkinlikOzeti: 'Bu hafta öğrenciler, hayallerindeki meslek hakkında detaylı bilgi toplama çalışması yaptılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Sağlıklı beslenme ve uyku düzeninin önemini kavrar.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, sağlıklı yaşam alışkanlıkları ve uyku hijyeni konusunu işlediler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Olumlu kişilerarası ilişkiler kurma becerisi geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, sağlıklı ilişki kurma ve sürdürme becerileri üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Yıl sonu akademik performansını analiz eder.', etkinlikOzeti: 'Bu hafta öğrenciler, yıl boyunca akademik gelişimlerini analiz edip ikinci yıl için çıkarımlar yaptılar.' },
    ],
    'Haziran': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Yaz dönemi gelişim planı oluşturur.', etkinlikOzeti: 'Bu hafta öğrenciler, yaz tatilinde akademik ve kişisel gelişimlerini sürdürecek planlar yaptılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Alan ve meslek tercihlerini gözden geçirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, gelecek yılın alan seçimi için bilgi toplama çalışması yaptılar.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Yaz döneminde sosyal sorumluluk etkinliklerine katılmayı planlar.', etkinlikOzeti: 'Bu hafta öğrenciler, yaz tatilinde katılabilecekleri sosyal sorumluluk etkinliklerini araştırdılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Yıl boyunca elde ettiği kişisel kazanımları değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, kişisel gelişim süreçlerini değerlendirip yaz dönemi hedeflerini belirlediler.' },
    ],
  },
  11: {
    'Eylül': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Üst öğretim kurumlarının özelliklerini araştırır.', etkinlikOzeti: 'Bu hafta öğrenciler, üniversite bölümleri ve programları hakkında bilgi edinme çalışması yaptılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Kariyer planlamasının aşamalarını öğrenir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, kariyer planlama sürecinin adımlarını ve önemini keşfettiler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Etkili zaman yönetimi stratejileri uygular.', etkinlikOzeti: 'Bu hafta öğrenciler, akademik ve sosyal yaşam dengesini sağlamak için zaman yönetimi çalışması yaptılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Bireysel farklılıkların kariyer seçimine etkisini kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, kişilik özellikleri ve yeteneklerin meslek seçimini nasıl etkilediğini incelediler.' },
    ],
    'Ekim': [
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Tercih sürecinde dikkat edilmesi gerekenleri bilir.', etkinlikOzeti: 'Bu hafta öğrenciler, üniversite tercih sürecinde önemli noktaları ve puan türlerini öğrendiler.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Ruh sağlığını koruma yollarını değerlendirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, ruhsal sağlığı koruma ve profesyonel yardım alma sürecini öğrendiler.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'YKS sınav sistemini ve puan türlerini tanır.', etkinlikOzeti: 'Bu hafta öğrenciler, YKS sınav sistemi, puan türleri ve bölüm-puan ilişkisini incelediler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Sınav kaygısı ile başa çıkma yollarını öğrenir.', etkinlikOzeti: 'Bu hafta öğrenciler, sınav kaygısını azaltmak için bilişsel ve davranışsal stratejiler geliştirdiler.' },
    ],
    'Kasım': [
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Duygusal zeka becerilerini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, duygusal zeka bileşenlerini tanıma ve geliştirme çalışması yaptılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'İş dünyasının beklentilerini araştırır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, iş dünyasının mezunlardan beklediği temel yetkinlikleri araştırdılar.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Deneme sınavı sonuçlarını analiz eder ve hedef belirler.', etkinlikOzeti: 'Bu hafta öğrenciler, deneme sınavı sonuçlarını analiz edip gelişim alanlarını belirlediler.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Aile desteğinin kariyer sürecindeki rolünü kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, kariyer planlama sürecinde aile iletişiminin önemini değerlendirdiler.' },
    ],
    'Aralık': [
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Dönem sonu performansını değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, birinci dönem akademik performanslarını analiz edip iyileştirme planı oluşturdular.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Sağlıklı başa çıkma mekanizmaları geliştirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, stres ve baskı dönemlerinde sağlıklı başa çıkma yollarını öğrendiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Gelecek kaygısıyla başa çıkma stratejileri geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, gelecek belirsizliği ile başa çıkma ve olumlu bakış açısı geliştirme çalışması yaptılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Üniversite tanıtım etkinliklerini takip eder.', etkinlikOzeti: 'Bu hafta öğrenciler, üniversitelerin tanıtım günleri ve açık kapı etkinlikleri hakkında bilgi topladılar.' },
    ],
    'Ocak': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Sınav dönemi çalışma programı oluşturur.', etkinlikOzeti: 'Bu hafta öğrenciler, dönem sonu sınavlarına yönelik sistematik çalışma programı hazırladılar.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Başarısızlık korkusuyla başa çıkma stratejileri geliştirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, başarısızlık korkusunun kaynaklarını ve başa çıkma yollarını keşfettiler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Birinci dönem kazanımlarını gözden geçirir.', etkinlikOzeti: 'Bu hafta öğrenciler, birinci dönemdeki akademik kazanımlarını ve eksik kalan konuları belirlediler.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Aile içi beklenti farklılıklarını yönetir.', etkinlikOzeti: 'Bu hafta öğrenciler, aile beklentileri ile kişisel hedefler arasındaki dengeyi kurma çalışması yaptılar.' },
    ],
    'Şubat': [
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Meslek tanıtım etkinliklerine katılır.', etkinlikOzeti: 'Bu hafta öğrenciler, farklı meslek dallarından profesyonellerin deneyimlerini dinlediler.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'İkinci dönem akademik hedeflerini revize eder.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, birinci dönem sonuçlarına göre ikinci dönem hedeflerini güncellediler.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Dijital ayak izinin kariyer üzerindeki etkisini kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, sosyal medya kullanımının gelecekteki kariyer fırsatlarına etkisini değerlendirdiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Öz yeterlilik algısını güçlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, öz yeterlilik inancının akademik ve mesleki başarıya etkisini incelediler.' },
    ],
    'Mart': [
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Eleştirel düşünme becerilerini geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, eleştirel düşünme ve analitik yaklaşım geliştirme çalışması yaptılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Meslek seçiminde toplumsal ihtiyaçları göz önünde bulundurur.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, toplumun ihtiyaç duyduğu meslek alanlarını araştırdılar.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Deneme sınavlarından maksimum fayda sağlama stratejileri geliştirir.', etkinlikOzeti: 'Bu hafta öğrenciler, deneme sınavı analizi ve hata çalışması yapma becerisi üzerinde çalıştılar.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Toplumsal değişim ve mesleklere etkisini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, teknolojik gelişmelerin meslek dünyasına etkisini ve yeni meslek alanlarını incelediler.' },
    ],
    'Nisan': [
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Motivasyon kaynaklarını keşfeder ve sürdürür.', etkinlikOzeti: 'Bu hafta öğrenciler, içsel motivasyonlarını keşfedip akademik süreçte nasıl sürdüreceklerini planladılar.' },
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'İş güvenliği ve çalışan hakları hakkında bilgi edinir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, iş güvenliği mevzuatı ve temel çalışan hakları konusunda bilgilendirildiler.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Staj ve gönüllülük deneyimlerinin kariyer gelişimine katkısını kavrar.', etkinlikOzeti: 'Bu hafta öğrenciler, staj ve gönüllülük deneyimlerinin özgeçmişe ve kariyer gelişimine etkisini öğrendiler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Yıl sonu sınavlarına hazırlanma planı yapar.', etkinlikOzeti: 'Bu hafta öğrenciler, yıl sonu sınavlarına yönelik kapsamlı bir çalışma planı hazırladılar.' },
    ],
    'Mayıs': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Son sınıfa hazırlık stratejileri belirler.', etkinlikOzeti: 'Bu hafta öğrenciler, 12. sınıfa geçiş sürecinde akademik hazırlık stratejilerini planladılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Üniversite ve meslek tercih listesi oluşturmaya başlar.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, olası üniversite ve bölüm tercihlerini araştırıp ön liste oluşturdular.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Yılsonunda kişisel gelişim envanteri çıkarır.', etkinlikOzeti: 'Bu hafta öğrenciler, yıl boyunca edindikleri kişisel kazanımları envanter şeklinde değerlendirdiler.' },
      { yeterlilikAlani: 'Aile ve Toplum', kazanim: 'Mezuniyet sonrası aile ve toplum beklentilerini değerlendirir.', etkinlikOzeti: 'Bu hafta öğrenciler, mezuniyet sonrası aile ve toplum beklentileri ile kendi planları arasındaki uyumu tartıştılar.' },
    ],
    'Haziran': [
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Yaz döneminde YKS hazırlık planı oluşturur.', etkinlikOzeti: 'Bu hafta öğrenciler, yaz tatilinde YKS hazırlık sürecini planlama çalışması yaptılar.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Yaz döneminde meslek deneyimi edinme fırsatlarını araştırır.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, yaz döneminde staj ve meslek tanıma fırsatlarını araştırdılar.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: '12. sınıf hedeflerini ve beklentilerini belirler.', etkinlikOzeti: 'Bu hafta öğrenciler, son sınıf için akademik hedeflerini ve beklentilerini netleştirdiler.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Yıl sonu genel değerlendirme yapar.', etkinlikOzeti: 'Bu hafta öğrenciler, tüm yıl boyunca yaşadıkları gelişimi ve kazanımları değerlendirdiler.' },
    ],
  },
  12: {
    'Eylül': [
      { yeterlilikAlani: 'Benlik farkındalığı', kazanim: 'Sahip olduğu karakter güçlerini zorluklar karşısında kullanır.', etkinlikOzeti: '12. sınıflarda rehberlik etkinlikleri kapsamında, ilk hafta sosyal duygusal gelişim alanında bir etkinlik gerçekleştirildi. Etkinliğin amacı, öğrencilerin karşılaştıkları zorluklar karşısında sahip oldukları karakter güçlerini kullanma becerilerini geliştirmekti. Öğrencilere, yaşadıkları zorluklar sırasında nasıl tutumlar sergiledikleri sorularak etkinlik başlatıldı. Ayrıca, bu zorluklar karşısında güçlü hissetmelerini sağlayan özelliklerin neler olduğu üzerine düşünmeleri teşvik edildi. Bu paylaşımların ardından, her öğrenci bir örnek olay içeren kuradan bir kart çekti. Öğrencilere, çektikleri olayları çözmek için hangi karakter güçlerini nasıl kullanabileceklerini düşünmeleri ve bunu kağıda yazmaları istendi. Öğrenciler çalışmaları tamamladıktan sonra, gönüllü olarak çözüm önerilerini sınıfla paylaştılar. Aynı olayın farklı karakter güçleriyle nasıl çözülebileceği üzerine sınıfça tartışmalar yapıldı. Son olarak, karakter güçlerinin önemi ve bunların nasıl geliştirilebileceği konusunda bilgi verilerek etkinlik sonlandırıldı.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Okula hazırlıklı gelme ile akademik gelişimi arasında bağ kurar.', etkinlikOzeti: '12. sınıflarda ikinci hafta rehberlik etkinliği kapsamında, akademik gelişim alanında öğrencilerin derse hazırlıklı gelmenin başarıya katkısını fark etmeleri amaçlandı. Etkinlik, 30 dakikalık süre içinde gerçekleştirildi. Öğrencilere, mesleki alanlarıyla ilgili senaryolar canlandırmaları için yönergeler verildi. Örneğin, bir teknisyen olarak işe başlamadan önce hazırlık yapma ya da bir tamir görevi öncesi malzemeleri hazırlama gibi durumlar canlandırıldı. Ardından, öğrencilere derse gelmeden önce ne tür hazırlıklar yapabilecekleri soruldu ve gönüllü öğrencilerin cevapları tahtaya yazıldı. Derse hazırlıklı gelmenin, konuları daha iyi anlamalarına ve başarılarını artırmalarına nasıl katkı sağladığı üzerine tartışmalar yapıldı. Etkinlik sonunda, öğrencilerden bir hafta boyunca hazırlık yaparak derse gelmeleri istendi ve etkinlik sona erdirildi.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Zamanını ihtiyaçları ve sorumlulukları çerçevesinde planlar.', etkinlikOzeti: '12. sınıflarda üçüncü hafta rehberlik etkinliği kapsamında, akademik gelişim alanında zaman yönetimi ve planlama üzerine bir etkinlik gerçekleştirildi. Etkinliğin amacı, öğrencilerin sorumluluklarını ve ihtiyaçlarını göz önünde bulundurarak zamanı nasıl planlayacaklarını öğrenmelerini sağlamaktı. Etkinlik başında öğrencilere "Zamanı planlamak ne demektir?" sorusu yöneltildi ve verilen cevaplar tahtaya yazıldı. Ardından, öğrencilere zaman yönetimi hakkında bir hikâye okundu ve bu hikâye üzerinden tartışmalar yapıldı. Etkinlik boyunca, öğrencilere zaman yönetiminde kullanabilecekleri çeşitli teknikler anlatıldı. Pomodoro Tekniği, kısa çalışma ve mola döngüleriyle verimliliği artırmayı hedeflerken, Eisenhower Matrisi ile görevlerin önem ve aciliyetine göre önceliklendirilmesi üzerine duruldu. Bu matriste görevler "önemli ve acil," "önemli ama acil değil," "acil ama önemsiz," ve "ne acil ne de önemli" olarak sınıflandırıldı. Etkinliğin devamında, öğrencilerden kendi zamanlarını nasıl geçirdiklerini düşünmeleri ve yazmaları istendi. Gönüllü öğrenciler, planlamaları ve zaman yönetimiyle ilgili paylaşımlar yaptı. Son olarak, etkinlik zamanı verimli kullanmanın önemi vurgulanarak sona erdirildi.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Zamanını, ihtiyaçları ve sorumlulukları çerçevesinde planlar.', etkinlikOzeti: '12. sınıflarda dördüncü hafta rehberlik etkinliği kapsamında, akademik gelişim alanında zaman yönetimi ve planlama becerilerini geliştirmeye yönelik bir çalışma gerçekleştirildi. Etkinliğin amacı, öğrencilerin zamanlarını ihtiyaçlarına ve sorumluluklarına uygun şekilde planlayarak akademik başarılarını artırmalarını sağlamaktı. Etkinlik başında öğrencilere George Patton\'un "Bugün uygulamaya geçirilen iyi bir plan, yarın uygulanacak mükemmel bir plandan daha iyidir." sözü paylaşıldı ve bu söz üzerinde tartışmalar yapıldı. Ardından, öğrencilerden bir hafta boyunca yaptıkları aktiviteleri ve bu aktiviteler için harcadıkları süreleri gözden geçirmeleri istendi. Öğrenciler, çalışma yaprakları doldurarak günlük aktivitelerini değerlendirdiler ve hangi alanlarda zamanlarını daha verimli kullanabileceklerini belirlediler. Gönüllü öğrenciler, kendi zaman planlamalarıyla ilgili düşüncelerini ve geliştirdikleri stratejileri sınıfla paylaştılar. Zaman yönetimi konusunda yapılan bu tartışmalar sonucunda, etkinlik öğrencilerin kendi planlarını gözden geçirmeleri ve geliştirmeleri yönünde teşvik edilerek sona erdirildi.' },
    ],
    'Ekim': [
      { yeterlilikAlani: 'Kişisel Güvenliğini Sağlama', kazanim: 'Bilişim teknolojileri kullanımı konusunda kendini değerlendirir.', etkinlikOzeti: 'Beşinci hafta rehberlik etkinliği kapsamında öğrenciler, bilişim teknolojilerindeki riskleri ve güvenli kullanım yöntemlerini değerlendirdi. 6 kişilik sınıfta her öğrenci bireysel çalışma yapraklarıyla farklı kategoriler (oyun, sosyal medya, mesajlaşma vb.) üzerinde çalıştı. Bulgularını sınıfla paylaştılar ve şu sorular tartışıldı: -Bilişim teknolojilerini güvenli kullanıyor musunuz? -Daha güvenli hale getirmek için neler yapabilirsiniz? -Siber dünyada karşılaşılabilecek tehlikeler nelerdir? Etkinlik, öğrencilerden gelecek hafta güvenlik tedbirleri üzerine araştırma yapmalarının istenmesiyle tamamlandı.' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Kendi bedenine ilişkin olumlu tutum geliştirir.', etkinlikOzeti: 'Altıncı hafta rehberlik etkinliği kapsamında, öğrencilerin kendi bedenleriyle ilgili olumlu farkındalık geliştirmelerine yönelik bir çalışma gerçekleştirildi. Etkinlik, öğrencilerden kendilerini bir arkadaşına tarif eder gibi fiziksel ve karakteristik özelliklerini tanımlamaları istenerek başlatıldı. Daha sonra, öğrenciler olumlu gördükleri özelliklerini yazdıktan sonra, hoşnut olmadıkları özelliklerin hangi durumlarda avantaj sağlayabileceği üzerine düşündüler ve paylaşımlar yaptılar. Etkinlik sırasında, öğrencilerden "Kendinizle ilgili olumlu farkındalıklar geliştirmek için neler yapabilirsiniz?" ve "Özelliklerinize daha farklı bir açıdan bakmak size ne kazandırabilir?" gibi sorulara yanıt vermeleri istendi. Çalışma, olumlu bir benlik algısının geliştirilmesinin önemi vurgulanarak sonlandırıldı.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Üst öğrenim kurumlarına geçiş sınavlarına hazırlanmak ve başarılı olmak için stratejiler geliştirir.', etkinlikOzeti: 'Yedinci hafta rehberlik etkinliği kapsamında, öğrencilerin üst öğrenim kurumlarına geçiş sınavlarına hazırlık sürecinde etkili stratejiler geliştirmelerine yönelik bir çalışma yapıldı. Etkinlik başlangıcında, "Hedeflerinize ulaşmak için nasıl bir strateji geliştirmelisiniz?" sorusu sınıfa yöneltildi ve öğrencilerin düşüncelerini paylaşmaları sağlandı. Öğrencilere dağıtılan çalışma yaprakları üzerinde sınav sürecinde kullanılabilecek hedef belirleme, zaman planlama ve öğrenme stratejileri yer aldı. Öğrencilerden bu stratejiler doğrultusunda kendi planlarını değerlendirmeleri ve geliştirmeleri istendi. Çalışma sırasında, "Hangi stratejiler sizi daha etkili kılabilir?" ve "Hedeflerinize ulaşmak için hangi konularda kendinizi geliştirmelisiniz?" gibi sorular tartışılarak etkinlik zenginleştirildi. Etkinlik, öğrencilerin geliştirdikleri stratejileri paylaşmaları ve kendi hedeflerine yönelik planlarını gözden geçirmeleriyle tamamlandı.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Zamanını, ihtiyaçları ve sorumlulukları çerçevesinde planlar.', etkinlikOzeti: 'Bu hafta, öğrencilerin akademik başarılarını artırmak için derse hazırlıklı gelmenin önemine odaklanan bir etkinlik gerçekleştirildi. Etkinlik, öğrencilerin günlük hayatta çeşitli durumlara nasıl hazırlandıklarını düşünmeleriyle başladı. Ardından, "Derse hazırlıklı gelmek size hangi avantajları sağlar?" ve "Hazırlık yapmadığınızda ne gibi zorluklarla karşılaşıyorsunuz?" gibi sorular sınıf içinde tartışıldı. Etkinlik sonunda öğrencilerden, bir hafta boyunca derse hazırlıklı gelerek deneyimlerini gözlemlemeleri ve fark ettikleri değişimleri not almaları istendi. Çalışma, akademik başarı ile hazırlık arasındaki ilişkinin vurgulanmasıyla tamamlandı.' },
    ],
    'Kasım': [
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'Kariyer planlama sürecinde kişisel özelliklerini kullanır.', etkinlikOzeti: 'Bu hafta, öğrencilerin kariyer planlama sürecinde kişisel özelliklerini nasıl kullanabileceklerini anlamalarına yönelik bir etkinlik gerçekleştirildi. Etkinlikte, "Kariyer planlama nedir?" sorusu ile öğrencilerin fikirleri alındı ve kariyer planlamanın kişisel özelliklerle bağlantısı üzerinde duruldu. Çalışma yaprakları aracılığıyla öğrenciler, kendi güçlü ve geliştirilmesi gereken yönlerini belirledi ve bu özelliklerin kariyer hedeflerine etkisini değerlendirdi. Çalışma, kariyer hedeflerine ulaşmak için kişisel özelliklerin öneminin vurgulanmasıyla tamamlandı.' },
      { yeterlilikAlani: '-', kazanim: '-', etkinlikOzeti: 'ARA TATİL' },
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'Ortaöğretim sonrası kariyer tercihleri ile ilgili yardım alabileceği kaynaklara başvurur.', etkinlikOzeti: 'Bu hafta, öğrencilerin ortaöğretim sonrası kariyer planlamalarında faydalanabilecekleri kaynaklara erişimlerini kolaylaştırmak amacıyla bir etkinlik düzenlendi. Etkinlik, öğrencilerin kariyer hedeflerini belirlemeleri ve bu hedeflere ulaşma sürecinde hangi kaynaklardan yardım alabileceklerini öğrenmeleri üzerine odaklandı. Etkinliğe, öğrencilere "Kariyer hedeflerinize ulaşırken hangi kaynaklara ihtiyaç duyarsınız?" sorusu yöneltilerek başlandı. Ardından, öğrenciler kariyer planlamasında rehberlik edebilecek kitaplar, internet kaynakları, mesleki rehberlik servisleri ve deneyimli kişilerden alınacak tavsiyeler gibi olasılıkları tartıştılar. Çalışma sonunda her grup, belirledikleri kaynakları ve bu kaynakların nasıl kullanılabileceğini sınıfla paylaştı. Etkinlik, öğrencilerin farklı bakış açılarını görmesi ve kariyer planlama sürecinde bilinçli tercihler yapmasının önemi vurgulanarak tamamlandı.' },
      { yeterlilikAlani: 'Kişiler Arası Beceriler', kazanim: 'Kültürel farklılıklara duyarlı bakış açısı geliştirir.', etkinlikOzeti: 'Bu hafta, öğrencilerin farklı kültürlere karşı duyarlılıklarını artırmaya yönelik bir etkinlik düzenlendi. Etkinlik, "İçinde yaşadığımız toplumda ne gibi kültürel farklılıklar gözlemliyorsunuz?" sorusuyla başladı. Öğrenciler, yaşadıkları çevredeki farklılıkları tanımladı ve bu farklılıkların nasıl zenginlik olarak değerlendirilebileceğini tartıştı. Etkinlikte, farklı bir kültüre taşınma durumu hayal edilerek karşılaşılabilecek zorluklar ve bu zorluklarla başa çıkma yolları üzerinde duruldu. Çalışma, öğrencilerin bu duyarlılığın toplumsal birlik ve empati açısından önemini fark etmeleriyle sonlandırıldı.' },
    ],
    'Aralık': [
      { yeterlilikAlani: 'Kişiler Arası Beceriler', kazanim: 'Kültürel farklılıklara duyarlı davranışlar sergiler.', etkinlikOzeti: 'Bu hafta, öğrencilerin kültürel farklılıklara duyarlılığını artırmayı amaçlayan bir etkinlik düzenlendi. Etkinlikte, bir kalemlikte bulunan farklı renkte ve özellikteki kalemler kullanılarak, bu kalemlerin dünya üzerindeki insanlar gibi farklılıklar barındırdığı vurgulandı. Kalemler üzerinden yapılan bu metaforla, kültürel farklılıkların çeşitliliğe ve zenginliğe nasıl katkı sağladığı üzerinde duruldu. Etkinlik sırasında, öğrencilerden kültürel farklılıklara karşı duyarlılıklarını değerlendirmeleri ve bu konuda geliştirebilecekleri davranışları belirlemeleri istendi. Çalışma yaprakları yardımıyla öğrenciler, duyarlı davranışlarını ve bu alandaki geliştirilmesi gereken yönlerini yazdılar. Tartışmalar ve değerlendirmeler, kültürel farklılıklara duyarlılığın toplumsal birlik ve empati için önemiyle tamamlandı.' },
      { yeterlilikAlani: 'Kişiler Arası Beceriler', kazanim: 'Adil olma ve tarafsızlık becerisini fark eder.', etkinlikOzeti: 'Bu hafta, "Okuldaki Terazi" başlıklı bir etkinlik gerçekleştirildi. Etkinlik, öğrencilerin adil olma ve tarafsızlık kavramları üzerine düşünmelerini sağlamayı amaçladı. Başlangıçta, adalet ve tarafsızlığın günlük yaşamda nasıl yer aldığına dair kısa bir tartışma yapıldı. Daha sonra öğrencilere, bir okul ortamında karşılaşılabilecek adaletle ilgili durumlar içeren senaryolar sunuldu.  Her öğrenci, verilen bir senaryoda nasıl adil ve tarafsız davranılabileceğini belirtti ve kendi çözümlerini sınıfla paylaştı. Etkinlik sonunda, adil davranışın bireyler ve topluluklar üzerindeki olumlu etkileri vurgulanarak, öğrencilerin adaletin önemini fark etmeleri sağlandı. Çalışma, öğrencilerin adalet kavramını kendi hayatlarına uygulamaları için teşvik edilmesiyle tamamlandı.' },
      { yeterlilikAlani: 'Karar Verme', kazanim: 'Yaşam amaçlarıyla ilgili eylem planını gözden geçirir.', etkinlikOzeti: 'Bu hafta "Yeni Yollar" başlıklı etkinlikte, öğrenciler yaşam amaçlarını gözden geçirme ve bu amaçlara ulaşmak için eylem planları oluşturma üzerine çalıştı. Etkinlikte, yaşam amaçları ve değerleri kavramları tartışıldı. Öğrencilere, yaşam amaçlarının birden fazla yolla gerçekleştirilebileceği, bu yolların kişisel özellikler ve çevresel koşullarla şekillendiği vurgulandı. Öğrenciler, dağıtılan çalışma yapraklarında kendi yaşam amaçlarını belirleyip bu amaçlara ulaşmak için kısa ve uzun vadeli planlar yaptı. Çalışma sırasında öğrenciler, planlarını ikili gruplar halinde değerlendirerek birbirlerine geri bildirimde bulundu. Ardından, planlarını güncelleyerek hedeflerine ulaşma yolları üzerine tartışma gerçekleştirdiler. Etkinlik, eylem planlarının esnekliği ve yaşam hedeflerine ulaşmada bireysel farklılıkların önemiyle ilgili bir değerlendirme yapılmasıyla tamamlandı.' },
      { yeterlilikAlani: 'Duyguları Anlama ve Yönetme', kazanim: 'Yaşadığı yoğun duyguları yönetir.', etkinlikOzeti: 'Bu hafta, "Ben, Duygum, Düşüncem" başlıklı etkinlikte öğrencilerin yoğun duyguları tanıma ve bu duyguları yönetme becerileri geliştirilmiştir. Etkinlikte, öğrencilerden üniversite sınavına hazırlık sürecinde karşılaşabilecekleri örnek durumlar içeren kutudan bir senaryo seçmeleri istendi. Seçilen senaryolar üzerine tartışılarak bu süreçte hissedilebilecek yoğun duyguların neler olabileceği, bu duyguların nasıl fark edilip yönetilebileceği üzerinde duruldu. Her öğrenci, seçtiği senaryodaki duyguların düzenlenmesine yönelik bireysel çözüm önerileri sunarak deneyimlerini paylaştı. Grup çalışmasıyla zenginleştirilen etkinlik, duygu düzenlemenin akademik ve sosyal yaşam üzerindeki etkisinin vurgulanmasıyla tamamlandı.' },
    ],
    'Ocak': [
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'Öz geçmiş yazar', etkinlikOzeti: 'Bu hafta, "Özgeçmişim 1" başlıklı etkinlikte, öğrencilerin etkili bir özgeçmiş hazırlama becerilerini geliştirmelerine yönelik bir çalışma gerçekleştirildi. Etkinlikte, özgeçmişin önemi, iş veya staj başvurularında nasıl kullanılacağı ve içermesi gereken temel bilgiler tartışıldı. Öğrencilere, kendi bilgilerini içeren bir özgeçmiş taslağı hazırlamaları için rehberlik edildi. Çalışma yaprakları ile temel bölümler (kişisel bilgiler, eğitim durumu, beceriler, deneyimler vb.) örneklerle açıklanarak, her öğrencinin bu bölümleri doldurması sağlandı. Etkinlik sırasında öğrenciler, özgeçmişlerinde vurgulanması gereken güçlü yönlerini belirleyerek geri bildirim aldılar. Çalışma, etkili bir özgeçmişin profesyonel hayattaki öneminin vurgulanmasıyla tamamlandı.' },
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'Öz geçmiş yazar', etkinlikOzeti: 'Bu hafta, öğrencilerin geçen hafta yazdıkları özgeçmiş taslaklarını değerlendirmelerine ve düzenlemelerine yönelik bir etkinlik gerçekleştirildi. Öğrencilerden, hazırladıkları özgeçmişlerdeki bilgileri detaylandırmaları, eksiklikleri tamamlamaları ve yazım hatalarını düzeltmeleri istendi. Etkinlik sırasında, özgeçmişte yer alması gereken temel bölümler (kişisel bilgiler, eğitim geçmişi, iş ve staj deneyimleri, beceriler, referanslar) bir kez daha gözden geçirildi. Uygulayıcı rehberliğinde, güçlü yönlerin nasıl vurgulanacağı ve bilgilerin doğru sıralanması konusunda örnekler sunuldu. Öğrenciler, özgeçmişlerini arkadaşlarıyla paylaşarak geri bildirim aldı ve düzenlemelerini bu doğrultuda tamamladı. Çalışma, profesyonel ve etkili bir özgeçmişin öneminin vurgulanmasıyla sonlandırıldı' },
      { yeterlilikAlani: '-', kazanim: '-', etkinlikOzeti: 'KARNE GÜNÜ' },
      { yeterlilikAlani: '-', kazanim: '-', etkinlikOzeti: 'ARA TATİLİ' },
    ],
    'Şubat': [
      { yeterlilikAlani: 'Duyguları Anlama ve Yönetme', kazanim: 'Stres yaratan kaynakları fark eder', etkinlikOzeti: 'Bu hafta yapılan etkinlikte öğrenciler, sınav sürecinde yaşadıkları kaygıları ve bu kaygılarla nasıl baş ettiklerini değerlendirdi. Etkinlikte öğrenciler sınav öncesi ve sınav anında karşılaştıkları duygularını paylaştı; kaygı düzeylerini azaltmak için uyguladıkları yöntemleri sınıf ortamında tartıştılar. Farklı baş etme stratejileri üzerinde durularak, etkili ve sağlıklı yöntemlerin önemi vurgulandı. Etkinlik, öğrencilerin sınav kaygısını yönetme konusunda farkındalık kazanmalarıyla tamamlandı.' },
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'İş görüşme becerilerini açıklar.', etkinlikOzeti: 'Bu hafta yapılan etkinlikte, öğrenciler mezuniyet sonrası iş yaşamında karşılaşabilecekleri süreçleri değerlendirdi. İş başvurusu, işe alım süreçleri, çalışma ortamı ve iş yaşamındaki sorumluluklar üzerine grup çalışmaları yapıldı. Öğrenciler, iş yaşamına geçiş sürecinde karşılaşabilecekleri zorluklara karşı nasıl hazırlık yapabilecekleri konusunda çözüm önerileri geliştirdiler. Etkinlik, iş yaşamına geçişte hazırlıklı olmanın önemi vurgulanarak tamamlandı.' },
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'İş görüşme becerilerini kullanır.', etkinlikOzeti: 'Bu hafta, öğrencilerin iş görüşmelerine hazırlık sürecine yönelik bir etkinlik yapıldı. Mülakat öncesinde dikkat edilmesi gereken hazırlıklar, görüşme sırasında sergilenecek iletişim becerileri ve mülakat sonrasında yapılması gerekenler üzerine bilgi verildi. Öğrenciler örnek mülakat soruları üzerinden uygulamalı çalışmalar yaparak, mülakat pratiği gerçekleştirdiler. Etkinlik, iş görüşmesinde başarılı olmanın planlı ve hazırlıklı olmaya bağlı olduğu vurgulanarak sonlandırıldı.' },
      { yeterlilikAlani: 'Kişiler Arası Beceriler', kazanim: 'Toplum için gönüllü çalışmada duyarlı davranır.', etkinlikOzeti: 'Bu hafta yapılan etkinlikte, öğrenciler gönüllülük kavramını ve gönüllü çalışmalara katılmanın bireysel ve toplumsal faydalarını tartıştılar. Gönüllülük yoluyla sosyal sorumluluk bilincinin gelişeceği, topluma katkı sağlanacağı ve kişisel gelişimin destekleneceği vurgulandı. Öğrenciler kendi ilgi alanlarına uygun gönüllülük faaliyetlerini belirleyerek, katılabilecekleri projeleri paylaştılar. Etkinlik, gönüllülük faaliyetlerinin öneminin altı çizilerek tamamlandı.' },
    ],
    'Mart': [
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Karakter güçleri ile iyi oluş arasında bağ kurar.', etkinlikOzeti: 'Bu hafta öğrencilerle, mutluluğun bireylerin kendi karakter güçleriyle yakından ilişkili olduğu üzerinde duruldu. Öğrenciler, sahip oldukları karakter güçlerini belirleyip bu özelliklerin kendi mutluluklarını nasıl artırabileceğini değerlendirdiler. Karakter güçlerini günlük yaşamda kullanma örnekleri tartışılarak, kişisel farkındalığın ve güçlü yönlerin öneminin vurgulandığı etkinlik tamamlandı.' },
      { yeterlilikAlani: 'Duyguları Anlama ve Yönetme', kazanim: 'İyi oluşunu destekleyen duyguları yaşamında sıklıkla deneyimler.', etkinlikOzeti: 'Bu haftaki etkinlikte, öğrencilerin duygularını tanıma, isimlendirme ve ifade etme becerilerini geliştirmelerine yönelik çalışmalar yapıldı. Öğrenciler, farklı durumlarda hissettikleri duyguları alfabetik bir sırayla listeleyip paylaştılar ve bu duyguların sebepleri ve sonuçları üzerine düşündüler. Etkinlik, duyguların doğru şekilde ifade edilmesinin önemi vurgulanarak tamamlandı.' },
      { yeterlilikAlani: 'Kariyer Farkındalığı', kazanim: 'Mesleki bilgi kaynaklarını kullanır.', etkinlikOzeti: 'Bu hafta öğrencilerle ilgilendikleri mesleklerle ilgili doğru bilgi kaynaklarını kullanma becerileri üzerine bir çalışma yapıldı. Öğrenciler çeşitli mesleklerle ilgili araştırma yaparak, bu meslekleri icra eden kişilerden veya güvenilir kaynaklardan doğrudan bilgi edinmenin yollarını keşfettiler. Etkinlik, meslek seçiminde doğru kaynaklara ulaşmanın öneminin vurgulanmasıyla tamamlandı.' },
      { yeterlilikAlani: 'Kariyer Hazırlığı', kazanim: 'Seçmeyi düşündüğü meslekler ile ilgili kariyer planlaması yapar.', etkinlikOzeti: 'Bu hafta gerçekleştirilen etkinlikte, öğrencilerin kişisel özellikleri ile çeşitli mesleklerin gerektirdiği nitelikler arasında bağlantı kurmaları sağlandı. Öğrenciler kendi yeteneklerini ve ilgilerini değerlendirdikten sonra bu özelliklerin hangi mesleklerle örtüştüğünü analiz ettiler. Etkinlik, doğru kariyer seçiminde kişisel özellikleri tanımanın ve dikkate almanın önemi vurgulanarak tamamlandı.' },
    ],
    'Nisan': [
      { yeterlilikAlani: '', kazanim: '', etkinlikOzeti: 'ARA TATİL' },
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'Meslek seçiminde karar verme becerisini kullanır.', etkinlikOzeti: 'Bu hafta öğrenciler, kariyer kararlarını oluşturma sürecini başlattılar. Karar verme sürecindeki kişisel özellikleri, ilgileri ve yeteneklerini değerlendirerek uygun seçenekleri belirlemeye çalıştılar. Öğrenciler karar verme aşamalarını tartışarak, bu sürecin bilinçli ve sistematik yürütülmesinin önemini kavradılar' },
      { yeterlilikAlani: 'Kariyer Planlama', kazanim: 'Üst öğretim kurumuna ya da iş yaşamına ilişkin kariyer kararını verir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, üst öğretim kurumlarına ya da iş yaşamına ilişkin nihai kariyer kararlarını gözden geçirdiler. Aldıkları kararları netleştirip, bu kararlarından ne kadar emin olduklarını değerlendirdiler. Kararları hakkında sınıfla paylaşım yaparak, aldıkları geri bildirimlerle kendi kararlarının sağlamasını yaptılar' },
      { yeterlilikAlani: 'Benlik Farkındalığı', kazanim: 'Değişim ve belirsizlikle baş eder.', etkinlikOzeti: 'Bu haftaki çalışmada, öğrencilerin hayatlarındaki değişim ve belirsizlik durumlarıyla nasıl baş ettikleri ele alındı. Öğrenciler kendi hayatlarında yaşadıkları belirsizlikleri ifade ederek, bilişsel ve duygusal başa çıkma yöntemlerini tartıştılar. Etkinlik, belirsizlik ve değişime karşı kullanılan etkili yöntemlerin önemini vurgulayan paylaşımlarla tamamlandı.' },
    ],
    'Mayıs': [
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Sınava ilişkin yoğun duygularını yönetir.', etkinlikOzeti: 'Bu hafta öğrenciler, yaklaşan sınavlarla ilgili yoğun duygularını tanımlayıp yönetmeyi öğrendiler. Öğrencilere ani sınav durumları canlandırılarak bu anlarda hissettikleri duyguları fark etmeleri sağlandı. Yoğun duygularla baş etme yöntemleri üzerine yapılan paylaşımlarla etkinlik tamamlandı.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Sınavlara ilişkin yoğun duygularını yönetir.', etkinlikOzeti: 'Bu hafta gerçekleştirilen etkinlikte öğrenciler, sınavlarla ilgili yoğun kaygılarını tanıyıp kontrol etme yöntemlerini tartıştılar. Çeşitli sınav durumlarını canlandırarak hissettikleri duyguları ve bu duygularla nasıl baş edebileceklerini uygulamalı olarak değerlendirdiler. Etkinlik, sınav kaygısını yönetmenin önemini vurgulayarak tamamlandı.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Öğrenmenin hayat boyu devam ettiğine inanır.', etkinlikOzeti: 'Bu hafta yapılan etkinlikte öğrenciler yaşam boyu öğrenmenin önemini değerlendirdi. Öğrenciler, gelecekteki yaşamlarında öğrenmeye devam edecekleri konuları tartışarak, öğrenmenin hayat boyu süren bir süreç olduğunu ve bireyin gelişimine sağladığı katkıları fark ettiler.' },
      { yeterlilikAlani: 'Eğitsel Planlama ve Başarı', kazanim: 'Üst öğretim kurumlarına geçiş sınavlarıyla ilgili bilgi edinir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, üst öğretim kurumlarına geçiş sınavları hakkında bilgi edindiler. Öğrenciler sınav süreci, sınav türleri, yerleştirme koşulları ve sınav sonrası değerlendirme gibi konularda ayrıntılı bilgi topladı ve edindikleri bilgileri grup halinde paylaştı. Etkinlik, öğrencilerin sınav süreçleri hakkında bilinçlenmelerini sağlayarak tamamlandı.' },
    ],
    'Haziran': [
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'Bir üst öğrenim kurumuna ilişkin ön bilgiler edinir.', etkinlikOzeti: 'Bu hafta öğrenciler, mezuniyet sonrası kariyer planlarını değerlendirdi. Üniversite ya da iş hayatına geçiş sürecinde karşılaşabilecekleri değişimleri, yeni sorumlulukları ve duyguları hakkında düşünerek planlarını gözden geçirdiler. Etkinlik, öğrencilerin mezuniyet sonrasında ne beklediklerini daha iyi anlamalarını sağladı.' },
      { yeterlilikAlani: 'Okula ve Okulun Çevresine Uyum', kazanim: 'Bir üst öğretim kurumuna ve iş yaşamına geçiş sürecine yönelik duygu ve düşüncelerini ifade eder.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, üniversiteye veya iş yaşamına geçiş süreçlerindeki duygu ve düşüncelerini dile getirdiler. Öğrenciler, bu yeni dönemle ilgili heyecanlarını, kaygılarını ve beklentilerini paylaştılar ve bu süreçte kendilerini daha iyi anlamalarına olanak tanıyacak tartışmalar gerçekleştirdiler.' },
      { yeterlilikAlani: 'Akademik Anlayış ve Sorumluluk', kazanim: 'Eğitim öğretim hayatının kendisine kattıklarını değerlendirir.', etkinlikOzeti: 'Bu haftaki etkinlikte öğrenciler, eğitim hayatları boyunca edindikleri bilgileri ve deneyimleri gözden geçirdiler. İlkokuldan liseye kadar olan öğrenim süreçlerinde edindikleri becerileri, bilgileri ve anıları hatırlayıp değerlendirdiler. Etkinlik, öğrencilerin eğitim yolculuklarının kendilerine kattığı değerlerin farkına varmalarını sağlayarak tamamlandı.' },
      { yeterlilikAlani: '', kazanim: '', etkinlikOzeti: 'KARNE GÜNÜ' },
    ],
  },
};

// Rapor tarihi: ayın son günü
function getAyinSonGunu(ay: string, yil: number): string {
  const ayIndex: Record<string, number> = {
    'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11,
    'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
  };
  const mi = ayIndex[ay];
  if (mi === undefined) return '';
  const actualYear = mi >= 8 ? yil : yil + 1; // Eylül-Aralık ilk yıl, Ocak-Haziran ikinci yıl
  const lastDay = new Date(actualYear, mi + 1, 0).getDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(lastDay)}.${pad(mi + 1)}.${actualYear}`;
}

// Hafta tarihleri: her ayın haftalarını yaklaşık olarak üret
function getHaftaTarihleri(ay: string, yil: number): string[] {
  const ayIndex: Record<string, number> = {
    'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11,
    'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
  };
  const mi = ayIndex[ay];
  if (mi === undefined) return ['', '', '', ''];
  const actualYear = mi >= 8 ? yil : yil + 1;
  const sonGun = new Date(actualYear, mi + 1, 0).getDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  const hafta1 = `01-07 ${ay} ${actualYear}`;
  const hafta2 = `08-14 ${ay} ${actualYear}`;
  const hafta3 = `15-21 ${ay} ${actualYear}`;
  const hafta4 = `22-${pad(sonGun)} ${ay} ${actualYear}`;
  return [hafta1, hafta2, hafta3, hafta4];
}

function RehberlikRaporForm({ onBack }: { onBack: () => void }) {
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Sadece 3 input
  const [sinifSube, setSinifSube] = useState('');
  const [ogretmenAdi, setOgretmenAdi] = useState('');
  const [kiz, setKiz] = useState('');
  const [erkek, setErkek] = useState('');

  // Sabitler
  const egitimYili = '2025-2026';
  const okulAdi = 'Kemal Atay Mesleki ve Teknik Anadolu Lisesi';

  // Sınıf seviyesini parse et
  const sinifSeviyesi = parseInt(sinifSube.split('/')[0]) || 9;
  const toplam = (kiz && erkek) ? Number(kiz) + Number(erkek) : 0;

  // Sınıf seviyesine göre veri al (fallback: 9)
  const veriSeti = SINIF_VERILERI[sinifSeviyesi] || SINIF_VERILERI[9];

  const handlePdfDownload = async () => {
    setPdfLoading(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      for (let i = 0; i < AYLAR.length; i++) {
        const el = pageRefs.current[i];
        if (!el) continue;
        // Temporarily make visible for capture
        el.style.display = 'block';
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
        el.style.display = '';
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) doc.addPage();
        const imgW = pageW - 10;
        const imgH = (canvas.height / canvas.width) * imgW;
        doc.addImage(imgData, 'PNG', 5, 5, imgW, Math.min(imgH, pageH - 10));
      }
      doc.save(`Rehberlik_Raporu_${sinifSube.replace('/', '-')}_${egitimYili}.pdf`);
    } catch (err) {
      console.error('PDF oluşturma hatası:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:border-rose-400 focus:ring-rose-100';
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1';

  // Render a single month page
  const renderPage = (ayIdx: number, forPdf: boolean) => {
    const ay = AYLAR[ayIdx];
    const raporNo = ayIdx + 1;
    const raporTarihi = getAyinSonGunu(ay, 2025);
    const haftaTarihleri = getHaftaTarihleri(ay, 2025);
    const ayVerisi = veriSeti[ay] || veriSeti['Eylül'];

    return (
      <div
        key={ay}
        ref={el => { if (forPdf) pageRefs.current[ayIdx] = el; }}
        className="bg-white shadow-lg mx-auto"
        style={{
          width: '210mm',
          height: '297mm',
          padding: '8mm 10mm',
          fontFamily: 'Times New Roman, serif',
          fontSize: '8pt',
          display: forPdf ? 'none' : undefined,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', border: '1.5px solid #000' }}>
          <tbody>
            {/* R0: Eğitim yılı + Okul adı */}
            <tr style={{ height: '20px' }}>
              <td colSpan={5} style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>
                {egitimYili} EĞİTİM VE ÖĞRETİM YILI {okulAdi.toUpperCase()}
              </td>
            </tr>
            {/* R1: Rapor başlığı */}
            <tr style={{ height: '20px' }}>
              <td colSpan={5} style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>
                REHBERLİK HİZMETLERİ {sinifSube.toUpperCase() || '___'} SINIFI {ay.toUpperCase()} AYI ÇALIŞMA RAPORU
              </td>
            </tr>
            {/* R2: Sınıf Öğretmeni | Ad | Rapor No | No | Rapor Tarihi | Tarih */}
            <tr style={{ height: '18px' }}>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontWeight: 'bold', fontSize: '7.5pt', width: '4%' }}>SINIF ÖĞRETMENİ</td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt', width: '12%' }}>{ogretmenAdi || 'Öğretmen Adı'}</td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt', width: '10%' }}><strong>RAPOR NO</strong>&nbsp;&nbsp;{raporNo}</td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontWeight: 'bold', fontSize: '7.5pt', width: '8%' }}>RAPOR TARİHİ</td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt', width: '10%' }}>{raporTarihi}</td>
            </tr>
            {/* R3: Sınıf | Mevcud */}
            <tr style={{ height: '18px' }}>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt' }}><strong>SINIF</strong>&nbsp;&nbsp;{sinifSube || '___'}</td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt' }}><strong>SINIF MEVCUDU</strong></td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt' }}><strong>KIZ</strong>&nbsp;&nbsp;{kiz || '—'}&nbsp;&nbsp;&nbsp;<strong>ERKEK</strong>&nbsp;&nbsp;{erkek || '—'}</td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt' }}><strong>TOPLAM</strong></td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7.5pt', textAlign: 'center' }}>{toplam || '—'}</td>
            </tr>
            {/* R4: SIRA | TARİH | ETKİNLİK ÇALIŞMALARI */}
            <tr style={{ height: '18px' }}>
              <td style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '7.5pt', width: '4%' }}>SIRA</td>
              <td style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '7.5pt', width: '8%' }}>TARİH</td>
              <td colSpan={3} style={{ border: '1px solid #000', padding: '2px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '7.5pt' }}>ETKİNLİK ÇALIŞMALARI</td>
            </tr>
            {/* 4 Hafta — her hafta 3 satır */}
            {ayVerisi.map((hafta: HaftaVeri, idx: number) => (
              <>
                {/* Yeterlilik Alanı — dar satır */}
                <tr key={`${idx}-ya`} style={{ height: '16px' }}>
                  <td rowSpan={3} style={{ border: '1px solid #000', padding: '1px 3px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle', fontSize: '9pt', width: '4%' }}>{idx + 1}</td>
                  <td rowSpan={3} style={{ border: '1px solid #000', padding: '1px 3px', textAlign: 'center', verticalAlign: 'middle', fontSize: '7pt', width: '8%' }}>{haftaTarihleri[idx]}</td>
                  <td style={{ border: '1px solid #000', padding: '1px 4px', fontWeight: 'bold', fontSize: '6.5pt', width: '10%', whiteSpace: 'nowrap', color: '#c00' }}>YETERLİLİK ALANI</td>
                  <td colSpan={2} style={{ border: '1px solid #000', padding: '1px 4px', fontSize: '7.5pt' }}>{hafta.yeterlilikAlani}</td>
                </tr>
                {/* Kazanım — dar satır */}
                <tr key={`${idx}-k`} style={{ height: '16px' }}>
                  <td style={{ border: '1px solid #000', padding: '1px 4px', fontWeight: 'bold', fontSize: '6.5pt', color: '#c00' }}>KAZANIM</td>
                  <td colSpan={2} style={{ border: '1px solid #000', padding: '1px 4px', fontSize: '7.5pt' }}>{hafta.kazanim}</td>
                </tr>
                {/* Etkinlik Özeti — BÜYÜK alan */}
                <tr key={`${idx}-e`}>
                  <td style={{ border: '1px solid #000', padding: '2px 4px', fontWeight: 'bold', fontSize: '6.5pt', verticalAlign: 'top', color: '#c00' }}>ETKİNLİĞİN ADI VE KISA ÖZETİ</td>
                  <td colSpan={2} style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '7pt', lineHeight: 1.35, verticalAlign: 'top' }}>{hafta.etkinlikOzeti}</td>
                </tr>
              </>
            ))}
            {/* İmza satırı */}
            <tr style={{ height: '50px' }}>
              <td colSpan={2} style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', verticalAlign: 'bottom' }}>
                <div style={{ fontWeight: 'bold', fontSize: '8pt' }}>Sınıf Öğretmeni</div>
                <div style={{ fontSize: '7pt', marginTop: '2px' }}>{ogretmenAdi || 'Öğretmen Adı'}</div>
              </td>
              <td colSpan={3} style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', verticalAlign: 'bottom' }}>
                <div style={{ fontWeight: 'bold', fontSize: '8pt' }}>Okul Müdürü</div>
                <div style={{ fontSize: '7pt', marginTop: '2px' }}>................................</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm mb-6 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        Geri
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">🧭</span>
          <h2 className="text-xl font-bold text-slate-800">Rehberlik Hizmetleri Çalışma Raporu</h2>
          <p className="text-sm text-slate-500 mt-1">Sadece 3 bilgi girin, 10 aylık rapor otomatik oluşsun</p>
        </div>

        {/* ── 3 Input ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className={labelCls}>Sınıf / Şube</label>
            <input type="text" value={sinifSube} onChange={e => setSinifSube(e.target.value)} placeholder="12/B" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Öğretmen Adı</label>
            <input type="text" value={ogretmenAdi} onChange={e => setOgretmenAdi(e.target.value)} placeholder="Öğretmen Adı" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kız Sayısı</label>
            <input type="number" value={kiz} onChange={e => setKiz(e.target.value)} placeholder="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Erkek Sayısı</label>
            <input type="number" value={erkek} onChange={e => setErkek(e.target.value)} placeholder="0" className={inputCls} />
          </div>
        </div>

        {/* Toplam gösterimi */}
        {(kiz || erkek) && (
          <div className="mb-6 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
              Toplam Mevcud: {toplam}
            </span>
          </div>
        )}

        {/* ── Butonlar ── */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button type="button" onClick={handlePdfDownload} disabled={pdfLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {pdfLoading ? 'PDF Oluşturuluyor...' : 'PDF İndir (10 Sayfa)'}
          </button>
        </div>

        {/* ── Sayfa Gezinme ── */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition disabled:opacity-30"
          >
            Önceki Ay
          </button>
          <span className="text-sm font-bold text-slate-700">
            {AYLAR[currentPage]} ({currentPage + 1}/10)
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.min(9, p + 1))}
            disabled={currentPage === 9}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition disabled:opacity-30"
          >
            Sonraki Ay
          </button>
        </div>

        {/* ── Önizleme: Mevcut Sayfa ── */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          {renderPage(currentPage, false)}
        </div>

        {/* ── PDF için gizli sayfalar ── */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          {AYLAR.map((_, idx) => renderPage(idx, true))}
        </div>
      </div>
    </div>
  );
}

export default function Belgeception() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filtered = TEMPLATES.filter(t => {
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categoryCount = (catId: string) => catId === 'all' ? TEMPLATES.length : TEMPLATES.filter(t => t.category === catId).length;

  /* ── Rehberlik Raporu özel formu ── */
  if (selectedTemplate === 'rehberlik-rapor') {
    return <RehberlikRaporForm onBack={() => setSelectedTemplate(null)} />;
  }

  /* ── Diğer şablonlar: yakında eklenecek placeholder ── */
  if (selectedTemplate) {
    const tmpl = TEMPLATES.find(t => t.id === selectedTemplate);
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button type="button" onClick={() => setSelectedTemplate(null)} className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm mb-6 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
          Geri
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <span className="text-4xl mb-3 block">{tmpl?.emoji}</span>
            <h2 className="text-xl font-bold text-slate-800">{tmpl?.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{tmpl?.desc}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-amber-700 text-sm font-medium">Bu şablon yakında eklenecek</p>
            <p className="text-amber-600 text-xs mt-1">Form alanları ve PDF çıktısı üzerinde çalışılıyor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Belgeception</h1>
        <p className="text-slate-500 text-sm mt-1">Hazır belge şablonları — doldurun ve indirin</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Belge ara... (tutanak, dilekçe, form...)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:border-rose-400 focus:ring-rose-100"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-100'
            }`}>{categoryCount(cat.id)}</span>
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tmpl => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => setSelectedTemplate(tmpl.id)}
            className="group text-left bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-rose-200 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5">{tmpl.emoji}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors truncate">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {CATEGORIES.find(c => c.id === tmpl.category)?.label}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">Sonuç bulunamadı</p>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-8">
        {TEMPLATES.length} belge şablonu
      </p>
    </div>
  );
}
