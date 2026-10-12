import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Compass,
  Award,
  Flame,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  Star,
} from 'lucide-react';
import { LifePathNumber } from '../types';
import { LIFE_PATH_DETAILS } from '../utils/numerology';

interface CosmicQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLifePath: LifePathNumber;
  onClaimReward: (points: number, reason: string) => void;
}

interface QuizQuestion {
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
  hint: string;
}

const COSMIC_QUIZ_BANK: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: 'What is the primary core frequency of Life Path #1?',
      options: [
        { text: 'The Pioneer & Independent Trailblazer', correct: true, explanation: 'Life Path 1 is ruled by the Sun and represents initiation, original vision, and fearless leadership.' },
        { text: 'The Diplomat & Peacemaker', correct: false, explanation: 'Peacemaking and harmony is the signature of Life Path 2.' },
        { text: 'The Free-Spirited Nomad', correct: false, explanation: 'Nomadic freedom and adventure belongs to Life Path 5.' },
      ],
      hint: 'Think of the number that stands alone at the inception of all creation.',
    },
    {
      question: 'Which element and celestial ruler corresponds to Life Path #1?',
      options: [
        { text: 'Fire & The Sun ☀️', correct: true, explanation: 'The Sun provides vitalizing solar energy and visionary confidence.' },
        { text: 'Water & The Moon 🌙', correct: false, explanation: 'The Moon rules Life Path 2.' },
        { text: 'Earth & Saturn 🪐', correct: false, explanation: 'Saturn rules Life Path 8 and 4.' },
      ],
      hint: 'The brightest star in our solar system.',
    },
  ],
  2: [
    {
      question: 'What is the supreme strength of Life Path #2?',
      options: [
        { text: 'Intuitive Empathy & Harmonious Diplomacy', correct: true, explanation: 'Life Path 2 excels in mediation, deep emotional intelligence, and graceful collaboration.' },
        { text: 'Aggressive Competition', correct: false, explanation: 'Life Path 2 prefers peaceful unity over rivalry.' },
        { text: 'Solitary Hermetic Study', correct: false, explanation: 'Solitary study is characteristic of Life Path 7.' },
      ],
      hint: 'The power of bringing pairs into unity.',
    },
  ],
  3: [
    {
      question: 'Which creative gift defines Life Path #3?',
      options: [
        { text: 'Charismatic Expression, Artistry & Joyous Storytelling', correct: true, explanation: 'Life Path 3 is ruled by Jupiter and radiates optimism, wit, and expressive art.' },
        { text: 'Strict Systematic Bookkeeping', correct: false, explanation: 'Systematic structure belongs to Life Path 4.' },
        { text: 'Hermit Solitude', correct: false, explanation: 'Solitude is the domain of Life Path 7.' },
      ],
      hint: 'Think of the triangle, synthesis, and creative spark.',
    },
  ],
};

export const CosmicQuizModal: React.FC<CosmicQuizModalProps> = ({
  isOpen,
  onClose,
  userLifePath,
  onClaimReward,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  const detail = LIFE_PATH_DETAILS[userLifePath] || LIFE_PATH_DETAILS[1];

  const defaultQuestions: QuizQuestion[] = [
    {
      question: `What is the archetype of Life Path #${userLifePath}?`,
      options: [
        {
          text: `${detail.archetype}`,
          correct: true,
          explanation: `Life Path #${userLifePath} embodies the sacred vibration of ${detail.vibration}.`,
        },
        {
          text: 'The Rigid Cynic',
          correct: false,
          explanation: 'Numerology represents constructive and transcendent archetypal frequencies.',
        },
        {
          text: 'The Chaotic Drifter',
          correct: false,
          explanation: 'Every Life Path has an intentional, divine blueprint for soul evolution.',
        },
      ],
      hint: 'Check your core Life Path hero badge at the top of the reading page.',
    },
    {
      question: `Which gemstone amplifies Life Path #${userLifePath}'s vibration?`,
      options: [
        {
          text: `${detail.gemstone}`,
          correct: true,
          explanation: `This gemstone resonates with the elemental frequency of ${detail.element}.`,
        },
        {
          text: 'Synthetic Plastic Beads',
          correct: false,
          explanation: 'Only natural resonant mineral crystals provide grounding piezoelectric alignment.',
        },
      ],
      hint: 'Look into the gemstones deep dive in your codex.',
    },
  ];

  const questions = COSMIC_QUIZ_BANK[userLifePath] || defaultQuestions;
  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    const isCorrect = currentQ.options[idx].correct;
    if (isCorrect) {
      setScore((s) => s + 1);
      onClaimReward(15, `Correct Cosmic Quiz Answer (+15 PTS) ✨`);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((c) => c + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setQuizFinished(true);
      onClaimReward(30, `Completed Cosmic Life Path Mastery Quiz! 🏆`);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setShowHint(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1A18] border border-stone-200 dark:border-stone-800 rounded-[28px] sm:rounded-[36px] shadow-2xl text-stone-900 dark:text-stone-100 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-transparent px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Cosmic Knowledge Challenge
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Life Path #{userLifePath} Trivia & Insight
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!quizFinished ? (
            <div className="space-y-4">
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-bold">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                  Score: {score} Correct
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-snug">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, i) => {
                  let optStyle =
                    'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 text-stone-800 dark:text-stone-200';

                  if (isAnswered) {
                    if (opt.correct) {
                      optStyle =
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (selectedOpt === i) {
                      optStyle =
                        'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-200';
                    } else {
                      optStyle = 'opacity-50 border-stone-200 dark:border-stone-800';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswered && opt.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation feedback */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1 animate-fade-in">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block">
                    {currentQ.options[selectedOpt || 0]?.correct ? '✨ Correct Insight!' : '🌙 Cosmic Clarification:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300">
                    {currentQ.options[selectedOpt || 0]?.explanation}
                  </p>
                </div>
              )}

              {/* Hint toggle */}
              {!isAnswered && (
                <div className="pt-1">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-stone-500 hover:text-amber-600 flex items-center space-x-1 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
                  </button>
                  {showHint && (
                    <p className="text-xs italic text-stone-500 dark:text-stone-400 mt-1 pl-4 border-l-2 border-amber-400">
                      {currentQ.hint}
                    </p>
                  )}
                </div>
              )}

              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md mt-2"
                >
                  {currentIdx + 1 < questions.length ? 'Next Question →' : 'View Results & Claim Bonus 🏆'}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Cosmic Quiz Completed!
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  You scored {score} out of {questions.length} on Life Path #{userLifePath} mastery.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300">
                +30 Karma Mastery Bonus Awarded! 🌟
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={onClose}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  Back to Sanctuary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
