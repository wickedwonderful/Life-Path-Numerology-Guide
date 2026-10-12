import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, RefreshCw, CheckCircle, Share2, Award, HeartHandshake, Radio, Loader2 } from 'lucide-react';
import { LifePathNumber, UserProfile } from '../types';
import {
  speakSoothingly,
  stopSoothingAudio,
  getSelectedVoiceId,
  COSMIC_VOICES,
  CosmicVoiceId,
} from '../utils/speech';
import { VoiceSettingsModal } from './VoiceSettingsModal';

interface DailyAffirmationBannerProps {
  lifePathNumber: LifePathNumber;
  userProfile: UserProfile;
  onClaimReward?: (points: number, reason: string) => void;
}

const AFFIRMATION_LIBRARY: Record<LifePathNumber, string[]> = {
  1: [
    'I lead my life with original courage, unshakeable confidence, and clear vision today.',
    'I step boldly into new horizons, trusting my independent wisdom and inner authority.',
    'My pioneering spirit lights the path for myself and inspires authentic action in others.',
  ],
  2: [
    'I cultivate deep harmony, peaceful diplomacy, and intuitive empathy in all my connections.',
    'My gentle presence heals divisions and brings compassionate understanding to every space.',
    'I trust the quiet strength of partnership, patience, and emotional balance today.',
  ],
  3: [
    'My creative truth flows effortlessly today, bringing joy, laughter, and authentic expression.',
    'I express my ideas with radiance and trust that my words illuminate the world around me.',
    'I welcome spontaneous artistic inspiration and celebrate the beauty of being seen.',
  ],
  4: [
    'I build my dreams on solid ground, disciplined effort, and enduring dedication today.',
    'My focus creates stability, order, and tangible progress towards my highest goals.',
    'I take patient, purposeful steps, trusting that consistency leads to ultimate mastery.',
  ],
  5: [
    'I embrace positive change, adventurous growth, and vibrant freedom with an open heart.',
    'I adapt effortlessly to life’s fluid currents, transforming every transition into opportunity.',
    'My curious mind expands beyond boundaries, attracting fresh experiences and joy.',
  ],
  6: [
    'I nurture myself and my loved ones with unconditional love, warmth, and steady protection.',
    'My home and heart are sacred sanctuaries of comfort, harmony, and lasting beauty.',
    'I lead with healing grace, honoring my boundaries while offering generous care.',
  ],
  7: [
    'I trust the quiet sanctuary of my inner wisdom, seeking truth, depth, and higher knowledge.',
    'Every lesson deepens my understanding, aligning my mind with divine cosmic order.',
    'I grant myself quiet moments of introspection to listen to the whispers of my soul.',
  ],
  8: [
    'I step fully into my personal power, attracting abundant prosperity and material balance.',
    'I direct my executive focus with integrity, creating sustainable success for the highest good.',
    'My capacity to generate value and lead with wisdom expands naturally every day.',
  ],
  9: [
    'I release the past with forgiveness, opening my soul to universal love and humanitarian purpose.',
    'My wisdom transcends judgment, offering healing compassion and light to all living beings.',
    'I honor the completion of old cycles as I welcome profound spiritual rebirth.',
  ],
  11: [
    'I am a clear channel for spiritual intuition, higher illumination, and inspirational light.',
    'My inner vision pierces through confusion, guiding myself and others towards divine clarity.',
    'I embrace my sensitivity as a sacred superpower that uplifts every environment I enter.',
  ],
  22: [
    'I transform visionary spiritual dreams into tangible, enduring masterworks for humanity.',
    'My focus unites practical execution with infinite cosmic potential for global good.',
    'I am empowered to build legacy structures that support peace, prosperity, and wisdom.',
  ],
  33: [
    'I radiate unconditional altruistic love, uplifting hearts and healing communities effortlessly.',
    'My teaching and devotion inspire profound transformation, hope, and joyful harmony.',
    'I walk in humble alignment with universal compassion, embodying divine grace in daily life.',
  ],
};

export const DailyAffirmationBanner: React.FC<DailyAffirmationBannerProps> = ({
  lifePathNumber,
  userProfile,
  onClaimReward,
}) => {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState<CosmicVoiceId>(getSelectedVoiceId());
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSoothingAudio();
    };
  }, []);

  // Pick deterministic affirmation index based on today's date + LP number
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash += todayStr.charCodeAt(i);
    }
    const lib = AFFIRMATION_LIBRARY[lifePathNumber] || AFFIRMATION_LIBRARY[1];
    setAffirmationIndex(hash % lib.length);
  }, [lifePathNumber]);

  const currentAffirmation =
    AFFIRMATION_LIBRARY[lifePathNumber]?.[affirmationIndex] ||
    AFFIRMATION_LIBRARY[1][0];

  const handleNextAffirmation = () => {
    const lib = AFFIRMATION_LIBRARY[lifePathNumber] || AFFIRMATION_LIBRARY[1];
    setAffirmationIndex((prev) => (prev + 1) % lib.length);
    if (isSpeaking || isLoadingVoice) {
      stopSoothingAudio();
      setIsSpeaking(false);
      setIsLoadingVoice(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking || isLoadingVoice) {
      stopSoothingAudio();
      setIsSpeaking(false);
      setIsLoadingVoice(false);
    } else {
      speakSoothingly({
        text: currentAffirmation,
        voiceId: activeVoiceId,
        onLoading: (loading) => setIsLoadingVoice(loading),
        onStart: () => {
          setIsLoadingVoice(false);
          setIsSpeaking(true);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsLoadingVoice(false);
        },
        onError: () => {
          setIsSpeaking(false);
          setIsLoadingVoice(false);
        },
        rate: 0.84, // Relaxed mindful tempo
        pitch: 0.98,
      });
    }
  };

  const handleClaimKarma = () => {
    if (!claimed) {
      setClaimed(true);
      if (onClaimReward) {
        onClaimReward(15, `Daily Affirmation Recited (Life Path #${lifePathNumber})`);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`✨ Life Path #${lifePathNumber} Daily Affirmation:\n"${currentAffirmation}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-[#F8F5F2] via-white to-[#F8F5F2] dark:from-[#252320] dark:via-[#2D2A26] dark:to-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#C8826D]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8826D] bg-[#C8826D]/15 px-3 py-0.5 rounded-full border border-[#C8826D]/20 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#C8826D]" />
              <span>Personalized Daily Affirmation</span>
            </span>
            <span className="text-[10px] font-bold text-[#7D8E7A]">
              Life Path #{lifePathNumber}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] italic leading-relaxed break-words">
            "{currentAffirmation}"
          </h3>

          <p className="text-[11px] text-[#6B665E] dark:text-[#A39E93]">
            Recite aloud or listen to anchor your core Life Path superpower today.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Gemini AI Voice Speaker Button */}
          <button
            id="speak-affirmation-btn"
            onClick={handleSpeak}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
              isSpeaking
                ? 'bg-[#C8826D] text-white border-[#C8826D] shadow animate-pulse'
                : 'bg-white dark:bg-[#2D2A26] text-[#4A4741] dark:text-[#F8F5F2] border-[#E0D4C3] dark:border-[#3D3A35] hover:bg-[#E0D4C3]/30'
            }`}
            title="Listen via Gemini AI Soothing Voice"
          >
            {isLoadingVoice ? (
              <>
                <Loader2 className="w-4 h-4 text-[#C8826D] animate-spin" />
                <span className="text-xs">Connecting...</span>
              </>
            ) : isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-xs">Pause</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#C8826D]" />
                <span className="text-xs">Listen</span>
              </>
            )}
          </button>

          {/* Quick Voice Persona Selector Button */}
          <button
            id="voice-persona-picker-btn"
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-2.5 py-2 sm:py-2.5 bg-[#C87A5E]/10 hover:bg-[#C87A5E]/20 text-[#C87A5E] border border-[#C87A5E]/30 rounded-xl sm:rounded-2xl text-[11px] font-bold transition-all flex items-center space-x-1"
            title="Change Voice Persona (Gemini AI TTS)"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Voice: {activeVoiceId}</span>
          </button>

          <button
            onClick={handleNextAffirmation}
            className="p-2 sm:p-2.5 bg-white dark:bg-[#2D2A26] hover:bg-[#E0D4C3]/30 text-[#4A4741] dark:text-[#F8F5F2] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-xl sm:rounded-2xl text-xs font-bold transition-all"
            title="Shuffle Next Affirmation"
          >
            <RefreshCw className="w-4 h-4 text-[#7D8E7A]" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 sm:p-2.5 bg-white dark:bg-[#2D2A26] hover:bg-[#E0D4C3]/30 text-[#4A4741] dark:text-[#F8F5F2] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-xl sm:rounded-2xl text-xs font-bold transition-all"
            title="Copy Affirmation"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#8C867C]" />}
          </button>

          <button
            onClick={handleClaimKarma}
            disabled={claimed}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm ${
              claimed
                ? 'bg-[#7D8E7A]/20 text-[#7D8E7A] border border-[#7D8E7A]/30 cursor-default'
                : 'bg-[#C8826D] hover:bg-[#b5735e] text-white shadow-[#C8826D]/20'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{claimed ? 'Karma Claimed +15 ✨' : 'Claim Daily Karma +15'}</span>
          </button>
        </div>
      </div>

      {/* Voice Persona Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceChanged={(newVoiceId) => setActiveVoiceId(newVoiceId)}
      />
    </div>
  );
};
