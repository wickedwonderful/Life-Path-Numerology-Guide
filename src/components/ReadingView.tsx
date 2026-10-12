import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  Bookmark,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Flame,
  Compass,
  Heart,
  Award,
  BookOpen,
  HelpCircle,
  Star,
  Target,
  Zap,
  Radio,
  Loader2,
  FileText,
  Plus,
  ExternalLink,
  Headphones,
  Gem,
  LayoutGrid,
  AlignLeft,
  Share2,
} from 'lucide-react';
import { LifePathNumber, LifePathReading, UserProfile } from '../types';
import {
  CalculationTrace,
  LIFE_PATH_DETAILS,
  sanitizeMarkdownReading,
  formatBirthDate,
  getStructuredReadingCards,
  ReadingInsightCard,
} from '../utils/numerology';
import {
  speakSoothingly,
  stopSoothingAudio,
  getSelectedVoiceId,
  COSMIC_VOICES,
  CosmicVoiceId,
} from '../utils/speech';
import { toggleReportBlock, isBlockInReport, getCustomReportBlocks } from '../utils/reportStore';
import { DailyAffirmationBanner } from './DailyAffirmationBanner';
import { LifePathArtworkCard } from './LifePathArtworkCard';
import { DailyQuestsBanner } from './DailyQuestsBanner';
import { CosmicDeepDivesModal } from './CosmicDeepDivesModal';
import { CosmicQuizModal } from './CosmicQuizModal';
import { CosmicAffirmationPopup } from './CosmicAffirmationPopup';
import { VoiceSettingsModal } from './VoiceSettingsModal';
import { CustomReportModal } from './CustomReportModal';
import { CosmicShareCardModal } from './CosmicShareCardModal';

interface ReadingViewProps {
  reading: LifePathReading | null;
  trace: CalculationTrace | null;
  userProfile: UserProfile | null;
  onRefresh: () => void;
  isLoading: boolean;
  onNavigateTab: (tab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat') => void;
  onSelectLibraryNumber?: (num: LifePathNumber) => void;
  onClaimReward?: (points: number, reason: string) => void;
  onOpenAchievements?: () => void;
  karmaPoints?: number;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  reading,
  trace,
  userProfile,
  onRefresh,
  isLoading,
  onNavigateTab,
  onSelectLibraryNumber,
  onClaimReward,
  onOpenAchievements,
  karmaPoints = 0,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playingProgress, setPlayingProgress] = useState<{ current: number; total: number } | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState<CosmicVoiceId>(getSelectedVoiceId());
  const [copied, setCopied] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [hasClaimedTraceReward, setHasClaimedTraceReward] = useState(false);
  const [hasClaimedAudioReward, setHasClaimedAudioReward] = useState(false);

  // Custom Report state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [curatedCount, setCuratedCount] = useState(0);
  const [inReportMap, setInReportMap] = useState<Record<string, boolean>>({});

  // Individual Section Audio state
  const [activePlayingCardId, setActivePlayingCardId] = useState<string | null>(null);

  // Reading view layout toggle ('cards' vs 'classic')
  const [displayMode, setDisplayMode] = useState<'cards' | 'classic'>('cards');

  // Popups and interactive modal states
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [deepDiveTopic, setDeepDiveTopic] = useState<'shadow' | 'careers' | 'romance' | 'crystal' | 'karmic' | 'cycles'>('shadow');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAffirmationPopupOpen, setIsAffirmationPopupOpen] = useState(false);

  // Sync report count and block statuses
  useEffect(() => {
    const updateReportState = () => {
      const blocks = getCustomReportBlocks();
      setCuratedCount(blocks.length);
      const newMap: Record<string, boolean> = {};
      blocks.forEach((b) => {
        newMap[b.source] = true;
      });
      setInReportMap(newMap);
    };

    updateReportState();
    window.addEventListener('cosmic-report-updated', updateReportState);
    return () => window.removeEventListener('cosmic-report-updated', updateReportState);
  }, []);

  // Clean up any ongoing audio playback on unmount
  useEffect(() => {
    return () => {
      stopSoothingAudio();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center px-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#C87A5E]/20 border-t-[#C87A5E] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#C87A5E] absolute inset-0 m-auto animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">Channeling Life Path Wisdom...</h3>
          <p className="text-xs text-[#7A7369] dark:text-[#A69E92] max-w-sm mt-1">
            Calculating month, day, and year reductions and invoking intuitive companion insights.
          </p>
        </div>
      </div>
    );
  }

  if (!reading || !userProfile) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#342F2A] rounded-[32px] max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C87A5E]/10 text-[#C87A5E] flex items-center justify-center">
          <Sparkles className="w-7 h-7 animate-bounce" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">Welcome to Your Cosmic Sanctuary 🔮</h2>
        <p className="text-xs text-[#7A7369] dark:text-[#A69E92] max-w-md mx-auto">
          Enter your date of birth to reveal your Life Path calculation, core strengths, growth areas, and personalized daily guidance.
        </p>
        <button
          onClick={onRefresh}
          className="bg-[#C87A5E] hover:bg-[#B86C52] text-white font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate Life Path Reading</span>
        </button>
      </div>
    );
  }

  const detail = LIFE_PATH_DETAILS[reading.lifePathNumber] || LIFE_PATH_DETAILS[1];
  const cleanMarkdown = sanitizeMarkdownReading(reading.markdownContent);

  // Soothing Voice Speech Narration powered by Gemini AI TTS
  const handleToggleAudio = () => {
    if (isPlayingAudio || isLoadingAudio) {
      stopSoothingAudio();
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
    } else {
      speakSoothingly({
        text: cleanMarkdown,
        voiceId: activeVoiceId,
        onLoading: (loading) => setIsLoadingAudio(loading),
        onStart: () => {
          setIsLoadingAudio(false);
          setIsPlayingAudio(true);
          if (!hasClaimedAudioReward && onClaimReward) {
            setHasClaimedAudioReward(true);
            onClaimReward(15, `Listened to Life Path Audio Narration (${activeVoiceId} Voice) 🎧`);
          }
        },
        onEnd: () => {
          setIsPlayingAudio(false);
          setIsLoadingAudio(false);
        },
        onError: () => {
          setIsPlayingAudio(false);
          setIsLoadingAudio(false);
        },
        rate: 0.86,
        pitch: 0.98,
      });
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(cleanMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([cleanMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `LifePath_${reading.lifePathNumber}_Reading_${userProfile.name || 'Seeker'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-2 sm:px-4 pb-12">
      {/* Daily Quests & Ascendance Tracker Banner */}
      {onOpenAchievements && (
        <DailyQuestsBanner
          userProfile={userProfile}
          karmaPoints={karmaPoints}
          onOpenAchievements={onOpenAchievements}
          onNavigateTab={onNavigateTab}
        />
      )}

      {/* Personalized Daily Affirmation Banner */}
      <DailyAffirmationBanner
        lifePathNumber={reading.lifePathNumber}
        userProfile={userProfile}
        onClaimReward={onClaimReward}
      />

      {/* Tailored Cosmic Archetype Artwork Card */}
      <LifePathArtworkCard
        lifePathNumber={reading.lifePathNumber}
        userProfile={userProfile}
      />

      {/* Hero Badge Banner (Natural Tones Design) */}
      <div className="relative bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 md:p-10 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left w-full min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-full bg-[#7D8E7A] flex flex-col items-center justify-center text-white shadow-md">
                <span className="text-2xl sm:text-4xl font-serif italic font-bold">{reading.lifePathNumber}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/90 font-mono mt-0.5">
                  {reading.isMasterNumber ? 'Master' : 'Path'}
                </span>
              </div>
              {reading.isMasterNumber && (
                <span className="absolute -top-1 -right-1 bg-[#C8826D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white shadow">
                  ✨ Master
                </span>
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-[#C8826D] text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] truncate">
                {userProfile.birthDate ? formatBirthDate(userProfile.birthDate) : 'Cosmic Reading'}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] leading-tight break-words">
                Life Path <span className="text-[#7D8E7A] italic">{reading.lifePathNumber}</span>: {reading.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B665E] dark:text-[#A39E93] font-medium italic break-words">
                {reading.archetype} • Ruler: {reading.rulingPlanet} • Element: {reading.element}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Custom Curated Report Button */}
            <button
              id="open-custom-report-btn"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl sm:rounded-2xl text-xs font-bold shadow-md transition-all group"
              title="Curate, print, or share your custom personal report"
            >
              <FileText className="w-4 h-4" />
              <span>Personal Report</span>
              {curatedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-white text-amber-700 rounded-full text-[10px] font-black">
                  {curatedCount}
                </span>
              )}
            </button>

            {/* Personalized Visual Share Card Button */}
            <button
              id="open-share-card-btn"
              onClick={() => setIsShareCardOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-xl sm:rounded-2xl text-xs font-bold shadow-xs transition-all"
              title="Generate Personalized Visual Social Card"
            >
              <Share2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Share Card</span>
            </button>

            {/* Audio Listen Button */}
            <button
              id="narration-audio-btn"
              onClick={handleToggleAudio}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl sm:rounded-2xl text-xs font-semibold border transition-all ${
                isPlayingAudio
                  ? 'bg-[#C8826D] text-white border-[#C8826D] shadow-md animate-pulse'
                  : 'bg-[#F8F5F2] dark:bg-[#35322D] text-[#4A4741] dark:text-[#F8F5F2] border-[#E0D4C3] dark:border-[#4A4741] hover:bg-[#E0D4C3]/50'
              }`}
              title="Listen to Narration (Gemini AI TTS)"
            >
              {isLoadingAudio ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#C8826D] animate-spin" />
                  <span>Channeling...</span>
                </>
              ) : isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#C8826D]" />
                  <span>Listen Full</span>
                </>
              )}
            </button>

            {/* Voice Persona Switcher */}
            <button
              id="reading-voice-settings-btn"
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-2 bg-[#C87A5E]/10 hover:bg-[#C87A5E]/20 text-[#C87A5E] border border-[#C87A5E]/30 rounded-xl sm:rounded-2xl text-xs font-bold transition-all"
              title="Change Cosmic Voice Persona"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Voice: {activeVoiceId}</span>
            </button>

            <button
              id="copy-markdown-btn"
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#F8F5F2] dark:bg-[#35322D] border border-[#E0D4C3] dark:border-[#4A4741] rounded-xl sm:rounded-2xl text-xs text-[#4A4741] dark:text-[#F8F5F2] hover:bg-[#E0D4C3]/40 transition-all"
              title="Copy Reading"
            >
              {copied ? <Check className="w-4 h-4 text-[#7D8E7A]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              id="download-md-btn"
              onClick={handleDownloadFile}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#F8F5F2] dark:bg-[#35322D] border border-[#E0D4C3] dark:border-[#4A4741] rounded-xl sm:rounded-2xl text-xs text-[#4A4741] dark:text-[#F8F5F2] hover:bg-[#E0D4C3]/40 transition-all"
              title="Download Markdown"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              id="recalculate-btn"
              onClick={onRefresh}
              className="p-2 bg-[#F8F5F2] dark:bg-[#35322D] border border-[#E0D4C3] dark:border-[#4A4741] rounded-xl sm:rounded-2xl text-[#C8826D] transition-all hover:bg-[#E0D4C3]/40"
              title="Recalculate Profile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calculation Trace Collapsible Details */}
        {trace && (
          <div className="mt-5 border-t border-[#F0EBE5] dark:border-[#3D3A35] pt-4">
            <button
              onClick={() => {
                const nextState = !showTrace;
                setShowTrace(nextState);
                if (nextState && !hasClaimedTraceReward && onClaimReward) {
                  setHasClaimedTraceReward(true);
                  onClaimReward(10, 'Examined Pythagorean Mathematical Reduction Trace 📐');
                }
              }}
              className="flex items-center space-x-2 text-xs text-[#7D8E7A] font-semibold tracking-wide transition-colors"
            >
              <span>{showTrace ? 'Hide Birth Date Calculation' : 'View Birth Date Calculation Breakdown (+10 PTS)'}</span>
              {showTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTrace && (
              <div className="mt-3 bg-[#F8F5F2] dark:bg-[#252320] rounded-2xl p-3.5 sm:p-4 border border-[#F0EBE5] dark:border-[#3D3A35] text-xs font-sans space-y-3 text-[#4A4741] dark:text-[#F8F5F2]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="text-[#C8826D] font-bold uppercase text-[11px] tracking-wider">Pythagorean Life Path Calculation</span>
                  <span className="text-[#7D8E7A] font-bold text-xs bg-[#7D8E7A]/10 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    Life Path {trace.finalLifePath}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white dark:bg-[#302D29] p-2.5 sm:p-3 rounded-xl border border-[#F0EBE5] dark:border-[#3D3A35]">
                    <span className="text-[#8C867C] block text-[11px]">Month: {trace.month}</span>
                    <span className="text-[#7D8E7A] font-bold text-sm">Reduces to {trace.monthReduced}</span>
                  </div>
                  <div className="bg-white dark:bg-[#302D29] p-2.5 sm:p-3 rounded-xl border border-[#F0EBE5] dark:border-[#3D3A35]">
                    <span className="text-[#8C867C] block text-[11px]">Day: {trace.day}</span>
                    <span className="text-[#7D8E7A] font-bold text-sm">Reduces to {trace.dayReduced}</span>
                  </div>
                  <div className="bg-white dark:bg-[#302D29] p-2.5 sm:p-3 rounded-xl border border-[#F0EBE5] dark:border-[#3D3A35]">
                    <span className="text-[#8C867C] block text-[11px]">Year: {trace.year}</span>
                    <span className="text-[#7D8E7A] font-bold text-sm">Reduces to {trace.yearReduced}</span>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 bg-white dark:bg-[#302D29] rounded-xl border border-[#F0EBE5] dark:border-[#3D3A35] text-xs text-[#6B665E] dark:text-[#D1CBC3] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span><strong>Total:</strong> {trace.monthReduced} + {trace.dayReduced} + {trace.yearReduced} = <strong>{trace.stepSum}</strong></span>
                  <span className="text-[#C8826D] font-bold">Final Life Path → {trace.finalLifePath} ({detail.archetype})</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Wisdom Codex & Gamified Popups Trigger Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#7D8E7A]/15 to-[#C8826D]/10 dark:from-amber-950/30 dark:via-[#7D8E7A]/20 dark:to-[#C8826D]/20 border border-amber-200/80 dark:border-stone-800 rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8826D] bg-[#C8826D]/10 px-2.5 py-0.5 rounded-full">
              Interactive Micro-Popups Hub
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] mt-1">
              Explore Life Path #{reading.lifePathNumber} Codex & Quizzes
            </h3>
          </div>
          <span className="text-xs text-[#7D8E7A] font-bold bg-[#7D8E7A]/10 dark:bg-[#7D8E7A]/20 px-2.5 py-1 rounded-xl shrink-0">
            ✨ Earn +10 to +30 Karma Points
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => {
              setDeepDiveTopic('shadow');
              setIsDeepDiveOpen(true);
            }}
            className="p-3 bg-white dark:bg-[#2D2A26] hover:bg-stone-100 dark:hover:bg-[#38342F] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-2xl text-left transition-all shadow-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-[#4A4741] dark:text-[#F8F5F2]">Shadow Codex</span>
            <span className="text-[10px] text-[#8C867C]">Pitfalls & Cures</span>
          </button>

          <button
            onClick={() => {
              setDeepDiveTopic('careers');
              setIsDeepDiveOpen(true);
            }}
            className="p-3 bg-white dark:bg-[#2D2A26] hover:bg-stone-100 dark:hover:bg-[#38342F] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-2xl text-left transition-all shadow-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-[#4A4741] dark:text-[#F8F5F2]">Vocations</span>
            <span className="text-[10px] text-[#8C867C]">Aligned Careers</span>
          </button>

          <button
            onClick={() => {
              setDeepDiveTopic('romance');
              setIsDeepDiveOpen(true);
            }}
            className="p-3 bg-white dark:bg-[#2D2A26] hover:bg-stone-100 dark:hover:bg-[#38342F] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-2xl text-left transition-all shadow-xs group"
          >
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-[#4A4741] dark:text-[#F8F5F2]">Love Synastry</span>
            <span className="text-[10px] text-[#8C867C]">Compatibility</span>
          </button>

          <button
            onClick={() => setIsQuizOpen(true)}
            className="p-3 bg-white dark:bg-[#2D2A26] hover:bg-stone-100 dark:hover:bg-[#38342F] border border-amber-300 dark:border-amber-800/80 rounded-2xl text-left transition-all shadow-xs group ring-1 ring-amber-400/30"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-teal-500 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
              <Star className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-[#4A4741] dark:text-[#F8F5F2]">Cosmic Quiz</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">+30 PTS Challenge</span>
          </button>
        </div>
      </div>

      {/* Reading View Display Switcher & Report Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100 dark:bg-stone-900/70 p-3 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDisplayMode('cards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              displayMode === 'cards'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-amber-600" />
            <span>Curated Insight Cards</span>
          </button>

          <button
            onClick={() => setDisplayMode('classic')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              displayMode === 'classic'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <AlignLeft className="w-4 h-4 text-stone-500" />
            <span>Classic Full View</span>
          </button>
        </div>

        {/* Custom Report Quick Summary & Opener */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden md:inline">
            Assemble your custom report to print, email, or share:
          </span>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Custom Report Dossier ({curatedCount})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Cards or Classic Markdown */}
      {displayMode === 'cards' ? (
        <div className="space-y-6">
          {getStructuredReadingCards(reading, trace, userProfile.name, userProfile.birthDate).map((card) => {
            const isCardPlaying = activePlayingCardId === card.id;
            const inReport = inReportMap[card.source] || isBlockInReport(card.source, card.title);

            return (
              <div
                key={card.id}
                id={`card-${card.id}`}
                className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] p-5 sm:p-8 shadow-xs space-y-4 hover:border-amber-300 dark:hover:border-amber-800/80 transition-all"
              >
                {/* Card Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800/80 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
                        {card.category}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2]">
                      {card.title}
                    </h3>
                    {/* Sub-header that links directly into the Research & Library */}
                    {card.libraryLink && (
                      <div className="pt-0.5">
                        <button
                          onClick={() => {
                            if (card.libraryLink?.number && onSelectLibraryNumber) {
                              onSelectLibraryNumber(card.libraryLink.number);
                            }
                            onNavigateTab('suite');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors group"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>{card.libraryLink.label}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70 group-hover:opacity-100" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Actions: Listen to Section & Add to Curated Report */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`listen-card-${card.id}`}
                      onClick={() => {
                        if (isCardPlaying) {
                          stopSoothingAudio();
                          setActivePlayingCardId(null);
                        } else {
                          stopSoothingAudio();
                          setIsPlayingAudio(false);
                          setActivePlayingCardId(card.id);
                          speakSoothingly({
                            text: card.speechText,
                            voiceId: activeVoiceId,
                            onStart: () => setActivePlayingCardId(card.id),
                            onEnd: () => setActivePlayingCardId(null),
                            onError: () => setActivePlayingCardId(null),
                          });
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isCardPlaying
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 animate-pulse'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                      title="Listen to this section"
                    >
                      {isCardPlaying ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>

                    <button
                      id={`curate-card-${card.id}`}
                      onClick={() => {
                        const added = toggleReportBlock({
                          source: card.source,
                          title: card.title,
                          category: card.category,
                          summaryText: card.summaryText,
                          fullContent: card.fullMarkdown,
                        });
                        const updated = getCustomReportBlocks();
                        setCuratedCount(updated.length);
                        setInReportMap((prev) => ({ ...prev, [card.source]: added }));
                        if (added && onClaimReward) {
                          onClaimReward(5, `Curated "${card.title}" into Personal Report 📑`);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        inReport
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                      }`}
                      title="Add block to custom personal report"
                    >
                      {inReport ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>In Report</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add to Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Markdown Content */}
                <div className="markdown-body prose max-w-none text-[#3D3A35] dark:text-[#F8F5F2] prose-headings:font-serif prose-headings:text-[#4A4741] dark:prose-headings:text-[#F8F5F2] prose-a:text-[#C8826D] prose-strong:text-[#7D8E7A] text-sm sm:text-base leading-relaxed">
                  <ReactMarkdown>{card.fullMarkdown}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Main Formatted Reading Card (Classic Full Scroll) */
        <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 md:p-10 shadow-sm space-y-6 text-[#3D3A35] dark:text-[#F8F5F2] leading-relaxed overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Continuous Full Transmission
            </span>
            <button
              onClick={() => {
                const added = toggleReportBlock({
                  source: 'reading_full',
                  title: `Life Path ${reading.lifePathNumber}: Complete Blueprint`,
                  category: 'Life Path Reading',
                  summaryText: `${reading.title} (${reading.archetype})`,
                  fullContent: cleanMarkdown,
                });
                const updated = getCustomReportBlocks();
                setCuratedCount(updated.length);
                setInReportMap((prev) => ({ ...prev, reading_full: added }));
              }}
              className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{inReportMap['reading_full'] ? '✓ In Custom Report' : '+ Add Full Reading to Report'}</span>
            </button>
          </div>
          <div className="markdown-body prose max-w-none text-[#3D3A35] dark:text-[#F8F5F2] prose-headings:font-serif prose-headings:text-[#4A4741] dark:prose-headings:text-[#F8F5F2] prose-a:text-[#C8826D] prose-strong:text-[#7D8E7A]">
            <ReactMarkdown>{cleanMarkdown}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Quick Action Hub (Natural Tones Cards with Applied Focus Mode CSS Styles) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigateTab('horoscope')}
          className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 cursor-pointer hover:border-[#C8826D] transition-all shadow-sm space-y-2.5 font-bold text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#E0D4C3]/50 flex items-center justify-center text-[#C8826D] mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] text-[18px] sm:text-[20px]">Daily Horoscope</h4>
          <p className="text-xs text-[#6B665E] dark:text-[#A39E93] leading-relaxed">
            Personal Day vibration forecast, transit insights, & daily affirmations.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('habits')}
          className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 cursor-pointer hover:border-[#7D8E7A] transition-all shadow-sm space-y-2.5 italic text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#7D8E7A]/20 flex items-center justify-center text-[#7D8E7A] mx-auto">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] text-[18px] sm:text-[20px]">Personalized Rituals</h4>
          <p className="text-xs text-[#6B665E] dark:text-[#A39E93] leading-relaxed">
            Build habits and daily routines tailored to Life Path #{reading.lifePathNumber}.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('goals')}
          className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 cursor-pointer hover:border-[#C8826D] transition-all shadow-sm space-y-2.5 font-bold italic text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#C8826D]/20 flex items-center justify-center text-[#C8826D] mx-auto">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] text-[18px] sm:text-[20px]">Vision Board</h4>
          <p className="text-xs text-[#6B665E] dark:text-[#A39E93] leading-relaxed">
            Formulate high-vibration targets with custom AI artwork generation.
          </p>
        </div>
      </div>

      {/* Popups & Modals */}
      <CosmicDeepDivesModal
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
        lifePathNumber={reading.lifePathNumber}
        userProfile={userProfile}
        initialTopic={deepDiveTopic}
        onClaimReward={onClaimReward}
      />

      <CosmicQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        userLifePath={reading.lifePathNumber}
        onClaimReward={onClaimReward || (() => {})}
      />

      <CosmicAffirmationPopup
        isOpen={isAffirmationPopupOpen}
        onClose={() => setIsAffirmationPopupOpen(false)}
        lifePathNumber={reading.lifePathNumber}
        onClaimReward={onClaimReward}
      />

      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceChanged={(newVoiceId) => setActiveVoiceId(newVoiceId)}
      />

      {/* Custom Curated Report Modal (Print, Copy, Email, SMS, Social Share) */}
      <CustomReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userProfile={userProfile}
        reading={reading}
      />

      {/* Personalized Visual Social Card Modal */}
      <CosmicShareCardModal
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
        userProfile={userProfile}
        reading={reading}
      />
    </div>
  );
};
