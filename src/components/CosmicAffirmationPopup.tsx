import React, { useState } from 'react';
import { Sparkles, Heart, RefreshCw, X, Award, Share2, Check, Star } from 'lucide-react';
import { LifePathNumber } from '../types';

interface DailyAffirmationCardProps {
  lifePathNumber: LifePathNumber;
  onClaimReward?: (points: number, reason: string) => void;
}

const COSMIC_AFFIRMATIONS: Record<number, string[]> = {
  1: [
    'I step boldly into new beginnings with supreme confidence and inner sovereignty.',
    'My original vision creates pathways where none existed before.',
    'I lead with integrity, vital solar energy, and boundless self-reliance.',
  ],
  2: [
    'I cultivate peaceful diplomacy and trust the intuitive wisdom of my gentle heart.',
    'My relationships are sanctuaries of deep empathy, harmony, and mutual respect.',
    'I honor my sensitivity as a supreme superpower of psychic discernment.',
  ],
  3: [
    'I radiate joyful self-expression, humor, and boundless creative abundance.',
    'My words and art inspire lightness, truth, and inspiration in everyone I meet.',
    'I celebrate the magic of living in complete authentic alignment with my soul.',
  ],
  4: [
    'I build enduring foundations with unwavering patience, discipline, and clarity.',
    'My dedication and focus turn master visions into solid, tangible reality.',
    'I am grounded, secure, and profoundly resilient in all my endeavors.',
  ],
  5: [
    'I embrace adventurous transformation and flow effortlessly with every life change.',
    'My freedom is sacred, vibrant, and magnetically expansive.',
    'I experience life as a thrilling, joyful journey of discovery and sensory delight.',
  ],
  6: [
    'I anchor unconditional love, beauty, and peaceful sanctuary for myself and my tribe.',
    'I care for others from a place of replenished, overflowing self-nurturance.',
    'My presence brings harmony, healing, and warmth to every space.',
  ],
  7: [
    'I trust the quiet whispers of the universe and immerse myself in profound truth.',
    'My inner stillness reveals ancient cosmic mysteries and divine peace.',
    'I honor my solitary sacred reflections as sacred portals of higher awareness.',
  ],
  8: [
    'I command infinite abundance, mastery, and material-spiritual synthesis.',
    'My ambition is an instrument of noble leadership, generosity, and empowerment.',
    'I am a conscious sovereign of boundless prosperity and focused manifestation.',
  ],
  9: [
    'I release the past with total grace and stand as a beacon of universal compassion.',
    'My soul serves the highest collective good with wisdom, artistry, and love.',
    'I embrace completion, knowing every ending births a glorious higher octave.',
  ],
  11: [
    'I channel celestial illumination and walk as a conduit of intuitive guidance.',
    'My visionary insight awakens spiritual transformation across the collective.',
    'I anchor high-frequency light with grounded calm and crystal clarity.',
  ],
  22: [
    'I masterfully construct visionary systems that bless humanity for generations.',
    'My grandest dreams are anchored into practical, tangible manifestation.',
    'I unite spiritual truth with architectural precision and supreme discipline.',
  ],
  33: [
    'I radiate pure Christ-consciousness, compassionate healing, and master artistry.',
    'My heart is an infinite sanctuary of universal love and sacred service.',
    'I uplift the world with joyful devotion, warmth, and boundless grace.',
  ],
};

export const CosmicAffirmationPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  lifePathNumber: LifePathNumber;
  onClaimReward?: (points: number, reason: string) => void;
}> = ({ isOpen, onClose, lifePathNumber, onClaimReward }) => {
  const affirmations = COSMIC_AFFIRMATIONS[lifePathNumber] || COSMIC_AFFIRMATIONS[1];
  const [idx, setIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const currentAffirmation = affirmations[idx % affirmations.length];

  const handleNext = () => {
    setIdx((i) => (i + 1) % affirmations.length);
  };

  const handleClaim = () => {
    if (!claimed && onClaimReward) {
      setClaimed(true);
      onClaimReward(15, `Integrated Daily Affirmation for LP #${lifePathNumber} 🌟`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`✨ "${currentAffirmation}" — Life Path #${lifePathNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C1A18] border border-amber-300 dark:border-amber-900/60 rounded-[32px] sm:rounded-[36px] shadow-2xl p-6 sm:p-8 text-stone-900 dark:text-stone-100 overflow-hidden my-auto text-center space-y-5">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-full">
            Daily Frequency Affirmation
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Heart className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <p className="font-serif italic font-bold text-lg sm:text-xl text-stone-800 dark:text-stone-100 leading-relaxed px-2">
            "{currentAffirmation}"
          </p>
          <span className="text-xs font-mono text-amber-700 dark:text-amber-400 block">
            Life Path #{lifePathNumber} Resonance • Card {idx + 1} of {affirmations.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={handleNext}
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Another</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
              claimed
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-600 to-teal-600 text-white hover:opacity-90'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{claimed ? 'Affirmed ✨' : 'Affirm (+15 PTS)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
