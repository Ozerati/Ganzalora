/* ─── Answer Keys ─── */
// Shared answers for sections that are same across groups
export const SHARED_C_ANIMAL = ['(Örnek) Join Us to: Protect stray animals in our city', '(Örnek) Aim: Raise awareness about animal rights', '(Örnek) Date: April 25th', '(Örnek) Place: City Park', '(Örnek) You can contribute by: donating food and blankets'];
export const SHARED_C_CHILDREN = ['(Örnek) Join Us to: Support children\'s education rights', '(Örnek) Aim: Collect school supplies for children in need', '(Örnek) Date: May 15th', '(Örnek) Place: Community Center', '(Örnek) You can contribute by: donating books and pencils'];
export const SHARED_E_PARAPHRASE = ['(Örnek) A new study found that walking in a park is good for your health. It helps people feel calmer and happier.', '(Örnek) Scientists say that a daily walk can reduce stress. Experts recommend spending time outdoors.'];

/* ─── 9. Sınıf Answer Keys ─── */
export const ANSWER_KEYS_9: Record<string, Record<string, string[]>> = {
  A: {
    A: ['She is a digital marketer.', 'He works at a large shopping centre.', 'He develops software applications.'],
    B: ['Martin is a psychologist.', 'He works at a clinic.', 'He counsels people with emotional problems.'],
    C1: ['Julia', 'Mark', 'Clara', 'Leo'],
    C2: ['science lab', 'architecture firm', 'news agency', 'photography studio'],
    D: ['semi-detached house', 'He makes his bed and tidies up his room.', 'dishwasher, cooker, fridge', 'She is preparing dinner.'],
    E: ['Rita is watering the flowers in the garden.', 'Martin is reading a book in the bedroom.', 'Sue, Lily and Tim are having dinner in the dining room.'],
    F: ['Answers will vary'],
  },
  B: {
    A: ['She is a content creator.', 'He works at a law firm.', 'She protects people and maintains public safety.'],
    B: ['Tom is a firefighter.', 'He works at a fire station.', 'He puts out fires and rescues people.'],
    C1: ['Helen', 'James', 'Olivia', 'Ben'],
    C2: ['bank', 'pharmacy', 'school', 'photography studio'],
    D: ['detached house in a quiet village', 'bookshelf, two armchairs, TV stand', 'She sets the table for breakfast.', 'He is washing the car.'],
    E: ['Tom is cooking in the kitchen.', 'Lucy is watching TV in the living room.', 'Mr. and Mrs. Adams are watering the flowers in the garden.'],
    F: ['Answers will vary'],
  },
  C: {
    A: ['b) digital marketer', 'c) shopping centre', 'c) develops software'],
    B: ['psychologist', 'clinic', 'counsels'],
    C1: ['Julia', 'Mark', 'Clara', 'Leo'],
    C2: ['science lab', 'architecture firm', 'news agency', 'photography studio'],
    D: ['False', 'True', 'False', 'True'],
    E: ['watering / garden', 'reading / bedroom', 'having dinner / dining room'],
    F: ['Answers will vary'],
  },
  T: {
    A: ['He is an engineer.', 'She works on a large farm.', 'He checks teeth and treats patients with toothaches.'],
    B: ['Lisa is a chef.', 'She works at a restaurant.', 'She prepares meals and creates new recipes.'],
    C1: ['Susan', 'Robert', 'Nancy', 'Steve'],
    C2: ['hospital', 'construction company', 'animal clinic', 'restaurant'],
    D: ['She lives in a flat.', 'She does her homework.', 'microwave, toaster, fridge', 'He is cooking dinner.'],
    E: ['Amy is cleaning the house in the living room.', 'Steve is playing the guitar in the bedroom.', 'The Johnsons are cooking dinner in the kitchen.'],
    F: ['Answers will vary'],
  },
};

/* ─── 10. Sınıf Answer Keys ─── */
export const ANSWER_KEYS_10: Record<string, Record<string, string[]>> = {
  A: {
    A: ['Daniel', 'Leo', 'Emma', 'Sophie'],
    B: ['Answers will vary'],
    C: ['You must attend your online lessons on time / check your internet connection.', 'You should use polite language.', 'Sending off-topic messages is forbidden.', 'You may miss important information.'],
    D: ['Answers will vary'],
    E: ['The International Tulip Festival', 'Istanbul', 'Every April', 'Traditional Turkish food / tulip-shaped desserts'],
  },
  B: {
    A: ['Noah', 'Liam', 'Olivia', 'Stella'],
    B: ['Answers will vary'],
    C: ['The school is using too much electricity.', 'The school will pay higher bills.', 'She advises them to turn off the lights.', 'He advises them not to leave computers on during breaks.'],
    D: ['Answers will vary'],
    E: ['Alaçatı Herb Festival', 'Every year in April', 'In Alaçatı, İzmir', 'To celebrate local herbs and promote healthy traditional cuisine'],
  },
  T: {
    A: ['Mia', 'Jake', 'Chloe', 'Ryan'],
    B: ['Answers will vary'],
    C: ['Students must not cheat during exams.', 'They should use respectful language.', 'Using someone else\'s work without permission.', 'They may face disciplinary action.'],
    D: ['Answers will vary'],
    E: ['Cappadocia Hot Air Balloon Festival', 'Every year in July', 'In Cappadocia, Nevşehir', 'To celebrate the unique landscape and culture of Cappadocia'],
  },
};

export const ANSWER_KEYS: Record<string, { A: string[]; B: string[]; C: string[]; D: string[]; E: string[] }> = {
  A: {
    A: ['2015', 'April 18th', 'İnciraltı City Park', '"Plant Today, Breathe Tomorrow"'],
    B: ['1. survived', '2. evacuate', '3. injuries', '4. miracle', '5. witnesses'],
    C: SHARED_C_ANIMAL,
    D: ['e=1, b=2, d=3, a=4, c=5'],
    E: SHARED_E_PARAPHRASE,
  },
  B: {
    A: ['2018', 'May 12th', 'Konyaaltı Beach', '"Save the Seas, Save Ourselves"'],
    B: ['1. wonder', '2. rescue', '3. wounds', '4. escaped', '5. observers'],
    C: SHARED_C_CHILDREN,
    D: ['a=1, d=2, e=3, c=4, b=5'],
    E: SHARED_E_PARAPHRASE,
  },
  C: {
    A: ['2012', 'December 5th', 'Kızılay Square', '"Warmth for Everyone"'],
    B: ['1. miracle', '2. injuries', '3. survived', '4. evacuate', '5. witnesses'],
    C: SHARED_C_ANIMAL,
    D: ['b=1, e=2, a=3, c=4, d=5'],
    E: SHARED_E_PARAPHRASE,
  },
  D: {
    A: ['2008', 'March 22nd', 'Caddebostan Coastal Road', '"Run for a Cause, Run for Them"'],
    B: ['1. observers', '2. escaped', '3. wonder', '4. rescue', '5. wounds'],
    C: SHARED_C_CHILDREN,
    D: ['c=1, d=2, b=3, e=4, a=5'],
    E: SHARED_E_PARAPHRASE,
  },
  E: {
    A: ['1. b) April 18th', '2. b) İnciraltı City Park', '3. a) Plant trees', '4. b) 2015'],
    B: ['1→c, 2→e, 3→d, 4→a, 5→b'],
    C: ['Event name: help animals', 'Date: March 30th', 'Place: City Park', 'How to help: donation', 'Day: Sunday'],
    D: ['b=1, e=2, c=3, d=4, a=5'],
    E: ['1. b) happy', '2. c) outdoors'],
  },
};
