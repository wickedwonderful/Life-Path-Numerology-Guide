import { AchievementBadge, DailyQuest } from '../types';

export const ALL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'first_awakening',
    title: 'First Awakening',
    description: 'Calculate your Life Path and reveal your celestial archetype.',
    icon: '🌟',
    category: 'awakening',
    points: 25,
  },
  {
    id: 'ancient_scholar',
    title: 'Ancient Scholar',
    description: 'Inspect the Pythagorean reduction calculation trace breakdown.',
    icon: '📜',
    category: 'wisdom',
    points: 15,
  },
  {
    id: 'voice_of_serenity',
    title: 'Voice of Serenity',
    description: 'Listen to the soothing audio narration of your reading or meditation.',
    icon: '🎧',
    category: 'awakening',
    points: 20,
  },
  {
    id: 'affirmation_anchor',
    title: 'Affirmation Anchor',
    description: 'Recite or claim your personalized daily life path affirmation.',
    icon: '📿',
    category: 'rituals',
    points: 15,
  },
  {
    id: 'ritual_pioneer',
    title: 'Ritual Pioneer',
    description: 'Complete your first daily habit ritual alignment.',
    icon: '⚡',
    category: 'rituals',
    points: 20,
  },
  {
    id: 'cosmic_flame',
    title: 'Cosmic Flame',
    description: 'Maintain an active 3-day habit streak on any ritual.',
    icon: '🔥',
    category: 'rituals',
    points: 35,
  },
  {
    id: 'unshakable_will',
    title: 'Unshakable Will',
    description: 'Achieve a 7-day habit streak across your daily rituals.',
    icon: '👑',
    category: 'mastery',
    points: 75,
  },
  {
    id: 'visionary_architect',
    title: 'Visionary Architect',
    description: 'Create or customize a goal on your Cosmic Vision Board.',
    icon: '🎨',
    category: 'vision',
    points: 25,
  },
  {
    id: 'zen_voyager',
    title: 'Zen Voyager',
    description: 'Complete a 2-Minute Guided Manifestation practice with audio.',
    icon: '🧘',
    category: 'vision',
    points: 30,
  },
  {
    id: 'goal_manifestor',
    title: 'Goal Manifestor',
    description: 'Bring any goal on your vision board to 100% Manifested status.',
    icon: '🎉',
    category: 'vision',
    points: 50,
  },
  {
    id: 'lunar_observer',
    title: 'Lunar Observer',
    description: 'Check today’s Personal Day horoscope and planetary transit.',
    icon: '🌙',
    category: 'wisdom',
    points: 15,
  },
  {
    id: 'synastry_explorer',
    title: 'Synastry Explorer',
    description: 'Calculate relationship compatibility in the Numerology Suite.',
    icon: '💫',
    category: 'wisdom',
    points: 25,
  },
  {
    id: 'oracle_inquirer',
    title: 'Oracle Inquirer',
    description: 'Consult the Cosmic Oracle for intuitive life path guidance.',
    icon: '💬',
    category: 'wisdom',
    points: 20,
  },
  {
    id: 'master_alchemist',
    title: 'Ascended Master',
    description: 'Accumulate 500+ Cosmic Karma Points on your spiritual journey.',
    icon: '🔮',
    category: 'mastery',
    points: 100,
  },
];

export interface KarmaLevel {
  level: number;
  name: string;
  badge: string;
  minPoints: number;
  maxPoints: number;
  perks: string;
}

export const KARMA_LEVELS: KarmaLevel[] = [
  {
    level: 1,
    name: 'Awakened Seeker',
    badge: '🌟',
    minPoints: 0,
    maxPoints: 100,
    perks: 'Life Path readings, daily affirmation rituals & horoscope transits',
  },
  {
    level: 2,
    name: 'Aligned Manifestor',
    badge: '✨',
    minPoints: 100,
    maxPoints: 250,
    perks: 'Custom habit tracking, vision board milestone automation & audio guides',
  },
  {
    level: 3,
    name: 'Master Alchemist',
    badge: '🔮',
    minPoints: 250,
    maxPoints: 500,
    perks: 'Deep synastry matrix calculation & AI Oracle intuitive channeled chat',
  },
  {
    level: 4,
    name: 'Cosmic Sovereign',
    badge: '👑',
    minPoints: 500,
    maxPoints: 1000,
    perks: 'Master number vibrations, full personal year forecast & golden aura',
  },
  {
    level: 5,
    name: 'Ascended Luminary',
    badge: '🌌',
    minPoints: 1000,
    maxPoints: 2000,
    perks: 'Ultimate spiritual mastery, infinite cosmic alignment & supreme blessings',
  },
];

export function getKarmaLevel(totalPoints: number): KarmaLevel {
  for (let i = KARMA_LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= KARMA_LEVELS[i].minPoints) {
      return KARMA_LEVELS[i];
    }
  }
  return KARMA_LEVELS[0];
}

export const QUESTS_STORAGE_KEY = 'cosmic_daily_quests_v1';
export const UNLOCKED_BADGES_STORAGE_KEY = 'cosmic_unlocked_badges_v1';

export function getDailyQuests(): DailyQuest[] {
  const todayStr = new Date().toISOString().split('T')[0];
  const saved = localStorage.getItem(QUESTS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.date === todayStr && Array.isArray(parsed.quests)) {
        return parsed.quests;
      }
    } catch (e) {
      console.error('Failed to parse quests', e);
    }
  }

  const freshQuests: DailyQuest[] = [
    {
      id: 'quest_affirmation',
      title: 'Morning Alignment',
      description: 'Absorb or listen to your Life Path Daily Affirmation.',
      rewardPoints: 15,
      completed: false,
      targetTab: 'reading',
      actionLabel: 'Recite Affirmation',
    },
    {
      id: 'quest_horoscope',
      title: 'Cosmic Transit Check',
      description: 'Review today’s Personal Day horoscope and lucky vibrations.',
      rewardPoints: 15,
      completed: false,
      targetTab: 'horoscope',
      actionLabel: 'View Forecast',
    },
    {
      id: 'quest_ritual',
      title: 'Sacred Ritual Practice',
      description: 'Check off at least 1 habit ritual aligned with your energy.',
      rewardPoints: 20,
      completed: false,
      targetTab: 'habits',
      actionLabel: 'Complete Ritual',
    },
    {
      id: 'quest_meditation',
      title: 'Guided Manifestation',
      description: 'Practice a 2-minute soothing audio meditation or advance a goal.',
      rewardPoints: 25,
      completed: false,
      targetTab: 'goals',
      actionLabel: 'Enter Sanctuary',
    },
  ];

  localStorage.setItem(
    QUESTS_STORAGE_KEY,
    JSON.stringify({ date: todayStr, quests: freshQuests, bonusClaimed: false })
  );
  return freshQuests;
}

export function markQuestCompleted(questId: string): { updated: DailyQuest[]; isAllCompleted: boolean; isNewlyCompleted: boolean } {
  const todayStr = new Date().toISOString().split('T')[0];
  const quests = getDailyQuests();
  let isNewlyCompleted = false;

  const updated = quests.map((q) => {
    if (q.id === questId && !q.completed) {
      isNewlyCompleted = true;
      return { ...q, completed: true };
    }
    return q;
  });

  const isAllCompleted = updated.every((q) => q.completed);

  const raw = localStorage.getItem(QUESTS_STORAGE_KEY);
  const bonusClaimed = raw ? JSON.parse(raw).bonusClaimed || false : false;

  localStorage.setItem(
    QUESTS_STORAGE_KEY,
    JSON.stringify({ date: todayStr, quests: updated, bonusClaimed })
  );

  return { updated, isAllCompleted, isNewlyCompleted };
}

export function isDailyBonusClaimed(): boolean {
  const raw = localStorage.getItem(QUESTS_STORAGE_KEY);
  if (!raw) return false;
  try {
    return !!JSON.parse(raw).bonusClaimed;
  } catch {
    return false;
  }
}

export function markDailyBonusClaimed(): void {
  const todayStr = new Date().toISOString().split('T')[0];
  const quests = getDailyQuests();
  localStorage.setItem(
    QUESTS_STORAGE_KEY,
    JSON.stringify({ date: todayStr, quests, bonusClaimed: true })
  );
}
