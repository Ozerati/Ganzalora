import { gid } from '../constants';
import type { ExamSection } from '../types';

/* ═══ 10. SINIF GRUP A ═══ */
export function makeGroup10A(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-names', scoring: '4x5=20',
      instruction: 'Read the text and write the names under the correct pictures. (K.E10.5.R2) (4x5=20)',
      passage: 'Last summer, four friends chose very different holidays.\n\nEmma spent a week in Antalya. She stayed at a beach resort, swam in the sea every day, and enjoyed traditional Turkish cuisine at seaside restaurants. She also relaxed in a Turkish bath.\n\nDaniel travelled to Rome. He visited historical landmarks such as the Colosseum and the Vatican Museum. He joined guided tours and learned about ancient architecture.\n\nSophie went to Norway. She hiked in the mountains, explored national parks, and took photos of waterfalls. She said it was the most breathtaking scenery she had ever seen.\n\nLeo preferred something more exciting. He travelled to Costa Rica and tried zip-lining and white-water rafting. He described it as a thrilling and unforgettable experience.',
      imageGrid: ['/yazili/10sinif/a-rome.png', '/yazili/10sinif/a-fishing.png', '/yazili/10sinif/a-swimming.png', '/yazili/10sinif/a-hiking.png'],
      items: [
        '1. _______________',
        '2. _______________',
        '3. _______________',
        '4. _______________',
      ],
    },
    {
      id: gid(), label: 'B', type: 'travel-brochure', scoring: '4x5=20',
      instruction: 'Create your own travel brochure for your favorite city by answering the questions below. Write one sentence for each category. (K.E10.5.W2) (4x5=20)',
      passage: '- Where can you stay?\n- How can you travel around the city?\n- What are the traditional dishes?\n- Which historic places can you see?',
      items: [
        'City Name: _______________',
        'a. Accommodation: _______________',
        'b. Transportation: _______________',
        'c. Traditional Dishes: _______________',
        'd. Historic Sites: _______________',
      ],
    },
    {
      id: gid(), label: 'C', type: 'reading-text', scoring: '4x5=20',
      instruction: 'Read the text and answer the questions. (E10.6.R1) (4x5=20)',
      passage: '**Online Class Reminder – Student Council**\n\nDear students,\nPlease remember that you must attend your online lessons on time.\nYou should use polite language in the chat.\nStudents mustn\'t send off-topic messages during the lesson.\nYou had better check your internet connection before class.\nIf you ignore these rules, you may miss important information.\nLet\'s create a respectful online environment together!',
      items: [
        '1. What must students do before class?',
        '2. What kind of language should students use?',
        '3. What is forbidden during lessons?',
        '4. What may happen if students ignore the rules?',
      ],
    },
    {
      id: gid(), label: 'D', type: 'personal-qa', scoring: '5x4=20',
      instruction: 'Write the possible consequences by completing the sentences below. (E10.6.W1.) (5x4=20)',
      passage: '',
      items: [
        '1. If you arrive late to school in the morning, ...',
        '2. If you have a toothache, ...',
        '3. If students use their mobile phones in class, ...',
        '4. If you want to stay healthy, ...',
      ],
    },
    {
      id: gid(), label: 'E', type: 'festival-card', scoring: '4x5=20',
      instruction: 'Read the text and complete the table below. (E10.7.R2.) (4x5=20)',
      passage: '**THE INTERNATIONAL TULIP FESTIVAL**\n**ISTANBUL – EVERY APRIL**\n\nThe International Tulip Festival is held in Istanbul every April. It celebrates the blooming of tulips, which are an important symbol of Turkish culture.\n\nDuring the festival, parks are decorated with colourful tulips. Flower carpets are displayed in public squares. Concerts are performed in open areas, and photography competitions are organized.\n\nTraditional Turkish food is served in festival areas. Special tulip-shaped desserts are prepared for visitors.',
      items: [
        'Name of the Event: _______________',
        'Location (City): _______________',
        'Date / Season: _______________',
        'Food & Drink: _______________',
      ],
    },
  ];
}

/* ═══ 10. SINIF GRUP B ═══ */
export function makeGroup10B(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-names', scoring: '4x5=20',
      instruction: 'Read the text and write the names under the correct pictures. (K.E10.5.R2) (4x5=20)',
      passage: 'Last summer, four friends chose very different holidays.\n\nOlivia spent a week in Antalya. She stayed at a beach resort, swam in the sea every day, and enjoyed traditional Turkish cuisine at seaside restaurants. She also relaxed in a Turkish bath.\n\nNoah travelled to Rome. He visited historical landmarks such as the Colosseum and the Vatican Museum. He joined guided tours and learned about ancient architecture.\n\nStella went to Norway. She hiked in the mountains, explored national parks, and took photos of waterfalls. She said it was the most breathtaking scenery she had ever seen.\n\nLiam preferred something more exciting. He travelled to Costa Rica and tried zip-lining and white-water rafting. He described it as a thrilling and unforgettable experience.',
      imageGrid: ['/yazili/10sinif/a-rome.png', '/yazili/10sinif/a-fishing.png', '/yazili/10sinif/a-swimming.png', '/yazili/10sinif/a-hiking.png'],
      items: [
        '1. _______________',
        '2. _______________',
        '3. _______________',
        '4. _______________',
      ],
    },
    {
      id: gid(), label: 'B', type: 'travel-brochure', scoring: '4x5=20',
      instruction: 'Create your own travel brochure for your favorite city by answering the questions below. Write one sentence for each category. (K.E10.5.W2) (4x5=20)',
      passage: '- Where can you stay?\n- How can you travel around the city?\n- What are the traditional dishes?\n- Which historic places can you see?',
      items: [
        'City Name: _______________',
        'a. Accommodation: _______________',
        'b. Transportation: _______________',
        'c. Traditional Dishes: _______________',
        'd. Historic Sites: _______________',
      ],
    },
    {
      id: gid(), label: 'C', type: 'reading-text', scoring: '4x5=20',
      instruction: 'Read the text and answer the questions. (E10.6.R1) (4x5=20)',
      passage: '1. **Lena:** Our school is using too much electricity these days.\n**Mark:** What should we do about it?\n**Lena:** I think students should turn off the lights when they leave the classroom.\n**Mark:** Yes, and they mustn\'t leave computers on during breaks. That\'s a school rule.\n**Lena:** We had better unplug phone chargers when they are not in use.\n**Mark:** Teachers say we must follow the energy-saving policy.\n**Lena:** If we waste electricity, the school will pay higher bills.\n**Mark:** Then everyone should be more responsible.',
      items: [
        '1. What problem does Lena mention?',
        '2. What is the consequence of electricity waste?',
        '3. What does Lena advise students to do when leaving the classroom?',
        '4. What does Mark advise students to do when leaving the classroom?',
      ],
    },
    {
      id: gid(), label: 'D', type: 'personal-qa', scoring: '5x4=20',
      instruction: 'Write the possible consequences by completing the sentences below. (E10.6.W1.) (5x4=20)',
      passage: '',
      items: [
        '1. If students run in the school corridors, ...',
        '2. If you have a stomachache, ...',
        '3. If students don\'t wear uniforms, ...',
        '4. If you want to get a higher grade, ...',
      ],
    },
    {
      id: gid(), label: 'E', type: 'festival-card', scoring: '4x5=20',
      instruction: 'Read the text and complete the table below. (E10.7.R2.) (4x5=20)',
      passage: '**ALAÇATI HERB FESTIVAL**\n**Discover the Taste of Spring in Türkiye!**\n\nLocation: Alaçatı, İzmir\nTime: Every year in April (4-Day Festival)\n\nPurpose: To celebrate local herbs and promote healthy traditional cuisine\n\n**Main Events & Highlights:**\n- Local herbs are displayed and sold in street markets.\n- Cooking competitions are organized by famous chefs.\n- Traditional Aegean dishes are prepared with fresh herbs.',
      items: [
        'Name of the Festival: _______________',
        'Location (City): _______________',
        'Date / Season: _______________',
        'Purpose: _______________',
      ],
    },
  ];
}

/* ═══ 10. SINIF GRUP T — TELAFİ SINAVI ═══ */
export function makeGroup10T(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-names', scoring: '4x5=20',
      instruction: 'Read the text and write the names under the correct pictures. (K.E10.5.R2) (4x5=20)',
      passage: 'Last winter, four friends chose very different holidays.\n\nMia spent a week in Dubai. She stayed at a luxury hotel, visited the tallest building in the world, and enjoyed traditional Arabian cuisine. She also went on a desert safari.\n\nJake travelled to London. He visited historical landmarks such as the Tower of London and Buckingham Palace. He joined a guided tour on a double-decker bus and learned about British history.\n\nChloe went to Japan. She visited ancient temples, tried sushi at a local restaurant, and watched a traditional tea ceremony. She said it was the most fascinating cultural experience.\n\nRyan preferred something adventurous. He travelled to New Zealand and tried bungee jumping and skydiving. He described it as the most exciting week of his life.',
      imageGrid: ['/yazili/10sinif/10sinif-t-dubai.png', '/yazili/10sinif/10sinif-t-london.png', '/yazili/10sinif/10sinif-t-japan.png', '/yazili/10sinif/10sinif-t-newzealand.png'],
      items: [
        '1. _______________',
        '2. _______________',
        '3. _______________',
        '4. _______________',
      ],
    },
    {
      id: gid(), label: 'B', type: 'travel-brochure', scoring: '4x5=20',
      instruction: 'Create your own travel brochure for your favorite city by answering the questions below. Write one sentence for each category. (K.E10.5.W2) (4x5=20)',
      passage: '- Where can you stay?\n- How can you travel around the city?\n- What are the traditional dishes?\n- Which historic places can you see?',
      items: [
        'City Name: _______________',
        'a. Accommodation: _______________',
        'b. Transportation: _______________',
        'c. Traditional Dishes: _______________',
        'd. Historic Sites: _______________',
      ],
    },
    {
      id: gid(), label: 'C', type: 'reading-text', scoring: '4x5=20',
      instruction: 'Read the text and answer the questions. (E10.6.R1) (4x5=20)',
      passage: '**School Rules Reminder – Academic Integrity**\n\nDear students,\nYou must not cheat during exams. You should use respectful language with teachers and classmates.\nStudents mustn\'t use someone else\'s work without permission.\nYou had better prepare your materials before class.\nIf you break these rules, you may face disciplinary action.\nLet\'s build a fair and honest learning environment!',
      items: [
        '1. What must students not do during exams?',
        '2. What kind of language should they use?',
        '3. What is not allowed regarding other people\'s work?',
        '4. What may happen if students break the rules?',
      ],
    },
    {
      id: gid(), label: 'D', type: 'personal-qa', scoring: '5x4=20',
      instruction: 'Write the possible consequences by completing the sentences below. (E10.6.W1.) (5x4=20)',
      passage: '',
      items: [
        '1. If you don\'t study for the exam, ...',
        '2. If you eat too much junk food, ...',
        '3. If students don\'t do their homework, ...',
        '4. If you want to learn a new language, ...',
      ],
    },
    {
      id: gid(), label: 'E', type: 'festival-card', scoring: '4x5=20',
      instruction: 'Read the text and complete the table below. (E10.7.R2.) (4x5=20)',
      passage: '**CAPPADOCIA HOT AIR BALLOON FESTIVAL**\n**Nevşehir – Every July**\n\nThe Cappadocia Hot Air Balloon Festival is held in Nevşehir every July. It celebrates the unique landscape and culture of Cappadocia.\n\nDuring the festival, hundreds of colourful hot air balloons fly over the fairy chimneys at sunrise. Photography contests and live music events are organized.\n\nVisitors can enjoy traditional Cappadocian pottery workshops and taste local dishes such as testi kebab.',
      items: [
        'Name of the Event: _______________',
        'Location (City): _______________',
        'Date / Season: _______________',
        'Food & Drink: _______________',
      ],
    },
  ];
}

/* ═══ 10. SINIF ÖRNEK SINAV ═══ */
export function makeGroup10A_sample(): ExamSection[] {
  return [
    {
      id: gid(), label: 'A', type: 'reading-names', scoring: '4x5=20',
      instruction: 'Read the text and write the names under the correct pictures. (K.E10.5.R2) (4x5=20)',
      passage: 'Last spring, four friends planned very different trips.\n\nAva went to Paris. She visited the Eiffel Tower, walked along the Champs-Élysées, and tasted French pastries at a local bakery. She said Paris was the city of her dreams.\n\nEthan travelled to Egypt. He saw the Pyramids of Giza and the Sphinx. He took a boat ride on the Nile River and learned about ancient Egyptian civilization.\n\nLily chose Iceland. She explored glaciers, saw the Northern Lights, and bathed in natural hot springs. She described it as a magical experience.\n\nOliver went to Thailand. He visited Buddhist temples, tried spicy Thai food, and went snorkelling in crystal-clear waters. He called it a paradise on Earth.',
      imageGrid: ['/yazili/10sinif/10sinif-sample-paris.png', '/yazili/10sinif/10sinif-sample-egypt.png', '/yazili/10sinif/10sinif-sample-iceland.png', '/yazili/10sinif/10sinif-sample-thailand.png'],
      items: [
        '1. _______________',
        '2. _______________',
        '3. _______________',
        '4. _______________',
      ],
    },
    {
      id: gid(), label: 'B', type: 'travel-brochure', scoring: '4x5=20',
      instruction: 'Create your own travel brochure for your favorite city by answering the questions below. Write one sentence for each category. (K.E10.5.W2) (4x5=20)',
      passage: '- Where can you stay?\n- How can you travel around the city?\n- What are the traditional dishes?\n- Which historic places can you see?',
      items: [
        'City Name: _______________',
        'a. Accommodation: _______________',
        'b. Transportation: _______________',
        'c. Traditional Dishes: _______________',
        'd. Historic Sites: _______________',
      ],
    },
    {
      id: gid(), label: 'C', type: 'reading-text', scoring: '4x5=20',
      instruction: 'Read the text and answer the questions. (E10.6.R1) (4x5=20)',
      passage: '**Library Rules – School Library**\n\nDear students,\nYou must return books on time.\nYou should keep the library clean and quiet.\nStudents mustn\'t eat or drink in the reading area.\nYou had better use the catalogue system to find books.\nIf you damage a book, you may have to pay for it.\nLet\'s take care of our library together!',
      items: [
        '1. What must students do with library books?',
        '2. How should students behave in the library?',
        '3. What is not allowed in the reading area?',
        '4. What may happen if a student damages a book?',
      ],
    },
    {
      id: gid(), label: 'D', type: 'personal-qa', scoring: '5x4=20',
      instruction: 'Write the possible consequences by completing the sentences below. (E10.6.W1.) (5x4=20)',
      passage: '',
      items: [
        '1. If you go to bed late every night, ...',
        '2. If you have a headache, ...',
        '3. If students talk during the exam, ...',
        '4. If you want to make new friends, ...',
      ],
    },
    {
      id: gid(), label: 'E', type: 'festival-card', scoring: '4x5=20',
      instruction: 'Read the text and complete the table below. (E10.7.R2.) (4x5=20)',
      passage: '**ANTALYA GOLDEN ORANGE FILM FESTIVAL**\n**Antalya – Every October**\n\nThe Antalya Golden Orange Film Festival is held in Antalya every October. It is the oldest film festival in Turkey, celebrating Turkish and international cinema.\n\nDuring the festival, films are screened in open-air theatres along the coast. Award ceremonies, panel discussions, and workshops are organized for filmmakers.\n\nVisitors can enjoy local Mediterranean cuisine at festival venues, including fresh seafood and traditional Turkish desserts.',
      items: [
        'Name of the Event: _______________',
        'Location (City): _______________',
        'Date / Season: _______________',
        'Food & Drink: _______________',
      ],
    },
  ];
}
