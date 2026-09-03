/**
 * Quorik Systems - Multi-Tenant AI Real-Time Voice & Chatbot Embedded Widget
 * Lightweight, zero-dependency, bidirectional Voice-to-Voice and Chat with live kill-switch & granular 4-tier status
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

  // Inject Audio & Animation CSS
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    #quorik-voice-widget-root {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }
    #quorik-callout-bubble {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #0D1322;
      border: 1px solid rgba(0, 229, 255, 0.35);
      padding: 10px 14px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 229, 255, 0.15);
      color: #fff;
      cursor: pointer;
      max-width: 290px;
      animation: q-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #quorik-callout-bubble:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 229, 255, 0.25);
    }
    @keyframes q-slide-in {
      from { opacity: 0; transform: translateY(12px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #quorik-launcher-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #quorik-launcher {
      position: relative;
      height: 56px;
      padding: 0 18px 0 14px;
      border-radius: 28px;
      background: linear-gradient(135deg, #0A0E1A, #161F38);
      border: 2px solid ${primaryColor};
      box-shadow: 0 8px 28px rgba(0, 229, 255, 0.3);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #quorik-launcher:hover {
      transform: scale(1.04);
      box-shadow: 0 12px 36px rgba(0, 229, 255, 0.45);
    }
    .quorik-online-beacon {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
      display: inline-block;
      animation: q-beacon 1.5s infinite ease-in-out;
    }
    @keyframes q-beacon {
      0%, 100% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 12px #10B981; }
    }
    #quorik-modal {
      display: none;
      position: fixed;
      bottom: 84px;
      right: 16px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 540px;
      max-height: calc(100vh - 100px);
      background: #0A0E1A;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      overflow: hidden;
      flex-direction: column;
      color: #fff;
    }
    .quorik-pulse {
      animation: q-pulse 1.2s infinite ease-in-out;
    }
    .quorik-speaking-glow {
      animation: q-glow 1.5s infinite alternate ease-in-out;
    }
    @keyframes q-pulse {
      0% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7); }
      70% { transform: scale(1.04); box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); }
      100% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
    }
    @keyframes q-glow {
      0% { box-shadow: 0 0 10px ${primaryColor}66, inset 0 0 10px ${primaryColor}33; }
      100% { box-shadow: 0 0 24px ${primaryColor}, inset 0 0 16px ${primaryColor}88; }
    }
  `;
  document.head.appendChild(styleEl);

  // Create Root Element
  const root = document.createElement('div');
  root.id = 'quorik-voice-widget-root';
  document.body.appendChild(root);

  // Widget States
  let clientData = null;
  let isOpen = false;
  let isVoiceActive = false;
  let chatHistory = [];
  let isPausedOrLimited = false;
  let isVoiceOnlyExhausted = false;
  let isChatOnlyExhausted = false;
  let isSupportViewOpen = false;
  let recognition = null;
  let isListening = false;
  let isSpeaking = false;
  let isThinking = false;
  let currentAudio = null;
  let activeUtterances = [];
  let voiceStartTime = 0;
  let widgetSpeechToken = 0;
  let widgetTtsAbortController = null;
  let widgetSilenceTimer = null;

  // In-memory audio cache for 0ms instant repeat playback in widget
  const widgetAudioCache = new Map();

  // Unlock Audio on user gesture for iOS Safari & Android
  function unlockAudio() {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    } catch (e) {}
  }

  // Pre-fetch speech voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  const BANNED_ROBOTIC_VOICES = [
    'fred', 'albert', 'ralph', 'zarvox', 'trinoids', 'junior', 'princess',
    'cellos', 'deranged', 'boing', 'bad news', 'bells', 'bubbles', 'hysterical',
    'organ', 'whisper', 'bahh', 'good news', 'pipe organ', 'robot', 'synthetic',
    'jester', 'wobble', 'vintage'
  ];

  function getBestVoice(gender) {
    if (!('speechSynthesis' in window)) return { voice: null, pitch: 1 };
    const allVoices = window.speechSynthesis.getVoices() || [];
    const cleanVoices = allVoices.filter(v => {
      const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
      const isEng = l.startsWith('en-') || l === 'en' || l.startsWith('eng');
      if (!isEng) return false;
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return !BANNED_ROBOTIC_VOICES.some(bad => n.includes(bad));
    });

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
    const pitch = isMobile ? 1.0 : (gender === 'female' ? 1.0 : 0.98);

    if (cleanVoices.length === 0) {
      return { voice: null, pitch: pitch };
    }

    const isFemale = gender === 'female';
    const scoreVoice = (v) => {
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      let score = 0;
      if (n.includes('enhanced') || n.includes('premium') || n.includes('natural') || n.includes('neural')) score += 10;
      if (n.includes('google')) score += 6;
      if (n.includes('siri')) score += 8;
      if (isFemale) {
        if (n.includes('samantha') || n.includes('victoria') || n.includes('karen') || n.includes('aria') || n.includes('jenny') || n.includes('ava') || n.includes('serena')) score += 5;
        if (n.includes('david') || n.includes('mark') || n.includes('daniel') || n.includes('alex') || n.includes('male') || n.includes('arthur')) score -= 20;
      } else {
        if (n.includes('oliver') || n.includes('daniel') || n.includes('alex') || n.includes('tom') || n.includes('arthur') || n.includes('david') || n.includes('guy')) score += 5;
        if (n.includes('samantha') || n.includes('victoria') || n.includes('female') || n.includes('karen') || n.includes('zira')) score -= 20;
      }
      return score;
    };

    const sorted = [...cleanVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return { voice: sorted[0] || cleanVoices[0] || null, pitch: pitch };
  }

  function getClientVoiceProfile() {
    let gender = 'male';
    if (clientData?.voiceGender) {
      gender = String(clientData.voiceGender).toLowerCase().includes('female') ? 'female' : 'male';
    } else if (clientData?.gender) {
      gender = String(clientData.gender).toLowerCase().includes('female') ? 'female' : 'male';
    } else {
      const agentName = (clientData?.voiceAgentName || '').toLowerCase();
      if (agentName.includes('sarah') || agentName.includes('elena') || agentName.includes('zephyr') || agentName.includes('clara') || agentName.includes('emma') || agentName.includes('olivia') || agentName.includes('sophia') || agentName.includes('female')) {
        gender = 'female';
      } else {
        gender = 'male';
      }
    }

    let personaId = 'us-executive';
    const langStr = `${clientData?.voiceLanguage || ''} ${clientData?.voiceAccent || ''} ${clientData?.personaId || ''} ${clientData?.voiceAgentName || ''}`.toLowerCase();
    if (langStr.includes('british') || langStr.includes('uk') || langStr.includes('oliver') || langStr.includes('clara') || langStr.includes('ryan') || langStr.includes('sonia')) {
      personaId = 'uk-refined';
    } else {
      personaId = 'us-executive';
    }

    return { gender, personaId };
  }

  function speakText(text, autoListenAfter = false) {
    if (!text || isVoiceOnlyExhausted) return;
    
    // Stop any ongoing speech and establish new sequence token
    stopSpeaking();
    unlockAudio();
    const token = widgetSpeechToken;

    const clean = text
      .replace(/\[CARD:[A-Z_]+\]/gi, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/www\.\S+/gi, '')
      .replace(/[*#_`~]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/\bQuorik\b/gi, 'Korik')
      .replace(/\bAI\b/g, 'A.I.')
      .replace(/\bROI\b/g, 'R.O.I.')
      .replace(/\bCRM\b/g, 'C.R.M.')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return;

    updateUIStatus('speaking');
    const { gender, personaId } = getClientVoiceProfile();
    const cacheKey = `${gender}:${personaId}:${clean}`;

    const playBase64Mp3 = (base64Audio, mimeType = 'audio/mp3') => {
      if (token !== widgetSpeechToken) return;

      const playAudioPipeline = async () => {
        // 1. Try Web Audio Context buffer decoding (highest reliability in cross-origin & iframes)
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            if (!window._quorikAudioCtx || window._quorikAudioCtx.state === 'closed') {
              window._quorikAudioCtx = new AudioContextClass();
            }
            const actx = window._quorikAudioCtx;
            if (actx.state === 'suspended') {
              await actx.resume().catch(() => {});
            }
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const buffer = await actx.decodeAudioData(bytes.buffer.slice(0));
            if (token !== widgetSpeechToken) return;

            const source = actx.createBufferSource();
            source.buffer = buffer;
            source.connect(actx.destination);

            isSpeaking = true;
            updateUIStatus('speaking');

            source.onended = () => {
              isSpeaking = false;
              if (token === widgetSpeechToken) {
                updateUIStatus('idle');
              }
              if (autoListenAfter && isVoiceActive && token === widgetSpeechToken) {
                setTimeout(() => {
                  if (isVoiceActive && !isSpeaking && !isThinking && token === widgetSpeechToken) {
                    startListening();
                  }
                }, 400);
              }
            };

            source.start(0);
            return;
          }
        } catch (webaudioErr) {
          // Continue to HTML5 Audio
        }

        // 2. HTML5 Audio element fallback
        try {
          const audioSrc = `data:${mimeType};base64,${base64Audio}`;
          const audio = new Audio(audioSrc);
          currentAudio = audio;
          audio.preload = 'auto';

          let finished = false;
          const handleEnd = () => {
            if (finished) return;
            finished = true;
            if (currentAudio === audio) currentAudio = null;
            isSpeaking = false;
            if (token === widgetSpeechToken) {
              updateUIStatus('idle');
            }
            if (autoListenAfter && isVoiceActive && token === widgetSpeechToken) {
              setTimeout(() => {
                if (isVoiceActive && !isSpeaking && !isThinking && token === widgetSpeechToken) {
                  startListening();
                }
              }, 400);
            }
          };

          audio.onplay = () => {
            if (token !== widgetSpeechToken) {
              audio.pause();
              audio.currentTime = 0;
              return;
            }
            isSpeaking = true;
            updateUIStatus('speaking');
          };
          audio.onended = handleEnd;
          audio.onerror = () => {
            if (currentAudio === audio) currentAudio = null;
            if (token === widgetSpeechToken) {
              fallbackSpeechSynthesis(clean, gender, autoListenAfter);
            }
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              if (token === widgetSpeechToken) {
                fallbackSpeechSynthesis(clean, gender, autoListenAfter);
              }
            });
          }
        } catch (err) {
          if (token === widgetSpeechToken) {
            fallbackSpeechSynthesis(clean, gender, autoListenAfter);
          }
        }
      };

      playAudioPipeline();
    };

    // 1. Instant cache check (<5ms playback)
    if (widgetAudioCache.has(cacheKey)) {
      const cached = widgetAudioCache.get(cacheKey);
      playBase64Mp3(cached.audioData, cached.mimeType);
      return;
    }

    // 2. Fetch server-side Neural Audio (/api/tts) for 100% genuine studio voice on all devices
    const requestTts = (isRetry = false) => {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      widgetTtsAbortController = controller;
      const timeoutId = setTimeout(() => {
        if (controller) controller.abort();
      }, 8000);

      fetch(`${serverOrigin}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller ? controller.signal : undefined,
        body: JSON.stringify({ text: clean, gender, personaId })
      })
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeoutId);
        if (widgetTtsAbortController === controller) {
          widgetTtsAbortController = null;
        }
        if (token !== widgetSpeechToken) return;

        if (data && data.audioData) {
          widgetAudioCache.set(cacheKey, {
            audioData: data.audioData,
            mimeType: data.mimeType || 'audio/mp3'
          });
          playBase64Mp3(data.audioData, data.mimeType || 'audio/mp3');
          return;
        }
        if (!isRetry) {
          requestTts(true);
        } else {
          fallbackSpeechSynthesis(clean, gender, autoListenAfter);
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (widgetTtsAbortController === controller) {
          widgetTtsAbortController = null;
        }
        if (token !== widgetSpeechToken) return;
        if (!isRetry) {
          requestTts(true);
        } else {
          fallbackSpeechSynthesis(clean, gender, autoListenAfter);
        }
      });
    };

    requestTts(false);
  }

  function fallbackSpeechSynthesis(clean, gender, autoListenAfter) {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(clean);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
        utterance.rate = isMobile ? 1.0 : 0.98;
        utterance.lang = 'en-US';

        const bestVoiceObj = getBestVoice(gender);
        if (bestVoiceObj.voice) {
          utterance.voice = bestVoiceObj.voice;
        }
        utterance.pitch = bestVoiceObj.pitch;

        utterance.onstart = () => {
          isSpeaking = true;
          updateUIStatus('speaking');
        };

        utterance.onend = () => {
          isSpeaking = false;
          activeUtterances = [];
          updateUIStatus('idle');
          if (autoListenAfter && isVoiceActive) {
            setTimeout(() => {
              if (isVoiceActive && !isSpeaking && !isThinking) {
                startListening();
              }
            }, 400);
          }
        };

        utterance.onerror = () => {
          isSpeaking = false;
          activeUtterances = [];
          updateUIStatus('idle');
        };

        activeUtterances.push(utterance);
        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('[Quorik Voice Widget] SpeechSynthesis failed:', err);
      }
    }
    isSpeaking = false;
    updateUIStatus('idle');
  }

  function stopSpeaking() {
    widgetSpeechToken++;
    if (widgetTtsAbortController) {
      try {
        widgetTtsAbortController.abort();
      } catch (e) {}
      widgetTtsAbortController = null;
    }
    isSpeaking = false;
    activeUtterances = [];
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.src = '';
      } catch (e) {}
      currentAudio = null;
    }
    updateUIStatus('idle');
  }

  function updateUIStatus(state) {
    const vBtn = modal?.querySelector('#q-voice-toggle-btn');
    const statusText = modal?.querySelector('#q-voice-status-text');
    const banner = modal?.querySelector('#q-voice-active-banner');
    if (!vBtn) return;

    if (isVoiceOnlyExhausted) {
      vBtn.classList.remove('quorik-pulse', 'quorik-speaking-glow');
      vBtn.style.background = 'rgba(239,68,68,0.12)';
      vBtn.style.borderColor = 'rgba(239,68,68,0.4)';
      vBtn.style.color = '#F87171';
      vBtn.title = 'Voice calling paused • 24/7 AI Text Chat is active.';
      if (statusText) statusText.innerText = '🎙️ Voice calling paused • 24/7 Text Chat is active';
      return;
    }

    if (state === 'listening') {
      vBtn.classList.add('quorik-pulse');
      vBtn.classList.remove('quorik-speaking-glow');
      vBtn.style.background = '#EF4444';
      vBtn.style.borderColor = '#EF4444';
      vBtn.style.color = '#fff';
      if (statusText) statusText.innerText = 'Listening to your voice... (Speak now)';
      if (banner) {
        banner.style.display = 'flex';
        banner.innerHTML = '<span style="width:8px;height:8px;border-radius:50%;background:#EF4444;display:inline-block;" class="quorik-pulse"></span> <span style="color:#EF4444;font-weight:600;font-size:11px;">Listening... Speak now</span>';
      }
    } else if (state === 'speaking') {
      vBtn.classList.remove('quorik-pulse');
      vBtn.classList.add('quorik-speaking-glow');
      vBtn.style.background = primaryColor;
      vBtn.style.borderColor = primaryColor;
      vBtn.style.color = '#000';
      if (statusText) statusText.innerText = 'AI Agent is speaking...';
      if (banner) {
        banner.style.display = 'flex';
        banner.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:${primaryColor};display:inline-block;"></span> <span style="color:${primaryColor};font-weight:600;font-size:11px;">AI Speaking...</span>`;
      }
    } else if (state === 'thinking') {
      vBtn.classList.remove('quorik-pulse', 'quorik-speaking-glow');
      vBtn.style.background = 'rgba(255,255,255,0.1)';
      vBtn.style.borderColor = 'rgba(255,255,255,0.2)';
      vBtn.style.color = '#94A3B8';
      if (statusText) statusText.innerText = 'Processing response...';
      if (banner) {
        banner.style.display = 'flex';
        banner.innerHTML = '<span style="color:#94A3B8;font-size:11px;">Processing...</span>';
      }
    } else {
      vBtn.classList.remove('quorik-pulse', 'quorik-speaking-glow');
      vBtn.style.background = isVoiceActive ? `${primaryColor}22` : 'rgba(255,255,255,0.06)';
      vBtn.style.borderColor = isVoiceActive ? primaryColor : 'rgba(255,255,255,0.15)';
      vBtn.style.color = isVoiceActive ? primaryColor : '#94A3B8';
      if (isChatOnlyExhausted) {
        if (statusText) statusText.innerText = '💬 Text chat paused • Tap microphone to speak voice-to-voice';
      } else {
        if (statusText) statusText.innerText = isVoiceActive ? 'Voice Mode Active • Tap mic to speak' : 'Type message or tap mic to speak';
      }
      if (banner && !isVoiceActive) {
        banner.style.display = 'none';
      }
    }
  }

  // Render Launcher Button & Proactive Greeting Callout
  root.innerHTML = `
    <div id="quorik-callout-bubble" style="display:none;">
      <div style="width:32px;height:32px;border-radius:50%;background:${primaryColor}22;border:1px solid ${primaryColor}66;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">
        🤖
      </div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
          <span class="quorik-online-beacon"></span>
          <span id="q-callout-agent-name" style="font-size:11px;font-weight:700;color:${primaryColor};">AI Concierge</span>
          <span style="font-size:9px;background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;color:#94A3B8;">24/7 Live</span>
        </div>
        <div id="q-callout-text" style="font-size:11px;color:#E2E8F0;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          👋 Have questions? Tap to talk live or ask AI!
        </div>
      </div>
      <button id="q-callout-close-btn" style="background:transparent;border:none;color:#64748B;cursor:pointer;font-size:12px;padding:2px 4px;border-radius:4px;line-height:1;" title="Dismiss">✕</button>
    </div>

    <div id="quorik-launcher-container">
      <div id="quorik-launcher" title="24/7 AI Voice & Chat Assistant">
        <div style="width:32px;height:32px;border-radius:50%;background:${primaryColor}18;display:flex;align-items:center;justify-content:center;position:relative;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
          </svg>
          <span class="quorik-online-beacon" style="position:absolute;top:-1px;right:-1px;"></span>
        </div>
        <div style="display:flex;flex-direction:column;line-height:1.1;">
          <span style="font-size:12px;font-weight:700;color:#fff;letter-spacing:0.2px;">Talk with AI</span>
          <span style="font-size:9px;color:${primaryColor};font-weight:600;">24/7 Live Assistant</span>
        </div>
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
    };
  }

  if (calloutBubble) {
    calloutBubble.onclick = async () => {
      calloutBubble.style.display = 'none';
      unlockAudio();
      isOpen = true;
      modal.style.display = 'flex';
      await fetchClientStatus();
    };
  }

  // Show proactive callout after 1.8s delay
  setTimeout(() => {
    if (!isOpen && calloutBubble && (!sessionStorage.getItem('q_callout_dismissed'))) {
      calloutBubble.style.display = 'flex';
    }
  }, 1800);

  // Verify Client Status Live from Quorik Backend
  async function fetchClientStatus() {
    try {
      const res = await fetch(`${serverOrigin}/api/clients/${clientId}`);
      if (!res.ok) {
        isPausedOrLimited = true;
        isVoiceOnlyExhausted = false;
        isChatOnlyExhausted = false;
        renderModal();
        return null;
      }
      clientData = await res.json();
      
      // Update proactive callout bubble with client information
      const agentEl = root.querySelector('#q-callout-agent-name');
      const textEl = root.querySelector('#q-callout-text');
      if (agentEl && clientData.voiceAgentName) {
        agentEl.innerText = clientData.voiceAgentName.split(' ')[0] + ' (AI)';
      }
      if (textEl && clientData.businessName) {
        textEl.innerText = `👋 Welcome to ${clientData.businessName}! Tap to speak or ask AI.`;
      }
      
      const vLimit = clientData.monthlyVoiceMinutesLimit || 300;
      const vUsed = clientData.voiceMinutesUsed || 0;
      const tLimit = clientData.monthlyTextChatLimit || 1000;
      const tUsed = clientData.textChatsUsed || 0;

      const vExhausted = (vUsed >= vLimit) || (clientData.status === 'voice_paused');
      const tExhausted = (tUsed >= tLimit) || (clientData.status === 'chat_paused');

      if (clientData.status === 'paused' || clientData.status === 'limit_reached' || (vExhausted && tExhausted)) {
        isPausedOrLimited = true;
        isVoiceOnlyExhausted = false;
        isChatOnlyExhausted = false;
      } else if (vExhausted && !tExhausted) {
        // Voice Off, Chat Active
        isPausedOrLimited = false;
        isVoiceOnlyExhausted = true;
        isChatOnlyExhausted = false;
      } else if (!vExhausted && tExhausted) {
        // Chat Off, Voice Active
        isPausedOrLimited = false;
        isVoiceOnlyExhausted = false;
        isChatOnlyExhausted = true;
      } else {
        // All On
        isPausedOrLimited = false;
        isVoiceOnlyExhausted = false;
        isChatOnlyExhausted = false;
      }

      renderModal();
      return clientData;
    } catch (e) {
      console.warn('[Quorik AI] Status check failed:', e);
      return null;
    }
  }

  function renderModal() {
    const business = clientData?.businessName || 'Business Concierge';
    const agent = clientData?.voiceAgentName || 'Arthur (AI Concierge)';

    // Support View Mode
    if (isSupportViewOpen) {
      modal.innerHTML = `
        <div style="padding:16px;height:100%;display:flex;flex-direction:column;background:#0A0E1A;box-sizing:border-box;overflow-y:auto;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:28px;height:28px;border-radius:50%;background:${primaryColor}22;border:1px solid ${primaryColor}66;display:flex;align-items:center;justify-content:center;color:${primaryColor};font-size:13px;">
                ⚙️
              </div>
              <div>
                <div style="font-size:13px;font-weight:700;color:#fff;">Quorik Priority Support</div>
                <div style="font-size:10px;color:#94A3B8;">${business} Portal Assistance</div>
              </div>
            </div>
            <button id="q-support-back-btn" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:#94A3B8;cursor:pointer;font-size:11px;padding:5px 10px;border-radius:8px;transition:all 0.2s;">
              ✕ Close
            </button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
            <a href="https://wa.me/923700146156?text=Hello%20Quorik%20AI%20Support%2C%20I%20need%20assistance%20with%20our%20AI%20Voice%20Widget%20quota%20and%20activation%20for%20${encodeURIComponent(business)}." target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:6px;background:#25D366;color:#000;padding:10px 12px;border-radius:10px;text-decoration:none;font-weight:700;font-size:11px;box-shadow:0 4px 14px rgba(37,211,102,0.25);">
              <span>💬 WhatsApp</span>
            </a>
            <a href="tel:+923700146156" style="display:flex;align-items:center;justify-content:center;gap:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:10px 12px;border-radius:10px;text-decoration:none;font-weight:600;font-size:11px;">
              <span>📞 Call Admin</span>
            </a>
          </div>

          <form id="q-support-form" style="display:flex;flex-direction:column;gap:10px;flex:1;">
            <div style="font-size:11px;color:#94A3B8;">Or submit an urgent ticket directly to Quorik Engineering:</div>
            <input id="q-sup-name" type="text" placeholder="Your Name" required style="background:#05060A;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:9px 12px;border-radius:8px;font-size:12px;outline:none;" />
            <input id="q-sup-contact" type="text" placeholder="Your WhatsApp / Phone or Email" required style="background:#05060A;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:9px 12px;border-radius:8px;font-size:12px;outline:none;" />
            <textarea id="q-sup-message" placeholder="Describe your request (e.g. quota recharge, custom integration, or resume assistant)..." rows="3" required style="background:#05060A;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:9px 12px;border-radius:8px;font-size:12px;outline:none;resize:none;font-family:inherit;line-height:1.4;"></textarea>
            
            <button type="submit" id="q-sup-submit-btn" style="background:${primaryColor};border:none;color:#000;font-weight:700;padding:10px;border-radius:8px;cursor:pointer;font-size:12px;margin-top:2px;transition:opacity 0.2s;">
              Send Priority Ticket ➤
            </button>
            <div id="q-sup-feedback" style="font-size:11px;text-align:center;min-height:16px;"></div>
          </form>

          <div style="font-size:10px;color:#64748B;text-align:center;margin-top:8px;border-top:1px solid rgba(255,255,255,0.05);padding-top:8px;">
            Support: <a href="mailto:saramsardar456@gmail.com" style="color:${primaryColor};text-decoration:none;">saramsardar456@gmail.com</a>
          </div>
        </div>
      `;

      modal.querySelector('#q-support-back-btn').onclick = () => {
        isSupportViewOpen = false;
        renderModal();
      };

      const form = modal.querySelector('#q-support-form');
      if (form) {
        form.onsubmit = async (e) => {
          e.preventDefault();
          const btn = modal.querySelector('#q-sup-submit-btn');
          const feedback = modal.querySelector('#q-sup-feedback');
          const name = modal.querySelector('#q-sup-name')?.value || '';
          const contact = modal.querySelector('#q-sup-contact')?.value || '';
          const message = modal.querySelector('#q-sup-message')?.value || '';
          
          if (btn) {
            btn.innerText = 'Submitting Ticket...';
            btn.style.opacity = '0.7';
          }
          if (feedback) feedback.innerHTML = '';

          try {
            const res = await fetch(`${serverOrigin}/api/contacts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: name,
                email: contact.includes('@') ? contact : `support-${clientId}@quoriksystems.com`,
                phone: contact.replace(/[^\d+]/g, '') || contact,
                service: 'AI Voice Widget Quota & Activation Support',
                message: `[Priority Support Ticket from Client: ${clientId} (${business})]\nContact: ${contact}\nUser: ${name}\n\nMessage:\n${message}`
              })
            });

            if (res.ok) {
              if (feedback) feedback.innerHTML = '<span style="color:#10B981;font-weight:600;">✅ Ticket submitted! Our support team will contact you shortly.</span>';
              if (btn) btn.innerText = '✓ Ticket Submitted';
              setTimeout(() => {
                isSupportViewOpen = false;
                renderModal();
              }, 2500);
            } else {
              if (feedback) feedback.innerHTML = '<span style="color:#EF4444;">Could not submit ticket. Please click WhatsApp button above.</span>';
              if (btn) {
                btn.innerText = 'Send Priority Ticket ➤';
                btn.style.opacity = '1';
              }
            }
          } catch (err) {
            if (feedback) feedback.innerHTML = '<span style="color:#EF4444;">Network error. Please click WhatsApp button above.</span>';
            if (btn) {
              btn.innerText = 'Send Priority Ticket ➤';
              btn.style.opacity = '1';
            }
          }
        };
      }
      return;
    }

    // Fully Paused or Both Quotas Reached Screen (All Off)
    if (isPausedOrLimited) {
      modal.innerHTML = `
        <div style="padding:24px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#06080E;box-sizing:border-box;">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.35);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>
          </div>
          <h4 style="margin:0 0 8px;font-size:16px;font-weight:700;color:#fff;">Assistant Currently Paused</h4>
          <p style="margin:0 0 20px;font-size:12px;color:#94A3B8;line-height:1.5;max-width:280px;">
            This voice and chat portal is currently paused by admin or has completed the monthly usage allowance.
          </p>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:260px;">
            <button id="q-contact-support-btn" style="padding:11px 16px;background:${primaryColor};color:#000;border:none;border-radius:10px;font-weight:700;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px rgba(0,229,255,0.25);">
              <span>🛠️ Contact Support & Upgrade</span>
            </button>
            <a href="https://wa.me/923700146156?text=Hello%20Quorik%20AI%20Support%2C%20I%20need%20assistance%20with%20our%20AI%20Voice%20Widget%20quota%20and%20activation%20for%20${encodeURIComponent(business)}." target="_blank" rel="noopener noreferrer" style="padding:10px 16px;background:#25D366;color:#000;border-radius:10px;text-decoration:none;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;">
              <span>💬 WhatsApp Priority Desk</span>
            </a>
          </div>
          <button id="q-close-paused-btn" style="margin-top:16px;background:none;border:none;color:#64748B;font-size:11px;cursor:pointer;padding:4px 8px;">
            Close Window ✕
          </button>
        </div>
      `;

      modal.querySelector('#q-contact-support-btn').onclick = () => {
        isSupportViewOpen = true;
        renderModal();
      };
      modal.querySelector('#q-close-paused-btn').onclick = () => {
        isOpen = false;
        modal.style.display = 'none';
      };
      return;
    }

    // Active Chat Interface (All On / Voice Off / Chat Off)
    modal.innerHTML = `
      <div style="background:#0F1424;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:${primaryColor}22;border:1px solid ${primaryColor}66;display:flex;align-items:center;justify-content:center;color:${primaryColor};font-weight:bold;font-size:13px;">
            ${business.charAt(0)}
          </div>
          <div>
            <div style="font-size:13px;font-weight:bold;color:#fff;">${business}</div>
            <div style="font-size:11px;color:${primaryColor};display:flex;align-items:center;gap:4px;">
              <span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;"></span> ${agent}
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button id="q-header-support-btn" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#94A3B8;cursor:pointer;font-size:10px;padding:4px 8px;border-radius:6px;" title="Support & Quota Help">
            🛠️ Support
          </button>
          <button id="q-close-btn" style="background:none;border:none;color:#94A3B8;cursor:pointer;font-size:18px;padding:4px;" title="Close">✕</button>
        </div>
      </div>

      ${isVoiceOnlyExhausted ? `
        <div style="background:rgba(245,158,11,0.12);border-bottom:1px solid rgba(245,158,11,0.25);padding:7px 14px;font-size:11px;color:#FCD34D;display:flex;align-items:center;gap:6px;justify-content:center;">
          <span>🎙️</span> <span>Voice calling is paused • <strong>24/7 AI Text Chat is active!</strong></span>
        </div>
      ` : ''}

      ${isChatOnlyExhausted ? `
        <div style="background:rgba(59,130,246,0.12);border-bottom:1px solid rgba(59,130,246,0.25);padding:7px 14px;font-size:11px;color:#93C5FD;display:flex;align-items:center;gap:6px;justify-content:center;">
          <span>💬</span> <span>AI Text Chat is paused • <strong>Tap the mic for Voice-to-Voice Call!</strong></span>
        </div>
      ` : ''}

      <div id="q-voice-active-banner" style="display:none;background:rgba(0,229,255,0.08);border-bottom:1px solid rgba(0,229,255,0.15);padding:6px 14px;align-items:center;gap:8px;justify-content:center;">
      </div>

      <div id="q-chat-feed" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;font-size:13px;background:#070A12;">
        <div style="align-self:flex-start;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:10px 14px;border-radius:14px;border-top-left-radius:2px;max-width:85%;line-height:1.4;">
          Hello! I am the 24/7 AI Concierge for <strong>${business}</strong>. ${
            isChatOnlyExhausted 
              ? 'Please tap the microphone button below to speak directly with our AI assistant.' 
              : isVoiceOnlyExhausted 
              ? 'Please type below to chat or request an appointment.' 
              : 'You can speak to me or type below to book an appointment or ask about our services!'
          }
        </div>
      </div>

      <div style="padding:6px 16px;background:#0A0E1A;border-top:1px solid rgba(255,255,255,0.05);font-size:10px;color:#64748B;" id="q-voice-status-text">
        ${
          isChatOnlyExhausted 
            ? '💬 Text chat paused • Tap microphone button to speak' 
            : isVoiceOnlyExhausted 
            ? '🎙️ Voice paused • Type below for instant AI assistance' 
            : 'Tap microphone to speak voice-to-voice or type below'
        }
      </div>

      <div style="padding:12px;background:#0F1424;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:8px;">
        <button id="q-voice-toggle-btn" style="width:42px;height:42px;border-radius:50%;background:${isVoiceOnlyExhausted ? 'rgba(239,68,68,0.12)' : primaryColor + '22'};border:1px solid ${isVoiceOnlyExhausted ? 'rgba(239,68,68,0.4)' : primaryColor};color:${isVoiceOnlyExhausted ? '#F87171' : primaryColor};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;" title="${isVoiceOnlyExhausted ? 'Voice calling paused. Text chat is active.' : 'Start Voice-to-Voice Call'}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </button>
        <input 
          id="q-text-input" 
          type="text" 
          placeholder="${isChatOnlyExhausted ? 'AI Text Chat paused • Tap mic button to speak' : 'Ask a question or request booking...'}" 
          ${isChatOnlyExhausted ? 'disabled style="flex:1;background:#05060A;border:1px solid rgba(255,255,255,0.06);color:#64748B;padding:10px 14px;border-radius:20px;font-size:12px;outline:none;cursor:not-allowed;opacity:0.6;"' : 'style="flex:1;background:#05060A;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:10px 14px;border-radius:20px;font-size:12px;outline:none;"'} 
        />
        <button 
          id="q-send-btn" 
          ${isChatOnlyExhausted ? 'disabled style="background:rgba(255,255,255,0.1);border:none;color:#64748B;font-weight:bold;width:34px;height:34px;border-radius:50%;cursor:not-allowed;display:flex;align-items:center;justify-content:center;flex-shrink:0;"' : `style="background:${primaryColor};border:none;color:#000;font-weight:bold;width:34px;height:34px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;"`}
        >
          ➤
        </button>
      </div>
    `;

    // Event listeners
    modal.querySelector('#q-close-btn').onclick = () => {
      isOpen = false;
      isVoiceActive = false;
      stopSpeaking();
      if (isListening) recognition?.stop();
      modal.style.display = 'none';
    };

    const headerSupportBtn = modal.querySelector('#q-header-support-btn');
    if (headerSupportBtn) {
      headerSupportBtn.onclick = () => {
        isSupportViewOpen = true;
        renderModal();
      };
    }

    const textInput = modal.querySelector('#q-text-input');
    const sendBtn = modal.querySelector('#q-send-btn');
    const voiceBtn = modal.querySelector('#q-voice-toggle-btn');

    if (!isChatOnlyExhausted) {
      sendBtn.onclick = () => {
        unlockAudio();
        handleSendChat(textInput.value, false);
      };
      textInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          unlockAudio();
          handleSendChat(textInput.value, false);
        }
      };
    }

    voiceBtn.onclick = () => {
      if (isVoiceOnlyExhausted) {
        const statusText = modal.querySelector('#q-voice-status-text');
        if (statusText) {
          statusText.innerHTML = '<span style="color:#FCA5A5;">🎙️ Voice calling is paused. Please type below!</span>';
        }
        textInput.focus();
        return;
      }
      unlockAudio();
      toggleVoiceCall();
    };
  }

  async function handleSendChat(text, isVoiceMode = false) {
    if (!text || !text.trim() || isThinking) return;
    const input = modal.querySelector('#q-text-input');
    if (input) input.value = '';

    if (isPausedOrLimited) return;
    // Refresh status asynchronously in background without blocking current message
    fetchClientStatus().catch(() => {});

    appendMessage('user', text);
    appendMessage('ai', 'Thinking...');
    isThinking = true;
    updateUIStatus('thinking');

    const isVoiceCall = Boolean((isVoiceMode || isVoiceActive) && !isVoiceOnlyExhausted);
    let measuredSeconds = 0;
    if (isVoiceCall && voiceStartTime > 0) {
      measuredSeconds = Math.max(8, Math.round((Date.now() - voiceStartTime) / 1000));
    }

    try {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = setTimeout(() => controller?.abort(), 18000);

      const res = await fetch(`${serverOrigin}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller ? controller.signal : undefined,
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          clientId: clientId,
          isVoice: isVoiceCall,
          isVoiceMode: isVoiceCall,
          durationSeconds: measuredSeconds > 0 ? measuredSeconds : undefined
        })
      });

      clearTimeout(timeoutId);
      removeLastThinking();
      isThinking = false;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.voiceQuotaExhausted) {
          isVoiceOnlyExhausted = true;
          appendMessage('ai', 'Voice calling is paused. I am happy to continue assisting you right here in text chat!');
          updateUIStatus('idle');
          return;
        }
        if (errorData.chatPaused) {
          isChatOnlyExhausted = true;
          appendMessage('ai', 'AI Text Chat is currently paused. Please tap the microphone button to start a voice call!');
          updateUIStatus('idle');
          return;
        }
        appendMessage('ai', 'Service is temporarily busy. Please try again or tap Support.');
        updateUIStatus('idle');
        return;
      }

      const data = await res.json();

      if (data.text) {
        appendMessage('ai', data.text);
        
        // Save conversation history
        chatHistory.push({ role: 'user', parts: [{ text }] });
        chatHistory.push({ role: 'model', parts: [{ text: data.text }] });

        // Increment chat log count in background
        if (!isVoiceCall) {
          fetch(`${serverOrigin}/api/clients/${clientId}/log-text-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
          }).catch(() => {});
        }

        // Only speak aloud if visitor used Voice mode AND voice is not exhausted
        if (isVoiceCall && !isVoiceOnlyExhausted) {
          speakText(data.text, true);
        } else {
          stopSpeaking();
          updateUIStatus('idle');
        }
      }
    } catch (e) {
      removeLastThinking();
      isThinking = false;
      appendMessage('ai', 'Connection error. Please try again.');
      updateUIStatus('idle');
    }
  }

  function appendMessage(sender, text) {
    const feed = modal.querySelector('#q-chat-feed');
    if (!feed) return;
    const div = document.createElement('div');
    if (sender === 'user') {
      div.style.cssText = `align-self:flex-end;background:${primaryColor};color:#000;font-weight:500;padding:10px 14px;border-radius:14px;border-top-right-radius:2px;max-width:85%;line-height:1.4;`;
      div.innerText = text;
    } else {
      div.className = text === 'Thinking...' ? 'q-thinking' : '';
      div.style.cssText = 'align-self:flex-start;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:10px 14px;border-radius:14px;border-top-left-radius:2px;max-width:85%;line-height:1.4;color:#fff;';
      div.innerText = text;
    }
    feed.appendChild(div);
    feed.scrollTop = feed.scrollHeight;
  }

  function removeLastThinking() {
    const thinking = modal?.querySelector('.q-thinking');
    if (thinking) thinking.remove();
  }

  function startListening() {
    if (isVoiceOnlyExhausted) return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      try { recognition?.stop(); } catch (e) {}
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = clientData?.voiceLanguage?.includes('Spanish') ? 'es-ES' : 
                     clientData?.voiceLanguage?.includes('German') ? 'de-DE' : 
                     clientData?.voiceLanguage?.includes('French') ? 'fr-FR' : 'en-US';

    let accumulatedText = '';

    recognition.onstart = () => {
      isListening = true;
      voiceStartTime = Date.now();
      updateUIStatus('listening');
    };

    recognition.onresult = (event) => {
      let currentText = '';
      for (let i = 0; i < event.results.length; ++i) {
        currentText += event.results[i][0].transcript + ' ';
      }
      accumulatedText = currentText.trim();
      
      const statusText = modal?.querySelector('#q-voice-status-text');
      if (statusText && accumulatedText) {
        statusText.innerText = `"${accumulatedText}"`;
      }

      if (widgetSilenceTimer) clearTimeout(widgetSilenceTimer);
      widgetSilenceTimer = setTimeout(() => {
        if (accumulatedText) {
          try { recognition.stop(); } catch (e) {}
          isListening = false;
          updateUIStatus('idle');
          handleSendChat(accumulatedText, true);
        }
      }, 750);
    };

    recognition.onerror = (e) => {
      console.warn('[Quorik Voice Widget] Recognition error:', e);
      isListening = false;
      updateUIStatus('idle');
    };

    recognition.onend = () => {
      isListening = false;
      if (!isThinking && !isSpeaking) {
        updateUIStatus('idle');
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn('[Quorik Voice Widget] Could not start recognition:', e);
    }
  }

  function toggleVoiceCall() {
    if (isVoiceOnlyExhausted) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (isListening) {
      try { recognition?.stop(); } catch (e) {}
      isListening = false;
      isVoiceActive = false;
      updateUIStatus('idle');
      return;
    }

    isVoiceActive = true;
    startListening();
  }

  launcher.onclick = async () => {
    if (calloutBubble) calloutBubble.style.display = 'none';
    unlockAudio();
    isOpen = !isOpen;
    if (isOpen) {
      modal.style.display = 'flex';
      await fetchClientStatus();
    } else {
      modal.style.display = 'none';
      stopSpeaking();
      if (isListening) recognition?.stop();
    }
  };

  // Initial check
  fetchClientStatus();
})();
