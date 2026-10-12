import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Clock, Compass, Sun, Flame, CheckCircle2, RefreshCw } from 'lucide-react';
import { DailyHoroscope, UserProfile } from '../types';
import { LifePathArtworkCard } from './LifePathArtworkCard';
import { markQuestCompleted } from '../data/achievements';

interface HoroscopeWidgetProps {
  userProfile: UserProfile | null;
  onOpenIntake: () => void;
  onClaimReward?: (points: number, reason: string) => void;
}

export const HoroscopeWidget: React.FC<HoroscopeWidgetProps> = ({ userProfile, onOpenIntake, onClaimReward }) => {
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);

  const fetchHoroscope = async () => {
    if (!userProfile?.birthDate) return;
    setLoading(true);
    try {
      const res = await fetch('/api/horoscope/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: userProfile.birthDate,
          lifePathNumber: userProfile.lifePathNumber,
        }),
      });
      const data = await res.json();
      if (data.horoscope) {
        setHoroscope(data.horoscope);
      }
    } catch (err) {
      console.error('Failed to fetch daily horoscope:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.birthDate) {
      fetchHoroscope();
    }
  }, [userProfile?.birthDate, userProfile?.lifePathNumber]);

  if (!userProfile) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#342F2A] rounded-[32px] shadow-sm space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C87A5E]/10 text-[#C87A5E] flex items-center justify-center">
          <Calendar className="w-7 h-7 animate-pulse" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">Daily Cosmic Transit & Horoscope</h2>
        <p className="text-xs text-[#7A7369] dark:text-[#A69E92] max-w-md mx-auto">
          Calculate your Birth Path to unlock your personalized Personal Day transit forecast, lucky factors, and daily affirmations.
        </p>
        <button
          onClick={onOpenIntake}
          className="bg-[#C87A5E] hover:bg-[#B86C52] text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate Birth Path First</span>
        </button>
      </div>
    );
  }

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 space-y-6">
      {/* Compact Life Path Artwork Motivation Header */}
      {userProfile?.lifePathNumber && (
        <LifePathArtworkCard
          lifePathNumber={userProfile.lifePathNumber}
          userProfile={userProfile}
          compact
        />
      )}

      {/* Header card */}
      <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C8826D] bg-[#E0D4C3]/40 px-3 py-1 rounded-full border border-[#E0D4C3]">
                {todayDateStr}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] mt-2.5 break-words">
              Daily Path & Cosmic Transits
            </h2>
            <p className="text-xs sm:text-sm text-[#6B665E] dark:text-[#A39E93] mt-1 font-medium break-words">
              Personalized transit forecast for <strong className="text-[#7D8E7A]">{userProfile.name || 'Seeker'}</strong> (Life Path #{userProfile.lifePathNumber})
            </p>
          </div>

          <button
            onClick={fetchHoroscope}
            disabled={loading}
            className="flex items-center space-x-2 bg-[#F8F5F2] dark:bg-[#35322D] hover:bg-[#E0D4C3]/50 text-[#C8826D] border border-[#E0D4C3] dark:border-[#4A4741] px-4 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Transit</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#8C867C] space-y-2">
          <Sparkles className="w-8 h-8 text-[#C8826D] mx-auto animate-spin" />
          <p className="text-xs">Aligning today's planetary transits with your Personal Day vibration...</p>
        </div>
      ) : horoscope ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Main 3 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 text-center shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C867C]">Personal Day</span>
              <div className="text-3xl sm:text-4xl font-serif italic font-bold text-[#7D8E7A]">#{horoscope.personalDayNumber}</div>
              <p className="text-xs text-[#6B665E] dark:text-[#A39E93]">Today's direct energetic focus</p>
            </div>

            <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 text-center shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C867C]">Personal Month</span>
              <div className="text-3xl sm:text-4xl font-serif italic font-bold text-[#C8826D]">#{horoscope.personalMonthNumber}</div>
              <p className="text-xs text-[#6B665E] dark:text-[#A39E93]">Current monthly growth wave</p>
            </div>

            <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 text-center shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C867C]">Personal Year</span>
              <div className="text-3xl sm:text-4xl font-serif italic font-bold text-[#4A4741] dark:text-[#E0D4C3]">#{horoscope.personalYearNumber}</div>
              <p className="text-xs text-[#6B665E] dark:text-[#A39E93]">Overall annual life theme</p>
            </div>
          </div>

          {/* Theme & Overview */}
          <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-sm overflow-hidden">
            <div className="flex items-center space-x-3 sm:space-x-4 pb-3 sm:pb-4 border-b border-[#F0EBE5] dark:border-[#3D3A35]">
              <div className="p-2.5 sm:p-3 rounded-full bg-[#E0D4C3]/40 text-[#C8826D] shrink-0">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em] text-[#7D8E7A] block">Today's Theme</span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] truncate">{horoscope.vibrationTheme}</h3>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#C8826D]">
                Cosmic Energy Forecast
              </h4>
              <p className="text-xs sm:text-sm text-[#3D3A35] dark:text-[#F8F5F2] leading-relaxed bg-[#F8F5F2] dark:bg-[#252320] p-3.5 sm:p-5 rounded-2xl border border-[#F0EBE5] dark:border-[#3D3A35] break-words">
                {horoscope.cosmicOverview}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#7D8E7A]">
                Actionable Daily Guidance
              </h4>
              <p className="text-xs sm:text-sm text-[#4A4741] dark:text-[#F8F5F2] leading-relaxed bg-[#7D8E7A]/10 p-3.5 sm:p-5 rounded-2xl border border-[#7D8E7A]/20 break-words">
                💡 {horoscope.keyAdvice}
              </p>
            </div>

            {/* Lucky Elements */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
              <div className="bg-[#F8F5F2] dark:bg-[#252320] p-3 sm:p-4 rounded-2xl border border-[#F0EBE5] dark:border-[#3D3A35] text-xs flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-[#7D8E7A] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[#8C867C] text-[10px] block font-bold uppercase">Lucky Color</span>
                  <span className="font-bold text-[#4A4741] dark:text-[#F8F5F2] truncate block">{horoscope.luckyColor}</span>
                </div>
              </div>

              <div className="bg-[#F8F5F2] dark:bg-[#252320] p-3 sm:p-4 rounded-2xl border border-[#F0EBE5] dark:border-[#3D3A35] text-xs flex items-center space-x-3">
                <Flame className="w-4 h-4 text-[#C8826D] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[#8C867C] text-[10px] block font-bold uppercase">Lucky Number</span>
                  <span className="font-bold text-[#4A4741] dark:text-[#F8F5F2] truncate block">#{horoscope.luckyNumber}</span>
                </div>
              </div>

              <div className="bg-[#F8F5F2] dark:bg-[#252320] p-3 sm:p-4 rounded-2xl border border-[#F0EBE5] dark:border-[#3D3A35] text-xs flex items-center space-x-3">
                <Clock className="w-4 h-4 text-[#7D8E7A] shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[#8C867C] text-[10px] block font-bold uppercase">Peak Cosmic Window</span>
                  <span className="font-bold text-[#4A4741] dark:text-[#F8F5F2] truncate block">{horoscope.bestTimeOfDay}</span>
                </div>
              </div>
            </div>

            {/* Daily Affirmation Card */}
            <div className="bg-[#E0D4C3]/30 dark:bg-[#35322D] p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-[#E0D4C3] dark:border-[#4A4741] text-center space-y-3 sm:space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C8826D]">
                Daily Mindful Affirmation
              </span>
              <p className="text-base sm:text-xl font-serif italic text-[#4A4741] dark:text-[#F8F5F2] break-words">
                "{horoscope.mindfulAffirmation}"
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCheckInDone(true);
                    markQuestCompleted('quest_horoscope');
                    if (onClaimReward) {
                      onClaimReward(15, `Personal Day #${horoscope.personalDayNumber} Transit Alignment`);
                    }
                  }}
                  disabled={checkInDone}
                  className={`inline-flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold transition-all ${
                    checkInDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{checkInDone ? 'Daily Alignment Claimed! ✨ (+15 PTS)' : 'Claim Daily Alignment (+15 PTS)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
