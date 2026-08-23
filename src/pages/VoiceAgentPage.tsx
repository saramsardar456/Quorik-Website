import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  Sparkles, 
  Clock, 
  Globe2, 
  ShieldCheck, 
  User,
  Mic
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Contact } from '../components/sections/Contact';
import { VoiceDemo } from '../components/sections/VoiceDemo';
import { SEO } from '../components/SEO';
import { speakEnglishUtterance } from '../utils/speechUtils';

interface Persona {
  id: string;
  femaleName: string;
  maleName: string;
  region: string;
  accent: string;
  flag: string;
  tone: string;
  femaleTranscript: string;
  maleTranscript: string;
  engLocale: string;
}

export function VoiceAgentPage() {
  const [activePersonaId, setActivePersonaId] = useState<string>('us-executive');
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>('female');
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const personas: Persona[] = [
    {
      id: 'us-executive',
      femaleName: 'Zephyr',
      maleName: 'Arthur',
      region: 'North America & Global Enterprise',
      accent: 'US Corporate Executive',
      flag: '🇺🇸',
      tone: 'Direct, Crisp & High-Efficiency',
      engLocale: 'en-US',
      femaleTranscript: "Hello and thank you for reaching Quorik! My name is Zephyr. I can answer your questions about custom website development, AI chatbots, and voice automation, or book a 15-minute discovery consultation for you right now. Should I schedule morning or afternoon?",
      maleTranscript: "Hello and thank you for reaching Quorik! My name is Arthur. I can answer your questions about custom website development, AI chatbots, and voice automation, or book a 15-minute discovery consultation for you right now. Should I schedule morning or afternoon?"
    },
    {
      id: 'uk-refined',
      femaleName: 'Clara',
      maleName: 'Oliver',
      region: 'United Kingdom & Europe',
      accent: 'UK Refined Received Pronunciation',
      flag: '🇬🇧',
      tone: 'Courteous, Calm & Elegant',
      engLocale: 'en-GB',
      femaleTranscript: "Good day and thank you for reaching Quorik. My name is Clara. I can assist you with your custom web development or AI automation project and secure a consultation with our project director for tomorrow. May I have your full name, please?",
      maleTranscript: "Good day and thank you for reaching Quorik. My name is Oliver. I can assist you with your custom web development or AI automation project and secure a consultation with our project director for tomorrow. May I have your full name, please?"
    }
  ];

  const currentPersona = personas.find(p => p.id === activePersonaId) || personas[0];
  const activeVoiceName = selectedGender === 'female' ? currentPersona.femaleName : currentPersona.maleName;
  const activeTranscript = selectedGender === 'female' ? currentPersona.femaleTranscript : currentPersona.maleTranscript;

  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (isAiSpeaking) {
      interval = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAiSpeaking]);

  const unlockAudio = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
    }
  };

  // Speak AI Speech Response out loud with strict English mobile optimization
  const speakText = (text: string) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    speakEnglishUtterance(text, {
      gender: selectedGender,
      preferredLocale: (currentPersona.engLocale as any) || 'en-US',
      onStart: () => {
        setIsAiSpeaking(true);
        setIsPlayingSample(true);
      },
      onEnd: () => {
        setIsAiSpeaking(false);
        setIsPlayingSample(false);
      },
      onError: () => {
        setIsAiSpeaking(false);
        setIsPlayingSample(false);
      }
    });
  };

  const handlePlaySample = () => {
    unlockAudio();
    if (isPlayingSample) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingSample(false);
      setIsAiSpeaking(false);
      return;
    }
    setIsPlayingSample(true);
    speakText(activeTranscript);
  };

  return (
    <div className="pt-24 bg-[#05060A] text-white min-h-screen">
      <SEO
        title="Website AI Voice Agents & Interactive Voice Concierge | Quorik"
        description="Deploy 24/7 in-browser AI voice agents with sub-350ms speech latency. Answer visitor questions, qualify leads, and schedule appointments directly on your website."
        keywords="website AI voice agent, in-browser voice AI, web voice assistant, website voice concierge, Quorik AI voice"
        canonicalPath="/voice-agent"
      />
      {/* Hero Section */}
      <section className="py-20 relative noise-bg overflow-hidden border-b border-white/5">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-teal/15 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[11px] font-mono font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 24/7 AI Web Voice Assistant & Sales Concierge
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase mb-8 leading-[1.05]">
              Engage Every Website <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-teal to-brand-blue">
                Visitor With Voice AI
              </span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed font-medium max-w-2xl mx-auto mb-10">
              Welcome website visitors with our zero-latency AI Voice Assistant. It answers questions, qualifies prospects, and books calendar appointments directly inside their web browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
              >
                <Mic className="w-4 h-4" /> Start Interactive Voice Demo
              </a>
              <Link
                to="/pricing"
                className="w-full sm:w-auto px-8 py-4 bg-[#0A0E1A] border border-white/15 text-white font-bold text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                Calculate ROI <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 bg-[#0A0E1A] border border-white/10 p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-teal">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">&lt; 350ms</div>
                <div className="text-[11px] text-gray-400 font-mono uppercase">Speech Latency</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">100% Instant</div>
                <div className="text-[11px] text-gray-400 font-mono uppercase">Response Rate</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">Unlimited</div>
                <div className="text-[11px] text-gray-400 font-mono uppercase">Web Sessions</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">12+</div>
                <div className="text-[11px] text-gray-400 font-mono uppercase">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC REAL-TIME VOICE DEMO (SAME AS HOMEPAGE) */}
      <VoiceDemo
        initialGender={selectedGender}
        initialPersonaId={activePersonaId}
        onGenderChange={setSelectedGender}
        onPersonaChange={setActivePersonaId}
      />

      {/* Interactive Personas & Gender Voice Switcher */}
      <section id="personas" className="py-24 bg-[#05060A] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold text-brand-teal uppercase tracking-[0.2em] font-mono font-bold">Accent & Gender Voice Switcher</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white mt-2">
              Female & Male Voice Personas
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              Switch seamlessly between Female (Zephyr, Clara) and Male (Arthur, Oliver) neural voice profiles.
            </p>

            {/* Gender Toggle Control */}
            <div className="inline-flex items-center gap-2 bg-[#0A0E1A] border border-white/15 p-1.5 mt-8">
              <button
                onClick={() => {
                  if (isPlayingSample) window.speechSynthesis.cancel();
                  setIsPlayingSample(false);
                  setSelectedGender('female');
                }}
                className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                  selectedGender === 'female'
                    ? 'bg-brand-teal text-[#05060A]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Female Voices (Zephyr / Clara)
              </button>
              <button
                onClick={() => {
                  if (isPlayingSample) window.speechSynthesis.cancel();
                  setIsPlayingSample(false);
                  setSelectedGender('male');
                }}
                className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                  selectedGender === 'male'
                    ? 'bg-brand-teal text-[#05060A]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Male Voices (Arthur / Oliver)
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Persona Selector Buttons */}
            <div className="lg:col-span-5 space-y-4">
              {personas.map((persona) => {
                const isActive = persona.id === activePersonaId;
                const displayName = selectedGender === 'female' ? persona.femaleName : persona.maleName;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      if (isPlayingSample) window.speechSynthesis.cancel();
                      setIsPlayingSample(false);
                      setActivePersonaId(persona.id);
                    }}
                    className={`w-full text-left p-6 transition-all border ${
                      isActive 
                        ? 'bg-[#0A0E1A] border-brand-teal shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                        : 'bg-[#05060A] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{persona.flag}</span>
                      <span className="text-[10px] font-mono text-brand-teal font-bold uppercase tracking-wider px-2 py-0.5 bg-brand-teal/10 border border-brand-teal/30">
                        {displayName} ({selectedGender.toUpperCase()})
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{displayName}</h3>
                    <p className="text-xs text-brand-teal font-mono uppercase font-semibold mb-2">{persona.region}</p>
                    <p className="text-xs text-gray-400 font-sans">{persona.accent} • {persona.tone}</p>
                  </button>
                );
              })}
            </div>

            {/* Selected Persona Showcase & Audio Player */}
            <div className="lg:col-span-7 bg-[#0A0E1A] border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 blur-[90px] rounded-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentPersona.flag}</span>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{activeVoiceName}</h3>
                    </div>
                    <p className="text-xs text-brand-teal font-mono uppercase tracking-wider mt-1">{currentPersona.region} Voice Profile ({selectedGender.toUpperCase()})</p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold uppercase">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Neural Ready
                  </span>
                </div>

                <div className="mb-8">
                  <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block mb-2">Speech Script Preview</span>
                  <div className="bg-[#05060A] border border-white/10 p-5 font-sans text-sm text-gray-200 leading-relaxed relative">
                    "{activeTranscript}"
                  </div>
                </div>

                {/* Audio Waveform Animation & Play Control */}
                <div className="bg-[#05060A] border border-white/10 p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      onClick={handlePlaySample}
                      className="w-14 h-14 rounded-full bg-brand-teal text-[#05060A] flex items-center justify-center hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0"
                    >
                      {isPlayingSample ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-white font-mono uppercase">
                        {isPlayingSample ? `Speaking with ${activeVoiceName}...` : `Click To Hear ${activeVoiceName}`}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono">Web Speech Synthesis ({selectedGender})</p>
                    </div>
                  </div>

                  {/* Visual Waveform Bars */}
                  <div className="flex items-center gap-1.5 h-10 w-full sm:w-48 justify-center">
                    {[30, 70, 45, 90, 60, 100, 40, 80, 50, 95, 30, 65, 85, 40, 75, 50].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayingSample ? 'bg-brand-teal animate-pulse' : 'bg-white/20'
                        }`}
                        style={{ height: isPlayingSample ? `${Math.max(15, (h * Math.random()) % 100)}%` : '20%' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-gray-400 font-mono">Want custom vocabulary or branch Q&A scripts?</span>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-teal uppercase tracking-wider hover:text-white"
                >
                  <Mic className="w-3.5 h-3.5" /> Book Custom Voice Training Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
