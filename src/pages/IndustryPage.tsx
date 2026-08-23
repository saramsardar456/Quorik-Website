import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INDUSTRIES, IndustryInfo } from '../data/industryData';
import { SEO } from '../components/SEO';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  Bot, 
  ArrowRight, 
  Mic, 
  Volume2, 
  VolumeX,
  Clock, 
  ShieldCheck, 
  Users, 
  Zap,
  TrendingUp,
  HelpCircle,
  Play,
  Square,
  Radio
} from 'lucide-react';
import { Contact } from '../components/sections/Contact';
import { speakEnglishUtterance } from '../utils/speechUtils';

// Industry Voice Answers Map for interactive demo
const INDUSTRY_VOICE_RESPONSES: Record<string, { opening: string; qa: { question: string; answer: string }[] }> = {
  'dental-medical': {
    opening: "Hello! Thank you for calling Apex Dental Care. My name is Sarah, your 24/7 AI Receptionist. I can help you schedule an appointment, verify insurance coverage, or route emergency dental care. How may I assist you today?",
    qa: [
      {
        question: "Do you take MetLife and Delta Dental insurance?",
        answer: "Yes! We accept both MetLife and Delta Dental PPO plans. I can verify your copay details and remaining benefit balance right over the phone."
      },
      {
        question: "I have a severe toothache, can I get an emergency appointment today?",
        answer: "I understand severe dental pain is urgent. I have flagged your call for emergency triage. We have an opening today at 2:30 PM with Dr. Vance. Shall I lock in that slot for you?"
      },
      {
        question: "What are your office hours and address?",
        answer: "We are located at 450 Medical Center Parkway, Suite 200. Our office is open Monday through Friday from 8 AM to 5 PM, and my AI voice system is available 24 hours a day."
      }
    ]
  },
  'legal-law-firms': {
    opening: "Hello and welcome to Vanguard Legal Partners. My name is Victoria, Senior Legal Intake Specialist. I can gather incident details, run a conflict check, and schedule a legal consultation for you right now. How can I assist with your case today?",
    qa: [
      {
        question: "I was in a car accident yesterday, can I speak to an attorney?",
        answer: "I am sorry to hear about your accident. Let me gather a few details to qualify your claim. Were there any physical injuries or a police report filed at the scene?"
      },
      {
        question: "How much do you charge for an initial legal consultation?",
        answer: "For personal injury and accident cases, our initial case evaluation is 100% free with zero upfront fees unless we recover compensation for you."
      },
      {
        question: "Do you handle family law and divorce cases in California?",
        answer: "Yes, our firm represents clients across California in family law and divorce proceedings. I can schedule a confidential consultation with attorney Rostova."
      }
    ]
  },
  'hvac-home-services': {
    opening: "Thank you for calling Apex Climate Control! My name is Jack, your 24/7 Service Dispatcher. I can dispatch an emergency technician or schedule a maintenance visit. What heating or cooling issue are you experiencing?",
    qa: [
      {
        question: "My AC stopped blowing cold air and it’s 90 degrees inside.",
        answer: "I hear you, high heat is urgent. I can dispatch an on-call technician to your home today between 1 PM and 3 PM. What is your service address?"
      },
      {
        question: "How much do you charge for a roof inspection?",
        answer: "Our comprehensive residential roof inspection is $89, which is credited directly toward any repair work you choose to perform with us."
      },
      {
        question: "Can someone come out tomorrow morning between 8 AM and 12 PM?",
        answer: "Yes! I have locked in tomorrow morning between 8 AM and 12 PM for a licensed technician. You will receive an automated text confirmation shortly."
      }
    ]
  },
  'real-estate': {
    opening: "Hello and welcome to Luxe Realty Group! My name is Claire, Leasing Assistant. I can provide property details, schedule showing walkthroughs, or handle maintenance requests. Which property are you inquiring about?",
    qa: [
      {
        question: "Is 425 Maple Street still available for a tour this Saturday?",
        answer: "Yes, 425 Maple Street is available! I have showing slots open this Saturday at 11:00 AM and 2:00 PM. Which time works best for you?"
      },
      {
        question: "What is the HOA fee for the condo on Ocean Avenue?",
        answer: "The Ocean Avenue luxury condo HOA fee is $425 per month, which includes 24/7 building security, heated pool maintenance, and underground parking."
      },
      {
        question: "My kitchen sink is leaking and I am a current tenant.",
        answer: "Thank you for reporting this. I have logged an urgent maintenance ticket for your unit and dispatched our property technician for immediate inspection."
      }
    ]
  },
  'ecommerce-retail': {
    opening: "Thank you for calling Aura Athletics! My name is Alex, Customer Concierge. I can look up your order status, handle returns, or answer product questions. What is your order number?",
    qa: [
      {
        question: "Where is my order #84920?",
        answer: "Order #84920 was handed off to FedEx yesterday and is currently in transit with an estimated delivery of Friday by 4 PM."
      },
      {
        question: "What is your holiday return policy?",
        answer: "We offer a hassle-free 30-day return policy. Items must be unworn with original tags attached. I can text you a pre-paid shipping label right now!"
      },
      {
        question: "Can I change my delivery address before it ships?",
        answer: "I can update your shipping address immediately if the package has not left our fulfillment center. What is the new address?"
      }
    ]
  },
  'financial-services': {
    opening: "Hello and welcome to Sovereign Wealth Management. My name is Eleanor, Executive Client Associate. I can answer questions regarding our advisory services and schedule a private consultation. How can I assist you today?",
    qa: [
      {
        question: "I am looking for a wealth manager for my $1.5M rollover portfolio.",
        answer: "Thank you for reaching out. A $1.5M rollover qualifies for our private wealth strategy group. I can schedule a private review with Principal Advisor Julian Thorne."
      },
      {
        question: "How do I schedule a retirement planning consultation?",
        answer: "I can reserve a 30-minute retirement planning review either in-person at our office or via secure video call. Should we look at Thursday afternoon?"
      },
      {
        question: "Do you offer tax preparation services for small businesses?",
        answer: "Yes, our CPA advisory division handles corporate tax strategy and quarterly filings for businesses generating over $500k in revenue."
      }
    ]
  }
};

export function IndustryPage() {
  const { slug } = useParams<{ slug?: string }>();
  
  // Audio playback state for simulated voice agent
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState<string>('');
  const [activeSpeaker, setActiveSpeaker] = useState<'agent' | 'user' | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // If no slug, or slug not found, show Industry Directory Hub
  const industry: IndustryInfo | undefined = slug ? INDUSTRIES[slug] : undefined;

  // Cleanup speech synthesis on unmount or navigation
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slug]);

  // Audio & Speech Synthesis Engine
  const playWebAudioTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      // AudioContext might be blocked until gesture, handled gracefully
    }
  };

  const speakText = (text: string, speaker: 'agent' | 'user', onEnd?: () => void) => {
    if (typeof window === 'undefined') return;

    // Trigger Web Audio chime tone for clear audible feedback
    playWebAudioTone();

    setActiveSpeaker(speaker);
    setActiveTranscript(text);
    setIsPlaying(true);

    if (!('speechSynthesis' in window) || isAudioMuted) {
      // If SpeechSynthesis not supported or muted, simulate spoken timer
      const duration = Math.min(Math.max(text.length * 50, 2000), 7000);
      const timer = setTimeout(() => {
        setIsPlaying(false);
        setActiveSpeaker(null);
        if (onEnd) onEnd();
      }, duration);
      return;
    }

    speakEnglishUtterance(text, {
      gender: speaker === 'agent' ? 'female' : 'male',
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        setIsPlaying(false);
        setActiveSpeaker(null);
        if (onEnd) onEnd();
      },
      onError: () => {
        setIsPlaying(false);
        setActiveSpeaker(null);
        if (onEnd) onEnd();
      }
    });
  };

  const stopAudioCall = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveSpeaker(null);
  };

  const handleToggleCallSimulation = () => {
    if (isPlaying) {
      stopAudioCall();
    } else if (industry) {
      const voiceConfig = INDUSTRY_VOICE_RESPONSES[industry.slug];
      const openingGreeting = voiceConfig?.opening || `${industry.systemPromptPreset} How may I assist you today?`;
      speakText(openingGreeting, 'agent');
    }
  };

  const handlePromptClick = (idx: number) => {
    if (!industry) return;
    const voiceConfig = INDUSTRY_VOICE_RESPONSES[industry.slug];
    const item = voiceConfig?.qa[idx] || {
      question: industry.sampleQuestions[idx] || "Can you help me?",
      answer: "Yes! As an autonomous AI voice receptionist, I am available 24/7 to assist you."
    };

    // First speak caller prompt, then speak AI Agent response out loud
    speakText(item.question, 'user', () => {
      setTimeout(() => {
        speakText(item.answer, 'agent');
      }, 400);
    });
  };

  if (!industry) {
    return (
      <div className="pt-28 pb-20 bg-[#05060A] text-white min-h-screen">
        <SEO
          title="Industry AI Voice & Web Solutions | Quorik pSEO Directory"
          description="Explore tailored Autonomous AI Voice Agent & Web Engineering solutions for Dental, Legal, HVAC, Real Estate, E-Commerce, and Wealth Management practices."
          keywords="AI voice agent by industry, dental AI receptionist, legal AI voice intake, HVAC voice dispatcher, real estate AI assistant, Quorik pSEO"
          canonicalPath="/industry"
        />

        <div className="max-w-7xl mx-auto px-6">
          {/* HUB HERO */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-mono font-bold tracking-widest uppercase">
              <Building2 className="w-4 h-4" />
              Industry-Tailored AI Voice Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-outfit">
              Purpose-Built <span className="bg-gradient-to-r from-brand-teal via-blue-400 to-indigo-400 bg-clip-text text-transparent">AI Voice Agents</span> For Your Sector
            </h1>
            <p className="text-gray-400 text-lg">
              Select your industry to see real-time voice latency benchmarks, workflow triggers, and customized intake ROI calculators.
            </p>
          </div>

          {/* INDUSTRY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(INDUSTRIES).map((ind) => (
              <Link
                key={ind.slug}
                to={`/industry/${ind.slug}`}
                className="group relative bg-[#070913] border border-white/10 hover:border-brand-teal/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-teal/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-brand-teal">
                    {ind.badge}
                  </div>
                  <h2 className="text-2xl font-bold font-outfit text-white group-hover:text-brand-teal transition-colors flex items-center justify-between">
                    {ind.name}
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {ind.subheadline}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    &lt;350ms Speech Latency
                  </span>
                  <span className="text-brand-teal font-bold group-hover:underline">Explore Solution &rarr;</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CONTACT CTA SECTION */}
          <div className="mt-24">
            <Contact />
          </div>
        </div>
      </div>
    );
  }

  // INDIVIDUAL INDUSTRY PAGE (pSEO)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": industry.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": industry.name + " AI Voice Agent",
    "provider": {
      "@type": "Organization",
      "name": "Quorik",
      "url": "https://quorik.com/"
    },
    "description": industry.metaDescription,
    "areaServed": "Global"
  };

  return (
    <div className="pt-24 bg-[#05060A] text-white min-h-screen">
      <SEO
        title={industry.metaTitle}
        description={industry.metaDescription}
        keywords={industry.keywords}
        canonicalPath={`/industry/${industry.slug}`}
        schema={[serviceSchema, faqSchema]}
      />

      {/* HEADER HERO */}
      <section className="py-16 md:py-24 relative overflow-hidden noise-bg border-b border-white/5">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-teal/15 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-6">
            <Link to="/industry" className="hover:text-brand-teal transition-colors">Industries</Link>
            <span>/</span>
            <span className="text-brand-teal font-bold">{industry.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-mono font-bold tracking-widest uppercase">
                <Bot className="w-4 h-4" />
                {industry.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-outfit leading-tight">
                {industry.headline}
              </h1>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-sans">
                {industry.subheadline}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-brand-teal to-blue-600 hover:from-brand-teal/90 hover:to-blue-600/90 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-brand-teal/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Deploy Industry Voice AI
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleToggleCallSimulation}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold font-mono text-white tracking-wider uppercase transition-colors flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-brand-teal" />
                  Test Voice Simulator
                </button>
              </div>

              {/* LATENCY BADGES */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sub-350ms Speech Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>24/7 Calendar Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Custom CRM Webhooks</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE VOICE SIMULATOR CARD */}
            <div id="simulator" className="lg:col-span-5 bg-[#090C19] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isPlaying ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' : 'bg-brand-teal/20 border border-brand-teal/40 text-brand-teal'
                  }`}>
                    {isPlaying ? <Radio className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white font-outfit">Live Agent Audio Test</h3>
                    <p className="text-[11px] font-mono text-emerald-400">● Preset Loaded: {industry.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    title={isAudioMuted ? "Unmute Browser Audio" : "Mute Speech Audio"}
                    className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 hover:text-white transition-colors"
                  >
                    {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-brand-teal" />}
                  </button>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-gray-400">
                    Sub-350ms
                  </span>
                </div>
              </div>

              {/* SIMULATED SYSTEM PROMPT BOX */}
              <div className="mt-6 space-y-4">
                <div className="bg-[#040508] p-4 rounded-xl border border-white/10 font-mono text-xs text-gray-300">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">SYSTEM INSTRUCTIONS</p>
                  <p className="italic">"{industry.systemPromptPreset}"</p>
                </div>

                {/* SAMPLE PROMPTS - CLICKABLE TO LISTEN */}
                <div className="space-y-2">
                  <p className="text-xs font-mono text-gray-400 flex items-center justify-between">
                    <span>Click Any Prompt to Listen & Test:</span>
                    <span className="text-[10px] text-brand-teal font-sans">🔊 Interactive Audio</span>
                  </p>
                  {industry.sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(idx)}
                      className="w-full text-left p-3 bg-white/5 hover:bg-brand-teal/10 border border-white/5 hover:border-brand-teal/30 rounded-xl text-xs text-gray-200 hover:text-white transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 pr-2">
                        <Volume2 className="w-3.5 h-3.5 text-brand-teal shrink-0 group-hover:scale-110 transition-transform" />
                        <span>"{q}"</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-white/5 group-hover:bg-brand-teal/20 px-2 py-0.5 rounded text-gray-400 group-hover:text-brand-teal shrink-0">
                        Play Call
                      </span>
                    </button>
                  ))}
                </div>

                {/* MAIN SIMULATION BUTTON */}
                <button
                  onClick={handleToggleCallSimulation}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 ${
                    isPlaying 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20' 
                      : 'bg-brand-teal hover:bg-brand-teal/90 text-black shadow-lg shadow-brand-teal/20'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-current animate-spin" /> Stop Simulated Audio Call
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Speak & Simulate {industry.name} AI Call
                    </>
                  )}
                </button>

                {/* LIVE VOICE AUDIO TRANSCRIPT CARD */}
                {activeTranscript ? (
                  <div className="p-4 bg-brand-teal/10 border border-brand-teal/40 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-teal">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>{activeSpeaker === 'user' ? 'Caller Question:' : 'AI Voice Receptionist Speaking:'}</span>
                      </div>
                      {/* ANIMATED AUDIO WAVEBARS */}
                      <div className="flex items-end gap-1 h-4">
                        <span className="w-1 bg-brand-teal rounded-full animate-[bounce_0.6s_infinite_100ms] h-full" />
                        <span className="w-1 bg-brand-teal rounded-full animate-[bounce_0.6s_infinite_200ms] h-2/3" />
                        <span className="w-1 bg-brand-teal rounded-full animate-[bounce_0.6s_infinite_300ms] h-full" />
                        <span className="w-1 bg-brand-teal rounded-full animate-[bounce_0.6s_infinite_150ms] h-1/2" />
                      </div>
                    </div>

                    <p className="text-sm font-sans text-gray-100 leading-snug italic bg-[#030407] p-3 rounded-xl border border-white/10">
                      "{activeTranscript}"
                    </p>

                    <p className="text-[10px] font-mono text-gray-400 text-right">
                      {isAudioMuted ? "🔇 Audio muted by user" : "🔊 Playing speech synthesis via browser audio output"}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center text-xs font-mono text-gray-400">
                    💡 Click <span className="text-brand-teal font-bold">"Speak & Simulate"</span> or any sample prompt to hear the AI Voice Agent speak.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI METRICS BAR */}
      <section className="py-12 bg-[#080B16] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industry.expectedRoi.map((roi, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-brand-teal font-outfit mb-2">
                  {roi.metric}
                </div>
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  {roi.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN POINTS & AI SOLUTIONS */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold font-outfit">
            The {industry.name} Problem & AI Solution
          </h2>
          <p className="text-gray-400 text-sm">
            How traditional phone systems lose revenue versus Quorik’s 24/7 autonomous voice receptionist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* TRADITIONAL PAIN POINTS */}
          <div className="bg-[#0A0D1B] border border-rose-500/20 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold font-outfit text-rose-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Traditional Practice Bottlenecks
            </h3>

            <div className="space-y-4">
              {industry.painPoints.map((point, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="font-bold text-sm text-white">{point.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QUORIK AI ADVANTAGES */}
          <div className="bg-[#0A0D1B] border border-brand-teal/30 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold font-outfit text-brand-teal flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quorik AI Voice Advantages
            </h3>

            <div className="space-y-4">
              {industry.aiAgentFeatures.map((feat, idx) => (
                <div key={idx} className="p-4 bg-brand-teal/5 rounded-xl border border-brand-teal/20">
                  <h4 className="font-bold text-sm text-brand-teal">{feat.title}</h4>
                  <p className="text-xs text-gray-300 mt-1">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY SPOTLIGHT */}
      <section className="py-16 bg-[#080B16] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-brand-teal/10 to-blue-900/20 border border-brand-teal/30 rounded-3xl p-8 md:p-12 space-y-6">
            <div className="inline-block px-3 py-1 bg-brand-teal/20 text-brand-teal font-mono text-xs font-bold rounded">
              CASE STUDY: {industry.caseStudy.client}
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold font-outfit text-white">
              "{industry.caseStudy.quote}"
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono">
              <span className="text-emerald-400 font-bold">Result: {industry.caseStudy.result}</span>
              <span className="text-gray-400">— {industry.caseStudy.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-outfit">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm">Common inquiries about deploying Quorik AI for {industry.name}.</p>
        </div>

        <div className="space-y-4">
          {industry.faq.map((item, idx) => (
            <div key={idx} className="bg-[#090C19] border border-white/10 rounded-2xl p-6 space-y-2">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-teal" />
                {item.q}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <Contact />
    </div>
  );
}
