import React, { useEffect } from 'react';
import { Award, Sparkles, X, TrendingUp, CheckCircle2, Star } from 'lucide-react';
import { getKarmaLevel } from '../data/achievements';

interface RewardCelebrationToastProps {
  isOpen: boolean;
  pointsEarned: number;
  totalPoints: number;
  reason: string;
  badgeUnlocked?: string;
  onClose: () => void;
}

export const RewardCelebrationToast: React.FC<RewardCelebrationToastProps> = ({
  isOpen,
  pointsEarned,
  totalPoints,
  reason,
  badgeUnlocked,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const levelInfo = getKarmaLevel(totalPoints);
  const nextMax = levelInfo.maxPoints;
  const progressPercent = Math.min(100, Math.round((totalPoints / nextMax) * 100));

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#1E1C1A] border-2 border-amber-500/80 rounded-[28px] p-5 shadow-2xl animate-bounce-short text-stone-900 dark:text-stone-100 overflow-hidden">
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
            {badgeUnlocked ? <Star className="w-6 h-6 animate-spin" /> : <Award className="w-6 h-6 animate-pulse" />}
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                {badgeUnlocked ? 'Badge Unlocked! 🌟' : 'Karma Reward Claimed'}
              </span>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
                +{pointsEarned} PTS
              </span>
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 mt-0.5">
              {reason}
            </h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress towards next Cosmic Level */}
      <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 dark:text-stone-400">
          <span className="flex items-center space-x-1 text-teal-700 dark:text-teal-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{levelInfo.badge} {levelInfo.name}</span>
          </span>
          <span className="font-mono">{totalPoints} / {nextMax} PTS</span>
        </div>

        <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
