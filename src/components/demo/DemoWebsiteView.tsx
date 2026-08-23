import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Sparkles, 
  Phone, 
  Mic, 
  MicOff, 
  Volume2, 
  Square, 
  RefreshCw, 
  Stethoscope, 
  Home, 
  Scale, 
  Car, 
  Wrench, 
  Smile, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Send, 
  Star, 
  Clock, 
  MapPin, 
  CheckCircle2,
  Utensils,
  Dumbbell,
  Sun,
  Calculator,
  Scissors,
  Dog,
  Cpu,
  Hotel,
  Briefcase,
  ChevronDown,
  Award,
  Users,
  Zap,
  MessageSquare,
  BadgeCheck
} from 'lucide-react';
import { DemoSiteData, THEME_CONFIGS } from '../../data/demoPresets';
import { speakSpeech, stopAllSpeech, unlockAudio } from '../../utils/speechUtils';

interface DemoWebsiteViewProps {
  data: DemoSiteData;
  onCallStateChange?: (active: boolean) => void;
  isStandalone?: boolean;
}

export const DemoWebsiteView: React.FC<DemoWebsiteViewProps> = ({
  data,
  onCallStateChange,
  isStandalone = false
}) => {
  const theme = THEME_CONFIGS[data.theme] || THEME_CONFIGS.teal;

  // Voice Call Simulator State
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [userQueryInput, setUserQueryInput] = useState('');
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([]);
  const [capturedLead, setCapturedLead] = useState<{ callerName: string; topic: string; requestedSlot: string } | null>(null);

  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingService, setBookingService] = useState(data.services[0]?.title || '');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Floating widget state for standalone view
  const [floatingWidgetOpen, setFloatingWidgetOpen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioFallbackRef = useRef<HTMLAudioElement | null>(null);
  const callConsoleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      stopAllSpeech();
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const getLogoIconComponent = () => {
    const iconClass = "w-6 h-6 text-white";
    switch (data.logoIcon) {
      case 'dental': return <Stethoscope className={iconClass} />;
      case 'house': return <Home className={iconClass} />;
      case 'legal': return <Scale className={iconClass} />;
      case 'spa': return <Smile className={iconClass} />;
      case 'hvac': return <Wrench className={iconClass} />;
      case 'auto': return <Car className={iconClass} />;
      case 'restaurant': return <Utensils className={iconClass} />;
      case 'fitness': return <Dumbbell className={iconClass} />;
      case 'solar': return <Sun className={iconClass} />;
      case 'accounting': return <Calculator className={iconClass} />;
      case 'barber': return <Scissors className={iconClass} />;
      case 'vet': return <Dog className={iconClass} />;
      case 'cleaning': return <Sparkles className={iconClass} />;
      case 'tech': return <Cpu className={iconClass} />;
      case 'hotel': return <Hotel className={iconClass} />;
      default: return <Building2 className={iconClass} />;
    }
  };

  const clearSpeechEngine = () => {
    stopAllSpeech();
    setIsAiSpeaking(false);
  };

  const speakText = (text: string) => {
    // 1. Stop mic listening if active
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsRecordingMic(false);
    }

    // 2. Clear any active speech
    clearSpeechEngine();

    const gender = data.gender || 'male';
    const personaId = gender === 'female' ? 'us-executive' : 'us-executive';

    speakSpeech(text, {
      gender,
      personaId,
      preferredLocale: 'en-US',
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false)
    });
  };

  const startCall = (customInitialQuery?: string) => {
    unlockAudio();
    clearSpeechEngine();
    setIsCallActive(true);
    if (onCallStateChange) onCallStateChange(true);

    if (callConsoleRef.current) {
      callConsoleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (customInitialQuery) {
      // If triggered with a specific question (e.g. "What are your prices?"), answer directly
      handleSendQuery(customInitialQuery);
    } else {
      // Direct call start: play greeting
      const greeting = `Hello and thank you for calling ${data.companyName}! My name is ${data.agentName}. I can answer questions about our services, pricing, or schedule your appointment today. How may I assist you?`;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setSimMessages([{ sender: 'ai', text: greeting, time: timeStr }]);
      speakText(greeting);
    }
  };

  const endCall = () => {
    clearSpeechEngine();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsCallActive(false);
    if (onCallStateChange) onCallStateChange(false);
    setIsAiSpeaking(false);
    setIsRecordingMic(false);
  };

  const handleSendQuery = async (queryText?: string) => {
    unlockAudio();
    const textToSend = (queryText || userQueryInput).trim();
    if (!textToSend || isAiThinking) return;

    // Ensure call is active
    if (!isCallActive) {
      setIsCallActive(true);
      if (onCallStateChange) onCallStateChange(true);
    }

    if (callConsoleRef.current) {
      callConsoleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Stop previous speech cleanly so new answer plays fresh
    clearSpeechEngine();

    const now = new Date();
    const userTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user query to transcript
    setSimMessages(prev => [...prev, { sender: 'user', text: textToSend, time: userTimeStr }]);
    setUserQueryInput('');
    setIsAiThinking(true);

    try {
      const historyForApi = simMessages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        text: m.text
      }));

      const res = await fetch('/api/voice-agent/simulate-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: data.gender,
          userQuery: textToSend,
          conversationHistory: historyForApi,
          customCompany: {
            name: data.companyName,
            agentName: data.agentName,
            services: data.services.map(s => `${s.title} (${s.price}): ${s.desc}`),
            location: data.location,
            hours: data.hours,
            phone: data.phone
          }
        })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const resData = await res.json();
      setIsAiThinking(false);

      if (resData.success && resData.aiSpeechText) {
        const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSimMessages(prev => [...prev, { sender: 'ai', text: resData.aiSpeechText, time: aiTimeStr }]);
        speakText(resData.aiSpeechText);

        if (resData.extractedLead) {
          setCapturedLead({
            callerName: resData.extractedLead.callerName || 'Valued Client',
            topic: resData.extractedLead.topic || data.services[0]?.title || 'Consultation',
            requestedSlot: resData.extractedLead.requestedSlot || 'Tomorrow @ 10:30 AM'
          });
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      setIsAiThinking(false);
      const fallback = `Thank you for asking! For ${data.companyName}, we provide ${data.services[0]?.title || 'premier services'} starting at ${data.services[0]?.price || 'competitive rates'}. Would you like me to reserve an appointment for you?`;
      const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSimMessages(prev => [...prev, { sender: 'ai', text: fallback, time: aiTimeStr }]);
      speakText(fallback);
    }
  };

  const toggleMicListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query in the input box.");
      return;
    }

    if (isRecordingMic) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsRecordingMic(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsRecordingMic(true);
      };

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserQueryInput(finalTranscript);
        }
      };

      recognition.onerror = () => {
        setIsRecordingMic(false);
      };

      recognition.onend = () => {
        setIsRecordingMic(false);
        if (finalTranscript.trim()) {
          handleSendQuery(finalTranscript);
        }
      };

      recognition.start();
    } catch (err) {
      setIsRecordingMic(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingName('');
      setBookingPhone('');
    }, 4500);
  };

  return (
    <div className="w-full bg-[#050811] text-gray-100 font-sans overflow-hidden">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0A1020] border-b border-white/10 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">24/7 AI Live Dispatch:</span>
          <span>{data.hours || 'Always Open 365 Days'}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {data.location || 'Metropolitan Center'}
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <a href={`tel:${data.phone}`} className="flex items-center gap-1 text-white font-bold hover:underline">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> {data.phone}
          </a>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#070B16]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border ${theme.border} shadow-lg flex items-center justify-center`}>
            {getLogoIconComponent()}
          </div>
          <div>
            <div className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
              {data.companyName}
            </div>
            <div className="text-[10px] font-mono text-gray-400">Official Web Portal & 24/7 AI Voice Concierge</div>
          </div>
        </div>

        {/* Desktop Navigation Links & AI Call CTA */}
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why Choose Us</a>
            <a href="#voice-agent" className="hover:text-white transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> AI Assistant
            </a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <button
            onClick={() => startCall()}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 ${theme.btnBg}`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Call {data.agentName} (AI)</span>
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative px-4 md:px-8 py-12 md:py-20 text-center max-w-5xl mx-auto space-y-6">
        
        {/* Glowing Background Mesh */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl"></div>
        </div>

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-inner bg-white/5 border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-gray-200">24/7 AI Voice Receptionist Active</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 font-mono text-gray-300">Zero Wait Time</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          {data.tagline}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {data.heroSubtext}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <button
            onClick={() => startCall()}
            className={`px-7 py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 ${theme.btnBg}`}
          >
            <Phone className="w-4 h-4" />
            <span>Speak with {data.agentName} (Live AI Call)</span>
          </button>

          <a
            href="#booking-form"
            className="px-6 py-3.5 rounded-xl text-sm font-bold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Book Consultation</span>
          </a>
        </div>

        {/* 4. KEY METRICS TRUST BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-10">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-lg md:text-xl font-black text-white">{data.stats?.stat1Val || '99.4%'}</div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">{data.stats?.stat1Label || 'Client Satisfaction'}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-lg md:text-xl font-black text-white">{data.stats?.stat2Val || 'Same-Day'}</div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">{data.stats?.stat2Label || 'Emergency Slots'}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-lg md:text-xl font-black text-white">{data.stats?.stat3Val || '10,000+'}</div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">{data.stats?.stat3Label || 'Clients Served'}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="text-lg md:text-xl font-black text-emerald-400">⭐️ 4.9 / 5.0</div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">Verified Reviews</div>
          </div>
        </div>

      </section>

      {/* 5. FEATURED SERVICES BENTO GRID */}
      <section id="services" className="px-4 md:px-8 py-12 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Tailored Solutions & Pricing
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Our Core Services & Treatments</h2>
          </div>
          <p className="text-xs text-gray-400 font-mono">Ask our AI Voice Agent about any service for instant pricing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.services.map((svc, idx) => (
            <div 
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border ${theme.border} space-y-3.5 relative group hover:-translate-y-1 transition-all shadow-lg flex flex-col justify-between`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    {svc.tag || `Service 0${idx + 1}`}
                  </span>
                  <span className={`text-xs font-extrabold font-mono px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    {svc.price}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {svc.desc}
                </p>
              </div>

              <button
                onClick={() => handleSendQuery(`I would like to inquire about ${svc.title} and pricing.`)}
                className="w-full pt-3 border-t border-white/10 text-left text-xs font-bold text-cyan-400 hover:text-white flex items-center justify-between transition-colors group-hover:underline"
              >
                <span>Ask AI Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CENTERPIECE: EMBEDDED LIVE AI VOICE AGENT CALL CONSOLE */}
      <section id="voice-agent" ref={callConsoleRef} className="px-4 md:px-8 py-12 max-w-4xl mx-auto">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#0A1022] to-[#060A16] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] space-y-6 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg relative">
                <Phone className="w-6 h-6 text-cyan-400" />
                {isCallActive && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>}
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  {data.companyName} — Live Voice Agent
                </h3>
                <p className="text-xs text-gray-400">
                  Agent: <strong className="text-white">{data.agentName}</strong> ({data.gender.toUpperCase()}) • 24/7 Intelligent Booking Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isCallActive ? (
                <button
                  onClick={() => startCall()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${theme.btnBg}`}
                >
                  <Phone className="w-4 h-4" /> Start Demo Call
                </button>
              ) : (
                <button
                  onClick={endCall}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <Square className="w-4 h-4" /> End Call
                </button>
              )}
            </div>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-gray-400">Try Asking:</span>
            <button 
              onClick={() => handleSendQuery(`What are your prices for ${data.services[0]?.title || 'services'}?`)}
              className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-2.5 py-1 rounded-full transition-colors"
            >
              "What are your prices?"
            </button>
            <button 
              onClick={() => handleSendQuery(`Can I book an emergency appointment for tomorrow?`)}
              className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-2.5 py-1 rounded-full transition-colors"
            >
              "Can I book for tomorrow?"
            </button>
            <button 
              onClick={() => handleSendQuery(`Where are you located and what are your hours?`)}
              className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-2.5 py-1 rounded-full transition-colors"
            >
              "Where are you located?"
            </button>
          </div>

          {/* Live Transcript Window */}
          <div className="bg-[#03060E] border border-white/10 rounded-2xl p-4 h-56 overflow-y-auto space-y-3 font-sans text-xs">
            {simMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 font-mono space-y-2">
                <Volume2 className="w-8 h-8 text-gray-600 animate-pulse" />
                <p>Click "Start Demo Call" or type your inquiry below to test {data.companyName}'s Voice Agent in real-time.</p>
              </div>
            ) : (
              simMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl max-w-[85%] ${
                    msg.sender === 'ai'
                      ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 mr-auto shadow-md'
                      : 'bg-white/10 border border-white/20 text-white ml-auto text-right'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-mono text-gray-400">
                    <span className={msg.sender === 'ai' ? 'text-cyan-400 font-bold' : 'text-gray-300'}>
                      {msg.sender === 'ai' ? `${data.agentName} (AI Receptionist)` : 'Caller'}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed text-xs">{msg.text}</p>
                </div>
              ))
            )}
            {isAiThinking && (
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 text-xs mr-auto flex items-center gap-2 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {data.agentName} is thinking...
              </div>
            )}
          </div>

          {/* Input & Voice Controls */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userQueryInput}
              onChange={(e) => setUserQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              placeholder={`Ask ${data.agentName} anything or type your booking inquiry...`}
              className="flex-1 bg-[#03060E] border border-white/20 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-400 font-sans placeholder:text-gray-500"
            />

            <button
              onClick={toggleMicListening}
              className={`px-3.5 py-3 rounded-xl border text-xs font-bold transition-all ${
                isRecordingMic 
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                  : 'bg-white/5 border-white/20 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              title="Speak into Microphone"
            >
              {isRecordingMic ? <Mic className="w-4 h-4 text-red-400" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleSendQuery()}
              disabled={isAiThinking}
              className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-transform hover:scale-105 disabled:opacity-50"
            >
              Send
            </button>
          </div>

          {/* Lead Capture Banner */}
          {capturedLead && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-mono">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Appointment Logged: <strong>{capturedLead.callerName}</strong> ({capturedLead.topic})</span>
              </div>
              <span className="text-[11px] bg-emerald-900/80 px-2.5 py-1 rounded text-emerald-200 font-bold">
                {capturedLead.requestedSlot}
              </span>
            </div>
          )}

        </div>
      </section>

      {/* 7. WHY CHOOSE US / COMPETITIVE ADVANTAGES */}
      <section id="why-us" className="px-4 md:px-8 py-12 max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            The {data.companyName} Standard
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Why Clients Choose Us</h2>
          <p className="text-xs text-gray-400">Industry-leading standards, rapid execution, and zero communication delays.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">24/7 Instant AI Receptionist</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Never get sent to voicemail. Our AI answers on the 1st ring 24/7 to provide instant service details and schedule appointments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white">100% Upfront Transparent Pricing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Clear, honest estimates before any work begins. No hidden add-ons, surprise fees, or aggressive sales tactics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Guaranteed Satisfaction</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Backed by our ironclad warranty and dedicated support team. If you are not 100% satisfied, we make it right immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER TESTIMONIALS */}
      {data.reviews && data.reviews.length > 0 && (
        <section id="reviews" className="px-4 md:px-8 py-12 max-w-6xl mx-auto space-y-8 bg-[#070B16] rounded-3xl border border-white/10 my-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400" /> 5-Star Verified Client Reviews
            </div>
            <h2 className="text-2xl font-black text-white">Loved by Hundreds of Clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.reviews.map((rev, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{rev.name}</span>
                  <span className="text-[10px] font-mono text-gray-400">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. DIRECT APPOINTMENT BOOKING FORM */}
      <section id="booking-form" className="px-4 md:px-8 py-12 max-w-3xl mx-auto">
        <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/15 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">Schedule Your Appointment Online</h2>
            <p className="text-xs text-gray-400">Prefer text over voice? Fill out the quick form below for instant confirmation.</p>
          </div>

          {bookingSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2 text-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-base font-bold text-white">Consultation Request Received!</div>
              <p className="text-xs text-emerald-200">Our concierge team and AI coordinator will confirm your slot via SMS shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. Johnathan Smith"
                    className="w-full bg-[#03060E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#03060E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">Requested Service</label>
                  <select
                    value={bookingService}
                    onChange={(e) => setBookingService(e.target.value)}
                    className="w-full bg-[#03060E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {data.services.map((s, idx) => (
                      <option key={idx} value={s.title}>{s.title} ({s.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">Preferred Timeframe</label>
                  <input
                    type="text"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    placeholder="e.g. Tomorrow Afternoon"
                    className="w-full bg-[#03060E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] ${theme.btnBg}`}
              >
                Confirm Appointment Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 10. INTERACTIVE FAQ ACCORDION */}
      {data.faqs && data.faqs.length > 0 && (
        <section id="faq" className="px-4 md:px-8 py-12 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-400">Everything you need to know about our services and policies</p>
          </div>

          <div className="space-y-3">
            {data.faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-cyan-400' : 'text-gray-400'}`} />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. FOOTER */}
      <footer className="border-t border-white/10 bg-[#03060E] px-4 md:px-8 py-10 text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              {getLogoIconComponent()}
            </div>
            <div>
              <div className="font-bold text-white">{data.companyName}</div>
              <div className="text-[10px] text-gray-500 font-mono">© {new Date().getFullYear()} All Rights Reserved.</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400 font-mono text-[11px]">
            <span>{data.phone}</span>
            <span>•</span>
            <span>{data.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>AI Voice & Web Portal by Quorik Enterprise</span>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING 24/7 TALK WITH AI LAUNCHER BUTTON */}
      {isStandalone && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
          {!floatingWidgetOpen && (
            <div 
              onClick={() => {
                setFloatingWidgetOpen(true);
                startCall();
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#0A0E1A] to-[#161F38] border-2 border-cyan-400 shadow-[0_10px_30px_rgba(0,229,255,0.4)] cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-400/20 flex items-center justify-center relative">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-0 right-0 animate-ping"></span>
              </div>
              <div className="flex flex-col text-left line-clamp-1">
                <span className="text-xs font-black text-white">Talk with AI</span>
                <span className="text-[9px] text-cyan-400 font-mono font-bold">24/7 Live Concierge</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
