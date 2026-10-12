import React from 'react';
import { Sparkles, Compass, Shield, Heart, Eye, Sun, Moon, Mountain, Flame, Zap, Award } from 'lucide-react';
import { LifePathNumber, UserProfile } from '../types';

interface LifePathArtworkCardProps {
  lifePathNumber: LifePathNumber;
  userProfile?: UserProfile | null;
  compact?: boolean;
}

interface ArchetypeArtMeta {
  title: string;
  archetype: string;
  element: string;
  motto: string;
  bgGradient: string;
  accentColor: string;
  borderColor: string;
  textColor: string;
  svgIcon: React.ReactNode;
  motivationQuote: string;
  powerTraits: string[];
}

export const ARCHETYPE_ART_DATA: Record<LifePathNumber, ArchetypeArtMeta> = {
  1: {
    title: 'The Sovereign Pioneer',
    archetype: 'Original Creator & Unstoppable Leader',
    element: 'Solar Fire ☀️',
    motto: 'I carve new pathways where none existed before.',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    accentColor: '#D97706',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    motivationQuote: 'Your initiative is divine. Step into the arena of leadership with unwavering conviction; the cosmos backs those who dare to initiate.',
    powerTraits: ['Independent Vision', 'Trailblazing Courage', 'Unshakeable Purpose'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#D97706" strokeWidth="2" />
        <polygon points="50,15 58,38 82,38 62,52 70,75 50,60 30,75 38,52 18,38 42,38" fill="url(#sunGlow1)" opacity="0.85" />
        <circle cx="50" cy="50" r="10" fill="#D97706" />
        <defs>
          <linearGradient id="sunGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  2: {
    title: 'The Sacred Harmonizer',
    archetype: 'Intuitive Diplomat & Healer of Divisions',
    element: 'Lunar Waters 🌙',
    motto: 'In unity, quiet strength moves mountains.',
    bgGradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
    accentColor: '#0284C7',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-700 dark:text-sky-300',
    motivationQuote: 'Your gentle presence is a catalyst for profound transformation. Trust the quiet power of your intuition and diplomatic grace.',
    powerTraits: ['Empathic Intelligence', 'Peaceful Mediator', 'Subtle Wisdom'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#0284C7" strokeWidth="1.5" />
        <path d="M 32,50 A 18,18 0 0,0 68,50 A 18,18 0 0,1 32,50 Z" fill="url(#moonGlow2)" opacity="0.8" />
        <path d="M 68,50 A 18,18 0 0,0 32,50 A 18,18 0 0,1 68,50 Z" fill="#38BDF8" opacity="0.4" />
        <circle cx="50" cy="50" r="4" fill="#0284C7" />
        <defs>
          <linearGradient id="moonGlow2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  3: {
    title: 'The Luminous Alchemist',
    archetype: 'Creative Communicator & Radiant Catalyst',
    element: 'Prismatic Light 🎨',
    motto: 'My joy illuminates the world.',
    bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    accentColor: '#E11D48',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-700 dark:text-rose-300',
    motivationQuote: 'Express your artistic truth without reservation. Your joy is magnetic medicine that awakens hope in everyone you touch.',
    powerTraits: ['Vibrant Eloquence', 'Artistic Magnetism', 'Uplifting Optimism'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <circle cx="50" cy="35" r="22" fill="none" stroke="#E11D48" strokeWidth="2" opacity="0.7" />
        <circle cx="37" cy="60" r="22" fill="none" stroke="#FB7185" strokeWidth="2" opacity="0.7" />
        <circle cx="63" cy="60" r="22" fill="none" stroke="#F43F5E" strokeWidth="2" opacity="0.7" />
        <polygon points="50,22 62,65 38,65" fill="url(#triGlow3)" opacity="0.85" />
        <defs>
          <linearGradient id="triGlow3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  4: {
    title: 'The Master Foundation',
    archetype: 'Architect of Order & Methodical Sovereign',
    element: 'Sacred Earth 🏛️',
    motto: 'Brick by brick, I anchor enduring legacies.',
    bgGradient: 'from-emerald-600/10 via-teal-600/5 to-transparent',
    accentColor: '#059669',
    borderColor: 'border-emerald-600/30',
    textColor: 'text-emerald-800 dark:text-emerald-300',
    motivationQuote: 'Your discipline is a masterpiece in motion. Consistent, purposeful steps construct sanctuaries that withstand the tests of time.',
    powerTraits: ['Unshakeable Stability', 'Strategic Practicality', 'Enduring Integrity'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#059669" strokeWidth="2" rx="4" />
        <polygon points="50,20 80,50 50,80 20,50" fill="url(#cubeGlow4)" opacity="0.6" />
        <rect x="35" y="35" width="30" height="30" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="5" fill="#059669" />
        <defs>
          <linearGradient id="cubeGlow4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  5: {
    title: 'The Catalyst of Freedom',
    archetype: 'Adventurous Maverick & Dynamic Transformer',
    element: 'Cosmic Air 🌬️',
    motto: 'I embrace fluid change as my sacred ally.',
    bgGradient: 'from-teal-500/10 via-cyan-500/5 to-transparent',
    accentColor: '#0D9488',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-700 dark:text-teal-300',
    motivationQuote: 'You are born to break stagnant molds. Trust the winds of change; every transition opens doors to extraordinary wisdom.',
    powerTraits: ['Adaptive Versatility', 'Boundary-Breaking Curiosity', 'Magnetic Vitality'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="4 2" />
        <polygon points="50,12 62,38 90,50 62,62 50,88 38,62 10,50 38,38" fill="url(#windGlow5)" opacity="0.8" />
        <circle cx="50" cy="50" r="8" fill="#0D9488" />
        <defs>
          <linearGradient id="windGlow5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  6: {
    title: 'The Cosmic Nurturer',
    archetype: 'Sanctuary Keeper & Divine Protector',
    element: 'Sacred Heart ❤️',
    motto: 'Love is the anchor and beauty of my universe.',
    bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    accentColor: '#9333EA',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-700 dark:text-purple-300',
    motivationQuote: 'Your capacity to care creates ripples of restoration. Honor your own well-being while holding space for others to thrive.',
    powerTraits: ['Unconditional Compassion', 'Sanctuary Creator', 'Protective Harmony'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <polygon points="50,15 80,70 20,70" fill="none" stroke="#9333EA" strokeWidth="1.5" />
        <polygon points="50,85 80,30 20,30" fill="none" stroke="#C084FC" strokeWidth="1.5" />
        <path d="M 50,38 C 45,30 35,32 35,42 C 35,52 50,62 50,62 C 50,62 65,52 65,42 C 65,32 55,30 50,38 Z" fill="url(#heartGlow6)" opacity="0.85" />
        <defs>
          <linearGradient id="heartGlow6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E879F9" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  7: {
    title: 'The Mystic Seeker',
    archetype: 'Intuitive Scholar & Truth Anchor',
    element: 'Deep Ether 🔮',
    motto: 'In stillness, the infinite whispers its secrets.',
    bgGradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    accentColor: '#4F46E5',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    motivationQuote: 'Your mind is a sacred mirror. Seek the quiet waters within; truth reveals itself to those who dare to listen deeply.',
    powerTraits: ['Profound Intuition', 'Analytic Mastery', 'Spiritual Integrity'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <path d="M 15,50 Q 50,20 85,50 Q 50,80 15,50 Z" fill="none" stroke="#4F46E5" strokeWidth="2" />
        <circle cx="50" cy="50" r="18" fill="url(#eyeGlow7)" opacity="0.8" />
        <circle cx="50" cy="50" r="7" fill="#1E1B4B" />
        <polygon points="50,10 55,22 68,18 60,30 72,38 58,42" fill="#818CF8" opacity="0.5" />
        <defs>
          <linearGradient id="eyeGlow7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  8: {
    title: 'The Master of Abundance',
    archetype: 'Executive Manifestor & Sovereign Ruler',
    element: 'Golden Earth 👑',
    motto: 'As above, so below; I balance wealth with divine wisdom.',
    bgGradient: 'from-amber-600/10 via-yellow-600/5 to-transparent',
    accentColor: '#B45309',
    borderColor: 'border-amber-600/30',
    textColor: 'text-amber-800 dark:text-amber-300',
    motivationQuote: 'You are hardwired for majestic impact. Align material ambition with spiritual integrity and watch abundance flow without limits.',
    powerTraits: ['Strategic Mastery', 'Infinite Manifestation', 'Resilient Leadership'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <path d="M 32,50 C 32,38 42,30 50,50 C 58,70 68,62 68,50 C 68,38 58,30 50,50 C 42,70 32,62 32,50 Z" fill="none" stroke="#B45309" strokeWidth="4" />
        <path d="M 32,50 C 32,38 42,30 50,50 C 58,70 68,62 68,50 C 68,38 58,30 50,50 C 42,70 32,62 32,50 Z" fill="none" stroke="url(#infinityGlow8)" strokeWidth="2" />
        <circle cx="50" cy="50" r="6" fill="#F59E0B" />
        <defs>
          <linearGradient id="infinityGlow8" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  9: {
    title: 'The Universal Humanitarian',
    archetype: 'Spiritual Sage & Compassionate Rebirther',
    element: 'Starlight Galaxy 🌌',
    motto: 'My love encompasses the entire human family.',
    bgGradient: 'from-fuchsia-500/10 via-purple-500/5 to-transparent',
    accentColor: '#A21CAF',
    borderColor: 'border-fuchsia-500/30',
    textColor: 'text-fuchsia-700 dark:text-fuchsia-300',
    motivationQuote: 'Your heart carries the wisdom of many lifetimes. Release the past with unconditional grace and lead humanity toward healing.',
    powerTraits: ['Universal Empathy', 'Transformative Wisdom', 'Selfless Legacy'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#A21CAF" strokeWidth="1.5" />
        <path d="M 50,10 A 40,40 0 0,1 85,72 Q 50,50 50,10 Z" fill="url(#galaxyGlow9)" opacity="0.8" />
        <circle cx="50" cy="50" r="14" fill="none" stroke="#E879F9" strokeWidth="1" />
        <circle cx="50" cy="50" r="5" fill="#A21CAF" />
        <defs>
          <linearGradient id="galaxyGlow9" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0ABFC" />
            <stop offset="100%" stopColor="#A21CAF" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  11: {
    title: 'The Master Illuminator',
    archetype: 'Intuitive Channel & Cosmic Beacon',
    element: 'Electric Light ⚡',
    motto: 'I illuminate dark places with spiritual truth.',
    bgGradient: 'from-yellow-400/15 via-amber-500/5 to-transparent',
    accentColor: '#CA8A04',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-amber-800 dark:text-amber-200',
    motivationQuote: 'Master Number 11: You carry a high-frequency spiritual current. Trust your divine flashes of insight; you are here to awaken world consciousness.',
    powerTraits: ['High Cosmic Intuition', 'Inspirational Spark', 'Spiritual Illumination'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <line x1="38" y1="15" x2="38" y2="85" stroke="#CA8A04" strokeWidth="4" strokeLinecap="round" />
        <line x1="62" y1="15" x2="62" y2="85" stroke="#CA8A04" strokeWidth="4" strokeLinecap="round" />
        <polygon points="50,10 56,35 78,35 60,50 68,75 50,60 32,75 40,50 22,35 44,35" fill="url(#master11Glow)" opacity="0.9" />
        <defs>
          <linearGradient id="master11Glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  22: {
    title: 'The Master Architect',
    archetype: 'Grand Builder of Global Structures',
    element: 'Cosmic Cathedral 🏰',
    motto: 'I turn divine blueprints into physical realities.',
    bgGradient: 'from-amber-500/15 via-emerald-500/5 to-transparent',
    accentColor: '#D97706',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-900 dark:text-amber-200',
    motivationQuote: 'Master Number 22: Your vision bridges heaven and earth. Think on a grand scale; you hold the rare power to anchor massive positive legacy.',
    powerTraits: ['Global Vision', 'Master Execution', 'Enduring Legacy'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#D97706" strokeWidth="2" />
        <polygon points="50,25 75,40 75,60 50,75 25,60 25,40" fill="url(#master22Glow)" opacity="0.75" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="#F59E0B" strokeWidth="1" />
        <line x1="10" y1="30" x2="90" y2="70" stroke="#F59E0B" strokeWidth="1" />
        <line x1="10" y1="70" x2="90" y2="30" stroke="#F59E0B" strokeWidth="1" />
        <defs>
          <linearGradient id="master22Glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  33: {
    title: 'The Master Healing Avatar',
    archetype: 'Teacher of Universal Compassion & Grace',
    element: 'Infinite Lotus 🌸',
    motto: 'My presence brings unconditional peace and healing.',
    bgGradient: 'from-rose-500/15 via-purple-500/5 to-transparent',
    accentColor: '#E11D48',
    borderColor: 'border-rose-500/40',
    textColor: 'text-rose-900 dark:text-rose-200',
    motivationQuote: 'Master Number 33: The Avatar of Healing. Your devotion and altruism inspire global transformation. Lead with humble love.',
    powerTraits: ['Universal Compassion', 'Transformative Grace', 'Spiritual Mastery'],
    svgIcon: (
      <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 opacity-90 transition-transform duration-700 hover:scale-105">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M 50,20 Q 30,50 50,80 Q 70,50 50,20 Z" fill="url(#master33Glow)" opacity="0.8" />
        <path d="M 20,50 Q 50,30 80,50 Q 50,70 20,50 Z" fill="url(#master33Glow)" opacity="0.8" />
        <circle cx="50" cy="50" r="8" fill="#E11D48" />
        <defs>
          <linearGradient id="master33Glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
};

export const LifePathArtworkCard: React.FC<LifePathArtworkCardProps> = ({
  lifePathNumber,
  userProfile,
  compact = false,
}) => {
  const meta = ARCHETYPE_ART_DATA[lifePathNumber] || ARCHETYPE_ART_DATA[1];

  if (compact) {
    return (
      <div className={`bg-gradient-to-r ${meta.bgGradient} bg-white dark:bg-[#2D2A26] border ${meta.borderColor} rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-sm overflow-hidden`}>
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="shrink-0 scale-75 sm:scale-90">{meta.svgIcon}</div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider block truncate" style={{ color: meta.accentColor }}>
              {meta.element} • Archetype #{lifePathNumber}
            </span>
            <h4 className="font-serif font-bold text-sm text-[#4A4741] dark:text-[#F8F5F2] truncate">
              {meta.title}
            </h4>
            <p className="text-[11px] text-[#6B665E] dark:text-[#A39E93] italic truncate">
              "{meta.motto}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${meta.bgGradient} bg-white dark:bg-[#2D2A26] border ${meta.borderColor} rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm relative overflow-hidden transition-all hover:shadow-md`}>
      {/* Decorative ambient background accent */}
      <div
        className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: meta.accentColor }}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10">
        {/* Left Text Content */}
        <div className="space-y-3 sm:space-y-4 flex-1 text-center md:text-left min-w-0 w-full">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 sm:px-3 py-1 rounded-full border bg-white/80 dark:bg-[#2D2A26]/80 backdrop-blur-md"
              style={{ color: meta.accentColor, borderColor: `${meta.accentColor}30` }}
            >
              {meta.element}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D8E7A] bg-[#7D8E7A]/10 px-2.5 sm:px-3 py-1 rounded-full border border-[#7D8E7A]/20">
              Personal Cosmic Archetype
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] leading-tight break-words">
              Life Path #{lifePathNumber}: {meta.title}
            </h2>
            <p className="text-xs font-semibold text-[#8C867C] dark:text-[#A39E93] uppercase tracking-wider mt-1">
              {meta.archetype}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#252320]/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800 space-y-1 text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7D8E7A] block">
              Core Motivation & Daily Inspiration
            </span>
            <p className="text-xs sm:text-sm text-[#3D3A35] dark:text-[#F8F5F2] italic font-serif leading-relaxed break-words">
              "{meta.motivationQuote}"
            </p>
          </div>

          {/* Power Traits Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
            {meta.powerTraits.map((trait, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-[11px] bg-white/90 dark:bg-[#35322D] text-[#4A4741] dark:text-[#F8F5F2] border border-stone-200 dark:border-stone-700 px-2.5 sm:px-3 py-1 rounded-xl font-medium"
              >
                ✦ {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Right Tailored SVG Artwork */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/70 dark:bg-[#252320]/70 rounded-2xl sm:rounded-[28px] border border-stone-200/80 dark:border-stone-800 shadow-inner shrink-0 space-y-1.5">
          {meta.svgIcon}
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C867C] text-center">
            {userProfile?.name ? `${userProfile.name}'s Seal` : 'Cosmic Seal'}
          </span>
        </div>
      </div>
    </div>
  );
};
