/**
 * Quorik Systems - Multi-Tenant AI Voice & Chatbot Embedded Widget
 * Lightweight, zero-dependency, real-time widget with real-time kill-switch
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

  // Create Widget Root Container
  const root = document.createElement('div');
  root.id = 'quorik-voice-widget-root';
  root.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;font-family:system-ui,-apple-system,sans-serif;';
  document.body.appendChild(root);

  // Widget State
  let clientData = null;
  let isOpen = false;
  let isCalling = false;
  let callTimer = null;
  let callSeconds = 0;
  let chatHistory = [];
  let isPausedOrLimited = false;
  let recognition = null;
  let isListening = false;

  // Render Launcher Button
  root.innerHTML = `
    <style>
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
        width: 370px;
        max-width: calc(100vw - 48px);
        height: 520px;
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
        animation: q-pulse 1.5s infinite;
      }
      @keyframes q-pulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.7; }
      }
    </style>
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
      <div style="background:#0F1424;padding:16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;">
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
        <button id="q-close-btn" style="background:none;border:none;color:#94A3B8;cursor:pointer;font-size:18px;padding:4px;">✕</button>
      </div>

      <div id="q-chat-feed" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;font-size:13px;background:#070A12;">
        <div style="align-self:flex-start;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:10px 14px;border-radius:14px;border-top-left-radius:2px;max-width:85%;line-height:1.4;">
          Hello! I am the 24/7 AI Concierge for <strong>${business}</strong>. You can speak to me or type below to book an appointment or ask about our services!
        </div>
      </div>

      <div style="padding:12px;background:#0F1424;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:8px;">
        <button id="q-voice-toggle-btn" style="width:42px;height:42px;border-radius:50%;background:${primaryColor}22;border:1px solid ${primaryColor};color:${primaryColor};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
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
      modal.style.display = 'none';
    };

    const textInput = modal.querySelector('#q-text-input');
    const sendBtn = modal.querySelector('#q-send-btn');
    const voiceBtn = modal.querySelector('#q-voice-toggle-btn');

    sendBtn.onclick = () => handleSendChat(textInput.value);
    textInput.onkeydown = (e) => { if (e.key === 'Enter') handleSendChat(textInput.value); };
    voiceBtn.onclick = () => toggleVoiceCall();
  }

  async function handleSendChat(text) {
    if (!text || !text.trim()) return;
    const input = modal.querySelector('#q-text-input');
    input.value = '';

    // Check status live before calling
    await fetchClientStatus();
    if (isPausedOrLimited) return;

    appendMessage('user', text);
    appendMessage('ai', 'Thinking...');

    try {
      const res = await fetch(`${serverOrigin}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          accent: 'arthur',
          clientId: clientId
        })
      });
      const data = await res.json();
      removeLastThinking();

      if (data.text) {
        appendMessage('ai', data.text);
        chatHistory.push({ role: 'user', parts: [{ text }] });
        chatHistory.push({ role: 'model', parts: [{ text: data.text }] });

        // Log text chat meter & lead check to client account
        fetch(`${serverOrigin}/api/clients/${clientId}/log-text-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadCaptured: text.toLowerCase().includes('book') || text.toLowerCase().includes('call') || /\d{10}/.test(text) })
        }).catch(() => {});
      } else {
        appendMessage('ai', 'Sorry, I am having trouble connecting right now.');
      }
    } catch (e) {
      removeLastThinking();
      appendMessage('ai', 'Connection error.');
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
    const thinking = modal.querySelector('.q-thinking');
    if (thinking) thinking.remove();
  }

  function toggleVoiceCall() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please type your message.');
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (isListening) {
      recognition?.stop();
      isListening = false;
      return;
    }

    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      appendMessage('ai', '🎙️ Listening to your voice... Speak now.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      removeLastThinking();
      handleSendChat(transcript);
    };

    recognition.onerror = () => {
      isListening = false;
      removeLastThinking();
    };

    recognition.onend = () => {
      isListening = false;
    };

    recognition.start();
  }

  launcher.onclick = async () => {
    isOpen = !isOpen;
    if (isOpen) {
      modal.style.display = 'flex';
      await fetchClientStatus();
    } else {
      modal.style.display = 'none';
    }
  };

  // Initial check
  fetchClientStatus();
})();
