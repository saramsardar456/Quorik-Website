/**
 * speechUtils.ts
 * High-fidelity, mobile-optimized Speech Synthesis engine for Quorik AI.
 * Guarantees crystal-clear English pronunciation on both Mobile (iOS/Android) and Desktop.
 */

export interface VoiceSelection {
  voice: SpeechSynthesisVoice | null;
  pitch: number;
  rate: number;
  lang: string;
}

export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
}

/**
 * Clean text for Speech Synthesis:
 * - Removes markdown and formatting tags
 * - Removes emojis that cause TTS distortion or reading aloud unicode names
 * - Replaces technical abbreviations with phonetically natural English equivalents
 */
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';

  let cleaned = text
    // Remove UI card markers
    .replace(/\[CARD:[^\]]+\]/gi, '')
    // Remove URLs
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/www\.\S+/gi, '')
    // Remove markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/#+\s+/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove all unicode emojis & decorative symbols
    .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    // Pronunciation fixes
    .replace(/\bQuorik\b/gi, 'Korik')
    .replace(/\bAI\b/g, 'A.I.')
    .replace(/\bROI\b/g, 'R.O.I.')
    .replace(/\bCRM\b/g, 'C.R.M.')
    .replace(/\bSMS\b/g, 'S.M.S.')
    .replace(/\bEST\b/g, 'E.S.T.')
    .replace(/\bPST\b/g, 'P.S.T.')
    .replace(/\bGMT\b/g, 'G.M.T.')
    .replace(/\bCEO\b/g, 'C.E.O.')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

const MALE_VOICE_KEYWORDS = [
  'alex', 'daniel', 'oliver', 'arthur', 'david', 'mark', 'george', 'fred',
  'aaron', 'gordon', 'rishi', 'tom', 'lee', 'nicky', 'guy', 'stefan', 'ryan',
  'richard', 'bruce', 'ralph', 'albert', 'junior', 'male', 'man', 'baritone',
  '#male', 'male_1', 'male_2', 'male_3', 'male-1', 'male-2', 'iom', 'iob',
  'rjs', 'fis', 'm0', 'm1', 'm2', 'm3', 'm4', 'm5', 'male '
];

const FEMALE_VOICE_KEYWORDS = [
  'female', 'woman', 'girl', 'samantha', 'karen', 'zira', 'victoria', 'hazel',
  'susan', 'aria', 'jenny', 'sonia', 'catherine', 'eva', 'moira', 'veena',
  'tessa', 'fiona', 'allison', 'ava', 'nora', 'serena', 'sara', 'sfg', 'tpf',
  'fem', 'clara', 'zephyr', 'female '
];

/**
 * Select the best English voice available on the device.
 * Accurately detects male vs female profiles across iOS Safari, Android Chrome, and Desktop.
 */
export function getBestEnglishVoice(gender: 'female' | 'male' = 'female', preferredLocale: 'en-US' | 'en-GB' = 'en-US'): VoiceSelection {
  // Arthur (Male) uses a deeper 0.84 pitch to guarantee masculine baritone cadence even on mobile
  const defaultPitch = gender === 'male' ? 0.84 : 1.06;
  const defaultRate = gender === 'male' ? 0.94 : 0.95;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, pitch: defaultPitch, rate: defaultRate, lang: 'en-US' };
  }

  const allVoices = window.speechSynthesis.getVoices() || [];
  
  // Filter exclusively for English voices
  const englishVoices = allVoices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
    return lang.startsWith('en-') || lang === 'en' || lang.startsWith('eng');
  });

  if (englishVoices.length === 0) {
    return { voice: null, pitch: defaultPitch, rate: defaultRate, lang: 'en-US' };
  }

  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (gender === 'female') {
    // 1. Find preferred Female English Voices
    selectedVoice = englishVoices.find(v => {
      const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      const isMale = MALE_VOICE_KEYWORDS.some(k => name.includes(k));
      if (isMale) return false;
      return FEMALE_VOICE_KEYWORDS.some(k => name.includes(k));
    }) || null;

    // 2. If none explicitly identified as female, pick any English voice not marked as male
    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        return !MALE_VOICE_KEYWORDS.some(k => name.includes(k));
      }) || null;
    }
  } else {
    // Male Voice Selection (Arthur / Oliver)
    // 1. Explicit Male match
    selectedVoice = englishVoices.find(v => {
      const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return MALE_VOICE_KEYWORDS.some(k => name.includes(k));
    }) || null;

    // 2. If no explicit male name found, reject all known female voices (e.g. Samantha on iOS)
    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        return !FEMALE_VOICE_KEYWORDS.some(k => name.includes(k));
      }) || null;
    }
  }

  // Fallback to preferred locale or first available English voice
  if (!selectedVoice) {
    selectedVoice = englishVoices.find(v => (v.lang || '').toLowerCase().includes(preferredLocale.toLowerCase())) || englishVoices[0];
  }

  return {
    voice: selectedVoice,
    pitch: defaultPitch,
    rate: defaultRate,
    lang: selectedVoice ? selectedVoice.lang : 'en-US'
  };
}

let activeUtteranceHeartbeat: any = null;

/**
 * Robust, cross-browser speech playback executor.
 */
export function speakEnglishUtterance(
  rawText: string,
  options: {
    gender?: 'female' | 'male';
    preferredLocale?: 'en-US' | 'en-GB';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  } = {}
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options.onError) options.onError(new Error('Speech synthesis not supported'));
    return null;
  }

  const cleanText = sanitizeTextForSpeech(rawText);
  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return null;
  }

  try {
    if (activeUtteranceHeartbeat) {
      clearInterval(activeUtteranceHeartbeat);
      activeUtteranceHeartbeat = null;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const { voice, pitch, rate, lang } = getBestEnglishVoice(options.gender || 'female', options.preferredLocale || 'en-US');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = lang || 'en-US';

    if (voice) {
      utterance.voice = voice;
    }

    // Retain global reference to avoid Chrome/Safari GC bugs
    (window as any)._quorikUtterances = (window as any)._quorikUtterances || [];
    (window as any)._quorikUtterances.push(utterance);

    const cleanup = () => {
      if (activeUtteranceHeartbeat) {
        clearInterval(activeUtteranceHeartbeat);
        activeUtteranceHeartbeat = null;
      }
      if ((window as any)._quorikUtterances) {
        (window as any)._quorikUtterances = (window as any)._quorikUtterances.filter((u: any) => u !== utterance);
      }
    };

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
      // Keep-alive heartbeat for Chrome / iOS
      activeUtteranceHeartbeat = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 3000);
    };

    utterance.onend = () => {
      cleanup();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      cleanup();
      if (err?.error !== 'canceled' && err?.error !== 'interrupted') {
        console.warn("Speech synthesis notice:", err);
      }
      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
    };

    // Small timeout ensures queue is ready across mobile browsers
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        cleanup();
        if (options.onError) options.onError(err);
      }
    }, 40);

    return utterance;
  } catch (err) {
    console.error("Speech synthesis execution error:", err);
    if (options.onError) options.onError(err);
    if (options.onEnd) options.onEnd();
    return null;
  }
}
