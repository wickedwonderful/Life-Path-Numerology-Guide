import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Sparkles, Scale, Info } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'disclaimer';
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'disclaimer'>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div
      id="terms-privacy-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#342F2A] rounded-3xl shadow-2xl overflow-hidden text-[#2C2723] dark:text-[#F5F2EC]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EAE3D9] dark:border-[#342F2A] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#141311]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C87A5E]/15 text-[#C87A5E] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">
                Legal, Privacy & Compliance
              </h2>
              <p className="text-xs text-[#7A7369] dark:text-[#A69E92]">
                Cosmic Path Platform Standards & Guidance Disclaimers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#EAE3D9]/60 dark:hover:bg-[#342F2A] text-[#7A7369] dark:text-[#A69E92] hover:text-[#2C2723] dark:hover:text-[#F5F2EC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#EAE3D9] dark:border-[#342F2A] bg-white dark:bg-[#1E1C19] px-6 gap-2 text-xs font-bold pt-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-[#C87A5E] text-[#C87A5E]'
                : 'border-transparent text-[#7A7369] dark:text-[#A69E92] hover:text-[#2C2723] dark:hover:text-[#F5F2EC]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-[#C87A5E] text-[#C87A5E]'
                : 'border-transparent text-[#7A7369] dark:text-[#A69E92] hover:text-[#2C2723] dark:hover:text-[#F5F2EC]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center space-x-1.5 pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'disclaimer'
                ? 'border-[#C87A5E] text-[#C87A5E]'
                : 'border-transparent text-[#7A7369] dark:text-[#A69E92] hover:text-[#2C2723] dark:hover:text-[#F5F2EC]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Spiritual Disclaimer</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm leading-relaxed space-y-4 text-[#4A4741] dark:text-[#D5CFC7]">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
                <strong>Last Updated:</strong> October 2026. By accessing or using Cosmic Path, you agree to these Terms.
              </div>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  1. Nature of the Service
                </h3>
                <p>
                  Cosmic Path is a self-reflection, mindfulness, and educational numerological tool designed to provide
                  symbolic insights, daily affirmations, and intuitive prompts based on historical Pythagorean numerology
                  and AI natural language interpretations.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  2. Acceptable Use
                </h3>
                <p>
                  You agree to use this platform in accordance with applicable laws. You may not utilize our platform or
                  AI Oracle endpoints for generating defamatory, abusive, harassing, or illegal content.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  3. Intellectual Property & AI Generation
                </h3>
                <p>
                  All numerological algorithms, system design, curated library descriptions, and platform code are the
                  intellectual property of Cosmic Path. Content synthesized through AI models is provided for your personal,
                  non-commercial empowerment, study, and enjoyment.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  4. Limitation of Liability
                </h3>
                <p>
                  Cosmic Path and its contributors provide the software &quot;as is&quot; without warranties of any kind.
                  Decisions made based upon your numerology readings or AI Oracle interactions are your sole responsibility.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
                <strong>Local-First Architecture:</strong> Your personal profile, birth date, habits, and goals are stored
                locally in your browser&apos;s localStorage. We do not sell or monetize your private data.
              </div>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  1. Information We Store Locally
                </h3>
                <p>
                  To provide immediate calculations and persistent streaks, we save your name, birth date, habit logs,
                  manifestation vision items, and custom report dossier in your local web browser storage (`localStorage`).
                  This data remains under your direct control at all times.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  2. AI Processing Transparency
                </h3>
                <p>
                  When you request an AI intuitive reading, daily transit horoscope, or chat with the Oracle Guide, your
                  provided inputs (such as birth date, life path number, or question prompt) are transmitted securely to Google
                  Gemini API endpoints solely to generate the requested reading. Your data is not used to train public models.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  3. Your Right to Delete &amp; Export
                </h3>
                <p>
                  You can purge your entire profile, habit streaks, goals, and history at any time using the &quot;Clear All Data&quot;
                  button in the footer, or export a complete JSON archive of your personal records with one click.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
                <strong>Mandatory Regulatory Notice:</strong> All numerological readings, tarot archetypes, astrological transits,
                and intuitive Oracle responses are provided strictly for entertainment, personal enrichment, and mindfulness purposes.
              </div>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  Not Professional Medical or Psychological Advice
                </h3>
                <p>
                  Cosmic Path is not a licensed healthcare provider, psychologist, or medical service. If you are experiencing
                  physical illness, psychological distress, or emotional crisis, please consult a qualified healthcare professional
                  or emergency service immediately.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  Not Financial or Legal Counsel
                </h3>
                <p>
                  Vibrational numbers and abundance archetypes (such as Life Path #8) are philosophical symbols of personal alignment.
                  They do not constitute financial advice, investment strategy, or legal counsel. Always consult certified financial
                  or legal professionals before making binding decisions.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#2C2723] dark:text-[#F5F2EC]">
                  Empowerment Over Fatalism
                </h3>
                <p>
                  Numerology represents potential archetypes and rhythms of self-awareness. Your free will, conscious choices,
                  and focused action always determine your life outcomes.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAE3D9] dark:border-[#342F2A] bg-[#FAF7F2] dark:bg-[#141311] flex items-center justify-between">
          <span className="text-xs text-[#7A7369] dark:text-[#A69E92]">
            Cosmic Path Platform • Version 1.0.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2C2723] dark:bg-[#F5F2EC] text-white dark:text-[#2C2723] font-bold text-xs hover:opacity-90 transition-opacity"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
};
