import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  X,
  TrendingUp,
  CheckCircle2,
  Lock,
  Flame,
  Star,
  Target,
  ArrowRight,
  Shield,
  Gift,
  Compass,
} from 'lucide-react';
import {
  ALL_ACHIEVEMENTS,
  getKarmaLevel,
  KARMA_LEVELS,
  getDailyQuests,
  markDailyBonusClaimed,
  isDailyBonusClaimed,
  UNLOCKED_BADGES_STORAGE_KEY,
} from '../data/achievements';
import { UserProfile, DailyQuest } from '../types';

interface CosmicAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  karmaPoints: number;
  userProfile: UserProfile | null;
  onNavigateTab: (tab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat') => void;
  onClaimReward: (points: number, reason: string) => void;
}

export const CosmicAchievementsModal: React.FC<CosmicAchievementsModalProps> = ({
  isOpen,
  onClose,
  karmaPoints,
  userProfile,
  onNavigateTab,
  onClaimReward,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quests' | 'badges' | 'levels'>('quests');
  const [claimedBonus, setClaimedBonus] = useState(isDailyBonusClaimed());

  if (!isOpen) return null;

  const currentLevel = getKarmaLevel(karmaPoints);
  const nextLevel = KARMA_LEVELS.find((l) => l.level === currentLevel.level + 1) || currentLevel;
  const levelProgress =
    currentLevel.level === 5
      ? 100
      : Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((karmaPoints - currentLevel.minPoints) /
                (nextLevel.minPoints - currentLevel.minPoints)) *
                100
            )
          )
        );

  // Load unlocked badges from storage
  let unlockedIds: string[] = [];
  try {
    const raw = localStorage.getItem(UNLOCKED_BADGES_STORAGE_KEY);
    if (raw) unlockedIds = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  // Always mark first_awakening as unlocked if user has calculated their profile
  if (userProfile && !unlockedIds.includes('first_awakening')) {
    unlockedIds.push('first_awakening');
  }
  if (karmaPoints >= 500 && !unlockedIds.includes('master_alchemist')) {
    unlockedIds.push('master_alchemist');
  }

  const dailyQuests = getDailyQuests();
  const completedQuestsCount = dailyQuests.filter((q) => q.completed).length;
  const allQuestsDone = dailyQuests.length > 0 && completedQuestsCount === dailyQuests.length;

  const handleClaimDailyBonus = () => {
    if (allQuestsDone && !claimedBonus) {
      markDailyBonusClaimed();
      setClaimedBonus(true);
      onClaimReward(50, 'Completed All Daily Cosmic Alignment Quests! 🌟');
    }
  };

  const handleQuestAction = (quest: DailyQuest) => {
    onClose();
    onNavigateTab(quest.targetTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100 my-auto">
        {/* Ethereal background gradient ambient circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-start justify-between pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full">
                  Cosmic Mastery Hub
                </span>
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                  {karmaPoints} Karma Points
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
                Level {currentLevel.level}: {currentLevel.name} {currentLevel.badge}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="my-5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-300">
            <span className="flex items-center space-x-1.5 text-stone-900 dark:text-stone-100">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Current Progress</span>
            </span>
            <span>
              {currentLevel.level === 5
                ? 'Maximum Luminary Rank'
                : `${karmaPoints} / ${nextLevel.minPoints} PTS to Level ${nextLevel.level}`}
            </span>
          </div>

          <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-amber-500 to-amber-600 rounded-full transition-all duration-700"
              style={{ width: `${levelProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
            <span>✨ Unlocks: {currentLevel.perks}</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">{levelProgress}%</span>
          </div>
        </div>

        {/* Tab Switcher: Quests vs Badges vs Ranks */}
        <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-stone-800 pb-3 mb-5">
          <button
            onClick={() => setActiveSubTab('quests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'quests'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Quests ({completedQuestsCount}/{dailyQuests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('badges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'badges'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Celestial Badges ({unlockedIds.length}/{ALL_ACHIEVEMENTS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('levels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'levels'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Mastery Ranks</span>
          </button>
        </div>

        {/* Tab 1: Daily Quests */}
        {activeSubTab === 'quests' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dailyQuests.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    q.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/50'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {q.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-stone-300 dark:border-stone-600 shrink-0" />
                      )}
                      <h4
                        className={`text-sm font-bold ${
                          q.completed
                            ? 'line-through text-stone-500 dark:text-stone-400'
                            : 'text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        {q.title}
                      </h4>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                        +{q.rewardPoints} PTS
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 pl-6 leading-relaxed">
                      {q.description}
                    </p>
                  </div>

                  {!q.completed && (
                    <button
                      onClick={() => handleQuestAction(q)}
                      className="shrink-0 bg-stone-100 dark:bg-stone-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                    >
                      <span>Go</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Daily Grand Bonus Banner */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                allQuestsDone
                  ? 'bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-amber-500/15 border-amber-400/80 dark:border-amber-600/80'
                  : 'bg-stone-50 dark:bg-stone-900 border-dashed border-stone-300 dark:border-stone-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Daily Alignment Grand Bonus (+50 Karma Points)
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {allQuestsDone
                      ? 'Congratulations! You have synchronized all cosmic daily rituals today.'
                      : `Complete all ${dailyQuests.length} quests above to claim today's 50 Karma Grand Bonus.`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClaimDailyBonus}
                disabled={!allQuestsDone || claimedBonus}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${
                  claimedBonus
                    ? 'bg-emerald-600 text-white cursor-default'
                    : allQuestsDone
                    ? 'bg-gradient-to-r from-amber-600 to-teal-600 hover:opacity-90 text-white animate-bounce-short'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                }`}
              >
                {claimedBonus ? 'Bonus Claimed! ✨' : 'Claim +50 Karma'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Celestial Badges Grid */}
        {activeSubTab === 'badges' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {ALL_ACHIEVEMENTS.map((badge) => {
              const isUnlocked = unlockedIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                    isUnlocked
                      ? 'bg-white dark:bg-stone-900 border-amber-300 dark:border-amber-800/80 shadow-xs'
                      : 'bg-stone-50/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60'
                  }`}
                >
                  <div className="relative mb-2">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                        isUnlocked
                          ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 animate-pulse'
                          : 'bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>
                    {!isUnlocked && (
                      <div className="absolute -top-1 -right-1 bg-stone-700 text-white p-1 rounded-full text-[10px]">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100 leading-tight">
                    {badge.title}
                  </h5>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                    {badge.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 w-full flex items-center justify-center space-x-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    <span>+{badge.points} PTS</span>
                    {isUnlocked && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Mastery Ranks / Levels */}
        {activeSubTab === 'levels' && (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {KARMA_LEVELS.map((lvl) => {
              const isCurrent = currentLevel.level === lvl.level;
              const isUnlocked = karmaPoints >= lvl.minPoints;

              return (
                <div
                  key={lvl.level}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700 shadow-sm'
                      : isUnlocked
                      ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                      : 'bg-stone-50/50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-xl shrink-0">
                      {lvl.badge}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          Level {lvl.level}: {lvl.name}
                        </span>
                        {isCurrent && (
                          <span className="bg-amber-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Current Rank
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                        {lvl.perks}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                      {lvl.minPoints} PTS
                    </span>
                    <span className="block text-[10px] text-stone-500 dark:text-stone-400">
                      {isUnlocked ? 'Achieved ✨' : 'Locked 🔒'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>Complete daily rituals, reflections & meditations to elevate your vibration.</span>
          <button
            onClick={onClose}
            className="bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 px-5 py-2 rounded-xl font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
