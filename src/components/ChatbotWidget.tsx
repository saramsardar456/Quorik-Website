import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Bot, User, Volume2, VolumeX, 
  Sparkles, TrendingUp, Award, DollarSign, Calendar, 
  Mic, MicOff, Phone, PhoneOff, RotateCcw
} from 'lucide-react';
import { ChatROICalculatorCard, ChatPortfolioCard, ChatPricingCard } from './chat/ChatCards';
import { speakSpeech, stopAllSpeech, sanitizeTextForSpeech, unlockAudio, prefetchNeuralAudio } from '../utils/speechUtils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: string;
  cardType?: 'ROI' | 'PORTFOLIO' | 'PRICING';
}

const STORAGE_KEY = 'quorik_arthur_widget_history_v2';

const INITIAL_GREETING: Message = {
  id: 'greeting-initial',
  text: "Hello and welcome to Quorik AI! 👋 I'm Arthur, your Executive AI Voice & Chat Concierge. How can we assist you with high-performance custom websites, autonomous AI voice agents, or workflow automation today?",
  sender: 'bot',
  timestamp: 'Just now'
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  // Mode: 'chat' or 'voice-call'
  const [activeMode, setActiveMode] = useState<'chat' | 'voice-call'>('chat');
  
  // Voice call specific state
  const [callDuration, setCallDuration] = useState(0);
  const [isAiSpeakingCall, setIsAiSpeakingCall] = useState(false);
  const [isCallThinking, setIsCallThinking] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [interimVoiceText, setInterimVoiceText] = useState('');

  // Messages state persisted to localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
    return [INITIAL_GREETING];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingInputMic, setIsRecordingInputMic] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceMessagesEndRef = useRef<HTMLDivElement>(null);
  const inputRecognitionRef = useRef<any>(null);
  const callRecognitionRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);
  const inputSilenceTimerRef = useRef<any>(null);
  const callSilenceTimerRef = useRef<any>(null);
  const micSpokenRef = useRef<string>('');
  const hasSentInputMicRef = useRef<boolean>(false);
  const callVoiceTranscriptRef = useRef<string>('');
  const activeModeRef = useRef<'chat' | 'voice-call'>('chat');
  const isAiSpeakingCallRef = useRef<boolean>(false);
  const isCallThinkingRef = useRef<boolean>(false);
  const isCallMicMutedRef = useRef<boolean>(false);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    isAiSpeakingCallRef.current = isAiSpeakingCall;
  }, [isAiSpeakingCall]);

  useEffect(() => {
    isCallThinkingRef.current = isCallThinking;
  }, [isCallThinking]);

  // Sync messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to persist chat messages:', e);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    voiceMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, interimVoiceText, activeMode]);

  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
    }
  }, [isOpen]);

  // Clean speech sanitization to avoid keyboard mash or noise characters
  const cleanSpeechTranscript = (raw: string): string => {
    if (!raw) return '';
    return raw.replace(/\s+/g, ' ').trim();
  };

  // Speak text with Arthur's baritone voice
  const speakWithArthur = (
    text: string, 
    msgId?: string, 
    onStartCb?: () => void, 
    onEndCb?: () => void
  ) => {
    stopAllSpeech();

    if (msgId && isSpeakingId === msgId) {
      setIsSpeakingId(null);
      return;
    }

    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    if (msgId) setIsSpeakingId(msgId);

    speakSpeech(cleanText, {
      gender: 'male',
      personaId: 'arthur',
      preferredLocale: 'en-US',
      stability: 0.50,
      onStart: () => {
        if (msgId) setIsSpeakingId(msgId);
        if (onStartCb) onStartCb();
      },
      onEnd: () => {
        setIsSpeakingId(null);
        if (onEndCb) onEndCb();
      },
      onError: () => {
        setIsSpeakingId(null);
        if (onEndCb) onEndCb();
      }
    });
  };

  // Send message in standard chat mode
  const handleSendMessage = async (textToSend?: string, wasVoiceInput: boolean = false) => {
    // Stop any active microphone recording immediately
    if (isRecordingInputMic) {
      if (inputRecognitionRef.current) {
        try { inputRecognitionRef.current.stop(); } catch (e) {}
      }
      setIsRecordingInputMic(false);
    }
    if (inputSilenceTimerRef.current) {
      clearTimeout(inputSilenceTimerRef.current);
    }

    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    // When the user communicates via text, stop any playing audio so it remains quiet
    if (!wasVoiceInput) {
      stopAllSpeech();
      setIsSpeakingId(null);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      text: query, 
      sender: 'user',
      timestamp: timeStr
    };

    // Immutable append: never wipe previous messages
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    micSpokenRef.current = '';
    setIsTyping(true);

    try {
      const history = messages.filter(m => m.id !== 'greeting-initial').map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history, accent: 'arthur' })
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response.');
      }
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const rawText: string = data.text || '';
      let detectedCard: 'ROI' | 'PORTFOLIO' | 'PRICING' | undefined = undefined;

      if (rawText.includes('[CARD:ROI]') || query.toLowerCase().includes('roi')) {
        detectedCard = 'ROI';
      } else if (rawText.includes('[CARD:PORTFOLIO]') || query.toLowerCase().includes('portfolio') || query.toLowerCase().includes('case stud')) {
        detectedCard = 'PORTFOLIO';
      } else if (rawText.includes('[CARD:PRICING]') || query.toLowerCase().includes('pricing') || query.toLowerCase().includes('cost') || query.toLowerCase().includes('package')) {
        detectedCard = 'PRICING';
      }

      const cleanText = rawText.replace(/\[CARD:(ROI|PORTFOLIO|PRICING)\]/g, '').trim();

      const botMsgId = (Date.now() + 1).toString();
      const botTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newBotMsg: Message = { 
        id: botMsgId, 
        text: cleanText, 
        sender: 'bot',
        timestamp: botTimeStr,
        cardType: detectedCard
      };

      setMessages(prev => [...prev, newBotMsg]);

      // TEXT ONLY REQUIREMENT:
      // When the user communicates by text, Arthur responds with TEXT ONLY.
      // Arthur ONLY speaks voice aloud if the user spoke to him using the microphone (wasVoiceInput === true).
      if (wasVoiceInput) {
        speakWithArthur(cleanText, botMsgId);
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a brief connection delay. Please feel free to email sales@quoriksystems.com or book a discovery meeting directly!",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Microphone speech-to-text for standard chat input box
  const toggleInputMic = async () => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Microphone speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    // If currently recording, user clicked to stop and send
    if (isRecordingInputMic) {
      if (inputSilenceTimerRef.current) clearTimeout(inputSilenceTimerRef.current);
      if (inputRecognitionRef.current) {
        try { inputRecognitionRef.current.stop(); } catch (e) {}
      }
      setIsRecordingInputMic(false);
      
      const spoken = (micSpokenRef.current || inputValue).trim();
      if (spoken && !hasSentInputMicRef.current) {
        hasSentInputMicRef.current = true;
        micSpokenRef.current = '';
        setInputValue('');
        handleSendMessage(spoken, true);
      }
      return;
    }

    unlockAudio();
    stopAllSpeech();

    // Trigger browser microphone permission check
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn("Microphone access prompt:", err);
      }
    }

    try {
      const recognition = new SpeechRecognitionClass();
      inputRecognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      hasSentInputMicRef.current = false;
      micSpokenRef.current = '';

      recognition.onstart = () => {
        setIsRecordingInputMic(true);
        hasSentInputMicRef.current = false;
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';
        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTrans += res[0].transcript + ' ';
          } else {
            interimTrans += res[0].transcript + ' ';
          }
        }
        const currentText = (finalTrans + interimTrans).replace(/\s+/g, ' ').trim();
        if (currentText) {
          micSpokenRef.current = currentText;
          setInputValue(currentText);
        }

        // Auto-send when user pauses speaking for 1.4 seconds
        if (inputSilenceTimerRef.current) clearTimeout(inputSilenceTimerRef.current);
        inputSilenceTimerRef.current = setTimeout(() => {
          const toSend = (micSpokenRef.current || currentText).trim();
          if (toSend && !hasSentInputMicRef.current) {
            hasSentInputMicRef.current = true;
            micSpokenRef.current = '';
            setInputValue('');
            try { recognition.stop(); } catch (e) {}
            setIsRecordingInputMic(false);
            handleSendMessage(toSend, true);
          }
        }, 1400);
      };

      recognition.onerror = (event: any) => {
        console.warn("Input mic error:", event?.error);
        if (event?.error === 'not-allowed') {
          alert("Microphone permission was denied. Please allow microphone permissions in your browser settings.");
        }
        setIsRecordingInputMic(false);
        if (inputSilenceTimerRef.current) clearTimeout(inputSilenceTimerRef.current);
        const toSend = micSpokenRef.current.trim();
        if (toSend && !hasSentInputMicRef.current) {
          hasSentInputMicRef.current = true;
          micSpokenRef.current = '';
          setInputValue('');
          handleSendMessage(toSend, true);
        }
      };

      recognition.onend = () => {
        setIsRecordingInputMic(false);
        if (inputSilenceTimerRef.current) clearTimeout(inputSilenceTimerRef.current);
        const toSend = micSpokenRef.current.trim();
        if (toSend && !hasSentInputMicRef.current) {
          hasSentInputMicRef.current = true;
          micSpokenRef.current = '';
          setInputValue('');
          handleSendMessage(toSend, true);
        }
      };

      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsRecordingInputMic(false);
    }
  };

  // --- Live Voice Call with Arthur Mode ---
  const startLiveVoiceCall = async () => {
    unlockAudio();
    stopAllSpeech();
    setActiveMode('voice-call');
    activeModeRef.current = 'voice-call';
    setCallDuration(0);
    setInterimVoiceText('');
    isCallMicMutedRef.current = false;

    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Initial greeting in call
    const callGreeting = "Hello! Arthur here, your executive AI concierge. How can Quorik assist your business today?";
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const callStartMsg: Message = {
      id: `call-start-${Date.now()}`,
      text: callGreeting,
      sender: 'bot',
      timestamp: timeStr
    };
    setMessages(prev => [...prev, callStartMsg]);

    setIsAiSpeakingCall(true);
    isAiSpeakingCallRef.current = true;
    speakWithArthur(
      callGreeting, 
      undefined, 
      () => {
        setIsAiSpeakingCall(true);
        isAiSpeakingCallRef.current = true;
      }, 
      () => {
        setIsAiSpeakingCall(false);
        isAiSpeakingCallRef.current = false;
        startCallMicListening();
      }
    );
  };

  const endLiveVoiceCall = () => {
    stopAllSpeech();
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (callRecognitionRef.current) {
      try { callRecognitionRef.current.stop(); } catch (e) {}
      callRecognitionRef.current = null;
    }
    if (callSilenceTimerRef.current) {
      clearTimeout(callSilenceTimerRef.current);
    }
    setIsMicActive(false);
    setIsAiSpeakingCall(false);
    setIsCallThinking(false);
    isAiSpeakingCallRef.current = false;
    isCallThinkingRef.current = false;
    activeModeRef.current = 'chat';
    setActiveMode('chat');
  };

  const startCallMicListening = async () => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      return;
    }

    if (activeModeRef.current !== 'voice-call' || isAiSpeakingCallRef.current || isCallThinkingRef.current || isCallMicMutedRef.current) {
      return;
    }

    // Stop previous instance if exists
    if (callRecognitionRef.current) {
      try { callRecognitionRef.current.stop(); } catch (e) {}
      callRecognitionRef.current = null;
    }

    unlockAudio();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {}
    }

    try {
      const recognition = new SpeechRecognitionClass();
      callRecognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      callVoiceTranscriptRef.current = '';

      recognition.onstart = () => {
        setIsMicActive(true);
      };

      let finalTrans = '';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript + ' ';
          }
        }
        const raw = (finalTrans + interim).replace(/\s+/g, ' ').trim();
        if (raw) {
          callVoiceTranscriptRef.current = raw;
          setInterimVoiceText(raw);
        }

        if (callSilenceTimerRef.current) clearTimeout(callSilenceTimerRef.current);
        callSilenceTimerRef.current = setTimeout(() => {
          const toSend = (callVoiceTranscriptRef.current || raw || finalTrans).trim();
          if (toSend && toSend.length > 1) {
            try { recognition.stop(); } catch (e) {}
            setIsMicActive(false);
            setInterimVoiceText('');
            callVoiceTranscriptRef.current = '';
            sendCallTurn(toSend);
          }
        }, 1400);
      };

      recognition.onerror = (event: any) => {
        console.warn("Call mic recognition notice:", event?.error);
        if (event?.error === 'not-allowed') {
          setIsMicActive(false);
          return;
        }
        // Silence or temporary glitch: automatically keep listening if still in voice call
        if (activeModeRef.current === 'voice-call' && !isAiSpeakingCallRef.current && !isCallThinkingRef.current && !isCallMicMutedRef.current) {
          setTimeout(() => {
            if (activeModeRef.current === 'voice-call' && !isAiSpeakingCallRef.current && !isCallThinkingRef.current && !isCallMicMutedRef.current) {
              startCallMicListening();
            }
          }, 300);
        }
      };

      recognition.onend = () => {
        setIsMicActive(false);
        // If the call is still active and Arthur is not speaking/thinking, automatically restart listening so the line never dies
        if (activeModeRef.current === 'voice-call' && !isAiSpeakingCallRef.current && !isCallThinkingRef.current && !isCallMicMutedRef.current) {
          setTimeout(() => {
            if (activeModeRef.current === 'voice-call' && !isAiSpeakingCallRef.current && !isCallThinkingRef.current && !isCallMicMutedRef.current) {
              startCallMicListening();
            }
          }, 200);
        }
      };

      recognition.start();
    } catch (e) {
      console.error("Call mic start error:", e);
      setIsMicActive(false);
    }
  };

  const sendCallTurn = async (userVoiceText: string) => {
    if (!userVoiceText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `call-user-${Date.now()}`,
      text: userVoiceText,
      sender: 'user',
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setIsCallThinking(true);
    isCallThinkingRef.current = true;

    try {
      const history = messages.map(m => ({
        sender: m.sender === 'user' ? 'customer' : 'ai',
        text: m.text
      }));

      const res = await fetch('/api/voice-agent/simulate-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: 'arthur',
          gender: 'male',
          userQuery: userVoiceText,
          conversationHistory: history
        })
      });

      const data = await res.json();
      setIsCallThinking(false);
      isCallThinkingRef.current = false;

      const aiReply = data.aiSpeechText || "Right, so... we can definitely assist you with custom engineering and AI voice agents. Would you like to check our pricing packages?";
      
      const botMsg: Message = {
        id: `call-bot-${Date.now()}`,
        text: aiReply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsAiSpeakingCall(true);
      isAiSpeakingCallRef.current = true;

      speakWithArthur(
        aiReply, 
        undefined, 
        () => {
          setIsAiSpeakingCall(true);
          isAiSpeakingCallRef.current = true;
        }, 
        () => {
          setIsAiSpeakingCall(false);
          isAiSpeakingCallRef.current = false;
          startCallMicListening();
        }
      );
    } catch (e) {
      setIsCallThinking(false);
      isCallThinkingRef.current = false;
      const fallbackReply = "We can certainly help you with custom web development and AI receptionists. Shall I book a consultation for you?";
      setMessages(prev => [...prev, {
        id: `call-bot-${Date.now()}`,
        text: fallbackReply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsAiSpeakingCall(true);
      isAiSpeakingCallRef.current = true;
      speakWithArthur(
        fallbackReply, 
        undefined, 
        () => {
          setIsAiSpeakingCall(true);
          isAiSpeakingCallRef.current = true;
        }, 
        () => {
          setIsAiSpeakingCall(false);
          isAiSpeakingCallRef.current = false;
          startCallMicListening();
        }
      );
    }
  };

  const handleResetChat = () => {
    if (window.confirm("Start a new conversation with Arthur? (This clears current history)")) {
      stopAllSpeech();
      const freshMessages = [INITIAL_GREETING];
      setMessages(freshMessages);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshMessages));
      } catch (e) {}
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed sm:absolute bottom-20 right-4 sm:right-0 w-[calc(100vw-2rem)] sm:w-[440px] max-w-[440px] bg-[#0A0E1A] border border-white/15 rounded-[22px] sm:rounded-[26px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(43,127,255,0.12)] overflow-hidden flex flex-col"
            style={{ height: '620px', maxHeight: 'calc(100vh - 95px)' }}
          >
            {/* Header: Arthur Executive Branding & Mode Selector */}
            <div className="bg-[#0D1322] border-b border-white/10 p-3 sm:p-3.5 flex items-center justify-between relative z-20">
              <div 
                onClick={() => {
                  unlockAudio();
                  const lastBot = [...messages].reverse().find(m => m.sender === 'bot');
                  if (lastBot) {
                    speakWithArthur(lastBot.text, lastBot.id);
                  }
                }}
                className="flex items-center gap-2.5 cursor-pointer group" 
                title="Arthur - Tap to hear latest voice response"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0D1322] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white tracking-tight text-xs group-hover:text-cyan-400 transition-colors">
                      Arthur
                    </h3>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-brand-blue/20 text-blue-300 border border-brand-blue/40">
                      EXECUTIVE AI
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>24/7 Voice & Chat Concierge</span>
                  </p>
                </div>
              </div>

              {/* Mode & Action Controls */}
              <div className="flex items-center gap-1.5">
                {/* Live Call Toggle Button */}
                {activeMode === 'chat' ? (
                  <button
                    onClick={startLiveVoiceCall}
                    className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
                    title="Start Live Voice Call with Arthur"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px]">Call Arthur</span>
                  </button>
                ) : (
                  <button
                    onClick={endLiveVoiceCall}
                    className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="End voice call and return to chat"
                  >
                    <PhoneOff className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[11px]">End Call</span>
                  </button>
                )}

                {/* Sound Auto-play Toggle in Chat Mode */}
                {activeMode === 'chat' && (
                  <button
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      try { localStorage.setItem('quorik_sound_enabled', String(next)); } catch (e) {}
                      if (!next) {
                        stopAllSpeech();
                      } else {
                        unlockAudio();
                        const lastBot = [...messages].reverse().find(m => m.sender === 'bot');
                        if (lastBot && !isSpeakingId) {
                          speakWithArthur(lastBot.text, lastBot.id);
                        }
                      }
                    }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors border ${
                      soundEnabled 
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                    title={soundEnabled ? "Mute Arthur's auto-voice" : "Enable Arthur's spoken responses"}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Reset Chat History */}
                <button
                  onClick={handleResetChat}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Close Button */}
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    stopAllSpeech();
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* --- VIEW: LIVE VOICE CALL MODE --- */}
            {activeMode === 'voice-call' ? (
              <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-[#0D1322] to-[#080B14]">
                {/* Call Status Badge */}
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-gray-200 font-medium">Live Voice Line Connected</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{formatSeconds(callDuration)}</span>
                </div>

                {/* Visualizer & Speaking State */}
                <div className="my-auto flex flex-col items-center justify-center text-center py-4">
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-2xl transition-all duration-300 ${
                      isAiSpeakingCall ? 'scale-110 shadow-[0_0_40px_rgba(59,130,246,0.6)]' : 'shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    }`}>
                      <Bot className="w-12 h-12 text-white" />
                    </div>
                    {isAiSpeakingCall && (
                      <span className="absolute -inset-2 rounded-full border-2 border-cyan-400/50 animate-ping" />
                    )}
                  </div>

                  <h4 className="text-white font-bold text-base mb-1">
                    {isAiSpeakingCall ? 'Arthur is Speaking...' : (isCallThinking ? 'Arthur is thinking...' : (isMicActive ? 'Listening to your voice...' : 'Arthur is Ready'))}
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    {isAiSpeakingCall 
                      ? 'Executive voice synthesizing over neural audio.' 
                      : (isMicActive ? 'Speak naturally into your microphone.' : 'Tap microphone or speak freely.')}
                  </p>

                  {/* Real-time Waveform Indicator */}
                  <div className="flex items-center gap-1.5 h-10 mt-5">
                    {[40, 75, 55, 90, 60, 100, 70, 85, 45, 95, 65, 80, 50].map((height, idx) => (
                      <motion.div
                        key={idx}
                        animate={{
                          height: isAiSpeakingCall 
                            ? [`${height * 0.3}%`, `${height}%`, `${height * 0.2}%`] 
                            : (isMicActive ? [`${height * 0.2}%`, `${height * 0.6}%`, `${height * 0.1}%`] : '15%')
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8 + (idx % 4) * 0.2,
                          ease: 'easeInOut'
                        }}
                        className={`w-1.5 rounded-full ${
                          isAiSpeakingCall 
                            ? 'bg-gradient-to-t from-blue-500 to-cyan-300' 
                            : (isMicActive ? 'bg-gradient-to-t from-emerald-500 to-teal-300' : 'bg-white/20')
                        }`}
                      />
                    ))}
                  </div>

                  {/* Interim Transcript preview */}
                  {interimVoiceText && (
                    <div className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-emerald-300 max-w-xs italic animate-fade-in">
                      "{interimVoiceText}..."
                    </div>
                  )}
                </div>

                {/* Call Controls Footer */}
                <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (isMicActive) {
                        isCallMicMutedRef.current = true;
                        if (callRecognitionRef.current) try { callRecognitionRef.current.stop(); } catch(e){}
                        setIsMicActive(false);
                      } else {
                        isCallMicMutedRef.current = false;
                        startCallMicListening();
                      }
                    }}
                    className={`p-3 rounded-full border transition-all ${
                      isMicActive 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                        : 'bg-white/5 border-white/15 text-gray-400 hover:text-white'
                    }`}
                    title={isMicActive ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {isMicActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={endLiveVoiceCall}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-red-500/25 transition-all"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Voice Call</span>
                  </button>
                </div>
              </div>
            ) : (
              /* --- VIEW: TEXT & VOICE CHAT MODE --- */
              <>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-4 space-y-4 bg-[#0A0E1A]">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[90%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                          msg.sender === 'user' 
                            ? 'bg-white/10 border-white/20' 
                            : 'bg-blue-600/20 border-blue-500/30'
                        }`}>
                          {msg.sender === 'user' ? <User className="w-3.5 h-3.5 text-gray-300" /> : <Bot className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        
                        <div className="flex flex-col">
                          <div className={`p-3 text-xs sm:text-[13px] leading-relaxed relative group shadow-md ${
                            msg.sender === 'user' 
                              ? 'bg-brand-blue text-white rounded-[18px] rounded-tr-[4px]' 
                              : 'bg-[#121829] text-gray-200 rounded-[18px] rounded-tl-[4px] border border-white/10'
                          }`}>
                            {msg.text}

                            {/* Speaker Button on Bot Messages */}
                            {msg.sender === 'bot' && (
                              <button
                                onClick={() => speakWithArthur(msg.text, msg.id)}
                                className="absolute -right-7 top-2 text-gray-500 hover:text-cyan-400 transition-colors p-1"
                                title="Read aloud in Arthur's executive voice"
                              >
                                <Volume2 className={`w-3.5 h-3.5 ${isSpeakingId === msg.id ? 'text-cyan-400 animate-pulse' : ''}`} />
                              </button>
                            )}
                          </div>

                          {msg.timestamp && (
                            <span className={`text-[9px] text-gray-500 mt-1 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                              {msg.timestamp}
                            </span>
                          )}

                          {/* Render Interactive UI Cards */}
                          {msg.cardType === 'ROI' && (
                            <div className="mt-2">
                              <ChatROICalculatorCard onSelectAction={(t) => handleSendMessage(t)} />
                            </div>
                          )}
                          {msg.cardType === 'PORTFOLIO' && (
                            <div className="mt-2">
                              <ChatPortfolioCard onSelectAction={(t) => handleSendMessage(t)} />
                            </div>
                          )}
                          {msg.cardType === 'PRICING' && (
                            <div className="mt-2">
                              <ChatPricingCard onSelectAction={(t) => handleSendMessage(t)} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] gap-2 flex-row">
                        <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                          <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        <div className="p-3 bg-[#121829] rounded-[18px] rounded-tl-[4px] border border-white/10 flex items-center gap-1.5 h-[36px]">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Action Chips */}
                <div className="px-3 py-2 bg-[#0D1322] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => handleSendMessage('Calculate my potential ROI with Quorik AI')}
                    className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 rounded-full text-[10px] text-gray-300 hover:text-cyan-300 transition-all flex items-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    <span>Calculate ROI</span>
                  </button>

                  <button
                    onClick={startLiveVoiceCall}
                    className="shrink-0 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-full text-[10px] text-emerald-300 transition-all flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>Voice Agent Demo</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage('What are your service packages and pricing tiers?')}
                    className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 rounded-full text-[10px] text-gray-300 hover:text-purple-300 transition-all flex items-center gap-1"
                  >
                    <DollarSign className="w-3 h-3 text-purple-400" />
                    <span>Pricing Packages</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage('Show me your featured work and portfolio case studies')}
                    className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 rounded-full text-[10px] text-gray-300 hover:text-blue-300 transition-all flex items-center gap-1"
                  >
                    <Award className="w-3 h-3 text-blue-400" />
                    <span>Portfolio Showcase</span>
                  </button>

                  <button
                    onClick={() => handleSendMessage('I would like to book a direct discovery consultation with Shehram')}
                    className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 rounded-full text-[10px] text-gray-300 hover:text-amber-300 transition-all flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Book Discovery Call</span>
                  </button>
                </div>

                {/* Input Area with Integrated Speech Mic */}
                <div className="p-3 bg-[#0D1322] border-t border-white/5">
                  <form onSubmit={handleFormSubmit} className="relative flex items-center">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isRecordingInputMic ? "Listening to your voice... (Speak now)" : "Message Arthur or ask a question..."}
                      className={`w-full bg-[#121829] border rounded-full py-2.5 pl-4 pr-20 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors ${
                        isRecordingInputMic 
                          ? 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 ring-1 ring-emerald-500/50' 
                          : 'border-white/15 focus:border-brand-blue/60'
                      }`}
                    />

                    {/* Microphone input button */}
                    <button
                      type="button"
                      onClick={toggleInputMic}
                      className={`absolute right-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isRecordingInputMic 
                          ? 'bg-emerald-500 text-white animate-pulse ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/30' 
                          : 'text-gray-400 hover:text-cyan-400 hover:bg-white/5'
                      }`}
                      title={isRecordingInputMic ? "Tap to finish speaking & send" : "Speak to Arthur with microphone"}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>

                    {/* Send Button */}
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="absolute right-1.5 w-8 h-8 bg-brand-blue hover:bg-blue-500 disabled:bg-white/10 disabled:text-gray-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 ml-[-1px]" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Greeting Pill */}
      <AnimatePresence>
        {!isOpen && showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[75px] right-0 w-[310px] bg-[#0D1322] border border-white/15 rounded-[22px] rounded-br-[4px] p-3.5 shadow-2xl flex flex-col cursor-pointer hover:border-brand-blue/40 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600/30 border border-blue-400/30 rounded-full flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <h4 className="text-white font-bold text-xs tracking-tight flex items-center gap-1.5">
                  Arthur <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                </h4>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreeting(false);
                }}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Hello! 👋 I'm Arthur, your 24/7 AI Voice Concierge. Want to test our live voice line, calculate your ROI, or discuss a custom web build?
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-brand-blue to-cyan-500 rounded-full shadow-[0_8px_32px_rgba(43,127,255,0.4)] flex items-center justify-center text-white focus:outline-none hover:brightness-110 transition-all"
        title={isOpen ? "Close Arthur AI" : "Open Arthur AI Concierge"}
      >
        {isOpen ? <X className="w-6 h-6" strokeWidth={2.5} /> : <MessageSquare className="w-6 h-6" strokeWidth={2.5} />}
      </motion.button>
    </div>
  );
}
