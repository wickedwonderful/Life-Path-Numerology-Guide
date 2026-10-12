import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Gift, Award, TrendingUp } from 'lucide-react';
import { getDailyQuests, isDailyBonusClaimed, getKarmaLevel } from '../data/achievements';
import { DailyQuest, UserProfile } from '../types';

interface DailyQuestsBannerProps {
  userProfile: UserProfile | null;
  karmaPoints: number;
  onOpenAchievements: () => void;
  onNavigateTab: (tab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat') => void;
}

export const DailyQuestsBanner: React.FC<DailyQuestsBannerProps> = ({
  userProfile,
  karmaPoints,
  onOpenAchievements,
  onNavigateTab,
}) => {
  const quests = getDailyQuests();
  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const allDone = completedCount === totalCount;
  const bonusClaimed = isDailyBonusClaimed();
  const levelInfo = getKarmaLevel(karmaPoints);

  return (
    <div className="bg-gradient-to-br from-white via-amber-50/20 to-teal-50/20 dark:from-[#1E1C1A] dark:via-[#221F1C] dark:to-[#1A201E] border border-amber-200/80 dark:border-amber-900/40 rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-xs relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Daily Cosmic Alignment Quests</span>
            </span>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
              {completedCount}/{totalCount} Completed
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <span>Harmonize Today's Energy & Ascend Your Rank</span>
            <span className="text-sm font-sans font-normal text-stone-500 dark:text-stone-400">
              ({levelInfo.badge} {levelInfo.name})
            </span>
          </h3>

          {/* Quick Mini Quest Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {quests.map((q) => (
              <button
                key={q.id}
                onClick={() => onNavigateTab(q.targetTab)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 group ${
                  q.completed
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white/80 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-300 dark:hover:border-amber-700'
                }`}
              >
                {q.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-300 dark:border-stone-600 shrink-0 group-hover:border-amber-500" />
                )}
                <span className="text-[11px] font-bold truncate">{q.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Achievements Hub launcher */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <button
            onClick={onOpenAchievements}
            className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Award className="w-4 h-4" />
            <span>Mastery Hub</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
