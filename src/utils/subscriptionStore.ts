import { SubscriptionState, SubscriptionBillingCycle } from '../types';

const SUBSCRIPTION_STORAGE_KEY = 'cosmic_subscription_state_v1';

export const PRO_PLANS = {
  monthly: {
    id: 'monthly' as SubscriptionBillingCycle,
    name: 'Cosmic Seeker Monthly',
    price: '$9.99',
    period: '/ month',
    billedInfo: 'Billed monthly. Cancel anytime.',
    badge: 'Popular',
    savings: null,
  },
  annual: {
    id: 'annual' as SubscriptionBillingCycle,
    name: 'Mystic Master Annual',
    price: '$4.99',
    period: '/ month ($59.88/yr)',
    billedInfo: 'Billed annually at $59.88. Includes 7-day free trial.',
    badge: 'Best Value (50% OFF)',
    savings: 'Save $60/year',
  },
  lifetime: {
    id: 'lifetime' as SubscriptionBillingCycle,
    name: 'Eternal Oracle VIP Pass',
    price: '$99.00',
    period: 'one-time',
    billedInfo: 'Pay once, unlock lifetime VIP access for yourself and unlimited clients.',
    badge: 'Founder Edition',
    savings: 'Never pay again',
  },
};

export const PRO_PERKS = [
  {
    title: 'Unlimited Multi-User Profiles & Client Readings',
    description: 'Save readings for partners, family members, friends, or consultation clients with instant 1-click switching.',
    highlight: true,
  },
  {
    title: 'High-Fidelity Studio AI Audio Narration',
    description: 'Unlock all 5 Celestial Voice Personas (Kore, Zephyr, Puck, Charon, Fenrir) with HD meditative pacing.',
    highlight: true,
  },
  {
    title: 'Luxury Printable Cosmic Dossier & Certificate',
    description: 'Full parchment-styled blueprint document with sacred geometry artwork, ready for framing or client delivery.',
    highlight: true,
  },
  {
    title: 'Unlimited Deep AI Oracle Guidance',
    description: 'Extended conversational companion with astrological synastry & karmic soul contract interpretations.',
    highlight: false,
  },
  {
    title: 'Master Numbers & Karmic Debt Analysis',
    description: 'In-depth blueprints for 11, 22, 33 and karmic debt cycles (13/4, 14/5, 16/7, 19/1).',
    highlight: false,
  },
  {
    title: 'Personal Day Push Forecasts & Astrological Synergy',
    description: 'Complete planetary transits, lucky color harmonics, and high-vibrational time windows.',
    highlight: false,
  },
];

export function getSubscriptionState(): SubscriptionState {
  if (typeof window === 'undefined') return { tier: 'free', isActive: false };
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (raw) {
      const parsed: SubscriptionState = JSON.parse(raw);
      // Validate expiration if applicable
      if (parsed.isActive && parsed.expiresAt) {
        if (new Date(parsed.expiresAt).getTime() < Date.now()) {
          parsed.isActive = false;
          parsed.tier = 'free';
          localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(parsed));
        }
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load subscription:', err);
  }

  return { tier: 'free', isActive: false };
}

export function isProSubscriber(): boolean {
  const state = getSubscriptionState();
  return state.isActive && state.tier === 'pro';
}

export function activateProSubscription(cycle: SubscriptionBillingCycle = 'annual'): SubscriptionState {
  const now = new Date();
  let renewsAt = new Date();

  if (cycle === 'monthly') {
    renewsAt.setMonth(now.getMonth() + 1);
  } else if (cycle === 'annual') {
    renewsAt.setFullYear(now.getFullYear() + 1);
  } else {
    // Lifetime: 100 years
    renewsAt.setFullYear(now.getFullYear() + 100);
  }

  const newState: SubscriptionState = {
    tier: 'pro',
    billingCycle: cycle,
    isActive: true,
    startDate: now.toISOString(),
    renewsAt: renewsAt.toISOString(),
    isTrial: cycle === 'annual',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(newState));
    window.dispatchEvent(new CustomEvent('cosmic-subscription-changed', { detail: newState }));
  }

  return newState;
}

export function cancelProSubscription(): SubscriptionState {
  const newState: SubscriptionState = {
    tier: 'free',
    isActive: false,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(newState));
    window.dispatchEvent(new CustomEvent('cosmic-subscription-changed', { detail: newState }));
  }

  return newState;
}
