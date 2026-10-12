import { SubscriptionBillingCycle } from '../types';

export interface PayoutConfig {
  stripeMonthlyLink: string;
  stripeAnnualLink: string;
  stripeLifetimeLink: string;
  paypalUsername: string;
  cashAppHandle: string;
  venmoHandle: string;
  payoutEmail: string;
  currency: string;
  isConfigured: boolean;
}

const PAYOUT_STORAGE_KEY = 'cosmic_payout_settings_v1';

export const DEFAULT_PAYOUT_CONFIG: PayoutConfig = {
  stripeMonthlyLink: '',
  stripeAnnualLink: '',
  stripeLifetimeLink: '',
  paypalUsername: '',
  cashAppHandle: '',
  venmoHandle: '',
  payoutEmail: '',
  currency: 'USD',
  isConfigured: false,
};

/**
 * Loads payout configuration from local storage or server cache
 */
export function getPayoutConfig(): PayoutConfig {
  if (typeof window === 'undefined') return DEFAULT_PAYOUT_CONFIG;
  try {
    const raw = localStorage.getItem(PAYOUT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const isConfigured = Boolean(
        parsed.stripeMonthlyLink ||
        parsed.stripeAnnualLink ||
        parsed.stripeLifetimeLink ||
        parsed.paypalUsername ||
        parsed.cashAppHandle ||
        parsed.venmoHandle
      );
      return { ...DEFAULT_PAYOUT_CONFIG, ...parsed, isConfigured };
    }
  } catch (err) {
    console.warn('Failed to load local payout config:', err);
  }
  return DEFAULT_PAYOUT_CONFIG;
}

/**
 * Saves payout configuration locally and synchronizes with server
 */
export async function savePayoutConfig(updates: Partial<PayoutConfig>): Promise<PayoutConfig> {
  const current = getPayoutConfig();
  const merged: PayoutConfig = {
    ...current,
    ...updates,
  };
  merged.isConfigured = Boolean(
    merged.stripeMonthlyLink ||
    merged.stripeAnnualLink ||
    merged.stripeLifetimeLink ||
    merged.paypalUsername ||
    merged.cashAppHandle ||
    merged.venmoHandle
  );

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PAYOUT_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('cosmic-payout-config-changed', { detail: { config: merged } }));
    } catch (e) {
      console.error('Failed to save payout config locally:', e);
    }
  }

  // Also sync to backend API if available
  try {
    await fetch('/api/subscription/payout-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });
  } catch (e) {
    // Graceful offline fallback
  }

  return merged;
}

/**
 * Returns the checkout URL for a specific subscription plan and chosen payment provider
 */
export function getCheckoutUrlForPlan(
  cycle: SubscriptionBillingCycle,
  provider: 'stripe' | 'paypal' | 'cashapp' | 'venmo' = 'stripe'
): string | null {
  const config = getPayoutConfig();

  if (provider === 'stripe') {
    if (cycle === 'monthly' && config.stripeMonthlyLink) return config.stripeMonthlyLink;
    if (cycle === 'annual' && config.stripeAnnualLink) return config.stripeAnnualLink;
    if (cycle === 'lifetime' && config.stripeLifetimeLink) return config.stripeLifetimeLink;
    // Fallback to any configured stripe link
    return config.stripeAnnualLink || config.stripeMonthlyLink || config.stripeLifetimeLink || null;
  }

  if (provider === 'paypal' && config.paypalUsername) {
    const cleanUser = config.paypalUsername.replace(/^@/, '').trim();
    const amounts: Record<SubscriptionBillingCycle, string> = {
      monthly: '9.99',
      annual: '59.88',
      lifetime: '99.00',
    };
    const amt = amounts[cycle] || '9.99';
    return `https://www.paypal.com/paypalme/${cleanUser}/${amt}${config.currency || 'USD'}`;
  }

  if (provider === 'cashapp' && config.cashAppHandle) {
    const cleanHandle = config.cashAppHandle.replace(/^\$/, '').trim();
    return `https://cash.app/$${cleanHandle}`;
  }

  if (provider === 'venmo' && config.venmoHandle) {
    const cleanHandle = config.venmoHandle.replace(/^@/, '').trim();
    return `https://venmo.com/${cleanHandle}`;
  }

  return null;
}
