import { LifePathNumber } from '../types';

export interface NumberMeaningData {
  number: LifePathNumber;
  title: string;
  archetype: string;
  element: string;
  rulingBody: string;
  crystals: string[];
  colors: string[];
  keywords: string[];
  generalMeaning: string;
  expressionMeaning: {
    title: string;
    summary: string;
    talents: string[];
    careerPaths: string[];
    workStyle: string;
  };
  soulUrgeMeaning: {
    title: string;
    summary: string;
    heartDesire: string;
    relationshipNeeds: string[];
    secretFear: string;
  };
  personalityMeaning: {
    title: string;
    summary: string;
    firstImpression: string;
    styleAndVibe: string;
  };
  shadowAndGrowth: {
    shadowAspect: string;
    growthLesson: string;
    cosmicRemedy: string;
  };
  powerAffirmation: string;
  bestMatches: LifePathNumber[];
}

export const NUMBER_INSIGHTS: Record<LifePathNumber, NumberMeaningData> = {
  1: {
    number: 1,
    title: 'The Sovereign Pioneer',
    archetype: 'The Original Leader & Innovator',
    element: 'Fire 🔥',
    rulingBody: 'The Sun ☀️',
    crystals: ['Garnet', 'Ruby', 'Carnelian', 'Sunstone'],
    colors: ['Crimson Red', 'Solar Gold', 'Warm Amber'],
    keywords: ['Leadership', 'Independence', 'Originality', 'Initiative', 'Courage'],
    generalMeaning:
      'Number 1 is the primal spark of creation, the seed of individuality, and the urge to step into unchartered territory. It represents self-reliance, willpower, and the drive to stand alone at the helm.',
    expressionMeaning: {
      title: 'Expression #1: The Born Trailblazer',
      summary:
        'Your destiny is to lead, invent, and pioneer. You are gifted with original executive thinking, immense stamina, and the courage to execute ideas that others only dream about.',
      talents: ['Innovative conceptualization', 'Decisive execution under pressure', 'Independent problem solving'],
      careerPaths: ['Entrepreneur & Founder', 'Executive Director', 'Innovator / Inventor', 'Creative Director', 'Solo Specialist'],
      workStyle: 'Self-directed, visionary, works best with full creative autonomy and ownership.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #1: The Urge for Autonomy & Mastery',
      summary:
        'At your core, your soul craves total independence and the freedom to stand on your own two feet. You are motivated by reaching personal pinnacles of excellence without being micromanaged.',
      heartDesire: 'To be first, to be self-sufficient, and to leave an undeniable mark of originality upon the world.',
      relationshipNeeds: ['Respect for personal space & autonomy', 'A partner who encourages your ambitious pursuits', 'Mutual independence without clinginess'],
      secretFear: 'Being dependent on others, feeling controlled, or fading into the background.',
    },
    personalityMeaning: {
      title: 'Personality #1: The Confident Authority',
      summary:
        'To the outside world, you radiate self-assurance, decisiveness, and commanding presence. People naturally look to you when someone needs to take charge.',
      firstImpression: 'Dynamic, sharp, self-confident, and assertive.',
      styleAndVibe: 'Clean, bold, tailored silhouettes with strong, eye-catching focal points.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Impatience, bossiness, intolerance of slower paces, or excessive stubbornness.',
      growthLesson: 'True leadership elevates others rather than dominating them; listen before taking command.',
      cosmicRemedy: 'Practice active listening and celebrate the unique contributions of your teammates.',
    },
    powerAffirmation: 'I stand in the sovereign light of my authentic power and forge bold new pathways with grace.',
    bestMatches: [3, 5, 7],
  },
  2: {
    number: 2,
    title: 'The Sacred Harmonizer',
    archetype: 'The Diplomat & Intuitive Peacemaker',
    element: 'Water 💧',
    rulingBody: 'The Moon 🌙',
    crystals: ['Moonstone', 'Pearl', 'Aquamarine', 'Celestite'],
    colors: ['Lunar Silver', 'Soft Sage', 'Sky Blue'],
    keywords: ['Harmony', 'Diplomacy', 'Intuition', 'Partnership', 'Gentleness'],
    generalMeaning:
      'Number 2 is the sacred vibration of balance, duality, and union. It is the quiet power that weaves connection, senses subtle energies, and heals divisions through patient listening and compassion.',
    expressionMeaning: {
      title: 'Expression #2: The Intuitive Mediator',
      summary:
        'Your destiny is to bring harmony, bridge divides, and foster co-creative alliances. You excel at subtle negotiation, aesthetic beauty, and discerning what remains unsaid in any room.',
      talents: ['Empathic communication', 'High emotional intelligence', 'Aesthetic design & balance'],
      careerPaths: ['Diplomat & Mediator', 'Counselor / Psychotherapist', 'Artisan & Designer', 'Strategic Partner / Co-Founder', 'Human Resources Director'],
      workStyle: 'Collaborative, detail-conscious, thrives in supportive, peaceful, and cooperative environments.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #2: The Urge for Loving Connection',
      summary:
        'Your soul yearns for deep, harmonious companionship and peaceful surroundings. You feel most fulfilled when sharing life and accomplishments with a cherished partner or soul tribe.',
      heartDesire: 'To love and be truly understood, and to nurture mutual peace in all spheres of life.',
      relationshipNeeds: ['Gentle reassurance and emotional validation', 'Harmonious, peaceful living spaces', 'Deep loyalty and open-hearted intimacy'],
      secretFear: 'Abandonment, harsh conflict, or feeling unnoticed and unappreciated.',
    },
    personalityMeaning: {
      title: 'Personality #2: The Gentle Sanctuary',
      summary:
        'Others perceive you as approachable, warm, gentle, and exquisitely considerate. You have an inviting aura that puts people instantly at ease.',
      firstImpression: 'Kind-hearted, diplomatic, graceful, and a wonderful listener.',
      styleAndVibe: 'Soft textures, flowing garments, soothing natural earth and pastel tones.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Over-sensitivity, people-pleasing, passive-aggressive withdrawal, or fear of speaking truth.',
      growthLesson: 'Honoring your own emotional boundaries is essential; saying no is an act of self-respect.',
      cosmicRemedy: 'Daily boundary affirmation: "My needs are valid, and I express them with calm clarity."',
    },
    powerAffirmation: 'I am a peaceful anchor of divine harmony, trusting my intuition and honoring my sacred boundaries.',
    bestMatches: [2, 4, 6, 8],
  },
  3: {
    number: 3,
    title: 'The Luminous Alchemist',
    archetype: 'The Creative Catalyst & Joy Bringer',
    element: 'Fire / Air 🎨',
    rulingBody: 'Jupiter ♃',
    crystals: ['Citrine', 'Topaz', 'Amber', 'Ametrine'],
    colors: ['Sunburst Yellow', 'Coral', 'Rose Gold'],
    keywords: ['Creativity', 'Self-Expression', 'Joy', 'Optimism', 'Magnetism'],
    generalMeaning:
      'Number 3 represents the holy trinity of creation: mind, body, and spirit. It is the vibration of joyful expression, magnetic charm, artistic genius, and infectious optimism that uplifts everyone it touches.',
    expressionMeaning: {
      title: 'Expression #3: The Master Communicator',
      summary:
        'Your life purpose is to inspire, entertain, and uplift the collective through creative expression. Whether through writing, speaking, art, or performing, you possess an innate gift of magnetic storytelling.',
      talents: ['Charismatic communication', 'Artistic synthesis & storytelling', 'Spontaneous creative problem-solving'],
      careerPaths: ['Writer & Author', 'Visual Artist & Graphic Designer', 'Keynote Speaker & Actor', 'Marketing Strategist', 'Creative Producer'],
      workStyle: 'Dynamic, expressive, thriving on playful ideation, brainstorming, and flexible freedom.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #3: The Urge for Authentic Expression',
      summary:
        'Your inner heart desires nothing more than to express your authentic creative feelings and spark joy in others. You suffer when forced into dull monotony or emotional suppression.',
      heartDesire: 'To live colorfully, laugh deeply, and share your unique artistic voice with the universe.',
      relationshipNeeds: ['Playfulness and shared laughter', 'A partner who cherishes your artistic quirks', 'Freedom of emotional self-expression'],
      secretFear: 'Being silenced, trapped in mundane routine, or facing harsh creative criticism.',
    },
    personalityMeaning: {
      title: 'Personality #3: The Radiant Spark',
      summary:
        'You enter a room and bring warmth and lightness. People perceive you as charming, witty, fashionable, and remarkably engaging.',
      firstImpression: 'Vibrant, witty, cheerful, and sparkling with creative flair.',
      styleAndVibe: 'Expressive colors, stylish statement jewelry, playful patterns, and luminous accents.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Scattered energy, starting many projects without finishing, superficiality, or moodiness.',
      growthLesson: 'Channeling your abundant creative fire through steady daily discipline creates lasting masterpieces.',
      cosmicRemedy: 'Pick one creative priority per day and bring it to complete fruition before starting the next.',
    },
    powerAffirmation: 'My authentic voice is a radiant channel of inspiration, joy, and transformative truth.',
    bestMatches: [1, 3, 5, 9],
  },
  4: {
    number: 4,
    title: 'The Master Foundation',
    archetype: 'The Architect of Order & Integrity',
    element: 'Earth 🏛️',
    rulingBody: 'Saturn ♄ / Uranus ♅',
    crystals: ['Green Jade', 'Black Tourmaline', 'Pyrite', 'Hematite'],
    colors: ['Forest Green', 'Earthy Ochre', 'Deep Slate'],
    keywords: ['Stability', 'Discipline', 'Organization', 'Integrity', 'Structure'],
    generalMeaning:
      'Number 4 represents the square, the 4 seasons, the 4 cardinal directions, and the solid cornerstone. It is the energy of patient craftsmanship, systemic order, dependability, and enduring achievements.',
    expressionMeaning: {
      title: 'Expression #4: The Enduring Builder',
      summary:
        'Your destiny is to turn chaotic ideas into solid, workable structures. You possess remarkable organizational mastery, attention to detail, and the stamina to construct foundations that last for generations.',
      talents: ['Systematic organization & planning', 'Structural analysis', 'Reliable project governance'],
      careerPaths: ['Architect & Engineer', 'Operations Director', 'Financial Analyst', 'Software Architect', 'Project Management Lead'],
      workStyle: 'Methodical, thorough, thrives with clear procedures, structured milestones, and tangible goals.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #4: The Urge for Security & Legacy',
      summary:
        'Deep within, your soul craves certainty, safety, and solid ground. You feel profound inner peace when your finances, home, and daily routines are rock solid and protected.',
      heartDesire: 'To build a secure, lasting sanctuary and be the rock of reliability for loved ones.',
      relationshipNeeds: ['Consistency and unwavering loyalty', 'Transparent plans and financial prudence', 'Shared long-term vision and grounded lifestyle'],
      secretFear: 'Chaos, financial instability, unexpected upheaval, or broken promises.',
    },
    personalityMeaning: {
      title: 'Personality #4: The Pillar of Trust',
      summary:
        'Others immediately sense your grounded nature, honesty, and dependable backbone. You are the person people turn to when they need truth and stability.',
      firstImpression: 'Composed, disciplined, trustworthy, and pragmatic.',
      styleAndVibe: 'Timeless, clean-cut, functional, and well-made classic attire in earthy neutrals.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Rigidity, resistance to change, workaholism, or becoming overly critical of spontaneous behavior.',
      growthLesson: 'Life thrives on organic flexibility; loosening control opens doors to unforeseen magic.',
      cosmicRemedy: 'Schedule dedicated blocks for spontaneous play and celebrate imperfect progress.',
    },
    powerAffirmation: 'I build my life with enduring integrity, resting upon the unshakable foundation of inner peace.',
    bestMatches: [2, 4, 8, 22],
  },
  5: {
    number: 5,
    title: 'The Catalyst of Freedom',
    archetype: 'The Cosmic Maverick & Adventurer',
    element: 'Air 🌬️',
    rulingBody: 'Mercury ☿',
    crystals: ['Aquamarine', 'Turquoise', 'Amazonite', 'Tiger Eye'],
    colors: ['Cyan Teal', 'Vibrant Orange', 'Electric Cobalt'],
    keywords: ['Freedom', 'Adventure', 'Adaptability', 'Curiosity', 'Versatility'],
    generalMeaning:
      'Number 5 sits at the exact midpoint of numbers 1-9, embodying transition, movement, dynamic freedom, and the five physical senses. It is the vibration of quick wit, adaptability, and breaking free from convention.',
    expressionMeaning: {
      title: 'Expression #5: The Dynamic Transformer',
      summary:
        'Your destiny is to be an agent of positive evolution and progressive change. You learn through direct experience, travel, and interaction with multifaceted cultures and ideas.',
      talents: ['Rapid adaptability in changing landscapes', 'Persuasive communication & promotion', 'Resourceful problem-solving on the fly'],
      careerPaths: ['Travel / Adventure Specialist', 'Journalist & Media Producer', 'Public Relations Specialist', 'Entrepreneurial Sales Lead', 'Consultant & Trend Forecaster'],
      workStyle: 'Fast-paced, versatile, thrives with diverse daily tasks, travel, and autonomy.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #5: The Urge for Boundless Exploration',
      summary:
        'Your soul suffocates in confinement or predictable routine. You are driven by a deep craving to experience the rich spectrum of life, uncover new cultures, and taste true liberty.',
      heartDesire: 'To roam freely, explore the unknown without chains, and live without regrets.',
      relationshipNeeds: ['Spacious autonomy without smothering', 'An adventurous partner who loves spontaneous exploration', 'Intellectual stimulation and varied experiences'],
      secretFear: 'Being trapped, sensory boredom, or surrendering your personal independence.',
    },
    personalityMeaning: {
      title: 'Personality #5: The Magnetic Explorer',
      summary:
        'You present an electric, youthful, and charismatic energy. People find your stories captivating and your spirit refreshingly unrestrained.',
      firstImpression: 'Spirited, engaging, open-minded, and trendy.',
      styleAndVibe: 'Eclectic, modern, flexible clothing ready for spontaneous journeys.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Restlessness, escapism, indulgence, inconsistency, or fleeing when discipline is required.',
      growthLesson: 'True freedom is discovered through internal mastery and grounded commitment, not fleeing responsibility.',
      cosmicRemedy: 'Adopt a short daily grounding ritual to anchor your physical vitality amidst rapid movements.',
    },
    powerAffirmation: 'I welcome change with open arms, navigating life’s adventures with wisdom, joy, and purpose.',
    bestMatches: [1, 3, 5, 7],
  },
  6: {
    number: 6,
    title: 'The Cosmic Nurturer',
    archetype: 'The Guardian of Love & Sanctuary',
    element: 'Earth / Water ❤️',
    rulingBody: 'Venus ♀',
    crystals: ['Rose Quartz', 'Emerald', 'Rhodonite', 'Green Aventurine'],
    colors: ['Blush Pink', 'Emerald Green', 'Warm Cream'],
    keywords: ['Compassion', 'Responsibility', 'Sanctuary', 'Beauty', 'Healing'],
    generalMeaning:
      'Number 6 is the maternal/paternal vibration of unconditional love, home sanctuary, aesthetic harmony, and service to community. It is the heart center of numerology, nurturing growth in all living things.',
    expressionMeaning: {
      title: 'Expression #6: The Devoted Caretaker',
      summary:
        'Your destiny is to heal, counsel, protect, and create restorative sanctuaries. You possess an unmatched gift for fostering emotional security and elevating aesthetics in environments.',
      talents: ['Empathetic counseling & emotional healing', 'Interior & environmental aesthetics', 'Community leadership and stewardship'],
      careerPaths: ['Healer & Medical Practitioner', 'Teacher & Counselor', 'Interior Architect / Home Stylist', 'Social Impact Founder', 'Family & Community Advocate'],
      workStyle: 'Nurturing, responsible, excels in people-centric, supportive, and harmonious team cultures.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #6: The Urge for Unconditional Love & Home',
      summary:
        'At the core of your being, you yearn to love and be loved deeply. Creating a serene, harmonious sanctuary where loved ones feel safe and cherished is your highest emotional bliss.',
      heartDesire: 'To foster beauty, provide shelter for hurting hearts, and live in domestic peace.',
      relationshipNeeds: ['Devoted emotional loyalty and appreciation', 'A calm, welcoming, aesthetically pleasing home', 'Shared family or community values'],
      secretFear: 'Family disharmony, unappreciated sacrifices, or letting down those who depend on you.',
    },
    personalityMeaning: {
      title: 'Personality #6: The Warm Protector',
      summary:
        'You give off a comforting, trustworthy, and motherly/fatherly aura. People immediately feel safe opening their hearts to you.',
      firstImpression: 'Nurturing, tasteful, reliable, and deeply empathetic.',
      styleAndVibe: 'Cozy elegance, harmonious colors, tailored comfort, and inviting warm details.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Martyr complex, boundary collapse, meddling, or judging others through perfectionist lenses.',
      growthLesson: 'You cannot pour from an empty cup; loving yourself fiercely is the first prerequisite of caring for others.',
      cosmicRemedy: 'Practice saying "I love you, but I must take care of myself first today."',
    },
    powerAffirmation: 'I radiate unconditional love, honoring my sacred boundaries while creating peace and beauty.',
    bestMatches: [2, 6, 8, 9, 33],
  },
  7: {
    number: 7,
    title: 'The Mystic Seeker',
    archetype: 'The Intuitive Philosopher & Sage',
    element: 'Water / Ether 🔮',
    rulingBody: 'Neptune ♆',
    crystals: ['Amethyst', 'Lapis Lazuli', 'Sodalite', 'Fluorite'],
    colors: ['Deep Indigo', 'Mystic Violet', 'Midnight Blue'],
    keywords: ['Wisdom', 'Analysis', 'Spiritual Truth', 'Solitude', 'Intuition'],
    generalMeaning:
      'Number 7 is the sacred number of mysticism, esoteric knowledge, scientific investigation, and quiet contemplation. It represents the bridge between analytical deduction and transcendental intuition.',
    expressionMeaning: {
      title: 'Expression #7: The Truth Discerner',
      summary:
        'Your destiny is to seek out deep underlying truths, whether through spiritual investigation, philosophy, or deep scientific analysis. You see through superficial facades effortlessly.',
      talents: ['Penetrating analytical mind', 'Spiritual intuition & metaphysical insight', 'Deep research and conceptual synthesis'],
      careerPaths: ['Philosopher & Spiritual Researcher', 'Data Scientist / Analyst', 'Psychologist / Neuroscientist', 'Author & Esoteric Scholar', 'Investigative Specialist'],
      workStyle: 'Independent, introspective, requires quiet focused study time and freedom from office drama.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #7: The Urge for Spiritual Wisdom & Stillness',
      summary:
        'Your soul thirsts for quiet contemplation, existential truth, and spiritual mastery. You require regular solitude to recharge your auric field and connect with universal consciousness.',
      heartDesire: 'To unlock the hidden mysteries of existence and achieve undisturbed inner peace.',
      relationshipNeeds: ['Respect for your non-negotiable need for solitude', 'Deep intellectual and metaphysical dialogue', 'A quiet, peaceful partner who values depth over small talk'],
      secretFear: 'Superficial noise, loss of mental clarity, or being betrayed when you open your heart.',
    },
    personalityMeaning: {
      title: 'Personality #7: The Enigmatic Scholar',
      summary:
        'You carry an air of dignified mystery, quiet intellect, and calm depth. People recognize your intellectual depth and respect your contemplative demeanor.',
      firstImpression: 'Thoughtful, perceptive, refined, and intriguingly quiet.',
      styleAndVibe: 'Subtle, sophisticated cuts, dark elegant tones, minimal accessories with profound symbolic meaning.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Emotional aloofness, cynicism, paranoia, isolation, or intellectual arrogance.',
      growthLesson: 'True wisdom is felt in the open heart, not just analyzed in the secluded intellect.',
      cosmicRemedy: 'Step outside into nature daily and share one vulnerable emotion with someone you trust.',
    },
    powerAffirmation: 'In the sanctuary of quiet stillness, I perceive divine truth and align with universal wisdom.',
    bestMatches: [1, 5, 7, 11],
  },
  8: {
    number: 8,
    title: 'The Master of Abundance',
    archetype: 'The Executive Manifestor & Sovereign',
    element: 'Earth / Fire 👑',
    rulingBody: 'Saturn ♄',
    crystals: ['Tiger’s Eye', 'Black Onyx', 'Pyrite', 'Citrine'],
    colors: ['Imperial Gold', 'Obsidian Black', 'Rich Bronze'],
    keywords: ['Abundance', 'Authority', 'Manifestation', 'Karma', 'Strategic Vision'],
    generalMeaning:
      'Number 8 is the infinity loop (∞) turned upright, representing the eternal cosmic balance of material prosperity and spiritual karma. As above, so below; it is the vibration of executive power and grand accomplishment.',
    expressionMeaning: {
      title: 'Expression #8: The Manifestation Leader',
      summary:
        'Your destiny is to manage large-scale resources, build commercial empires, and manifest financial prosperity that serves the collective good. You have exceptional business acumen and resilience.',
      talents: ['Strategic resource allocation', 'Financial and organizational leadership', 'Turning obstacles into profitable stepping stones'],
      careerPaths: ['CEO / Executive Leader', 'Venture Capitalist / Investor', 'Real Estate Mogul', 'Judiciary / Legal Authority', 'High-Impact Enterprise Founder'],
      workStyle: 'Visionary, results-oriented, driven by tangible milestones and high return on energetic investment.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #8: The Urge for Sovereignty & Impact',
      summary:
        'Deep within, your soul desires to wield tangible influence, attain financial freedom, and stand sovereign over your material world. You want to leave an undeniable legacy.',
      heartDesire: 'To achieve mastery over the physical realm, achieve wealth, and use power with integrity.',
      relationshipNeeds: ['An equally ambitious or highly supportive partner', 'Mutual respect without power struggles', 'Transparent financial collaboration and mutual loyalty'],
      secretFear: 'Financial ruin, powerlessness, or being controlled by external forces.',
    },
    personalityMeaning: {
      title: 'Personality #8: The Commanding Sovereign',
      summary:
        'You naturally project competence, authority, and high status. People immediately take your words seriously and look to you for strength.',
      firstImpression: 'Authoritative, successful, capable, and formidable.',
      styleAndVibe: 'Tailored luxury, structured suits, premium textures, and commanding presence.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Material obsession, ruthlessness, micromanagement, or equating self-worth solely with wealth.',
      growthLesson: 'True wealth is a spiritual flow; using your influence for humanitarian uplift multiplies your abundance.',
      cosmicRemedy: 'Practice joyful philanthropy: share a portion of your wins with those building their foundation.',
    },
    powerAffirmation: 'I channel divine abundance with integrity, creating enduring prosperity that elevates all.',
    bestMatches: [2, 4, 6, 8, 22],
  },
  9: {
    number: 9,
    title: 'The Universal Humanitarian',
    archetype: 'The Compassionate Sage & Rebirther',
    element: 'Fire / Ether 🌌',
    rulingBody: 'Mars ♂ / Jupiter ♃',
    crystals: ['Selenite', 'Moldavite', 'Rose Quartz', 'Smoky Quartz'],
    colors: ['Cosmic Violet', 'Magenta Rose', 'Starlight White'],
    keywords: ['Universal Love', 'Completion', 'Compassion', 'Release', 'Wisdom'],
    generalMeaning:
      'Number 9 is the final single digit, containing all lessons of 1 through 8. It represents universal brotherhood, humanitarian service, artistic maturity, and the sacred art of letting go to facilitate rebirth.',
    expressionMeaning: {
      title: 'Expression #9: The Global Visionary',
      summary:
        'Your destiny is to serve humanity, elevate consciousness, and inspire global healing. You are gifted with broad artistic vision, magnetic charisma, and profound empathy for all beings.',
      talents: ['Universal empathy & cross-cultural connection', 'Transformative artistic synthesis', 'Inspiring collective humanitarian action'],
      careerPaths: ['Humanitarian Leader / NGO Founder', 'Global Artist / Musician', 'Spiritual Guide & Author', 'Environmental Advocate', 'Diplomatic Peacemaker'],
      workStyle: 'Purpose-driven, expansive, thrives when projects have a direct positive impact on society.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #9: The Urge for Universal Upliftment',
      summary:
        'Your soul yearns for world peace, universal justice, and the elevation of suffering hearts. You feel most alive when dedicating yourself to a noble cause larger than personal ego.',
      heartDesire: 'To leave the world far more compassionate and enlightened than you found it.',
      relationshipNeeds: ['A partner with a large heart and broad global vision', 'Unconditional acceptance and emotional depth', 'Freedom to pursue philanthropic and artistic endeavors'],
      secretFear: 'Disillusionment with humanity, lingering past resentments, or failing to make a difference.',
    },
    personalityMeaning: {
      title: 'Personality #9: The Charismatic Philanthropist',
      summary:
        'You radiate warmth, worldly wisdom, and magnetic grace. People are drawn to your generous spirit and open-minded acceptance of all walks of life.',
      firstImpression: 'Generous, charismatic, sophisticated, and deeply compassionate.',
      styleAndVibe: 'Global bohemian elegance, flowing fabrics, rich jewel tones, and artistic cultural flair.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Carrying the weight of the world, resentment over past unreciprocated sacrifices, or drama.',
      growthLesson: 'Release attachments to specific outcomes; forgive the past and trust the divine cycle of renewal.',
      cosmicRemedy: 'Perform a monthly forgiveness and release ritual to keep your energetic aura clear.',
    },
    powerAffirmation: 'I release what no longer serves me and channel universal love for the healing of all souls.',
    bestMatches: [3, 6, 9, 33],
  },
  11: {
    number: 11,
    title: 'The Master Illuminator',
    archetype: 'The Intuitive Channel & Cosmic Beacon',
    element: 'Electric Light ⚡',
    rulingBody: 'Uranus ♅ / The Sun ☀️',
    crystals: ['Clear Quartz', 'Labradorite', 'Kyanite', 'Lepidolite'],
    colors: ['Luminescent Gold', 'Electric Silver', 'Pure White'],
    keywords: ['High Intuition', 'Inspiration', 'Spiritual Lightning', 'Visionary', 'Illumination'],
    generalMeaning:
      'Master Number 11 is the first of the master vibrations. It acts as a divine lightning rod, transmitting high-frequency spiritual insights and intuitive downloads directly into physical consciousness.',
    expressionMeaning: {
      title: 'Expression #11: The Visionary Messenger',
      summary:
        'Your life purpose is to be an inspirational beacon of higher spiritual truth. You bridge unseen realms of consciousness with tangible human insight, inspiring profound soul awakening in others.',
      talents: ['Prophetic intuitive flashes', 'Electric charisma that moves audiences', 'Translating esoteric concepts into simple truth'],
      careerPaths: ['Spiritual Teacher & Mentor', 'Visionary Author & Speaker', 'Transformational Coach', 'Innovator in Consciousness / AI', 'Artistic Channel'],
      workStyle: 'Intuitive, inspiration-driven, requires space for quiet contemplation and energetic grounding.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #11: The Urge for Spiritual Enlightenment',
      summary:
        'Your soul craves transcendent understanding, psychic clarity, and cosmic connection. You desire to align every facet of daily life with your sacred divine blueprint.',
      heartDesire: 'To awaken collective consciousness and live in conscious alignment with higher dimensions.',
      relationshipNeeds: ['Deep spiritual resonance with your partner', 'Emotional and nervous system grounding', 'Patience with your intense energetic sensitivity'],
      secretFear: 'Nervous burnout, feeling like an alien in the physical world, or self-doubt in your gifts.',
    },
    personalityMeaning: {
      title: 'Personality #11: The Luminous Mystic',
      summary:
        'You have an ethereal, magnetic, and striking presence. People sense an otherworldly aura and intuitive depth behind your eyes.',
      firstImpression: 'Inspiring, ethereal, gentle yet intense, and highly perceptive.',
      styleAndVibe: 'Clean, radiant lines, luminous fabrics, iridescent jewelry, and light-reflecting palettes.',
    },
    shadowAndGrowth: {
      shadowAspect: 'High nervous tension, anxiety, overstimulation, impracticality, or extreme self-doubt.',
      growthLesson: 'High spiritual voltage requires a solid grounding wire; anchor your body firmly to Mother Earth daily.',
      cosmicRemedy: 'Daily grounding: walk barefoot on soil, take magnesium baths, and hydrate with mineral water.',
    },
    powerAffirmation: 'I am a grounded conduit of cosmic light, illuminating dark places with truth, peace, and clarity.',
    bestMatches: [2, 7, 11, 22, 33],
  },
  22: {
    number: 22,
    title: 'The Master Architect',
    archetype: 'The Grand Builder of Global Structures',
    element: 'Earth / Cosmic Ether 🏰',
    rulingBody: 'Pluto ♇ / Saturn ♄',
    crystals: ['Moldavite', 'Black Jade', 'Platinum Quartz', 'Garnet'],
    colors: ['Imperial Gold', 'Deep Emerald', 'Cathedral Stone'],
    keywords: ['Master Builder', 'Global Legacy', 'Pragmatic Magic', 'Vast Vision', 'Execution'],
    generalMeaning:
      'Master Number 22 is widely known as the "Master Builder". It possesses the unique superpower of marrying 11’s lofty cosmic vision with 4’s grounded practical execution, building world-changing institutions.',
    expressionMeaning: {
      title: 'Expression #22: The Master Manifestor',
      summary:
        'Your destiny is to turn grand, visionary dreams into tangible physical structures, institutions, and platforms that benefit generations of humanity. You have unprecedented organizing power.',
      talents: ['Massive systemic architecture & planning', 'Translating big ideals into physical reality', 'Mobilizing large organizations for great causes'],
      careerPaths: ['Global Enterprise Founder', 'Master City Planner / Architect', 'International Policy Maker', 'Philanthropic Foundation Leader', 'Mega-Project Engineer'],
      workStyle: 'Systemic, monumental, thrives when building large-scale, generational legacy initiatives.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #22: The Urge to Anchor Heaven on Earth',
      summary:
        'Your soul is not satisfied with small accomplishments. You feel an ancient, sacred calling to build lasting structures, schools, communities, or technologies that uplift humanity on a vast scale.',
      heartDesire: 'To anchor monumental positive change into physical reality and leave a permanent legacy of light.',
      relationshipNeeds: ['A partner who understands the magnitude of your mission', 'Grounded emotional sanity and practical support', 'Mutual belief in grand positive possibilities'],
      secretFear: 'Falling short of your enormous potential or being crushed by self-imposed pressure.',
    },
    personalityMeaning: {
      title: 'Personality #22: The Master Commander',
      summary:
        'You exude quiet power, immense competence, and extraordinary vision. Leaders and peers naturally trust you with the highest responsibilities.',
      firstImpression: 'Visionary, masterfully competent, composed, and unstoppable.',
      styleAndVibe: 'Architectural silhouettes, premium enduring materials, and dignified executive presence.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Overwhelm from monumental visions, authoritarian tendencies, fear of grand failure, or ruthless pragmatism.',
      growthLesson: 'Every grand cathedral is built one single brick at a time; honor daily patience and celebrate steady increments.',
      cosmicRemedy: 'Deconstruct monumental decade goals into simple 90-day action blueprints.',
    },
    powerAffirmation: 'I channel divine blueprints into solid physical reality, building enduring blessings for humanity.',
    bestMatches: [4, 8, 11, 22, 33],
  },
  33: {
    number: 33,
    title: 'The Master Healing Avatar',
    archetype: 'The Teacher of Universal Compassion & Grace',
    element: 'Infinite Lotus / Water 🌸',
    rulingBody: 'The Sun ☀️ / Venus ♀',
    crystals: ['Diamond', 'Blue Sapphire', 'Kunzite', 'Danburite'],
    colors: ['Radiant Rose', 'Celestial Lavender', 'Sun Gold'],
    keywords: ['Master Teacher', 'Divine Grace', 'Unconditional Love', 'Sacred Healing', 'Devotion'],
    generalMeaning:
      'Master Number 33 is the "Master Teacher" and avatar of spiritual devotion. Combining the creative mastery of 3 with the protective love of 6, it represents the highest octave of unconditional service and spiritual grace.',
    expressionMeaning: {
      title: 'Expression #33: The Universal Healer & Teacher',
      summary:
        'Your destiny is to uplift humanity through selfless love, profound spiritual teaching, and energetic healing. Your presence alone acts as a soothing balm to troubled souls.',
      talents: ['Heart-centered spiritual mentorship', 'Profound energetic healing & empathy', 'Uplifting collective consciousness through unconditional grace'],
      careerPaths: ['Spiritual Master & Teacher', 'Transformational Healer', 'Holistic Sanctuary Founder', 'Global Humanitarian Ambassador', 'Conscious Artist & Mentor'],
      workStyle: 'Devotional, heart-centered, thrives in environments committed to human elevation and healing.',
    },
    soulUrgeMeaning: {
      title: 'Soul Urge #33: The Urge for Universal Compassion',
      summary:
        'Your soul yearns to bathe the entire world in loving-kindness. You feel a sacred responsibility to comfort the suffering and guide seekers back to their own divine light.',
      heartDesire: 'To embody pure unconditional love and help awaken the highest potential in every human heart.',
      relationshipNeeds: ['Absolute emotional warmth and spiritual reciprocity', 'Sacred respect for your compassionate calling', 'Loving reminders to protect your own vessel'],
      secretFear: 'Carrying the emotional agony of the world or feeling inadequate to your sacred calling.',
    },
    personalityMeaning: {
      title: 'Personality #33: The Radiant Avatar',
      summary:
        'People sense an undeniable saint-like warmth, kindness, and spiritual purity in your presence. Strangers often feel safe confiding their deepest pains to you.',
      firstImpression: 'Deeply comforting, wise, luminescent, and extraordinarily kind.',
      styleAndVibe: 'Graceful, flowing, gentle luminous hues with sacred and symbolic beauty.',
    },
    shadowAndGrowth: {
      shadowAspect: 'Martyr complex, extreme emotional exhaustion, self-neglect, or unrealistic expectations of self.',
      growthLesson: 'You must treat your own physical and emotional vessel with the same divine tenderness you give to the world.',
      cosmicRemedy: 'Non-negotiable self-care: establish protected sanctuary hours where you receive rather than give.',
    },
    powerAffirmation: 'I am a pure vessel of divine love and healing grace, radiating peace to all beings while honoring my own sacred sanctuary.',
    bestMatches: [6, 9, 11, 22, 33],
  },
};
