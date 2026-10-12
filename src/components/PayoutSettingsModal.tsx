import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  Check,
  X,
  ExternalLink,
  Shield,
  HelpCircle,
  Sparkles,
  Save,
  ArrowRight,
  Info,
} from 'lucide-react';
import { getPayoutConfig, savePayoutConfig, PayoutConfig } from '../utils/payoutStore';

interface PayoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const PayoutSettingsModal: React.FC<PayoutSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [config, setConfig] = useState<PayoutConfig>(getPayoutConfig());
  const [showGuide, setShowGuide] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getPayoutConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePayoutConfig(config);
    setSavedSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92dvh] flex flex-col rounded-3xl bg-white dark:bg-[#1E1D1B] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <DollarSign className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-100 bg-white/10 px-2 py-0.5 rounded-full mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Owner Revenue Portal</span>
              </div>
              <h2 id="payout-modal-title" className="text-lg sm:text-xl font-serif font-bold leading-tight">
                Creator Payout & Bank Setup
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Revenue Assurance Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start space-x-3">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                Receive 100% of Subscriber Payments Directly
              </p>
              <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
                Connect your personal or business Stripe / PayPal account below. When users click &quot;Unlock Cosmic Pro&quot;, they pay directly to your account and funds are deposited into your bank.
              </p>
            </div>
          </div>

          {/* Quick Guide Toggle */}
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full text-left p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-xs font-semibold flex items-center justify-between text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>How to create your Stripe Payment Link in 2 minutes (Free)</span>
            </div>
            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showGuide ? 'rotate-90' : ''}`} />
          </button>

          {showGuide && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-stone-700 dark:text-stone-300 space-y-2 animate-fade-in">
              <p className="font-bold text-amber-900 dark:text-amber-300">Quick 3-Step Setup with Stripe:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
                <li>
                  Sign into your free account at{' '}
                  <a
                    href="https://dashboard.stripe.com/payment-links"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-700 dark:text-amber-400 underline font-bold inline-flex items-center gap-0.5"
                  >
                    Stripe Dashboard <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>Click <strong>&quot;+ New Payment Link&quot;</strong> and create a recurring product for $4.99/mo or $59.88/yr.</li>
                <li>Copy the generated link (e.g., <code>https://buy.stripe.com/...</code>) and paste it into the field below!</li>
              </ol>
            </div>
          )}

          {/* Stripe Payment Links */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Stripe Payment Links (Cards, Apple Pay, Google Pay)
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Annual VIP Plan Link ($59.88/yr — Most Popular)
              </label>
              <input
                type="url"
                placeholder="https://buy.stripe.com/..."
                value={config.stripeAnnualLink}
                onChange={(e) => setConfig({ ...config, stripeAnnualLink: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/60 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Monthly Plan Link ($9.99/mo)
                </label>
                <input
                  type="url"
                  placeholder="https://buy.stripe.com/..."
                  value={config.stripeMonthlyLink}
                  onChange={(e) => setConfig({ ...config, stripeMonthlyLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/60 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Lifetime VIP Pass Link ($99.00)
                </label>
                <input
                  type="url"
                  placeholder="https://buy.stripe.com/..."
                  value={config.stripeLifetimeLink}
                  onChange={(e) => setConfig({ ...config, stripeLifetimeLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/60 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Alternative Payout Handles (PayPal, CashApp, Venmo) */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Alternative Direct Payment Handles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  PayPal.me Username
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 text-xs bg-stone-100 dark:bg-stone-800 border border-r-0 border-stone-200 dark:border-stone-700 rounded-l-xl text-stone-500">
                    paypal.me/
                  </span>
                  <input
                    type="text"
                    placeholder="yourusername"
                    value={config.paypalUsername}
                    onChange={(e) => setConfig({ ...config, paypalUsername: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-r-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/60 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  CashApp or Venmo Handle
                </label>
                <input
                  type="text"
                  placeholder="$YourCashApp or @YourVenmo"
                  value={config.cashAppHandle || config.venmoHandle}
                  onChange={(e) => setConfig({ ...config, cashAppHandle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/60 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Owner Support / Billing Contact Email
              </label>
              <input
                type="email"
                placeholder="support@yournumerology.com"
                value={config.payoutEmail}
                onChange={(e) => setConfig({ ...config, payoutEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/60 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Payout settings saved successfully! Subscribers can now pay directly to you.</span>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Instant payouts sent directly to your bank</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Payout Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
