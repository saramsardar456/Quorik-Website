/**
 * speechUtils.ts
 * High-fidelity, mobile-optimized Speech Synthesis & Audio Engine for Quorik AI.
 * Guarantees distinct Male (Arthur / Oliver) vs Female (Zephyr / Clara) voice profiles
 * across all mobile browsers (iOS Safari, Android Chrome, Samsung Internet) and desktop.
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

export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent || '') || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
    // Phonetic & abbreviation improvements
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

// Explicit Male Voice Identifiers across Desktop, iOS, Android Chrome, Google TTS, Samsung TTS
const MALE_VOICE_KEYWORDS = [
  'daniel', 'oliver', 'arthur', 'alex', 'fred', 'aaron', 'david', 'mark', 'george',
  'rishi', 'gordon', 'lee', 'tom', 'guy', 'stefan', 'ryan', 'richard', 'bruce', 'ralph',
  'albert', 'junior', 'male', 'man', 'baritone', '#male', 'male_1', 'male_2', 'male_3',
  'male-1', 'male-2', 'iom', 'iob', 'rjs', 'fis', 'm0', 'm1', 'm2', 'm3', 'm4', 'm5',
  'voice 2', 'voice 4', 'voice 6', 'voice 8', 'voice_2', 'voice_4', 'voice_6', 'voice_8',
  'en_us_male', 'en_gb_male', 'sm-m', 'male '
];

// Explicit Female Voice Identifiers
const FEMALE_VOICE_KEYWORDS = [
  'female', 'woman', 'girl', 'samantha', 'karen', 'zira', 'victoria', 'hazel',
  'susan', 'aria', 'jenny', 'sonia', 'catherine', 'eva', 'moira', 'veena',
  'tessa', 'fiona', 'allison', 'ava', 'nora', 'serena', 'sara', 'sfg', 'tpf',
  'fem', 'clara', 'zephyr', 'female ', 'voice 1', 'voice 3', 'voice 5', 'voice 7',
  'voice_1', 'voice_3', 'voice_5', 'voice_7', 'gda', 'afh', 'ahp'
];

let cachedVoices: SpeechSynthesisVoice[] = [];

// Pre-warm voices as early as possible
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices() || [];
    window.speechSynthesis.onvoiceschanged = () => {
      try {
        cachedVoices = window.speechSynthesis.getVoices() || [];
      } catch (e) {}
    };
  } catch (e) {}
}

export function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length > 0) {
      cachedVoices = v;
    }
  } catch (e) {}
  return cachedVoices;
}

/**
 * Select the best English voice available on the device.
 * Accurately detects and forces authentic male vs female timbre across
 * iOS (Safari/Chrome), Android (Pixel/Samsung/Xiaomi), and Desktop (macOS/Windows).
 */
export function getBestEnglishVoice(
  gender: 'female' | 'male' = 'male',
  preferredLocale: 'en-US' | 'en-GB' = 'en-US'
): VoiceSelection {
  const isMobile = isMobileDevice();
  const isIOS = isIOSDevice();

  // Pitch tuning:
  // Male (Arthur / Oliver) uses a lower pitch (0.76 on mobile, 0.82 on desktop) to shift
  // formants into a deep, authoritative baritone.
  // Female (Zephyr / Clara) uses 1.08 pitch and 0.98 rate.
  const defaultPitch = gender === 'male' ? (isMobile ? 0.76 : 0.82) : 1.08;
  const defaultRate = gender === 'male' ? 0.92 : 0.98;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, pitch: defaultPitch, rate: defaultRate, lang: preferredLocale };
  }

  const allVoices = refreshVoices();

  // Filter exclusively for English voices
  const englishVoices = allVoices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
    return lang.startsWith('en-') || lang === 'en' || lang.startsWith('eng');
  });

  if (englishVoices.length === 0) {
    return { voice: null, pitch: defaultPitch, rate: defaultRate, lang: preferredLocale };
  }

  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (gender === 'female') {
    // ----------------------------------------------------
    // FEMALE VOICE SELECTION (Zephyr / Clara)
    // ----------------------------------------------------
    // 1. Explicit Female English voice match
    selectedVoice = englishVoices.find(v => {
      const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      const isMale = MALE_VOICE_KEYWORDS.some(k => name.includes(k));
      if (isMale) return false;
      return FEMALE_VOICE_KEYWORDS.some(k => name.includes(k));
    }) || null;

    // 2. Preferred locale female voice
    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
        const matchesLocale = lang.includes(preferredLocale.toLowerCase());
        const isMale = MALE_VOICE_KEYWORDS.some(k => name.includes(k));
        return matchesLocale && !isMale;
      }) || null;
    }

    // 3. Fallback: First voice not explicitly identified as male
    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        return !MALE_VOICE_KEYWORDS.some(k => name.includes(k));
      }) || englishVoices[0];
    }
  } else {
    // ----------------------------------------------------
    // MALE VOICE SELECTION (Arthur / Oliver)
    // ----------------------------------------------------
    // 1. Explicit Male Voice Name Match (Daniel, Oliver, Arthur, Alex, David, Fred, Aaron, etc.)
    selectedVoice = englishVoices.find(v => {
      const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return MALE_VOICE_KEYWORDS.some(k => name.includes(k));
    }) || null;

    // 2. iOS Safari Special Handling:
    // On iOS devices, the default US voice ("English (United States)") is Samantha (Female).
    // However, iOS pre-installs the UK English voice ("Daniel" / "English (United Kingdom)"),
    // which is an authentic Male Baritone. If no explicit male voice was matched above,
    // selecting UK English (`en-GB`) on iOS guarantees a male voice.
    if (!selectedVoice && isIOS) {
      selectedVoice = englishVoices.find(v => {
        const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        const isFemale = FEMALE_VOICE_KEYWORDS.some(k => name.includes(k));
        return (lang.startsWith('en-gb') || lang.startsWith('en-uk') || lang.startsWith('en-au')) && !isFemale;
      }) || null;
    }

    // 3. Android Chrome / Google TTS Handling:
    // On Android, Google TTS provides numbered voices where Voice 2, Voice 4, Voice 6,
    // and voices with 'iob', 'iom', 'rjs', 'fis' are male.
    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        const hasMaleMarker = name.includes('iob') || name.includes('iom') || 
                              name.includes('rjs') || name.includes('fis') || 
                              name.includes('voice 2') || name.includes('voice 4') ||
                              name.includes('male');
        const isFemale = FEMALE_VOICE_KEYWORDS.some(k => name.includes(k));
        return hasMaleMarker && !isFemale;
      }) || null;
    }

    // 4. Fallback: Exclude all known female identifiers (Samantha, Karen, Zira, etc.)
    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        return !FEMALE_VOICE_KEYWORDS.some(k => name.includes(k));
      }) || null;
    }

    // 5. Final fallback to first English voice
    if (!selectedVoice) {
      selectedVoice = englishVoices[0];
    }
  }

  return {
    voice: selectedVoice,
    pitch: defaultPitch,
    rate: defaultRate,
    lang: selectedVoice?.lang || preferredLocale || 'en-US'
  };
}

let activeUtteranceHeartbeat: any = null;

/**
 * Robust, cross-browser speech playback executor.
 * Safely handles iOS Safari audio unlock, Chrome GC protection, and mobile heartbeats.
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
    if (options.onError) options.onError(new Error('Speech synthesis not supported on this browser'));
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

    const targetGender = options.gender || 'male';
    const targetLocale = options.preferredLocale || (targetGender === 'male' && isIOSDevice() ? 'en-GB' : 'en-US');
    
    const { voice, pitch, rate, lang } = getBestEnglishVoice(targetGender, targetLocale);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = lang || targetLocale || 'en-US';

    if (voice) {
      utterance.voice = voice;
    }

    // Retain global reference to avoid Chrome/Safari GC bugs during playback
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
      // Keep-alive heartbeat for Chrome / iOS to prevent 15-second silent stalls
      activeUtteranceHeartbeat = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 2500);
    };

    utterance.onend = () => {
      cleanup();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      cleanup();
      if (err?.error !== 'canceled' && err?.error !== 'interrupted') {
        console.warn("Speech synthesis event:", err);
      }
      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
    };

    // Small delay to allow iOS and Android audio buffers to flush and unlock
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
