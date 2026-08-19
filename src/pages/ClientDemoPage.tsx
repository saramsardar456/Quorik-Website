import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Building2, 
  Sparkles, 
  Phone, 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Copy, 
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
  X, 
  ExternalLink,
  Edit3,
  Award,
  UserCheck,
  Utensils,
  Dumbbell,
  Sun,
  Calculator,
  Scissors,
  Dog,
  Cpu,
  Hotel,
  Briefcase,
  Lock,
  Key,
  AlertTriangle
} from 'lucide-react';

export function ClientDemoPage() {
  const [searchParams] = useSearchParams();

  // Parse URL Params with defaults
  const companyName = searchParams.get('name') || 'Apex Dental Studio';
  const tagline = searchParams.get('tagline') || 'Painless General, Cosmetic & Implant Dentistry';
  const agentName = searchParams.get('agent') || 'Arthur';
  const gender = (searchParams.get('gender') as 'female' | 'male') || 'female';
  const phone = searchParams.get('phone') || '+1 (800) 450-DENT';
  const theme = searchParams.get('theme') || 'teal';
  const logoIcon = searchParams.get('icon') || 'dental';

  const service1 = {
    title: searchParams.get('s1') || 'Teeth Whitening & Veneers',
    desc: searchParams.get('s1d') || 'Laser teeth whitening and custom porcelain veneers for instant celebrity smile.',
    price: searchParams.get('s1p') || 'From $299'
  };

  const service2 = {
    title: searchParams.get('s2') || 'Dental Implants & Crowns',
    desc: searchParams.get('s2d') || 'Permanent titanium tooth replacement with natural cosmetic crown fitting.',
    price: searchParams.get('s2p') || 'Free Exam & Consultation'
  };

  const service3 = {
    title: searchParams.get('s3') || '24/7 Emergency Care',
    desc: searchParams.get('s3d') || 'Immediate relief for toothaches, broken crowns, and urgent dental injuries.',
    price: searchParams.get('s3p') || 'Same-Day Slot'
  };

  // Demo Call Limit Safeguard (Default 5 calls max)
  const maxCalls = parseInt(searchParams.get('maxCalls') || '5', 10);
  const storageKey = `quorik_demo_calls_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  
  const [demoCallsUsed, setDemoCallsUsed] = useState<number>(() => {
    try {
      const val = localStorage.getItem(storageKey);
      return val ? parseInt(val, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [showLimitModal, setShowLimitModal] = useState(false);

  // Admin Authorization State for Counter Reset
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('adminToken'));
    } catch (e) {
      return false;
    }
  });
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState('');

  // State for AI Voice Call Simulator
  const [isCallActive, setIsCallActive] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [userQueryInput, setUserQueryInput] = useState('');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([]);
  const [capturedLead, setCapturedLead] = useState<{ callerName: string; topic: string; requestedSlot: string } | null>(null);

  const executeReset = () => {
    setDemoCallsUsed(0);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
    setShowLimitModal(false);
    setShowAdminAuthModal(false);
    setAdminPasswordInput('');
    setAdminAuthError('');
    setResetSuccessNotice('Demo test calls successfully reset to 0/5 (Admin Authorized)');
    setTimeout(() => setResetSuccessNotice(''), 4500);
  };

  const handleAdminResetTrigger = () => {
    // ALWAYS require entering the admin password first every time before resetting
    setAdminAuthError('');
    setAdminPasswordInput('');
    setShowAdminAuthModal(true);
  };

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPass = adminPasswordInput.trim();
    if (!trimmedPass) {
      setAdminAuthError('Please enter the Quorik Admin password.');
      return;
    }

    setAdminAuthLoading(true);
    setAdminAuthError('');

    try {
      // Authenticate via server login endpoint
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmedPass })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          try {
            localStorage.setItem('adminToken', data.token);
          } catch (e) {}
          setIsAdminAuthenticated(true);
        }
        executeReset();
      } else {
        // Fallback check if server offline or default master key
        if (trimmedPass === '7860') {
          try {
            localStorage.setItem('adminToken', 'admin_session_valid');
          } catch (e) {}
          setIsAdminAuthenticated(true);
          executeReset();
        } else {
          setAdminAuthError('Access Denied: Incorrect Admin Password. Only Quorik Agency Admins have permission to reset this demo.');
        }
      }
    } catch (err) {
      if (trimmedPass === '7860') {
        try {
          localStorage.setItem('adminToken', 'admin_session_valid');
        } catch (e) {}
        setIsAdminAuthenticated(true);
        executeReset();
      } else {
        setAdminAuthError('Access Denied: Incorrect Admin Password. Only Quorik Agency Admins have permission to reset this demo.');
      }
    } finally {
      setAdminAuthLoading(false);
    }
  };

  // Floating Widget State
  const [isFloatingWidgetOpen, setIsFloatingWidgetOpen] = useState(false);
  const [showAdminBanner, setShowAdminBanner] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingService, setBookingService] = useState(service1.title);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioFallbackRef = useRef<HTMLAudioElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Speech resume loop
  useEffect(() => {
    let interval: any;
    if (isAiSpeaking) {
      interval = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAiSpeaking]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const playAudioFallback = (text: string) => {
    try {
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
      const encoded = encodeURIComponent(text.slice(0, 200));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en&client=tw-ob`;
      
      const audio = new Audio(ttsUrl);
      audioFallbackRef.current = audio;
      audio.playbackRate = 0.95;
      audio.onplay = () => setIsAiSpeaking(true);
      audio.onended = () => setIsAiSpeaking(false);
      audio.onerror = () => setIsAiSpeaking(false);
      audio.play().catch(() => setIsAiSpeaking(false));
    } catch (e) {
      setIsAiSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (!('speechSynthesis' in window)) {
      playAudioFallback(text);
      return;
    }

    try {
      window.speechSynthesis.resume();

      const executeSpeak = () => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.92;
          utterance.pitch = gender === 'female' ? 1.08 : 0.90;

          if (typeof window !== 'undefined') {
            (window as any)._speechUtterances = (window as any)._speechUtterances || [];
            (window as any)._speechUtterances.push(utterance);
          }

          const cleanup = () => {
            setIsAiSpeaking(false);
            if (typeof window !== 'undefined' && (window as any)._speechUtterances) {
              (window as any)._speechUtterances = (window as any)._speechUtterances.filter((u: any) => u !== utterance);
            }
          };

          utterance.onstart = () => setIsAiSpeaking(true);
          utterance.onend = cleanup;
          utterance.onerror = () => {
            cleanup();
            playAudioFallback(text);
          };

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          playAudioFallback(text);
        }
      };

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setTimeout(executeSpeak, 60);
      } else {
        executeSpeak();
      }
    } catch (err) {
      playAudioFallback(text);
    }
  };

  const startCall = (customInitialQuery?: string) => {
    if (maxCalls > 0 && demoCallsUsed >= maxCalls) {
      setShowLimitModal(true);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Increment demo calls used
    if (maxCalls > 0) {
      const nextCalls = demoCallsUsed + 1;
      setDemoCallsUsed(nextCalls);
      try {
        localStorage.setItem(storageKey, nextCalls.toString());
      } catch (e) {}
    }

    setIsCallActive(true);
    setCallState('connecting');
    setSimMessages([]);

    if (consoleRef.current) {
      consoleRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      setCallState('connected');
      const greeting = `Hello and thank you for calling ${companyName}! My name is ${agentName}. I can assist you with our services including ${service1.title}, ${service2.title}, or ${service3.title}, and schedule your consultation today. How may I help you?`;
      
      setSimMessages([{ sender: 'ai', text: greeting, time: '00:01' }]);
      speakText(greeting);

      if (customInitialQuery) {
        setTimeout(() => {
          handleSendQuery(customInitialQuery);
        }, 1200);
      }
    }, 400);
  };

  const endCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioFallbackRef.current) {
      audioFallbackRef.current.pause();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsCallActive(false);
    setCallState('ended');
    setIsAiSpeaking(false);
    setIsRecordingMic(false);
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || userQueryInput;
    if (!textToSend.trim() || isAiThinking) return;

    if (maxCalls > 0 && demoCallsUsed >= maxCalls && !isCallActive) {
      setShowLimitModal(true);
      return;
    }

    if (!isCallActive) {
      startCall(textToSend);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);

    const now = new Date();
    const userTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
          gender,
          userQuery: textToSend,
          conversationHistory: historyForApi,
          customCompany: {
            name: companyName,
            agentName: agentName,
            services: [service1.title, service2.title, service3.title]
          }
        })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await res.json();
      setIsAiThinking(false);

      if (data.success && data.aiSpeechText) {
        const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSimMessages(prev => [...prev, { sender: 'ai', text: data.aiSpeechText, time: aiTimeStr }]);
        speakText(data.aiSpeechText);

        if (data.extractedLead) {
          setCapturedLead({
            callerName: data.extractedLead.callerName || 'Valued Client',
            topic: data.extractedLead.topic || service1.title,
            requestedSlot: data.extractedLead.requestedSlot || 'Tomorrow @ 11:00 AM EST'
          });
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      setIsAiThinking(false);
      const fallback = `Thank you for asking about ${companyName}. I have registered your inquiry regarding ${service1.title} and will have our team follow up with you.`;
      setSimMessages(prev => [...prev, { sender: 'ai', text: fallback, time: '00:30' }]);
      speakText(fallback);
    }
  };

  const toggleMicListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query in the box.");
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
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (finalTranscript.trim()) {
          setUserQueryInput(finalTranscript);
          recognition.stop();
          setIsRecordingMic(false);
          handleSendQuery(finalTranscript);
        } else if (interim.trim()) {
          setUserQueryInput(interim);
        }
      };

      recognition.onerror = () => setIsRecordingMic(false);
      recognition.onend = () => setIsRecordingMic(false);

      recognition.start();
    } catch (e) {
      setIsRecordingMic(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setCapturedLead({
      callerName: bookingName || 'Web Visitor',
      topic: bookingService,
      requestedSlot: 'Tomorrow @ 10:00 AM'
    });
  };

  // Theme Config Helper
  const getThemeConfig = () => {
    switch (theme) {
      case 'gold':
        return {
          bg: 'bg-[#0B0A06]',
          cardBg: 'bg-[#14120A]',
          accentText: 'text-amber-400',
          accentBorder: 'border-amber-500/30',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-black',
          gradient: 'from-amber-500 to-yellow-600',
        };
      case 'emerald':
        return {
          bg: 'bg-[#040B07]',
          cardBg: 'bg-[#09150E]',
          accentText: 'text-emerald-400',
          accentBorder: 'border-emerald-500/30',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-black',
          gradient: 'from-emerald-500 to-teal-600',
        };
      case 'blue':
        return {
          bg: 'bg-[#050914]',
          cardBg: 'bg-[#0A1124]',
          accentText: 'text-blue-400',
          accentBorder: 'border-blue-500/30',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          btnBg: 'bg-blue-500 hover:bg-blue-400 text-white',
          gradient: 'from-blue-500 to-indigo-600',
        };
      case 'purple':
        return {
          bg: 'bg-[#090514]',
          cardBg: 'bg-[#120A24]',
          accentText: 'text-purple-400',
          accentBorder: 'border-purple-500/30',
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          btnBg: 'bg-purple-500 hover:bg-purple-400 text-white',
          gradient: 'from-purple-500 to-pink-600',
        };
      default: // teal
        return {
          bg: 'bg-[#05090F]',
          cardBg: 'bg-[#0A121E]',
          accentText: 'text-cyan-400',
          accentBorder: 'border-cyan-500/30',
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          btnBg: 'bg-cyan-400 hover:bg-cyan-300 text-black',
          gradient: 'from-cyan-400 to-teal-500',
        };
    }
  };

  const t = getThemeConfig();

  const getLogoIcon = () => {
    switch (logoIcon) {
      case 'dental': return <Stethoscope className="w-6 h-6 text-cyan-400" />;
      case 'house': return <Home className="w-6 h-6 text-amber-400" />;
      case 'legal': return <Scale className="w-6 h-6 text-blue-400" />;
      case 'spa': return <Smile className="w-6 h-6 text-purple-400" />;
      case 'hvac': return <Wrench className="w-6 h-6 text-emerald-400" />;
      case 'auto': return <Car className="w-6 h-6 text-amber-400" />;
      case 'restaurant': return <Utensils className="w-6 h-6 text-amber-400" />;
      case 'fitness': return <Dumbbell className="w-6 h-6 text-cyan-400" />;
      case 'solar': return <Sun className="w-6 h-6 text-amber-400" />;
      case 'accounting': return <Calculator className="w-6 h-6 text-blue-400" />;
      case 'barber': return <Scissors className="w-6 h-6 text-emerald-400" />;
      case 'vet': return <Dog className="w-6 h-6 text-rose-400" />;
      case 'cleaning': return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'tech': return <Cpu className="w-6 h-6 text-blue-400" />;
      case 'hotel': return <Hotel className="w-6 h-6 text-indigo-400" />;
      default: return <Building2 className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className={`min-h-screen ${t.bg} text-white font-sans selection:bg-cyan-400 selection:text-black relative`}>
      <SEO
        title={`${companyName} | ${tagline || 'Official Business Portal'}`}
        description={`Welcome to ${companyName}. ${tagline}. Book consultations, inquire about services, and speak with ${agentName}, our 24/7 AI Voice Concierge.`}
        keywords={`${companyName}, ${service1.title}, ${service2.title}, ${service3.title}, AI receptionist`}
        canonicalPath="/client-demo"
      />
      
      {/* 1. TOP AGENCY ADMIN BANNER (Subtle Bar to Edit or Share) */}
      {showAdminBanner && (
        <div className="bg-[#0D1527] border-b border-cyan-500/30 text-xs px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-50 relative">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-mono text-[11px]">
              🚀 LIVE CLIENT DEMO MODE: <strong className="text-white">{companyName}</strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>{maxCalls > 0 ? `${demoCallsUsed}/${maxCalls} Calls Used` : 'Unlimited Calls'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded border border-white/20"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={() => setShowAdminBanner(false)}
              className="text-gray-400 hover:text-white p-1"
              title="Hide Banner for Presentation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. STANDALONE CLIENT HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#05090F]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-white/5 border ${t.accentBorder} shadow-lg`}>
              {getLogoIcon()}
            </div>
            <div>
              <div className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {companyName}
              </div>
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                Official Web Portal & 24/7 AI Hotline
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-gray-300">
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#voice-assistant" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Assistant
            </a>
            <a href="#booking" className="hover:text-cyan-400 transition-colors">Appointments</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a 
              href={`tel:${phone}`}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{phone}</span>
            </a>

            <button
              onClick={() => startCall()}
              className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 ${t.btnBg}`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Call {agentName} (AI Agent)</span>
            </button>
          </div>

        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border shadow-inner ${t.badge}`}>
            <Sparkles className="w-4 h-4" /> 24/7 AI Phone Receptionist Active
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            {tagline}
          </h1>

          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white">{companyName}</strong>. Experience premium services paired with our instant 24/7 Voice Receptionist <strong className="text-cyan-400">{agentName}</strong>. Ask questions, explore services, or book your appointment in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => startCall()}
              className={`px-8 py-4 text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 ${t.btnBg}`}
            >
              <Phone className="w-5 h-5" /> Speak With AI Agent Now
            </button>

            <a
              href="#booking"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Book Online Appointment
            </a>
          </div>

          {/* Key Trust Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <div className="text-xs font-bold text-white">Top Rated Service</div>
              <div className="text-[10px] text-gray-400 font-mono">100+ 5-Star Reviews</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 24/7 Availability
              </div>
              <div className="text-xs font-bold text-white">Instant Answers</div>
              <div className="text-[10px] text-gray-400 font-mono">AI Voice Assistant {agentName}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Specialists
              </div>
              <div className="text-xs font-bold text-white">Certified Team</div>
              <div className="text-[10px] text-gray-400 font-mono">Industry Leading Standard</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs font-bold text-purple-400 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Easy Booking
              </div>
              <div className="text-xs font-bold text-white">Same-Day Slots</div>
              <div className="text-[10px] text-gray-400 font-mono">Real-Time Confirmation</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THREE CORE SERVICES SECTION */}
      <section id="services" className="py-16 px-4 md:px-8 border-t border-white/10 bg-[#080E18]">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <div className={`inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${t.badge}`}>
              Tailored Solutions
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">
              Featured Core Services
            </h2>
            <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto">
              Explore our primary services below. You can ask <strong className="text-white">{agentName}</strong> any question about pricing or custom packages directly over voice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Service Card 1 */}
            <div className={`p-6 rounded-2xl ${t.cardBg} border ${t.accentBorder} space-y-4 flex flex-col justify-between relative group hover:-translate-y-1 transition-all shadow-xl`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Service 01</span>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md border ${t.badge}`}>{service1.price}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  {service1.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {service1.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleSendQuery(`I would like to know pricing and details for ${service1.title}`)}
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Ask Voice Agent <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className={`p-6 rounded-2xl ${t.cardBg} border ${t.accentBorder} space-y-4 flex flex-col justify-between relative group hover:-translate-y-1 transition-all shadow-xl`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Service 02</span>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md border ${t.badge}`}>{service2.price}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  {service2.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {service2.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleSendQuery(`Can you explain what is included in ${service2.title}?`)}
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Ask Voice Agent <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className={`p-6 rounded-2xl ${t.cardBg} border ${t.accentBorder} space-y-4 flex flex-col justify-between relative group hover:-translate-y-1 transition-all shadow-xl`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Service 03</span>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md border ${t.badge}`}>{service3.price}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  {service3.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {service3.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleSendQuery(`I need help booking an emergency slot for ${service3.title}`)}
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Ask Voice Agent <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. EMBEDDED INTERACTIVE AI VOICE AGENT CALL CONSOLE */}
      <section id="voice-assistant" ref={consoleRef} className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-[#0A121E] border-2 border-cyan-500/40 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-2xl text-cyan-400">
                <Volume2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {companyName} Voice Receptionist
                </h3>
                <p className="text-xs text-gray-400">
                  AI Agent Persona: <strong className="text-white">{agentName}</strong> • Trained on {companyName}'s 3 Core Services
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase tracking-widest rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 24/7 Phone Active
              </span>
            </div>
          </div>

          {/* Anti-Spam Call Safeguard Bar */}
          <div className="bg-[#05090F] border border-cyan-500/20 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-gray-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Anti-Spam Safeguard:</span>
              <span className="text-gray-400 text-[11px]">
                {maxCalls > 0 ? `Capped at max ${maxCalls} test calls per client link` : 'Unlimited test calls enabled'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                maxCalls > 0 && demoCallsUsed >= maxCalls
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }`}>
                {maxCalls > 0 ? `${demoCallsUsed} / ${maxCalls} Calls Used` : 'Unlimited Active'}
              </span>

              {demoCallsUsed > 0 && (
                <button
                  onClick={handleAdminResetTrigger}
                  className="text-[11px] text-gray-300 hover:text-cyan-400 flex items-center gap-1.5 font-mono transition-colors border border-white/15 hover:border-cyan-400/50 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 shadow-sm"
                  title="Agency Admin Authorization Required to Reset Counter"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Admin Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Admin Reset Success Feedback Banner */}
          {resetSuccessNotice && (
            <div className="bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-mono animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetSuccessNotice}</span>
            </div>
          )}

          {/* Call Controls Bar */}
          <div className="bg-[#05090F] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${isCallActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></div>
              <div className="text-xs font-mono text-gray-300">
                Status: <span className="text-white font-bold uppercase">{isCallActive ? 'Voice Call In Progress' : 'Call Idle (Ready)'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isCallActive ? (
                <button
                  onClick={() => startCall()}
                  className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-2 ${t.btnBg}`}
                >
                  <Phone className="w-4 h-4" /> Start Demo Call
                </button>
              ) : (
                <button
                  onClick={endCall}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-2"
                >
                  <Square className="w-4 h-4" /> Hang Up
                </button>
              )}
            </div>
          </div>

          {/* Transcript Dialogue Box */}
          <div className="bg-[#05090F] border border-white/10 rounded-2xl p-5 h-64 overflow-y-auto space-y-3 font-sans text-xs">
            {simMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono text-center gap-2">
                <Phone className="w-8 h-8 text-cyan-400/40 animate-bounce" />
                <p>Click "Start Demo Call" or type below to test <strong className="text-gray-300">{companyName}'s</strong> Voice Agent live.</p>
              </div>
            ) : (
              simMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl max-w-[85%] ${
                    msg.sender === 'ai'
                      ? 'bg-cyan-950/40 border border-cyan-500/30 text-gray-200 mr-auto'
                      : 'bg-white/10 border border-white/20 text-white ml-auto text-right'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-mono text-gray-400">
                    <span className={msg.sender === 'ai' ? 'text-cyan-400 font-bold' : 'text-gray-300'}>
                      {msg.sender === 'ai' ? `${agentName} (${companyName})` : 'Caller'}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed text-xs">{msg.text}</p>
                </div>
              ))
            )}

            {isAiThinking && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs mr-auto flex items-center gap-2 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {agentName} is responding...
              </div>
            )}
          </div>

          {/* Input Controls */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userQueryInput}
              onChange={(e) => setUserQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              placeholder={`Ask ${agentName} anything about ${service1.title}, ${service2.title}, or pricing...`}
              className="flex-1 bg-[#05090F] border border-white/20 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-400 font-sans"
            />

            <button
              onClick={toggleMicListening}
              className={`px-3.5 py-3 rounded-xl border text-xs font-bold transition-colors ${
                isRecordingMic 
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                  : 'bg-white/5 border-white/20 text-gray-300 hover:text-white'
              }`}
              title="Mic Input"
            >
              {isRecordingMic ? <Mic className="w-4 h-4 text-red-400" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleSendQuery()}
              disabled={isAiThinking}
              className={`px-6 py-3 font-black text-xs uppercase tracking-wider rounded-xl ${t.btnBg}`}
            >
              Send
            </button>
          </div>

          {/* Lead Confirmation Banner */}
          {capturedLead && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Appointment Confirmed: <strong>{capturedLead.callerName}</strong> ({capturedLead.topic})</span>
              </div>
              <span className="text-[10px] bg-emerald-900/80 px-2.5 py-1 rounded-md text-emerald-100 font-bold">
                {capturedLead.requestedSlot}
              </span>
            </div>
          )}

        </div>
      </section>

      {/* 6. APPOINTMENT BOOKING FORM */}
      <section id="booking" className="py-16 px-4 md:px-8 border-t border-white/10 bg-[#080E18]">
        <div className="max-w-3xl mx-auto bg-[#0A121E] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Book an Appointment Online</h3>
            <p className="text-xs text-gray-400">Prefer text booking over voice? Fill out the form below for instant scheduling.</p>
          </div>

          {bookingSubmitted ? (
            <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Appointment Request Submitted!</h4>
              <p className="text-xs text-emerald-300">
                Thank you, <strong>{bookingName}</strong>. Our team at <strong>{companyName}</strong> has received your request for <strong>{bookingService}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. John Miller"
                    className="w-full bg-[#05090F] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2831"
                    className="w-full bg-[#05090F] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1">Selected Service</label>
                <select
                  value={bookingService}
                  onChange={(e) => setBookingService(e.target.value)}
                  className="w-full bg-[#05090F] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value={service1.title}>{service1.title} ({service1.price})</option>
                  <option value={service2.title}>{service2.title} ({service2.price})</option>
                  <option value={service3.title}>{service3.title} ({service3.price})</option>
                </select>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 text-xs font-black uppercase tracking-widest rounded-xl shadow-xl ${t.btnBg}`}
              >
                Confirm Appointment Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. CLIENT FOOTER */}
      <footer className="border-t border-white/10 py-10 px-4 md:px-8 text-xs text-gray-400 bg-[#05090F]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              {getLogoIcon()}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{companyName}</div>
              <div className="text-[11px] text-gray-400">{tagline}</div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Phone: {phone}</span>
            <span>24/7 AI Voice Receptionist Active</span>
          </div>

          <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="text-cyan-400 font-bold">Quorik AI Engine</span>
          </div>
        </div>
      </footer>

      {/* 8. FLOATING BOTTOM-RIGHT VOICE AGENT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isFloatingWidgetOpen ? (
          <button
            onClick={() => {
              setIsFloatingWidgetOpen(true);
              if (!isCallActive) startCall();
            }}
            className={`p-4 rounded-full shadow-2xl flex items-center gap-3 border transition-transform hover:scale-110 ${t.btnBg}`}
          >
            <Phone className="w-6 h-6 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider hidden sm:inline">
              Call {agentName}
            </span>
          </button>
        ) : (
          <div className="w-80 bg-[#0A121E] border-2 border-cyan-400 rounded-2xl shadow-2xl p-4 space-y-3 relative text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="font-bold text-white">{companyName} Voice Agent</span>
              </div>
              <button onClick={() => setIsFloatingWidgetOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] text-gray-300">
              Speaking with <strong className="text-cyan-400">{agentName}</strong> ({companyName} AI Receptionist)
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => isCallActive ? endCall() : startCall()}
                className={`flex-1 py-2 text-[11px] font-bold uppercase rounded-lg ${
                  isCallActive ? 'bg-red-600 text-white' : t.btnBg
                }`}
              >
                {isCallActive ? 'Hang Up' : 'Start Call'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 9. DEMO CALL LIMIT REACHED MODAL */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A121E] border-2 border-cyan-400 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 relative shadow-2xl animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-white">
                Demo Test Call Limit Reached ({maxCalls}/{maxCalls} Calls Used)
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                This client demo preview for <strong className="text-white">{companyName}</strong> has completed its {maxCalls} allocated test calls.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-gray-300 space-y-2 font-mono">
              <div className="text-white font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Unlock Full Production Client Plan
              </div>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                To give {companyName} unlimited 24/7 AI Receptionist access, deploy a dedicated production instance with custom business phone forwarding and automated CRM lead capture.
              </p>
            </div>

            {/* Client Conversion CTAs */}
            <div className="space-y-2.5 pt-1">
              <Link
                to="/contact"
                className={`w-full py-3.5 text-xs font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102 ${t.btnBg}`}
              >
                <span>Upgrade to Production Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Close Notice
              </button>
            </div>

            {/* Agency Admin Only Protected Access */}
            <div className="pt-3 border-t border-white/10 text-center">
              <button
                onClick={handleAdminResetTrigger}
                className="text-[11px] font-mono text-gray-400 hover:text-cyan-400 flex items-center justify-center gap-1.5 mx-auto transition-colors"
                title="Only Quorik Agency Admins have permission to reset this demo limit"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Agency Admin: Reset Demo Counter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. ADMIN AUTHENTICATION / MASTER PIN MODAL */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-[#0D1524] border-2 border-cyan-500 p-6 sm:p-8 rounded-3xl max-w-sm w-full space-y-5 relative shadow-2xl animate-in fade-in zoom-in-95">
            <button 
              onClick={() => {
                setShowAdminAuthModal(false);
                setAdminAuthError('');
                setAdminPasswordInput('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-white">
                Admin Authorization Required
              </h3>
              <p className="text-xs text-gray-400">
                Only the Agency Admin has authority to reset demo test calls. Enter your Admin Master Password to proceed.
              </p>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-gray-300 block">
                  Admin Password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      if (adminAuthError) setAdminAuthError('');
                    }}
                    placeholder="Enter admin password..."
                    autoFocus
                    className="w-full bg-[#05090F] border border-white/20 focus:border-cyan-400 text-white text-xs px-4 py-3 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              {adminAuthError && (
                <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-red-300 text-[11px] font-mono flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{adminAuthError}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={adminAuthLoading}
                  className={`w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 ${t.btnBg} disabled:opacity-50`}
                >
                  {adminAuthLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Authority...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      <span>Verify & Reset Counter</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAdminAuthModal(false);
                    setAdminAuthError('');
                    setAdminPasswordInput('');
                  }}
                  className="w-full py-2 text-xs font-mono text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
