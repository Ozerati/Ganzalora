// Types
export type { BrochureData, PersonCard, InfoCard, ExamSection, TeacherSlot, GroupMap } from './types';

// Constants & helpers
export { GROUP_LETTERS_12, GROUP_LETTERS_10, GROUP_LETTERS_9, GROUP_COLORS_12, GROUP_COLORS_9, getTypeLabel, gid, emptySection, calcPoints } from './constants';

// Answer keys
export { SHARED_C_ANIMAL, SHARED_C_CHILDREN, SHARED_E_PARAPHRASE, ANSWER_KEYS_9, ANSWER_KEYS_10, ANSWER_KEYS } from './answerKeys';

// Grade 12 groups
export { makeGroupA, makeGroupB, makeGroupC, makeGroupD, makeGroupE, makeGroupT, makeGroupA_sample, makeGroupB_sample, makeGroupC_sample, makeGroupD_sample } from './groups/grade12';

// Grade 10 groups
export { makeGroup10A, makeGroup10B, makeGroup10T, makeGroup10A_sample } from './groups/grade10';

// Grade 9 groups
export { makeGroup9A, makeGroup9B, makeGroup9T, makeGroup9C, makeGroup9A_sample, makeGroup9B_sample } from './groups/grade9';

// Section components
export { BrochureCard } from './sections/BrochureCard';
export { NewspaperCard } from './sections/NewspaperCard';
export { ChronoItem } from './sections/ChronoItem';
export { PosterCard } from './sections/PosterCard';
export { TravelBrochureCard } from './sections/TravelBrochureCard';
export { FestivalCard } from './sections/FestivalCard';
export { ExamPage, RichText } from './sections/ExamPage';
export { ChevLeft, ChevRight } from './sections/Icons';
