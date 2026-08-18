/**
 * Quorik Systems - Multi-Tenant AI Real-Time Voice & Chatbot Embedded Widget
 * Lightweight, zero-dependency, bidirectional Voice-to-Voice and Chat with live kill-switch
 */
(function() {
  const currentScript = document.currentScript || document.querySelector('script[data-client-id]');
  if (!currentScript) return;

  const clientId = currentScript.getAttribute('data-client-id');
  const serverOrigin = new URL(currentScript.src).origin;
  const primaryColor = currentScript.getAttribute('data-accent') || '#00E5FF';

  if (!clientId) {
    console.error('[Quorik AI] Error: data-client-id attribute is required on the script tag.');
    return;
  }

  // Inject Audio & Animation CSS
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    #quorik-voice-widget-root {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #quorik-launcher {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0A0E1A, #161F38);
      border: 2px solid ${primaryColor};
      box-shadow: 0 8px 32px rgba(0, 229, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #quorik-launcher:hover {
      transform: scale(1.06);
      box-shadow: 0 12px 36px rgba(0, 229, 255, 0.4);
    }
    #quorik-modal {
      display: none;
      position: fixed;
      bottom: 94px;
      right: 24px;
      width: 375px;
      max-width: calc(100vw - 40px);
      height: 530px;
      max-height: calc(100vh - 120px);
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
  let recognition = null;
  let isListening = false;
  let isSpeaking = false;
  let isThinking = false;
  let currentAudio = null;
  let activeUtterances = [];
  let voiceStartTime = 0;

  // Unlock Audio on user gesture (Crucial for mobile and modern Chrome/Safari autoplay policies)
  function unlockAudio() {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const silent = new SpeechSynthesisUtterance('');
        silent.volume = 0;
        window.speechSynthesis.speak(silent);
      } catch (e) {}
    }
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
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

  function getBestVoice(gender) {
    if (!('speechSynthesis' in window)) return { voice: null, pitch: 1 };
    const voices = window.speechSynthesis.getVoices() || [];
    const isFemale = gender === 'female';

    if (isFemale) {
      const match = voices.find(v => {
        const n = v.name.toLowerCase();
        return (n.includes('female') || n.includes('samantha') || n.includes('victoria') || n.includes('zira') || n.includes('karen') || n.includes('google us english') || n.includes('moira'));
      }) || voices.find(v => v.lang && v.lang.startsWith('en'));
      return { voice: match || null, pitch: 1.1 };
    } else {
      const match = voices.find(v => {
        const n = v.name.toLowerCase();
        return (n.includes('david') || n.includes('mark') || n.includes('george') || n.includes('guy') || n.includes('daniel') || n.includes('male') || n.includes('arthur') || n.includes('richard') || n.includes('oliver'));
      }) || voices.find(v => v.lang && v.lang.startsWith('en'));
      return { voice: match || null, pitch: 0.88 };
    }
  }

  function speakText(text, autoListenAfter = false) {
    if (!text) return;
    
    // Stop any ongoing speech
    stopSpeaking();

    const clean = text
      .replace(/\[CARD:[A-Z_]+\]/g, '')
      .replace(/[*#_`~]/g, '')
      .replace(/https?:\/\/\S+/g, 'our website link')
      .trim();

    if (!clean) return;

    updateUIStatus('speaking');

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.rate = 0.95;

        const { voice, pitch } = getBestVoice(clientData?.voiceGender || 'male');
        utterance.pitch = pitch;
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang || 'en-US';
        } else {
          utterance.lang = 'en-US';
        }

        activeUtterances.push(utterance);

        utterance.onstart = () => {
          isSpeaking = true;
          updateUIStatus('speaking');
        };

        const onEndCleanup = () => {
          isSpeaking = false;
          activeUtterances = activeUtterances.filter(u => u !== utterance);
          updateUIStatus('idle');
          if (autoListenAfter && isVoiceActive) {
            startListening();
          }
        };

        utterance.onend = onEndCleanup;
        utterance.onerror = (err) => {
          console.warn('[Quorik Voice Widget] Speech error, falling back to audio stream:', err);
          onEndCleanup();
          fallbackTTS(clean, autoListenAfter);
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('[Quorik Voice Widget] Speech synthesis failed:', e);
        fallbackTTS(clean, autoListenAfter);
      }
    } else {
      fallbackTTS(clean, autoListenAfter);
    }
  }

  function fallbackTTS(text, autoListenAfter = false) {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      const encoded = encodeURIComponent(text.slice(0, 200));
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en&client=tw-ob`;
      currentAudio = new Audio(url);
      currentAudio.playbackRate = 0.95;
      
      currentAudio.onplay = () => {
        isSpeaking = true;
        updateUIStatus('speaking');
      };
      
      const onEnd = () => {
        isSpeaking = false;
        currentAudio = null;
        updateUIStatus('idle');
        if (autoListenAfter && isVoiceActive) {
          startListening();
        }
      };

      currentAudio.onended = onEnd;
      currentAudio.onerror = () => {
        isSpeaking = false;
        currentAudio = null;
        updateUIStatus('idle');
      };

      currentAudio.play().catch(() => {
        isSpeaking = false;
        updateUIStatus('idle');
      });
    } catch (e) {
      isSpeaking = false;
      updateUIStatus('idle');
    }
  }

  function stopSpeaking() {
    isSpeaking = false;
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    if (currentAudio) {
      try { currentAudio.pause(); } catch (e) {}
      currentAudio = null;
    }
    activeUtterances = [];
    updateUIStatus('idle');
  }

  function updateUIStatus(status) {
    const vBtn = modal?.querySelector('#q-voice-toggle-btn');
    const statusText = modal?.querySelector('#q-voice-status-text');
    const banner = modal?.querySelector('#q-voice-active-banner');

    if (!vBtn) return;

    if (status === 'listening') {
      vBtn.classList.add('quorik-pulse');
      vBtn.classList.remove('quorik-speaking-glow');
      vBtn.style.background = '#EF4444';
      vBtn.style.borderColor = '#EF4444';
      vBtn.style.color = '#FFFFFF';
      if (statusText) statusText.innerText = 'Listening to your voice... (Speak now)';
      if (banner) {
        banner.style.display = 'flex';
        banner.innerHTML = `
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#EF4444;" class="quorik-pulse"></span>
          <span style="font-size:11px;color:#FCA5A5;font-weight:600;">Live Voice Mode: Listening...</span>
        `;
      }
    } else if (status === 'speaking') {
      vBtn.classList.remove('quorik-pulse');
      vBtn.classList.add('quorik-speaking-glow');
      vBtn.style.background = primaryColor;
      vBtn.style.borderColor = primaryColor;
      vBtn.style.color = '#000000';
      if (statusText) statusText.innerText = 'AI is speaking back...';
      if (banner) {
        banner.style.display = 'flex';
        banner.innerHTML = `
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00E5FF;" class="quorik-pulse"></span>
          <span style="font-size:11px;color:#00E5FF;font-weight:600;">Live Voice Mode: Speaking...</span>
        `;
      }
    } else if (status === 'thinking') {
      vBtn.classList.remove('quorik-pulse', 'quorik-speaking-glow');
      vBtn.style.background = `${primaryColor}33`;
      vBtn.style.borderColor = primaryColor;
      vBtn.style.color = primaryColor;
      if (statusText) statusText.innerText = 'AI is formulating response...';
    } else {
      vBtn.classList.remove('quorik-pulse', 'quorik-speaking-glow');
      vBtn.style.background = isVoiceActive ? `${primaryColor}22` : 'rgba(255,255,255,0.06)';
      vBtn.style.borderColor = isVoiceActive ? primaryColor : 'rgba(255,255,255,0.15)';
      vBtn.style.color = isVoiceActive ? primaryColor : '#94A3B8';
      if (statusText) statusText.innerText = isVoiceActive ? 'Voice Mode Active • Tap mic to speak' : 'Type or tap mic to start voice';
      if (banner && !isVoiceActive) {
        banner.style.display = 'none';
      }
    }
  }

  // Render Launcher Button
  root.innerHTML = `
    <div id="quorik-launcher" title="24/7 AI Voice & Chat Assistant">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    </div>
    <div id="quorik-modal"></div>
  `;

  const launcher = root.querySelector('#quorik-launcher');
  const modal = root.querySelector('#quorik-modal');

  // Verify Client Status Live from Quorik Backend
  async function fetchClientStatus() {
    try {
      const res = await fetch(`${serverOrigin}/api/clients/${clientId}`);
      if (!res.ok) {
        isPausedOrLimited = true;
        renderModal();
        return null;
      }
      clientData = await res.json();
      isPausedOrLimited = (clientData.status === 'paused' || clientData.status === 'limit_reached');
      renderModal();
      return clientData;
    } catch (e) {
      console.warn('[Quorik AI] Status check failed:', e);
      return null;
    }
  }

  function renderModal() {
    if (isPausedOrLimited) {
      modal.innerHTML = `
        <div style="padding:20px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#06080E;">
          <div style="width:54px;height:54px;border-radius:50%;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>
          </div>
          <h4 style="margin:0 0 8px;font-size:16px;font-weight:700;color:#fff;">Assistant Currently Paused</h4>
          <p style="margin:0 0 16px;font-size:12px;color:#94A3B8;line-height:1.5;">This voice portal is currently paused by admin or has reached monthly quota.</p>
          <a href="mailto:${clientData?.email || 'hello@quoriksystems.com'}" style="padding:8px 16px;background:rgba(255,255,255,0.05);color:#fff;border-radius:10px;text-decoration:none;font-size:11px;border:1px solid rgba(255,255,255,0.1);">Contact Support</a>
        </div>
      `;
      return;
    }

    const business = clientData?.businessName || 'Business Concierge';
    const agent = clientData?.voiceAgentName || 'Arthur (AI Concierge)';

    modal.innerHTML = `
      <div style="background:#0F1424;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:${primaryColor}22;border:1px solid ${primaryColor}66;display:flex;align-items:center;justify-content:center;color:${primaryColor};font-weight:bold;font-size:13px;">
            ${business.charAt(0)}
          </div>
          <div>
            <div style="font-size:13px;font-weight:bold;color:#fff;">${business}</div>
            <div style="font-size:11px;color:#00E5FF;display:flex;align-items:center;gap:4px;">
              <span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;"></span> ${agent}
            </div>
          </div>
        </div>
        <button id="q-close-btn" style="background:none;border:none;color:#94A3B8;cursor:pointer;font-size:18px;padding:4px;" title="Close">✕</button>
      </div>

      <div id="q-voice-active-banner" style="display:none;background:rgba(0,229,255,0.08);border-bottom:1px solid rgba(0,229,255,0.15);padding:6px 14px;align-items:center;gap:8px;justify-content:center;">
      </div>

      <div id="q-chat-feed" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;font-size:13px;background:#070A12;">
        <div style="align-self:flex-start;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:10px 14px;border-radius:14px;border-top-left-radius:2px;max-width:85%;line-height:1.4;">
          Hello! I am the 24/7 AI Voice & Chat Concierge for <strong>${business}</strong>. You can speak to me or type below to book an appointment or ask about our services!
        </div>
      </div>

      <div style="padding:6px 16px;background:#0A0E1A;border-top:1px solid rgba(255,255,255,0.05);font-size:10px;color:#64748B;" id="q-voice-status-text">
        Tap the microphone to speak voice-to-voice or type below
      </div>

      <div style="padding:12px;background:#0F1424;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:8px;">
        <button id="q-voice-toggle-btn" style="width:42px;height:42px;border-radius:50%;background:${primaryColor}22;border:1px solid ${primaryColor};color:${primaryColor};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;" title="Start Voice-to-Voice Call">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </button>
        <input id="q-text-input" type="text" placeholder="Ask a question or request booking..." style="flex:1;background:#05060A;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:10px 14px;border-radius:20px;font-size:12px;outline:none;" />
        <button id="q-send-btn" style="background:${primaryColor};border:none;color:#000;font-weight:bold;width:34px;height:34px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
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

    const textInput = modal.querySelector('#q-text-input');
    const sendBtn = modal.querySelector('#q-send-btn');
    const voiceBtn = modal.querySelector('#q-voice-toggle-btn');

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
    voiceBtn.onclick = () => {
      unlockAudio();
      toggleVoiceCall();
    };
  }

  async function handleSendChat(text, isVoiceMode = false) {
    if (!text || !text.trim() || isThinking) return;
    const input = modal.querySelector('#q-text-input');
    if (input) input.value = '';

    // Check status live before calling
    await fetchClientStatus();
    if (isPausedOrLimited) return;

    appendMessage('user', text);
    appendMessage('ai', 'Thinking...');
    isThinking = true;
    updateUIStatus('thinking');

    const isVoiceCall = Boolean(isVoiceMode || isVoiceActive);
    let measuredSeconds = 0;
    if (isVoiceCall && voiceStartTime > 0) {
      measuredSeconds = Math.max(8, Math.round((Date.now() - voiceStartTime) / 1000));
    }

    try {
      const res = await fetch(`${serverOrigin}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          clientId: clientId,
          isVoice: isVoiceCall,
          isVoiceMode: isVoiceCall,
          durationSeconds: measuredSeconds > 0 ? measuredSeconds : undefined
        })
      });

      removeLastThinking();
      isThinking = false;

      if (!res.ok) {
        appendMessage('ai', 'Service is currently unavailable. Please try again or email us.');
        updateUIStatus('idle');
        return;
      }

      const data = await res.json();

      if (data.text) {
        appendMessage('ai', data.text);
        
        // Save conversation history
        chatHistory.push({ role: 'user', parts: [{ text }] });
        chatHistory.push({ role: 'model', parts: [{ text: data.text }] });

        // Only speak aloud if visitor used Voice mode (Microphone / Voice call)
        if (isVoiceCall) {
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
      div.style.cssText = 'align-self:flex-end;background:#00E5FF;color:#000;font-weight:500;padding:10px 14px;border-radius:14px;border-top-right-radius:2px;max-width:85%;line-height:1.4;';
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
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      try { recognition?.stop(); } catch (e) {}
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = clientData?.voiceLanguage?.includes('Spanish') ? 'es-ES' : 
                     clientData?.voiceLanguage?.includes('German') ? 'de-DE' : 
                     clientData?.voiceLanguage?.includes('French') ? 'fr-FR' : 'en-US';

    recognition.onstart = () => {
      isListening = true;
      voiceStartTime = Date.now();
      updateUIStatus('listening');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      isListening = false;
      updateUIStatus('idle');
      handleSendChat(transcript, true);
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
