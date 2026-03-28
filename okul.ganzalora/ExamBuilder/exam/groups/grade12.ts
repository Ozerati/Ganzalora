import { gid } from '../constants';
import type { ExamSection } from '../types';

/* ═══ GRUP A ═══ */
export function makeGroupA(): ExamSection[] {
  return [
    {
      id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20',
      instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)',
      passage: '',
      imageUrl: '/yazili/brochure-a.png',
      items: ['Foundation year :', 'Campaign date :', 'Venue :', 'Motto:'],
    },
    {
      id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20',
      instruction: 'Read the text about the hotel fire. Based on the clues provided, find and list the exact word used in the text. (5x4=20)',
      passage: 'Last night, a large fire broke out in a historic hotel downtown. As the flames began to spread, firefighters rushed to the scene. First, the rescue teams managed to **evacuate** all the guests from the burning building. Fortunately, everyone **survived** the terrifying event without any serious **injuries**.\n\nAfter the fire was put out, the police questioned several **witnesses** to understand exactly what had happened. Investigators are suspicious that an old heater in the basement caused the fire. Although the exact cost of the damage is still unknown, the estimated loss is over two million dollars. People in the town consider it a true **miracle** that no lives were lost.',
      imageUrl: '/yazili/hotel-fire.png',
      items: ['Clue: Stayed alive or got away from danger safely.', 'Clue: To move or save people from a dangerous place.', 'Clue: Physical harm or damage to the body.', 'Clue: An amazing event that is very hard to believe.', 'Clue: People who saw an event happen.'],
    },
    {
      id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20',
      instruction: 'Imagine that you are a member of a charity organization for animal rights. Complete the blanks to invite people to an event of your charity organization. Write 5 pieces of information. (5x4=20)',
      passage: '',
      imageUrl: '/yazili/charity-dog.png',
      items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'],
    },
    {
      id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20',
      instruction: 'Read the sentences about a football match carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)',
      passage: '',
      items: ['Afterwards, the referee blew the final whistle and the home team won.', 'Next, the players entered the field while the fans cheered loudly.', 'Finally, the fans celebrated the victory outside the stadium.', 'Then, in the second half, the home team scored the winning goal.', 'First, hundreds of fans filled the stadium to support their teams.'],
    },
    {
      id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20',
      instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)',
      passage: 'THE DAILY WELLBEING\nWALKING MAKES YOU HAPPIER\nA new study shows that walking in a park can greatly improve your mood. Scientists discovered that people who take a short walk every day feel less stressed and more relaxed. Because of this, health experts suggest that everyone should spend a little more time outdoors.',
      imageUrl: '/yazili/walking-park.png',
      items: [],
    },
  ];
}

/* ═══ GRUP B ═══ */
export function makeGroupB(): ExamSection[] {
  return [
    {
      id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20',
      instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)',
      passage: '',
      imageUrl: '/yazili/brochure-b.png',
      items: ['Foundation year :', 'Campaign date :', 'Venue :', 'Motto:'],
    },
    {
      id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20',
      instruction: 'Read the text about the hotel fire. Based on the clues provided, find and list the exact word used in the text. (5x4=20)',
      passage: 'Last night, a large fire broke out in a historic hotel downtown. As the flames began to spread, firefighters rushed to the scene. First, the firefighters managed to **rescue** all the guests from the burning building. Fortunately, everyone **escaped** the terrifying event without any serious **wounds**.\n\nAfter the fire was put out, the police questioned several **observers** to understand exactly what had happened. Investigators are suspicious that an old heater in the basement caused the fire. Although the exact cost of the damage is still unknown, the estimated loss is over two million dollars. People in the town consider it a true **wonder** that no lives were lost.',
      imageUrl: '/yazili/hotel-fire.png',
      items: ['Clue: An amazing event that is very hard to believe.', 'Clue: To save people from a dangerous place.', 'Clue: Physical harm or damage to the body.', 'Clue: Got away safely from a dangerous situation.', 'Clue: People who saw an event happen.'],
    },
    {
      id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20',
      instruction: 'Imagine that you are a member of a charity organization for children\'s rights. Complete the blanks to invite people to an event of your charity organization. Write 5 pieces of information. (5x4=20)',
      passage: '',
      imageUrl: '/yazili/children-rights.png',
      items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'],
    },
    {
      id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20',
      instruction: 'Read the sentences about a football match carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)',
      passage: '',
      items: ['First, hundreds of fans filled the stadium to support their teams.', 'Finally, the fans celebrated the victory outside the stadium.', 'Afterwards, the referee blew the final whistle and the home team won.', 'Next, the players entered the field while the fans cheered loudly.', 'Then, in the second half, the home team scored the winning goal.'],
    },
    {
      id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20',
      instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)',
      passage: 'THE DAILY WELLBEING\nWALKING MAKES YOU HAPPIER\nA new study shows that walking in a park can greatly improve your mood. Scientists discovered that people who take a short walk every day feel less stressed and more relaxed. Because of this, health experts suggest that everyone should spend a little more time outdoors.',
      imageUrl: '/yazili/walking-park.png',
      items: [],
    },
  ];
}

/* ═══ GRUP C ═══ */
export function makeGroupC(): ExamSection[] {
  return [
    {
      id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20',
      instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)',
      passage: '',
      imageUrl: '/yazili/brochure-c.png',
      items: ['Foundation year :', 'Campaign date :', 'Venue :', 'Motto:'],
    },
    {
      id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20',
      instruction: 'Read the text about the hotel fire. Based on the clues provided, find and list the exact word used in the text. (5x4=20)',
      passage: 'Last night, a large fire broke out in a historic hotel downtown. As the flames began to spread, firefighters rushed to the scene. First, the rescue teams managed to **evacuate** all the guests from the burning building. Fortunately, everyone **survived** the terrifying event without any serious **injuries**.\n\nAfter the fire was put out, the police questioned several **witnesses** to understand exactly what had happened. Investigators are suspicious that an old heater in the basement caused the fire. Although the exact cost of the damage is still unknown, the estimated loss is over two million dollars. People in the town consider it a true **miracle** that no lives were lost.',
      imageUrl: '/yazili/hotel-fire.png',
      items: ['Clue: An amazing event that is very hard to believe.', 'Clue: Physical harm or damage to the body.', 'Clue: Stayed alive or got away from danger safely.', 'Clue: To move or save people from a dangerous place.', 'Clue: People who saw an event happen.'],
    },
    {
      id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20',
      instruction: 'Imagine that you are a member of a charity organization for animal rights. Complete the blanks to invite people to an event of your charity organization. Write 5 pieces of information. (5x4=20)',
      passage: '',
      imageUrl: '/yazili/charity-dog.png',
      items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'],
    },
    {
      id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20',
      instruction: 'Read the sentences about a football match carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)',
      passage: '',
      items: ['Then, in the second half, the home team scored the winning goal.', 'First, hundreds of fans filled the stadium to support their teams.', 'Afterwards, the referee blew the final whistle and the home team won.', 'Finally, the fans celebrated the victory outside the stadium.', 'Next, the players entered the field while the fans cheered loudly.'],
    },
    {
      id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20',
      instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)',
      passage: 'THE DAILY WELLBEING\nWALKING MAKES YOU HAPPIER\nA new study shows that walking in a park can greatly improve your mood. Scientists discovered that people who take a short walk every day feel less stressed and more relaxed. Because of this, health experts suggest that everyone should spend a little more time outdoors.',
      imageUrl: '/yazili/walking-park.png',
      items: [],
    },
  ];
}

/* ═══ GRUP D ═══ */
export function makeGroupD(): ExamSection[] {
  return [
    {
      id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20',
      instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)',
      passage: '',
      imageUrl: '/yazili/brochure-d.png',
      items: ['Foundation year :', 'Campaign date :', 'Venue :', 'Motto:'],
    },
    {
      id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20',
      instruction: 'Read the text about the hotel fire. Based on the clues provided, find and list the exact word used in the text. (5x4=20)',
      passage: 'Last night, a large fire broke out in a historic hotel downtown. As the flames began to spread, firefighters rushed to the scene. First, the firefighters managed to **rescue** all the guests from the burning building. Fortunately, everyone **escaped** the terrifying event without any serious **wounds**.\n\nAfter the fire was put out, the police questioned several **observers** to understand exactly what had happened. Investigators are suspicious that an old heater in the basement caused the fire. Although the exact cost of the damage is still unknown, the estimated loss is over two million dollars. People in the town consider it a true **wonder** that no lives were lost.',
      imageUrl: '/yazili/hotel-fire.png',
      items: ['Clue: People who saw an event happen.', 'Clue: Stayed alive or got away from danger safely.', 'Clue: An amazing event that is very hard to believe.', 'Clue: To move or save people from a dangerous place.', 'Clue: Physical harm or damage to the body.'],
    },
    {
      id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20',
      instruction: 'Imagine that you are a member of a charity organization for children\'s rights. Complete the blanks to invite people to an event of your charity organization. Write 5 pieces of information. (5x4=20)',
      passage: '',
      imageUrl: '/yazili/children-rights.png',
      items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'],
    },
    {
      id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20',
      instruction: 'Read the sentences about a football match carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)',
      passage: '',
      items: ['Finally, the fans celebrated the victory outside the stadium.', 'Then, in the second half, the home team scored the winning goal.', 'First, hundreds of fans filled the stadium to support their teams.', 'Next, the players entered the field while the fans cheered loudly.', 'Afterwards, the referee blew the final whistle and the home team won.'],
    },
    {
      id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20',
      instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)',
      passage: 'THE DAILY WELLBEING\nWALKING MAKES YOU HAPPIER\nA new study shows that walking in a park can greatly improve your mood. Scientists discovered that people who take a short walk every day feel less stressed and more relaxed. Because of this, health experts suggest that everyone should spend a little more time outdoors.',
      imageUrl: '/yazili/walking-park.png',
      items: [],
    },
  ];
}

/* ═══ GRUP E — BEP: Basitlestirilmis, bol gorselli, Turkce aciklamali ═══ */
export function makeGroupE(): ExamSection[] {
  return [
    {
      id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20',
      instruction: '\u{1F333} Read the brochure and choose the correct answer. (Bro\u015F\u00FCr\u00FC oku ve do\u011Fru cevab\u0131 se\u00E7.) (4x5=20)',
      passage: '',
      imageUrl: '/yazili/brochure-a.png',
      items: [
        '\u{1F333} When is the campaign? (Kampanya ne zaman?)\n    a) March 10th       b) April 18th       c) May 5th',
        '\u{1F4CD} Where is the campaign? (Kampanya nerede?)\n    a) Ankara Park       b) \u0130nciralt\u0131 City Park       c) Beach',
        '\u{1F3AF} What is the aim? (Ama\u00E7 nedir?)\n    a) Plant trees       b) Build houses       c) Clean streets',
        '\u{1F4C5} The association was founded in ___. (Dernek ___ y\u0131l\u0131nda kuruldu.)\n    a) 2010       b) 2015       c) 2020',
      ],
    },
    {
      id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20',
      instruction: '\u{1F525} Read the text. Match the bold words with their meanings. (Metni oku. Koyu kelimeleri anlamlar\u0131yla e\u015Fle\u015Ftir.) (5x4=20)',
      passage: 'Last night, a **fire** broke out in a hotel. **Firefighters** came to help. They moved all the **guests** out of the building. Everyone was **safe**. The police talked to people who saw the event. It was a **miracle** that no one was hurt.',
      imageUrl: '/yazili/bep-firefighter.png',
      items: [
        '1. fire ||| a) not in danger',
        '2. firefighters ||| b) an amazing event',
        '3. guests ||| c) flames that burn things',
        '4. safe ||| d) people staying at a hotel',
        '5. miracle ||| e) people who stop fires',
      ],
    },
    {
      id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20',
      instruction: '\u{1F43E} Look at the poster. Fill in the blanks with the words from the box. (Postere bak. Bo\u015Fluklar\u0131 kutudaki kelimelerle doldur.) (5x4=20)',
      passage: '\u{1F4E6} Words (Kelimeler):\nSunday \u2014 help animals \u2014 City Park \u2014 donation \u2014 March 30th',
      imageUrl: '/yazili/charity-dog.png',
      items: [
        'Event name: __________',
        'Date: __________',
        'Place: __________',
        'How to help: __________',
        'Day: __________',
      ],
    },
    {
      id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20',
      instruction: '\u26BD Put the sentences in order. Write 1, 2, 3, 4, 5. (C\u00FCmleleri s\u0131raya koy. 1, 2, 3, 4, 5 yaz.) (5x4=20)',
      passage: '\u{1F4D6} Helpful words (Yard\u0131mc\u0131 kelimeler):\nFirst = \u0130lk / \u00D6nce  |  Next = Sonra  |  Then = Daha sonra  |  Afterwards = Ondan sonra  |  Finally = En son',
      items: [
        '\u2B1C Finally, the home team won the match. \u{1F3C6}',
        '\u2B1C First, the fans came to the stadium. \u{1F465}',
        '\u2B1C Then, the match started. \u{1F3DF}\uFE0F',
        '\u2B1C Afterwards, the home team scored a goal. \u26BD',
        '\u2B1C Next, the players entered the field. \u{1F3C3}',
      ],
    },
    {
      id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20',
      instruction: '\u{1F6B6} Read the text and choose the correct answer. (Metni oku ve do\u011Fru cevab\u0131 se\u00E7.) (2x10=20)',
      passage: 'THE DAILY WELLBEING\n\u{1F6B6} WALKING MAKES YOU HAPPIER\n\u{1F333} Walking in a park makes people happy. People who walk every day feel less stressed. Experts say we should spend more time outdoors.',
      imageUrl: '/yazili/walking-park.png',
      items: [
        '1. Walking in a park makes people ________.\n    a) sad \u{1F622}       b) happy \u{1F60A}       c) angry \u{1F620}',
        '2. Experts say we should spend more time ________.\n    a) indoors \u{1F3E0}       b) at school \u{1F3EB}       c) outdoors \u{1F333}',
      ],
    },
  ];
}

/* ═══ 12. SINIF GRUP T — TELAFİ SINAVI ═══ */
export function makeGroupT(): ExamSection[] {
  return [
    { id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20', instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)', passage: '', imageUrl: '/yazili/12sinif/telafi-brochure.png', items: ['Foundation year :', 'Campaign date :', 'Venue :', 'Motto:'] },
    { id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20', instruction: 'Read the text about the earthquake. Based on the clues provided, find and list the exact word used in the text. (5x4=20)', passage: 'Last month, a powerful earthquake struck the coastal city. Buildings started to collapse, and people ran into the streets. The **volunteers** arrived within hours and began distributing food and blankets. Despite the **destruction**, the community showed incredible **solidarity**. Many families were **relocated** to temporary shelters. Experts said the quick **response** of rescue teams saved many lives.', items: ['Clue: People who work without being paid to help others.', 'Clue: Severe damage caused by a disaster.', 'Clue: Unity and support among people.', 'Clue: Moved to a new place for safety.', 'Clue: The action of reacting quickly to an emergency.'] },
    { id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20', instruction: 'Imagine that you are organizing a school charity event. Complete the blanks to invite people to the event. Write 5 pieces of information. (5x4=20)', passage: '', imageUrl: '/yazili/12sinif/telafi-email.png', items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'] },
    { id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20', instruction: 'Read the sentences about a school trip carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)', passage: '', items: ['Then, the students visited the museum and took notes.', 'First, the teacher announced the trip date to the class.', 'Finally, the students wrote a report about their experience.', 'Afterwards, they had lunch at a restaurant near the museum.', 'Next, the bus picked up the students from the school.'] },
    { id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20', instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)', passage: 'THE DAILY SCIENCE\nBOOKS MAKE YOU SMARTER\nA recent study reveals that reading books for at least 30 minutes a day can improve memory and reduce anxiety. Researchers found that regular readers have better focus and wider vocabulary. They encourage everyone, especially young people, to develop a reading habit.', items: [] },
  ];
}

/* ═══ 12. SINIF GRUP A — SINAV ÖRNEĞİ ═══ */
export function makeGroupA_sample(): ExamSection[] {
  return [
    {
      id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20',
      instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)',
      passage: '',
      imageUrl: '/yazili/12sinif/ornek-brochure.png',
      items: ['Foundation year :', 'Campaign date :', 'Venue :', 'Motto:'],
    },
    {
      id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20',
      instruction: 'Read the text about the flood. Based on the clues provided, find and list the exact word used in the text. (5x4=20)',
      passage: 'Last week, heavy rain caused severe flooding in a small village. Many homes were **submerged** under water. The local government quickly **deployed** rescue boats to save stranded families. Several **shelters** were opened for those who lost their homes. The community showed great **compassion** by donating clothes and food. Scientists warned that such floods could become more **frequent** due to climate change.',
      imageUrl: '/yazili/12sinif/ornek-flood.png',
      items: ['Clue: Covered completely by water.', 'Clue: Sent out or put into action.', 'Clue: Safe places where people can stay temporarily.', 'Clue: A feeling of deep sympathy for others.', 'Clue: Happening often or many times.'],
    },
    {
      id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20',
      instruction: 'Imagine that you are organizing a book donation event at your school. Complete the blanks to invite people. Write 5 pieces of information. (5x4=20)',
      passage: '',
      imageUrl: '/yazili/12sinif/ornek-bookdonate.png',
      items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'],
    },
    {
      id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20',
      instruction: 'Read the sentences about a science fair carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)',
      passage: '',
      items: ['Then, students set up their projects in the school hall.', 'Finally, the winners received their prizes at the ceremony.', 'First, the teacher announced the science fair to the class.', 'Next, each student chose a topic and started researching.', 'Afterwards, the judges visited each stand and asked questions.'],
    },
    {
      id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20',
      instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)',
      passage: 'THE DAILY EDUCATION\nREADING CHANGES LIVES\nA new survey shows that students who read at least two books a month score higher on exams. Experts say reading improves vocabulary and critical thinking. They recommend that schools create more reading programs for students.',
      items: [],
    },
  ];
}

/* ═══ 12. SINIF GRUP B — SINAV ÖRNEĞİ ═══ */
export function makeGroupB_sample(): ExamSection[] {
  return [
    { id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20', instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)', passage: '', items: ['Organization name :', 'Event date :', 'Location :', 'Slogan:'] },
    { id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20', instruction: 'Read the text about a traffic accident. Based on the clues provided, find and list the exact word used in the text. (5x4=20)', passage: 'Yesterday, a serious traffic accident happened on the highway. Two cars **collided** at high speed near the exit ramp. The ambulance **paramedics** arrived quickly and treated the **casualties** at the scene. One driver was in critical condition and was **hospitalized** immediately. Police officers blocked the road and began their **investigation** to find out the cause of the crash.', items: ['Clue: Crashed into each other.', 'Clue: Medical workers in an ambulance.', 'Clue: People who are injured or killed in an accident.', 'Clue: Taken to a hospital for treatment.', 'Clue: A careful examination to find out what happened.'] },
    { id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20', instruction: 'Imagine that you are a member of a sports club. Complete the blanks to invite people to a marathon event. Write 5 pieces of information. (5x4=20)', passage: '', items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'] },
    { id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20', instruction: 'Read the sentences about a birthday party carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)', passage: '', items: ['Afterwards, everyone sang "Happy Birthday" together.', 'First, they decorated the house with colorful balloons.', 'Finally, the guests left with party favors and big smiles.', 'Next, the guests arrived with presents and flowers.', 'Then, the birthday cake was brought to the table.'] },
    { id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20', instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)', passage: 'THE DAILY HEALTH\nSLEEP IS THE BEST MEDICINE\nDoctors say that sleeping 7-8 hours a night is essential for good health. A lack of sleep can cause memory problems, weight gain, and poor concentration. Scientists strongly recommend avoiding screens before bedtime.', items: [] },
  ];
}

/* ═══ 12. SINIF GRUP C — SINAV ÖRNEĞİ ═══ */
export function makeGroupC_sample(): ExamSection[] {
  return [
    { id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20', instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)', passage: '', items: ['Organization name :', 'Event date :', 'Location :', 'Slogan:'] },
    { id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20', instruction: 'Read the text about recycling. Based on the clues provided, find and list the exact word used in the text. (5x4=20)', passage: 'Our city started a new recycling program last month. Every household must **separate** their waste into different bins. The program aims to **reduce** the amount of plastic going to landfills. Many **volunteers** joined the campaign to educate people about recycling. The mayor said the **initiative** has already shown great results. She hopes other cities will **adopt** similar programs soon.', items: ['Clue: To divide things into different groups.', 'Clue: To make something smaller in amount.', 'Clue: People who help without being paid.', 'Clue: A new plan or program to solve a problem.', 'Clue: To start using a new idea or method.'] },
    { id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20', instruction: 'Imagine that you are organizing a tree planting day at your school. Complete the blanks to invite people. Write 5 pieces of information. (5x4=20)', passage: '', items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'] },
    { id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20', instruction: 'Read the sentences about a cooking competition carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)', passage: '', items: ['Next, the contestants received their ingredients.', 'First, the host welcomed the audience and the contestants.', 'Then, everyone started cooking their signature dish.', 'Finally, the judges announced the winner of the competition.', 'Afterwards, the judges tasted each dish carefully.'] },
    { id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20', instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)', passage: 'THE DAILY TECHNOLOGY\nSOCIAL MEDIA AND TEENAGERS\nA study reveals that teenagers who spend more than three hours a day on social media are more likely to feel anxious. Psychologists recommend limiting screen time and spending more time on outdoor activities. Parents should talk to their children about safe internet use.', items: [] },
  ];
}

/* ═══ 12. SINIF GRUP D — SINAV ÖRNEĞİ ═══ */
export function makeGroupD_sample(): ExamSection[] {
  return [
    { id: gid(), label: '1', type: 'brochure-fill', scoring: '4x5=20', instruction: 'Read the brochure and complete the phrases with the correct details. (4x5=20)', passage: '', items: ['Organization name :', 'Event date :', 'Location :', 'Slogan:'] },
    { id: gid(), label: '2', type: 'word-clue', scoring: '5x4=20', instruction: 'Read the text about a music festival. Based on the clues provided, find and list the exact word used in the text. (5x4=20)', passage: 'Thousands of people gathered at the annual music **festival** last weekend. Famous bands **performed** on the main stage all day long. The **audience** sang and danced under the stars. Food trucks offered delicious meals at **affordable** prices. The organizers **donated** a portion of the ticket sales to local charities.', items: ['Clue: A large public event with music and entertainment.', 'Clue: Played music or acted on stage.', 'Clue: The group of people watching a show.', 'Clue: Not expensive; reasonably priced.', 'Clue: Gave money or goods to help others.'] },
    { id: gid(), label: '3', type: 'email-writing', scoring: '5x4=20', instruction: 'Imagine that you are organizing a clean-up day at a local beach. Complete the blanks to invite people. Write 5 pieces of information. (5x4=20)', passage: '', items: ['Join Us to ...', 'Aim of the event: ...', 'Date: ...', 'Place: ...', 'You can contribute by: ...'] },
    { id: gid(), label: '4', type: 'chronological-order', scoring: '5x4=20', instruction: 'Read the sentences about a school concert carefully. Then, write the numbers (1-5) in the boxes to arrange the events in the correct chronological order. (5x4=20)', passage: '', items: ['Then, the choir performed three beautiful songs.', 'Finally, the principal thanked everyone for coming.', 'Afterwards, the students played musical instruments on stage.', 'First, the audience took their seats in the school hall.', 'Next, the school band opened the concert with a popular melody.'] },
    { id: gid(), label: '5', type: 'paraphrase', scoring: '2x10=20', instruction: 'Read the news below and paraphrase it in at least two sentences. (2x10=20)', passage: 'THE DAILY SPORTS\nEXERCISE BOOSTS YOUR BRAIN\nResearchers have found that regular physical activity improves brain function. Just 20 minutes of exercise a day can increase concentration and memory. Schools are now being encouraged to add more physical education classes to their programs.', items: [] },
  ];
}
