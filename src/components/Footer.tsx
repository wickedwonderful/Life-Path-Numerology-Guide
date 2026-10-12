import React from 'react';
import { Sparkles, Shield, Download, Trash2, Heart, Scale, Lock, FileText, ExternalLink, DollarSign } from 'lucide-react';
import { UserProfile } from '../types';

interface FooterProps {
  onOpenTerms: (tab: 'terms' | 'privacy' | 'disclaimer') => void;
  onNavigateTab: (tab: 'reading' | 'horoscope' | 'habits' | 'goals' | 'suite' | 'chat') => void;
  userProfile: UserProfile | null;
  onResetData: () => void;
  onOpenPayout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onNavigateTab,
  userProfile,
  onResetData,
  onOpenPayout,
}) => {
  const handleExportData = () => {
    try {
      const allData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cosmic_')) {
          try {
            allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch {
            allData[key] = localStorage.getItem(key);
          }
        }
      }

      const jsonStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cosmic_Path_Backup_${(userProfile?.name || 'User').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
      alert('Could not export backup data.');
    }
  };

  const handleConfirmReset = () => {
    const confirmed = window.confirm(
      '⚠️ Are you sure you want to reset all your cosmic records? This will clear your profile, habit streaks, goals, and karma points from this browser.'
    );
    if (confirmed) {
      onResetData();
    }
  };

  return (
    <footer className="mt-16 border-t border-[#EAE3D9] dark:border-[#342F2A] bg-white/70 dark:bg-[#1A1816]/70 backdrop-blur-md transition-colors">
      {/* Legal & Regulatory Disclaimer Ribbon */}
      <div className="bg-[#FAF7F2] dark:bg-[#141311] border-b border-[#EAE3D9] dark:border-[#342F2A] py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-[#7A7369] dark:text-[#A69E92]">
          <div className="flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5 text-[#C87A5E] shrink-0" />
            <span>
              <strong>Spiritual &amp; Entertainment Notice:</strong> All numerological readings, tarot archetypes, and
              AI Oracle guidance are for self-reflection and entertainment. Not medical, legal, or financial advice.
            </span>
          </div>
          <button
            onClick={() => onOpenTerms('disclaimer')}
            className="text-[#C87A5E] hover:underline font-semibold shrink-0"
          >
            Read Full Disclaimer
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-br from-[#C87A5E] to-[#5E7E6B] rounded-xl flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif italic font-bold text-lg text-[#2C2723] dark:text-[#F5F2EC]">
                Cosmic Path
              </span>
            </div>
            <p className="text-xs text-[#7A7369] dark:text-[#A69E92] leading-relaxed">
              Pythagorean Life Path calculation, personalized AI intuitive readings, habit rituals, and manifestation vision boards.
            </p>
            <p className="text-[11px] text-[#7A7369] dark:text-[#A69E92]">
              Crafted with mindful sacred resonance &amp; privacy-first principles.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2723] dark:text-[#F5F2EC]">
              Sanctuary
            </h4>
            <ul className="space-y-1.5 text-xs text-[#7A7369] dark:text-[#A69E92]">
              <li>
                <button onClick={() => onNavigateTab('reading')} className="hover:text-[#C87A5E] transition-colors">
                  Daily Life Path Reading
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('horoscope')} className="hover:text-[#C87A5E] transition-colors">
                  Cosmic Transits &amp; Horoscope
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('habits')} className="hover:text-[#C87A5E] transition-colors">
                  Habit &amp; Ritual Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('goals')} className="hover:text-[#C87A5E] transition-colors">
                  Vision Board &amp; Manifestation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('suite')} className="hover:text-[#C87A5E] transition-colors">
                  Number Library &amp; Compatibility
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('chat')} className="hover:text-[#C87A5E] transition-colors">
                  Intuitive Oracle Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Legal, Privacy & Compliance */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2723] dark:text-[#F5F2EC]">
              Terms &amp; Compliance
            </h4>
            <ul className="space-y-1.5 text-xs text-[#7A7369] dark:text-[#A69E92]">
              <li>
                <button
                  id="footer-terms-btn"
                  onClick={() => onOpenTerms('terms')}
                  className="hover:text-[#C87A5E] flex items-center space-x-1 transition-colors"
                >
                  <FileText className="w-3 h-3 text-[#C87A5E]" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-privacy-btn"
                  onClick={() => onOpenTerms('privacy')}
                  className="hover:text-[#C87A5E] flex items-center space-x-1 transition-colors"
                >
                  <Lock className="w-3 h-3 text-[#5E7E6B]" />
                  <span>Privacy Policy (Local-First)</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-disclaimer-btn"
                  onClick={() => onOpenTerms('disclaimer')}
                  className="hover:text-[#C87A5E] flex items-center space-x-1 transition-colors"
                >
                  <Scale className="w-3 h-3 text-amber-600" />
                  <span>Spiritual &amp; Entertainment Disclaimer</span>
                </button>
              </li>
              <li className="pt-1 text-[11px] text-[#A69E92] dark:text-[#7A7369]">
                🔒 No account required. All birth data stored locally in your browser.
              </li>
            </ul>
          </div>

          {/* Data Controls & Backup */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2723] dark:text-[#F5F2EC]">
              Data Privacy Controls
            </h4>
            <p className="text-xs text-[#7A7369] dark:text-[#A69E92] leading-relaxed">
              Export your personal reflections or reset all data for a completely fresh start.
            </p>
            <div className="flex flex-col gap-2">
              {onOpenPayout && (
                <button
                  onClick={onOpenPayout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors shadow-xs"
                  title="Configure Stripe or PayPal to receive subscriber payments directly into your bank"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Owner Payout Setup (Stripe/Bank)</span>
                </button>
              )}
              <button
                onClick={handleExportData}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#EAE3D9] dark:border-[#342F2A] hover:bg-[#FAF7F2] dark:hover:bg-[#25221F] text-xs font-semibold text-[#2C2723] dark:text-[#F5F2EC] transition-colors"
                title="Download JSON backup of your profile, streaks, and habits"
              >
                <Download className="w-3.5 h-3.5 text-[#5E7E6B]" />
                <span>Export My Records (.json)</span>
              </button>
              <button
                onClick={handleConfirmReset}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-400 transition-colors"
                title="Clear all local data and restart onboarding"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Reset All Data / Fresh Start</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-[#EAE3D9] dark:border-[#342F2A] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A7369] dark:text-[#A69E92] gap-2">
          <div>
            &copy; {new Date().getFullYear()} Cosmic Path. All rights reserved.
          </div>
          <div className="flex items-center space-x-3">
            <span>Powered by Pythagorean Numerology &amp; Gemini AI</span>
            <span>•</span>
            <span className="font-mono">v1.0.0 Ready for Launch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
