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

/**
 * Select the best English voice available on the device.
 * Strictly avoids non-English voices (e.g. Chinese/Hindi/etc. default engines on mobile).
 */
export function getBestEnglishVoice(gender: 'female' | 'male' = 'female', preferredLocale: 'en-US' | 'en-GB' = 'en-US'): VoiceSelection {
  const isMobile = isMobileDevice();
  
  // Safe default pitch and rate
  // On mobile devices, non-1.0 pitch triggers bad resampling on Android/iOS TTS engines
  const defaultPitch = isMobile ? 1.0 : (gender === 'female' ? 1.02 : 0.98);
  const defaultRate = isMobile ? 1.0 : 0.98;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, pitch: 1.0, rate: 1.0, lang: 'en-US' };
  }

  const allVoices = window.speechSynthesis.getVoices() || [];
  
  // Filter exclusively for English voices
  const englishVoices = allVoices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
    return lang.startsWith('en-') || lang === 'en' || lang.startsWith('eng');
  });

  if (englishVoices.length === 0) {
    // If no English voice loaded yet or available in list, return fallback lang en-US
    return { voice: null, pitch: defaultPitch, rate: defaultRate, lang: 'en-US' };
  }

  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (gender === 'female') {
    // Preferred Female English Voices
    selectedVoice = englishVoices.find(v => {
      const name = v.name.toLowerCase();
      const isMale = name.includes('david') || name.includes('mark') || name.includes('george') || 
                     name.includes('guy') || name.includes('stefan') || name.includes('ryan') || 
                     name.includes('daniel') || name.includes('oliver') || name.includes('arthur') ||
                     name.includes('richard') || name.includes('male');
      if (isMale) return false;

      return name.includes('zira') || 
             name.includes('samantha') || 
             name.includes('victoria') || 
             name.includes('hazel') || 
             name.includes('susan') || 
             name.includes('karen') || 
             name.includes('aria') || 
             name.includes('jenny') || 
             name.includes('sonia') || 
             name.includes('catherine') || 
             name.includes('eva') || 
             name.includes('female') || 
             name.includes('google us english') || 
             name.includes('google uk english female') || 
             name.includes('natural female') || 
             name.includes('moira') || 
             name.includes('veena') || 
             name.includes('tessa');
    }) || null;

    if (!selectedVoice) {
      // Find any English voice that is not explicitly named with male identifiers
      selectedVoice = englishVoices.find(v => {
        const name = v.name.toLowerCase();
        return !name.includes('david') && !name.includes('mark') && !name.includes('george') && 
               !name.includes('guy') && !name.includes('male') && !name.includes('daniel');
      }) || null;
    }
  } else {
    // Preferred Male English Voices
    selectedVoice = englishVoices.find(v => {
      const name = v.name.toLowerCase();
      return name.includes('david') || 
             name.includes('mark') || 
             name.includes('george') || 
             name.includes('guy') || 
             name.includes('stefan') || 
             name.includes('ryan') || 
             name.includes('daniel') || 
             name.includes('oliver') || 
             name.includes('arthur') || 
             name.includes('richard') || 
             name.includes('google uk english male') || 
             name.includes('google us english male') || 
             name.includes('male');
    }) || null;
  }

  // Fallback to preferred locale or first English voice
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
      if ((window as any)._quorikUtterances) {
        (window as any)._quorikUtterances = (window as any)._quorikUtterances.filter((u: any) => u !== utterance);
      }
    };

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      cleanup();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      cleanup();
      console.warn("Speech synthesis notice:", err);
      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.error("Speech synthesis execution error:", err);
    if (options.onError) options.onError(err);
    if (options.onEnd) options.onEnd();
    return null;
  }
}
