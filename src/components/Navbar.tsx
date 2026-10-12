import React from 'react';
import {
  Sparkles,
  Calendar,
  CheckSquare,
  Target,
  Compass,
  MessageCircle,
  Moon,
  Sun,
  UserPlus,
  HelpCircle,
  Award,
  Radio,
  Crown,
  ChevronDown,
  Users,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat';
  setActiveTab: (tab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat') => void;
  userProfile: UserProfile | null;
  onOpenIntake: () => void;
  onOpenTutorial: () => void;
  onOpenAchievements?: () => void;
  onOpenVoiceSettings?: () => void;
  onOpenProfiles?: () => void;
  onOpenSubscription?: () => void;
  isPro?: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  karmaPoints?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenIntake,
  onOpenTutorial,
  onOpenAchievements,
  onOpenVoiceSettings,
  onOpenProfiles,
  onOpenSubscription,
  isPro = false,
  isDarkMode,
  setIsDarkMode,
  karmaPoints = 0,
}) => {
  const navItems: Array<{
    id: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat';
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
    { id: 'reading', label: 'Daily Reading', shortLabel: 'Reading', icon: Sparkles, accentColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'horoscope', label: 'Horoscope', shortLabel: 'Horoscope', icon: Calendar, accentColor: 'text-teal-600 dark:text-teal-400' },
    { id: 'habits', label: 'Personalized Rituals', shortLabel: 'Rituals', icon: CheckSquare, accentColor: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'goals', label: 'Vision Board', shortLabel: 'Vision', icon: Target, accentColor: 'text-rose-600 dark:text-rose-400' },
    { id: 'suite', label: 'Library & Meanings', shortLabel: 'Library', icon: Compass, accentColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'chat', label: 'Oracle Guide', shortLabel: 'Oracle', icon: MessageCircle, accentColor: 'text-indigo-600 dark:text-indigo-400' },
  ];

  return (
    <>
      {/* Top Header Bar for All Screen Sizes */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl transition-colors border-b ${
          isDarkMode
            ? 'bg-[#181716]/90 border-stone-800/80 text-stone-100'
            : 'bg-[#FAF8F5]/90 border-stone-200/80 text-stone-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Brand */}
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none group min-w-0 shrink"
              onClick={() => setActiveTab('reading')}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-600 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-base sm:text-xl font-serif italic font-bold tracking-tight text-stone-900 dark:text-stone-100 block leading-tight truncate">
                  Cosmic Path
                </span>
                <span className="hidden sm:block text-[9px] sm:text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-[0.2em] leading-none mt-0.5">
                  Intuitive Numerology
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs font-bold uppercase tracking-wider">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                      isActive
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 shadow-xs'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? item.accentColor : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions & Profile */}
            <div className="flex items-center space-x-1 sm:space-x-2.5 shrink-0">
              {/* Guide Button */}
              <button
                id="tutorial-guide-btn"
                onClick={onOpenTutorial}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 transition-all shrink-0"
                title="Platform Interactive Tutorial"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Guide</span>
              </button>

              {/* Cosmic Voice Settings Button */}
              {onOpenVoiceSettings && (
                <button
                  id="cosmic-voice-settings-btn"
                  onClick={onOpenVoiceSettings}
                  className="flex items-center space-x-1 sm:space-x-1.5 bg-[#C87A5E]/10 hover:bg-[#C87A5E]/20 text-[#C87A5E] border border-[#C87A5E]/30 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all shrink-0"
                  title="Cosmic Voice Personas (Gemini AI TTS)"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Voice</span>
                </button>
              )}

              {/* Karma Points Counter / Achievements Hub Trigger */}
              <button
                id="achievements-hub-btn"
                onClick={onOpenAchievements}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 px-2 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all shadow-xs group shrink-0"
                title="View Cosmic Mastery Ranks, Badges & Daily Quests"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>{karmaPoints} <span className="hidden xs:inline sm:inline">PTS</span></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse hidden sm:inline" />
              </button>

              {/* Pro Subscription Upgrade / VIP Status Trigger */}
              {onOpenSubscription && (
                <button
                  id="cosmic-subscription-btn"
                  onClick={onOpenSubscription}
                  className={`flex items-center space-x-1 sm:space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isPro
                      ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50 shadow-xs'
                      : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-xs'
                  }`}
                  title={isPro ? 'Cosmic VIP Active — Click to manage subscription' : 'Unlock Cosmic Path Pro — Unlimited Profiles, HD Voices & Dossiers'}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400 dark:text-amber-300" />
                  <span className="hidden sm:inline">{isPro ? 'VIP PRO' : 'Get Pro'}</span>
                  <span className="sm:hidden">{isPro ? 'VIP' : 'Pro'}</span>
                </button>
              )}

              {/* Profile Switcher or Calculate button */}
              {userProfile ? (
                <button
                  id="profile-switcher-btn"
                  onClick={onOpenProfiles || onOpenIntake}
                  className="flex items-center space-x-1.5 sm:space-x-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 px-2 sm:px-3 py-1.5 rounded-xl text-xs text-stone-900 dark:text-stone-100 transition-all shrink-0 group"
                  title="Switch or Manage Cosmic Profiles"
                >
                  <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="font-semibold hidden sm:inline max-w-[85px] truncate">
                    {userProfile.name || 'Seeker'}
                  </span>
                  <span className="bg-teal-600 text-white px-1.5 py-0.5 rounded-md font-mono font-bold text-[10px] sm:text-[11px]">
                    LP #{userProfile.lifePathNumber}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors" />
                </button>
              ) : (
                <button
                  id="calculate-profile-btn"
                  onClick={onOpenIntake}
                  className="flex items-center space-x-1 sm:space-x-1.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs tracking-wider uppercase transition-all shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Calculate</span>
                  <span className="sm:hidden text-[10px]">Start</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                id="theme-toggle-btn"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 sm:p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-stone-700" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Bar for Mobile & Tablet (Cross-Platform Ergonomics) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#181716]/95 backdrop-blur-xl border-t border-stone-200/90 dark:border-stone-800/90 px-1 py-1 safe-area-bottom shadow-lg">
        <div className="w-full max-w-md mx-auto grid grid-cols-6 gap-0.5 text-[9px] sm:text-[10px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all min-w-0 ${
                  isActive
                    ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 shrink-0 ${isActive ? item.accentColor : 'text-stone-400'}`} />
                <span className="leading-none tracking-tight truncate w-full text-center block">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
