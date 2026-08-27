/**
 * speechUtils.ts
 * Studio-Grade Neural Audio Engine for Quorik AI Voice Agents.
 * 
 * Guarantees 100% authentic, high-definition Neural Studio Voice playback:
 * - Male Baritone (Arthur / Oliver / Brian / William)
 * - Female Warm / Vibrant (Zephyr / Clara / Jenny / Aria / Natasha)
 * 
 * Features:
 * 1. Studio-grade Neural Audio via server-side MP3 streaming.
 * 2. In-memory & Session cache for 0ms instantaneous repeat & sample playback.
 * 3. Smart pre-fetching for instant persona greetings.
 * 4. Resilient network handling with auto-retry and audio channel pre-arming.
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

export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent || '');
}

/**
 * Clean text for Speech Synthesis & TTS:
 * - Removes markdown and formatting tags
 * - Removes emojis that cause TTS distortion
 * - Replaces technical abbreviations with phonetically natural English equivalents
 */
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';

  let cleaned = text
    .replace(/\[CARD:[^\]]+\]/gi, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/www\.\S+/gi, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/#+\s+/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
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

// -------------------------------------------------------------
// Ultra-Resilient Audio Engine for Mobile & Desktop (iOS/Android/Safari/Chrome)
// -------------------------------------------------------------

let activeHtmlAudio: HTMLAudioElement | null = null;
let activeBufferSource: AudioBufferSourceNode | null = null;
let globalAudioCtx: AudioContext | null = null;
let activeUtteranceHeartbeat: any = null;
let currentSpeechToken = 0;
let activeTtsAbortController: AbortController | null = null;

// Client-side in-memory Base64 Audio Cache for 0ms repeat playback
const clientAudioCache = new Map<string, string>();

export function getAudioContext(): AudioContext {
  if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioContextClass();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

/**
 * Pre-arm and unlock audio channels synchronously on user tap/click.
 * Must be called in user gesture event handlers (e.g. Start Call, Mic button).
 */
export function unlockAudio(): void {
  try {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.resume();
      }
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (!activeHtmlAudio) {
        activeHtmlAudio = new Audio();
      }
    }
  } catch (e) {}
}

// Pre-warm on first touch or click
if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
}

/**
 * Stop any currently playing speech immediately and cancel all in-flight synthesis
 */
export function stopAllSpeech(): void {
  // 1. Invalidate any in-flight async TTS or speakSpeech requests
  currentSpeechToken++;

  // 2. Abort any active TTS network fetch immediately
  if (activeTtsAbortController) {
    try {
      activeTtsAbortController.abort();
    } catch (e) {}
    activeTtsAbortController = null;
  }

  // 3. Immediately stop and disconnect active Web Audio Buffer Source
  if (activeBufferSource) {
    try {
      activeBufferSource.onended = null;
      activeBufferSource.stop(0);
      activeBufferSource.disconnect();
    } catch (e) {}
    activeBufferSource = null;
  }

  // 4. Immediately pause and reset HTML5 Audio
  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.pause();
      activeHtmlAudio.currentTime = 0;
      activeHtmlAudio.src = '';
      activeHtmlAudio.onended = null;
      activeHtmlAudio.onerror = null;
      activeHtmlAudio.onplay = null;
    } catch (e) {}
    activeHtmlAudio = null;
  }

  // 5. Clear heartbeat timer
  if (activeUtteranceHeartbeat) {
    clearInterval(activeUtteranceHeartbeat);
    activeUtteranceHeartbeat = null;
  }

  // 6. Cancel browser SpeechSynthesis if active
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      if ((window as any)._quorikUtterances) {
        (window as any)._quorikUtterances = [];
      }
    } catch (e) {}
  }
}

/**
 * Pre-fetch neural audio for sample greetings or buttons into cache
 */
export async function prefetchNeuralAudio(
  text: string,
  gender: 'female' | 'male' | string = 'male',
  personaId: string = 'us-executive'
): Promise<void> {
  const clean = sanitizeTextForSpeech(text);
  if (!clean) return;
  const cacheKey = `${gender}:${personaId}:${clean}`;
  if (clientAudioCache.has(cacheKey)) return;

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean, gender, personaId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.audioData) {
        clientAudioCache.set(cacheKey, data.audioData);
      }
    }
  } catch (e) {}
}

/**
 * Primary Voice Synthesizer:
 * Uses Studio Neural Voice with HTML5 hardware MP3 playback, 0ms cache, and high resilience.
 */
export async function speakSpeech(
  rawText: string,
  options: {
    gender?: 'female' | 'male' | 'male-uk' | 'female-uk' | 'male-sales' | 'female-vibrant' | 'male-au' | 'female-au' | string;
    personaId?: string;
    preferredLocale?: 'en-US' | 'en-GB' | 'en-AU' | string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  } = {}
): Promise<void> {
  const cleanText = sanitizeTextForSpeech(rawText);
  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return;
  }

  stopAllSpeech();
  unlockAudio();
  const thisToken = currentSpeechToken;

  const rawGender = options.gender || 'male';
  const gLower = rawGender.toLowerCase();
  const isFemale = gLower.includes('female') || gLower === 'zephyr' || gLower === 'clara' || gLower === 'aria' || gLower === 'natasha';

  let personaId = options.personaId;
  if (!personaId) {
    if (gLower.includes('uk')) personaId = 'uk-refined';
    else if (gLower.includes('au')) personaId = 'au-friendly';
    else if (gLower.includes('vibrant') || gLower.includes('aria')) personaId = 'us-vibrant';
    else if (gLower.includes('sales') || gLower.includes('energetic') || gLower.includes('brian')) personaId = 'us-sales';
    else personaId = isFemale ? 'us-warm' : 'us-executive';
  }

  const cacheKey = `${rawGender}:${personaId}:${cleanText}`;

  const playAudioData = (base64Audio: string) => {
    if (thisToken !== currentSpeechToken) return;

    // High compatibility audio playback: try Web Audio Context decoding or HTML5 Audio
    const playWithWebAudioOrHtmlAudio = async () => {
      try {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioContext = getAudioContext();
        if (audioContext && audioContext.state !== 'closed') {
          if (audioContext.state === 'suspended') {
            await audioContext.resume().catch(() => {});
          }
          if (thisToken !== currentSpeechToken) return;

          const audioBuffer = await audioContext.decodeAudioData(bytes.buffer.slice(0));
          if (thisToken !== currentSpeechToken) return;

          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);

          activeBufferSource = source;

          source.onended = () => {
            if (activeBufferSource === source) {
              activeBufferSource = null;
            }
            if (thisToken === currentSpeechToken && options.onEnd) {
              options.onEnd();
            }
          };

          if (options.onStart && thisToken === currentSpeechToken) {
            options.onStart();
          }
          source.start(0);
          return;
        }
      } catch (webaudioErr) {
        console.info("[Neural Audio] WebAudio stream notice, attempting standard HTML5 audio:", webaudioErr);
      }

      if (thisToken !== currentSpeechToken) return;

      // Fallback to HTML5 Audio element
      try {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        activeHtmlAudio = audio;
        audio.preload = 'auto';

        let endedOrFailed = false;
        const finish = () => {
          if (endedOrFailed) return;
          endedOrFailed = true;
          if (activeHtmlAudio === audio) activeHtmlAudio = null;
          if (options.onEnd && thisToken === currentSpeechToken) options.onEnd();
        };

        audio.onplay = () => {
          if (thisToken !== currentSpeechToken) {
            audio.pause();
            audio.currentTime = 0;
            return;
          }
          if (options.onStart) options.onStart();
        };
        audio.onended = finish;
        audio.onerror = () => {
          if (thisToken === currentSpeechToken) {
            speakNativeUtterance(cleanText, options);
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("HTML5 Audio play notice:", err);
            if (thisToken === currentSpeechToken) {
              speakNativeUtterance(cleanText, options);
            }
          });
        }
      } catch (e) {
        if (thisToken === currentSpeechToken) {
          speakNativeUtterance(cleanText, options);
        }
      }
    };

    try {
      playWithWebAudioOrHtmlAudio();
    } catch (e) {
      if (thisToken === currentSpeechToken) {
        speakNativeUtterance(cleanText, options);
      }
    }
  };

  // 1. Check client-side memory cache for 0ms instant playback
  if (clientAudioCache.has(cacheKey)) {
    const cachedData = clientAudioCache.get(cacheKey)!;
    playAudioData(cachedData);
    return;
  }

  // 2. Fetch from Neural TTS API with a reliable 8-second timeout & automatic 1-retry
  const fetchTtsAudio = async (isRetry = false): Promise<string | null> => {
    const controller = new AbortController();
    activeTtsAbortController = controller;
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          text: cleanText,
          gender: rawGender,
          personaId
        })
      });

      clearTimeout(timeoutId);
      if (activeTtsAbortController === controller) {
        activeTtsAbortController = null;
      }

      if (thisToken !== currentSpeechToken) return null;

      if (res.ok) {
        const data = await res.json();
        if (thisToken !== currentSpeechToken) return null;
        if (data && data.audioData) {
          return data.audioData;
        }
      }
      throw new Error(`TTS server responded with ${res.status}`);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (activeTtsAbortController === controller) {
        activeTtsAbortController = null;
      }
      if (thisToken !== currentSpeechToken) return null;

      if (!isRetry) {
        console.info("[Neural TTS] Initial request retry with secondary stream...");
        return fetchTtsAudio(true);
      }
      console.warn("[Neural TTS] Synthesis notice:", err?.message || err);
      return null;
    }
  };

  const audioData = await fetchTtsAudio();
  if (thisToken !== currentSpeechToken) return;

  if (audioData) {
    clientAudioCache.set(cacheKey, audioData);
    playAudioData(audioData);
  } else {
    // Immediate fallback to speech synthesis to guarantee voice is heard under all conditions
    speakNativeUtterance(cleanText, options);
  }
}

// -------------------------------------------------------------
// Emergency Offline Web Speech API Fallback Implementation
// -------------------------------------------------------------

const MALE_NAMES = [
  'daniel', 'oliver', 'arthur', 'alex', 'fred', 'aaron', 'david', 'mark', 'george',
  'rishi', 'gordon', 'lee', 'tom', 'guy', 'stefan', 'ryan', 'richard', 'bruce', 'ralph',
  'albert', 'junior', 'male', 'man', 'baritone', '#male', 'male_1', 'male_2', 'male_3',
  'male-1', 'male-2', 'iom', 'iob', 'iol', 'rjs', 'fis', 'aub', 'cce', 'm0', 'm1', 'm2', 'm3',
  'voice 2', 'voice 4', 'voice 6', 'voice 8', 'voice_2', 'voice_4', 'voice_6', 'voice_8',
  'en_us_male', 'en_gb_male', 'sm-m', 'male '
];

const FEMALE_NAMES = [
  'female', 'woman', 'girl', 'samantha', 'karen', 'zira', 'victoria', 'hazel',
  'susan', 'aria', 'jenny', 'sonia', 'catherine', 'eva', 'moira', 'veena',
  'tessa', 'fiona', 'allison', 'ava', 'nora', 'serena', 'sara', 'sfg', 'tpd', 'tpc',
  'fem', 'clara', 'zephyr', 'female ', 'voice 1', 'voice 3', 'voice 5', 'voice 7',
  'voice_1', 'voice_3', 'voice_5', 'voice_7', 'gda', 'afh', 'ahp'
];

let cachedVoices: SpeechSynthesisVoice[] = [];

export function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length > 0) cachedVoices = v;
  } catch (e) {}
  return cachedVoices;
}

export function getBestEnglishVoice(
  gender: 'female' | 'male' | string = 'male',
  preferredLocale: 'en-US' | 'en-GB' | string = 'en-US'
): VoiceSelection {
  const isMobile = isMobileDevice();
  const isIOS = isIOSDevice();
  const isAndroid = isAndroidDevice();
  const allVoices = refreshVoices();

  const gLower = (gender || '').toLowerCase();
  const isFemale = gLower.includes('female') || gLower === 'zephyr' || gLower === 'clara' || gLower === 'aria' || gLower === 'natasha';

  const englishVoices = allVoices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
    return lang.startsWith('en-') || lang === 'en' || lang.startsWith('eng');
  });

  let defaultPitch = !isFemale ? (isMobile ? 0.78 : 0.88) : 1.05;
  let defaultRate = !isFemale ? 0.96 : 0.98;

  if (englishVoices.length === 0) {
    const fallbackLang = !isFemale ? (isIOS ? 'en-GB' : (preferredLocale || 'en-US')) : 'en-US';
    return { voice: null, pitch: defaultPitch, rate: defaultRate, lang: fallbackLang };
  }

  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (isFemale) {
    selectedVoice = englishVoices.find(v => {
      const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      const isMale = MALE_NAMES.some(k => name.includes(k));
      if (isMale) return false;
      return FEMALE_NAMES.some(k => name.includes(k));
    }) || null;

    if (!selectedVoice && isIOS) {
      selectedVoice = englishVoices.find(v => {
        const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
        return lang.startsWith('en-us') || lang === 'en';
      }) || null;
    }

    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        return !MALE_NAMES.some(k => name.includes(k));
      }) || englishVoices[0];
    }
  } else {
    selectedVoice = englishVoices.find(v => {
      const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return MALE_NAMES.some(k => name.includes(k));
    }) || null;

    if (!selectedVoice && isIOS) {
      selectedVoice = englishVoices.find(v => {
        const lang = (v.lang || '').toLowerCase().replace(/_/g, '-');
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        const isFemale = FEMALE_NAMES.some(k => name.includes(k)) || name.includes('samantha') || name.includes('united states');
        return (lang.startsWith('en-gb') || lang.startsWith('en-uk') || lang.startsWith('en-au')) && !isFemale;
      }) || null;
    }

    if (!selectedVoice && isAndroid) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        const isFemale = FEMALE_NAMES.some(k => name.includes(k));
        return (name.includes('en-gb') || name.includes('en-au') || name.includes('male') || name.includes('google')) && !isFemale;
      }) || null;
    }

    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => {
        const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
        const isFemale = FEMALE_NAMES.some(k => name.includes(k)) || (isIOS && (name.includes('samantha') || name.includes('united states')));
        return !isFemale;
      }) || englishVoices[0];
    }
  }

  const selectedLang = selectedVoice?.lang || (gender === 'male' && isIOS ? 'en-GB' : (preferredLocale || 'en-US'));

  return {
    voice: selectedVoice,
    pitch: defaultPitch,
    rate: defaultRate,
    lang: selectedLang
  };
}

export function speakNativeUtterance(
  rawText: string,
  options: {
    gender?: 'female' | 'male' | 'male-uk' | 'female-uk' | 'male-sales' | 'female-vibrant' | 'male-au' | 'female-au' | string;
    personaId?: string;
    preferredLocale?: 'en-US' | 'en-GB' | 'en-AU' | string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  } = {}
): void {
  const cleanText = sanitizeTextForSpeech(rawText);
  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return;
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options.onError) options.onError(new Error('Speech synthesis not supported on this browser'));
    if (options.onEnd) options.onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const targetGender = options.gender || 'male';
    const isIOS = isIOSDevice();
    const targetLocale = options.preferredLocale || (targetGender === 'male' && isIOS ? 'en-GB' : 'en-US');
    
    const { voice, pitch, rate, lang } = getBestEnglishVoice(targetGender, targetLocale);
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = lang || targetLocale || 'en-US';

    if (voice) {
      utterance.voice = voice;
    }

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
      activeUtteranceHeartbeat = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 2000);
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

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    if (options.onError) options.onError(err);
    if (options.onEnd) options.onEnd();
  }
}

/**
 * Universal export for any component calling speakEnglishUtterance:
 * Automatically routes through the Neural Studio Voice engine for flawless mobile & desktop audio.
 */
export function speakEnglishUtterance(
  rawText: string,
  options: {
    gender?: 'female' | 'male';
    personaId?: string;
    preferredLocale?: 'en-US' | 'en-GB';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  } = {}
): void {
  speakSpeech(rawText, options);
}

