/* ═══ Types ═══ */

export interface BrochureData {
  orgName: string;
  description: string;
  campaignTitle: string;
  campaignDetails: string;
  campaignAim: string;
  slogan: string;
  callToAction: string;
  donationInfo: string;
  website?: string;
  emoji?: string;
}

export interface PersonCard {
  name: string;
  text: string;
  imageUrl?: string;
  bgColor?: string;
  borderColor?: string;
}

export interface InfoCard {
  imageUrl?: string;
  fields: { label: string; value: string }[];
}

export interface ExamSection {
  id: string;
  label: string;
  customLabel?: string;
  type: string;
  scoring: string;
  instruction: string;
  passage: string;
  items: string[];
  imageUrl?: string;
  brochure?: BrochureData;
  personCards?: PersonCard[];
  infoCard?: InfoCard;
  imageGrid?: string[];
}

export interface TeacherSlot { name: string; title: string; }
export type GroupMap = Record<string, ExamSection[]>;
