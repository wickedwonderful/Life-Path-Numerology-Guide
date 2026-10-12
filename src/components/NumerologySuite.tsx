import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Heart,
  Search,
  BookOpen,
  User,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Crown,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  RefreshCw,
  Volume2,
  VolumeX,
  Plus,
  Check,
  FileText,
} from 'lucide-react';
import {
  calculateNameNumerology,
  getNameDetailedBreakdown,
  calculateLifePath,
  LIFE_PATH_DETAILS,
  getCompatibilityInsights,
} from '../utils/numerology';
import { LifePathNumber } from '../types';
import { NUMBER_INSIGHTS, NumberMeaningData } from '../data/numberMeanings';
import { speakSoothingly, stopSoothingAudio } from '../utils/speech';
import { toggleReportBlock, isBlockInReport } from '../utils/reportStore';

const PYTHAGOREAN_CHART: Array<{ number: number; letters: string[] }> = [
  { number: 1, letters: ['A', 'J', 'S'] },
  { number: 2, letters: ['B', 'K', 'T'] },
  { number: 3, letters: ['C', 'L', 'U'] },
  { number: 4, letters: ['D', 'M', 'V'] },
  { number: 5, letters: ['E', 'N', 'W'] },
  { number: 6, letters: ['F', 'O', 'X'] },
  { number: 7, letters: ['G', 'P', 'Y'] },
  { number: 8, letters: ['H', 'Q', 'Z'] },
  { number: 9, letters: ['I', 'R'] },
];

interface NumerologySuiteProps {
  onClaimReward?: (points: number, reason: string) => void;
  initialNumber?: LifePathNumber;
  initialTab?: 'directory' | 'name' | 'compatibility';
  onOpenReportModal?: () => void;
}

export const NumerologySuite: React.FC<NumerologySuiteProps> = ({
  onClaimReward,
  initialNumber,
  initialTab,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'name' | 'compatibility'>(initialTab || 'directory');

  // Directory / Library State
  const [selectedDirectoryNum, setSelectedDirectoryNum] = useState<LifePathNumber>(initialNumber || 1);
  const [libraryCategory, setLibraryCategory] = useState<'all' | 'single' | 'master'>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [libraryViewMode, setLibraryViewMode] = useState<'overview' | 'expression' | 'soulUrge' | 'personality' | 'shadow' | 'correspondences'>('overview');
  const [isPlayingNumberVoice, setIsPlayingNumberVoice] = useState(false);
  const [inReportStatus, setInReportStatus] = useState(false);

  useEffect(() => {
    if (initialNumber) {
      setSelectedDirectoryNum(initialNumber);
      setActiveTab('directory');
    }
  }, [initialNumber]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    setInReportStatus(isBlockInReport('library_archetype', `Number ${selectedDirectoryNum}: ${NUMBER_INSIGHTS[selectedDirectoryNum]?.title}`));
  }, [selectedDirectoryNum]);

  // Name Calculator State
  const [inputName, setInputName] = useState('Seraphina Vance');
  const [nameDetailTab, setNameDetailTab] = useState<'expression' | 'soulUrge' | 'personality'>('expression');
  const [lookupNumber, setLookupNumber] = useState<LifePathNumber>(1);
  const [showChartExplainer, setShowChartExplainer] = useState(false);

  // Compatibility State
  const [date1, setDate1] = useState('08/15/1995');
  const [date2, setDate2] = useState('04/22/1993');
  const [compatResult, setCompatResult] = useState<any>(() => {
    const trace1 = calculateLifePath('08/15/1995');
    const trace2 = calculateLifePath('04/22/1993');
    const sumLp = trace1.finalLifePath + trace2.finalLifePath;
    const combinedVibration =
      sumLp > 9 && sumLp !== 11 && sumLp !== 22 && sumLp !== 33 ? sumLp % 9 || 9 : sumLp;
    const detail1 = LIFE_PATH_DETAILS[trace1.finalLifePath] || LIFE_PATH_DETAILS[1];
    const detail2 = LIFE_PATH_DETAILS[trace2.finalLifePath] || LIFE_PATH_DETAILS[1];
    
    const insights = getCompatibilityInsights(trace1.finalLifePath, trace2.finalLifePath);
    
    return {
      person1Lp: trace1.finalLifePath,
      person2Lp: trace2.finalLifePath,
      detail1,
      detail2,
      combinedVibration,
      insights
    };
  });

  const nameDetails = getNameDetailedBreakdown(inputName);
  const selectedMeaning = NUMBER_INSIGHTS[selectedDirectoryNum] || NUMBER_INSIGHTS[1];
  const lookupMeaning = NUMBER_INSIGHTS[lookupNumber] || NUMBER_INSIGHTS[1];

  const allNumbers: LifePathNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

  const filteredNumbers = allNumbers.filter((num) => {
    const isMaster = num === 11 || num === 22 || num === 33;
    if (libraryCategory === 'single' && isMaster) return false;
    if (libraryCategory === 'master' && !isMaster) return false;

    if (librarySearchQuery.trim()) {
      const q = librarySearchQuery.toLowerCase();
      const meta = NUMBER_INSIGHTS[num];
      if (!meta) return false;
      return (
        meta.title.toLowerCase().includes(q) ||
        meta.archetype.toLowerCase().includes(q) ||
        meta.keywords.some((k) => k.toLowerCase().includes(q)) ||
        meta.generalMeaning.toLowerCase().includes(q) ||
        String(num).includes(q)
      );
    }
    return true;
  });

  const handleCalculateCompatibility = (e: React.FormEvent) => {
    e.preventDefault();
    const trace1 = calculateLifePath(date1);
    const trace2 = calculateLifePath(date2);

    const sumLp = trace1.finalLifePath + trace2.finalLifePath;
    const combinedVibration =
      sumLp > 9 && sumLp !== 11 && sumLp !== 22 && sumLp !== 33 ? sumLp % 9 || 9 : sumLp;

    const detail1 = LIFE_PATH_DETAILS[trace1.finalLifePath] || LIFE_PATH_DETAILS[1];
    const detail2 = LIFE_PATH_DETAILS[trace2.finalLifePath] || LIFE_PATH_DETAILS[1];

    const insights = getCompatibilityInsights(trace1.finalLifePath, trace2.finalLifePath);

    setCompatResult({
      person1Lp: trace1.finalLifePath,
      person2Lp: trace2.finalLifePath,
      detail1,
      detail2,
      combinedVibration,
      insights
    });

    if (onClaimReward) {
      onClaimReward(15, `Calculated Synastry Compatibility (LP #${trace1.finalLifePath} + #${trace2.finalLifePath})`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-8 pb-16">
      {/* Header Banner with Refined Modern Contrast */}
      <div className="relative bg-white dark:bg-[#1E1C1A] border border-stone-200 dark:border-stone-800 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3.5 py-1.5 rounded-full border border-amber-200/80 dark:border-amber-800/60">
                Wisdom Sanctuary & Science
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-3.5 py-1.5 rounded-full border border-teal-200/80 dark:border-teal-800/60">
                Pythagorean & Master Numbers
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
              Cosmic Numerology Library & Name Insights
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              Explore the profound multidimensional meaning of every number (1–9, 11, 22, 33), uncover your full Name Destiny breakdown, and analyze cosmic relationship dynamics.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex sm:flex-col items-center justify-center gap-3 bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-4 sm:p-5 rounded-2xl shrink-0">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 dark:text-amber-400 block">
                12
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Cosmic Archetypes
              </span>
            </div>
            <div className="h-8 w-px sm:w-full sm:h-px bg-stone-200 dark:bg-stone-800" />
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-teal-600 dark:text-teal-400 block">
                3
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Name Pillars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Suite Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl">
        <button
          id="suite-tab-directory"
          onClick={() => setActiveTab('directory')}
          className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'directory'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-stone-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="truncate">Number Library</span>
        </button>

        <button
          id="suite-tab-name"
          onClick={() => setActiveTab('name')}
          className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'name'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-stone-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="truncate">Name Numerology</span>
        </button>

        <button
          id="suite-tab-compatibility"
          onClick={() => setActiveTab('compatibility')}
          className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'compatibility'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-stone-800/50'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="truncate">Compatibility Matcher</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. NUMBER LIBRARY & ENCYCLOPEDIA TAB */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-8">
          {/* Controls Bar: Search & Category Filters */}
          <div className="bg-white dark:bg-[#1E1C1A] border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={librarySearchQuery}
                  onChange={(e) => setLibrarySearchQuery(e.target.value)}
                  placeholder="Search traits, careers, crystals..."
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />
                {librarySearchQuery && (
                  <button
                    onClick={() => setLibrarySearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setLibraryCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    libraryCategory === 'all'
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  All (1–9, 11, 22, 33)
                </button>
                <button
                  onClick={() => setLibraryCategory('single')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    libraryCategory === 'single'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  Single Digits (1–9)
                </button>
                <button
                  onClick={() => setLibraryCategory('master')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    libraryCategory === 'master'
                      ? 'bg-teal-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  ✨ Master Numbers (11, 22, 33)
                </button>
              </div>
            </div>

            {/* Quick Number Selector Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
              {filteredNumbers.map((num) => {
                const isSelected = selectedDirectoryNum === num;
                const isMaster = num === 11 || num === 22 || num === 33;
                return (
                  <button
                    key={num}
                    onClick={() => setSelectedDirectoryNum(num)}
                    className={`shrink-0 flex flex-col items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-2xl transition-all border ${
                      isSelected
                        ? isMaster
                          ? 'bg-teal-600 border-teal-500 text-white shadow-md scale-105'
                          : 'bg-amber-600 border-amber-500 text-white shadow-md scale-105'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 dark:hover:border-amber-500'
                    }`}
                  >
                    <span className="font-serif font-bold text-lg sm:text-xl leading-none">{num}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
                      {isMaster ? 'Master' : 'Path'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Number In-Depth Card */}
          <div className="bg-white dark:bg-[#1E1C1A] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            {/* Top Archetype Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 dark:border-stone-800 pb-8">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center font-serif font-bold text-3xl sm:text-4xl text-white shadow-md shrink-0 ${
                    selectedDirectoryNum === 11 || selectedDirectoryNum === 22 || selectedDirectoryNum === 33
                      ? 'bg-gradient-to-br from-teal-500 to-emerald-600'
                      : 'bg-gradient-to-br from-amber-500 to-orange-600'
                  }`}
                >
                  {selectedDirectoryNum}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
                      {selectedMeaning.element}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Ruler: {selectedMeaning.rulingBody}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    {selectedMeaning.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {selectedMeaning.archetype}
                  </p>
                </div>
              </div>

              {/* Keywords Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedMeaning.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                  >
                    ✦ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Number Action Bar: Listen & Add to Report */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  id={`listen-num-${selectedDirectoryNum}`}
                  onClick={() => {
                    if (isPlayingNumberVoice) {
                      stopSoothingAudio();
                      setIsPlayingNumberVoice(false);
                      return;
                    }
                    const text = `Number ${selectedMeaning.number}, ${selectedMeaning.title}, known as ${selectedMeaning.archetype}. Ruling body: ${selectedMeaning.rulingBody}, Element: ${selectedMeaning.element}. ${selectedMeaning.generalMeaning}. Keywords: ${selectedMeaning.keywords.join(', ')}.`;
                    speakSoothingly({
                      text,
                      onStart: () => setIsPlayingNumberVoice(true),
                      onEnd: () => setIsPlayingNumberVoice(false),
                      onError: () => setIsPlayingNumberVoice(false),
                    });
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isPlayingNumberVoice
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 animate-pulse'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {isPlayingNumberVoice ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Listen to #{selectedMeaning.number} Wisdom</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id={`add-report-num-${selectedDirectoryNum}`}
                  onClick={() => {
                    const added = toggleReportBlock({
                      source: 'library_archetype',
                      title: `Number ${selectedMeaning.number}: ${selectedMeaning.title}`,
                      category: 'Encyclopedia & Archetype',
                      summaryText: `${selectedMeaning.archetype} • Element: ${selectedMeaning.element} • Ruler: ${selectedMeaning.rulingBody}`,
                      fullContent: `### Number ${selectedMeaning.number}: ${selectedMeaning.title} (${selectedMeaning.archetype})\n\n` +
                        `* **Element**: ${selectedMeaning.element} | **Ruling Body**: ${selectedMeaning.rulingBody}\n` +
                        `* **Keywords**: ${selectedMeaning.keywords.join(', ')}\n\n` +
                        `#### Core Essence\n${selectedMeaning.generalMeaning}\n\n` +
                        `#### As Expression & Destiny\n${selectedMeaning.expressionMeaning.summary}\n\n` +
                        `#### Shadow Growth Lessons\n${selectedMeaning.shadowAndGrowth.growthLesson}`,
                    });
                    setInReportStatus(added);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    inReportStatus
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                  }`}
                >
                  {inReportStatus ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>In Curated Report</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Custom Report</span>
                    </>
                  )}
                </button>

                {onOpenReportModal && (
                  <button
                    onClick={onOpenReportModal}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                    title="Open Custom Report Dossier"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Report</span>
                  </button>
                )}
              </div>
            </div>

            {/* In-Depth Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 text-xs font-bold scrollbar-none">
              <button
                onClick={() => setLibraryViewMode('overview')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  libraryViewMode === 'overview'
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                🔮 Core Vibration & Meaning
              </button>

              <button
                onClick={() => setLibraryViewMode('expression')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  libraryViewMode === 'expression'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                🌟 As Expression / Destiny
              </button>

              <button
                onClick={() => setLibraryViewMode('soulUrge')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  libraryViewMode === 'soulUrge'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                ❤️ As Soul Urge / Heart's Desire
              </button>

              <button
                onClick={() => setLibraryViewMode('personality')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  libraryViewMode === 'personality'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                🎭 As Personality Number
              </button>

              <button
                onClick={() => setLibraryViewMode('shadow')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  libraryViewMode === 'shadow'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                ⚖️ Shadow & Cosmic Remedy
              </button>

              <button
                onClick={() => setLibraryViewMode('correspondences')}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  libraryViewMode === 'correspondences'
                    ? 'bg-stone-800 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                🌌 Crystals, Colors & Matches
              </button>
            </div>

            {/* View Sub-Tab Content */}
            <div className="min-h-[260px]">
              {/* 1. Core Overview */}
              {libraryViewMode === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-stone-50 dark:bg-stone-900/60 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                      Universal Energetic Essence
                    </h4>
                    <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                      "{selectedMeaning.generalMeaning}"
                    </p>
                  </div>

                  {/* Daily Power Affirmation */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-transparent p-6 rounded-2xl border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300 block">
                      ✦ Daily Sovereign Power Affirmation
                    </span>
                    <p className="text-sm sm:text-base font-serif italic text-stone-900 dark:text-stone-100">
                      "{selectedMeaning.powerAffirmation}"
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Expression / Destiny */}
              {libraryViewMode === 'expression' && (
                <div className="space-y-6">
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      Outward Mission & Life Potential
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                      {selectedMeaning.expressionMeaning.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {selectedMeaning.expressionMeaning.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        Natural Superpower Talents:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                        {selectedMeaning.expressionMeaning.talents.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">✓</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                        Ideal Career Callings:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMeaning.expressionMeaning.careerPaths.map((cp, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded-lg"
                          >
                            💼 {cp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
                    <strong className="text-stone-900 dark:text-stone-200 font-bold">Optimal Work Style: </strong>
                    {selectedMeaning.expressionMeaning.workStyle}
                  </div>
                </div>
              )}

              {/* 3. Soul Urge / Heart's Desire */}
              {libraryViewMode === 'soulUrge' && (
                <div className="space-y-6">
                  <div className="bg-teal-50/50 dark:bg-teal-950/20 p-6 rounded-2xl border border-teal-200 dark:border-teal-900/40 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                      Hidden Motives & Soul Cravings
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                      {selectedMeaning.soulUrgeMeaning.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {selectedMeaning.soulUrgeMeaning.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                        What Your Heart Truly Needs in Love:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                        {selectedMeaning.soulUrgeMeaning.relationshipNeeds.map((rn, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-teal-500 font-bold">❤️</span>
                            <span>{rn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                        Core Inner Vulnerability / Fear:
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
                        "{selectedMeaning.soulUrgeMeaning.secretFear}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Personality Number */}
              {libraryViewMode === 'personality' && (
                <div className="space-y-6">
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                      Outer Mask & Social Aura
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                      {selectedMeaning.personalityMeaning.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {selectedMeaning.personalityMeaning.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                        First Impression You Radiate:
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {selectedMeaning.personalityMeaning.firstImpression}
                      </p>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                        Personal Style & Aesthetic Vibe:
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {selectedMeaning.personalityMeaning.styleAndVibe}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Shadow & Growth */}
              {libraryViewMode === 'shadow' && (
                <div className="space-y-6">
                  <div className="bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                      Shadow Tendency & Blind Spot
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                      {selectedMeaning.shadowAndGrowth.shadowAspect}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        Soul Growth Lesson:
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {selectedMeaning.shadowAndGrowth.growthLesson}
                      </p>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        Cosmic Healing Remedy:
                      </span>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {selectedMeaning.shadowAndGrowth.cosmicRemedy}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Correspondences & Matches */}
              {libraryViewMode === 'correspondences' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      🔮 Sacred Crystals
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMeaning.crystals.map((c, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 font-medium"
                        >
                          💎 {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                      🎨 Harmonic Colors
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMeaning.colors.map((c, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 font-medium"
                        >
                          ✦ {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                      💖 Harmonious Match Numbers
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMeaning.bestMatches.map((bm, i) => (
                        <span
                          key={i}
                          className="text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-lg border border-rose-200 dark:border-rose-800"
                        >
                          #{bm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NAME NUMEROLOGY & DETAILED RESULTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'name' && (
        <div className="space-y-8">
          {/* Input & Live Calculation Header */}
          <div className="bg-white dark:bg-[#1E1C1A] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                  Pythagorean Letter Science ✍️
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-2">
                  Name Vibration Calculator & Meaning Explorer
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                  Type any birth name or chosen moniker to calculate your Expression (Destiny), Soul Urge, and Personality vibrations with letter-by-letter clarity.
                </p>
              </div>

              <button
                onClick={() => setShowChartExplainer(!showChartExplainer)}
                className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 px-3.5 py-2 rounded-xl transition-all"
              >
                <Info className="w-4 h-4" />
                <span>{showChartExplainer ? 'Hide Pythagorean Chart' : 'Show Pythagorean Chart (1–9)'}</span>
              </button>
            </div>

            {/* Optional Pythagorean Reference Chart */}
            {showChartExplainer && (
              <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Pythagorean Letter-to-Number Value Matrix
                  </span>
                  <span className="text-[10px] text-stone-500">Ancient Greek Esoteric Matrix</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 text-center text-xs">
                  {PYTHAGOREAN_CHART.map((col) => (
                    <div
                      key={col.number}
                      className="bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1"
                    >
                      <div className="font-serif font-bold text-base text-amber-600 dark:text-amber-400">
                        {col.number}
                      </div>
                      <div className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        {col.letters.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Name Input Bar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Enter Full Birth Name or Current Legal Name:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="e.g. Seraphina Vance or Johnathan Doe"
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm sm:text-base font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Letter-by-Letter Visual Breakdown */}
            {nameDetails.words.length > 0 && (
              <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Letter-by-Letter Numerology Breakdown
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      Vowel (Soul Urge)
                    </span>
                    <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      Consonant (Personality)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-1">
                  {nameDetails.words.map((w, wIdx) => (
                    <div
                      key={wIdx}
                      className="flex items-center gap-1 bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs"
                    >
                      {w.letters.map((l, lIdx) => (
                        <div
                          key={lIdx}
                          className={`flex flex-col items-center justify-center w-8 h-10 rounded-lg text-xs font-bold ${
                            l.isVowel
                              ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                              : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          }`}
                        >
                          <span>{l.char}</span>
                          <span className="text-[10px] opacity-75">{l.value}</span>
                        </div>
                      ))}
                      <div className="text-[10px] font-mono font-bold text-stone-400 px-1">
                        = {w.wordSum}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3 Core Result Cards with In-Depth Clickable Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* 1. Expression */}
              <div
                onClick={() => setNameDetailTab('expression')}
                className={`p-6 rounded-3xl border transition-all cursor-pointer text-center space-y-3 ${
                  nameDetailTab === 'expression'
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-md ring-2 ring-amber-400/20'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5 text-[10px] uppercase font-bold tracking-[0.2em] text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Expression (Destiny)</span>
                </div>
                <div className="text-4xl sm:text-5xl font-serif font-bold text-amber-600 dark:text-amber-400">
                  #{nameDetails.expression}
                </div>
                <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {NUMBER_INSIGHTS[nameDetails.expression]?.expressionMeaning.title || `Expression #${nameDetails.expression}`}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                  {nameDetails.expressionTrace}
                </p>
                <span className="inline-block text-[11px] font-bold text-amber-700 dark:text-amber-400 underline decoration-amber-300">
                  View Full Destiny Insight →
                </span>
              </div>

              {/* 2. Soul Urge */}
              <div
                onClick={() => setNameDetailTab('soulUrge')}
                className={`p-6 rounded-3xl border transition-all cursor-pointer text-center space-y-3 ${
                  nameDetailTab === 'soulUrge'
                    ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-400 dark:border-teal-600 shadow-md ring-2 ring-teal-400/20'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5 text-[10px] uppercase font-bold tracking-[0.2em] text-teal-700 dark:text-teal-400">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Soul Urge (Vowels)</span>
                </div>
                <div className="text-4xl sm:text-5xl font-serif font-bold text-teal-600 dark:text-teal-400">
                  #{nameDetails.soulUrge}
                </div>
                <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {NUMBER_INSIGHTS[nameDetails.soulUrge]?.soulUrgeMeaning.title || `Soul Urge #${nameDetails.soulUrge}`}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                  {nameDetails.soulUrgeTrace}
                </p>
                <span className="inline-block text-[11px] font-bold text-teal-700 dark:text-teal-400 underline decoration-teal-300">
                  View Heart's Desire Insight →
                </span>
              </div>

              {/* 3. Personality */}
              <div
                onClick={() => setNameDetailTab('personality')}
                className={`p-6 rounded-3xl border transition-all cursor-pointer text-center space-y-3 ${
                  nameDetailTab === 'personality'
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-400/20'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-1.5 text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-700 dark:text-indigo-400">
                  <User className="w-3.5 h-3.5" />
                  <span>Personality (Consonants)</span>
                </div>
                <div className="text-4xl sm:text-5xl font-serif font-bold text-indigo-600 dark:text-indigo-400">
                  #{nameDetails.personality}
                </div>
                <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {NUMBER_INSIGHTS[nameDetails.personality]?.personalityMeaning.title || `Personality #${nameDetails.personality}`}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                  {nameDetails.personalityTrace}
                </p>
                <span className="inline-block text-[11px] font-bold text-indigo-700 dark:text-indigo-400 underline decoration-indigo-300">
                  View Outer Persona Insight →
                </span>
              </div>
            </div>
          </div>

          {/* Deep Insight Card for Active Name Pillar */}
          <div className="bg-white dark:bg-[#1E1C1A] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            {nameDetailTab === 'expression' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                      Deep Dive: Expression (Destiny) Number #{nameDetails.expression}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                      {NUMBER_INSIGHTS[nameDetails.expression]?.expressionMeaning.title}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0">
                    {nameDetails.expression}
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                    {NUMBER_INSIGHTS[nameDetails.expression]?.expressionMeaning.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      🌟 Natural Capabilities & Superpowers:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                      {NUMBER_INSIGHTS[nameDetails.expression]?.expressionMeaning.talents.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">✓</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                      💼 Top Career Callings & Alignment:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {NUMBER_INSIGHTS[nameDetails.expression]?.expressionMeaning.careerPaths.map((cp, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded-lg"
                        >
                          ✦ {cp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {nameDetailTab === 'soulUrge' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
                      Deep Dive: Soul Urge (Heart's Desire) Number #{nameDetails.soulUrge}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                      {NUMBER_INSIGHTS[nameDetails.soulUrge]?.soulUrgeMeaning.title}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0">
                    {nameDetails.soulUrge}
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                    {NUMBER_INSIGHTS[nameDetails.soulUrge]?.soulUrgeMeaning.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                      ❤️ Deepest Heart Craving & Purpose:
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      {NUMBER_INSIGHTS[nameDetails.soulUrge]?.soulUrgeMeaning.heartDesire}
                    </p>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                      🛡️ Sacred Relationship Needs:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                      {NUMBER_INSIGHTS[nameDetails.soulUrge]?.soulUrgeMeaning.relationshipNeeds.map((rn, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-500">✦</span>
                          <span>{rn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {nameDetailTab === 'personality' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-400">
                      Deep Dive: Personality Number #{nameDetails.personality}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                      {NUMBER_INSIGHTS[nameDetails.personality]?.personalityMeaning.title}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-serif font-bold text-2xl flex items-center justify-center shrink-0">
                    {nameDetails.personality}
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                    {NUMBER_INSIGHTS[nameDetails.personality]?.personalityMeaning.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      🎭 First Impression People Receive:
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      {NUMBER_INSIGHTS[nameDetails.personality]?.personalityMeaning.firstImpression}
                    </p>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      ✨ Style & Outer Aura Signature:
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      {NUMBER_INSIGHTS[nameDetails.personality]?.personalityMeaning.styleAndVibe}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. COMPATIBILITY MATCHER TAB */}
      {/* ========================================================================= */}
      {activeTab === 'compatibility' && (
        <div className="bg-white dark:bg-[#1E1C1A] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
              Cosmic Relationship Synastry
            </span>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-2xl mt-2">
              Life Path Compatibility & Dynamic Harmonizer
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Enter two birth dates to calculate life path frequencies, affinity percentage, communication synergy, and harmonic growth potential.
            </p>
          </div>

          <form onSubmit={handleCalculateCompatibility} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold uppercase text-stone-700 dark:text-stone-300">
                Person 1 Birth Date
              </label>
              <input
                type="text"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold uppercase text-stone-700 dark:text-stone-300">
                Person 2 Birth Date
              </label>
              <input
                type="text"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Analyze Cosmic Compatibility Matrix 💖
              </button>
            </div>
          </form>

          {compatResult && (
            <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-teal-700 dark:text-teal-400 tracking-wider block mb-1">
                    Combined Energetic Harmony Index
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-rose-600 dark:text-rose-400">
                    {compatResult.insights.affinityScore}% Resonance
                  </span>
                </div>
                <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider block mb-1">Cosmic Dynamic</span>
                    <strong className="text-sm text-stone-900 dark:text-stone-100">{compatResult.insights.dynamic}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-widest">Partner 1</span>
                  <span className="text-amber-700 dark:text-amber-300 font-bold text-base block">
                    Life Path #{compatResult.person1Lp} • {compatResult.detail1.title}
                  </span>
                  <span className="text-stone-500 text-xs block">{compatResult.detail1.vibration}</span>
                </div>

                <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-widest">Partner 2</span>
                  <span className="text-teal-700 dark:text-teal-300 font-bold text-base block">
                    Life Path #{compatResult.person2Lp} • {compatResult.detail2.title}
                  </span>
                  <span className="text-stone-500 text-xs block">{compatResult.detail2.vibration}</span>
                </div>
              </div>

              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed italic bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 font-serif">
                "{compatResult.insights.summary}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400 border-b border-stone-200 dark:border-stone-700 pb-2">
                    🌟 Synergy & Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                    {compatResult.insights.strengths.map((strength: string, i: number) => (
                      <li key={i} className="flex gap-2"><span className="text-teal-500 shrink-0">✓</span> <span>{strength}</span></li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400 border-b border-stone-200 dark:border-stone-700 pb-2">
                    🏔️ Friction Points
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                    {compatResult.insights.challenges.map((challenge: string, i: number) => (
                      <li key={i} className="flex gap-2"><span className="text-rose-500 shrink-0">✦</span> <span>{challenge}</span></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/30 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400 block mb-2">
                    🔮 Cosmic Remedy
                  </span>
                  <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                    {compatResult.insights.remedy}
                  </p>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};
