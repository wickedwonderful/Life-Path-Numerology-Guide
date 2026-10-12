/**
 * High-Fidelity Voice & Audio Engine for Numerology & Life Path Guide.
 * Powered by Google Gemini AI Text-to-Speech with multi-persona voice selection,
 * asynchronous voice loading, persona-specific acoustic tuning, and device synthesis fallback.
 */

export type CosmicVoiceId = 'Kore' | 'Zephyr' | 'Puck' | 'Charon' | 'Fenrir' | 'Device';

export interface CosmicVoiceOption {
  id: CosmicVoiceId;
  name: string;
  archetype: string;
  description: string;
  tone: string;
  badge: string;
  samplePhrase: string;
  isAi: boolean;
  rate: number;
  pitch: number;
  preferredGenders: ('female' | 'male' | 'neutral')[];
  preferredKeywords: string[];
}

export const COSMIC_VOICES: CosmicVoiceOption[] = [
  {
    id: 'Kore',
    name: 'Kore',
    archetype: 'Celestial Guide',
    description: 'Soothing, mindful feminine frequency with gentle cosmic resonance',
    tone: 'Warm, empathetic & meditative',
    badge: 'Gemini AI HD',
    samplePhrase: 'Take a slow, deep breath and trust the divine rhythm of your life path.',
    isAi: true,
    rate: 0.86,
    pitch: 1.0,
    preferredGenders: ['female'],
    preferredKeywords: ['natural', 'jenny', 'samantha', 'victoria', 'serena', 'google uk english female'],
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    archetype: 'Serene Mystic',
    description: 'Tranquil, airy, ethereal tone tailored for deep meditation & quiet focus',
    tone: 'Peaceful & grounding',
    badge: 'Gemini AI HD',
    samplePhrase: 'Peace and crystalline clarity surround you as your purpose unfolds.',
    isAi: true,
    rate: 0.80,
    pitch: 1.05,
    preferredGenders: ['female', 'neutral'],
    preferredKeywords: ['karen', 'moira', 'fiona', 'tessa', 'aria', 'soft'],
  },
  {
    id: 'Puck',
    name: 'Puck',
    archetype: 'Solar Spark',
    description: 'Radiant, uplifting, and cheerful guide inspiring joyful forward momentum',
    tone: 'Bright, vibrant & encouraging',
    badge: 'Gemini AI HD',
    samplePhrase: 'You possess limitless vitality and creative power today.',
    isAi: true,
    rate: 0.94,
    pitch: 1.15,
    preferredGenders: ['neutral', 'female'],
    preferredKeywords: ['zira', 'hazel', 'neural', 'cheerful'],
  },
  {
    id: 'Charon',
    name: 'Charon',
    archetype: 'Cosmic Sage',
    description: 'Deep, resonant, anchoring voice carrying ancient wisdom and stability',
    tone: 'Profound, steady & wise',
    badge: 'Gemini AI HD',
    samplePhrase: 'Stand firmly in your sacred truth and watch your reality align.',
    isAi: true,
    rate: 0.80,
    pitch: 0.80,
    preferredGenders: ['male'],
    preferredKeywords: ['david', 'george', 'daniel', 'oliver', 'guy', 'male'],
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    archetype: 'Empowered Force',
    description: 'Dynamic, confident tone inspiring courage, discipline, and high achievement',
    tone: 'Bold, motivating & focused',
    badge: 'Gemini AI HD',
    samplePhrase: 'Every challenge is an invitation to step boldly into your full mastery.',
    isAi: true,
    rate: 0.88,
    pitch: 0.86,
    preferredGenders: ['male'],
    preferredKeywords: ['aaron', 'tom', 'ryan', 'alex', 'male'],
  },
  {
    id: 'Device',
    name: 'System Default',
    archetype: 'Native Speech',
    description: 'Standard built-in browser speech synthesizer with offline reliability',
    tone: 'Browser default tone',
    badge: 'Device Voice',
    samplePhrase: 'Welcome to your intuitive numerology sanctuary.',
    isAi: false,
    rate: 0.90,
    pitch: 1.0,
    preferredGenders: ['neutral'],
    preferredKeywords: [],
  },
];

const STORAGE_VOICE_KEY = 'cosmic_voice_persona_v2';

export function getSelectedVoiceId(): CosmicVoiceId {
  if (typeof window === 'undefined') return 'Kore';
  const saved = localStorage.getItem(STORAGE_VOICE_KEY);
  if (saved && COSMIC_VOICES.some((v) => v.id === saved)) {
    return saved as CosmicVoiceId;
  }
  return 'Kore';
}

export function setSelectedVoiceId(voiceId: CosmicVoiceId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_VOICE_KEY, voiceId);
  window.dispatchEvent(new CustomEvent('cosmic-voice-changed', { detail: { voiceId } }));
}

// Client-side in-memory audio blob cache
const clientAudioCache = new Map<string, string>();

// Global playback controller
let currentAudioElement: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let isPlaybackActive = false;
let isPlaybackPaused = false;
let playbackCancelTrigger: (() => void) | null = null;
let geminiTtsDisabledUntil = 0;
let cachedBrowserVoices: SpeechSynthesisVoice[] = [];

// Helper to reliably load browser voices
function getAvailableBrowserVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (cachedBrowserVoices.length > 0) return cachedBrowserVoices;

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedBrowserVoices = voices;
    return voices;
  }
  return [];
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedBrowserVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Finds the most suitable voice in the current browser matching the persona
 */
export function getPersonaVoice(voiceId: CosmicVoiceId): { voice: SpeechSynthesisVoice | null; rate: number; pitch: number } {
  const config = COSMIC_VOICES.find((v) => v.id === voiceId) || COSMIC_VOICES[0];
  const voices = getAvailableBrowserVoices();

  if (voices.length === 0) {
    return { voice: null, rate: config.rate, pitch: config.pitch };
  }

  // 1. Check for specific preferred keyword matches
  for (const keyword of config.preferredKeywords) {
    const match = voices.find(
      (v) => v.name.toLowerCase().includes(keyword) && v.lang.startsWith('en')
    );
    if (match) return { voice: match, rate: config.rate, pitch: config.pitch };
  }

  // 2. Gender heuristics
  if (config.preferredGenders.includes('male')) {
    const maleVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('george') ||
          v.name.toLowerCase().includes('guy') ||
          v.name.toLowerCase().includes('daniel'))
    );
    if (maleVoice) return { voice: maleVoice, rate: config.rate, pitch: config.pitch };
  } else if (config.preferredGenders.includes('female')) {
    const femaleVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('samantha'))
    );
    if (femaleVoice) return { voice: femaleVoice, rate: config.rate, pitch: config.pitch };
  }

  // 3. Fallback to any English voice
  const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
  return { voice: anyEnglish || voices[0] || null, rate: config.rate, pitch: config.pitch };
}

export function cleanTextForSpeech(raw: string): string {
  if (!raw) return '';
  let cleaned = raw;

  // Strip math / LaTeX
  cleaned = cleaned.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  cleaned = cleaned.replace(/\$([^\$\n]+)\$/g, '$1');
  cleaned = cleaned.replace(/\$/g, '');

  cleaned = cleaned.replace(/\\rightarrow|\\to|->|→/g, ', which leads to ');
  cleaned = cleaned.replace(/\\times|×/g, ' times ');
  cleaned = cleaned.replace(/\\/g, '');

  cleaned = cleaned.replace(/(\d+)\s*\+\s*(\d+)/g, '$1 plus $2');
  cleaned = cleaned.replace(/=\s*(\d+)/g, 'equals $1');

  // Strip markdown formatting
  cleaned = cleaned.replace(/\*{1,3}/g, ' ');
  cleaned = cleaned.replace(/_{1,3}/g, ' ');
  cleaned = cleaned.replace(/#+\s*/g, '');
  cleaned = cleaned.replace(/^[ \t]*[-*•][ \t]+/gm, '');
  cleaned = cleaned.replace(/[`>~]/g, ' ');
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  cleaned = cleaned.replace(/---+/g, '. ');

  // Strip emojis
  cleaned = cleaned.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ');

  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/\.+/g, '.');
  cleaned = cleaned.replace(/,\s*,/g, ',');

  return cleaned.trim();
}

function notifyPlaybackState() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('cosmic-audio-state-changed', {
        detail: {
          isPlaying: isPlaybackActive && !isPlaybackPaused,
          isPaused: isPlaybackPaused,
          isActive: isPlaybackActive,
        },
      })
    );
  }
}

export function stopSoothingAudio(): void {
  if (playbackCancelTrigger) {
    playbackCancelTrigger();
    playbackCancelTrigger = null;
  }

  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  currentUtterance = null;
  isPlaybackActive = false;
  isPlaybackPaused = false;
  notifyPlaybackState();
}

export function pauseSoothingAudio(): void {
  if (currentAudioElement && !currentAudioElement.paused) {
    currentAudioElement.pause();
    isPlaybackPaused = true;
    notifyPlaybackState();
    return;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    isPlaybackPaused = true;
    notifyPlaybackState();
  }
}

export function resumeSoothingAudio(): void {
  if (currentAudioElement && currentAudioElement.paused && isPlaybackPaused) {
    currentAudioElement.play().catch(() => {});
    isPlaybackPaused = false;
    notifyPlaybackState();
    return;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    isPlaybackPaused = false;
    notifyPlaybackState();
  }
}

export function isSoothingAudioPlaying(): boolean {
  return isPlaybackActive && !isPlaybackPaused;
}

export function isSoothingAudioActive(): boolean {
  return isPlaybackActive;
}

export function isSoothingAudioPaused(): boolean {
  return isPlaybackPaused;
}

export interface SpeakOptions {
  text: string;
  voiceId?: CosmicVoiceId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err?: any) => void;
  onLoading?: (isLoading: boolean) => void;
  onProgress?: (currentChunk: number, totalChunks: number, textSnippet: string) => void;
  rate?: number;
  pitch?: number;
}

export function splitTextIntoSpeechChunks(text: string, maxChunkLen = 350): string[] {
  if (!text) return [];
  const clean = text.trim();
  if (clean.length <= maxChunkLen) return [clean];

  const paragraphs = clean.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];

  for (const para of paragraphs) {
    if (para.length <= maxChunkLen) {
      chunks.push(para);
      continue;
    }

    const sentences = para.match(/[^.!?]+[.!?]+|\S+$/g) || [para];
    let currentChunk = '';

    for (const sentence of sentences) {
      const s = sentence.trim();
      if (!s) continue;

      if ((currentChunk + ' ' + s).trim().length <= maxChunkLen) {
        currentChunk = (currentChunk + ' ' + s).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = s;
      }
    }
    if (currentChunk) chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [clean];
}

async function fetchGeminiTtsAudio(text: string, voiceId: string): Promise<string> {
  const cacheKey = `${voiceId}_${text}`;
  if (clientAudioCache.has(cacheKey)) {
    return clientAudioCache.get(cacheKey)!;
  }

  const res = await fetch('/api/gemini/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: voiceId }),
  });

  const data = await res.json();
  if (data.fallback) {
    geminiTtsDisabledUntil = Date.now() + 60 * 60 * 1000;
    throw new Error('TTS_FALLBACK_ACTIVE');
  }

  if (data.audioUrl) {
    clientAudioCache.set(cacheKey, data.audioUrl);
    return data.audioUrl;
  }
  throw new Error(data.error || 'No audio URL returned');
}

export function speakSoothingly(options: SpeakOptions): () => void {
  stopSoothingAudio();

  const preparedText = cleanTextForSpeech(options.text);
  if (!preparedText) {
    if (options.onEnd) options.onEnd();
    return () => {};
  }

  const voiceId = options.voiceId || getSelectedVoiceId();

  if (voiceId === 'Device' || Date.now() < geminiTtsDisabledUntil) {
    return playDeviceSynthesis(preparedText, voiceId, options);
  }

  const chunks = splitTextIntoSpeechChunks(preparedText, 350);
  let isCancelled = false;

  playbackCancelTrigger = () => {
    isCancelled = true;
    if (currentAudioElement) {
      try {
        currentAudioElement.pause();
        currentAudioElement.src = '';
      } catch {}
      currentAudioElement = null;
    }
    isPlaybackActive = false;
    isPlaybackPaused = false;
    notifyPlaybackState();
  };

  if (options.onLoading) options.onLoading(true);

  const playChunkIndex = async (index: number) => {
    if (isCancelled) return;

    if (index >= chunks.length) {
      isPlaybackActive = false;
      isPlaybackPaused = false;
      currentAudioElement = null;
      notifyPlaybackState();
      if (options.onLoading) options.onLoading(false);
      if (options.onEnd) options.onEnd();
      return;
    }

    const currentChunkText = chunks[index];
    if (options.onProgress) {
      options.onProgress(index + 1, chunks.length, currentChunkText);
    }

    try {
      const audioUrl = await fetchGeminiTtsAudio(currentChunkText, voiceId);
      if (isCancelled) return;
      if (options.onLoading) options.onLoading(false);

      const audio = new Audio(audioUrl);
      currentAudioElement = audio;
      isPlaybackActive = true;
      isPlaybackPaused = false;
      notifyPlaybackState();

      audio.onplay = () => {
        if (index === 0 && options.onStart) options.onStart();
      };

      audio.onended = () => {
        if (isCancelled) return;
        playChunkIndex(index + 1);
      };

      audio.onerror = () => {
        if (!isCancelled) {
          const remainingText = chunks.slice(index).join(' ');
          playDeviceSynthesis(remainingText, voiceId, options);
        }
      };

      await audio.play();
    } catch (_err) {
      if (!isCancelled) {
        if (options.onLoading) options.onLoading(false);
        const remainingText = chunks.slice(index).join(' ');
        playDeviceSynthesis(remainingText, voiceId, options);
      }
    }
  };

  playChunkIndex(0);

  return () => {
    isCancelled = true;
    stopSoothingAudio();
  };
}

function playDeviceSynthesis(preparedText: string, voiceId: CosmicVoiceId, options: SpeakOptions): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options.onError) options.onError(new Error('Speech synthesis not supported on this browser'));
    return () => {};
  }

  window.speechSynthesis.cancel();
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const chunks = splitTextIntoSpeechChunks(preparedText, 250);
  let isCancelled = false;
  let chunkIdx = 0;
  const tuned = getPersonaVoice(voiceId);

  const playNextUtterance = () => {
    if (isCancelled) return;
    if (chunkIdx >= chunks.length) {
      isPlaybackActive = false;
      isPlaybackPaused = false;
      currentUtterance = null;
      notifyPlaybackState();
      if (options.onEnd) options.onEnd();
      return;
    }

    const chunkText = chunks[chunkIdx];
    if (options.onProgress) {
      options.onProgress(chunkIdx + 1, chunks.length, chunkText);
    }

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = options.rate ?? tuned.rate;
    utterance.pitch = options.pitch ?? tuned.pitch;

    if (tuned.voice) {
      utterance.voice = tuned.voice;
    }

    currentUtterance = utterance;
    isPlaybackActive = true;
    isPlaybackPaused = false;
    notifyPlaybackState();

    utterance.onstart = () => {
      if (chunkIdx === 0 && options.onStart) options.onStart();
    };

    utterance.onend = () => {
      chunkIdx++;
      playNextUtterance();
    };

    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') {
        isPlaybackActive = false;
        isPlaybackPaused = false;
        currentUtterance = null;
        notifyPlaybackState();
        if (options.onEnd) options.onEnd();
        return;
      }
      isPlaybackActive = false;
      isPlaybackPaused = false;
      currentUtterance = null;
      notifyPlaybackState();
      if (options.onError) options.onError(e);
    };

    window.speechSynthesis.speak(utterance);
  };

  playNextUtterance();

  return () => {
    isCancelled = true;
    window.speechSynthesis.cancel();
    isPlaybackActive = false;
    isPlaybackPaused = false;
    notifyPlaybackState();
  };
}
