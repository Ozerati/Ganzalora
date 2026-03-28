import React from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { loadExamBuilderState, saveExamBuilderState } from '../../../lib/portfolioFirestore';
import type { ExamBuilderState } from '../../../lib/portfolioFirestore';
import type { ExamSection, TeacherSlot, GroupMap, PersonCard } from './exam';
import questionBank from '../data/examQuestionBank.json';
import {
  GROUP_LETTERS_12, GROUP_LETTERS_10, GROUP_LETTERS_9,
  GROUP_COLORS_12, GROUP_COLORS_9,
  getTypeLabel, gid, emptySection, calcPoints,
  ANSWER_KEYS_9, ANSWER_KEYS_10, ANSWER_KEYS,
  makeGroupA, makeGroupB, makeGroupC, makeGroupD, makeGroupE, makeGroupT,
  makeGroupA_sample, makeGroupB_sample, makeGroupC_sample, makeGroupD_sample,
  makeGroup10A, makeGroup10B, makeGroup10T, makeGroup10A_sample,
  makeGroup9A, makeGroup9B, makeGroup9T, makeGroup9C,
  makeGroup9A_sample, makeGroup9B_sample,
  ExamPage, RichText, ChevLeft, ChevRight,
} from './exam';


/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ExamBuilder({ onClose }: { onClose: () => void }) {
  const [gradeLevel, setGradeLevel] = React.useState<'9' | '10' | '11' | '12'>('12');
  const GROUP_LETTERS = gradeLevel === '12' ? GROUP_LETTERS_12 : gradeLevel === '10' ? GROUP_LETTERS_10 : GROUP_LETTERS_9;
  const GROUP_COLORS = gradeLevel === '12' ? GROUP_COLORS_12 : GROUP_COLORS_9;
  const BEP_GROUP = gradeLevel === '12' ? 'E' : 'C';

  const [groups, setGroups] = React.useState<GroupMap>(() => ({
    A: makeGroupA(),
    B: makeGroupB(),
    C: makeGroupC(),
    D: makeGroupD(),
    E: makeGroupE(),
    T: makeGroupT(),
  }));
  const [activeGroup, setActiveGroup] = React.useState('A');
  const [activeSectionIdx, setActiveSectionIdx] = React.useState(0);
  const [schoolName, setSchoolName] = React.useState('Kemal Atay Vocational and Technical Anatolian High School');
  const [examTitle, setExamTitle] = React.useState('12th Grade 2nd Term 1st Written Exam');
  const [isSampleMode, setIsSampleMode] = React.useState(false);

  const handleGradeChange = (grade: '9' | '10' | '11' | '12') => {
    if (grade === gradeLevel) return;
    setGradeLevel(grade);
    setActiveGroup('A');
    setActiveSectionIdx(0);
    setShowLargePreview(false);
    setIsSampleMode(false);
    if (grade === '9') {
      setGroups({ A: makeGroup9A(), B: makeGroup9B(), C: makeGroup9C(), T: makeGroup9T(), 'Ö': makeGroup9A_sample() });
      setExamTitle('9th Grade 2nd Term 1st Written Exam');
    } else if (grade === '10') {
      setGroups({ A: makeGroup10A(), B: makeGroup10B(), T: makeGroup10T(), 'Ö': makeGroup10A_sample() });
      setExamTitle('10th Grades 2st Term 1st Exam');
    } else if (grade === '11') {
      setGroups({ A: makeGroup9A(), B: makeGroup9B() }); // placeholder — 11. sınıf grupları eklenecek
      setExamTitle('11th Grade 2nd Term 1st Written Exam');
    } else {
      setGroups({ A: makeGroupA(), B: makeGroupB(), C: makeGroupC(), D: makeGroupD(), E: makeGroupE(), T: makeGroupT(), 'Ö': makeGroupA_sample() });
      setExamTitle('12th Grade 2nd Term 1st Written Exam');
    }
  };

  const toggleSampleMode = () => {
    const next = !isSampleMode;
    setIsSampleMode(next);
    setActiveGroup(next ? 'Ö' : 'A');
    setActiveSectionIdx(0);
    if (next) {
      if (gradeLevel === '9') {
        setGroups({ 'Ö': makeGroup9A_sample() });
        setExamTitle('ÖRNEK SINAV');
      } else if (gradeLevel === '10') {
        setGroups({ 'Ö': makeGroup10A_sample() });
        setExamTitle('ÖRNEK SINAV');
      } else {
        setGroups({ 'Ö': makeGroupA_sample() });
        setExamTitle('ÖRNEK SINAV');
      }
    } else {
      if (gradeLevel === '9') {
        setGroups({ A: makeGroup9A(), B: makeGroup9B(), C: makeGroup9C(), T: makeGroup9T(), 'Ö': makeGroup9A_sample() });
        setExamTitle('9th Grade 2nd Term 1st Written Exam');
      } else if (gradeLevel === '10') {
        setGroups({ A: makeGroup10A(), B: makeGroup10B(), T: makeGroup10T(), 'Ö': makeGroup10A_sample() });
        setExamTitle('10th Grades 2st Term 1st Exam');
      } else {
        setGroups({ A: makeGroupA(), B: makeGroupB(), C: makeGroupC(), D: makeGroupD(), E: makeGroupE(), T: makeGroupT(), 'Ö': makeGroupA_sample() });
        setExamTitle('12th Grade 2nd Term 1st Written Exam');
      }
    }
  };
  const [academicYear, setAcademicYear] = React.useState('2025-2026');
  const [teachers, setTeachers] = React.useState<TeacherSlot[]>([
    { name: 'Atalay ÖZER', title: 'İngilizce Öğretmeni' },
    { name: 'Hüseyin GÜNGÖR', title: 'İngilizce Öğretmeni' },
    { name: 'Ahenk Durdu GÖK', title: 'İngilizce Öğretmeni' },
    { name: 'Ayşegül ŞENDUR APARİ', title: 'İngilizce Öğretmeni' },
    { name: 'Ersin YILMAZ', title: 'Okul Müdürü' },
  ]);
  const [showBank, setShowBank] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showLayoutTuner, setShowLayoutTuner] = React.useState(false);
  const [grayscalePdf, setGrayscalePdf] = React.useState(false);

  const [layout, setLayout] = React.useState({
    topMargin: 14,
    sideMargin: 15,
    groupLetterSize: 48,
    schoolNameSize: 10.5,
    examTitleSize: 10,
    gapTitleToLine: 20,
    gapLineToInfo: 6,
    studentInfoSize: 11,
    underlineGap: 4,
    gapInfoToSection: 12,
    sectionHeaderSize: 9.5,
    gapHeaderToContent: 1,
    bodyTextSize: 8.5,
    questionSize: 8.5,
    gapBetweenQuestions: 5,
    gapBetweenSections: 2,
    imageRatio: 0.45,
    footerFromBottom: 20,
    footerNameSize: 9,
    footerTitleSize: 7.5,
  });
  const setL = (key: string, val: number) => setLayout((p) => ({ ...p, [key]: val }));

  const [showAiPrompt, setShowAiPrompt] = React.useState(false);
  const [showFullPreview, setShowFullPreview] = React.useState(false);
  const [previewWidth, setPreviewWidth] = React.useState(480);
  const [showLargePreview, setShowLargePreview] = React.useState(false);
  const resizeRef = React.useRef({ dragging: false, startX: 0, startW: 480 });
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState('');
  const GEMINI_KEY = 'AIzaSyATrrtsNBiYCdtItSdrEgexMtHFFUZ8Tp0';

  const [examSyncing, setExamSyncing] = React.useState(false);
  const [examSaveText, setExamSaveText] = React.useState('');

  // Firestore'dan yükle (mount)
  React.useEffect(() => {
    let cancelled = false;
    setExamSyncing(true);
    loadExamBuilderState().then((result) => {
      if (cancelled || !result) { setExamSyncing(false); return; }
      const s = result.state;
      setGradeLevel(s.gradeLevel);
      setGroups(s.groups as GroupMap);
      setSchoolName(s.schoolName);
      setExamTitle(s.examTitle);
      setAcademicYear(s.academicYear);
      setTeachers(s.teachers);
      setLayout(s.layout as typeof layout);
      setGrayscalePdf(s.grayscalePdf);
      setIsSampleMode(s.isSampleMode);
      setActiveGroup(Object.keys(s.groups)[0] || 'A');
      setActiveSectionIdx(0);
      setExamSaveText(`Son kayıt: ${new Date(result.lastSaved).toLocaleString('tr-TR')}`);
      setExamSyncing(false);
    }).catch(() => { if (!cancelled) setExamSyncing(false); });
    return () => { cancelled = true; };
  }, []);

  // Firestore'a kaydet
  const saveExamToFirestore = React.useCallback(async () => {
    setExamSyncing(true);
    try {
      const state: ExamBuilderState = {
        gradeLevel, groups, schoolName, examTitle, academicYear,
        teachers, layout, grayscalePdf, isSampleMode,
      };
      const savedAt = await saveExamBuilderState(state);
      setExamSaveText(`Kaydedildi: ${new Date(savedAt).toLocaleString('tr-TR')}`);
    } catch (err) {
      console.warn('[ExamBuilder] Firestore save failed', err);
      setExamSaveText('Kaydetme hatası!');
    } finally {
      setExamSyncing(false);
    }
  }, [gradeLevel, groups, schoolName, examTitle, academicYear, teachers, layout, grayscalePdf, isSampleMode]);

  /* ─── Refs for A4 pages ─── */
  const page1Ref = React.useRef<HTMLDivElement>(null!);
  const page2Ref = React.useRef<HTMLDivElement>(null!);

  const sections = groups[activeGroup];
  const section = sections[activeSectionIdx];
  const totalPoints = sections.reduce((s, sec) => s + calcPoints(sec.scoring), 0);
  const groupIdx = GROUP_LETTERS.indexOf(activeGroup);
  const gc = GROUP_COLORS[activeGroup];

  const updateSection = (updates: Partial<ExamSection>) => {
    setGroups((prev) => {
      const next = { ...prev };
      next[activeGroup] = prev[activeGroup].map((s, i) => (i === activeSectionIdx ? { ...s, ...updates } : s));
      return next;
    });
  };
  const addItem = () => updateSection({ items: [...section.items, ''] });
  const updateItem = (idx: number, val: string) => updateSection({ items: section.items.map((it, i) => (i === idx ? val : it)) });
  const removeItem = (idx: number) => { if (section.items.length > 1) updateSection({ items: section.items.filter((_, i) => i !== idx) }); };
  const addSection = () => {
    setGroups((prev) => { const next = { ...prev }; next[activeGroup] = [...prev[activeGroup], emptySection(prev[activeGroup].length + 1)]; return next; });
    setActiveSectionIdx(sections.length);
  };
  const removeSection = (idx: number) => {
    if (sections.length <= 1) return;
    setGroups((prev) => { const next = { ...prev }; next[activeGroup] = prev[activeGroup].filter((_, i) => i !== idx).map((s, i) => ({ ...s, label: String(i + 1) })); return next; });
    setActiveSectionIdx((p) => Math.min(p, sections.length - 2));
  };
  const loadFromBank = (q: typeof questionBank.questions[0]) => {
    updateSection({ type: q.type, scoring: q.scoring, instruction: q.instruction, passage: q.passage, items: [...q.items] });
    setShowBank(false);
  };
  const updateTeacher = (idx: number, field: 'name' | 'title', val: string) => {
    setTeachers((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: val } : t)));
  };
  const prevGroup = () => { if (groupIdx > 0) { setActiveGroup(GROUP_LETTERS[groupIdx - 1]); setActiveSectionIdx(0); } };
  const nextGroup = () => { if (groupIdx < GROUP_LETTERS.length - 1) { setActiveGroup(GROUP_LETTERS[groupIdx + 1]); setActiveSectionIdx(0); } };

  /* ─── AI Image Generator ─── */
  const generateImage = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: aiPrompt }],
            parameters: { sampleCount: 1, aspectRatio: '16:9' },
          }),
        },
      );
      if (!res.ok) {
        const res2 = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Generate an image: ${aiPrompt}. Make it suitable for an exam paper, clean design, educational style.` }] }],
              generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
            }),
          },
        );
        if (!res2.ok) throw new Error(`API hata: ${res2.status}`);
        const data2 = await res2.json();
        const parts = data2?.candidates?.[0]?.content?.parts || [];
        const imgPart = parts.find((p: any) => p.inlineData);
        if (!imgPart) throw new Error('Gorsel uretilemedi');
        const byteChars = atob(imgPart.inlineData.data);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
        const blob = new Blob([byteArr], { type: imgPart.inlineData.mimeType });
        const blobUrl = URL.createObjectURL(blob);
        updateSection({ imageUrl: blobUrl });
        setShowAiPrompt(false);
        setAiPrompt('');
      } else {
        const data = await res.json();
        const b64img = data?.predictions?.[0]?.bytesBase64Encoded;
        if (!b64img) throw new Error('Gorsel uretilemedi');
        const byteChars = atob(b64img);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
        const blob = new Blob([byteArr], { type: 'image/png' });
        const blobUrl = URL.createObjectURL(blob);
        updateSection({ imageUrl: blobUrl });
        setShowAiPrompt(false);
        setAiPrompt('');
      }
    } catch (err: any) {
      setAiError(err.message || 'Bir hata olustu');
    } finally {
      setAiLoading(false);
    }
  };

  /* ═══ PDF Export via html2canvas-pro ═══ */
  const exportPdf = async (singleGroup?: string) => {
    const toExport = singleGroup ? [singleGroup] : GROUP_LETTERS;

    // We need a temporary off-screen container to render each group's pages
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.zIndex = '-1';
    document.body.appendChild(container);

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pw = 210;
    const ph = 297;
    let firstPage = true;

    for (const gl of toExport) {
      const secs = groups[gl];

      // Render page 1
      const p1 = document.createElement('div');
      container.appendChild(p1);
      const p1Root = document.createElement('div');
      p1.appendChild(p1Root);

      // Render page 2
      const p2 = document.createElement('div');
      container.appendChild(p2);
      const p2Root = document.createElement('div');
      p2.appendChild(p2Root);

      // Use ReactDOM to render
      const { createRoot } = await import('react-dom/client');

      // Page 1
      const root1 = createRoot(p1Root);
      await new Promise<void>((resolve) => {
        root1.render(
          <ExamPage
            pageNum={1}
            groupLetter={gl}
            sections={secs}
            schoolName={schoolName}
            examTitle={examTitle}
            academicYear={academicYear}
            teachers={teachers}
            grayscale={grayscalePdf}
            innerRef={{ current: null } as any}
            layout={layout}
            pageBreakAfter={gradeLevel === '9' ? 4 : 2}
            gradeLevel={gradeLevel}
          />
        );
        setTimeout(resolve, 200);
      });

      // Page 2
      const root2 = createRoot(p2Root);
      await new Promise<void>((resolve) => {
        root2.render(
          <ExamPage
            pageNum={2}
            groupLetter={gl}
            sections={secs}
            schoolName={schoolName}
            examTitle={examTitle}
            academicYear={academicYear}
            teachers={teachers}
            grayscale={grayscalePdf}
            innerRef={{ current: null } as any}
            layout={layout}
            pageBreakAfter={gradeLevel === '9' ? 4 : 2}
            gradeLevel={gradeLevel}
          />
        );
        setTimeout(resolve, 200);
      });

      // Capture page 1
      const a4Div1 = p1Root.firstElementChild as HTMLElement;
      if (a4Div1) {
        const canvas1 = await html2canvas(a4Div1, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
        if (!firstPage) doc.addPage();
        doc.addImage(canvas1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, ph);
        firstPage = false;
      }

      // Capture page 2
      const a4Div2 = p2Root.firstElementChild as HTMLElement;
      if (a4Div2) {
        const canvas2 = await html2canvas(a4Div2, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
        doc.addPage();
        doc.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, ph);
      }

      // Cleanup
      root1.unmount();
      root2.unmount();
      container.removeChild(p1);
      container.removeChild(p2);
    }

    document.body.removeChild(container);
    doc.save(`${singleGroup ? `sinav-grup-${singleGroup}` : 'sinav-tum-gruplar'}-${Date.now()}.pdf`);
  };

  /* ═══ Answer Key PDF — renders the same exam with answers in red ═══ */
  const exportAnswerKey = async () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const { createRoot } = await import('react-dom/client');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pw = 210; const ph = 297;

    for (let gi = 0; gi < GROUP_LETTERS.length; gi++) {
      const gl = GROUP_LETTERS[gi];
      const secs = groups[gl];

      // Render page 1 and page 2 with answerKey=true
      for (let pn = 1; pn <= 2; pn++) {
        const pageDiv = document.createElement('div');
        container.appendChild(pageDiv);
        const root = createRoot(pageDiv);
        const ref = React.createRef<HTMLDivElement>();

        root.render(
          React.createElement(ExamPage, {
            pageNum: pn as 1 | 2,
            groupLetter: gl,
            sections: secs,
            schoolName,
            examTitle,
            academicYear,
            teachers,
            grayscale: false,
            innerRef: ref,
            layout,
            answerKey: true,
            pageBreakAfter: gradeLevel === '9' ? 4 : 2,
            gradeLevel,
          })
        );

        await new Promise(r => setTimeout(r, 600));
        const target = pageDiv.firstElementChild as HTMLElement;
        if (target) {
          const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
          if (gi > 0 || pn > 1) doc.addPage();
          doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, ph);
        }
        root.unmount();
      }
    }

    document.body.removeChild(container);
    doc.save(`cevap-anahtari-${Date.now()}.pdf`);
  };

  /* ═══ Study Guide PDF ═══ */
  const exportStudyGuide = async (forceGrade?: string) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const { createRoot } = await import('react-dom/client');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pw = 210; const ph = 297;

    const pages9: typeof pages12 = [
      { title: '📖 SECTION A+B — Jobs & Card Writing (Meslekler)', content: [
        { type: 'info', text: 'A) 3 kişi kartı + meslek açıklaması → 3 soruya cevap yaz (3x5=15p)\nB) 1 bilgi kartı (isim/meslek/işyeri/aktivite) → karttan 3 cümle yaz (3x5=15p)' },
        { type: 'grid', columns: 2, items: [
          { title: 'Job (Meslek)', lines: ['security guard = güvenlik görevlisi', 'digital marketer = dijital pazarlamacı', 'programmer = bilgisayar programcısı', 'content creator = içerik üretici', 'lawyer = avukat', 'police officer = polis memuru', 'firefighter = itfaiyeci', 'psychologist = psikolog', 'nurse = hemşire', 'dentist = diş hekimi', 'chef = şef | farmer = çiftçi', 'engineer = mühendis | vet = veteriner'] },
          { title: 'What they do (Ne yaparlar)', lines: ['monitors buildings, checks IDs', 'promotes products on social media', 'develops software applications', 'creates videos for social media', 'defends people in court', 'protects people, maintains safety', 'puts out fires, rescues people', 'counsels people with problems', 'takes care of patients', 'examines teeth, treats dental problems', 'cooks meals | grows vegetables', 'designs bridges | treats animals'] },
        ] },
        { type: 'tips', title: '💡 A: Soru Tipleri ve Cevap Kalıpları', items: ['"What is ___\'s job?" → "She/He is a (meslek)."', '"Where does ___ work?" → "She/He works at a (işyeri)."', '"What does ___ do at work?" → "She/He (fiil)s ..."'] },
        { type: 'practice', title: '✏️ A: Practice', text: 'Linda is a vet. She works at an animal clinic. She treats sick animals.\nPeter is an engineer. He works at a construction company. He designs bridges.\n\n1. What is Linda\'s job? → _______________\n2. Where does Peter work? → _______________' },
        { type: 'answers', title: '✅', items: ['1. She is a vet.  2. He works at a construction company.'] },
        { type: 'tips', title: '💡 B: Karttan 3 Cümle Yazma Tekniği', items: ['1. cümle: İsim + Meslek → "___ is a ___."', '2. cümle: İşyeri → "He/She works at a ___."', '3. cümle: Aktivite → "He/She ___s ..."'] },
        { type: 'practice', title: '✏️ B: Practice', text: 'Name: Kevin Hall | Job: Chef | Workplace: Restaurant | Activity: cook meals\n\n1. ___________  2. ___________  3. ___________' },
        { type: 'answers', title: '✅', items: ['1. Kevin is a chef.  2. He works at a restaurant.  3. He cooks meals.'] },
      ]},
      { title: '🏢 SECTION C — Matching Names & Workplaces (Eşleştirme)', content: [
        { type: 'info', text: 'C1) Metin oku → 4 resmin altına doğru ismi yaz (4x3=12p)\nC2) Metindeki işyerlerini tabloya yaz (4x2=8p)' },
        { type: 'grid', columns: 2, items: [
          { title: 'Job → Workplace', lines: ['scientist → science lab', 'architect → architecture firm', 'journalist → news agency', 'photographer → photography studio', 'nurse → hospital', 'pharmacist → pharmacy'] },
          { title: 'Job → Workplace', lines: ['teacher → school', 'chef → restaurant', 'baker → bakery', 'firefighter → fire station', 'vet → animal clinic', 'engineer → construction company'] },
        ] },
        { type: 'tips', title: '💡 C1: İsim Eşleştirme', items: ['Metinde kalın isimleri bul: "My mother, Julia, is a scientist."', 'Resimlere bak: hangi resim bilim insanı?', 'O resmin altına "Julia" yaz.', '⚠️ İsimleri metinden AYNEN kopyala!'] },
        { type: 'tips', title: '💡 C2: İşyeri Tablosu', items: ['"works at / works in" ifadesini bul.', 'Örn: "She works in a science lab." → science lab', '⚠️ İşyerini AYNEN yaz!'] },
        { type: 'practice', title: '✏️ Practice', text: 'My mother, Laura, is a nurse. She works at a hospital.\nMy father, George, is a baker. He works at a bakery.\nMy aunt, Patricia, is a vet. She works at an animal clinic.\nMy brother, Daniel, is a mechanic. He works at a car repair shop.\n\nC1: 1.___ 2.___ 3.___ 4.___    C2: 1.___ 2.___ 3.___ 4.___' },
        { type: 'answers', title: '✅', items: ['C1: Laura, George, Patricia, Daniel', 'C2: hospital, bakery, animal clinic, car repair shop'] },
        { type: 'practice', title: '✏️ Bonus: İşyerini yaz', text: 'scientist → ___  |  architect → ___  |  journalist → ___  |  photographer → ___\nnurse → ___  |  pharmacist → ___  |  chef → ___  |  firefighter → ___' },
        { type: 'answers', title: '✅', items: ['science lab | architecture firm | news agency | photography studio', 'hospital | pharmacy | restaurant | fire station'] },
      ]},
      { title: '🏠 SECTION D — Reading About Home (Ev Hakkında Metin)', content: [
        { type: 'info', text: 'D) Bir kişinin evini anlatan metin + fotoğraf → 4 soruya cevap yaz (4x4=16p)' },
        { type: 'grid', columns: 3, items: [
          { title: 'House Types (Ev Tipleri)', lines: ['detached house = müstakil ev', 'semi-detached = ikiz ev', 'flat / apartment = daire', 'terraced house = sıra ev'] },
          { title: 'Rooms (Odalar)', lines: ['sitting/living room = oturma odası', 'kitchen = mutfak', 'bedroom = yatak odası', 'bathroom = banyo', 'dining room | garden | balcony'] },
          { title: 'Furniture (Mobilya)', lines: ['sofa, armchair, coffee table', 'carpet, rug, TV stand, bookshelf', 'dishwasher, cooker, fridge', 'oven, microwave, toaster', 'bed, desk, wardrobe, lamp'] },
        ] },
        { type: 'tips', title: '💡 Soru Tipleri ve Anahtar Kelimeler', items: ['"What type of house?" → "I live in a ___" bul', '"What does ___ do every morning?" → "every morning/day" bul', '"What is there in the kitchen?" → "In the kitchen, we have ..." bul', '"What is ___ doing right now?" → "right now" = Present Continuous → is ___ing!'] },
        { type: 'practice', title: '✏️ Practice', text: 'Hi, I am Ben. I live in a flat. Downstairs, there is a living room and a kitchen.\nIn the kitchen, we have a fridge, an oven and a toaster.\nI clean my room every day. Right now, my dad is cooking dinner.\n\n1. What type of home does Ben live in? → ___\n2. What does Ben do every day? → ___\n3. What is there in the kitchen? → ___\n4. What is his dad doing right now? → ___' },
        { type: 'answers', title: '✅', items: ['1. a flat  2. He cleans his room.  3. fridge, oven, toaster  4. He is cooking dinner.'] },
      ]},
      { title: '🖼️ SECTION E+F — Present Continuous & Personal Questions', content: [
        { type: 'info', text: 'E) 3 resim + fiil/yer kutusu → cümle yaz (3x6=18p)\nF) Kendin hakkında 4 soruya cevap yaz (4x4=16p)' },
        { type: 'grid', columns: 2, items: [
          { title: 'Verbs (Fiiller)', lines: ['water the flowers = çiçekleri sula', 'read a book = kitap oku', 'cook = yemek pişir', 'watch TV = TV izle', 'have dinner = akşam yemeği ye', 'do homework = ödev yap', 'sweep the floor = yeri süpür', 'iron clothes = ütü yap', 'set the table = sofrayı kur', 'play the guitar = gitar çal', 'prepare dinner = yemek hazırla'] },
          { title: 'Places (Yerler)', lines: ['garden = bahçe', 'bedroom = yatak odası', 'kitchen = mutfak', 'living room = oturma odası', 'dining room = yemek odası', 'bathroom = banyo', 'balcony = balkon', '', 'FORMÜL:', 'Özne + is/are + Fiil-ing', '+ in the + Yer'] },
        ] },
        { type: 'tips', title: '💡 E: Adım Adım', items: ['1. Resme bak → kişi ne yapıyor?', '2. Fiil kutusundan doğru fiili seç', '3. Yer kutusundan doğru yeri seç', '4. Yaz: "Amy is sweeping the floor in the living room."', '⚠️ Tekil = is | Çoğul = are!'] },
        { type: 'practice', title: '✏️ E: Practice', text: 'Verbs: sweep, cook, study  |  Places: kitchen, bedroom, living room\n\n1. Amy is ___ the floor in the ___.\n2. Steve is ___ dinner in the ___.\n3. The children are ___ in the ___.' },
        { type: 'answers', title: '✅', items: ['1. sweeping / living room  2. cooking / kitchen  3. studying / bedroom'] },
        { type: 'tips', title: '💡 F: Kişisel Sorular — Cevap Kalıpları', items: ['"What type of house?" → "I live in a flat."', '"How many rooms?" → "There are 4 rooms in my house."', '"What furniture?" → "There is a sofa and a coffee table."', '"Favourite room? Why?" → "My favourite room is the bedroom because it is comfortable."'] },
        { type: 'practice', title: '✏️ F: Practice', text: '1. I live in a ___.\n2. There are ___ rooms in my house.\n3. In my sitting room, there is a ___.\n4. My favourite room is the ___ because ___.' },
      ]},
    ];

    const pages12 = [
      // Page 1: Header + Section A
      { title: '📖 SECTION A — Reading a Brochure (Broşür Okuma)', content: [
        { type: 'info', text: '❓ What is a brochure? (Broşür nedir?)\nA brochure is a short printed paper that gives information about an event, a campaign, or an organization.\n(Broşür, bir etkinlik veya kuruluş hakkında bilgi veren kısa bir basılı kağıttır.)' },
        { type: 'vocab', title: '📝 Important Words (Önemli Kelimeler)', items: ['🏛️ Foundation year = Kuruluş yılı — "Founded in 2015"', '📅 Campaign = Kampanya — "Tree Planting Campaign"', '📍 Venue = Mekan / Yer — "City Park"', '💬 Motto / Slogan = Slogan — "Plant Today, Breathe Tomorrow"', '🤝 Volunteer = Gönüllü — "Join us as a volunteer"', '💰 Donate = Bağışlamak — "All donations will be used for..."', '🌐 Organization = Kuruluş — "Green Future Association"'] },
        { type: 'image', src: '/yazili/study-brochure.png' },
        { type: 'tips', title: '💡 How to Read a Brochure (Broşür Nasıl Okunur?)', items: ['1️⃣ Read the questions FIRST! (Önce soruları oku!)', '2️⃣ Look for NUMBERS → dates and years (Sayıları ara → tarih ve yıl)', '3️⃣ Look for PLACE NAMES → venue (Yer isimlerini ara → mekan)', '4️⃣ Look for words in " " → motto/slogan (Tırnak içini ara → slogan)', '5️⃣ Look for CAPITAL LETTERS → important names (Büyük harfler → önemli isimler)'] },
        { type: 'practice', title: '✏️ Practice — Fill in from the brochure above:', text: '1. Foundation year: _______________\n2. Campaign date: _______________\n3. Venue: _______________\n4. Motto: _______________' },
        { type: 'answers', title: '✅ Answers', items: ['1. Foundation year: 2018', '2. Campaign date: March 15-30, 2026', '3. Venue: Sunshine City Library', '4. Motto: "Every Book Opens a New Door"'] },
      ]},
      // Page 2: Section B
      { title: '🔍 SECTION B — Vocabulary Matching (Kelime Eşleştirme)', content: [
        { type: 'info', text: '❓ How does this section work? (Bu bölüm nasıl çalışır?)\n1. You read a text. Some words are BOLD (kalın).\n2. Below the text, there are CLUE definitions.\n3. You match each clue with the correct bold word.\n\n(Bir metin okursun. Bazı kelimeler KALIN yazılmış. Altında İPUCU tanımlar var. Her ipucunu doğru kalın kelimeyle eşleştirirsin.)' },
        { type: 'image', src: '/yazili/study-flood.png' },
        { type: 'vocab', title: '📝 Important Words You Must Know (Bilmeniz Gereken Kelimeler)', items: ['🔥 fire = yangın | 🚒 firefighters = itfaiyeciler', '✅ survived = hayatta kaldı | 🏃 escaped = kaçtı, kurtuldu', '🚪 evacuate = tahliye etmek | 🆘 rescue = kurtarmak', '👀 witnesses = tanıklar | 👁️ observers = gözlemciler', '🤕 injuries = yaralanmalar | 💉 wounds = yaralar', '⭐ miracle = mucize | 🌟 wonder = harika, mucize', '👥 guests = misafirler | 🛡️ safe = güvende'] },
        { type: 'practice', title: '✏️ Practice — Read and match:', text: 'Last week, a terrible flood hit Greendale village. The water rose quickly. Families had to evacuate their homes. The rescue team saved people. All villagers survived. Some observers came to see the damage. It was a miracle nobody was hurt.\n\n1. A large amount of water → ___________\n2. To leave a dangerous place → ___________\n3. Stayed alive → ___________\n4. People who watched → ___________\n5. An amazing unexpected event → ___________' },
        { type: 'answers', title: '✅ Answers', items: ['1. flood', '2. evacuate', '3. survived', '4. observers', '5. miracle'] },
      ]},
      // Page 3: Section C
      { title: '✍️ SECTION C — Writing an Invitation (Davetiye Yazma)', content: [
        { type: 'info', text: '❓ What do you need to write? (Ne yazman gerekiyor?)\nYou will see a poster template. You must fill in 5 pieces of information.\n(Bir poster şablonu göreceksin. 5 bilgi yazman gerekiyor.)' },
        { type: 'image', src: '/yazili/study-school.png' },
        { type: 'vocab', title: '📝 Important Phrases (Önemli Kalıplar)', items: ['🎯 "Join us to..." = "...için bize katılın" → Join us to clean our school!', '🎯 "The aim of the event is..." = "Etkinliğin amacı..." → The aim is to help animals.', '📅 "Date: ..." = "Tarih: ..." → Date: April 10, 2026', '📍 "Place: ..." = "Yer: ..." → Place: School Garden', '🤝 "You can contribute by..." = "Katkıda bulunabilirsiniz..." → You can contribute by donating books.'] },
        { type: 'practice', title: '✏️ Practice — Fill in the invitation:', text: '🌿 CLEAN SCHOOL DAY 🌿\n\nJoin us to: _______________\nAim: _______________\nDate: _______________\nPlace: _______________\nYou can contribute by: _______________' },
        { type: 'answers', title: '✅ Example Answers', items: ['Join us to: make our school clean and beautiful', 'Aim: raise awareness about keeping our school clean', 'Date: April 10, 2026', 'Place: School Garden and Classrooms', 'You can contribute by: bringing cleaning supplies or planting flowers'] },
        { type: 'tips', title: '🔑 Remember (Unutma!)', items: ['✅ Always fill in ALL 5 blanks! (Her 5 boşluğu doldur!)', '✅ Keep it simple — short sentences! (Basit tut — kısa cümleler!)', '❌ Don\'t leave any blank empty! (Hiçbir boşluğu boş bırakma!)'] },
      ]},
      // Page 4: Section D
      { title: '🔢 SECTION D — Chronological Order (Kronolojik Sıralama)', content: [
        { type: 'info', text: '❓ What are signal words? (Sıralama kelimeleri nedir?)\nSignal words tell you the ORDER of events. They show what happened first, second, third...\n(Sıralama kelimeleri olayların SIRASINI söyler. Önce, sonra, en son ne oldu gösterir.)' },
        { type: 'image', src: '/yazili/study-birthday.png' },
        { type: 'vocab', title: '📝 Signal Words — MEMORIZE THESE! (Bunları EZBERLEYİN!)', items: ['1️⃣ First = İlk olarak — always #1! (her zaman 1 numara!)', '2️⃣ Next = Sonra — comes after First', '3️⃣ Then = Daha sonra — comes after Next', '4️⃣ Afterwards = Ardından — comes after Then', '5️⃣ Finally = En son — always LAST! (her zaman son!)', '⬅️ Before = Önce — something before another', '➡️ After = Sonra — something after another'] },
        { type: 'practice', title: '✏️ Practice — Put in order (1-5):', text: '___ Then, we played fun games in the garden. 🎮\n___ Finally, everyone went home happy. 😊\n___ First, we decorated the house with balloons. 🎈\n___ Afterwards, Elif blew out the candles. 🎂\n___ Next, the guests arrived with presents. 🎁' },
        { type: 'answers', title: '✅ Correct Order', items: ['3️⃣ Then, we played fun games. 🎮', '5️⃣ Finally, everyone went home. 😊', '1️⃣ First, we decorated the house. 🎈', '4️⃣ Afterwards, Elif blew out candles. 🎂', '2️⃣ Next, the guests arrived. 🎁'] },
        { type: 'tips', title: '💡 TRICK (Hile!)', items: ['🔍 Find "First" → write 1', '🔍 Find "Finally" → write 5', '🔍 The rest goes in the middle!', '💡 You don\'t need to understand every word — just FIND THE SIGNAL WORD!'] },
      ]},
      // Page 5: Section E
      { title: '📝 SECTION E — Paraphrasing (Başka Kelimelerle Anlatma)', content: [
        { type: 'info', text: '❓ What is paraphrasing? (Paraphrasing nedir?)\nYou read a text and write the SAME idea with DIFFERENT words.\n(Bir metin okursun ve AYNI fikri FARKLI kelimelerle yazarsın.)\n\n🔑 3 Rules: 1. Same meaning ✅  2. Different words ✅  3. Don\'t copy ❌' },
        { type: 'image', src: '/yazili/study-water.png' },
        { type: 'vocab', title: '📝 How to Start Your Sentence (Cümleye Nasıl Başlanır)', items: ['📌 "According to the text, ..." = "Metne göre, ..."', '📌 "The article says that ..." = "Makale ... diyor"', '📌 "The text is about ..." = "Metin ... hakkında"', '📌 "In other words, ..." = "Başka bir deyişle, ..."'] },
        { type: 'vocab', title: '📝 Word Swaps — Use These! (Kelime Değişimleri)', items: ['shows → reveals (gösterir → ortaya koyar)', 'people → individuals (insanlar → bireyler)', 'happy → cheerful (mutlu → neşeli)', 'important → essential (önemli → hayati)', 'many → numerous (birçok → çok sayıda)', 'said → stated (dedi → belirtti)', 'because → since, due to (çünkü → nedeniyle)'] },
        { type: 'practice', title: '✏️ Practice — Paraphrase this text in 2 sentences:', text: '💧 "Clean drinking water is very important for our health. Many people do not have clean water. Doctors say we should drink at least 8 glasses every day."' },
        { type: 'answers', title: '✅ Example Paraphrases', items: ['1. "According to the text, clean water is essential for our health. Individuals should drink at least 8 glasses daily."', '2. "The text is about the significance of drinking water. Health experts recommend having 8 glasses each day."'] },
        { type: 'tips', title: '❌ Common Mistakes (Sık Hatalar)', items: ['❌ Copying sentences word by word (Kelime kelime kopyalama)', '❌ Changing only one word (Sadece bir kelime değiştirme)', '❌ Writing more than 2 sentences (2\'den fazla cümle yazma)', '✅ Use "According to the text" to start! (Başlangıç kalıbı kullan!)'] },
      ]},
    ];

    const pages10: typeof pages12 = [
      { title: '✈️ SECTION A — Travel Reading (Seyahat Okuma)', content: [
        { type: 'info', text: 'A) 4 arkadaşın tatil hikayesini oku → resimlerin altına doğru isimleri yaz (4x5=20p)\nKazanım: K.E10.5.R2 — Read and understand travel descriptions' },
        { type: 'vocab', title: '📝 Travel Vocabulary (Seyahat Kelimeleri)', items: [
          '✈️ travel / travelled = seyahat etmek',
          '🏖️ beach resort = sahil tatil yeri',
          '🏛️ historical landmarks = tarihi yerler',
          '🥾 hike = yürüyüş yapmak',
          '🌊 waterfall = şelale',
          '🎢 zip-lining = zipline yapmak',
          '🚣 white-water rafting = rafting yapmak',
          '😮 breathtaking = nefes kesici',
          '🤩 thrilling = heyecan verici',
          '🏨 accommodation = konaklama',
          '🍽️ traditional cuisine = geleneksel mutfak',
          '🏗️ ancient architecture = antik mimari',
        ] },
        { type: 'grid', columns: 2, items: [
          { title: 'Destination → Activity', lines: [
            'beach resort → swim, relax, Turkish bath',
            'Rome → visit landmarks, guided tours',
            'Norway → hike, explore national parks',
            'Costa Rica → zip-lining, rafting',
          ] },
          { title: 'Key Phrases', lines: [
            '"spent a week in..." = ...de bir hafta geçirdi',
            '"stayed at a..." = ...de kaldı',
            '"visited..." = ...ziyaret etti',
            '"She said it was..." = ...olduğunu söyledi',
            '"He described it as..." = ...olarak tanımladı',
          ] },
        ] },
        { type: 'tips', title: '💡 How to Match Names to Pictures', items: [
          '1. Her kişinin ne yaptığını bul',
          '2. Resimlere bak: plaj mı? dağ mı? şehir mi?',
          '3. Doğru ismi resmin altına yaz',
          '⚠️ Her grupta isimler farklı olabilir — metinden oku!',
        ] },
        { type: 'practice', title: '✏️ Practice', text: 'Read and match the names to the pictures:\n\nSarah visited Barcelona. She walked along La Rambla and tried paella at a local restaurant. She also visited the Sagrada Familia church.\n\nBen travelled to Kenya. He went on a safari, saw lions and elephants, and slept in a tent under the stars.\n\nMaya chose Greece. She swam in the Aegean Sea, explored ancient ruins, and enjoyed fresh seafood on a small island.\n\nLuke went to Canada. He went skiing in the Rocky Mountains and visited Niagara Falls.\n\n⛷️ ___ | 🦁 ___ | 🏛️ ___ | 🏖️ ___' },
        { type: 'answers', title: '✅', items: ['⛷️ Luke | 🦁 Ben | 🏛️ Sarah | 🏖️ Maya'] },
      ]},
      { title: '🗺️ SECTION B — Travel Brochure Writing (Broşür Yazma)', content: [
        { type: 'info', text: 'B) Favori şehrin için seyahat broşürü oluştur — 4 soruya birer cümle yaz (4x5=20p)\nKazanım: K.E10.5.W2 — Create a travel brochure' },
        { type: 'grid', columns: 2, items: [
          { title: 'Questions (Sorular)', lines: [
            '🏨 Where can you stay?',
            '→ Accommodation (Konaklama)',
            '🚌 How can you travel around?',
            '→ Transportation (Ulaşım)',
            '🍽️ What are the traditional dishes?',
            '→ Traditional Dishes (Geleneksel Yemekler)',
            '🏛️ Which historic places can you see?',
            '→ Historic Sites (Tarihi Yerler)',
          ] },
          { title: 'Answer Templates', lines: [
            '"You can stay at a hotel / hostel / resort."',
            '"You can travel by bus / metro / taxi."',
            '"You should try ... (yemek adı)."',
            '"You can visit ... (yer adı)."',
            '',
            '⚠️ Her soru için BİR cümle yeterli!',
            '⚠️ Şehir adını kullan!',
          ] },
        ] },
        { type: 'tips', title: '💡 How to Write a Travel Brochure (Nasıl Yazılır?)', items: [
          '1️⃣ Önce şehir adını yaz (City Name)',
          '2️⃣ Her kategori için BİR cümle yaz — kısa ve net!',
          '3️⃣ "You can..." kalıbını kullan',
          '4️⃣ Gerçek yer/yemek isimleri kullan (İstanbul, kebab vs.)',
          '⚠️ Boş bırakma! Her kutuya bir şey yaz!',
          '⚠️ Cümle sonuna nokta (.) koy!',
        ] },
        { type: 'practice', title: '✏️ Practice — London Brochure', text: 'City: London\n\n🏨 Accommodation: You can stay at _______________.\n🚌 Transportation: You can travel by _______________.\n🍽️ Traditional Dishes: You should try _______________.\n🏛️ Historic Sites: You can visit _______________.' },
        { type: 'answers', title: '✅ Example', items: [
          '🏨 You can stay at a hotel near Piccadilly Circus.',
          '🚌 You can travel by underground (tube) or double-decker bus.',
          '🍽️ You should try fish and chips and English breakfast.',
          '🏛️ You can visit the Tower of London and Buckingham Palace.',
        ] },
      ]},
      { title: '📋 SECTION C — Rules & Modals (Kurallar ve Modal Fiiller)', content: [
        { type: 'info', text: 'C) Kurallar içeren metni oku → 4 soruya cevap yaz (4x5=20p)\nKazanım: E10.6.R1 — Read and understand rules using modal verbs' },
        { type: 'vocab', title: '📝 Modal Verbs (Yardımcı Fiiller)', items: [
          '✅ must = -meli/-malı (zorunlu) → "You must attend on time."',
          '❌ mustn\'t = -mamalı (yasak) → "You mustn\'t send off-topic messages."',
          '💡 should = -meli (tavsiye) → "You should use polite language."',
          '⚠️ had better = -se iyi olur (güçlü tavsiye) → "You had better check your connection."',
          '🔮 may = -ebilir (olasılık) → "You may miss important information."',
        ] },
        { type: 'tips', title: '💡 How to Answer (Nasıl Cevaplanır?)', items: [
          '1. Soruda anahtar kelimeyi bul: "must", "should", "forbidden"',
          '2. Metinde o modal fiili ara',
          '3. Cümlenin tamamını yaz',
          '"What must students do?" → must içeren cümleyi bul',
          '"What is forbidden?" → mustn\'t içeren cümleyi bul',
          '"What may happen?" → may/might içeren cümleyi bul',
        ] },
        { type: 'practice', title: '✏️ Practice', text: 'Computer Lab Rules:\nStudents must save their work before leaving.\nYou should use headphones in the lab.\nStudents mustn\'t download games on school computers.\nYou had better log out after using the computer.\nIf you break the equipment, you may have to replace it.\n\n1. What must students do before leaving? → ___\n2. What should students use? → ___\n3. What is forbidden? → ___\n4. What may happen if you break equipment? → ___' },
        { type: 'answers', title: '✅', items: [
          '1. They must save their work.',
          '2. They should use headphones.',
          '3. Students mustn\'t download games on school computers.',
          '4. They may have to replace it.',
        ] },
      ]},
      { title: '🔗 SECTION D — If-Clauses (Koşul Cümleleri)', content: [
        { type: 'info', text: 'D) Verilen cümleleri tamamla — If + condition → result (5x4=20p)\nKazanım: E10.6.W1 — Write possible consequences using if-clauses' },
        { type: 'vocab', title: '📝 If-Clause Type 1 Formula', items: [
          '📌 If + Present Simple, ... will/may/can + V1',
          '📌 If + Subject + V(s/es), Subject + will/may/can + V1',
          '',
          '✅ "If you arrive late, you will miss the class."',
          '✅ "If students use phones, the teacher will take them."',
          '✅ "If you study hard, you can pass the exam."',
          '✅ "If you have a toothache, you should see a dentist."',
        ] },
        { type: 'grid', columns: 2, items: [
          { title: 'Health Conditions (Sağlık)', lines: [
            'have a toothache → see a dentist',
            'have a stomachache → take medicine',
            'have a headache → rest and drink water',
            'have a fever → stay in bed',
            'feel dizzy → sit down and breathe',
            'get injured → go to the hospital',
          ] },
          { title: 'School & Life (Okul & Hayat)', lines: [
            'arrive late → miss the lesson',
            'don\'t study → fail the exam',
            'use phones in class → teacher takes them',
            'run in corridors → get hurt',
            'want to stay healthy → exercise regularly',
            'want a higher grade → study harder',
            'don\'t wear uniforms → face consequences',
            'eat too much junk food → gain weight',
          ] },
        ] },
        { type: 'tips', title: '💡 How to Complete If-Clauses (Nasıl Tamamlanır?)', items: [
          '1️⃣ "If..." kısmını oku — koşul ne?',
          '2️⃣ Mantıklı bir sonuç düşün',
          '3️⃣ will/may/can/should + fiil kullan',
          '✅ Sağlık → "you should see a doctor"',
          '✅ Okul kuralı → "the teacher will warn you"',
          '✅ İstek → "you should study/exercise regularly"',
          '⚠️ "If" kısmını tekrar yazma — sadece sonucu yaz!',
        ] },
        { type: 'practice', title: '✏️ Practice', text: '1. If you don\'t drink enough water, _______________.\n2. If you eat too much sugar, _______________.\n3. If you don\'t get enough sleep, _______________.\n4. If you want to lose weight, _______________.\n5. If you sit in front of a screen all day, _______________.' },
        { type: 'answers', title: '✅', items: [
          '1. you may get a headache.',
          '2. you may get diabetes.',
          '3. you will feel tired at school.',
          '4. you should exercise regularly and eat healthy food.',
          '5. your eyes may get tired and your back may hurt.',
        ] },
      ]},
      { title: '🎉 SECTION E — Festivals & Events (Etkinlikler)', content: [
        { type: 'info', text: 'E) Bir festival/etkinlik hakkında metin oku → tabloyu tamamla (4x5=20p)\nKazanım: E10.7.R2 — Read and extract information about events' },
        { type: 'grid', columns: 2, items: [
          { title: 'Table Headers (Tablo Başlıkları)', lines: [
            '🎪 Name of the Event = Etkinlik adı',
            '📍 Location (City) = Yer (Şehir)',
            '📅 Date / Season = Tarih / Mevsim',
            '🍽️ Food & Drink = Yiyecek & İçecek',
          ] },
          { title: 'Key Words to Find', lines: [
            '"Location:" veya "in ..." → Şehir',
            '"Every year in ..." → Tarih',
            '"Purpose:" → Amaç',
            '"Main Events" → Ana etkinlikler',
            'Tablo veya soru formatında olabilir',
            'Metinden bilgiyi aynen bul ve yaz',
          ] },
        ] },
        { type: 'vocab', title: '📝 Festival Vocabulary', items: [
          '🎭 festival = festival',
          '🏪 street market = sokak pazarı',
          '👨‍🍳 cooking competition = yemek yarışması',
          '🌿 herbs = otlar, bitkiler',
          '🧑‍🌾 local = yerel',
          '🎉 celebrate = kutlamak',
          '🍳 traditional cuisine = geleneksel mutfak',
          '📢 promote = tanıtmak',
        ] },
        { type: 'tips', title: '💡 How to Read Festival Texts (Nasıl Okunur?)', items: [
          '1️⃣ Önce tablo başlıklarını oku (Name, Location, Date, Food)',
          '2️⃣ Metinde BÜYÜK HARFLERLE yazılan festival adını bul',
          '3️⃣ "in..." veya "Location:" → şehir/yer',
          '4️⃣ "Every..." veya "Time:" → tarih/mevsim',
          '5️⃣ "food", "dishes", "cuisine" → yiyecek/içecek',
          '⚠️ Cevabı metinden AYNEN yaz!',
          '⚠️ Tablo formatında: sadece bilgiyi yaz, cümle yapma!',
        ] },
        { type: 'practice', title: '✏️ Practice — Tablo doldurma', text: 'BURSA SILK ROAD FESTIVAL\nLocation: Bursa, Türkiye\nTime: Every June (5-day festival)\nPurpose: To celebrate the history of the Silk Road and promote local silk products\nFood: İskender kebab, chestnut desserts, thermal water\n\n| Name of Event | Location | Date/Season | Food & Drink |\n| ___ | ___ | ___ | ___ |' },
        { type: 'answers', title: '✅', items: [
          'Bursa Silk Road Festival | Bursa, Türkiye | June | İskender kebab, chestnut desserts',
        ] },
        { type: 'practice', title: '✏️ Practice — Soru-cevap formatı', text: 'TOKYO CHERRY BLOSSOM FESTIVAL\nLocation: Tokyo, Japan\nTime: Every year in March-April\nPurpose: To celebrate the blooming of cherry blossoms and welcome spring\n\nMain Events:\n- Hanami picnics under cherry trees\n- Traditional tea ceremonies\n- Night illumination of cherry blossom trees\n\n1. What is the name of the festival? → ___\n2. When is it held? → ___\n3. Where is it celebrated? → ___\n4. Why do people celebrate it? → ___' },
        { type: 'answers', title: '✅', items: [
          '1. Tokyo Cherry Blossom Festival',
          '2. Every year in March-April',
          '3. Tokyo, Japan',
          '4. To celebrate the blooming of cherry blossoms and welcome spring.',
        ] },
      ]},
    ];

    const grade = forceGrade || gradeLevel;
    const pages = grade === '10' ? pages10 : grade === '9' ? pages9 : pages12;

    for (let pi = 0; pi < pages.length; pi++) {
      const pg = pages[pi];
      const pageDiv = document.createElement('div');
      container.appendChild(pageDiv);
      const root = createRoot(pageDiv);

      root.render(
        React.createElement('div', {
          style: { width: '210mm', height: '297mm', padding: '10mm 14mm', background: '#fff', fontFamily: 'system-ui, sans-serif', fontSize: '9.5pt', lineHeight: 1.45, color: '#1a1a1a', boxSizing: 'border-box', overflow: 'hidden' }
        },
          // Header
          pi === 0 ? React.createElement('div', { style: { textAlign: 'center', marginBottom: '6mm', borderBottom: '3px solid #0d9488', paddingBottom: '4mm' } },
            React.createElement('div', { style: { fontSize: '16pt', fontWeight: 900, color: '#0d9488' } }, '📚 ÇALIŞMA KAĞIDI / STUDY GUIDE'),
            React.createElement('div', { style: { fontSize: '9pt', color: '#666', marginTop: '1mm' } }, `${academicYear} ${schoolName} — ${examTitle}`),
          ) : React.createElement('div', { style: { textAlign: 'right', fontSize: '8pt', color: '#999', marginBottom: '3mm' } }, `Çalışma Kağıdı — Sayfa ${pi + 1}`),

          // Section title
          React.createElement('div', { style: { fontSize: '13pt', fontWeight: 800, color: '#0f766e', marginBottom: '3mm', borderBottom: '2px solid #99f6e4', paddingBottom: '1.5mm' } }, pg.title),

          // Content blocks
          ...pg.content.map((block: any, bi: number) => {
            if (block.type === 'grid') {
              const cols = block.columns || 2;
              const gridItems = block.items as { title: string; lines: string[] }[];
              return React.createElement('div', { key: bi, style: { display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2mm', marginBottom: '3mm', border: '1.5px solid #99f6e4', borderRadius: '6px', overflow: 'hidden' } },
                ...gridItems.map((gi: { title: string; lines: string[] }, ii: number) =>
                  React.createElement('div', { key: ii, style: { padding: '2mm 3mm', borderLeft: ii > 0 ? '1px solid #e0e0e0' : 'none' } },
                    React.createElement('div', { style: { fontSize: '8.5pt', fontWeight: 700, color: '#0f766e', marginBottom: '1.5mm', borderBottom: '1px solid #d1fae5', paddingBottom: '1mm' } }, gi.title),
                    ...gi.lines.map((line: string, li: number) =>
                      React.createElement('div', { key: li, style: { fontSize: '7.5pt', lineHeight: 1.3, marginBottom: '0.3mm', color: line ? '#333' : 'transparent' } }, line || '.')
                    ),
                  )
                ),
              );
            }
            if (block.type === 'images-row') {
              const imgs = block.images as { src: string; label: string }[];
              return React.createElement('div', { key: bi, style: { display: 'grid', gridTemplateColumns: `repeat(${imgs.length}, 1fr)`, gap: '3mm', marginBottom: '3mm' } },
                ...imgs.map((img: { src: string; label: string }, ii: number) =>
                  React.createElement('div', { key: ii, style: { textAlign: 'center' } },
                    React.createElement('img', { src: img.src, alt: '', style: { width: imgs.length > 3 ? '28mm' : '30mm', height: imgs.length > 3 ? '28mm' : '30mm', objectFit: 'cover', borderRadius: '6px', border: '1.5px solid #99f6e4', display: 'block', margin: '0 auto 1mm' }, crossOrigin: 'anonymous' }),
                    React.createElement('div', { style: { fontSize: '7.5pt', color: '#0f766e', fontWeight: 600, lineHeight: 1.3, whiteSpace: 'pre-line' } }, img.label),
                  )
                ),
              );
            }
            if (block.type === 'image') {
              return React.createElement('div', { key: bi, style: { marginBottom: '3mm', textAlign: 'center' } },
                React.createElement('img', { src: block.src, alt: '', style: { width: '100%', maxHeight: '35mm', objectFit: 'contain', borderRadius: '6px', border: '1px solid #ccc' }, crossOrigin: 'anonymous' })
              );
            }
            if (block.type === 'info') {
              return React.createElement('div', { key: bi, style: { fontSize: '9pt', lineHeight: 1.5, marginBottom: '3mm', padding: '2mm 3mm', background: '#f0fdfa', borderRadius: '4px', border: '1px solid #99f6e4', whiteSpace: 'pre-line' } }, block.text);
            }
            if (block.type === 'vocab' || block.type === 'tips') {
              return React.createElement('div', { key: bi, style: { marginBottom: '3mm' } },
                React.createElement('div', { style: { fontSize: '9.5pt', fontWeight: 700, color: '#0f766e', marginBottom: '1mm' } }, block.title),
                ...block.items.map((item: string, ii: number) =>
                  React.createElement('div', { key: ii, style: { fontSize: '8.5pt', marginBottom: '0.5mm', paddingLeft: '3mm', lineHeight: 1.35 } }, item)
                ),
              );
            }
            if (block.type === 'practice') {
              return React.createElement('div', { key: bi, style: { marginBottom: '3mm' } },
                block.title && React.createElement('div', { style: { fontSize: '9.5pt', fontWeight: 700, color: '#0f766e', marginBottom: '1mm' } }, block.title),
                React.createElement('div', { style: { fontSize: '9pt', padding: '2mm 3mm', background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: '5px', whiteSpace: 'pre-line', lineHeight: 1.45 } }, block.text),
              );
            }
            if (block.type === 'answers') {
              return React.createElement('div', { key: bi, style: { marginBottom: '3mm' } },
                React.createElement('div', { style: { fontSize: '9pt', fontWeight: 700, color: '#dc2626', marginBottom: '1mm' } }, block.title),
                ...block.items.map((item: string, ii: number) =>
                  React.createElement('div', { key: ii, style: { fontSize: '8.5pt', color: '#dc2626', fontWeight: 600, marginBottom: '0.5mm', paddingLeft: '3mm' } }, item)
                ),
              );
            }
            return null;
          }),
        )
      );

      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(pageDiv.firstElementChild as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
      if (pi > 0) doc.addPage();
      doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, ph);
      root.unmount();
    }

    document.body.removeChild(container);
    doc.save(`calisma-kagidi-${Date.now()}.pdf`);
  };

  /* ═══ Quick PDF from visible preview ═══ */
  const exportCurrentGroupPdf = async (largeFont?: boolean) => {
    if (!page1Ref.current || !page2Ref.current) return;
    const pw = 210;
    const ph = 297;

    if (largeFont) {
      // 18pt version — BEP grubu sections kullan (12. sınıf: E, 9. sınıf: C)
      const eSections = groups[BEP_GROUP];
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      const { createRoot } = await import('react-dom/client');
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });

      for (let si = 0; si < eSections.length; si++) {
        const sec = eSections[si];
        const sl = String.fromCharCode(65 + si);
        const pageDiv = document.createElement('div');
        container.appendChild(pageDiv);
        const root = createRoot(pageDiv);

        root.render(
          React.createElement('div', {
            style: {
              width: '210mm', minHeight: '297mm', padding: '12mm 15mm',
              background: '#fff', fontFamily: 'system-ui, sans-serif',
              fontSize: '18pt', lineHeight: 1.7, color: '#1a1a1a',
              boxSizing: 'border-box',
            }
          },
            // Header on first page
            si === 0 ? React.createElement('div', { style: { marginBottom: '6mm' } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '4mm' } },
                React.createElement('div', { style: { fontSize: '36pt', fontWeight: 900 } }, BEP_GROUP),
                React.createElement('div', { style: { flex: 1, textAlign: 'center' } },
                  React.createElement('div', { style: { fontSize: '12pt', fontWeight: 600 } }, `${academicYear} ${schoolName}`),
                  React.createElement('div', { style: { fontSize: '13pt', fontWeight: 700, marginTop: '1mm' } }, examTitle),
                ),
                React.createElement('img', { src: kemalAtayLogo, style: { width: '12mm', height: '12mm', objectFit: 'contain' } }),
              ),
              React.createElement('div', { style: { borderTop: '2px solid #333', marginTop: '3mm', marginBottom: '4mm' } }),
              React.createElement('div', { style: { fontSize: '14pt', fontWeight: 600 } }, 'Name – Surname: _________________________  Class: _______  Number: _______'),
            ) : React.createElement('div', { style: { textAlign: 'right', fontSize: '9pt', color: '#999', marginBottom: '3mm' } }, `${examTitle} — Sayfa ${si + 1}`),
            // Section content — type-aware rendering
            React.createElement('div', { style: { marginTop: '4mm' } },
              // Section header
              React.createElement('div', { style: { fontSize: '20pt', fontWeight: 800, marginBottom: '3mm', borderBottom: '2px solid #555', paddingBottom: '2mm' } }, `${sl}. ${sec.instruction}`),
              // PersonCards — 3 kişi yan yana (18pt)
              sec.personCards && sec.personCards.length > 0 ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${sec.personCards.length}, 1fr)`, gap: '4mm', marginBottom: '5mm' } },
                ...sec.personCards.map((pc: PersonCard, pi: number) =>
                  React.createElement('div', { key: pi, style: { textAlign: 'center' } },
                    pc.imageUrl ? React.createElement('img', { src: pc.imageUrl, style: { width: '25mm', height: '25mm', borderRadius: pc.text ? '50%' : '6px', objectFit: 'cover', border: `2px solid ${pc.borderColor || '#90caf9'}`, display: 'block', margin: '0 auto 2mm' }, crossOrigin: 'anonymous' }) : null,
                    React.createElement('div', { style: { background: pc.bgColor || '#e3f2fd', borderRadius: '6px', padding: '3px 6px', fontSize: '14pt', lineHeight: 1.5 } }, pc.text || pc.name)
                  )
                )
              ) : null,
              // InfoCard — kart + bilgiler (18pt)
              sec.infoCard ? React.createElement('div', { style: { display: 'flex', gap: '5mm', marginBottom: '5mm', border: '1.5px solid #b3e5fc', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, #e1f5fe 0%, #fff 100%)' } },
                sec.infoCard.imageUrl ? React.createElement('img', { src: sec.infoCard.imageUrl, style: { width: '35mm', height: '35mm', objectFit: 'cover', flexShrink: 0 }, crossOrigin: 'anonymous' }) : null,
                React.createElement('div', { style: { padding: '3mm', fontSize: '14pt', lineHeight: 1.7, display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
                  ...sec.infoCard.fields.map((f: {label:string;value:string}, fi: number) =>
                    React.createElement('div', { key: fi }, React.createElement('strong', null, f.label + ': '), f.value)
                  )
                )
              ) : null,
              // ImageGrid — 2x2 resim (18pt)
              sec.imageGrid && sec.imageGrid.length > 0 ? React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm', marginBottom: '5mm', width: '60%', marginLeft: 'auto' } },
                ...sec.imageGrid.map((img: string, gi: number) =>
                  React.createElement('div', { key: gi, style: { position: 'relative' } },
                    React.createElement('div', { style: { position: 'absolute', top: '2px', left: '4px', background: '#fff', borderRadius: '3px', padding: '0 4px', fontSize: '10pt', fontWeight: 700 } }, String(gi + 1)),
                    React.createElement('img', { src: img, style: { width: '100%', borderRadius: '6px', border: '1px solid #ccc' }, crossOrigin: 'anonymous' })
                  )
                )
              ) : null,
              // Brochure image — large
              sec.type === 'brochure-fill' && sec.imageUrl ? React.createElement('img', { src: sec.imageUrl, style: { width: '100%', maxHeight: '120mm', objectFit: 'contain', borderRadius: '6px', marginBottom: '2mm', border: '1px solid #ddd' }, crossOrigin: 'anonymous' }) : null,
              // Reading-portrait image — sol portre
              sec.type === 'reading-portrait' && sec.imageUrl ? React.createElement('img', { src: sec.imageUrl, style: { width: '30mm', height: '30mm', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd', float: 'left', marginRight: '4mm', marginBottom: '2mm' }, crossOrigin: 'anonymous' }) : null,
              // Other type images — smaller
              sec.type !== 'brochure-fill' && sec.type !== 'reading-portrait' && !sec.personCards && !sec.infoCard && !sec.imageGrid && sec.imageUrl ? React.createElement('img', { src: sec.imageUrl, style: { width: '60%', maxHeight: '50mm', objectFit: 'contain', borderRadius: '6px', marginBottom: '4mm', border: '1px solid #ddd', display: 'block', margin: '0 auto 4mm' }, crossOrigin: 'anonymous' }) : null,
              // Passage with bold support
              sec.passage ? React.createElement('div', { style: { fontSize: '18pt', marginBottom: '5mm', lineHeight: 1.7, padding: '4mm', background: '#f8f8f8', borderRadius: '4px', border: '1px solid #eee', whiteSpace: 'pre-line' } },
                React.createElement(RichText, { text: sec.passage })
              ) : null,
              // Items — matching format (|||) as two columns
              sec.items.some(it => it.includes('|||')) ?
                React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginTop: '4mm' } },
                  React.createElement('div', { style: { borderRight: '2px dashed #999', paddingRight: '6mm' } },
                    ...sec.items.filter(it => it.trim()).map((item, i) =>
                      React.createElement('div', { key: `w${i}`, style: { fontSize: '18pt', marginBottom: '5mm', fontWeight: 700 } }, item.split('|||')[0].trim())
                    )
                  ),
                  React.createElement('div', { style: { paddingLeft: '6mm' } },
                    ...sec.items.filter(it => it.trim()).map((item, i) =>
                      React.createElement('div', { key: `m${i}`, style: { fontSize: '18pt', marginBottom: '5mm' } }, item.split('|||')[1]?.trim() || '')
                    )
                  ),
                )
              :
              // Regular items — type-aware
              sec.type === 'chronological-order' ?
              // D: circle + box layout
              React.createElement('div', null,
                ...sec.items.filter(it => it.trim()).map((item, i) =>
                  React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: '4mm', marginBottom: '4mm' } },
                    React.createElement('div', { style: { width: '12mm', height: '12mm', borderRadius: '50%', border: '2.5px solid #3f51b5', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt', color: '#3f51b5' } }),
                    React.createElement('div', { style: { flex: 1, border: '1.5px solid #5c6bc0', borderRadius: '8px', background: '#f5f5ff', padding: '3mm 4mm', fontSize: '16pt', lineHeight: 1.5 } }, item),
                  )
                ),
              ) :
              React.createElement('div', null,
                ...sec.items.filter(it => it.trim()).map((item, i) =>
                  React.createElement('div', { key: i, style: { fontSize: sec.type === 'brochure-fill' ? '14pt' : '16pt', marginBottom: sec.type === 'brochure-fill' ? '1mm' : '3mm', paddingLeft: '3mm', lineHeight: 1.3, whiteSpace: 'pre-line' } }, item)
                ),
              ),
            ),
            // Footer on last page
            si === sections.length - 1 ? React.createElement('div', { style: { marginTop: '20mm', display: 'flex', justifyContent: 'space-around', textAlign: 'center', borderTop: '1px solid #999', paddingTop: '4mm' } },
              ...teachers.filter(t => t.name.trim()).map((t, i) =>
                React.createElement('div', { key: i },
                  React.createElement('div', { style: { fontSize: '10pt' } }, t.name),
                  React.createElement('div', { style: { fontSize: '10pt', color: '#333' } }, t.title),
                )
              )
            ) : null,
          )
        );

        await new Promise(r => setTimeout(r, 600));
        const canvas = await html2canvas(pageDiv.firstElementChild as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
        if (si > 0) doc.addPage();
        doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, ph);
        root.unmount();
      }

      document.body.removeChild(container);
      doc.save(`sinav-grup-${BEP_GROUP}-18pt-${Date.now()}.pdf`);
      return;
    }

    // Normal export — offscreen render to avoid scale issues from preview
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.zIndex = '-1';
    document.body.appendChild(container);

    const { createRoot } = await import('react-dom/client');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    for (let pn = 1; pn <= 2; pn++) {
      const pageDiv = document.createElement('div');
      container.appendChild(pageDiv);
      const root = createRoot(pageDiv);

      root.render(
        React.createElement(ExamPage, {
          pageNum: pn as 1 | 2,
          groupLetter: activeGroup,
          sections,
          schoolName,
          examTitle,
          academicYear,
          teachers,
          grayscale: grayscalePdf,
          innerRef: { current: null } as any,
          layout,
          gradeLevel,
          pageBreakAfter: gradeLevel === '9' ? 4 : 2,
          hideFooter: activeGroup === 'Ö',
        })
      );

      await new Promise(r => setTimeout(r, 400));
      const target = pageDiv.firstElementChild as HTMLElement;
      if (target) {
        const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
        if (pn > 1) doc.addPage();
        doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pw, ph);
      }
      root.unmount();
    }

    document.body.removeChild(container);
    doc.save(`sinav-grup-${activeGroup}-${Date.now()}.pdf`);
  };

  /* ═══════════ RENDER ═══════════ */
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* ═══ Top Bar ═══ */}
      <div className="relative flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 py-3 shadow-sm backdrop-blur">
        {/* Left */}
        {/* Sol: Başlık */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-extrabold text-slate-900">Sınav Oluşturucu</p>
          <span className="text-[10px] text-slate-400">Grup <span className={`font-black ${gc.text}`}>{activeGroup}</span> · {totalPoints}p</span>
          {examSaveText && <span className="text-[9px] text-emerald-600">{examSaveText}</span>}
        </div>

        {/* Orta: Sınıf seçimi */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {(['9', '10', '11', '12'] as const).map(g => (
            <button key={g} type="button" onClick={() => handleGradeChange(g)}
              className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${gradeLevel === g ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{g}</button>
          ))}
        </div>

        {/* Sağ: KAYDET + Ayarlar + Kapat */}
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={saveExamToFirestore} disabled={examSyncing} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50">KAYDET</button>
          <button type="button" onClick={() => setShowSettings((p) => !p)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${showSettings ? `${gc.light} ${gc.text} border ${gc.border}` : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Ayarlar</button>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition">Kapat</button>
        </div>
      </div>

      {/* ═══ Satır 2: Grup butonları + Sınav Örneği ═══ */}
      <div className="flex items-center justify-between px-5 py-1.5 border-b border-slate-100 bg-white/60">
        <div className="flex items-center gap-1">
          <button type="button" onClick={prevGroup} disabled={groupIdx === 0} className="rounded-full border border-slate-200 bg-white p-1 text-slate-400 transition hover:bg-slate-50 disabled:opacity-25"><ChevLeft /></button>
          {GROUP_LETTERS.map((g) => {
            const c = GROUP_COLORS[g];
            const filled = groups[g]?.some((s) => s.instruction.trim());
            const isBepGroup = g === BEP_GROUP;
            return (
              <button key={g} type="button" onClick={() => { setActiveGroup(g); setActiveSectionIdx(0); setShowLargePreview(false); }}
                className={`flex items-center justify-center rounded-lg text-xs font-black transition ${isBepGroup ? 'h-8 px-2.5' : 'h-8 w-8'} ${
                  g === activeGroup ? `${c.bg} border ${c.border} text-white shadow-sm` : filled ? `border ${c.border}/40 ${c.light} ${c.text}` : 'border border-slate-200 bg-white text-slate-300'
                }`}>{isBepGroup ? <>{g}<span className="text-[7px] ml-0.5">(BEP)</span></> : g}</button>
            );
          })}
          <button type="button" onClick={nextGroup} disabled={groupIdx === GROUP_LETTERS.length - 1} className="rounded-full border border-slate-200 bg-white p-1 text-slate-400 transition hover:bg-slate-50 disabled:opacity-25"><ChevRight /></button>

          <button type="button" onClick={() => { setActiveGroup(BEP_GROUP); setActiveSectionIdx(0); setShowLargePreview(true); }}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
              activeGroup === BEP_GROUP && showLargePreview ? 'bg-orange-500 text-white' : 'border border-orange-200 text-orange-600 hover:bg-orange-50'
            }`}>{BEP_GROUP}(18pt)</button>
        </div>

        {/* Export butonları */}
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => exportCurrentGroupPdf()} className={`rounded-lg ${gc.bg} px-2.5 py-1 text-[10px] font-bold text-white transition hover:opacity-90`}>Grup {activeGroup} PDF</button>
          <button type="button" onClick={() => exportCurrentGroupPdf(true)} className="rounded-lg bg-orange-500 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-orange-600">{BEP_GROUP}(18pt)</button>
          <button type="button" onClick={() => exportPdf()} className="rounded-lg bg-slate-700 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-slate-800">Tüm Gruplar</button>
          <button type="button" onClick={() => exportAnswerKey()} className="rounded-lg bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-red-600">Cevap Anahtarı</button>
          <button type="button" onClick={() => exportStudyGuide()} className="rounded-lg bg-teal-500 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-teal-600">Çalışma Kağıdı</button>
        </div>
      </div>

      {/* ═══ Section Tabs ═══ */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-white/60 px-5 py-2 backdrop-blur">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Bölümler</span>
        {sections.map((s, idx) => {
          const sl = String.fromCharCode(65 + idx);
          const active = idx === activeSectionIdx;
          const filled = s.instruction.trim();
          return (
            <button key={s.id} type="button" onClick={() => setActiveSectionIdx(idx)}
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold transition-all duration-150 ${
                active ? `${gc.border} ${gc.light} ${gc.text} shadow-sm` : filled ? 'border-slate-200 bg-white text-slate-600 hover:border-slate-400' : 'border-slate-100 bg-slate-50 text-slate-300'
              }`}>
              <span className="font-black">{sl}</span>
              <span className="text-[9px] font-normal opacity-60">{calcPoints(s.scoring)}p</span>
            </button>
          );
        })}
        <button type="button" onClick={addSection} className="flex h-9 items-center rounded-xl border-2 border-dashed border-slate-200 px-4 text-xs font-bold text-slate-400 transition hover:border-indigo-300 hover:text-indigo-500">+</button>
      </div>

      {/* ═══ Body ═══ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-3xl space-y-5">
            {/* Settings */}
            {showSettings && (
              <div className={`rounded-2xl border ${gc.border}/30 ${gc.light}/50 p-5 shadow-sm`}>
                <p className={`mb-3 text-xs font-bold uppercase tracking-widest ${gc.text}`}>Sınav Ayarları</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div><label className="mb-1 block text-[11px] font-semibold text-slate-500">Öğretim Yılı</label><input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
                  <div className="md:col-span-2"><label className="mb-1 block text-[11px] font-semibold text-slate-500">Okul Adı</label><input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
                  <div className="md:col-span-3"><label className="mb-1 block text-[11px] font-semibold text-slate-500">Sınav Başlığı</label><input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" /></div>
                </div>
                <p className={`mt-5 mb-2 text-[11px] font-bold uppercase tracking-widest ${gc.text}`}>İmza Alanı</p>
                <div className="space-y-2">
                  {teachers.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">{idx + 1}</span>
                      <input value={t.name} onChange={(e) => updateTeacher(idx, 'name', e.target.value)} placeholder="Ad Soyad" className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm focus:border-indigo-400 focus:outline-none" />
                      <input value={t.title} onChange={(e) => updateTeacher(idx, 'title', e.target.value)} placeholder="Unvan" className="w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm focus:border-indigo-400 focus:outline-none" />
                    </div>
                  ))}
                </div>

                {/* Extra tools */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                  <button type="button" onClick={() => setShowLayoutTuner((p) => !p)} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${showLayoutTuner ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                    Layout Ayarları
                  </button>
                  <button type="button" onClick={() => setGrayscalePdf((p) => !p)} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${grayscalePdf ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>
                    {grayscalePdf ? 'S/B Açık' : 'Renkli'}
                  </button>
                  <button type="button" onClick={() => setShowFullPreview(true)} className="rounded-xl border border-indigo-400 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                    Tam Ekran Önizleme
                  </button>
                </div>
              </div>
            )}

            {/* Layout Tuner */}
            {showLayoutTuner && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 shadow-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-600">Layout Ayarları (sürükle)</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3">
                  {([
                    ['topMargin', 'Üst Boşluk', 8, 30, 'mm'],
                    ['sideMargin', 'Yan Boşluk', 8, 25, 'mm'],
                    ['groupLetterSize', 'Grup Harfi', 24, 60, 'pt'],
                    ['schoolNameSize', 'Okul Adı Font', 8, 16, 'pt'],
                    ['examTitleSize', 'Sınav Başlığı Font', 8, 16, 'pt'],
                    ['gapTitleToLine', 'Baslik → Cizgi', 12, 30, 'mm'],
                    ['gapLineToInfo', 'Çizgi → İsim Alanı', 2, 12, 'mm'],
                    ['studentInfoSize', 'İsim Font', 8, 14, 'pt'],
                    ['underlineGap', 'Çizgi Mesafesi', 1, 8, 'mm'],
                    ['gapInfoToSection', 'İsim → Bölüm A', 4, 20, 'mm'],
                    ['sectionHeaderSize', 'BölümBasligi Font', 7, 14, 'pt'],
                    ['gapHeaderToContent', 'Başlık → İçerik', 0, 6, 'mm'],
                    ['bodyTextSize', 'Metin Font', 6, 12, 'pt'],
                    ['questionSize', 'Soru Font', 6, 12, 'pt'],
                    ['gapBetweenQuestions', 'Sorular Arası', 2, 10, 'mm'],
                    ['gapBetweenSections', 'Bölümler Arası', 0, 10, 'mm'],
                    ['imageRatio', 'Görsel Oranı', 0.2, 0.6, ''],
                    ['footerFromBottom', 'Imza Alt Mesafe', 12, 30, 'mm'],
                    ['footerNameSize', 'İmza İsim Font', 6, 12, 'pt'],
                    ['footerTitleSize', 'İmza Ünvan Font', 5, 10, 'pt'],
                  ] as [string, string, number, number, string][]).map(([key, label, min, max, unit]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-semibold text-slate-600">{label}</label>
                        <span className="text-[10px] font-bold text-orange-700">{(layout as any)[key]}{unit}</span>
                      </div>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={key === 'imageRatio' ? 0.01 : 0.5}
                        value={(layout as any)[key]}
                        onChange={(e) => setL(key, parseFloat(e.target.value))}
                        className="mt-1 w-full accent-orange-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Editor Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className={`flex items-center justify-between border-b border-slate-100 px-5 py-3.5 ${gc.light}/30`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${gc.bg} text-lg font-black text-white shadow-md`}>
                    {String.fromCharCode(65 + activeSectionIdx)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Grup {activeGroup} — Bölüm{String.fromCharCode(65 + activeSectionIdx)}</p>
                    <p className="text-[10px] text-slate-400">{getTypeLabel(section.type)} &middot; {section.scoring} &middot; {calcPoints(section.scoring)} puan</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowBank(true)} className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-[11px] font-bold text-amber-800 shadow-sm transition hover:bg-amber-100">Soru Bankası</button>
                  {sections.length > 1 && (
                    <button type="button" onClick={() => removeSection(activeSectionIdx)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-bold text-rose-600 shadow-sm hover:bg-rose-100">Sil</button>
                  )}
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">Soru Tipi</label>
                    <select value={section.type} onChange={(e) => updateSection({ type: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                      {questionBank.questionTypes.map((qt) => (<option key={qt.id} value={qt.id}>{qt.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">Puanlama</label>
                    <input value={section.scoring} onChange={(e) => updateSection({ scoring: e.target.value })} placeholder="4x5=20" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">Yönerge</label>
                  <input value={section.instruction} onChange={(e) => updateSection({ instruction: e.target.value })} placeholder="Read the text and answer..." className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>

                {/* Image */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-500">Görsel</label>
                    <button type="button" onClick={() => setShowAiPrompt(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 px-3.5 py-1.5 text-[11px] font-bold text-purple-700 shadow-sm transition hover:from-purple-100 hover:to-indigo-100">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 10.8 6.8 7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2z"/><path d="M18.5 13.5 17.9 15.4 16 16l1.9.6.6 1.9.6-1.9 1.9-.6-1.9-.6z"/><path d="M6 14.5 5.4 16.4 3.5 17l1.9.6.6 1.9.6-1.9 1.9-.6-1.9-.6z"/></svg>
                      AI Görsel Oluştur
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input value={section.imageUrl || ''} onChange={(e) => updateSection({ imageUrl: e.target.value || undefined })} placeholder="/yazili/brochure-tree.jpg" className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm focus:border-indigo-400 focus:outline-none" />
                    {section.imageUrl && <button type="button" onClick={() => updateSection({ imageUrl: undefined })} className="shrink-0 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-100">Kaldir</button>}
                  </div>
                  {section.imageUrl && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                      <img src={section.imageUrl} alt="" className="max-h-44 w-full rounded-lg object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">Metin / Parça</label>
                  <textarea value={section.passage} onChange={(e) => updateSection({ passage: e.target.value })} rows={4} placeholder="Okuma parcasi, brosur, hikaye..." className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-500">Sorular / Maddeler</label>
                    <button type="button" onClick={addItem} className={`rounded-lg border ${gc.border}/40 ${gc.light} px-2.5 py-1 text-[10px] font-bold ${gc.text} hover:opacity-80`}>+ Ekle</button>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500">{i + 1}</span>
                        <input value={item} onChange={(e) => updateItem(i, e.target.value)} placeholder="Soru veya madde..." className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm focus:border-indigo-400 focus:outline-none" />
                        {section.items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="shrink-0 rounded-lg border border-rose-200 p-1.5 text-rose-400 hover:bg-rose-50"><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-between pb-4">
              <button type="button" onClick={() => setActiveSectionIdx((p) => Math.max(0, p - 1))} disabled={activeSectionIdx === 0} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-400 disabled:opacity-25"><ChevLeft /> Onceki</button>
              <span className="text-xs font-semibold text-slate-400">Grup {activeGroup} &middot; {String.fromCharCode(65 + activeSectionIdx)} / {sections.length}</span>
              <button type="button" onClick={() => setActiveSectionIdx((p) => Math.min(sections.length - 1, p + 1))} disabled={activeSectionIdx === sections.length - 1} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-400 disabled:opacity-25">Sonraki <ChevRight /></button>
            </div>
          </div>
        </div>

        {/* ── Resize Handle ── */}
        <div
          className="hidden w-2 shrink-0 cursor-col-resize bg-slate-200 hover:bg-indigo-300 active:bg-indigo-400 transition-colors md:flex items-center justify-center"
          onMouseDown={(e) => {
            resizeRef.current = { dragging: true, startX: e.clientX, startW: previewWidth };
            const onMove = (ev: MouseEvent) => {
              if (!resizeRef.current.dragging) return;
              const diff = resizeRef.current.startX - ev.clientX;
              setPreviewWidth(Math.max(300, Math.min(900, resizeRef.current.startW + diff)));
            };
            const onUp = () => {
              resizeRef.current.dragging = false;
              window.removeEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            <div className="h-1 w-1 rounded-full bg-slate-400" />
            <div className="h-1 w-1 rounded-full bg-slate-400" />
          </div>
        </div>

        {/* ── A4 WYSIWYG Live Preview ── */}
        <div className="hidden shrink-0 overflow-y-auto border-l border-slate-200 bg-gradient-to-b from-slate-100 to-slate-200 p-4 md:block" style={{ width: `${previewWidth}px` }}>
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {showLargePreview ? `${BEP_GROUP}(BEP) 18pt Önizleme` : `WYSIWYG Önizleme — Grup ${activeGroup}`}
          </p>

          {showLargePreview ? (
            /* ── 18pt Preview: each section as its own "page" ── */
            <div className="flex flex-col items-center gap-4">
              {sections.map((sec, si) => {
                const sl = String.fromCharCode(65 + si);
                const scale = (previewWidth - 40) / 794;
                return (
                  <React.Fragment key={si}>
                    <div className="text-center text-[10px] font-bold text-orange-500 tracking-widest">Sayfa {si + 1}</div>
                    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: `${-297 * (1 - scale)}mm` }}>
                      <div style={{ width: '210mm', height: '297mm', padding: '12mm 15mm', background: '#fff', fontFamily: 'system-ui, sans-serif', fontSize: '18pt', lineHeight: 1.7, color: '#1a1a1a', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', border: '2px solid #f97316' }}>
                        {si === 0 && (
                          <div style={{ marginBottom: '8mm' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4mm' }}>
                              <div style={{ fontSize: '36pt', fontWeight: 900 }}>{BEP_GROUP}</div>
                              <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '12pt', fontWeight: 600 }}>{academicYear} {schoolName}</div>
                                <div style={{ fontSize: '13pt', fontWeight: 700, marginTop: '1mm' }}>{examTitle}</div>
                              </div>
                              <img src={kemalAtayLogo} alt="" style={{ width: '12mm', height: '12mm', objectFit: 'contain' }} />
                            </div>
                            <div style={{ borderTop: '2px solid #333', marginTop: '3mm', marginBottom: '4mm' }} />
                            <div style={{ fontSize: '14pt', fontWeight: 600 }}>Name – Surname: _________________________  Class: _______  Number: _______</div>
                          </div>
                        )}
                        {si > 0 && (
                          <div style={{ textAlign: 'right', fontSize: '9pt', color: '#999', marginBottom: '4mm' }}>{examTitle} — Sayfa {si + 1}</div>
                        )}
                        <div style={{ fontSize: '20pt', fontWeight: 800, marginBottom: '5mm', borderBottom: '2px solid #555', paddingBottom: '2mm' }}>{sl}. {sec.instruction}</div>
                        {/* PersonCards — 18pt preview */}
                        {sec.personCards && sec.personCards.length > 0 && (
                          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sec.personCards.length}, 1fr)`, gap: '4mm', marginBottom: '5mm' }}>
                            {sec.personCards.map((pc: PersonCard, pi: number) => (
                              <div key={pi} style={{ textAlign: 'center' }}>
                                {pc.imageUrl && <img src={pc.imageUrl} alt="" style={{ width: '25mm', height: '25mm', borderRadius: pc.text ? '50%' : '6px', objectFit: 'cover', border: `2px solid ${pc.borderColor || '#90caf9'}`, display: 'block', margin: '0 auto 2mm' }} crossOrigin="anonymous" />}
                                <div style={{ background: pc.bgColor || '#e3f2fd', borderRadius: '6px', padding: '3px 6px', fontSize: '14pt', lineHeight: 1.5 }}>{pc.text || pc.name}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* InfoCard — 18pt preview */}
                        {sec.infoCard && (
                          <div style={{ display: 'flex', gap: '5mm', marginBottom: '5mm', border: '1.5px solid #b3e5fc', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, #e1f5fe 0%, #fff 100%)' }}>
                            {sec.infoCard.imageUrl && <img src={sec.infoCard.imageUrl} alt="" style={{ width: '35mm', height: '35mm', objectFit: 'cover', flexShrink: 0 }} crossOrigin="anonymous" />}
                            <div style={{ padding: '3mm', fontSize: '14pt', lineHeight: 1.7, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              {sec.infoCard.fields.map((f: {label:string;value:string}, fi: number) => (
                                <div key={fi}><strong>{f.label}: </strong>{f.value}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* ImageGrid — 18pt preview */}
                        {sec.imageGrid && sec.imageGrid.length > 0 && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm', marginBottom: '5mm', width: '60%', marginLeft: 'auto' }}>
                            {sec.imageGrid.map((img: string, gi: number) => (
                              <div key={gi} style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '2px', left: '4px', background: '#fff', borderRadius: '3px', padding: '0 4px', fontSize: '10pt', fontWeight: 700 }}>{gi + 1}</div>
                                <img src={img} alt="" style={{ width: '100%', borderRadius: '6px', border: '1px solid #ccc' }} crossOrigin="anonymous" />
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Reading-portrait image — 18pt preview */}
                        {sec.type === 'reading-portrait' && sec.imageUrl && <img src={sec.imageUrl} alt="" style={{ width: '30mm', height: '30mm', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd', float: 'left', marginRight: '4mm', marginBottom: '2mm' }} crossOrigin="anonymous" />}
                        {sec.type === 'brochure-fill' && sec.imageUrl && <img src={sec.imageUrl} alt="" style={{ width: '100%', maxHeight: '120mm', objectFit: 'contain', borderRadius: '6px', marginBottom: '2mm', border: '1px solid #ddd' }} />}
                        {sec.type !== 'brochure-fill' && sec.type !== 'reading-portrait' && !sec.personCards && !sec.infoCard && !sec.imageGrid && sec.imageUrl && <img src={sec.imageUrl} alt="" style={{ width: '60%', maxHeight: '50mm', objectFit: 'contain', borderRadius: '6px', marginBottom: '5mm', border: '1px solid #ddd', display: 'block', margin: '0 auto 5mm' }} />}
                        {sec.passage && (
                          <div style={{ fontSize: '18pt', marginBottom: '5mm', lineHeight: 1.7, padding: '4mm', background: '#f8f8f8', borderRadius: '4px', whiteSpace: 'pre-line' }}>
                            <RichText text={sec.passage} />
                          </div>
                        )}
                        {sec.items.some(it => it.includes('|||')) ? (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginTop: '2mm' }}>
                            <div style={{ borderRight: '2px dashed #999', paddingRight: '4mm' }}>
                              {sec.items.filter(it => it.trim()).map((item, i) => (
                                <div key={i} style={{ fontSize: '18pt', marginBottom: '4mm', fontWeight: 700 }}>{item.split('|||')[0].trim()}</div>
                              ))}
                            </div>
                            <div style={{ paddingLeft: '4mm' }}>
                              {sec.items.filter(it => it.trim()).map((item, i) => (
                                <div key={i} style={{ fontSize: '18pt', marginBottom: '4mm' }}>{item.split('|||')[1]?.trim()}</div>
                              ))}
                            </div>
                          </div>
                        ) : sec.type === 'chronological-order' ? (
                          sec.items.filter(it => it.trim()).map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4mm', marginBottom: '4mm' }}>
                              <div style={{ width: '12mm', height: '12mm', borderRadius: '50%', border: '2.5px solid #3f51b5', background: '#fff', flexShrink: 0 }} />
                              <div style={{ flex: 1, border: '1.5px solid #5c6bc0', borderRadius: '8px', background: '#f5f5ff', padding: '3mm 4mm', fontSize: '16pt', lineHeight: 1.5 }}>{item}</div>
                            </div>
                          ))
                        ) : (
                          sec.items.filter(it => it.trim()).map((item, i) => (
                            <div key={i} style={{ fontSize: sec.type === 'brochure-fill' ? '14pt' : '18pt', marginBottom: sec.type === 'brochure-fill' ? '1mm' : '4mm', paddingLeft: '4mm', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{item}</div>
                          ))
                        )}
                        {si === sections.length - 1 && teachers.some(t => t.name.trim()) && (
                          <div style={{ marginTop: '15mm', display: 'flex', justifyContent: 'space-around', textAlign: 'center', borderTop: '1px solid #999', paddingTop: '4mm' }}>
                            {teachers.filter(t => t.name.trim()).map((t, i) => (
                              <div key={i}>
                                <div style={{ fontSize: '10pt' }}>{t.name}</div>
                                <div style={{ fontSize: '10pt', color: '#333' }}>{t.title}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            /* ── Normal 2-page preview ── */
            <div className="flex flex-col items-center gap-4">
              <div className="text-center text-[10px] font-bold text-slate-400 tracking-widest">Sayfa 1</div>
              <div style={{ transform: `scale(${(previewWidth - 40) / 794})`, transformOrigin: 'top center', marginBottom: `${-297 * (1 - (previewWidth - 40) / 794)}mm` }}>
                <ExamPage
                  pageNum={1}
                  groupLetter={activeGroup}
                  sections={sections}
                  schoolName={schoolName}
                  examTitle={examTitle}
                  academicYear={academicYear}
                  teachers={teachers}
                  grayscale={grayscalePdf}
                  innerRef={page1Ref}
                  layout={layout}
                  gradeLevel={gradeLevel}
                  pageBreakAfter={gradeLevel === '9' ? 4 : 2}
                  hideFooter={activeGroup === 'Ö'}
                />
              </div>
              <div className="text-center text-[10px] font-bold text-slate-400 tracking-widest">Sayfa 2</div>
              <div style={{ transform: `scale(${(previewWidth - 40) / 794})`, transformOrigin: 'top center', marginBottom: `${-297 * (1 - (previewWidth - 40) / 794)}mm` }}>
                <ExamPage
                  pageNum={2}
                  groupLetter={activeGroup}
                  sections={sections}
                  schoolName={schoolName}
                  examTitle={examTitle}
                  academicYear={academicYear}
                  teachers={teachers}
                  grayscale={grayscalePdf}
                  innerRef={page2Ref}
                  layout={layout}
                  gradeLevel={gradeLevel}
                  pageBreakAfter={gradeLevel === '9' ? 4 : 2}
                  hideFooter={activeGroup === 'Ö'}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Bank Picker ═══ */}
      {showBank && (
        <div className="fixed inset-0 z-[1700] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={() => setShowBank(false)}>
          <div className="w-full max-w-2xl max-h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Soru Bankası</p>
                <p className="text-[10px] text-slate-400">Grup {activeGroup}, Bölüm{String.fromCharCode(65 + activeSectionIdx)} için seç</p>
              </div>
              <button type="button" onClick={() => setShowBank(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:border-slate-400">Kapat</button>
            </div>
            <div className="max-h-[55vh] space-y-2 overflow-y-auto p-4">
              {questionBank.questions.map((q) => (
                <button key={q.id} type="button" onClick={() => loadFromBank(q)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">{q.source}</span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{getTypeLabel(q.type)}</span>
                    </div>
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{q.scoring}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-600">{q.instruction}</p>
                  {q.passage && <p className="mt-1 line-clamp-1 text-[10px] text-slate-400">{q.passage.slice(0, 120)}...</p>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Full Screen Preview ═══ */}
      {showFullPreview && (
        <div className="fixed inset-0 z-[1800] flex flex-col bg-slate-900/60 backdrop-blur">
          <div className="flex items-center justify-between bg-white/95 px-5 py-3 shadow-md backdrop-blur">
            <p className="text-sm font-extrabold text-slate-900">Tam Ekran Önizleme — Grup {activeGroup}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => exportCurrentGroupPdf()} className="rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">PDF Indir</button>
              <button type="button" onClick={() => setShowFullPreview(false)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-500">Kapat</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex flex-col items-center gap-6">
              <div className="text-center text-xs font-bold text-white/60 tracking-widest">Sayfa 1</div>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                <ExamPage
                  pageNum={1}
                  groupLetter={activeGroup}
                  sections={sections}
                  schoolName={schoolName}
                  examTitle={examTitle}
                  academicYear={academicYear}
                  teachers={teachers}
                  grayscale={grayscalePdf}
                  innerRef={{ current: null } as any}
                  layout={layout}
                  gradeLevel={gradeLevel}
                  pageBreakAfter={gradeLevel === '9' ? 4 : 2}
                  hideFooter={activeGroup === 'Ö'}
                />
              </div>
              <div className="text-center text-xs font-bold text-white/60 tracking-widest">Sayfa 2</div>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                <ExamPage
                  pageNum={2}
                  groupLetter={activeGroup}
                  sections={sections}
                  schoolName={schoolName}
                  examTitle={examTitle}
                  academicYear={academicYear}
                  teachers={teachers}
                  grayscale={grayscalePdf}
                  innerRef={{ current: null } as any}
                  layout={layout}
                  gradeLevel={gradeLevel}
                  pageBreakAfter={gradeLevel === '9' ? 4 : 2}
                  hideFooter={activeGroup === 'Ö'}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ AI Image Generator Modal ═══ */}
      {showAiPrompt && (
        <div className="fixed inset-0 z-[1700] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={() => !aiLoading && setShowAiPrompt(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 10.8 6.8 7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2z"/><path d="M18.5 13.5 17.9 15.4 16 16l1.9.6.6 1.9.6-1.9 1.9-.6-1.9-.6z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900">AI Görsel Oluştur</p>
                  <p className="text-[10px] text-slate-400">Gemini Imagen ile gorsel uret</p>
                </div>
              </div>
              <button type="button" onClick={() => !aiLoading && setShowAiPrompt(false)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-slate-400">Kapat</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">Prompt (Ingilizce oner)</label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  placeholder="Ornekler:&#10;• A brochure for tree planting campaign, green eco theme&#10;• A poster about human rights, colorful modern design&#10;• A news article layout about school festival"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  disabled={aiLoading}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['A brochure for environmental campaign, green eco theme, modern design', 'A poster about human rights awareness, colorful educational style', 'A scholarship announcement poster, professional university style', 'A news article layout about school science fair'].map((p) => (
                  <button key={p} type="button" onClick={() => setAiPrompt(p)} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] text-slate-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700">
                    {p.slice(0, 45)}...
                  </button>
                ))}
              </div>
              {aiError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700">{aiError}</div>
              )}
              <button
                type="button"
                onClick={generateImage}
                disabled={aiLoading || !aiPrompt.trim()}
                className="w-full rounded-xl border border-purple-600 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40"
              >
                {aiLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" /></svg>
                    Oluşturuluyor...
                  </span>
                ) : 'Görsel Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
