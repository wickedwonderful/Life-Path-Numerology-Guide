import React, { useState } from 'react';
import { X, Sparkles, Calendar, CheckSquare, Target, Compass, MessageCircle, ArrowRight, ArrowLeft, Check, HelpCircle } from 'lucide-react';

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat') => void;
}

const STEPS = [
  {
    title: '1. Discover Your Cosmic Life Path',
    icon: Sparkles,
    color: '#C8826D',
    tab: 'reading' as const,
    subtitle: 'Unveil Your Core Archetype & Daily Vibrations',
    description: 'Your birth date holds a unique mathematical code (Life Path 1-9, 11, 22, 33). Cosmic Path calculates your exact Pythagorean reduction step-by-step and delivers customized daily readings tailored to your primary life focus and energy.',
    tips: [
      'View your step-by-step math breakdown preview',
      'Read your Daily Intuitive Focus & Action Advice',
      'Re-run your birth profile anytime from the top bar',
    ],
  },
  {
    title: '2. Align With Daily Horoscopes',
    icon: Calendar,
    color: '#7D8E7A',
    tab: 'horoscope' as const,
    subtitle: 'Planetary Transits & Lucky Factors',
    description: 'Check your daily astrological forecast tailored to your Life Path. Get instant insights into your daily Lucky Number, Harmonic Element, Focus Zodiac Sign, and ideal time windows for action.',
    tips: [
      'Discover daily power hours for career and love',
      'Align your decisions with active planetary transits',
      'Use harmonic color guides for daily wardrobe or meditation focus',
    ],
  },
  {
    title: '3. Build High-Vibration Daily Rituals',
    icon: CheckSquare,
    color: '#7D8E7A',
    tab: 'habits' as const,
    subtitle: 'Personalized Habits & Streak Tracking',
    description: 'Turn cosmic alignment into real-world momentum. Track habits pre-tailored to strengthen your Life Path superpower—from morning breathwork to evening gratitude logs—or import 1-click recommended routines.',
    tips: [
      'Log daily completions to raise your Vibrational Alignment %',
      'Use 1-click recommended ritual presets if you are short on time',
      'Build streaks to unlock deeper consistency and focus',
    ],
  },
  {
    title: '4. Manifest With Vision Board & AI Generator',
    icon: Target,
    color: '#C8826D',
    tab: 'goals' as const,
    subtitle: 'AI Visualizations, Inspiration Presets & Milestones',
    description: 'Bring your dreams into focus. Use curated manifestation templates, prompt style dropdowns, and our Gemini AI Art Generator to build high-definition visual targets for career, love, health, and wealth.',
    tips: [
      'Choose from visual styles (Watercolor, Sacred Geometry, Starlight)',
      'Click inspiration tags if you need help expressing yourself',
      'Generate 1-click AI action steps & 2-minute visualization meditations',
    ],
  },
  {
    title: '5. Consult the Oracle Guide & Library',
    icon: MessageCircle,
    color: '#4A4741',
    tab: 'chat' as const,
    subtitle: 'Interactive Companion & Compatibility Matcher',
    description: 'Have a burning question about love, career, or spiritual timing? Chat directly with your Intuitive AI Guide, or visit the Library to calculate Pythagorean name vibrations and check cosmic compatibility with loved ones.',
    tips: [
      'Ask the Oracle Guide for personalized relationship & decision advice',
      'Test name vibrations (Expression, Soul Urge, Personality)',
      'Compare birth dates in the Compatibility Matcher for harmony scores',
    ],
  },
];

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleJumpToTab = () => {
    onNavigateTab(currentStep.tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[32px] shadow-2xl text-[#3D3A35] dark:text-[#F8F5F2] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#F8F5F2] dark:bg-[#252320] px-8 py-5 border-b border-[#F0EBE5] dark:border-[#3D3A35] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#7D8E7A] flex items-center justify-center text-white shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2]">
                Interactive Platform Guide
              </h2>
              <p className="text-[11px] text-[#8C867C] font-semibold uppercase tracking-wider">
                Step {currentStepIndex + 1} of {STEPS.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C867C] hover:text-[#3D3A35] dark:hover:text-white p-2 rounded-xl hover:bg-[#E0D4C3]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full bg-[#E0D4C3]/30 dark:bg-[#3D3A35] h-1.5 flex">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-full transition-all duration-300 ${
                idx <= currentStepIndex ? 'bg-[#C8826D]' : 'bg-transparent'
              }`}
              style={{ width: `${100 / STEPS.length}%` }}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          <div className="flex items-start space-x-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: currentStep.color }}
            >
              <StepIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8826D]">
                {currentStep.subtitle}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] mt-1">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#6B665E] dark:text-[#A39E93] leading-relaxed">
            {currentStep.description}
          </p>

          {/* Key Feature Tips */}
          <div className="bg-[#F8F5F2] dark:bg-[#252320] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-2xl p-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D8E7A]">
              Key Highlights:
            </span>
            <ul className="space-y-2 text-xs text-[#3D3A35] dark:text-[#F8F5F2]">
              {currentStep.tips.map((tip, index) => (
                <li key={index} className="flex items-center space-x-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#7D8E7A]/20 text-[#7D8E7A] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action to Jump Directly */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleJumpToTab}
              className="text-xs font-bold text-[#C8826D] hover:underline flex items-center space-x-1"
            >
              <span>Explore this section now →</span>
            </button>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-3">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-2xl border border-[#E0D4C3] dark:border-[#3D3A35] text-xs font-bold text-[#4A4741] dark:text-[#F8F5F2] hover:bg-[#E0D4C3]/30 transition-all flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-2xl bg-[#C8826D] hover:bg-[#b5735e] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#C8826D]/20 transition-all flex items-center space-x-1.5"
              >
                <span>{currentStepIndex === STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
