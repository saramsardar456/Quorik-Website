import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Volume2, VolumeX, Globe, Sparkles, TrendingUp, Award, DollarSign, Calendar } from 'lucide-react';
import { ChatROICalculatorCard, ChatPortfolioCard, ChatPricingCard } from './chat/ChatCards';
import { speakEnglishUtterance, stopAllSpeech, sanitizeTextForSpeech } from '../utils/speechUtils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  cardType?: 'ROI' | 'PORTFOLIO' | 'PRICING';
}

type VoiceAccent = 'arthur' | 'us' | 'uk' | 'casual';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [accent, setAccent] = useState<VoiceAccent>('arthur');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [showAccentMenu, setShowAccentMenu] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hello and welcome to Quorik AI! 👋 I'm Arthur, your AI Voice Concierge. How can we help you build high-converting websites, AI chatbots, or voice automation today?", 
      sender: 'bot' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
    }
  }, [isOpen]);

  const speakText = (text: string, msgId?: string, overrideAccent?: VoiceAccent) => {
    stopAllSpeech();

    if (msgId && isSpeaking === msgId) {
      setIsSpeaking(null);
      return;
    }

    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    const activeAccent = overrideAccent || accent;
    const gender = activeAccent === 'arthur' ? 'male' : (activeAccent === 'uk' ? 'male' : 'female');
    const preferredLocale = activeAccent === 'uk' ? 'en-GB' : 'en-US';
    const personaId = activeAccent === 'uk' ? 'uk-refined' : 'us-executive';

    if (msgId) setIsSpeaking(msgId);

    speakEnglishUtterance(cleanText, {
      gender,
      personaId,
      preferredLocale,
      onStart: () => {
        if (msgId) setIsSpeaking(msgId);
      },
      onEnd: () => {
        setIsSpeaking(null);
      },
      onError: () => {
        setIsSpeaking(null);
      }
    });
  };

  const handleAccentSelect = (selectedAccent: VoiceAccent) => {
    setAccent(selectedAccent);
    setShowAccentMenu(false);

    let systemGreeting = "";
    if (selectedAccent === 'us') {
      systemGreeting = "Hello & Welcome! Switched to US Executive Persona. How can we accelerate your digital growth, custom website, and AI automation today?";
    } else if (selectedAccent === 'uk') {
      systemGreeting = "Good day! Switched to British Refined Persona. Welcome to Quorik AI. How may we assist your enterprise today?";
    } else if (selectedAccent === 'casual') {
      systemGreeting = "Hey there! Switched to Casual Tech Persona. Welcome to Quorik AI. What awesome AI system or website are we building today?";
    } else {
      systemGreeting = "Hello & Welcome! Switched to Arthur Executive Persona. How can Quorik assist your business with AI and custom development today?";
    }

    const botMsg: Message = {
      id: Date.now().toString(),
      text: systemGreeting,
      sender: 'bot'
    };

    setMessages(prev => [...prev, botMsg]);

    if (speechEnabled) {
      speakText(systemGreeting, botMsg.id, selectedAccent);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const newUserMsg: Message = { id: Date.now().toString(), text: query, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.filter(m => m.id !== '1').map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history, accent })
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response.');
      }
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      let rawText: string = data.text || '';
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
      const newBotMsg: Message = { 
        id: botMsgId, 
        text: cleanText, 
        sender: 'bot',
        cardType: detectedCard
      };

      setMessages(prev => [...prev, newBotMsg]);

      if (speechEnabled) {
        speakText(cleanText, botMsgId);
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a little trouble connecting right now. Please try again or reach out on WhatsApp!",
        sender: 'bot'
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

  const accentLabels: Record<VoiceAccent, { label: string; badge: string; style: string }> = {
    arthur: { label: 'Arthur Executive AI', badge: 'ARTHUR', style: 'Arthur Voice' },
    us: { label: 'US Executive', badge: 'US', style: 'Sharp American' },
    uk: { label: 'British Refined', badge: 'UK', style: 'Precise & Clear' },
    casual: { label: 'Casual Tech', badge: 'TECH', style: 'Energetic & Startup' }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed sm:absolute bottom-20 right-4 sm:right-0 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] bg-[#0F1423] border border-white/10 rounded-[20px] sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '580px', maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header */}
            <div className="bg-[#0A0E1A] border-b border-white/5 p-3.5 flex items-center justify-between relative z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-brand-blue/10 border border-brand-blue/20 rounded-full flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-brand-teal" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0A0E1A]" />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-tight text-xs flex items-center gap-1.5">
                    Quorik AI
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                      v2.5 Interactive
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <span className="text-brand-teal font-medium flex items-center gap-1">
                      <span className="px-1 py-0.2 bg-brand-teal/20 text-brand-teal border border-brand-teal/30 rounded text-[9px] font-mono font-bold">{accentLabels[accent].badge}</span>
                      {accentLabels[accent].label}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action controls */}
              <div className="flex items-center gap-1.5">
                {/* Accent selector button */}
                <button
                  onClick={() => setShowAccentMenu(!showAccentMenu)}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1 transition-colors"
                  title="Change AI Voice Accent"
                >
                  <Globe className="w-3 h-3 text-brand-teal" />
                  <span className="text-[10px] font-mono">{accent.toUpperCase()}</span>
                </button>

                {/* Speech Toggle Button */}
                <button
                  onClick={() => {
                    const next = !speechEnabled;
                    setSpeechEnabled(next);
                    if (!next) window.speechSynthesis.cancel();
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors border ${
                    speechEnabled 
                      ? 'bg-brand-teal/20 border-brand-teal text-brand-teal' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                  title={speechEnabled ? "Mute Voice Readout" : "Enable Voice Readout"}
                >
                  {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    window.speechSynthesis.cancel();
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dropdown Menu for Voice Accents */}
              <AnimatePresence>
                {showAccentMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-14 right-3 bg-[#0A0E1A] border border-white/15 rounded-xl p-2 shadow-2xl w-52 z-30 space-y-1"
                  >
                    <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-400 border-b border-white/5 mb-1">
                      Select Voice Accent Persona
                    </div>
                    {(Object.keys(accentLabels) as VoiceAccent[]).map((key) => {
                      const item = accentLabels[key];
                      return (
                        <button
                          key={key}
                          onClick={() => handleAccentSelect(key)}
                          className={`w-full p-2 text-left rounded-lg flex items-center justify-between text-xs transition-colors ${
                            accent === key 
                              ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30 font-bold' 
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="px-1 bg-brand-teal/10 text-brand-teal rounded text-[9px] font-mono font-bold">{item.badge}</span>
                            <span>{item.label}</span>
                          </span>
                          <span className="text-[9px] text-gray-400 font-normal">{item.style.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-[#0F1423]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[92%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${msg.sender === 'user' ? 'bg-white/5 border-white/10' : 'bg-brand-blue/10 border-brand-blue/20'}`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5 text-gray-400" /> : <Bot className="w-3.5 h-3.5 text-brand-teal" />}
                    </div>
                    
                    <div className="flex flex-col">
                      <div className={`p-3 text-xs sm:text-[13px] leading-relaxed relative group ${
                        msg.sender === 'user' 
                          ? 'bg-brand-blue text-white rounded-[18px] rounded-tr-[4px]' 
                          : 'bg-[#0A0E1A] text-gray-200 rounded-[18px] rounded-tl-[4px] border border-white/10'
                      }`}>
                        {msg.text}

                        {/* Speaker Button on Bot Messages */}
                        {msg.sender === 'bot' && (
                          <button
                            onClick={() => speakText(msg.text, msg.id)}
                            className="absolute -right-6 top-2 text-gray-500 hover:text-brand-teal transition-colors p-1"
                            title="Read message aloud"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking === msg.id ? 'text-brand-teal animate-pulse' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Render Interactive UI Cards */}
                      {msg.cardType === 'ROI' && (
                        <ChatROICalculatorCard onSelectAction={(t) => handleSendMessage(t)} />
                      )}
                      {msg.cardType === 'PORTFOLIO' && (
                        <ChatPortfolioCard onSelectAction={(t) => handleSendMessage(t)} />
                      )}
                      {msg.cardType === 'PRICING' && (
                        <ChatPricingCard onSelectAction={(t) => handleSendMessage(t)} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] gap-2 flex-row">
                    <div className="w-7 h-7 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-brand-teal" />
                    </div>
                    <div className="p-3 bg-[#0A0E1A] rounded-[18px] rounded-tl-[4px] border border-white/10 flex items-center gap-1.5 h-[36px]">
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 bg-[#0A0E1A] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendMessage('Calculate my potential ROI with Quorik AI')}
                className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-brand-teal/20 border border-white/10 hover:border-brand-teal/40 rounded-full text-[10px] text-gray-300 hover:text-brand-teal transition-all flex items-center gap-1"
              >
                <TrendingUp className="w-3 h-3 text-brand-teal" />
                <span>ROI Calculator</span>
              </button>

              <button
                onClick={() => handleSendMessage('Show me your featured work and portfolio case studies')}
                className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-brand-blue/20 border border-white/10 hover:border-brand-blue/40 rounded-full text-[10px] text-gray-300 hover:text-brand-blue transition-all flex items-center gap-1"
              >
                <Award className="w-3 h-3 text-brand-blue" />
                <span>Show Portfolio</span>
              </button>

              <button
                onClick={() => handleSendMessage('What are your service packages and pricing tiers?')}
                className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 rounded-full text-[10px] text-gray-300 hover:text-purple-300 transition-all flex items-center gap-1"
              >
                <DollarSign className="w-3 h-3 text-purple-400" />
                <span>Pricing Tiers</span>
              </button>

              <button
                onClick={() => handleSendMessage('How does your 24/7 Web Voice AI Assistant work?')}
                className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 rounded-full text-[10px] text-gray-300 hover:text-green-300 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-green-400" />
                <span>Voice AI Agent</span>
              </button>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#0A0E1A] border-t border-white/5">
              <form onSubmit={handleFormSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about AI, pricing, ROI..."
                  className="w-full bg-[#0F1423] border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 w-8 h-8 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-white/10 disabled:text-gray-500 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5 ml-[-1px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[80px] right-0 w-[300px] bg-[#0A0E1A] border border-white/10 rounded-[24px] rounded-br-[4px] p-4 shadow-2xl flex flex-col cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-teal/20 rounded-full flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-brand-teal" />
                </div>
                <h4 className="text-white font-bold text-xs tracking-tight flex items-center gap-1.5">
                  Quorik AI <span className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-pulse"></span>
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
              Hey there! 👋 I'm the Quorik AI. Want to discuss how we can automate your operations or build your next custom website?
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white rounded-full shadow-[0_8px_32px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#0A0E1A] focus:outline-none hover:bg-gray-100 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" strokeWidth={2.5} /> : <MessageSquare className="w-6 h-6" strokeWidth={2.5} />}
      </motion.button>
    </div>
  );
}

