import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Check,
  Crown,
  Shield,
  CreditCard,
  Lock,
  ArrowRight,
  ExternalLink,
  Settings,
  HelpCircle,
} from 'lucide-react';
import {
  PRO_PLANS,
  PRO_PERKS,
  getSubscriptionState,
  activateProSubscription,
  cancelProSubscription,
  isProSubscriber,
} from '../utils/subscriptionStore';
import { getCheckoutUrlForPlan, getPayoutConfig } from '../utils/payoutStore';
import { PayoutSettingsModal } from './PayoutSettingsModal';
import { SubscriptionBillingCycle } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedCycle, setSelectedCycle] = useState<SubscriptionBillingCycle>('annual');
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paypal' | 'instant'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [justUpgraded, setJustUpgraded] = useState(false);
  const [isAwaitingExternalPayment, setIsAwaitingExternalPayment] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const currentSub = getSubscriptionState();
  const isAlreadyPro = isProSubscriber();
  const payoutConfig = getPayoutConfig();

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);

    if (paymentProvider === 'instant') {
      // Direct demo / test activation
      setTimeout(() => {
        activateProSubscription(selectedCycle);
        setIsProcessing(false);
        setJustUpgraded(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setJustUpgraded(false);
          onClose();
        }, 2200);
      }, 700);
      return;
    }

    // Real Payment Link Checkout via Stripe or PayPal
    const checkoutUrl = getCheckoutUrlForPlan(selectedCycle, paymentProvider);

    if (checkoutUrl) {
      // Launch checkout in new tab
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
      setIsProcessing(false);
      setIsAwaitingExternalPayment(true);
    } else {
      // If owner hasn't pasted their Stripe/PayPal link yet, gracefully inform them and offer instant activation
      setIsProcessing(false);
      const confirmDemo = confirm(
        'Owner payout link is not configured yet. Would you like to activate Cosmic Pro in instant demo mode right now, or configure your Stripe/PayPal link first?'
      );
      if (confirmDemo) {
        activateProSubscription(selectedCycle);
        setJustUpgraded(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setJustUpgraded(false);
          onClose();
        }, 2200);
      } else {
        setIsPayoutModalOpen(true);
      }
    }
  };

  const handleConfirmPaid = () => {
    activateProSubscription(selectedCycle);
    setIsAwaitingExternalPayment(false);
    setJustUpgraded(true);
    if (onSuccess) onSuccess();
    setTimeout(() => {
      setJustUpgraded(false);
      onClose();
    }, 2200);
  };

  const handleCancelSub = () => {
    if (confirm('Cancel your Cosmic Pro subscription and return to the Free Seeker tier?')) {
      cancelProSubscription();
      onClose();
    }
  };

  return (
    <>
      <div
        id="subscription-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in"
        onClick={onClose}
      >
        <div
          id="subscription-modal-dialog"
          className="relative w-full max-w-2xl bg-white dark:bg-[#1E1C19] border border-[#EAE3D9] dark:border-[#38332D] rounded-[24px] sm:rounded-[36px] shadow-2xl overflow-hidden text-[#2C2723] dark:text-[#F5F2EC] my-auto max-h-[92dvh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Glow Banner */}
          <div className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white p-5 sm:p-7 shrink-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <div className="flex items-start justify-between relative z-10 gap-3">
              <div className="space-y-1.5 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-widest text-amber-100">
                  <Crown className="w-3.5 h-3.5 text-amber-200" />
                  Cosmic Path Pro VIP
                </div>
                <h2 id="subscription-modal-title" className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight">
                  Unlock Your Highest Divine Potential
                </h2>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  Elevate your journey with unlimited client profiles, studio AI voices, and luxury printable dossiers.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {justUpgraded ? (
              <div className="py-10 text-center space-y-3 animate-scale-up">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 animate-pulse text-amber-500" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">
                  Welcome to Cosmic Path Pro! 👑
                </h3>
                <p className="text-xs text-[#7A7369] dark:text-[#A69E92] max-w-sm mx-auto">
                  Your VIP membership is now active. All master readings, studio audio voices, and unlimited profiles are unlocked.
                </p>
              </div>
            ) : isAwaitingExternalPayment ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Checkout Opened in New Tab
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                  We opened your secure payment checkout. Once you complete the transaction, click the button below to activate your VIP membership immediately.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleConfirmPaid}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>I Completed Payment — Activate VIP</span>
                  </button>
                  <button
                    onClick={() => setIsAwaitingExternalPayment(false)}
                    className="text-xs text-stone-500 hover:underline"
                  >
                    Back to Plans
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Plan Switcher Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['annual', 'monthly', 'lifetime'] as SubscriptionBillingCycle[]).map((cycle) => {
                    const plan = PRO_PLANS[cycle];
                    const isSelected = selectedCycle === cycle;

                    return (
                      <div
                        key={cycle}
                        onClick={() => setSelectedCycle(cycle)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-600 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20 shadow-md'
                            : 'border-[#EAE3D9] dark:border-[#38332D] hover:border-amber-400 bg-white dark:bg-[#25221E]'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-xs">
                            {plan.badge}
                          </span>
                        )}
                        <div>
                          <span className="text-xs font-bold text-[#7A7369] dark:text-[#A69E92] block">
                            {plan.name}
                          </span>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-xl sm:text-2xl font-serif font-bold text-[#2C2723] dark:text-[#F5F2EC]">
                              {plan.price}
                            </span>
                            <span className="text-[10px] text-[#7A7369] dark:text-[#A69E92]">
                              {plan.period}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#7A7369] dark:text-[#A69E92] mt-2 leading-tight">
                          {plan.billedInfo}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block">
                    Choose Payment Method
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentProvider('stripe')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        paymentProvider === 'stripe'
                          ? 'border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1 text-emerald-600" />
                      <span>Card / Apple Pay</span>
                      <span className="text-[9px] font-normal opacity-75">via Stripe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentProvider('paypal')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        paymentProvider === 'paypal'
                          ? 'border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-blue-600 font-serif font-black text-sm mb-0.5 leading-none">P</span>
                      <span>PayPal & Venmo</span>
                      <span className="text-[9px] font-normal opacity-75">Direct transfer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentProvider('instant')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all ${
                        paymentProvider === 'instant'
                          ? 'border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mb-1 text-amber-500" />
                      <span>Instant Access</span>
                      <span className="text-[9px] font-normal opacity-75">Test / Demo</span>
                    </button>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A7369] dark:text-[#A69E92]">
                    Everything Included in Pro VIP
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRO_PERKS.map((perk, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#25221E] border border-[#EAE3D9] dark:border-[#342F2A]"
                      >
                        <div className="w-4 h-4 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#2C2723] dark:text-[#F5F2EC] leading-tight">
                            {perk.title}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-[#7A7369] dark:text-[#A69E92] leading-tight mt-0.5">
                            {perk.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guarantee & Social Proof */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>30-Day Money-Back Guarantee • Cancel anytime with 1 click</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-400">
                    <Lock className="w-3 h-3" />
                    <span>256-Bit Encrypted Checkout</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA & Creator Payout Link */}
          {!justUpgraded && !isAwaitingExternalPayment && (
            <div className="p-4 sm:p-5 bg-[#FAF7F2] dark:bg-[#141311] border-t border-[#EAE3D9] dark:border-[#342F2A] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {isAlreadyPro ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Your Pro VIP Membership is Active
                  </span>
                  <button
                    onClick={handleCancelSub}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Manage / Cancel Plan
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                    <div>
                      <span className="text-xs font-bold text-[#2C2723] dark:text-[#F5F2EC] block">
                        {selectedCycle === 'annual'
                          ? '7-Day Free Trial Included'
                          : 'Immediate VIP Activation'}
                      </span>
                      <span className="text-[11px] text-[#7A7369] dark:text-[#A69E92]">
                        {selectedCycle === 'lifetime'
                          ? 'One-time payment of $99'
                          : selectedCycle === 'annual'
                          ? '$59.88/year after trial ends'
                          : '$9.99 billed monthly'}
                      </span>
                    </div>

                    {/* Owner Payout Setup Button */}
                    <button
                      type="button"
                      onClick={() => setIsPayoutModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-medium ml-auto sm:ml-2"
                      title="Set your Stripe or PayPal account to receive subscriber payments"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline sm:inline">Owner Bank Setup</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={onClose}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#EAE3D9] dark:border-[#38332D] text-xs font-bold text-[#7A7369] dark:text-[#A69E92] hover:bg-white dark:hover:bg-[#25221E] transition-colors"
                    >
                      Maybe Later
                    </button>
                    <button
                      onClick={handleSubscribe}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Opening Checkout...' : 'Unlock Cosmic Pro'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Creator Payout & Bank Account Setup Modal */}
      <PayoutSettingsModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
      />
    </>
  );
};
