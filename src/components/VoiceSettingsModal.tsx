import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Play, Square, Check, Headphones, X, Waves, Radio, Sliders, Shield } from 'lucide-react';
import {
  COSMIC_VOICES,
  CosmicVoiceId,
  getSelectedVoiceId,
  setSelectedVoiceId,
  speakSoothingly,
  stopSoothingAudio,
  isSoothingAudioActive,
} from '../utils/speech';
import { isProSubscriber } from '../utils/subscriptionStore';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceChanged?: (newVoiceId: CosmicVoiceId) => void;
  onOpenSubscription?: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  onVoiceChanged,
  onOpenSubscription,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<CosmicVoiceId>(getSelectedVoiceId());
  const [playingVoiceId, setPlayingVoiceId] = useState<CosmicVoiceId | null>(null);
  const [customTestPhrase, setCustomTestPhrase] = useState('');
  const [isPro, setIsPro] = useState(isProSubscriber());

  useEffect(() => {
    if (isOpen) {
      setSelectedVoice(getSelectedVoiceId());
      setIsPro(isProSubscriber());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectVoice = (voiceId: CosmicVoiceId) => {
    setSelectedVoice(voiceId);
    setSelectedVoiceId(voiceId);
    if (onVoiceChanged) onVoiceChanged(voiceId);
  };

  const handlePreviewVoice = (voiceId: CosmicVoiceId, sampleText: string) => {
    if (playingVoiceId === voiceId) {
      stopSoothingAudio();
      setPlayingVoiceId(null);
      return;
    }

    stopSoothingAudio();
    setPlayingVoiceId(voiceId);

    const textToSpeak = customTestPhrase.trim() || sampleText;

    speakSoothingly({
      text: textToSpeak,
      voiceId,
      onStart: () => setPlayingVoiceId(voiceId),
      onEnd: () => setPlayingVoiceId(null),
      onError: () => setPlayingVoiceId(null),
    });
  };

  const handleClose = () => {
    stopSoothingAudio();
    setPlayingVoiceId(null);
    onClose();
  };

  return (
    <div
      id="voice-settings-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={handleClose}
    >
      <div
        id="voice-settings-dialog"
        className="w-full max-w-xl bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#38332D] rounded-[28px] sm:rounded-[36px] shadow-2xl p-5 sm:p-7 space-y-5 text-[#2C2723] dark:text-[#F5F2EC] my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#F0EBE5] dark:border-[#342F2A] shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C87A5E] bg-[#C87A5E]/10 px-3 py-1 rounded-full border border-[#C87A5E]/20 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Cosmic Audio &amp; Voice Personas
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">
              Vocal Frequency &amp; Guide Personas
            </h3>
            <p className="text-xs text-[#7A7369] dark:text-[#A69E92]">
              Choose the acoustic vibration and tone for reading narrations, daily affirmations, and meditations.
            </p>
          </div>
          <button
            id="close-voice-settings-btn"
            onClick={handleClose}
            className="p-2 text-[#7A7369] hover:text-[#2C2723] dark:text-[#A69E92] dark:hover:text-white rounded-full hover:bg-[#F4EFEA] dark:hover:bg-[#342F2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Test Bar */}
        <div className="bg-[#FAF7F2] dark:bg-[#141311] border border-[#EAE3D9] dark:border-[#342F2A] rounded-2xl p-3 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Type any affirmation to test voice (e.g. I am aligned with abundance)..."
            value={customTestPhrase}
            onChange={(e) => setCustomTestPhrase(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#2C2723] dark:text-[#F5F2EC] placeholder-[#A69E92] focus:outline-none"
          />
          {customTestPhrase && (
            <button
              onClick={() => setCustomTestPhrase('')}
              className="text-[10px] text-[#7A7369] hover:text-[#2C2723] dark:hover:text-white px-1.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Voice Cards */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {COSMIC_VOICES.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            const isPlaying = playingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-[24px] border transition-all ${
                  isSelected
                    ? 'border-[#C87A5E] bg-[#C87A5E]/5 dark:bg-[#C87A5E]/10 shadow-sm ring-1 ring-[#C87A5E]/30'
                    : 'border-[#F0EBE5] dark:border-[#342F2A] bg-white dark:bg-[#201D1A] hover:border-[#EAE3D9]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                        {voice.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5E7E6B]/15 text-[#5E7E6B] dark:text-[#88B298] border border-[#5E7E6B]/25">
                        {voice.archetype}
                      </span>
                      {voice.isAi && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#C87A5E]/15 text-[#C87A5E] border border-[#C87A5E]/30">
                          {voice.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A7369] dark:text-[#A69E92] mt-1">
                      {voice.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#A69E92] dark:text-[#7A7369] mt-1.5 font-medium">
                      <span>Tone: <strong className="text-[#2C2723] dark:text-[#F5F2EC]">{voice.tone}</strong></span>
                      <span>•</span>
                      <span>Pace: {Math.round(voice.rate * 100)}%</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Play Sample Button */}
                    <button
                      type="button"
                      onClick={() => handlePreviewVoice(voice.id, voice.samplePhrase)}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isPlaying
                          ? 'bg-[#C87A5E] text-white border-[#C87A5E] shadow-sm animate-pulse'
                          : 'bg-[#FAF7F2] dark:bg-[#2C2824] hover:bg-[#EAE3D9]/60 text-[#2C2723] dark:text-[#F5F2EC] border-[#EAE3D9] dark:border-[#38332D]'
                      }`}
                      title={isPlaying ? 'Stop Voice Sample' : 'Listen to Voice Sample'}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current text-[#C87A5E]" />
                          <span>Preview</span>
                        </>
                      )}
                    </button>

                    {/* Select Active Voice Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectVoice(voice.id)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#5E7E6B] text-white shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Audible sample snippet */}
                <div className="mt-2.5 pt-2 border-t border-[#F0EBE5] dark:border-[#342F2A] flex items-center justify-between text-[11px] text-[#7A7369] dark:text-[#A69E92] italic">
                  <span className="truncate">&quot;{voice.samplePhrase}&quot;</span>
                  {isPlaying && (
                    <span className="flex items-center gap-1 text-[#C87A5E] font-bold not-italic shrink-0 ml-2 animate-pulse">
                      <Waves className="w-3 h-3" />
                      Speaking...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Banner in modal */}
        {!isPro && onOpenSubscription && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-tight">
                <strong>Cosmic Pro VIP:</strong> Unlock studio-quality AI audio streams and unlimited client readings.
              </p>
            </div>
            <button
              onClick={() => {
                handleClose();
                onOpenSubscription();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-sm hover:opacity-90 shrink-0"
            >
              Explore Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
