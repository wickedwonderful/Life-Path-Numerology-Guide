export type MasterNumber = 11 | 22 | 33;
export type SingleDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type LifePathNumber = SingleDigit | MasterNumber;

export type SubscriptionTier = 'free' | 'pro';
export type SubscriptionBillingCycle = 'monthly' | 'annual' | 'lifetime';

export interface SubscriptionState {
  tier: SubscriptionTier;
  billingCycle?: SubscriptionBillingCycle;
  isActive: boolean;
  startDate?: string;
  renewsAt?: string;
  expiresAt?: string;
  isTrial?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  birthDate: string; // MM/DD/YYYY
  relationship?: 'self' | 'partner' | 'child' | 'family' | 'friend' | 'client';
  primaryFocus?: string;
  currentMood?: string;
  lifePathNumber: LifePathNumber;
  expressionNumber?: LifePathNumber;
  soulUrgeNumber?: LifePathNumber;
  createdAt: string;
  notes?: string;
  avatarSeed?: string;
}

export interface IntakeSurvey {
  focusArea: 'career' | 'relationships' | 'spiritual' | 'wellness' | 'abundance';
  energyLevel: 'high' | 'balanced' | 'seeking_clarity' | 'transformational';
  currentChallenge: string;
  intention: string;
  relationship?: 'self' | 'partner' | 'child' | 'family' | 'friend' | 'client';
}

export interface LifePathReading {
  lifePathNumber: LifePathNumber;
  isMasterNumber: boolean;
  title: string;
  archetype: string;
  element: string;
  rulingPlanet: string;
  gemstone: string;
  markdownContent: string;
  summary: string;
  strengths: string[];
  challenges: Array<{ obstacle: string; solution: string }>;
  guidancePractices: string[];
  generatedAt: string;
}

export interface DailyHoroscope {
  date: string; // YYYY-MM-DD
  lifePathNumber: LifePathNumber;
  personalDayNumber: number;
  personalMonthNumber: number;
  personalYearNumber: number;
  vibrationTheme: string;
  cosmicOverview: string;
  keyAdvice: string;
  luckyColor: string;
  luckyNumber: number;
  bestTimeOfDay: string;
  mindfulAffirmation: string;
}

export interface Habit {
  id: string;
  profileId: string;
  title: string;
  description: string;
  lifePathTarget: LifePathNumber;
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // YYYY-MM-DD
  streakCount: number;
  category: 'mindfulness' | 'physical' | 'creative' | 'purpose' | 'relationships';
}

export interface GoalVisionItem {
  id: string;
  profileId: string;
  title: string;
  description: string;
  category: 'career' | 'love' | 'health' | 'spiritual' | 'travel';
  targetDate?: string;
  timeline?: string;
  imageUrl?: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';
  status: 'conceiving' | 'in_progress' | 'manifested';
  affirmation: string;
  guidedMeditation?: string;
  milestones: Array<{ id: string; title: string; completed: boolean }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  timestamp: string;
}

export type AspectRatioOption = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'awakening' | 'rituals' | 'vision' | 'wisdom' | 'mastery';
  points: number;
  unlockedAt?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  completed: boolean;
  targetTab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat';
  actionLabel: string;
}

export type ReportBlockSource =
  | 'reading_full'
  | 'reading_summary'
  | 'reading_strengths'
  | 'reading_challenges'
  | 'reading_guidance'
  | 'reading_synergy'
  | 'reading_careers'
  | 'reading_synastry'
  | 'library_archetype'
  | 'daily_horoscope'
  | 'daily_affirmation'
  | 'vision_goal'
  | 'custom_note';

export interface ReportBlock {
  id: string;
  source: ReportBlockSource;
  title: string;
  category: string;
  summaryText: string;
  fullContent: string;
  addedAt: string;
}

export interface CustomCuratedReport {
  id: string;
  title: string;
  profileName: string;
  birthDateFormatted: string;
  lifePathNumber: LifePathNumber;
  archetype: string;
  blocks: ReportBlock[];
  customNotes?: string;
  updatedAt: string;
}
