import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Mail,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Trash2,
  Volume2,
  Square,
  Download,
  FileText,
  Sparkles,
  Plus,
  ArrowUp,
  ArrowDown,
  BookOpen,
} from 'lucide-react';
import { UserProfile, LifePathReading, ReportBlock } from '../types';
import {
  getCustomReportBlocks,
  saveCustomReportBlocks,
  getCustomReportNotes,
  saveCustomReportNotes,
  removeReportBlock,
  clearCustomReport,
  assembleCuratedReport,
  generateMarkdownReport,
  generateEmailShareLink,
  generateSmsShareLink,
  generateSocialPostText,
  generateHtmlReport,
} from '../utils/reportStore';
import { speakSoothingly, stopSoothingAudio, isSoothingAudioActive } from '../utils/speech';
import { CosmicShareCardModal } from './CosmicShareCardModal';

interface CustomReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile | null;
  profile?: UserProfile | null;
  reading?: LifePathReading | null;
  onOpenLibrary?: (number?: number) => void;
}

export const CustomReportModal: React.FC<CustomReportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  profile,
  reading,
  onOpenLibrary,
}) => {
  const [blocks, setBlocks] = useState<ReportBlock[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'curate' | 'preview'>('curate');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingProgress, setSpeakingProgress] = useState<{ current: number; total: number } | null>(null);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBlocks(getCustomReportBlocks());
      setCustomNotes(getCustomReportNotes());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setBlocks(getCustomReportBlocks());
    };
    window.addEventListener('cosmic-report-updated', handleStorageUpdate);
    return () => window.removeEventListener('cosmic-report-updated', handleStorageUpdate);
  }, []);

  if (!isOpen) return null;

  const effectiveProfile: UserProfile = userProfile || profile || {
    id: 'user_fallback',
    name: 'Cosmic Seeker',
    birthDate: '08/15/1995',
    primaryFocus: 'Spiritual Growth & Purpose',
    currentMood: 'Mindful & Grounded',
    lifePathNumber: 1,
    createdAt: new Date().toISOString(),
  };

  const effectiveReading: LifePathReading = reading || {
    lifePathNumber: effectiveProfile.lifePathNumber,
    title: 'Personal Numerology Blueprint',
    archetype: 'The Awakened Seeker',
    rulingPlanet: 'Universal Light',
    element: 'Cosmic Ether',
    gemstone: 'Clear Quartz',
    isMasterNumber: false,
    summary: 'A bespoke curated personal numerology dossier.',
    strengths: ['Intuition', 'Resilience', 'Insight'],
    challenges: [{ obstacle: 'Impatience', solution: 'Ground into the present moment' }],
    guidancePractices: ['Daily morning stillness', 'Sacred reflection journaling'],
    markdownContent: '',
    generatedAt: new Date().toISOString(),
  };

  const currentReport = assembleCuratedReport(effectiveProfile, effectiveReading, customNotes);

  const handleNotesChange = (text: string) => {
    setCustomNotes(text);
    saveCustomReportNotes(text);
  };

  const handleRemoveBlock = (id: string) => {
    removeReportBlock(id);
    setBlocks(getCustomReportBlocks());
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    setBlocks(newBlocks);
    saveCustomReportBlocks(newBlocks);
  };

  const handleClear = () => {
    if (confirm('Clear all curated blocks from your custom report?')) {
      clearCustomReport();
      setBlocks([]);
    }
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownReport(currentReport);
    await navigator.clipboard.writeText(md);
    setCopyFeedback('Markdown Copied!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handlePrint = () => {
    const html = generateHtmlReport(currentReport);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(currentReport);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cosmic_Report_${(effectiveProfile.name || 'Soul').replace(/\s+/g, '_')}_LP${effectiveReading.lifePathNumber}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareWeb = async () => {
    const text = generateSocialPostText(currentReport);
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentReport.title,
          text: text,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    setCopyFeedback('Social post text copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stopSoothingAudio();
      setIsSpeaking(false);
      setSpeakingProgress(null);
      return;
    }

    if (blocks.length === 0) return;

    const fullText = `Curated Cosmic Report for ${currentReport.profileName}. Life Path ${currentReport.lifePathNumber}, the ${currentReport.archetype}. ` +
      (customNotes ? `Personal intention: ${customNotes}. ` : '') +
      blocks.map((b) => `${b.title}. ${b.fullContent}`).join(' ');

    speakSoothingly({
      text: fullText,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingProgress(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setSpeakingProgress(null);
      },
      onProgress: (cur, tot) => {
        setSpeakingProgress({ current: cur, total: tot });
      },
    });
  };

  return (
    <div
      id="custom-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-800 dark:text-stone-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-50">
                  Custom Curated Report
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50">
                  {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Life Path #{effectiveReading.lifePathNumber} ({effectiveReading.archetype}) • Born {currentReport.birthDateFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio narration button */}
            <button
              id="report-narrate-btn"
              onClick={handleToggleAudio}
              disabled={blocks.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                isSpeaking
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              title="Listen to full curated report with Gemini AI Voice"
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>
                    Stop {speakingProgress ? `(${speakingProgress.current}/${speakingProgress.total})` : ''}
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Listen to Report</span>
                  <span className="sm:hidden">Listen</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-stone-100/60 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 text-xs">
          <div className="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('curate')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeTab === 'curate'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Curate & Organize ({blocks.length})
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Document Preview
            </button>
          </div>

          {blocks.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {blocks.length === 0 ? (
            <div className="py-12 px-4 text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
                Your Custom Dossier is Empty
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                You can add any insight block from your Cosmic Reading or Number Library to build your personalized, shareable report.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Browse Reading & Add Blocks
              </button>
            </div>
          ) : activeTab === 'curate' ? (
            <div className="space-y-6">
              {/* Personal Notes Box */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Personal Reflections & Intentions (Saved in Report)
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Add your own cosmic intentions, journal reflections, or focus mantras for this curated report..."
                  rows={2}
                  className="w-full text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:text-stone-100"
                />
              </div>

              {/* Block List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Curated Sections ({blocks.length})
                </h4>
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {block.category}
                        </span>
                        <span className="text-xs text-stone-400">
                          #{index + 1}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {block.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
                        {block.summaryText}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {/* Move up */}
                      <button
                        onClick={() => handleMoveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      {/* Move down */}
                      <button
                        onClick={() => handleMoveBlock(index, 'down')}
                        disabled={index === blocks.length - 1}
                        className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveBlock(block.id)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        title="Remove from Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Document Preview */
            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 font-serif space-y-6">
              <div className="border-b border-stone-300 dark:border-stone-800 pb-4">
                <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400">
                  {currentReport.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-sans text-stone-600 dark:text-stone-400">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    Born: {currentReport.birthDateFormatted}
                  </span>
                  <span>•</span>
                  <span>Life Path #{currentReport.lifePathNumber} ({currentReport.archetype})</span>
                  <span>•</span>
                  <span>Curated with Cosmic Numerology Sanctuary</span>
                </div>
              </div>

              {currentReport.customNotes && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-sm font-sans text-stone-700 dark:text-stone-300 italic">
                  <strong>Personal Intentions:</strong> {currentReport.customNotes}
                </div>
              )}

              <div className="space-y-6">
                {currentReport.blocks.map((b, i) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs"
                  >
                    <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                      {b.category}
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                      {i + 1}. {b.title}
                    </h3>
                    <div className="text-sm font-sans text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                      {b.fullContent.replace(/#+\s*/g, '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions / Share bar */}
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {copyFeedback && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> {copyFeedback}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              disabled={blocks.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors disabled:opacity-40"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>Print / PDF</span>
            </button>

            {/* Email Share */}
            <a
              href={blocks.length > 0 ? generateEmailShareLink(currentReport) : '#'}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${
                blocks.length === 0 ? 'pointer-events-none opacity-40' : ''
              }`}
              title="Share via Email"
            >
              <Mail className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>Email</span>
            </a>

            {/* SMS / Text Share */}
            <a
              href={blocks.length > 0 ? generateSmsShareLink(currentReport) : '#'}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${
                blocks.length === 0 ? 'pointer-events-none opacity-40' : ''
              }`}
              title="Share via Text Message"
            >
              <MessageSquare className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>SMS</span>
            </a>

            {/* Visual Social Card */}
            <button
              onClick={() => setIsShareCardOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shadow-xs"
              title="Open Personalized Visual Social Card"
            >
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Visual Card</span>
            </button>

            {/* Social / Web Share */}
            <button
              onClick={handleShareWeb}
              disabled={blocks.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors disabled:opacity-40"
              title="Share to Social Media"
            >
              <Share2 className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>Social</span>
            </button>

            {/* Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              disabled={blocks.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors disabled:opacity-40"
              title="Copy Markdown to Clipboard"
            >
              <Copy className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>Copy</span>
            </button>

            {/* Download MD */}
            <button
              onClick={handleDownloadMarkdown}
              disabled={blocks.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-40"
              title="Download Markdown Report File"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Social Card Modal */}
      <CosmicShareCardModal
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
        userProfile={effectiveProfile}
        reading={effectiveReading}
      />
    </div>
  );
};
