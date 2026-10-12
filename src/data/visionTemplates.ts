import { GoalVisionItem } from '../types';

export interface VisionTemplate {
  id: string;
  title: string;
  description: string;
  category: GoalVisionItem['category'];
  aspectRatio: GoalVisionItem['aspectRatio'];
  imageUrl: string;
  affirmation: string;
  timeline: string;
  promptSuggestion: string;
  guidedMeditation: string;
  milestones: string[];
}

export const VISION_TEMPLATES: VisionTemplate[] = [
  {
    id: 'tmpl_abundance',
    title: 'Flowing Abundance & Financial Sovereignty',
    description: 'Manifesting continuous passive income streams, financial independence, and material sovereignty.',
    category: 'career',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    affirmation: 'I am a powerful magnet for effortless wealth, abundance, and divine security.',
    timeline: 'Spring Equinox (90 Days)',
    promptSuggestion: 'Golden luminous river flowing with glowing lights into a crystal sanctuary under twilight starlight, ethereal cinematic photorealism',
    guidedMeditation: 'Close your eyes. Take a deep 4-second breath in. Picture yourself sitting at a polished mahogany desk surrounded by abundant natural light. You look at your financial ledger and feel complete safety, overflowing abundance, and peace. Smile gently and say: "I receive with gratitude."',
    milestones: [
      'Define monthly financial freedom baseline target',
      'Set up automated monthly savings & investment flow',
      'Celebrate first passive wealth milestone with gratitude ritual',
    ],
  },
  {
    id: 'tmpl_love',
    title: 'Deep Soulmate Union & Mutual Harmony',
    description: 'Cultivating a blissful, mutually supportive partnership grounded in unconditional love and shared vision.',
    category: 'love',
    aspectRatio: '4:3',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    affirmation: 'My heart is wide open, attracting a deeply aligned, loving, and loyal partner.',
    timeline: 'Next Full Moon (30 Days)',
    promptSuggestion: 'Two glowing soul silhouettes walking together on a peaceful botanical coastline at golden sunset, warm pastel oil painting',
    guidedMeditation: 'Inhale deeply. Place your hand over your heart center. Feel the warm, radiant pink light expanding from your chest. Visualize holding hands with a loving soulmate who sees, respects, and cherishes your true essence. Feel the unshakeable peace of being chosen and loved.',
    milestones: [
      'Write down core emotional values desired in a partner',
      'Release old relationship attachments through forgiveness journal',
      'Engage in weekly social activities in aligned high-vibration spaces',
    ],
  },
  {
    id: 'tmpl_vitality',
    title: 'Radiant Cellular Health & Inner Peace',
    description: 'Nourishing physical body strength, deep restful sleep, vibrant energy, and daily somatic wellness.',
    category: 'health',
    aspectRatio: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    affirmation: 'Every cell in my body vibrates with perfect health, vitality, and cellular renewal.',
    timeline: '6 Month Cycle',
    promptSuggestion: 'Lush botanical greenhouse sanctuary with morning sunlight rays filtering through emerald leaves, serene watercolor art',
    guidedMeditation: 'Breathe in light and vitality. On the exhale, release tension from your shoulders and jaw. Feel a warm golden wave washing over your body, soothing every organ and cell. Feel how light, resilient, and energized your body naturally is.',
    milestones: [
      'Establish a 7-day nourishing hydration & organic meal routine',
      'Commit to 20 minutes of daily morning outdoor sunlight movement',
      'Implement an evening screen-free rest window at 9:30 PM',
    ],
  },
  {
    id: 'tmpl_creative',
    title: 'Unstoppable Creative Flow & Legacy',
    description: 'Completing visionary projects, breaking through artistic blocks, and expressing authentic truth.',
    category: 'career',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    affirmation: 'My creative expression flows effortlessly, blessing my life and inspiring the world.',
    timeline: 'Solar Return (Annual)',
    promptSuggestion: 'Sleek modern creative studio overlooking majestic mountain peaks at sunrise, clean minimalist geometry, bright natural light',
    guidedMeditation: 'Visualize your ideal creative sanctuary. See your finished masterpiece—whether a book, art piece, or business vision—displayed before you. Feel the pride and fulfillment of having brought something beautiful from the void into reality.',
    milestones: [
      'Block out 1 hour of sacred uninterrupted creative flow daily',
      'Complete first prototype or outline of major project',
      'Share creative work with an encouraging community or mentor',
    ],
  },
  {
    id: 'tmpl_spiritual',
    title: 'Unshakeable Tranquility & Intuitive Mastery',
    description: 'Anchoring daily meditation, trusting inner guidance, and abiding in boundless spiritual peace.',
    category: 'spiritual',
    aspectRatio: '1:1',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    affirmation: 'I am grounded in deep inner peace, trusting the infinite wisdom of my soul.',
    timeline: '3 Month Cycle',
    promptSuggestion: 'A serene lotus flower floating on a calm crystal mirror lake under a galaxy of stars, ethereal sacred geometry',
    guidedMeditation: 'Sit quietly. Close your eyes and focus on the space between your eyebrows. Imagine a soft sapphire blue light illuminating your intuition. Any worry or doubt dissolves like mist in the morning sun. You are safe, guided, and complete.',
    milestones: [
      'Maintain 10 consecutive days of 10-minute morning meditation',
      'Keep a daily dream and intuition insight journal',
      'Attend a weekend mindfulness or nature silent retreat',
    ],
  },
];

export const VISUAL_STYLES = [
  { label: 'Ethereal Watercolor & Soft Pastels', promptAdd: 'ethereal watercolor painting, soft luminous pastels, fluid golden lighting, artistic bloom' },
  { label: 'Mystical Starlight Oil Painting', promptAdd: 'oil painting texture, rich deep indigo and gold palette, starry celestial galaxy backdrop, luminous impasto' },
  { label: 'Clean Minimalist Architecture', promptAdd: 'sleek modern architectural photography, bright natural sunlight, clean lines, organic wood & stone textures' },
  { label: 'Golden Hour Cinematic Photo', promptAdd: '35mm cinematic photograph, warm golden hour sun flare, soft depth of field, hyper-realistic detail' },
  { label: 'Vibrant Botanical Sanctuary', promptAdd: 'lush lush tropical botanical illustration, emerald greens, glowing sunlight filtering through canopy' },
  { label: 'Vintage Celestial & Sacred Geometry', promptAdd: 'vintage celestial engraving, sacred geometric line work, subtle gold foil accents, timeless cosmic feel' },
];

export const INTENTION_THEMES = [
  { label: 'Attracting Wealth & Material Sovereignty', promptAdd: 'symbolizing abundance, golden light streams, prosperity, luxury and freedom' },
  { label: 'Cultivating Deep Love & Harmony', promptAdd: 'radiating warm heart chakra energy, pink and gold tones, unconditional unity' },
  { label: 'Unlocking Creative Expression & Legacy', promptAdd: 'vibrant artistic energy, inspriational canvas, boundless expression' },
  { label: 'Building Physical Vitality & Temple', promptAdd: 'refreshing crystal water, lush greenery, cellular health and natural energy' },
  { label: 'Deepening Spiritual Intuition & Peace', promptAdd: 'serene meditation sanctuary, starry night sky, lotus and quiet reflection' },
];
