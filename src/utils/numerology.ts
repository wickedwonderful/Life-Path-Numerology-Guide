import { LifePathNumber, MasterNumber, LifePathReading, DailyHoroscope } from '../types';

/**
 * Helper to reduce a number according to Pythagorean numerology rules.
 * Master Numbers (11, 22, 33) are preserved when allowMaster = true.
 */
export function reduceNumber(val: number, allowMaster = true): LifePathNumber {
  if (allowMaster && (val === 11 || val === 22 || val === 33)) {
    return val as MasterNumber;
  }
  
  let current = val;
  while (current > 9) {
    if (allowMaster && (current === 11 || current === 22 || current === 33)) {
      return current as MasterNumber;
    }
    const sum = String(current)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    current = sum;
  }

  return (current || 1) as LifePathNumber;
}

export interface CalculationTrace {
  rawDate: string;
  month: number;
  monthReduced: LifePathNumber;
  day: number;
  dayReduced: LifePathNumber;
  year: number;
  yearReduced: LifePathNumber;
  stepSum: number;
  finalLifePath: LifePathNumber;
  explanation: string;
}

/**
 * Calculates Life Path Number following standard rules:
 * 1. Reduce Month, Day, and Year individually (preserving 11, 22, 33).
 * 2. Sum the reduced results.
 * 3. Reduce sum to single digit or Master Number.
 */
export function calculateLifePath(birthDateStr: string): CalculationTrace {
  // Normalize date string (supports MM/DD/YYYY, YYYY-MM-DD, YYYY/MM/DD, DD/MM/YYYY, 2-digit years, ISO strings)
  let m = 0, d = 0, y = 0;
  
  if (birthDateStr) {
    const cleanStr = birthDateStr.split('T')[0].trim();
    const parts = cleanStr.split(/[-/.\s]+/).map((p) => parseInt(p, 10)).filter((n) => !isNaN(n));
    
    if (parts.length >= 3) {
      if (parts[0] > 1000) {
        // YYYY-MM-DD or YYYY/MM/DD
        y = parts[0];
        m = parts[1];
        d = parts[2];
      } else if (parts[2] > 1000) {
        // MM/DD/YYYY or DD/MM/YYYY
        m = parts[0];
        d = parts[1];
        y = parts[2];
        if (m > 12 && d <= 12) {
          const temp = m;
          m = d;
          d = temp;
        }
      } else {
        // 2-digit year (e.g. 08/15/95)
        m = parts[0];
        d = parts[1];
        const rawY = parts[2];
        y = rawY < 100 ? (rawY > 30 ? 1900 + rawY : 2000 + rawY) : rawY;
        if (m > 12 && d <= 12) {
          const temp = m;
          m = d;
          d = temp;
        }
      }
    }
  }

  if (isNaN(m) || isNaN(d) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < 1000) {
    // Fallback default
    m = 1; d = 1; y = 2000;
  }

  const monthReduced = reduceNumber(m, true);
  const dayReduced = reduceNumber(d, true);

  // Sum digits of Year
  const yearDigitSum = String(y)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const yearReduced = reduceNumber(yearDigitSum, true);

  const stepSum = monthReduced + dayReduced + yearReduced;
  const finalLifePath = reduceNumber(stepSum, true);

  const explanation = `Month (${m}) → ${monthReduced}, Day (${d}) → ${dayReduced}, Year (${y}) → ${yearReduced}. Total: ${monthReduced} + ${dayReduced} + ${yearReduced} = ${stepSum} → Life Path ${finalLifePath}.`;

  return {
    rawDate: `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`,
    month: m,
    monthReduced,
    day: d,
    dayReduced,
    year: y,
    yearReduced,
    stepSum,
    finalLifePath,
    explanation,
  };
}

/**
 * Safely formats any birth date string (MM/DD/YYYY or YYYY-MM-DD) into a human-readable date.
 * Completely eliminates "Invalid Date" errors.
 */
export function formatBirthDate(birthDateStr?: string): string {
  if (!birthDateStr) return 'Cosmic Citizen';
  try {
    const trace = calculateLifePath(birthDateStr);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = months[trace.month - 1] || 'Month';
    return `${monthName} ${trace.day}, ${trace.year}`;
  } catch {
    return birthDateStr;
  }
}

/**
 * Pythagorean Name Numerology (A=1 .. I=9)
 */
const PYTHAGOREAN_LETTER_MAP: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

export interface LetterBreakdown {
  char: string;
  value: number;
  isVowel: boolean;
}

export interface WordBreakdown {
  word: string;
  letters: LetterBreakdown[];
  wordSum: number;
  wordVowelSum: number;
  wordConsonantSum: number;
}

export interface NameNumerologyDetails {
  cleaned: string;
  words: WordBreakdown[];
  totalRawSum: number;
  vowelRawSum: number;
  consonantRawSum: number;
  expression: LifePathNumber;
  soulUrge: LifePathNumber;
  personality: LifePathNumber;
  expressionTrace: string;
  soulUrgeTrace: string;
  personalityTrace: string;
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export function calculateNameNumerology(fullName: string) {
  const details = getNameDetailedBreakdown(fullName);
  return {
    expression: details.expression,
    soulUrge: details.soulUrge,
    personality: details.personality,
    details,
  };
}

/**
 * Calculates all 4 core numerological blueprint numbers:
 * 1. Life Path (from birth date)
 * 2. Destiny / Expression (from full birth name)
 * 3. Soul Urge / Heart's Desire (from vowels)
 * 4. Outer Personality (from consonants)
 */
export function calculateCoreNumbers(fullName: string, birthDate: string) {
  const lp = calculateLifePath(birthDate).finalLifePath;
  const nameCalc = calculateNameNumerology(fullName);
  return {
    lifePath: lp,
    destiny: nameCalc.expression,
    expression: nameCalc.expression,
    soulUrge: nameCalc.soulUrge,
    personality: nameCalc.personality,
  };
}

export function getNameDetailedBreakdown(fullName: string): NameNumerologyDetails {
  const wordsRaw = fullName.trim().split(/\s+/).filter(Boolean);
  const words: WordBreakdown[] = [];

  let totalRawSum = 0;
  let vowelRawSum = 0;
  let consonantRawSum = 0;

  for (const wordRaw of wordsRaw) {
    const letters: LetterBreakdown[] = [];
    let wordSum = 0;
    let wordVowelSum = 0;
    let wordConsonantSum = 0;

    for (const ch of wordRaw) {
      const lower = ch.toLowerCase();
      const val = PYTHAGOREAN_LETTER_MAP[lower];
      if (val !== undefined) {
        const isVowel = VOWELS.has(lower);
        letters.push({ char: ch.toUpperCase(), value: val, isVowel });
        wordSum += val;
        totalRawSum += val;
        if (isVowel) {
          wordVowelSum += val;
          vowelRawSum += val;
        } else {
          wordConsonantSum += val;
          consonantRawSum += val;
        }
      }
    }

    if (letters.length > 0) {
      words.push({
        word: wordRaw,
        letters,
        wordSum,
        wordVowelSum,
        wordConsonantSum,
      });
    }
  }

  if (words.length === 0) {
    return {
      cleaned: '',
      words: [],
      totalRawSum: 0,
      vowelRawSum: 0,
      consonantRawSum: 0,
      expression: 1,
      soulUrge: 1,
      personality: 1,
      expressionTrace: '0 -> 1',
      soulUrgeTrace: '0 -> 1',
      personalityTrace: '0 -> 1',
    };
  }

  const expression = reduceNumber(totalRawSum, true);
  const soulUrge = reduceNumber(vowelRawSum || totalRawSum, true);
  const personality = reduceNumber(consonantRawSum || totalRawSum, true);

  return {
    cleaned: words.map((w) => w.word).join(' '),
    words,
    totalRawSum,
    vowelRawSum,
    consonantRawSum,
    expression,
    soulUrge,
    personality,
    expressionTrace: `Sum of all letters (${totalRawSum}) reduces to #${expression}`,
    soulUrgeTrace:
      vowelRawSum > 0
        ? `Sum of vowels (${vowelRawSum}) reduces to #${soulUrge}`
        : `No standard vowels detected — using root name sum (${totalRawSum}) reducing to #${soulUrge}`,
    personalityTrace:
      consonantRawSum > 0
        ? `Sum of consonants (${consonantRawSum}) reduces to #${personality}`
        : `No consonants detected — using root name sum (${totalRawSum}) reducing to #${personality}`,
  };
}

/**
 * Personal Day/Month/Year calculation
 */
export function calculatePersonalVibrations(birthDateStr: string, dateObj = new Date()) {
  const trace = calculateLifePath(birthDateStr);
  const curYear = dateObj.getFullYear();
  const curMonth = dateObj.getMonth() + 1;
  const curDay = dateObj.getDate();

  const curYearReduced = reduceNumber(curYear, false);
  const personalYear = reduceNumber(trace.monthReduced + trace.dayReduced + curYearReduced, false);
  const personalMonth = reduceNumber(personalYear + curMonth, false);
  const personalDay = reduceNumber(personalMonth + curDay, false);

  return {
    personalYear,
    personalMonth,
    personalDay,
  };
}

export interface LifePathDetail {
  number: LifePathNumber;
  title: string;
  archetype: string;
  vibration: string;
  element: string;
  rulingPlanet: string;
  gemstone: string;
  strengths: string[];
  challenges: Array<{ obstacle: string; solution: string }>;
  guidancePractices: string[];
  recommendedHabits: Array<{ title: string; category: 'mindfulness' | 'physical' | 'creative' | 'purpose' | 'relationships'; description: string }>;
}

export const LIFE_PATH_DETAILS: Record<LifePathNumber, LifePathDetail> = {
  1: {
    number: 1,
    title: "The Pioneer & Leader",
    archetype: "The Visionary Architect",
    vibration: "Independence, Originality, Courage, and Unstoppable Initiative",
    element: "Fire",
    rulingPlanet: "Sun ☀️",
    gemstone: "Ruby & Pyrite",
    strengths: [
      "Unrivaled self-motivation and pioneering spirit to initiate original ideas",
      "Fearless independence in carving new pathways where none existed",
      "Natural charisma and decisive action taking during high-pressure moments"
    ],
    challenges: [
      {
        obstacle: "Impatience or reluctance to delegate tasks to others",
        solution: "Practice collaborative trusting by pairing leadership with open vulnerability."
      },
      {
        obstacle: "Risk of burnout from feeling sole responsibility for success",
        solution: "Set firm boundaries around restorative solo downtime and energetic pacing."
      }
    ],
    guidancePractices: [
      "Morning Intention Ceremony: Spend 5 minutes declaring your primary creative priority before checking external notifications.",
      "Courage Check-in: Execute one bold action per day that expands your comfort zone."
    ],
    recommendedHabits: [
      { title: "Solo Morning Visioning", category: "purpose", description: "Write 3 bold daily initiatives before starting work." },
      { title: "Physical Power Circuit", category: "physical", description: "20 minutes of dynamic movement to ground executive energy." },
      { title: "Delegation & Trust Ritual", category: "relationships", description: "Empower one peer or teammate without micromanaging." }
    ]
  },
  2: {
    number: 2,
    title: "The Diplomat & Peacemaker",
    archetype: "The Intuitive Harmonizer",
    vibration: "Cooperation, Intuition, Empathy, and Sacred Balance",
    element: "Water",
    rulingPlanet: "Moon 🌙",
    gemstone: "Moonstone & Pearl",
    strengths: [
      "Deep emotional intelligence and acute sensitivity to subtle group dynamics",
      "Mastery of negotiation, soothing conflict, and cultivating genuine trust",
      "Profound intuitive insights into unspoken human feelings and spiritual timing"
    ],
    challenges: [
      {
        obstacle: "Tendency to suppress personal desires to keep external peace",
        solution: "Recognize that honest boundaries foster true long-term harmony."
      },
      {
        obstacle: "Over-absorption of surrounding emotional environments",
        solution: "Engage in energetic cleansing rituals like saltwater baths or outdoor walks."
      }
    ],
    guidancePractices: [
      "Boundary Reflection: Practice saying a gentle, empowered 'No' when your cup is full.",
      "Dual-Log Journaling: Note what you felt for others vs. what your own inner voice desires."
    ],
    recommendedHabits: [
      { title: "Energetic Decompression", category: "mindfulness", description: "15-minute quiet meditation to release borrowed emotions." },
      { title: "Heart-Centered Dialogue", category: "relationships", description: "Express one authentic need clearly to a loved one." },
      { title: "Harmonious Sanctuary Reset", category: "creative", description: "Tidy and arrange your physical space for aesthetic calm." }
    ]
  },
  3: {
    number: 3,
    title: "The Creative Communicator",
    archetype: "The Joyful Alchemist",
    vibration: "Self-Expression, Optimism, Artistry, and Magnetic Inspiration",
    element: "Air",
    rulingPlanet: "Jupiter ♃",
    gemstone: "Citrine & Yellow Topaz",
    strengths: [
      "Radiant self-expression through storytelling, voice, writing, or visual arts",
      "Uplifting optimism that illuminates possibilities in challenging circumstances",
      "Magnetic charm that effortlessly connects diverse people and sparks laughter"
    ],
    challenges: [
      {
        obstacle: "Scattering energy across too many exciting ideas without completion",
        solution: "Anchor your creative sparks with structured daily execution blocks."
      },
      {
        obstacle: "Masking underlying vulnerability behind a cheerful facade",
        solution: "Allow yourself to express raw, authentic emotion without fear of judgment."
      }
    ],
    guidancePractices: [
      "Uncensored Creative Outlet: Spend 15 minutes daily writing, painting, or singing freely.",
      "Focused Trinity Rule: Choose only 3 main goals each day to complete before brainstorming next."
    ],
    recommendedHabits: [
      { title: "Morning Stream-of-Consciousness Writing", category: "creative", description: "Freewrite 3 pages without editing or filtering." },
      { title: "Uplifting Connection Call", category: "relationships", description: "Share authentic joy or humor with a friend." },
      { title: "Creative Completion Sprint", category: "purpose", description: "Finish one small creative project before starting new ones." }
    ]
  },
  4: {
    number: 4,
    title: "The Master Builder",
    archetype: "The Grounded Pillar",
    vibration: "Stability, Discipline, Methodical Mastery, and Lasting Legacy",
    element: "Earth",
    rulingPlanet: "Uranus ♅ / Saturn ♄",
    gemstone: "Green Jade & Garnet",
    strengths: [
      "Unwavering work ethic, reliability, and precision in building solid foundations",
      "Practical problem-solving that turns abstract ideas into systematic realities",
      "Steadfast loyalty and dedication to long-term security for family and community"
    ],
    challenges: [
      {
        obstacle: "Rigidity or resistance to unexpected shifts in cosmic timing",
        solution: "Cultivate flexibility by leaning into spontaneous micro-adventures."
      },
      {
        obstacle: "Overworking and neglecting restorative play and physical ease",
        solution: "Schedule play time with the same commitment as business milestones."
      }
    ],
    guidancePractices: [
      "Flexibility Routine: Incorporate fluid stretching or yoga to release physical stiffness.",
      "Gratitude for Progress: Celebrate foundational wins instead of focusing solely on remaining tasks."
    ],
    recommendedHabits: [
      { title: "Structured Daily Foundation Review", category: "purpose", description: "Organize tasks into clear 3-step prioritized action plans." },
      { title: "Earthing & Body Alignment", category: "physical", description: "Walk barefoot on grass or do grounding deep stretches." },
      { title: "Spontaneous Delight Block", category: "mindfulness", description: "Dedicating 30 minutes to unplanned leisure activity." }
    ]
  },
  5: {
    number: 5,
    title: "The Freedom Seeker",
    archetype: "The Cosmic Adventurer",
    vibration: "Versatility, Adaptability, Sensorial Curiosity, and Radical Freedom",
    element: "Air",
    rulingPlanet: "Mercury ☿",
    gemstone: "Aquamarine & Turquoise",
    strengths: [
      "Dynamic adaptability that thrives amidst rapid evolution and change",
      "Infectious enthusiasm for exploring new cultures, ideas, and experiences",
      "Brilliant resourcefulness in navigating unexpected crossroads effortlessly"
    ],
    challenges: [
      {
        obstacle: "Restlessness or fleeing commitments when routine settles in",
        solution: "Find freedom within structure by reimagining daily rituals creatively."
      },
      {
        obstacle: "Over-indulgence or sensory overload from chasing constant novelty",
        solution: "Practice mindful anchoring to process rich experiences deeply."
      }
    ],
    guidancePractices: [
      "Sensory Grounding Pause: Take 5 deep breaths focusing on 5 physical senses during busy days.",
      "Curiosity Exploration: Learn one new insight or explore a novel route every day."
    ],
    recommendedHabits: [
      { title: "Daily Novel Exploration", category: "creative", description: "Read, listen, or travel via an unfamiliar path." },
      { title: "Breath & Movement Reset", category: "physical", description: "High-energy cardio or dance to channel restless vitality." },
      { title: "Mindful Commitment Anchor", category: "purpose", description: "Fulfill one core promise consistently for 7 days." }
    ]
  },
  6: {
    number: 6,
    title: "The Nurturing Guardian",
    archetype: "The Compassionate Protector",
    vibration: "Harmony, Responsibility, Unconditional Love, and Healing Space",
    element: "Earth / Water",
    rulingPlanet: "Venus ♀",
    gemstone: "Rose Quartz & Emerald",
    strengths: [
      "Profound capacity for warmth, healing presence, and uplifting home atmosphere",
      "Deep sense of duty, protective instinct, and guidance for family and friends",
      "Innate aesthetic sense for creating beauty, comfort, and restorative spaces"
    ],
    challenges: [
      {
        obstacle: "Over-extending support to the point of co-dependency or self-neglect",
        solution: "Prioritize self-care as the non-negotiable prerequisite for helping others."
      },
      {
        obstacle: "Expecting perfection from loved ones or carrying excessive guilt",
        solution: "Embrace life's beautiful imperfections with gentle forgiveness."
      }
    ],
    guidancePractices: [
      "Self-Love Sanctuary: Dedicate 20 minutes daily exclusively to your own nurturing pleasure.",
      "Unconditional Acceptance Mantra: Repeat 'I am enough, and I support with free love.'"
    ],
    recommendedHabits: [
      { title: "Self-Nurturing Ritual", category: "mindfulness", description: "Enriching bath, skincare, or quiet tea time solo." },
      { title: "Nourishing Environment Touch", category: "creative", description: "Bring fresh greenery, light candles, or declutter a cozy corner." },
      { title: "Compassionate Boundary Check", category: "relationships", description: "Refuse extra burdens that drain your core energy reserves." }
    ]
  },
  7: {
    number: 7,
    title: "The Seeker & Mystic",
    archetype: "The Intuitive Truth-Seeker",
    vibration: "Wisdom, Analysis, Spiritual Discovery, and Inner Sanctuary",
    element: "Water / Ether",
    rulingPlanet: "Neptune ♆",
    gemstone: "Amethyst & Lapis Lazuli",
    strengths: [
      "Penetrating analytical mind paired with profound spiritual intuition",
      "Innate thirst for uncovering deeper esoteric truths, philosophy, and science",
      "Quiet dignity, self-reliance, and ability to tap into universal consciousness"
    ],
    challenges: [
      {
        obstacle: "Tendency to isolate emotionally or retreat into skepticism",
        solution: "Bridge your inner mystical world with warm human connection."
      },
      {
        obstacle: "Overthinking simple decisions through endless intellectual analysis",
        solution: "Trust your gut instinct's immediate spark before over-analyzing."
      }
    ],
    guidancePractices: [
      "Solitude Sanctuary: Spend 20 minutes in quiet meditation or silent contemplation daily.",
      "Intuitive Journaling: Record dreams, synchronicities, and sudden insights."
    ],
    recommendedHabits: [
      { title: "Silent Contemplation Meditation", category: "mindfulness", description: "20 minutes of silent seated breath awareness." },
      { title: "Esoteric Study & Reading", category: "purpose", description: "Immerse in philosophy, spiritual texts, or science." },
      { title: "Nature Communion Walk", category: "physical", description: "Walk in nature without digital devices to recharge your aura." }
    ]
  },
  8: {
    number: 8,
    title: "The Power Manifestor",
    archetype: "The Cosmic CEO",
    vibration: "Abundance, Authority, Financial Mastery, and Karma in Action",
    element: "Earth / Fire",
    rulingPlanet: "Saturn ♄",
    gemstone: "Tiger's Eye & Black Onyx",
    strengths: [
      "Natural executive vision, strategic acumen, and material manifestation prowess",
      "Resilience in converting obstacles into lucrative stepping stones for growth",
      "Innate capacity to handle large responsibility and lead significant projects"
    ],
    challenges: [
      {
        obstacle: "Equating personal worth solely with material success or status",
        solution: "Align financial goals with higher spiritual service and heart integrity."
      },
      {
        obstacle: "Struggling with control or authority conflicts in personal life",
        solution: "Practice gentle surrender and empower others to share ownership."
      }
    ],
    guidancePractices: [
      "Abundance Alignment: Evaluate if daily actions align with spiritual values and financial growth.",
      "Power Pacing: Practice deep breathing to transform executive tension into calm poise."
    ],
    recommendedHabits: [
      { title: "Daily Abundance & Wealth Audit", category: "purpose", description: "Review financial goals with gratitude and strategic clarity." },
      { title: "High-Intensity Energy Release", category: "physical", description: "Vigorous workout to channel intense drive productively." },
      { title: "Heart-Centered Giving", category: "relationships", description: "Offer mentorship or philanthropic aid to someone rising up." }
    ]
  },
  9: {
    number: 9,
    title: "The Universal Humanitarian",
    archetype: "The Compassionate Sage",
    vibration: "Completion, Global Wisdom, Selfless Service, and Divine Release",
    element: "Fire / Ether",
    rulingPlanet: "Mars ♂ / Jupiter ♃",
    gemstone: "Selenite & Moldavite",
    strengths: [
      "Expansive global empathy and vision for uplifting humanity as a whole",
      "Profound artistic wisdom incorporating lessons from all previous life path energies",
      "Natural grace in letting go of outgrown chapters to welcome higher evolution"
    ],
    challenges: [
      {
        obstacle: "Holding onto past disappointments or carrying the world's sorrows",
        solution: "Practice forgiveness rituals to release heavy energetic attachments."
      },
      {
        obstacle: "Feeling misunderstood or detached in superficial daily interactions",
        solution: "Focus on meaningful, soulful connections that honor your breadth."
      }
    ],
    guidancePractices: [
      "Sacred Release Ritual: Write down expired worries or resentments and safely burn/erase them.",
      "Humanitarian Intent: Perform one secret act of kindness every single day."
    ],
    recommendedHabits: [
      { title: "Forgiveness & Surrender Breathwork", category: "mindfulness", description: "Exhale past energy and invite fresh divine light." },
      { title: "Altruistic Outreach / Service", category: "relationships", description: "Contribute time or positive energy to a global cause." },
      { title: "Soulful Creative Expression", category: "creative", description: "Channel cosmic wisdom into music, art, or writing." }
    ]
  },
  11: {
    number: 11,
    title: "The Master Intuitive",
    archetype: "The Spiritual Illuminator",
    vibration: "High-Voltage Intuition, Spiritual Enlightenment, and Visionary Inspiration",
    element: "Ether / Air",
    rulingPlanet: "Uranus ♅",
    gemstone: "Labradorite & Clear Quartz",
    strengths: [
      "Electric intuitive channels that receive direct divine insights and prophetic flashes",
      "Magnetic ability to inspire and elevate the consciousness of large groups",
      "Bridge between material reality and higher dimensional wisdom"
    ],
    challenges: [
      {
        obstacle: "Nervous energy, anxiety, or sensory overwhelm from high spiritual voltage",
        solution: "Ground electrical body energy daily through grounding foods and earth contact."
      },
      {
        obstacle: "Imposter syndrome or fear of standing out as a spiritual channel",
        solution: "Trust that your cosmic gifts were chosen for this specific incarnation."
      }
    ],
    guidancePractices: [
      "Auric Shielding Visualization: Envision a radiant sphere of white light protecting your energy field.",
      "Intuitive Channeling Journal: Record immediate flashes of insight before logic interferes."
    ],
    recommendedHabits: [
      { title: "Auric Protection & Grounding", category: "mindfulness", description: "10 minutes grounding breath and energetic shield." },
      { title: "Intuitive Download Capture", category: "creative", description: "Notebook write-up of sudden cosmic flashes and dreams." },
      { title: "Nervous System Soothing", category: "physical", description: "Magnesium bath, gentle yin yoga, or walking in nature." }
    ]
  },
  22: {
    number: 22,
    title: "The Master Architect",
    archetype: "The Cosmic Builder",
    vibration: "Grand Vision, Unmatched Manifestation Power, and Legacy for Humanity",
    element: "Earth / Ether",
    rulingPlanet: "Pluto ♇ / Saturn ♄",
    gemstone: "Platinum & Moldavite",
    strengths: [
      "Unique capacity to manifest vast, world-changing projects into tangible reality",
      "Harmonious blend of 11's high intuition with 4's practical discipline",
      "Mastery of complex systemic structures that serve generations to come"
    ],
    challenges: [
      {
        obstacle: "Overwhelmed by the enormous magnitude of inner visions and potential",
        solution: "Deconstruct monumental goals into manageable, step-by-step milestones."
      },
      {
        obstacle: "Fear of failure or self-imposed pressure to be superhuman",
        solution: "Remember that every grand structure is built one brick at a time."
      }
    ],
    guidancePractices: [
      "Blueprint Deconstruction: Break your largest annual vision into quarterly tangible builds.",
      "Master Pacing: Ensure rest cycles are non-negotiable within master build schedules."
    ],
    recommendedHabits: [
      { title: "Master Blueprint Mapping", category: "purpose", description: "Review long-term legacy strategy and daily execution step." },
      { title: "Systematic Focus Sprint", category: "purpose", description: "90 minutes of uninterrupted deep focus work." },
      { title: "Holistic Energy Recharge", category: "physical", description: "Restorative sleep protocol and dense organic nutrition." }
    ]
  },
  33: {
    number: 33,
    title: "The Master Teacher",
    archetype: "The Divine Healer",
    vibration: "Universal Compassion, Spiritual Mastery, and Selfless Illumination",
    element: "Water / Ether",
    rulingPlanet: "Sun ☀️ / Venus ♀",
    gemstone: "Diamond & Sapphire",
    strengths: [
      "Highest frequency of altruistic love, healing presence, and spiritual wisdom",
      "Transformative teaching that gently awakens the highest potential in humanity",
      "Absolute devotion to uplifting souls with profound empathy and grace"
    ],
    challenges: [
      {
        obstacle: "Carrying martyr complex or sacrificing health for others' ascension",
        solution: "Anchor yourself in divine boundaries: your presence is the gift."
      },
      {
        obstacle: "Dreading failure to live up to the intense Master vibration",
        solution: "Accept human limitations with loving self-compassion."
      }
    ],
    guidancePractices: [
      "Universal Love Transmission: Send peaceful loving-kindness blessings outward during meditation.",
      "Sacred Boundaries Practice: Honor your physical vessel as a holy temple."
    ],
    recommendedHabits: [
      { title: "Divine Love Meditation", category: "mindfulness", description: "Send healing energy to yourself and all sentient beings." },
      { title: "Wisdom Sharing & Mentorship", category: "relationships", description: "Guide another soul with unconditional encouragement." },
      { title: "Sacred Temple Care", category: "physical", description: "Hydrate, rest, and nourish your physical vessel thoughtfully." }
    ]
  }
};

export function sanitizeMarkdownReading(content: string): string {
  if (!content) return '';
  let cleaned = content;
  // Replace LaTeX math blocks $$...$$ or inline $...$
  cleaned = cleaned.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  cleaned = cleaned.replace(/\$([^\$\n]+)\$/g, '$1');
  cleaned = cleaned.replace(/\\rightarrow|\\to/g, '→');
  cleaned = cleaned.replace(/\\times/g, '×');
  cleaned = cleaned.replace(/\\text\{([^}]+)\}/g, '$1');
  // Strip any lingering stray dollar signs or backslashes
  cleaned = cleaned.replace(/\$/g, '');
  cleaned = cleaned.replace(/\\([a-zA-Z]+)/g, '$1');
  return cleaned;
}

/**
 * Generate standard Markdown reading matching the prompt structure.
 */
export function formatMarkdownReading(
  profileName: string,
  birthDate: string,
  detail: LifePathDetail,
  trace: CalculationTrace,
  survey?: { focusArea?: string; energyLevel?: string; intention?: string }
): LifePathReading {
  const isMaster = detail.number === 11 || detail.number === 22 || detail.number === 33;
  const displayName = profileName || "Honored Soul";

  const markdownContent = `
# Life Path ${detail.number}: ${detail.title} 🔮
*Prepared for ${displayName} (Born ${trace.rawDate})*

---

## 1. Life Path Summary 🌟
Welcome, **${displayName}**. Your soul chose the birth date of **${trace.rawDate}** to step into the vibration of **Life Path ${detail.number}** — *${detail.archetype}*. 

### Calculation Breakdown 🔢
* **Step-by-Step Reduction**: Month ${trace.month} (reduces to ${trace.monthReduced}) + Day ${trace.day} (reduces to ${trace.dayReduced}) + Year ${trace.year} (reduces to ${trace.yearReduced})
* **Final Sum**: ${trace.monthReduced} + ${trace.dayReduced} + ${trace.yearReduced} = ${trace.stepSum} → **Life Path ${detail.number}**

The primary vibration of **Life Path ${detail.number}** radiates **${detail.vibration}**. Governed by **${detail.rulingPlanet}** and aligned with the element of **${detail.element}**, your energy naturally draws sacred insights and opportunities when aligned with your authentic path. Resonating with **${detail.gemstone}**, your vibration is crafted to anchor light, purpose, and mastery.

${survey?.focusArea ? `> **Current Cosmic Focus**: You noted a strong focus on *${survey.focusArea}*. Life Path ${detail.number} offers unique gifts to transform your current energy (*${survey.energyLevel || 'seeking alignment'}*) into grounded breakthrough success.` : ''}

---

## 2. Core Strengths & Superpowers 💪
Your Life Path bestows three distinct natural talents that serve as your cosmic toolkit:

* ⚡ **${detail.strengths[0]}**
* 🌌 **${detail.strengths[1]}**
* 💎 **${detail.strengths[2]}**

When you lean into these superpowers, obstacle barriers transform naturally into stepping stones.

---

## 3. Growth Areas & Challenges 🏔️
Every sacred vibration presents opportunities for soul expansion. Here are your primary growth areas:

### 1. ${detail.challenges[0].obstacle}
* **Cosmic Remedy**: ${detail.challenges[0].solution}

### 2. ${detail.challenges[1].obstacle}
* **Cosmic Remedy**: ${detail.challenges[1].solution}

---

## 4. Actionable Cosmic Guidance 🧘
Integrate these daily practices to ground and elevate your **Life Path ${detail.number}** vibration:

* 🧘‍♂️ **Practice 1**: ${detail.guidancePractices[0]}
* 🌟 **Practice 2**: ${detail.guidancePractices[1]}
${survey?.intention ? `* ✨ **Your Personal Intention Anchor**: "${survey.intention}"` : ''}

---
*May your daily path be illuminated with clarity, strength, and divine joy.* 🕊️
`.trim();

  return {
    lifePathNumber: detail.number,
    isMasterNumber: isMaster,
    title: detail.title,
    archetype: detail.archetype,
    element: detail.element,
    rulingPlanet: detail.rulingPlanet,
    gemstone: detail.gemstone,
    markdownContent,
    summary: `Life Path ${detail.number} (${detail.title}) embodies ${detail.vibration}.`,
    strengths: detail.strengths,
    challenges: detail.challenges,
    guidancePractices: detail.guidancePractices,
    generatedAt: new Date().toISOString(),
  };
}

export interface CompatibilityInsight {
  affinityScore: number;
  dynamic: string;
  strengths: string[];
  challenges: string[];
  remedy: string;
  summary: string;
}

export function getCompatibilityInsights(lp1: LifePathNumber, lp2: LifePathNumber): CompatibilityInsight {
  const detail1 = LIFE_PATH_DETAILS[lp1] || LIFE_PATH_DETAILS[1];
  const detail2 = LIFE_PATH_DETAILS[lp2] || LIFE_PATH_DETAILS[1];

  let affinityScore = 80;

  // Basic numeric harmony rules
  if (lp1 === lp2) affinityScore = 96; // Same number = high resonance
  else if (
    (lp1 % 2 !== 0 && lp2 % 2 !== 0) || // Odds blend well with odds (Fire/Air energy)
    (lp1 % 2 === 0 && lp2 % 2 === 0)    // Evens blend well with evens (Earth/Water energy)
  ) {
    affinityScore = 92;
  } else if ((lp1 === 1 && lp2 === 8) || (lp1 === 8 && lp2 === 1)) {
    affinityScore = 85; // Power couple, though challenging
  } else if ((lp1 === 2 && lp2 === 7) || (lp1 === 7 && lp2 === 2)) {
    affinityScore = 94; // Deep soul connection
  } else if (lp1 === 9 || lp2 === 9) {
    affinityScore = 88; // 9 is highly adaptable
  } else if (lp1 === 11 || lp2 === 11 || lp1 === 22 || lp2 === 22 || lp1 === 33 || lp2 === 33) {
    affinityScore = 86; // Master numbers bring intensity
  }

  const isDynamicMatch = affinityScore > 90;
  
  const strengths = [
    `Combines ${detail1.archetype}'s natural "${detail1.strengths[0]}" with ${detail2.archetype}'s "${detail2.strengths[0]}".`,
    isDynamicMatch 
      ? 'A highly synergistic vibration that amplifies mutual understanding and shared values.'
      : 'Brings diverse, complementary perspectives allowing for incredible growth if balanced.',
  ];

  const challenges = [
    isDynamicMatch 
      ? 'Can sometimes become an echo chamber; remember to seek outside perspectives.'
      : 'Differing approaches to conflict resolution and daily pacing.',
    `Tension may arise between ${detail1.title}'s need for ${detail1.element} energy and ${detail2.title}'s need for ${detail2.element} energy.`
  ];

  const dynamic = isDynamicMatch 
    ? 'Harmonious & Synchronized' 
    : 'Friction-Fueled Growth';

  const remedy = isDynamicMatch 
    ? `Maintain healthy boundaries so you don't lose yourselves in the powerful resonance of the ${lp1}-${lp2} bond.`
    : `Practice active patience. When ${lp1} pushes forward, ${lp2} should ground the energy. Validate each other's fundamentally different worldviews.`;

  const summary = `Life Path ${lp1} (${detail1.archetype}) paired with Life Path ${lp2} (${detail2.archetype}) creates a ${affinityScore}% energetic harmony score. This is a pairing of ${detail1.element} and ${detail2.element} elements, offering a unique energetic synastry.`;

  return {
    affinityScore,
    dynamic,
    strengths,
    challenges,
    remedy,
    summary,
  };
}

export interface ReadingInsightCard {
  id: string;
  source: import('../types').ReportBlockSource;
  title: string;
  category: string;
  iconName: string;
  summaryText: string;
  fullMarkdown: string;
  speechText: string;
  libraryLink?: {
    tab: 'directory' | 'name' | 'compatibility';
    number?: LifePathNumber;
    label: string;
  };
}

export function getStructuredReadingCards(
  reading: LifePathReading,
  trace: CalculationTrace,
  profileName: string,
  birthDate: string
): ReadingInsightCard[] {
  const detail = LIFE_PATH_DETAILS[reading.lifePathNumber] || LIFE_PATH_DETAILS[1];
  const name = profileName || 'Honored Soul';
  const formattedDate = formatBirthDate(birthDate);

  const cards: ReadingInsightCard[] = [
    {
      id: 'card_summary',
      source: 'reading_summary',
      title: `Life Path ${detail.number}: ${detail.title}`,
      category: 'Soul Blueprint & Summary',
      iconName: 'Sparkles',
      summaryText: `${detail.title} (${detail.archetype}) radiating ${detail.vibration}.`,
      fullMarkdown: `**Life Path ${detail.number}: ${detail.title}** (${detail.archetype})\n\n` +
        `Welcome, **${name}**. Born on **${formattedDate}**, your soul steps into the sacred frequency of Life Path ${detail.number}.\n\n` +
        `**Vibration**: ${detail.vibration}\n\n` +
        `**Sacred Alignment**: Governed by **${detail.rulingPlanet}**, animated by the element of **${detail.element}**, and grounded by **${detail.gemstone}**.\n\n` +
        `**Pythagorean Reduction**: Month ${trace.month} (→ ${trace.monthReduced}) + Day ${trace.day} (→ ${trace.dayReduced}) + Year ${trace.year} (→ ${trace.yearReduced}) = ${trace.stepSum} → **Life Path ${detail.number}**.`,
      speechText: `Welcome ${name}. Born on ${formattedDate}, your soul steps into the sacred frequency of Life Path ${detail.number}, ${detail.title}, known as ${detail.archetype}. Your vibration radiates ${detail.vibration}. You are governed by ${detail.rulingPlanet} and aligned with the element of ${detail.element}.`,
      libraryLink: {
        tab: 'directory',
        number: detail.number,
        label: `Research Life Path ${detail.number} in Number Library`,
      },
    },
    {
      id: 'card_strengths',
      source: 'reading_strengths',
      title: 'Cosmic Superpowers & Natural Talents',
      category: 'Core Strengths',
      iconName: 'Zap',
      summaryText: detail.strengths.join(' • '),
      fullMarkdown: `### ⚡ Core Cosmic Superpowers for Life Path ${detail.number}\n\n` +
        detail.strengths.map((s, i) => `* **Superpower ${i + 1}**: ${s}`).join('\n\n') +
        `\n\nWhen you intentionally lean into these three divine gifts, unexpected doors open and obstacle barriers dissolve naturally into stepping stones.`,
      speechText: `Here are your three core cosmic superpowers as Life Path ${detail.number}. First: ${detail.strengths[0]}. Second: ${detail.strengths[1]}. Third: ${detail.strengths[2]}. When you lean into these gifts, obstacles naturally transform into stepping stones.`,
      libraryLink: {
        tab: 'directory',
        number: detail.number,
        label: `Explore Number ${detail.number} Mastery in Encyclopedia`,
      },
    },
    {
      id: 'card_challenges',
      source: 'reading_challenges',
      title: 'Growth Lessons & Sacred Remedies',
      category: 'Karmic Growth & Shadow',
      iconName: 'ShieldCheck',
      summaryText: detail.challenges.map((c) => c.obstacle).join('; '),
      fullMarkdown: `### 🏔️ Karmic Growth Lessons & Shadow Work\n\n` +
        detail.challenges
          .map(
            (c, i) =>
              `#### Lesson ${i + 1}: ${c.obstacle}\n* **Cosmic Remedy**: ${c.solution}`
          )
          .join('\n\n'),
      speechText: `Every sacred vibration comes with soul growth lessons. Lesson one: ${detail.challenges[0].obstacle}. The cosmic remedy is: ${detail.challenges[0].solution}. Lesson two: ${detail.challenges[1].obstacle}. The cosmic remedy is: ${detail.challenges[1].solution}.`,
      libraryLink: {
        tab: 'directory',
        number: detail.number,
        label: `View Shadow Codex for #${detail.number}`,
      },
    },
    {
      id: 'card_synergy',
      source: 'reading_synergy',
      title: 'Vibrational Synergy: Element, Planet & Gemstone',
      category: 'Cosmic Correspondences',
      iconName: 'Gem',
      summaryText: `Element: ${detail.element} | Ruler: ${detail.rulingPlanet} | Gemstone: ${detail.gemstone}`,
      fullMarkdown: `### 🔮 Cosmic Correspondences & Elemental Alchemy\n\n` +
        `* 🌌 **Ruling Celestial Body**: **${detail.rulingPlanet}** — Guides your energetic drive and psychological destiny.\n` +
        `* 🌿 **Cosmic Element**: **${detail.element}** — Grounds your instinctual response to changes in environment.\n` +
        `* 💎 **Sacred Gemstone**: **${detail.gemstone}** — Resonates with your energy field to amplify mental clarity, purpose, and spiritual shielding.\n` +
        `* ✨ **Primary Core Archetype**: **${detail.archetype}**`,
      speechText: `Your cosmic correspondences as Life Path ${detail.number} include your ruling celestial body, ${detail.rulingPlanet}, and the element of ${detail.element}. Your sacred resonant gemstone is ${detail.gemstone}, which anchors spiritual shielding and mental clarity.`,
      libraryLink: {
        tab: 'directory',
        number: detail.number,
        label: `Deep Dive Correspondences in Library`,
      },
    },
    {
      id: 'card_guidance',
      source: 'reading_guidance',
      title: 'Daily Sadhana & Practical Alignment Rituals',
      category: 'Actionable Guidance',
      iconName: 'Compass',
      summaryText: detail.guidancePractices.join(' | '),
      fullMarkdown: `### 🧘 Daily Alignment Practices for Life Path ${detail.number}\n\n` +
        detail.guidancePractices.map((p, i) => `* 🌟 **Sacred Habit ${i + 1}**: ${p}`).join('\n\n') +
        `\n\n*Consistency in micro-rituals creates lasting vibrational transformation.*`,
      speechText: `Here is your daily actionable cosmic guidance. Practice one: ${detail.guidancePractices[0]}. Practice two: ${detail.guidancePractices[1]}. Integrating these micro-habits grounds your highest vibration.`,
      libraryLink: {
        tab: 'directory',
        number: detail.number,
        label: `Discover Habit Rituals for #${detail.number}`,
      },
    },
    {
      id: 'card_synastry',
      source: 'reading_synastry',
      title: 'Cosmic Synastry & Relationship Dynamics',
      category: 'Love & Compatibility',
      iconName: 'Heart',
      summaryText: `Vibrational harmony dynamics for ${detail.archetype}`,
      fullMarkdown: `### 💖 Relationship Synastry for Life Path ${detail.number} (${detail.archetype})\n\n` +
        `As **Life Path ${detail.number}**, your relationship dynamics flourish when your partner honors your need for **${detail.vibration.toLowerCase()}**.\n\n` +
        `* 💫 **Soul Magnetism**: You communicate through the energetic language of **${detail.element}**.\n` +
        `* 🤝 **Relationship Superpower**: ${detail.strengths[1]}.\n` +
        `* 🌊 **Harmonious Pairs**: Resonates deeply with complementary elemental frequencies in our Synastry Matcher.`,
      speechText: `In relationships and soul synastry, Life Path ${detail.number} thrives when partners honor your core essence. You communicate through the language of ${detail.element} and offer profound loyalty and understanding.`,
      libraryLink: {
        tab: 'compatibility',
        label: `Open Cosmic Compatibility Matcher`,
      },
    },
  ];

  return cards;
}
