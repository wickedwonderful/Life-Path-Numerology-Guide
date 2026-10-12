import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Flame,
  Shield,
  Compass,
  Heart,
  BookOpen,
  Award,
  Zap,
  Target,
  Layers,
  ChevronRight,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { LIFE_PATH_DETAILS } from '../utils/numerology';
import { LifePathNumber, UserProfile } from '../types';

interface CosmicDeepDivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lifePathNumber: LifePathNumber;
  userProfile: UserProfile | null;
  initialTopic?: 'shadow' | 'careers' | 'romance' | 'crystal' | 'karmic' | 'cycles';
  onClaimReward?: (points: number, reason: string) => void;
}

const CAREER_SUGGESTIONS: Record<number, string[]> = {
  1: ['Entrepreneur & Founder', 'Executive Director', 'Inventive Engineer', 'Creative Director', 'Venture Strategist'],
  2: ['Mediator & Diplomat', 'Psychotherapist', 'Counselor', 'Curator & Artist', 'Community Organizer'],
  3: ['Author & Keynote Speaker', 'Actor & Performer', 'Brand Storyteller', 'Designer', 'Media Producer'],
  4: ['Architect & Urban Planner', 'Operations Director', 'Systems Engineer', 'Financial Analyst', 'Project Manager'],
  5: ['Travel Journalist', 'Growth Marketer', 'International Consultant', 'Adventure Specialist', 'Public Relations Director'],
  6: ['Holistic Healer', 'Educator & Mentor', 'Interior Architect', 'Family Counselor', 'Social Impact Founder'],
  7: ['Data Scientist & Researcher', 'Philosopher & Author', 'Spiritual Teacher', 'Astrophysicist', 'Cybersecurity Specialist'],
  8: ['CEO & Managing Partner', 'Real Estate Developer', 'Investment Banker', 'Media Mogul', 'Philanthropic Founder'],
  9: ['Humanitarian Leader', 'Global Non-Profit Director', 'Fine Artist', 'Environmental Advocate', 'Transformational Coach'],
  11: ['Spiritual Luminary & Author', 'Visionary Coach', 'Media Futurist', 'Intuitive Counselor', 'Pioneering Innovator'],
  22: ['Master Architect & City Builder', 'Global Infrastructure Leader', 'Macroeconomic Strategist', 'Enterprise Founder'],
  33: ['Master Healer & Avatar Mentor', 'Philanthropic Visionary', 'Sacred Arts Teacher', 'World Peace Envoy'],
};

const SYNASTRY_SUGGESTIONS: Record<number, number[]> = {
  1: [3, 5, 7],
  2: [4, 6, 8],
  3: [1, 5, 9],
  4: [2, 6, 8],
  5: [1, 3, 7],
  6: [2, 4, 8, 9],
  7: [1, 4, 5],
  8: [2, 4, 6],
  9: [3, 6, 9],
  11: [2, 4, 22, 33],
  22: [4, 6, 8, 11],
  33: [3, 6, 9, 11, 22],
};

const LUCKY_COLORS: Record<number, string[]> = {
  1: ['Solar Gold', 'Crimson Red', 'Amber'],
  2: ['Silver Moon', 'Pearl White', 'Aqua Blue'],
  3: ['Vibrant Yellow', 'Tangerine', 'Violet'],
  4: ['Emerald Green', 'Earth Brown', 'Slate Gray'],
  5: ['Turquoise', 'Electric Blue', 'Mercury Silver'],
  6: ['Rose Gold', 'Sage Green', 'Indigo'],
  7: ['Deep Violet', 'Mystic Purple', 'Platinum'],
  8: ['Royal Navy', 'Obsidian Black', 'Burnished Bronze'],
  9: ['Gold', 'Crimson', 'Lavender'],
  11: ['Iridescent Pearl', 'Electric Violet', 'Pure White'],
  22: ['Coral', 'Deep Forest Green', 'Gold'],
  33: ['Diamond White', 'Amethyst', 'Celestial Gold'],
};

export const CosmicDeepDivesModal: React.FC<CosmicDeepDivesModalProps> = ({
  isOpen,
  onClose,
  lifePathNumber,
  userProfile,
  initialTopic = 'shadow',
  onClaimReward,
}) => {
  const [activeTopic, setActiveTopic] = useState<'shadow' | 'careers' | 'romance' | 'crystal' | 'karmic' | 'cycles'>(
    initialTopic
  );
  const [claimedTopics, setClaimedTopics] = useState<string[]>([]);

  if (!isOpen) return null;

  const detail = LIFE_PATH_DETAILS[lifePathNumber] || LIFE_PATH_DETAILS[1];
  const careers = CAREER_SUGGESTIONS[lifePathNumber] || ['Creative Visionary', 'Specialist', 'Leader'];
  const synergies = SYNASTRY_SUGGESTIONS[lifePathNumber] || [1, 3, 5];
  const colors = LUCKY_COLORS[lifePathNumber] || ['Solar Gold', 'Pearl White'];

  const handleTopicSelect = (topic: 'shadow' | 'careers' | 'romance' | 'crystal' | 'karmic' | 'cycles') => {
    setActiveTopic(topic);
    if (!claimedTopics.includes(topic) && onClaimReward) {
      setClaimedTopics((prev) => [...prev, topic]);
      onClaimReward(10, `Unlocked Wisdom Deep Dive: ${topic.toUpperCase()} for LP #${lifePathNumber} 📜`);
    }
  };

  const topicsList = [
    { id: 'shadow', label: 'Shadow & Pitfalls', icon: Shield, color: 'text-rose-500' },
    { id: 'careers', label: 'Optimal Vocations', icon: Target, color: 'text-amber-500' },
    { id: 'romance', label: 'Love & Synergies', icon: Heart, color: 'text-pink-500' },
    { id: 'crystal', label: 'Gemstones & Colors', icon: Sparkles, color: 'text-teal-500' },
    { id: 'karmic', label: 'Karmic Mission', icon: Flame, color: 'text-orange-500' },
    { id: 'cycles', label: 'Pinnacles & Cycles', icon: Layers, color: 'text-purple-500' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-[28px] sm:rounded-[36px] shadow-2xl text-stone-900 dark:text-stone-100 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-50 dark:bg-stone-900/70 px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-teal-600 text-white flex items-center justify-center shadow-xs font-serif font-bold text-lg">
              {lifePathNumber}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Cosmic Deep Dive Codex
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                Life Path #{lifePathNumber}: {detail.archetype}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-6 py-3 border-b border-stone-100 dark:border-stone-800/80 bg-white dark:bg-[#1C1A18] shrink-0 no-scrollbar">
          {topicsList.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTopicSelect(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800/70 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400 dark:text-amber-600' : t.color}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Topic Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed">
          {activeTopic === 'shadow' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <h4 className="font-serif font-bold text-rose-800 dark:text-rose-300 flex items-center space-x-2 text-base">
                  <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>The Shadow Frequency & Vulnerabilities</span>
                </h4>
                <p className="text-xs text-rose-900/80 dark:text-rose-200/80 mt-1">
                  When operating from fear, exhaustion, or energetic imbalance, Life Path {lifePathNumber} may encounter these challenges:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detail.challenges.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold shrink-0">
                      !
                    </span>
                    <div>
                      <h5 className="font-bold text-xs text-stone-800 dark:text-stone-200">{c.obstacle}</h5>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {c.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/30">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  ✨ Transmutation Remedy
                </h5>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  Remember your ruling force ({detail.rulingPlanet}) and core elemental balance ({detail.element}). Ground yourself daily through conscious breathwork and intentional alignment rituals.
                </p>
              </div>
            </div>
          )}

          {activeTopic === 'careers' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <h4 className="font-serif font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-2 text-base">
                  <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Aligned Careers & Vocation Mastery</span>
                </h4>
                <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-1">
                  Life Path {lifePathNumber} thrives in domains allowing expression of their innate genius and leadership archetype:
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {careers.map((career, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs border border-stone-200/80 dark:border-stone-700/80"
                  >
                    💼 {career}
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                <h5 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Ideal Work Environment
                </h5>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Seek workplaces with autonomy, creative freedom, high integrity, and clear pathways to master your chosen craft without bureaucratic stagnation.
                </p>
              </div>
            </div>
          )}

          {activeTopic === 'romance' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40">
                <h4 className="font-serif font-bold text-pink-800 dark:text-pink-300 flex items-center space-x-2 text-base">
                  <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  <span>Relationship Chemistry & Compatible Life Paths</span>
                </h4>
                <p className="text-xs text-pink-900/80 dark:text-pink-200/80 mt-1">
                  Harmonious synastry pairings that elevate and complement your frequency:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    Highest Natural Synergies
                  </span>
                  <div className="flex items-center space-x-2 mt-2">
                    {synergies.map((lp) => (
                      <span
                        key={lp}
                        className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-serif font-bold flex items-center justify-center text-sm border border-teal-200 dark:border-teal-800"
                      >
                        #{lp}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
                    Effortless telepathic flow, shared rhythm, and mutual empowerment.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Growth Catalyst Match
                  </span>
                  <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 font-semibold">
                    Master Numbers (11, 22, 33) & Complementary Elements
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Sparks profound spiritual evolution, though requires honest emotional communication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'crystal' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40">
                <h4 className="font-serif font-bold text-teal-800 dark:text-teal-300 flex items-center space-x-2 text-base">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Gemstones, Sacred Metals & Colors</span>
                </h4>
                <p className="text-xs text-teal-900/80 dark:text-teal-200/80 mt-1">
                  Resonant physical catalysts to amplify your aura and attune your personal energy:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Sacred Gemstone</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5 block">
                    {detail.gemstone}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Power Colors</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5 block">
                    {colors.join(', ')}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Ruling Celestial Body</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5 block">
                    {detail.rulingPlanet}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Elemental Anchor</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 text-sm mt-0.5 block">
                    {detail.element}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'karmic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40">
                <h4 className="font-serif font-bold text-orange-800 dark:text-orange-300 flex items-center space-x-2 text-base">
                  <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Karmic Soul Contract & Higher Calling</span>
                </h4>
                <p className="text-xs text-orange-900/80 dark:text-orange-200/80 mt-1">
                  The overarching evolutionary lesson your soul contracted to master in this incarnation:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  The Core Sacred Assignment
                </h5>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  You incarnated to transform {detail.challenges[0]?.obstacle.toLowerCase() || 'uncertainty'} into {detail.strengths[0]?.toLowerCase() || 'divine clarity'}. Every obstacle you encounter is not a punishment, but a deliberate cosmic weight to strengthen your spiritual muscles.
                </p>
              </div>
            </div>
          )}

          {activeTopic === 'cycles' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
                <h4 className="font-serif font-bold text-purple-800 dark:text-purple-300 flex items-center space-x-2 text-base">
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Pinnacle Cycles & Life Eras</span>
                </h4>
                <p className="text-xs text-purple-900/80 dark:text-purple-200/80 mt-1">
                  In Pythagorean numerology, your life unfolds through 4 major 9-year Pinnacle Waves:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-purple-600 dark:text-purple-400 font-bold block">1st Pinnacle (Ages 0 - 27)</span>
                  <span className="text-stone-600 dark:text-stone-400 mt-1 block">Foundation, soul identity formation, and exploring boundary conditions.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-purple-600 dark:text-purple-400 font-bold block">2nd Pinnacle (Ages 28 - 36)</span>
                  <span className="text-stone-600 dark:text-stone-400 mt-1 block">Productivity, establishing sovereignty, and manifesting core life purpose.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-purple-600 dark:text-purple-400 font-bold block">3rd Pinnacle (Ages 37 - 45)</span>
                  <span className="text-stone-600 dark:text-stone-400 mt-1 block">Mastery, community impact, and harmonic integration of wealth and wisdom.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <span className="text-purple-600 dark:text-purple-400 font-bold block">4th Pinnacle (Ages 46+)</span>
                  <span className="text-stone-600 dark:text-stone-400 mt-1 block">Spiritual elderhood, wisdom mentorship, and legacy realization.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900/70 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 text-xs">
          <span className="text-stone-500 dark:text-stone-400">
            Browse all 6 codex topics to absorb Life Path #{lifePathNumber} mastery.
          </span>
          <button
            onClick={onClose}
            className="bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 px-5 py-2 rounded-xl font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
