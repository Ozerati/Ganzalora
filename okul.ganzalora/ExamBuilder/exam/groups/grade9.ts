import { gid } from '../constants';
import type { ExamSection } from '../types';

/* ═══ 9. SINIF GRUP A ═══ */
export function makeGroup9A(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-qa', scoring: '3x5=15',
      instruction: 'Read the speeches and answer the questions. (ENG.9.4.R3) (3x5=15)',
      passage: '',
      personCards: [
        { name: 'Jack', text: 'Jack is a security guard. He works at a large shopping centre. He monitors the building and checks people\'s IDs.', imageUrl: '/yazili/9sinif/a-jack.png', bgColor: '#e3f2fd', borderColor: '#90caf9' },
        { name: 'Rita', text: 'Rita is a digital marketer. She works remotely and promotes products on social media platforms.', imageUrl: '/yazili/9sinif/a-rita.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
        { name: 'Mike', text: 'Mike is a computer programmer. He works at an IT company. He develops software applications.', imageUrl: '/yazili/9sinif/a-mike.png', bgColor: '#fce4ec', borderColor: '#ef9a9a' },
      ],
      items: [
        '1. What is Rita\'s job?',
        '2. Where does Jack work?',
        '3. What does Mike do at work?',
      ],
    },
    {
      id: gid(), label: 'B', type: 'writing-card', scoring: '3x5=15',
      instruction: 'Read the card and write 3 sentences about Martin. (ENG.9.4.W4) (3x5=15)',
      passage: '',
      infoCard: {
        imageUrl: '/yazili/9sinif/a-martin.png',
        fields: [
          { label: 'Name', value: 'Martin White' },
          { label: 'Job', value: 'Psychologist' },
          { label: 'Workplace', value: 'Clinic' },
          { label: 'Activity', value: 'counsel people with emotional problems' },
        ],
      },
      items: [
        '1.',
        '2.',
        '3.',
      ],
    },
    {
      id: gid(), label: 'C1', type: 'reading-names', scoring: '4x3=12',
      instruction: 'Read the text, look at the pictures and write the correct names. (ENG.9.4.V1) (4x3=12)',
      passage: 'My name is Rita. In my family, everyone has a different job. My mother, **Julia**, is a scientist. She works in a science lab. She researches new topics and conducts experiments every day. My father, **Mark**, is an architect. He works in an architecture firm. He designs buildings and prepares plans for new projects. My aunt, **Clara**, is a journalist. She works at a news agency. She reports news and publishes articles online. My older brother, **Leo**, is a photographer. He works in a photography studio. He shoots photographs for clients.',
      imageGrid: ['/yazili/9sinif/a-c1-julia.png', '/yazili/9sinif/a-c1-mark.png', '/yazili/9sinif/a-c1-clara.png', '/yazili/9sinif/a-c1-leo.png'],
      items: [
        '1. _______________',
        '2. _______________',
        '3. _______________',
        '4. _______________',
      ],
    },
    {
      id: gid(), label: 'C2', type: 'workplace-table', scoring: '4x2=8',
      instruction: 'Write the workplaces in the text. (4x2=8)',
      passage: '',
      items: ['', '', '', ''],
    },
    {
      id: gid(), label: 'D', type: 'reading-portrait', scoring: '4x4=16',
      instruction: 'Read the text and answer the questions. (ENG.9.5.R2) (4x4=16)',
      imageUrl: '/yazili/9sinif/a-d-oliver.png',
      passage: 'Hello, I am Oliver, and I am 15 years old. I live in a semi-detached house in a peaceful town. Downstairs, there is a sitting room and a kitchen. Upstairs, there are three bedrooms and a bathroom. In the sitting room, we have a sofa, an armchair, and a coffee table. There is also a large carpet. In the kitchen, we have a dishwasher, a cooker, and a fridge.\nEvery morning, I make my bed and tidy up my room. After dinner, my father washes the dishes. At the moment, my mother is preparing dinner, and my sister is reading a book in her bedroom. Home sweet home!',
      items: [
        '1. What type of house does Oliver live in?',
        '2. What does Oliver do every morning?',
        '3. What appliances are there in the kitchen?',
        '4. What is his mother doing right now?',
      ],
    },
    {
      id: gid(), label: 'E', type: 'picture-verbs', scoring: '3x6=18',
      instruction: 'Look at the pictures. Write what the people are doing now. Use the verbs and the places given. There are extra verbs and places. (ENG.9.5.G1) (3x6=18)',
      passage: '**Verbs:** watch TV, read a book, cook, have dinner, study, water the flowers\n**Places:** living room, bedroom, garden, utility room, dining room, bathroom',
      personCards: [
        { name: 'Rita', text: '', imageUrl: '/yazili/9sinif/a-e1-rita.png', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
        { name: 'Martin', text: '', imageUrl: '/yazili/9sinif/a-e2-martin.png', bgColor: '#e3f2fd', borderColor: '#90caf9' },
        { name: 'Sue, Lily and Tim', text: '', imageUrl: '/yazili/9sinif/a-e3-family.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
      ],
      items: [
        '1.',
        '2.',
        '3.',
      ],
    },
    {
      id: gid(), label: 'F', type: 'personal-qa', scoring: '4x4=16',
      instruction: 'Answer the questions about yourself. (ENG.9.5.W3) (4x4=16)',
      passage: '',
      items: [
        'What type of house do you live in?',
        'How many rooms are there in your house?',
        'What furniture is there in your sitting room?',
        'Which room is your favourite? Why?',
      ],
    },
  ];
}

/* ═══ 9. SINIF GRUP B ═══ */
export function makeGroup9B(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-qa', scoring: '3x5=15',
      instruction: 'Read the speeches and answer the questions. (ENG.9.4.R3) (3x5=15)',
      passage: '',
      personCards: [
        { name: 'Emma', text: 'Emma is a content creator. She works from home. She creates videos and shares them on social media platforms.', imageUrl: '/yazili/9sinif/b-emma.png', bgColor: '#f3e5f5', borderColor: '#ce93d8' },
        { name: 'David', text: 'David is a lawyer. He works at a law firm. He defends people in court and prepares legal documents.', imageUrl: '/yazili/9sinif/b-david.png', bgColor: '#e8eaf6', borderColor: '#9fa8da' },
        { name: 'Sarah', text: 'Sarah is a police officer. She works at a police station. She protects people and maintains public safety.', imageUrl: '/yazili/9sinif/b-sarah.png', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
      ],
      items: [
        '1. What is Emma\'s job?',
        '2. Where does David work?',
        '3. What does Sarah do at work?',
      ],
    },
    {
      id: gid(), label: 'B', type: 'writing-card', scoring: '3x5=15',
      instruction: 'Read the card and write 3 sentences about Tom. (ENG.9.4.W4) (3x5=15)',
      passage: '',
      infoCard: {
        imageUrl: '/yazili/9sinif/b-firefighter.png',
        fields: [
          { label: 'Name', value: 'Tom Harris' },
          { label: 'Job', value: 'Firefighter' },
          { label: 'Workplace', value: 'Fire station' },
          { label: 'Activity', value: 'put out fires and rescue people from dangerous situations' },
        ],
      },
      items: [
        '1.',
        '2.',
        '3.',
      ],
    },
    {
      id: gid(), label: 'C1', type: 'reading-names', scoring: '4x3=12',
      instruction: 'Read the text, look at the pictures and write the correct names. (ENG.9.4.V1) (4x3=12)',
      passage: 'My name is Tom. In my family, everyone has a different job. My mother, **Helen**, is a bank clerk. She works at a bank. She helps customers with their accounts and transactions every day. My father, **James**, is a pharmacist. He works at a pharmacy. He prepares medicine and gives advice about health. My aunt, **Olivia**, is a teacher. She works at a school. She teaches English and prepares lesson plans for her students. My older brother, **Ben**, is a photographer. He works in a photography studio. He shoots photographs for clients.',
      imageGrid: ['/yazili/9sinif/b-c1-helen.png', '/yazili/9sinif/b-c1-james.png', '/yazili/9sinif/b-c1-olivia.png', '/yazili/9sinif/b-c1-ben.png'],
      items: [
        '1. _______________',
        '2. _______________',
        '3. _______________',
        '4. _______________',
      ],
    },
    {
      id: gid(), label: 'C2', type: 'workplace-table', scoring: '4x2=8',
      instruction: 'Write the workplaces in the text. (4x2=8)',
      passage: '',
      items: ['', '', '', ''],
    },
    {
      id: gid(), label: 'D', type: 'reading-portrait', scoring: '4x4=16',
      instruction: 'Read the text and answer the questions. (ENG.9.5.R2) (4x4=16)',
      imageUrl: '/yazili/9sinif/b-d-sophie.png',
      passage: 'Hi, I am Sophie, and I am 14 years old. I live in a detached house in a quiet village. Downstairs, there is a living room and a big kitchen. Upstairs, there are two bedrooms and a bathroom. In the living room, we have a bookshelf, two armchairs, and a TV stand. There is also a colorful rug. In the kitchen, we have an oven, a washing machine, and a microwave.\nEvery morning, I set the table for breakfast. After school, my brother vacuums the floor. Right now, my father is washing the car, and my grandmother is knitting a scarf in the garden. I love my home!',
      items: [
        '1. Where does Sophie live?',
        '2. What furniture is there in the living room?',
        '3. What does Sophie do every morning?',
        '4. What is her grandmother doing right now?',
      ],
    },
    {
      id: gid(), label: 'E', type: 'picture-verbs', scoring: '3x6=18',
      instruction: 'Look at the pictures. Write what the people are doing now. Use the verbs and the places given. There are extra verbs and places. (ENG.9.5.G1) (3x6=18)',
      passage: '**Verbs:** cook, watch TV, read a book, water the flowers, do homework, wash the dishes\n**Places:** kitchen, living room, bedroom, garden, bathroom, balcony',
      personCards: [
        { name: 'Tom', text: '', imageUrl: '/yazili/9sinif/b-e1-tom.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
        { name: 'Lucy', text: '', imageUrl: '/yazili/9sinif/b-e2-lucy.png', bgColor: '#f3e5f5', borderColor: '#ce93d8' },
        { name: 'Mr. and Mrs. Adams', text: '', imageUrl: '/yazili/9sinif/b-e3-adams.png', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
      ],
      items: [
        '1.',
        '2.',
        '3.',
      ],
    },
    {
      id: gid(), label: 'F', type: 'personal-qa', scoring: '4x4=16',
      instruction: 'Answer the questions about yourself. (ENG.9.5.W3) (4x4=16)',
      passage: '',
      items: [
        'How many rooms are there in your house?',
        'What type of house do you live in?',
        'Which room is your favourite? Why?',
        'What furniture is there in your sitting room?',
      ],
    },
  ];
}

/* ═══ 9. SINIF GRUP T — TELAFİ SINAVI ═══ */
export function makeGroup9T(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-qa', scoring: '3x5=15',
      instruction: 'Read the speeches and answer the questions. (ENG.9.4.R3) (3x5=15)',
      passage: '',
      personCards: [
        { name: 'Paul', text: 'Paul is an engineer. He works at a construction company. He designs bridges and builds roads.', imageUrl: '/yazili/9sinif/telafi-engineer.png', bgColor: '#e0f7fa', borderColor: '#80deea' },
        { name: 'Diana', text: 'Diana is a farmer. She works on a large farm. She grows vegetables and takes care of animals.', imageUrl: '/yazili/9sinif/telafi-farmer.png', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
        { name: 'Kevin', text: 'Kevin is a dentist. He works at a dental clinic. He checks teeth and treats patients with toothaches.', imageUrl: '/yazili/9sinif/ornek-dentist.png', bgColor: '#fce4ec', borderColor: '#f48fb1' },
      ],
      items: ['1. What is Paul\'s job?', '2. Where does Diana work?', '3. What does Kevin do at work?'],
    },
    {
      id: gid(), label: 'B', type: 'writing-card', scoring: '3x5=15',
      instruction: 'Read the card and write 3 sentences about Lisa. (ENG.9.4.W4) (3x5=15)',
      passage: '',
      infoCard: {
        imageUrl: '/yazili/9sinif/ornek-chef.png',
        fields: [
          { label: 'Name', value: 'Lisa Brown' },
          { label: 'Job', value: 'Chef' },
          { label: 'Workplace', value: 'Restaurant' },
          { label: 'Activity', value: 'prepare meals and create new recipes' },
        ],
      },
      items: ['1.', '2.', '3.'],
    },
    {
      id: gid(), label: 'C1', type: 'reading-names', scoring: '4x3=12',
      instruction: 'Read the text, look at the pictures and write the correct names. (ENG.9.4.V1) (4x3=12)',
      passage: 'My name is Kevin. In my family, everyone has a different job. My mother, **Susan**, is a nurse. She works at a hospital. She takes care of patients and gives medicine every day. My father, **Robert**, is an engineer. He works at a construction company. He designs bridges and builds roads. My aunt, **Nancy**, is a vet. She works at an animal clinic. She treats sick animals and gives vaccinations. My older brother, **Steve**, is a chef. He works at a restaurant. He cooks delicious meals for customers.',
      imageGrid: ['/yazili/9sinif/ornek-c1-nurse.png', '/yazili/9sinif/telafi-engineer.png', '/yazili/9sinif/ornek-vet.png', '/yazili/9sinif/ornek-chef.png'],
      items: ['1. _______________', '2. _______________', '3. _______________', '4. _______________'],
    },
    {
      id: gid(), label: 'C2', type: 'workplace-table', scoring: '4x2=8',
      instruction: 'Write the workplaces in the text. (4x2=8)',
      passage: '',
      items: ['', '', '', ''],
    },
    {
      id: gid(), label: 'D', type: 'reading-portrait', scoring: '4x4=16',
      instruction: 'Read the text and answer the questions. (ENG.9.5.R2) (4x4=16)',
      imageUrl: '/yazili/9sinif/ornek-d-lily.png',
      passage: 'Hello, I am Amy, and I am 15 years old. I live in a flat in a busy city. On the ground floor, there is a living room and a small kitchen. Upstairs, there are two bedrooms and a bathroom. In the living room, we have a TV, a bookshelf, and a rug. In the kitchen, we have a microwave, a toaster, and a fridge.\nEvery evening, I do my homework in my bedroom. After dinner, my brother takes out the rubbish. At the moment, my father is cooking dinner, and my sister is playing the guitar in her room. I love my cozy flat!',
      items: ['1. What type of home does Amy live in?', '2. What does Amy do every evening?', '3. What is there in the kitchen?', '4. What is her father doing right now?'],
    },
    {
      id: gid(), label: 'E', type: 'picture-verbs', scoring: '3x6=18',
      instruction: 'Look at the pictures. Write what the people are doing now. Use the verbs and the places given. There are extra verbs and places. (ENG.9.5.G1) (3x6=18)',
      passage: '**Verbs:** clean the house, play the guitar, cook dinner, sleep, wash the car, iron clothes\n**Places:** kitchen, bedroom, garage, living room, garden, laundry room',
      personCards: [
        { name: 'Amy', text: '', imageUrl: '/yazili/9sinif/ornek-e1.png', bgColor: '#e0f7fa', borderColor: '#80deea' },
        { name: 'Steve', text: '', imageUrl: '/yazili/9sinif/ornek-e2.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
        { name: 'The Johnsons', text: '', imageUrl: '/yazili/9sinif/ornek-e3.png', bgColor: '#f3e5f5', borderColor: '#ce93d8' },
      ],
      items: ['1.', '2.', '3.'],
    },
    {
      id: gid(), label: 'F', type: 'personal-qa', scoring: '4x4=16',
      instruction: 'Answer the questions about yourself. (ENG.9.5.W3) (4x4=16)',
      passage: '',
      items: ['Do you live in a house or a flat?', 'What is your favourite room? Why?', 'What appliances are there in your kitchen?', 'What are you doing right now?'],
    },
  ];
}

/* ═══ 9. SINIF GRUP C — BEP: Basitleştirilmiş, bol görselli, Türkçe açıklamalı ═══ */
export function makeGroup9C(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-qa', scoring: '3x5=15',
      instruction: 'Look at the pictures and choose the correct answer. (Resimlere bak ve do\u011Fru cevab\u0131 se\u00E7.) (ENG.9.4.R3) (3x5=15)',
      passage: '',
      personCards: [
        { name: 'Rita', text: 'Rita works on the internet. She promotes products on social media.', imageUrl: '/yazili/9sinif/a-rita.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
        { name: 'Jack', text: 'Jack works at a big shopping centre. He checks people\'s IDs.', imageUrl: '/yazili/9sinif/a-jack.png', bgColor: '#e3f2fd', borderColor: '#90caf9' },
        { name: 'Mike', text: 'Mike works at an IT company. He makes computer programs.', imageUrl: '/yazili/9sinif/a-mike.png', bgColor: '#fce4ec', borderColor: '#ef9a9a' },
      ],
      items: [
        '1. What is Rita\'s job?\n    a) teacher       b) digital marketer       c) doctor',
        '2. Where does Jack work?\n    a) hospital       b) school       c) shopping centre',
        '3. What does Mike do?\n    a) cooks food       b) drives a bus       c) develops software',
      ],
    },
    {
      id: gid(), label: 'B', type: 'writing-card', scoring: '3x5=15',
      instruction: 'Read the card and complete the sentences. (Kart\u0131 oku ve c\u00FCmleleri tamamla.) (ENG.9.4.W4) (3x5=15)',
      passage: '',
      infoCard: {
        imageUrl: '/yazili/9sinif/a-martin.png',
        fields: [
          { label: 'Name', value: 'Martin White' },
          { label: 'Job', value: 'Psychologist' },
          { label: 'Workplace', value: 'Clinic' },
          { label: 'Activity', value: 'counsel people with emotional problems' },
        ],
      },
      items: [
        '1. Martin is a ________.',
        '2. He works at a ________.',
        '3. He ________ people with emotional problems.',
      ],
    },
    {
      id: gid(), label: 'C1', type: 'reading-names', scoring: '4x3=12',
      instruction: 'Look at the pictures and match the jobs. Write the correct name under each picture. (Resimlere bak ve meslekleri e\u015Fle\u015Ftir.) (ENG.9.4.V1) (4x3=12)',
      passage: '**Jobs (Meslekler):** scientist / architect / journalist / photographer\n\nMy mother, **Julia**, is a scientist. My father, **Mark**, is an architect. My aunt, **Clara**, is a journalist. My brother, **Leo**, is a photographer.',
      imageGrid: ['/yazili/9sinif/a-c1-julia.png', '/yazili/9sinif/a-c1-mark.png', '/yazili/9sinif/a-c1-clara.png', '/yazili/9sinif/a-c1-leo.png'],
      items: [
        '1. _______________',
        '2. _______________',
        '3. _______________',
        '4. _______________',
      ],
    },
    {
      id: gid(), label: 'C2', type: 'workplace-table', scoring: '4x2=8',
      instruction: 'Match the jobs with the workplaces. (Meslekleri i\u015F yerleriyle e\u015Fle\u015Ftir.) (4x2=8)',
      passage: '**Workplaces (\u0130\u015F yerleri):** science lab / architecture firm / news agency / photography studio',
      items: ['scientist \u2192 ________', 'architect \u2192 ________', 'journalist \u2192 ________', 'photographer \u2192 ________'],
    },
    {
      id: gid(), label: 'D', type: 'reading-portrait', scoring: '4x4=16',
      instruction: 'Read the text and write True or False. (Metni oku ve Do\u011Fru/Yanl\u0131\u015F yaz.) (ENG.9.5.R2) (4x4=16)',
      imageUrl: '/yazili/9sinif/a-d-oliver.png',
      passage: 'Hello, I am Oliver. I am 15 years old. I live in a semi-detached house. Downstairs, there is a sitting room and a kitchen. In the kitchen, we have a dishwasher, a cooker, and a fridge. Every morning, I make my bed. My mother is preparing dinner now.',
      items: [
        '1. Oliver lives in a flat. (True / False)',
        '2. There is a dishwasher in the kitchen. (True / False)',
        '3. Oliver makes his bed every evening. (True / False)',
        '4. His mother is preparing dinner now. (True / False)',
      ],
    },
    {
      id: gid(), label: 'E', type: 'picture-verbs', scoring: '3x6=18',
      instruction: 'Look at the pictures and complete the sentences with the words given. (Resimlere bak ve verilen kelimelerle c\u00FCmleleri tamamla.) (ENG.9.5.G1) (3x6=18)',
      passage: '**Words (Kelimeler):** watering / reading / having dinner\n**Places (Yerler):** garden / bedroom / dining room',
      personCards: [
        { name: 'Rita', text: '', imageUrl: '/yazili/9sinif/a-e1-rita.png', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
        { name: 'Martin', text: '', imageUrl: '/yazili/9sinif/a-e2-martin.png', bgColor: '#e3f2fd', borderColor: '#90caf9' },
        { name: 'Sue, Lily and Tim', text: '', imageUrl: '/yazili/9sinif/a-e3-family.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
      ],
      items: [
        '1. Rita is ________ the flowers in the ________.',
        '2. Martin is ________ a book in the ________.',
        '3. Sue, Lily and Tim are ________ in the ________.',
      ],
    },
    {
      id: gid(), label: 'F', type: 'personal-qa', scoring: '4x4=16',
      instruction: 'Answer the questions about yourself. Use the helper words. (Kendin hakk\u0131nda yaz. Yard\u0131mc\u0131 kelimeleri kullan.) (ENG.9.5.W3) (4x4=16)',
      passage: '**Helper words (Yard\u0131mc\u0131 kelimeler):** flat / house / apartment / living room / bedroom / kitchen / sofa / table / bed / bookshelf',
      items: [
        'I live in a ________ (flat / house / apartment).',
        'There are ________ rooms in my house.',
        'In my sitting room, there is a ________.',
        'My favourite room is the ________ because ________.',
      ],
    },
  ];
}

/* ═══ 9. SINIF GRUP A — SINAV ÖRNEĞİ ═══ */
export function makeGroup9A_sample(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-qa', scoring: '3x5=15',
      instruction: 'Read the speeches and answer the questions. (ENG.9.4.R3) (3x5=15)',
      passage: '',
      personCards: [
        { name: 'Tom', text: 'Tom is a pilot. He works at an airport. He flies planes to different countries.', imageUrl: '/yazili/9sinif/ornek-pilot.png', bgColor: '#e3f2fd', borderColor: '#90caf9' },
        { name: 'Anna', text: 'Anna is a chef. She works at a restaurant. She cooks delicious meals for customers.', imageUrl: '/yazili/9sinif/ornek-chef.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
        { name: 'Sam', text: 'Sam is a veterinarian. He works at an animal clinic. He treats sick animals.', imageUrl: '/yazili/9sinif/ornek-vet.png', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
      ],
      items: ['1. What is Anna\'s job?', '2. Where does Tom work?', '3. What does Sam do at work?'],
    },
    {
      id: gid(), label: 'B', type: 'writing-card', scoring: '3x5=15',
      instruction: 'Read the card and write 3 sentences about Emily. (ENG.9.4.W4) (3x5=15)',
      passage: '',
      infoCard: {
        imageUrl: '/yazili/9sinif/ornek-dentist.png',
        fields: [
          { label: 'Name', value: 'Emily Clark' },
          { label: 'Job', value: 'Dentist' },
          { label: 'Workplace', value: 'Hospital' },
          { label: 'Activity', value: 'examine teeth and treat dental problems' },
        ],
      },
      items: ['1.', '2.', '3.'],
    },
    {
      id: gid(), label: 'C1', type: 'reading-names', scoring: '4x3=12',
      instruction: 'Read the text, look at the pictures and write the correct names. (ENG.9.4.V1) (4x3=12)',
      passage: 'My name is Jack. In my family, everyone has a different job. My mother, **Susan**, is a nurse. She works at a hospital. She takes care of patients and gives medicine every day. My father, **Robert**, is a mechanic. He works at a car repair shop. He fixes engines and changes tires for customers. My aunt, **Diana**, is a teacher. She works at a school. She teaches English to young students. My older brother, **Leo**, is a baker. He works at a bakery. He bakes bread and cakes every morning.',
      imageGrid: ['/yazili/9sinif/ornek-c1-nurse.png', '/yazili/9sinif/ornek-c1-mechanic.png', '/yazili/9sinif/ornek-c1-teacher.png', '/yazili/9sinif/ornek-c1-baker.png'],
      items: ['1. _______________', '2. _______________', '3. _______________', '4. _______________'],
    },
    {
      id: gid(), label: 'C2', type: 'workplace-table', scoring: '4x2=8',
      instruction: 'Write the workplaces in the text. (4x2=8)',
      passage: '',
      items: ['', '', '', ''],
    },
    {
      id: gid(), label: 'D', type: 'reading-portrait', scoring: '4x4=16',
      instruction: 'Read the text and answer the questions. (ENG.9.5.R2) (4x4=16)',
      imageUrl: '/yazili/9sinif/ornek-d-lily.png',
      passage: 'Hi, I am Lily, and I am 13 years old. I live in a terraced house in a busy city. Downstairs, there is a kitchen and a dining room. Upstairs, there are two bedrooms and a bathroom. In the dining room, we have a big table and six chairs. There is also a painting on the wall. In the kitchen, we have a toaster, a blender, and a kettle.\nEvery morning, I water the plants in the garden. After dinner, my brother takes out the rubbish. Right now, my father is reading a newspaper, and my mother is doing the laundry.',
      items: ['1. What type of house does Lily live in?', '2. What does Lily do every morning?', '3. What appliances are there in the kitchen?', '4. What is her father doing right now?'],
    },
    {
      id: gid(), label: 'E', type: 'picture-verbs', scoring: '3x6=18',
      instruction: 'Look at the pictures. Write what the people are doing now. Use the verbs and the places given. There are extra verbs and places. (ENG.9.5.G1) (3x6=18)',
      passage: '**Verbs:** sweep the floor, do homework, watch TV, iron the clothes, set the table, take out the rubbish\n**Places:** kitchen, bedroom, living room, garden, balcony, bathroom',
      personCards: [
        { name: 'Jake', text: '', imageUrl: '/yazili/9sinif/ornek-e1.png', bgColor: '#fff3e0', borderColor: '#ffcc80' },
        { name: 'Mia', text: '', imageUrl: '/yazili/9sinif/ornek-e2.png', bgColor: '#f3e5f5', borderColor: '#ce93d8' },
        { name: 'The Wilson Family', text: '', imageUrl: '/yazili/9sinif/ornek-e3.png', bgColor: '#e3f2fd', borderColor: '#90caf9' },
      ],
      items: ['1.', '2.', '3.'],
    },
    {
      id: gid(), label: 'F', type: 'personal-qa', scoring: '4x4=16',
      instruction: 'Answer the questions about yourself. (ENG.9.5.W3) (4x4=16)',
      passage: '',
      items: ['What type of house do you live in?', 'What chores do you do at home?', 'What appliances are there in your kitchen?', 'What is your family doing right now?'],
    },
  ];
}

/* ═══ 9. SINIF GRUP B — SINAV ÖRNEĞİ ═══ */
export function makeGroup9B_sample(): ExamSection[] {
  return [
    { id: gid(), label: 'A', type: 'reading-qa', scoring: '3x5=15', instruction: 'Read the speeches and answer the questions. (ENG.9.4.R3) (3x5=15)', passage: '', personCards: [
        { name: 'Noah', text: 'Noah is a mechanic. He works at a car repair shop. He fixes engines and changes oil for customers.', imageUrl: '', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
        { name: 'Ella', text: 'Ella is a nurse. She works at a city hospital. She takes care of patients and gives injections.', imageUrl: '', bgColor: '#f3e5f5', borderColor: '#ce93d8' },
        { name: 'Jake', text: 'Jake is a vet. He works at an animal clinic. He treats sick cats and dogs every day.', imageUrl: '', bgColor: '#fff3e0', borderColor: '#ffcc80' },
      ], items: ['1. What is Noah\'s job?', '2. Where does Ella work?', '3. What does Jake do at work?'] },
    { id: gid(), label: 'B', type: 'writing-card', scoring: '3x5=15', instruction: 'Read the card and write 3 sentences about Ruby. (ENG.9.4.W4) (3x5=15)', passage: '', infoCard: { imageUrl: '', fields: [{ label: 'Name', value: 'Ruby Taylor' }, { label: 'Job', value: 'Pilot' }, { label: 'Workplace', value: 'Airport' }, { label: 'Activity', value: 'fly planes to different countries' }] }, items: ['1.', '2.', '3.'] },
    { id: gid(), label: 'C1', type: 'reading-names', scoring: '4x3=12', instruction: 'Read the text, look at the pictures and write the correct names. (ENG.9.4.V1) (4x3=12)', passage: 'My name is Ella. In my family, everyone has a different job. My mother, **Patricia**, is a dentist. She works at a dental clinic. She checks teeth and gives fillings every day. My father, **George**, is a firefighter. He works at a fire station. He puts out fires and rescues people from buildings. My aunt, **Linda**, is an accountant. She works at an office. She manages money and prepares financial reports. My older brother, **Sam**, is a waiter. He works at a cafe. He serves food and drinks to customers.', imageGrid: [], items: ['1. _______________', '2. _______________', '3. _______________', '4. _______________'] },
    { id: gid(), label: 'C2', type: 'workplace-table', scoring: '4x2=8', instruction: 'Write the workplaces in the text. (4x2=8)', passage: '', items: ['', '', '', ''] },
    { id: gid(), label: 'D', type: 'reading-portrait', scoring: '4x4=16', instruction: 'Read the text and answer the questions. (ENG.9.5.R2) (4x4=16)', imageUrl: '', passage: 'Hi, I am Ethan, and I am 14 years old. I live in a bungalow in a green village. There is only one floor. We have a living room, a kitchen, two bedrooms, and a bathroom. In the living room, we have a fireplace, a rocking chair, and a TV. There is a thick carpet on the floor. In the kitchen, we have a stove, a refrigerator, and a coffee machine.\nEvery morning, I feed our cat and dog. After lunch, my mother mops the floor. Right now, my father is painting the fence, and my sister is listening to music in her room. Our home is peaceful and warm!', items: ['1. What type of house does Ethan live in?', '2. What does Ethan do every morning?', '3. What is there in the living room?', '4. What is his father doing right now?'] },
    { id: gid(), label: 'E', type: 'picture-verbs', scoring: '3x6=18', instruction: 'Look at the pictures. Write what the people are doing now. Use the verbs and the places given. There are extra verbs and places. (ENG.9.5.G1) (3x6=18)', passage: '**Verbs:** feed the cat, paint the wall, listen to music, mop the floor, set the table, take a shower\n**Places:** kitchen, bedroom, bathroom, living room, garden, hallway', personCards: [
        { name: 'Ethan', text: '', imageUrl: '', bgColor: '#e8f5e9', borderColor: '#a5d6a7' },
        { name: 'Ella', text: '', imageUrl: '', bgColor: '#f3e5f5', borderColor: '#ce93d8' },
        { name: 'Mr. and Mrs. Clark', text: '', imageUrl: '', bgColor: '#fff3e0', borderColor: '#ffcc80' },
      ], items: ['1.', '2.', '3.'] },
    { id: gid(), label: 'F', type: 'personal-qa', scoring: '4x4=16', instruction: 'Answer the questions about yourself. (ENG.9.5.W3) (4x4=16)', passage: '', items: ['How many bedrooms are there in your house?', 'What appliances do you have in your kitchen?', 'Who does the chores in your family?', 'Describe your favourite room in two sentences.'] },
  ];
}
