/**
 * Quorik Systems - Multi-Tenant AI Real-Time Voice & Chatbot Embedded Widget (v3.0 Executive Edition)
 * Zero-dependency, bidirectional Voice-to-Voice and Intelligent Chat with Arthur AI Concierge
 */
(function() {
  const currentScript = document.currentScript || document.querySelector('script[data-client-id]') || document.querySelector('script[src*="widget.js"]');

  let clientId = currentScript ? currentScript.getAttribute('data-client-id') : null;
  if (!clientId) {
    if (window.location.hostname.includes('quoriksystem') || window.location.hostname.includes('quorik')) {
      clientId = 'quorik-google-ads';
    } else {
      clientId = window.location.hostname.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() || 'quorik-google-ads';
    }
  }

  let serverOrigin = '';
  if (currentScript && currentScript.src) {
    try {
      serverOrigin = new URL(currentScript.src).origin;
    } catch (e) {
      serverOrigin = window.location.origin;
    }
  } else {
    serverOrigin = window.location.origin;
  }

  const primaryColor = (currentScript && currentScript.getAttribute('data-accent')) || '#00E5FF';
  const STORAGE_KEY = 'quorik_arthur_widget_v3_' + clientId;

  // Inject Styles
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    #quorik-voice-widget-root {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    #quorik-callout-bubble {
      display: none;
      align-items: center;
      gap: 12px;
      background: #0D1322;
      border: 1px solid rgba(0, 229, 255, 0.35);
      padding: 12px 16px;
      border-radius: 18px;
      border-bottom-right-radius: 4px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(0, 229, 255, 0.18);
      color: #fff;
      cursor: pointer;
      max-width: 320px;
      animation: q-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #quorik-callout-bubble:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 229, 255, 0.28);
    }
    @keyframes q-slide-in {
      from { opacity: 0; transform: translateY(14px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #quorik-launcher {
      position: relative;
      height: 54px;
      padding: 0 18px 0 12px;
      border-radius: 27px;
      background: linear-gradient(135deg, #0A0E1A, #121A30);
      border: 2px solid ${primaryColor};
      box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(0, 229, 255, 0.35);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }
    #quorik-launcher:hover {
      transform: scale(1.04);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.6), 0 0 32px rgba(0, 229, 255, 0.5);
    }
    .quorik-online-beacon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px #10B981;
      display: inline-block;
      animation: q-beacon 1.8s infinite ease-in-out;
    }
    @keyframes q-beacon {
      0%, 100% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.25); opacity: 1; box-shadow: 0 0 14px #10B981; }
    }
    #quorik-modal {
      display: none;
      position: fixed;
      bottom: 86px;
      right: 20px;
      width: 410px;
      max-width: calc(100vw - 32px);
      height: 620px;
      max-height: calc(100vh - 105px);
      background: #0A0E1A;
      border: 1px solid rgba(0, 229, 255, 0.25);
      border-radius: 24px;
      box-shadow: 0 25px 60px -10px rgba(0,0,0,0.85), 0 0 35px rgba(0, 229, 255, 0.15);
      overflow: hidden;
      flex-direction: column;
      color: #fff;
      animation: q-slide-in 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
    }
    @media (max-width: 480px) {
      #quorik-modal {
        right: 12px;
        bottom: 80px;
        width: calc(100vw - 24px);
        height: calc(100vh - 95px);
        border-radius: 20px;
      }
    }
    .q-scrollbar::-webkit-scrollbar {
      width: 5px;
    }
    .q-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .q-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 10px;
    }
    .q-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 229, 255, 0.4);
    }
    .q-pulse-wave {
      animation: q-pulse 1.4s infinite ease-in-out;
    }
    @keyframes q-pulse {
      0% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(0, 229, 255, 0); }
      100% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
    }
    .q-chip-btn {
      flex-shrink: 0;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      font-size: 11px;
      color: #CBD5E1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      white-space: nowrap;
      user-select: none;
    }
    .q-chip-btn:hover {
      background: rgba(0, 229, 255, 0.15);
      border-color: rgba(0, 229, 255, 0.4);
      color: #00E5FF;
      transform: translateY(-1px);
    }
    .q-typing-dot {
      width: 6px;
      height: 6px;
      background: #00E5FF;
      border-radius: 50%;
      display: inline-block;
      animation: q-bounce 1.3s infinite ease-in-out;
    }
    @keyframes q-bounce {
      0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(styleEl);

  // Root container
  const root = document.createElement('div');
  root.id = 'quorik-voice-widget-root';
  document.body.appendChild(root);

  // State
  let clientData = null;
  let isOpen = false;
  let activeMode = 'chat'; // 'chat' | 'voice-call'
  let soundEnabled = false;
  let isSpeaking = false;
  let isThinking = false;
  let isListening = false;
  let isSupportViewOpen = false;
  let isPausedOrLimited = false;
  let isVoiceOnlyExhausted = false;
  let isChatOnlyExhausted = false;
  let recognition = null;
  let callTimer = null;
  let callSeconds = 0;
  let currentAudio = null;
  let widgetSpeechToken = 0;
  let widgetSilenceTimer = null;
  const widgetAudioCache = new Map();

  // Load message history from localStorage
  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  }

  function getInitialGreeting() {
    const business = clientData?.businessName || 'Quorik Google Ads';
    const agent = clientData?.voiceAgentName || 'Arthur (Executive Concierge)';
    return [
      {
        id: 'msg-init-1',
        sender: 'ai',
        text: `Hello and welcome! 👋 I am **${agent}**, the 24/7 AI Voice & Strategy Concierge for **${business}**.\n\nYou can speak with me live voice-to-voice or type below to analyze performance, calculate your ROI, or schedule a strategy consultation!`,
        time: 'Just now'
      }
    ];
  }

  let messages = loadHistory() || getInitialGreeting();

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }

  function formatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Audio helper & pre-warming
  let audioUnlocked = false;
  let cachedVoices = [];

  function populateVoices() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        cachedVoices = window.speechSynthesis.getVoices() || [];
      }
    } catch (e) {}
  }
  populateVoices();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }

  function unlockAudio() {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      if (!audioUnlocked) {
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        silentAudio.volume = 0.01;
        const p = silentAudio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            silentAudio.pause();
            audioUnlocked = true;
          }).catch(() => {});
        }
      }
    } catch (e) {}
  }

  // Clean transcript
  function cleanTranscript(raw) {
    if (!raw) return '';
    const trimmed = raw.replace(/\s+/g, ' ').trim();
    if (/([a-zA-Z])\1{3,}/i.test(trimmed)) return '';
    if (!trimmed.includes(' ') && trimmed.length > 6) {
      const vowels = (trimmed.match(/[aeiouy]/gi) || []).length;
      if (vowels / trimmed.length < 0.15) return '';
    }
    return trimmed;
  }

  // Simple Markdown Parser
  function parseMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code blocks / pills
    escaped = escaped.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:4px;font-size:11px;">$1</code>');
    // Line breaks
    escaped = escaped.replace(/\n\n/g, '<div style="height:6px;"></div>');
    escaped = escaped.replace(/\n/g, '<br/>');

    return escaped;
  }

  // Detect card type from content
  function detectCardType(text) {
    const lower = (text || '').toLowerCase();
    if (lower.includes('[card:roi]') || lower.includes('roi calculation') || lower.includes('return on ad spend')) {
      return 'ROI';
    }
    if (lower.includes('[card:pricing]') || lower.includes('pricing tiers') || lower.includes('package options') || (lower.includes('starter') && lower.includes('retainer'))) {
      return 'PRICING';
    }
    if (lower.includes('[card:booking]') || lower.includes('book a call') || lower.includes('discovery consultation') || lower.includes('calendly') || lower.includes('schedule a meeting')) {
      return 'BOOKING';
    }
    return null;
  }

  // Render Interactive Card inside message
  function renderCardHTML(type) {
    const business = clientData?.businessName || 'Quorik Google Ads';
    const email = clientData?.email || 'saramsardar456@gmail.com';
    const phone = clientData?.phone || '+92 370 0146156';

    if (type === 'ROI') {
      return `
        <div style="margin-top:10px;background:rgba(0,229,255,0.06);border:1px solid rgba(0,229,255,0.25);border-radius:12px;padding:12px;color:#fff;">
          <div style="font-size:11px;font-weight:700;color:#00E5FF;display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span>📈</span> ROI & Conversion Projection
          </div>
          <div style="font-size:11px;color:#94A3B8;line-height:1.4;margin-bottom:10px;">
            Targeting a <strong>3.8x - 5.5x ROAS</strong> on Google Ads with dedicated campaign optimization, high-converting landing pages, and AI voice follow-ups.
          </div>
          <div style="display:flex;gap:6px;">
            <button class="q-card-action-btn" data-query="Calculate my exact projected ROAS with $3,000 monthly spend" style="flex:1;background:#00E5FF;border:none;color:#000;font-weight:700;font-size:10px;padding:6px 10px;border-radius:6px;cursor:pointer;">
              Run $3k Spend Model
            </button>
            <button class="q-card-action-btn" data-query="What ad strategies do you use to lower CPC?" style="flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:10px;padding:6px 10px;border-radius:6px;cursor:pointer;">
              How to Lower CPC
            </button>
          </div>
        </div>
      `;
    }

    if (type === 'PRICING') {
      return `
        <div style="margin-top:10px;background:rgba(147,51,234,0.08);border:1px solid rgba(147,51,234,0.3);border-radius:12px;padding:12px;color:#fff;">
          <div style="font-size:11px;font-weight:700;color:#C084FC;display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <span>💼</span> Available Retainers & Tiers
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
            <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px;">
              <div style="font-size:10px;color:#94A3B8;">Starter Ads</div>
              <div style="font-size:13px;font-weight:700;color:#fff;">$990<span style="font-size:9px;color:#64748B;">/mo</span></div>
              <div style="font-size:9px;color:#10B981;margin-top:2px;">Campaign Setup + Weekly QA</div>
            </div>
            <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(0,229,255,0.3);border-radius:8px;padding:8px;">
              <div style="font-size:10px;color:#00E5FF;">Performance Scale</div>
              <div style="font-size:13px;font-weight:700;color:#fff;">$1,890<span style="font-size:9px;color:#64748B;">/mo</span></div>
              <div style="font-size:9px;color:#00E5FF;margin-top:2px;">Ads + Arthur AI Voice Line</div>
            </div>
          </div>
          <button class="q-card-action-btn" data-query="Book a call to discuss the Performance Scale package" style="width:100%;background:#C084FC;color:#000;border:none;font-weight:700;font-size:10px;padding:7px;border-radius:6px;cursor:pointer;">
            Inquire About Packages ➤
          </button>
        </div>
      `;
    }

    if (type === 'BOOKING') {
      return `
        <div style="margin-top:10px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:12px;color:#fff;">
          <div style="font-size:11px;font-weight:700;color:#34D399;display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span>📅</span> Executive Discovery Consultation
          </div>
          <div style="font-size:11px;color:#94A3B8;line-height:1.4;margin-bottom:10px;">
            Schedule a 1-on-1 strategy call with the leadership team for a full campaign audit.
          </div>
          <div style="display:flex;gap:6px;">
            <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(business)}%2C%20I%20would%20like%20to%20schedule%20a%20strategy%20consultation." target="_blank" rel="noopener noreferrer" style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;background:#25D366;color:#000;font-weight:700;font-size:10px;padding:7px 8px;border-radius:6px;text-decoration:none;">
              <span>💬 WhatsApp</span>
            </a>
            <a href="mailto:${email}?subject=Strategy%20Consultation%20Inquiry%20from%20${encodeURIComponent(business)}" style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:10px;padding:7px 8px;border-radius:6px;text-decoration:none;">
              <span>✉️ Send Email</span>
            </a>
          </div>
        </div>
      `;
    }

    return '';
  }

  // Voice Speech Player (Arthur's Voice)
  function speakWithArthur(text, onStartCb, onEndCb) {
    stopSpeaking();
    unlockAudio();
    const token = ++widgetSpeechToken;

    const clean = text
      .replace(/\[CARD:[A-Z_]+\]/gi, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/www\.\S+/gi, '')
      .replace(/[*#_`~]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/\bQuorik\b/gi, 'Korik')
      .replace(/\bAI\b/g, 'A.I.')
      .replace(/\bROI\b/g, 'R.O.I.')
      .replace(/\bROAS\b/g, 'R.O.A.S.')
      .replace(/\bCPC\b/g, 'C.P.C.')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) {
      if (onEndCb) onEndCb();
      return;
    }

    isSpeaking = true;
    updateStatusVisuals();
    if (onStartCb) onStartCb();

    const cacheKey = `arthur:${clean}`;
    if (widgetAudioCache.has(cacheKey)) {
      const cached = widgetAudioCache.get(cacheKey);
      playBase64Mp3(cached.audioData, cached.mimeType, token, clean, onEndCb);
      return;
    }

    // Call server TTS
    fetch(`${serverOrigin}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clean, gender: 'male', personaId: 'arthur' })
    })
    .then(r => r.json())
    .then(data => {
      if (token !== widgetSpeechToken) return;
      if (data && data.audioData) {
        widgetAudioCache.set(cacheKey, { audioData: data.audioData, mimeType: data.mimeType || 'audio/mp3' });
        playBase64Mp3(data.audioData, data.mimeType || 'audio/mp3', token, clean, onEndCb);
      } else {
        fallbackBrowserSpeech(clean, token, onEndCb);
      }
    })
    .catch(() => {
      if (token === widgetSpeechToken) {
        fallbackBrowserSpeech(clean, token, onEndCb);
      }
    });
  }

  function playBase64Mp3(base64Audio, mimeType, token, cleanText, onEndCb) {
    try {
      const audioSrc = `data:${mimeType};base64,${base64Audio}`;
      const audio = new Audio(audioSrc);
      currentAudio = audio;
      audio.preload = 'auto';

      audio.onended = () => {
        if (currentAudio === audio) currentAudio = null;
        isSpeaking = false;
        updateStatusVisuals();
        if (onEndCb) onEndCb();
      };
      audio.onerror = () => {
        if (currentAudio === audio) currentAudio = null;
        isSpeaking = false;
        updateStatusVisuals();
        if (onEndCb) onEndCb();
      };
      audio.play().catch(() => {
        fallbackBrowserSpeech(cleanText, token, onEndCb);
      });
    } catch (e) {
      fallbackBrowserSpeech(cleanText, token, onEndCb);
    }
  }

  function fallbackBrowserSpeech(clean, token, onEndCb) {
    if (!('speechSynthesis' in window) || !clean) {
      isSpeaking = false;
      updateStatusVisuals();
      if (onEndCb) onEndCb();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      // Lower pitch (0.88) provides authoritative male baritone timbre
      utterance.pitch = 0.88;
      utterance.lang = 'en-US';

      const voices = (cachedVoices && cachedVoices.length > 0) ? cachedVoices : (window.speechSynthesis.getVoices() || []);
      
      // Strict exclusion of female voices (including Google US English in Chrome which is female, Zira, Jenny, Aria, etc.)
      const femalePattern = /female|woman|girl|zira|jenny|aria|samantha|victoria|karen|susan|hazel|catherine|linda|heather|helena|eva|fiona|moira|tessa|veena|stephanie|google us english\b/i;

      // Select explicit male voices across Chrome, Windows, macOS, Android
      const maleVoice = voices.find(v => {
        const n = (v.name || '').toLowerCase();
        if (femalePattern.test(n)) return false;
        return n.includes('male') || n.includes('david') || n.includes('mark') || n.includes('george') || 
               n.includes('alex') || n.includes('daniel') || n.includes('oliver') || n.includes('guy') || 
               n.includes('arthur') || n.includes('google uk english male') || n.includes('en-us-x-sfg#male');
      });

      if (maleVoice) {
        utterance.voice = maleVoice;
      } else {
        // Fallback: pick any English voice that is not identified as female
        const nonFemale = voices.find(v => {
          const n = (v.name || '').toLowerCase();
          return !femalePattern.test(n) && (v.lang || '').toLowerCase().startsWith('en');
        });
        if (nonFemale) utterance.voice = nonFemale;
      }

      utterance.onend = () => {
        isSpeaking = false;
        updateStatusVisuals();
        if (onEndCb) onEndCb();
      };
      utterance.onerror = () => {
        isSpeaking = false;
        updateStatusVisuals();
        if (onEndCb) onEndCb();
      };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      isSpeaking = false;
      updateStatusVisuals();
      if (onEndCb) onEndCb();
    }
  }

  function stopSpeaking() {
    widgetSpeechToken++;
    isSpeaking = false;
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {}
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    updateStatusVisuals();
  }

  // Update Status & Waveforms
  function updateStatusVisuals() {
    const statusText = modal.querySelector('#q-voice-status-text');
    const callStatusText = modal.querySelector('#q-call-status-heading');
    const waveContainer = modal.querySelector('#q-call-waveform');

    if (activeMode === 'voice-call') {
      if (callStatusText) {
        if (isSpeaking) {
          callStatusText.innerText = 'Arthur is Speaking...';
        } else if (isThinking) {
          callStatusText.innerText = 'Arthur is Thinking...';
        } else if (isListening) {
          callStatusText.innerText = 'Listening to you... (Speak freely)';
        } else {
          callStatusText.innerText = 'Arthur is Ready';
        }
      }
      if (waveContainer) {
        waveContainer.querySelectorAll('.q-wave-bar').forEach((bar, idx) => {
          if (isSpeaking) {
            const h = 20 + Math.sin(Date.now() / 150 + idx) * 15 + Math.random() * 15;
            bar.style.height = `${Math.min(45, Math.max(8, h))}px`;
            bar.style.background = 'linear-gradient(to top, #00E5FF, #3B82F6)';
          } else if (isListening) {
            const h = 12 + Math.random() * 20;
            bar.style.height = `${h}px`;
            bar.style.background = 'linear-gradient(to top, #10B981, #34D399)';
          } else {
            bar.style.height = '6px';
            bar.style.background = 'rgba(255,255,255,0.2)';
          }
        });
      }
    } else {
      if (statusText) {
        if (isSpeaking) {
          statusText.innerHTML = '<span style="color:#00E5FF;font-weight:600;">🔊 Arthur is speaking...</span>';
        } else if (isThinking) {
          statusText.innerHTML = '<span style="color:#94A3B8;">⚡ Arthur is thinking...</span>';
        } else if (isListening) {
          statusText.innerHTML = '<span style="color:#10B981;font-weight:600;">🎙️ Listening to your voice...</span>';
        } else {
          statusText.innerHTML = 'Type message or tap mic to speak';
        }
      }
    }
  }

  // Build Shell
  root.innerHTML = `
    <div id="quorik-callout-bubble">
      <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg, #1D4ED8, #06B6D4);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;box-shadow:0 0 12px rgba(0,229,255,0.4);">
        🤖
      </div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
          <span class="quorik-online-beacon"></span>
          <span id="q-callout-agent-name" style="font-size:11px;font-weight:700;color:${primaryColor};">Arthur (Executive AI)</span>
          <span style="font-size:9px;background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;color:#94A3B8;">24/7 Live</span>
        </div>
        <div id="q-callout-text" style="font-size:11px;color:#E2E8F0;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          👋 Tap to talk live or ask about Google Ads!
        </div>
      </div>
      <button id="q-callout-close-btn" style="background:transparent;border:none;color:#64748B;cursor:pointer;font-size:13px;padding:2px 4px;border-radius:4px;line-height:1;" title="Dismiss">✕</button>
    </div>

    <div id="quorik-launcher" title="24/7 AI Voice & Strategy Assistant">
      <div style="width:32px;height:32px;border-radius:50%;background:${primaryColor}20;border:1px solid ${primaryColor}55;display:flex;align-items:center;justify-content:center;position:relative;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
        <span class="quorik-online-beacon" style="position:absolute;top:-1px;right:-1px;"></span>
      </div>
      <div style="display:flex;flex-direction:column;line-height:1.15;">
        <span style="font-size:12px;font-weight:700;color:#fff;letter-spacing:0.2px;">Talk with AI</span>
        <span style="font-size:9px;color:${primaryColor};font-weight:600;">24/7 Live Assistant</span>
      </div>
    </div>

    <div id="quorik-modal"></div>
  `;

  const launcher = root.querySelector('#quorik-launcher');
  const modal = root.querySelector('#quorik-modal');
  const calloutBubble = root.querySelector('#quorik-callout-bubble');
  const calloutCloseBtn = root.querySelector('#q-callout-close-btn');

  if (calloutCloseBtn) {
    calloutCloseBtn.onclick = (e) => {
      e.stopPropagation();
      calloutBubble.style.display = 'none';
      sessionStorage.setItem('q_callout_dismissed', 'true');
    };
  }

  if (calloutBubble) {
    calloutBubble.onclick = async () => {
      calloutBubble.style.display = 'none';
      unlockAudio();
      openModal();
    };
  }

  launcher.onclick = () => {
    if (calloutBubble) calloutBubble.style.display = 'none';
    unlockAudio();
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  function openModal() {
    isOpen = true;
    modal.style.display = 'flex';
    renderModalLayout();
    fetchClientStatus();
  }

  function closeModal() {
    isOpen = false;
    modal.style.display = 'none';
    stopSpeaking();
    if (activeMode === 'voice-call') {
      endVoiceCall();
    }
    if (recognition && isListening) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  // Show proactive callout after 2 seconds
  setTimeout(() => {
    if (!isOpen && calloutBubble && !sessionStorage.getItem('q_callout_dismissed')) {
      calloutBubble.style.display = 'flex';
    }
  }, 2000);

  // Fetch Client Data without wiping messages
  async function fetchClientStatus() {
    try {
      const res = await fetch(`${serverOrigin}/api/clients/${clientId}`);
      if (!res.ok) return;
      clientData = await res.json();

      // Update proactive bubble texts
      const agentEl = root.querySelector('#q-callout-agent-name');
      const textEl = root.querySelector('#q-callout-text');
      if (agentEl && clientData.voiceAgentName) {
        agentEl.innerText = clientData.voiceAgentName;
      }
      if (textEl && clientData.businessName) {
        textEl.innerText = `👋 Welcome to ${clientData.businessName}! Tap to speak or ask AI.`;
      }

      // Check quotas
      const vLimit = clientData.monthlyVoiceMinutesLimit || 300;
      const vUsed = clientData.voiceMinutesUsed || 0;
      const tLimit = clientData.monthlyTextChatLimit || 1000;
      const tUsed = clientData.textChatsUsed || 0;

      isVoiceOnlyExhausted = (vUsed >= vLimit) || (clientData.status === 'voice_paused');
      isChatOnlyExhausted = (tUsed >= tLimit) || (clientData.status === 'chat_paused');
      isPausedOrLimited = clientData.status === 'paused' || clientData.status === 'limit_reached' || (isVoiceOnlyExhausted && isChatOnlyExhausted);

      // Update titles in current view safely
      const headerTitle = modal.querySelector('#q-header-business');
      const headerSub = modal.querySelector('#q-header-agent');
      if (headerTitle) headerTitle.innerText = clientData.businessName || 'Quorik Google Ads';
      if (headerSub) headerSub.innerText = clientData.voiceAgentName || 'Arthur (Executive Concierge)';
    } catch (e) {
      console.warn('[Quorik AI] Status fetch error:', e);
    }
  }

  // Renders Main Shell Layout
  function renderModalLayout() {
    const business = clientData?.businessName || 'Quorik Google Ads';
    const agent = clientData?.voiceAgentName || 'Arthur (Executive Concierge)';

    modal.innerHTML = `
      <!-- Header -->
      <div style="background:#0D1322;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;user-select:none;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="position:relative;">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg, #1E3A8A, #06B6D4);border:1px solid rgba(0,229,255,0.4);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:14px;box-shadow:0 0 12px rgba(0,229,255,0.25);">
              🤖
            </div>
            <span class="quorik-online-beacon" style="position:absolute;bottom:0;right:0;border:2px solid #0D1322;"></span>
          </div>
          <div>
            <div id="q-header-business" style="font-size:13px;font-weight:700;color:#fff;line-height:1.2;">${business}</div>
            <div style="font-size:10px;color:#94A3B8;display:flex;align-items:center;gap:4px;margin-top:2px;">
              <span id="q-header-agent" style="color:${primaryColor};font-weight:600;">${agent}</span>
              <span>•</span>
              <span style="color:#10B981;">Online 24/7</span>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div style="display:flex;align-items:center;gap:6px;">
          <button id="q-mode-call-btn" style="background:${activeMode === 'voice-call' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)'};border:1px solid ${activeMode === 'voice-call' ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.4)'};color:${activeMode === 'voice-call' ? '#FCA5A5' : '#6EE7B7'};padding:5px 9px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s;" title="Switch between Voice Call & Text Chat">
            ${activeMode === 'voice-call' ? '<span>📞 End Call</span>' : '<span>🎙️ Call Arthur</span>'}
          </button>

          <button id="q-sound-toggle-btn" style="width:28px;height:28px;border-radius:8px;background:${soundEnabled ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.06)'};border:1px solid ${soundEnabled ? primaryColor : 'rgba(255,255,255,0.1)'};color:${soundEnabled ? primaryColor : '#94A3B8'};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;" title="${soundEnabled ? 'Mute AI Auto-speech' : 'Enable AI Read-Aloud Voice'}">
            ${soundEnabled ? '🔊' : '🔇'}
          </button>

          <button id="q-reset-chat-btn" style="width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#94A3B8;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;" title="Reset Conversation">
            ↺
          </button>

          <button id="q-header-close-btn" style="width:28px;height:28px;border-radius:8px;background:none;border:none;color:#94A3B8;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;" title="Close Window">
            ✕
          </button>
        </div>
      </div>

      <!-- Main Body: Voice Mode OR Chat Mode -->
      <div id="q-mode-container" style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;">
        <!-- Injected via renderModeView() -->
      </div>
    `;

    // Bind Header Controls
    modal.querySelector('#q-header-close-btn').onclick = closeModal;

    modal.querySelector('#q-mode-call-btn').onclick = () => {
      unlockAudio();
      if (activeMode === 'chat') {
        startVoiceCall();
      } else {
        endVoiceCall();
      }
    };

    modal.querySelector('#q-sound-toggle-btn').onclick = () => {
      soundEnabled = !soundEnabled;
      if (!soundEnabled) stopSpeaking();
      renderModalLayout();
    };

    modal.querySelector('#q-reset-chat-btn').onclick = () => {
      if (confirm("Start a new conversation with Arthur? (This will clear chat history)")) {
        stopSpeaking();
        messages = getInitialGreeting();
        saveHistory();
        renderModeView();
      }
    };

    renderModeView();
  }

  function renderModeView() {
    const container = modal.querySelector('#q-mode-container');
    if (!container) return;

    if (activeMode === 'voice-call') {
      renderVoiceCallView(container);
    } else {
      renderChatView(container);
    }
  }

  // --- VIEW: LIVE VOICE CALL MODE ---
  function renderVoiceCallView(container) {
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:24px 20px;background:radial-gradient(circle at 50% 30%, #101B36 0%, #070B14 100%);box-sizing:border-box;">
        
        <!-- Live Call Status Pill -->
        <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:6px 14px;border-radius:20px;">
          <span class="quorik-online-beacon"></span>
          <span style="font-size:11px;color:#E2E8F0;font-weight:600;">Live Line Active</span>
          <span id="q-call-timer" style="font-size:11px;color:#00E5FF;font-family:monospace;font-weight:700;">00:00</span>
        </div>

        <!-- Center Orb & Animated Waves -->
        <div style="display:flex;flex-direction:column;align-items:center;margin:auto 0;">
          <div style="position:relative;width:110px;height:110px;display:flex;align-items:center;justify-content:center;margin-bottom:18px;">
            <div id="q-call-orb-glow" class="q-pulse-wave" style="position:absolute;inset:0;border-radius:50%;background:rgba(0,229,255,0.15);border:2px solid rgba(0,229,255,0.4);"></div>
            <div style="position:relative;width:86px;height:86px;border-radius:50%;background:linear-gradient(135deg, #1E40AF, #0284C7);display:flex;align-items:center;justify-content:center;font-size:42px;box-shadow:0 0 35px rgba(0,229,255,0.5);border:2px solid #fff;">
              🤖
            </div>
          </div>

          <div id="q-call-status-heading" style="font-size:16px;font-weight:700;color:#fff;margin-bottom:4px;text-align:center;">
            Arthur is Speaking...
          </div>
          <div style="font-size:11px;color:#94A3B8;text-align:center;max-width:260px;line-height:1.4;">
            High-fidelity neural voice stream. Speak naturally into your microphone.
          </div>

          <!-- Equalizer Frequency Visualizer Bars -->
          <div id="q-call-waveform" style="display:flex;align-items:center;gap:4px;height:45px;margin-top:20px;">
            ${[...Array(12)].map(() => `
              <div class="q-wave-bar" style="width:4px;height:8px;background:#00E5FF;border-radius:4px;transition:height 0.1s ease, background 0.2s ease;"></div>
            `).join('')}
          </div>

          <!-- Realtime Speech Preview -->
          <div id="q-call-interim-text" style="margin-top:14px;min-height:22px;font-size:11px;color:#34D399;font-style:italic;text-align:center;padding:0 10px;"></div>
        </div>

        <!-- Voice Call Bottom Controls -->
        <div style="display:flex;align-items:center;gap:16px;width:100%;justify-content:center;">
          <button id="q-call-mic-btn" style="width:48px;height:48px;border-radius:50%;background:${isListening ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'};border:2px solid ${isListening ? '#10B981' : 'rgba(255,255,255,0.15)'};color:${isListening ? '#10B981' : '#fff'};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;" title="Toggle Mic">
            ${isListening ? '🎙️' : '🔇'}
          </button>
          
          <button id="q-call-hangup-btn" style="padding:12px 24px;border-radius:24px;background:#DC2626;border:none;color:#fff;font-weight:700;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(220,38,38,0.4);" title="End Call">
            <span>📞 End Voice Call</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#q-call-hangup-btn').onclick = endVoiceCall;
    container.querySelector('#q-call-mic-btn').onclick = () => {
      if (isListening) {
        if (recognition) try { recognition.stop(); } catch (e) {}
        isListening = false;
        updateStatusVisuals();
      } else {
        startRecognitionLoop();
      }
    };
  }

  function startVoiceCall() {
    activeMode = 'voice-call';
    callSeconds = 0;
    renderModalLayout();

    if (callTimer) clearInterval(callTimer);
    callTimer = setInterval(() => {
      callSeconds++;
      const timerEl = modal.querySelector('#q-call-timer');
      if (timerEl) {
        const m = String(Math.floor(callSeconds / 60)).padStart(2, '0');
        const s = String(callSeconds % 60).padStart(2, '0');
        timerEl.innerText = `${m}:${s}`;
      }
      if (isSpeaking || isListening) {
        updateStatusVisuals();
      }
    }, 1000);

    // Initial greeting aloud
    const greeting = "Hello! Arthur here, your executive concierge. How can we assist your business or Google Ads strategy today?";
    speakWithArthur(greeting, () => updateStatusVisuals(), () => {
      startRecognitionLoop();
    });
  }

  function endVoiceCall() {
    activeMode = 'chat';
    if (callTimer) clearInterval(callTimer);
    callTimer = null;
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    isListening = false;
    stopSpeaking();
    renderModalLayout();
  }

  // --- VIEW: STANDARD CHAT MODE ---
  function renderChatView(container) {
    container.innerHTML = `
      <!-- Messages Feed -->
      <div id="q-chat-feed" class="q-scrollbar" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#0A0E1A;">
        <!-- Injected via renderAllMessages() -->
      </div>

      <!-- Quick Action Chips -->
      <div style="padding:8px 12px;background:#0D1322;border-top:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:6px;overflow-x:auto;user-select:none;" class="q-scrollbar">
        <button class="q-chip-btn" data-query="Can you run a free Google Ads campaign audit for my business?">
          <span>⚡ Free Ads Audit</span>
        </button>
        <button class="q-chip-btn" data-query="Calculate my projected ROI with Google Ads and AI voice">
          <span>📊 Calculate ROI</span>
        </button>
        <button class="q-chip-btn" data-query="What are your service packages and monthly retainers?">
          <span>💼 Retainers & Pricing</span>
        </button>
        <button class="q-chip-btn" data-query="I would like to schedule an executive discovery call">
          <span>📅 Book Consultation</span>
        </button>
      </div>

      <!-- Live Typing & Audio Status Banner -->
      <div id="q-voice-status-text" style="padding:4px 14px;background:#0A0E1A;font-size:10px;color:#64748B;border-top:1px solid rgba(255,255,255,0.03);">
        Type message or tap mic to speak
      </div>

      <!-- Input Bar -->
      <div style="padding:10px 12px;background:#0D1322;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:8px;">
        <button id="q-input-mic-btn" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;" title="Speak with Microphone">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </button>

        <input 
          id="q-text-input" 
          type="text" 
          placeholder="Ask Arthur a question or request booking..."
          style="flex:1;background:#070A12;border:1px solid rgba(255,255,255,0.14);color:#fff;padding:9px 14px;border-radius:20px;font-size:12px;outline:none;transition:border-color 0.2s;"
        />

        <button id="q-send-btn" style="width:34px;height:34px;border-radius:50%;background:${primaryColor};border:none;color:#000;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 10px rgba(0,229,255,0.3);" title="Send Message">
          ➤
        </button>
      </div>
    `;

    const input = container.querySelector('#q-text-input');
    const sendBtn = container.querySelector('#q-send-btn');
    const micBtn = container.querySelector('#q-input-mic-btn');

    sendBtn.onclick = () => {
      unlockAudio();
      handleSend(input.value);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        unlockAudio();
        handleSend(input.value);
      }
    };

    micBtn.onclick = () => {
      unlockAudio();
      toggleInputMic();
    };

    // Bind Quick Chips
    container.querySelectorAll('.q-chip-btn').forEach(btn => {
      btn.onclick = () => {
        const query = btn.getAttribute('data-query');
        if (query) {
          unlockAudio();
          handleSend(query);
        }
      };
    });

    renderAllMessages();
  }

  // Render all messages into feed safely
  function renderAllMessages() {
    const feed = modal.querySelector('#q-chat-feed');
    if (!feed) return;
    feed.innerHTML = '';

    messages.forEach(msg => {
      feed.appendChild(createMessageDOM(msg));
    });

    bindCardButtons();
    feed.scrollTop = feed.scrollHeight;
  }

  // Append Single Message to Feed DOM
  function appendSingleMessageDOM(msg) {
    const feed = modal.querySelector('#q-chat-feed');
    if (!feed) return;
    const el = createMessageDOM(msg);
    feed.appendChild(el);
    bindCardButtons();
    feed.scrollTop = feed.scrollHeight;
  }

  function createMessageDOM(msg) {
    const isUser = msg.sender === 'user';
    const row = document.createElement('div');
    row.style.cssText = `display:flex;flex-direction:column;align-items:${isUser ? 'flex-end' : 'flex-start'};gap:3px;`;

    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.style.cssText = `display:flex;align-items:flex-end;gap:6px;max-width:88%;flex-direction:${isUser ? 'row-reverse' : 'row'};`;

    const avatar = document.createElement('div');
    avatar.style.cssText = `width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;background:${isUser ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #1E40AF, #06B6D4)'};border:1px solid ${isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,229,255,0.4)'};`;
    avatar.innerText = isUser ? '👤' : '🤖';

    const bubble = document.createElement('div');
    bubble.style.cssText = `padding:10px 14px;border-radius:18px;font-size:12.5px;line-height:1.45;color:${isUser ? '#000' : '#E2E8F0'};background:${isUser ? primaryColor : '#121829'};border:${isUser ? 'none' : '1px solid rgba(255,255,255,0.1)'};border-bottom-${isUser ? 'right' : 'left'}-radius:4px;box-shadow:0 4px 14px rgba(0,0,0,0.3);position:relative;`;
    
    // Markdown text
    const cleanText = msg.text.replace(/\[CARD:[A-Z_]+\]/g, '').trim();
    bubble.innerHTML = parseMarkdown(cleanText);

    // Render interactive cards if any
    const detected = msg.cardType || detectCardType(msg.text);
    if (detected) {
      bubble.innerHTML += renderCardHTML(detected);
    }

    bubbleWrapper.appendChild(avatar);
    bubbleWrapper.appendChild(bubble);

    row.appendChild(bubbleWrapper);

    if (msg.time) {
      const timeEl = document.createElement('div');
      timeEl.style.cssText = 'font-size:9px;color:#64748B;margin:0 34px;';
      timeEl.innerText = msg.time;
      row.appendChild(timeEl);
    }

    return row;
  }

  // Bind buttons inside rich cards
  function bindCardButtons() {
    const feed = modal.querySelector('#q-chat-feed');
    if (!feed) return;
    feed.querySelectorAll('.q-card-action-btn').forEach(btn => {
      btn.onclick = () => {
        const query = btn.getAttribute('data-query');
        if (query) {
          unlockAudio();
          handleSend(query);
        }
      };
    });
  }

  // Show / Hide Typing Indicator
  function showTypingIndicator() {
    const feed = modal.querySelector('#q-chat-feed');
    if (!feed || feed.querySelector('#q-typing-row')) return;

    const row = document.createElement('div');
    row.id = 'q-typing-row';
    row.style.cssText = 'display:flex;align-items:center;gap:6px;align-self:flex-start;margin-left:4px;';
    row.innerHTML = `
      <div style="width:24px;height:24px;border-radius:50%;background:#121829;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:11px;">🤖</div>
      <div style="background:#121829;border:1px solid rgba(255,255,255,0.1);padding:8px 12px;border-radius:14px;display:flex;align-items:center;gap:4px;">
        <span class="q-typing-dot" style="animation-delay:0s;"></span>
        <span class="q-typing-dot" style="animation-delay:0.2s;"></span>
        <span class="q-typing-dot" style="animation-delay:0.4s;"></span>
      </div>
    `;
    feed.appendChild(row);
    feed.scrollTop = feed.scrollHeight;
  }

  function hideTypingIndicator() {
    const row = modal.querySelector('#q-typing-row');
    if (row) row.remove();
  }

  // Handle Send Message (GUARANTEED NO DISAPPEARING)
  async function handleSend(textToSend) {
    const text = (textToSend || '').trim();
    if (!text || isThinking) return;

    const input = modal.querySelector('#q-text-input');
    if (input) input.value = '';

    // 1. Immediately create and append User Message
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text,
      time: formatTime()
    };
    messages.push(userMsg);
    saveHistory();
    appendSingleMessageDOM(userMsg);

    // 2. Set thinking state & indicator
    isThinking = true;
    updateStatusVisuals();
    showTypingIndicator();

    try {
      const historyPayload = messages
        .filter(m => m.id !== 'msg-init-1')
        .slice(-10)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const res = await fetch(`${serverOrigin}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          clientId: clientId,
          accent: 'arthur'
        })
      });

      hideTypingIndicator();
      isThinking = false;
      updateStatusVisuals();

      if (!res.ok) {
        const errorMsg = {
          id: 'msg-err-' + Date.now(),
          sender: 'ai',
          text: "I am having a brief connection delay. Please feel free to email saramsardar456@gmail.com or tap Support above!",
          time: formatTime()
        };
        messages.push(errorMsg);
        saveHistory();
        appendSingleMessageDOM(errorMsg);
        return;
      }

      const data = await res.json();
      const aiReply = data.text || "I'd be glad to assist you with Google Ads campaign scaling and performance optimization.";
      
      const aiMsg = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        time: formatTime(),
        cardType: detectCardType(aiReply)
      };

      messages.push(aiMsg);
      saveHistory();
      appendSingleMessageDOM(aiMsg);

      // Speak aloud if sound enabled
      if (soundEnabled) {
        speakWithArthur(aiReply);
      }
    } catch (err) {
      hideTypingIndicator();
      isThinking = false;
      updateStatusVisuals();

      const failMsg = {
        id: 'msg-fail-' + Date.now(),
        sender: 'ai',
        text: "Network momentarily interrupted. Please try again or book a direct strategy call.",
        time: formatTime()
      };
      messages.push(failMsg);
      saveHistory();
      appendSingleMessageDOM(failMsg);
    }
  }

  // Microphone toggle in chat mode
  function toggleInputMic() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const inputMicBtn = modal.querySelector('#q-input-mic-btn');
    const input = modal.querySelector('#q-text-input');

    if (isListening) {
      if (recognition) try { recognition.stop(); } catch (e) {}
      isListening = false;
      if (inputMicBtn) {
        inputMicBtn.style.background = 'rgba(255,255,255,0.06)';
        inputMicBtn.style.color = '#94A3B8';
        inputMicBtn.style.borderColor = 'rgba(255,255,255,0.12)';
      }
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      if (inputMicBtn) {
        inputMicBtn.style.background = 'rgba(16,185,129,0.2)';
        inputMicBtn.style.color = '#10B981';
        inputMicBtn.style.borderColor = '#10B981';
      }
      if (input) input.placeholder = 'Listening to your voice...';
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = 0; i < event.results.length; ++i) {
        interim += event.results[i][0].transcript;
      }
      const cleaned = cleanTranscript(interim);
      if (cleaned && input) {
        input.value = cleaned;
      }
    };

    recognition.onend = () => {
      isListening = false;
      if (inputMicBtn) {
        inputMicBtn.style.background = 'rgba(255,255,255,0.06)';
        inputMicBtn.style.color = '#94A3B8';
        inputMicBtn.style.borderColor = 'rgba(255,255,255,0.12)';
      }
      if (input) {
        input.placeholder = 'Ask Arthur a question or request booking...';
        if (input.value.trim()) {
          handleSend(input.value);
        }
      }
    };

    recognition.onerror = () => {
      isListening = false;
      if (inputMicBtn) {
        inputMicBtn.style.background = 'rgba(255,255,255,0.06)';
        inputMicBtn.style.color = '#94A3B8';
        inputMicBtn.style.borderColor = 'rgba(255,255,255,0.12)';
      }
    };

    try {
      recognition.start();
    } catch (e) {
      isListening = false;
    }
  }

  // Voice recognition loop for Live Voice Call Mode
  function startRecognitionLoop() {
    if (activeMode !== 'voice-call') return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalSpoken = '';

    recognition.onstart = () => {
      isListening = true;
      updateStatusVisuals();
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpoken += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      const raw = (finalSpoken + interim).trim();
      const cleaned = cleanTranscript(raw);

      const previewEl = modal.querySelector('#q-call-interim-text');
      if (previewEl && cleaned) {
        previewEl.innerText = `"${cleaned}..."`;
      }

      if (widgetSilenceTimer) clearTimeout(widgetSilenceTimer);
      widgetSilenceTimer = setTimeout(() => {
        const toSend = cleanTranscript(raw || finalSpoken);
        if (toSend && toSend.length > 2) {
          try { recognition.stop(); } catch (e) {}
          isListening = false;
          if (previewEl) previewEl.innerText = '';
          sendCallTurn(toSend);
        }
      }, 750);
    };

    recognition.onerror = () => {
      isListening = false;
      updateStatusVisuals();
    };

    recognition.onend = () => {
      isListening = false;
      updateStatusVisuals();
    };

    try {
      recognition.start();
    } catch (e) {
      isListening = false;
    }
  }

  async function sendCallTurn(userText) {
    if (!userText.trim()) return;

    const userMsg = {
      id: 'call-user-' + Date.now(),
      sender: 'user',
      text: userText,
      time: formatTime()
    };
    messages.push(userMsg);
    saveHistory();

    isThinking = true;
    updateStatusVisuals();

    try {
      const history = messages.map(m => ({
        sender: m.sender === 'user' ? 'customer' : 'ai',
        text: m.text
      }));

      const res = await fetch(`${serverOrigin}/api/voice-agent/simulate-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: 'arthur',
          gender: 'male',
          userQuery: userText,
          conversationHistory: history
        })
      });

      const data = await res.json();
      isThinking = false;

      const aiReply = data.aiSpeechText || "Understood. We can definitely tailor our Google Ads strategies to maximize your conversions and lower cost per acquisition.";
      
      const botMsg = {
        id: 'call-ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        time: formatTime()
      };
      messages.push(botMsg);
      saveHistory();

      speakWithArthur(aiReply, () => updateStatusVisuals(), () => {
        if (activeMode === 'voice-call') {
          startRecognitionLoop();
        }
      });
    } catch (e) {
      isThinking = false;
      const fallbackReply = "We can certainly assist you with campaign audits and performance marketing. Would you like to schedule a quick consultation?";
      messages.push({
        id: 'call-ai-' + Date.now(),
        sender: 'ai',
        text: fallbackReply,
        time: formatTime()
      });
      saveHistory();
      speakWithArthur(fallbackReply, () => updateStatusVisuals(), () => {
        if (activeMode === 'voice-call') {
          startRecognitionLoop();
        }
      });
    }
  }

})();
