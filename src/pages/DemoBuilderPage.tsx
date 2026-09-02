import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Building2, 
  Sparkles, 
  Phone, 
  Copy, 
  Share2, 
  RefreshCw, 
  ExternalLink,
  Laptop,
  Wand2,
  Search,
  ShieldCheck,
  Award,
  Layers,
  MessageSquare,
  Settings2,
  CheckCircle2,
  Palette,
  Volume2,
  VolumeX,
  Play,
  Square,
  UserCheck,
  Star,
  Plus,
  Trash2,
  HelpCircle,
  DollarSign,
  Flame,
  Zap,
  Mic,
  Check,
  X
} from 'lucide-react';
import { DemoSiteData, PRESETS, THEME_CONFIGS, generateSmartDemoData, Preset } from '../data/demoPresets';
import { DemoWebsiteView } from '../components/demo/DemoWebsiteView';
import { speakSpeech, stopAllSpeech, unlockAudio } from '../utils/speechUtils';

export interface VoiceConfigOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  region: string;
  accent: string;
  flag: string;
  tone: string;
  defaultAgentName: string;
  sample: string;
}

export const ALL_DEMO_VOICES: VoiceConfigOption[] = [
  // MALE VOICES
  {
    id: 'male',
    name: 'Male - US Executive (Arthur)',
    gender: 'male',
    region: 'United States',
    accent: 'US Corporate Executive Baritone',
    flag: '🇺🇸',
    tone: 'Deep, Authoritative & Professional',
    defaultAgentName: 'Arthur',
    sample: "Hello! I am Arthur, your 24/7 AI receptionist. I can answer questions regarding our services, pricing, or secure your priority appointment today."
  },
  {
    id: 'male-uk',
    name: 'Male - UK Refined (Oliver)',
    gender: 'male',
    region: 'United Kingdom',
    accent: 'UK Received Pronunciation',
    flag: '🇬🇧',
    tone: 'Courteous, Elegant & Calm',
    defaultAgentName: 'Oliver',
    sample: "Good day! My name is Oliver. It would be my absolute pleasure to assist you with consultation booking and service details."
  },
  {
    id: 'male-sales',
    name: 'Male - US High-Conversion Sales (Brian)',
    gender: 'male',
    region: 'United States',
    accent: 'US Dynamic Closer',
    flag: '🇺🇸',
    tone: 'Confident, Energetic & Direct Closer',
    defaultAgentName: 'Brian',
    sample: "Hey there! Brian here. Let's get your appointment locked in with our top specialists with zero waiting time."
  },
  {
    id: 'male-au',
    name: 'Male - Australian Warm (William)',
    gender: 'male',
    region: 'Australia',
    accent: 'Australian Professional',
    flag: '🇦🇺',
    tone: 'Approachable, Clear & Friendly',
    defaultAgentName: 'William',
    sample: "G'day! William here. I'm ready to help you with instant quotes and fast appointment scheduling."
  },
  // FEMALE VOICES
  {
    id: 'female',
    name: 'Female - US Executive (Zephyr)',
    gender: 'female',
    region: 'United States',
    accent: 'US Executive Concierge',
    flag: '🇺🇸',
    tone: 'Warm, Crisp & High-Efficiency',
    defaultAgentName: 'Zephyr',
    sample: "Hello and welcome! My name is Zephyr. I can guide you through our solutions, provide pricing, or schedule a consultation with our team."
  },
  {
    id: 'female-uk',
    name: 'Female - UK Refined (Clara)',
    gender: 'female',
    region: 'United Kingdom',
    accent: 'UK Received Pronunciation',
    flag: '🇬🇧',
    tone: 'Polished, Gentle & Sophisticated',
    defaultAgentName: 'Clara',
    sample: "Good day! My name is Clara. I can assist you with your inquiry and reserve a meeting with our director for tomorrow."
  },
  {
    id: 'female-vibrant',
    name: 'Female - US Vibrant & Dynamic (Aria)',
    gender: 'female',
    region: 'United States',
    accent: 'US Modern Vibrant',
    flag: '🇺🇸',
    tone: 'Enthusiastic, Bright & Engaging',
    defaultAgentName: 'Aria',
    sample: "Hi there! I am Aria. I'm excited to help answer your questions and book your appointment right away!"
  },
  {
    id: 'female-au',
    name: 'Female - Australian Professional (Natasha)',
    gender: 'female',
    region: 'Australia',
    accent: 'Australian Modern',
    flag: '🇦🇺',
    tone: 'Sunny, Modern & Welcoming',
    defaultAgentName: 'Natasha',
    sample: "Hello! Natasha here. I'd be delighted to assist you with our services and reserve your appointment slot."
  }
];

export function DemoBuilderPage({ embedded = false }: { embedded?: boolean } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Control Tab
  const [activeControlTab, setActiveControlTab] = useState<'branding' | 'agent' | 'services' | 'reviews' | 'faq' | 'trust' | 'presets'>('branding');

  // Main Demo Site Data State
  const [siteData, setSiteData] = useState<DemoSiteData>(() => {
    // Check if custom data was previously saved
    try {
      const saved = localStorage.getItem('quorik_latest_custom_demo');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companyName && parsed.services) return parsed;
      }
    } catch (e) {}

    const defaultPreset = PRESETS[0];
    return {
      companyName: defaultPreset.name,
      tagline: defaultPreset.tagline,
      heroSubtext: defaultPreset.heroSubtext,
      agentName: defaultPreset.agentName,
      gender: defaultPreset.gender,
      phone: defaultPreset.phone,
      location: defaultPreset.location,
      hours: defaultPreset.hours,
      theme: defaultPreset.theme,
      logoIcon: defaultPreset.icon,
      maxCalls: defaultPreset.maxCalls,
      stats: { ...defaultPreset.stats },
      services: [...defaultPreset.services],
      reviews: [...defaultPreset.reviews],
      faqs: [...defaultPreset.faqs]
    };
  });

  // Auto-save state to localStorage so updates are persisted immediately
  useEffect(() => {
    try {
      const key = `quorik_custom_demo_${siteData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      localStorage.setItem(key, JSON.stringify(siteData));
      localStorage.setItem('quorik_latest_custom_demo', JSON.stringify(siteData));
    } catch (e) {}
  }, [siteData]);

  // AI Prompt Generator input & Call simulation signals
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPlayingVoiceSample, setIsPlayingVoiceSample] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [autoStartCallSignal, setAutoStartCallSignal] = useState(0);
  const [showPitchModal, setShowPitchModal] = useState(false);

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  const handleTestVoiceAudio = (voiceId: string) => {
    unlockAudio();
    if (isPlayingVoiceSample && playingVoiceId === voiceId) {
      stopAllSpeech();
      setIsPlayingVoiceSample(false);
      setPlayingVoiceId(null);
      return;
    }

    stopAllSpeech();
    const voiceMeta = ALL_DEMO_VOICES.find(v => v.id === voiceId) || ALL_DEMO_VOICES[0];
    const sampleText = voiceMeta.sample;

    setIsPlayingVoiceSample(true);
    setPlayingVoiceId(voiceId);

    const gLower = voiceId.toLowerCase();
    const isFemale = gLower.includes('female') || gLower === 'zephyr' || gLower === 'clara' || gLower === 'aria' || gLower === 'natasha';

    let personaId = isFemale ? 'us-warm' : 'us-executive';
    let preferredLocale: 'en-US' | 'en-GB' | 'en-AU' = 'en-US';

    if (gLower.includes('uk')) {
      personaId = 'uk-refined';
      preferredLocale = 'en-GB';
    } else if (gLower.includes('au')) {
      personaId = 'au-friendly';
      preferredLocale = 'en-AU';
    } else if (gLower.includes('vibrant') || gLower.includes('aria')) {
      personaId = 'us-vibrant';
    } else if (gLower.includes('sales') || gLower.includes('energetic') || gLower.includes('brian')) {
      personaId = 'us-sales';
    }

    speakSpeech(sampleText, {
      gender: voiceId,
      personaId,
      preferredLocale,
      onStart: () => {
        setIsPlayingVoiceSample(true);
        setPlayingVoiceId(voiceId);
      },
      onEnd: () => {
        setIsPlayingVoiceSample(false);
        setPlayingVoiceId(null);
      },
      onError: () => {
        setIsPlayingVoiceSample(false);
        setPlayingVoiceId(null);
      }
    });
  };

  const handleVoiceSelect = (newVoiceId: string) => {
    const selectedVoiceMeta = ALL_DEMO_VOICES.find(v => v.id === newVoiceId);
    
    // Check if the current agentName is one of the default names from ALL_DEMO_VOICES
    const isCurrentDefault = !siteData.agentName || ALL_DEMO_VOICES.some(v => v.defaultAgentName.toLowerCase() === siteData.agentName.toLowerCase());

    setSiteData(prev => ({
      ...prev,
      gender: newVoiceId,
      agentName: isCurrentDefault && selectedVoiceMeta ? selectedVoiceMeta.defaultAgentName : prev.agentName
    }));
  };

  // Load from URL params if present
  useEffect(() => {
    const nameParam = searchParams.get('name');
    if (nameParam) {
      setSiteData(prev => ({
        ...prev,
        companyName: nameParam,
        tagline: searchParams.get('tagline') || prev.tagline,
        heroSubtext: searchParams.get('subtext') || prev.heroSubtext,
        agentName: searchParams.get('agent') || prev.agentName,
        gender: (searchParams.get('gender') as any) || prev.gender,
        phone: searchParams.get('phone') || prev.phone,
        location: searchParams.get('location') || prev.location,
        theme: (searchParams.get('theme') as any) || prev.theme,
        logoIcon: searchParams.get('icon') || prev.logoIcon,
        maxCalls: parseInt(searchParams.get('maxCalls') || '5', 10)
      }));
    }
  }, [searchParams]);

  const applyPreset = (preset: Preset) => {
    setSiteData({
      companyName: preset.name,
      tagline: preset.tagline,
      heroSubtext: preset.heroSubtext,
      agentName: preset.agentName,
      gender: preset.gender,
      phone: preset.phone,
      location: preset.location,
      hours: preset.hours,
      theme: preset.theme,
      logoIcon: preset.icon,
      maxCalls: preset.maxCalls,
      stats: { ...preset.stats },
      services: [...preset.services],
      reviews: [...preset.reviews],
      faqs: [...preset.faqs]
    });
  };

  const handleAiAutoFill = (customQuery?: string) => {
    const rawQuery = (customQuery || aiPromptInput || siteData.companyName || 'Business').trim();
    if (!rawQuery) return;

    setIsAiGenerating(true);

    setTimeout(() => {
      const generated = generateSmartDemoData(rawQuery);
      setSiteData(prev => ({
        ...prev,
        ...generated,
        stats: generated.stats ? { ...generated.stats } : prev.stats,
        services: generated.services ? [...generated.services] : prev.services,
        reviews: generated.reviews ? [...generated.reviews] : prev.reviews,
        faqs: generated.faqs ? [...generated.faqs] : prev.faqs
      }));
      setIsAiGenerating(false);
      setAiPromptInput('');
    }, 400);
  };

  const applyPricingPreset = (presetType: 'local' | 'high-ticket' | 'retainer') => {
    if (presetType === 'local') {
      setSiteData(prev => ({
        ...prev,
        services: prev.services.map((s, idx) => ({
          ...s,
          price: idx === 0 ? '$99 Intake' : idx === 1 ? '$149 Standard' : idx === 2 ? 'Same-Day' : '$299 Premium'
        }))
      }));
    } else if (presetType === 'high-ticket') {
      setSiteData(prev => ({
        ...prev,
        services: prev.services.map((s, idx) => ({
          ...s,
          price: idx === 0 ? '$1,500 Package' : idx === 1 ? '$3,500 Full Suite' : idx === 2 ? 'Priority Expedited' : '$5,000 Advisory'
        }))
      }));
    } else {
      setSiteData(prev => ({
        ...prev,
        services: prev.services.map((s, idx) => ({
          ...s,
          price: idx === 0 ? '$49/mo Starter' : idx === 1 ? '$149/mo Pro' : idx === 2 ? '$299/mo Business' : 'Custom Enterprise'
        }))
      }));
    }
  };

  const handleAddService = () => {
    if (siteData.services.length >= 6) return;
    const newService = {
      title: 'VIP Dedicated Solution',
      desc: 'High-touch personalized service tailored to client specific needs.',
      price: '$299 Session',
      tag: 'New'
    };
    setSiteData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const handleRemoveService = (index: number) => {
    if (siteData.services.length <= 2) return;
    setSiteData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleAddReview = () => {
    if (siteData.reviews.length >= 6) return;
    const newRev = {
      name: 'Michael Sterling',
      role: 'Verified Client',
      rating: 5,
      comment: `Incredible experience with ${siteData.companyName}. ${siteData.agentName} took care of my request immediately!`
    };
    setSiteData(prev => ({
      ...prev,
      reviews: [...prev.reviews, newRev]
    }));
  };

  const handleRemoveReview = (index: number) => {
    if (siteData.reviews.length <= 1) return;
    setSiteData(prev => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index)
    }));
  };

  const handleResetReviews = () => {
    const defaultPreset = PRESETS.find(p => p.name.toLowerCase() === siteData.companyName.toLowerCase()) || PRESETS[0];
    setSiteData(prev => ({
      ...prev,
      reviews: [...defaultPreset.reviews]
    }));
  };

  const handleAddFaq = () => {
    if (siteData.faqs.length >= 8) return;
    const newFaq = {
      q: `What makes ${siteData.companyName} different from competitors?`,
      a: `We provide 24/7 dedicated responsiveness, transparent pricing upfront, and guaranteed quality on every service.`
    };
    setSiteData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFaq]
    }));
  };

  const handleRemoveFaq = (index: number) => {
    if (siteData.faqs.length <= 1) return;
    setSiteData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateSmartFaqs = () => {
    const generated = generateSmartDemoData(siteData.companyName);
    if (generated.faqs && generated.faqs.length > 0) {
      setSiteData(prev => ({
        ...prev,
        faqs: [...generated.faqs!]
      }));
    } else {
      setSiteData(prev => ({
        ...prev,
        faqs: [
          { q: `How soon can I schedule an appointment with ${siteData.companyName}?`, a: `Our 24/7 AI Voice Concierge ${siteData.agentName} can check real-time availability and confirm your reservation in under 60 seconds.` },
          { q: `Do you provide upfront pricing or estimates?`, a: `Yes, we believe in 100% price transparency with zero surprise fees or hidden costs.` },
          { q: `Can I speak with a specialist directly?`, a: `Yes! You can speak directly to our AI agent right now or call our hotline at ${siteData.phone}.` }
        ]
      }));
    }
  };

  const getStandaloneDemoUrl = () => {
    const params = new URLSearchParams();
    params.set('name', siteData.companyName);
    params.set('tagline', siteData.tagline);
    params.set('subtext', siteData.heroSubtext);
    params.set('agent', siteData.agentName);
    params.set('gender', siteData.gender);
    params.set('phone', siteData.phone);
    params.set('location', siteData.location);
    params.set('hours', siteData.hours);
    params.set('theme', siteData.theme);
    params.set('icon', siteData.logoIcon);
    params.set('maxCalls', siteData.maxCalls.toString());

    // Encode all services
    siteData.services.forEach((s, idx) => {
      params.set(`s${idx + 1}`, s.title);
      params.set(`s${idx + 1}d`, s.desc);
      params.set(`s${idx + 1}p`, s.price);
      if (s.tag) params.set(`s${idx + 1}t`, s.tag);
    });

    // Encode reviews, faqs, and stats
    try {
      params.set('reviews', JSON.stringify(siteData.reviews));
      params.set('faqs', JSON.stringify(siteData.faqs));
      params.set('stats', JSON.stringify(siteData.stats));
    } catch (e) {}

    return `${window.location.origin}/client-demo?${params.toString()}`;
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(getStandaloneDemoUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className={`min-h-screen bg-[#05060A] text-white ${embedded ? 'pt-2 pb-12' : 'pt-24 pb-20'}`}>
      <SEO 
        title="Custom Client Demo Site & AI Voice Builder | Quorik Systems"
        description="Generate hyper-personalized 1-page websites with integrated 24/7 AI Voice receptionists to close prospective clients."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* PAGE HEADER & 1-CLICK SHARE LINK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0E1A] border border-white/10 p-5 md:p-6 rounded-2xl shadow-2xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" /> High-Converting Agency Sales Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Interactive Demo Website & Voice Builder
            </h1>
            <p className="text-xs text-gray-400">
              Customize any client's branding, services, and AI voice persona. Send the live link to close 5-figure retainers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={copyShareableLink}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-lg"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Client Demo Link'}</span>
            </button>

            <a
              href={getStandaloneDemoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Standalone Demo ↗</span>
            </a>
          </div>
        </div>

        {/* AI AUTO-FILL & PRESETS BAR */}
        <div className="bg-[#0A0E1A] border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-cyan-400 animate-pulse" /> 1-Click AI Studio Auto-Fill & Niche Presets
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Type ANY prospective business name or pick a preset to configure branding, services, and voice intelligence instantly.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiAutoFill()}
                  placeholder="Type ANY business (e.g. Barber, Roofer, MedSpa)..."
                  className="w-full bg-[#05060A] border border-white/20 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleAiAutoFill()}
                disabled={isAiGenerating}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>{isAiGenerating ? 'Generating...' : '✨ AI Auto Fill'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-2.5 text-left border rounded-xl transition-all flex flex-col justify-between ${
                  siteData.companyName === p.name 
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-bold truncate">{p.name}</div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{p.industry}</div>
              </button>
            ))}
          </div>
        </div>

        {/* URGENT CLIENT SHOWCASE & LIVE CALL LAUNCHPAD */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border-2 border-cyan-500/40 p-4 sm:p-5 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Live Client Showcase Ready</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Agent Online: {siteData.agentName}
                </span>
              </div>
              <p className="text-xs text-gray-200 font-medium mt-0.5">
                Client on the line asking to test your voice receptionist? Launch an interactive test call in 1-click or grab your live pitch script.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => setAutoStartCallSignal(prev => prev + 1)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Start Live Call in Preview</span>
            </button>

            <button
              onClick={() => setShowPitchModal(true)}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Client Pitch Script</span>
            </button>

            <button
              onClick={copyShareableLink}
              className="px-3.5 py-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Demo Link'}</span>
            </button>
          </div>
        </div>

        {/* PITCH CHEAT-SHEET MODAL */}
        {showPitchModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A0E1A] border border-white/20 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">How to Close Your Client Right Now</h3>
                </div>
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-gray-300">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Step 1: The Zero-Lag Greeting Hook</span>
                  <p className="text-gray-200">
                    Click <strong>"Start Live Call in Preview"</strong> and tell the client: <em>"Listen to how fast {siteData.agentName} picks up the call—under 800 milliseconds, sounding 100% human with zero robotic pause."</em>
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Step 2: Pricing & Services Handling</span>
                  <p className="text-gray-200">
                    Tell the client to ask: <em>"What are your prices?"</em> or <em>"Do you offer {siteData.services[0]?.title || 'emergency service'}?"</em>. {siteData.agentName} quotes your updated rates and answers objections accurately.
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Step 3: Autonomous Booking Close</span>
                  <p className="text-gray-200">
                    Tell the client: <em>"Can you book me for tomorrow at 3 PM?"</em>. Watch as the AI captures caller name, phone number, and confirms the reservation without losing the lead to voicemail.
                  </p>
                </div>

                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <div className="text-[11px] font-bold text-cyan-300">Winning Closer Line:</div>
                  <p className="text-white italic mt-1">
                    "Every missed phone call costs your business $300 to $1,500. We can turn on this exact voice receptionist and branded landing page for your company in 48 hours."
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowPitchModal(false);
                    setAutoStartCallSignal(prev => prev + 1);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-lg"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Start Live Call Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN SPLIT VIEW: BUILDER CONTROLS & LIVE WEBSITE PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CUSTOMIZER FORM CONTROLS */}
          <div className="lg:col-span-5 bg-[#0A0E1A] border border-white/10 p-5 md:p-6 rounded-2xl space-y-6">
            
            {/* Control Tabs */}
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveControlTab('branding')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeControlTab === 'branding' 
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Branding
              </button>

              <button
                onClick={() => setActiveControlTab('agent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeControlTab === 'agent' 
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Voice Agent
              </button>

              <button
                onClick={() => setActiveControlTab('services')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeControlTab === 'services' 
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" /> Pricing & Services
              </button>

              <button
                onClick={() => setActiveControlTab('reviews')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeControlTab === 'reviews' 
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <Star className="w-3.5 h-3.5" /> Reviews ({siteData.reviews.length})
              </button>

              <button
                onClick={() => setActiveControlTab('faq')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeControlTab === 'faq' 
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> FAQ ({siteData.faqs.length})
              </button>

              <button
                onClick={() => setActiveControlTab('trust')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeControlTab === 'trust' 
                    ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' 
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Social Proof
              </button>
            </div>

            {/* TAB 1: BRANDING & THEMING */}
            {activeControlTab === 'branding' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">1. Business Company Name</label>
                  <input
                    type="text"
                    value={siteData.companyName}
                    onChange={(e) => setSiteData({ ...siteData, companyName: e.target.value })}
                    placeholder="e.g. Apex Dental Studio"
                    className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">2. Tagline / Headline</label>
                  <input
                    type="text"
                    value={siteData.tagline}
                    onChange={(e) => setSiteData({ ...siteData, tagline: e.target.value })}
                    placeholder="e.g. Painless General & Cosmetic Dentistry"
                    className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">3. Hero Value Proposition Subtext</label>
                  <textarea
                    rows={2}
                    value={siteData.heroSubtext}
                    onChange={(e) => setSiteData({ ...siteData, heroSubtext: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-gray-300 block mb-1">Location / Address</label>
                    <input
                      type="text"
                      value={siteData.location}
                      onChange={(e) => setSiteData({ ...siteData, location: e.target.value })}
                      placeholder="e.g. Manhattan, NY"
                      className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-gray-300 block mb-1">Working Hours</label>
                    <input
                      type="text"
                      value={siteData.hours}
                      onChange={(e) => setSiteData({ ...siteData, hours: e.target.value })}
                      placeholder="e.g. Mon-Sat: 8AM-7PM"
                      className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-gray-300 block mb-1">Brand Theme</label>
                    <select
                      value={siteData.theme}
                      onChange={(e) => setSiteData({ ...siteData, theme: e.target.value as any })}
                      className="w-full bg-[#05060A] border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      {Object.entries(THEME_CONFIGS).map(([k, v]) => (
                        <option key={k} value={k}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-gray-300 block mb-1">Logo Icon</label>
                    <select
                      value={siteData.logoIcon}
                      onChange={(e) => setSiteData({ ...siteData, logoIcon: e.target.value })}
                      className="w-full bg-[#05060A] border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="dental">Dental Stethoscope</option>
                      <option value="house">Real Estate House</option>
                      <option value="legal">Legal Scale</option>
                      <option value="spa">Wellness Spa Smile</option>
                      <option value="hvac">HVAC Wrench</option>
                      <option value="auto">Auto Repair Car</option>
                      <option value="restaurant">Restaurant Utensils</option>
                      <option value="fitness">Fitness Dumbbell</option>
                      <option value="solar">Solar Energy Sun</option>
                      <option value="accounting">Tax Calculator</option>
                      <option value="barber">Barber Scissors</option>
                      <option value="vet">Pet Veterinary Dog</option>
                      <option value="cleaning">Cleaning Sparkles</option>
                      <option value="tech">IT Cyber CPU</option>
                      <option value="hotel">Hotel Suite</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VOICE AGENT PERSONA */}
            {activeControlTab === 'agent' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-gray-300 block mb-1">Agent Name</label>
                    <input
                      type="text"
                      value={siteData.agentName}
                      onChange={(e) => setSiteData({ ...siteData, agentName: e.target.value })}
                      placeholder="e.g. Arthur, Zephyr, Clara"
                      className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-gray-300 block">Voice Gender & Persona</label>
                      <span className="text-[10px] text-cyan-400 font-mono">8 Neural Voices</span>
                    </div>
                    <select
                      value={siteData.gender}
                      onChange={(e) => handleVoiceSelect(e.target.value)}
                      className="w-full bg-[#05060A] border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <optgroup label="👨 Male Voices">
                        {ALL_DEMO_VOICES.filter(v => v.gender === 'male').map(v => (
                          <option key={v.id} value={v.id}>
                            {v.flag} {v.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="👩 Female Voices">
                        {ALL_DEMO_VOICES.filter(v => v.gender === 'female').map(v => (
                          <option key={v.id} value={v.id}>
                            {v.flag} {v.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Selected Voice Info & Test Audio Player */}
                {(() => {
                  const currentVoice = ALL_DEMO_VOICES.find(v => v.id === siteData.gender) || ALL_DEMO_VOICES[0];
                  const isCurrentPlaying = isPlayingVoiceSample && playingVoiceId === currentVoice.id;
                  return (
                    <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{currentVoice.flag}</span>
                          <div>
                            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span>{currentVoice.name}</span>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                {currentVoice.gender === 'male' ? 'Male' : 'Female'}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400">{currentVoice.accent} • {currentVoice.tone}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTestVoiceAudio(currentVoice.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isCurrentPlaying
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
                          }`}
                        >
                          {isCurrentPlaying ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Test Voice</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-gray-300 italic bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                        "{currentVoice.sample}"
                      </p>
                    </div>
                  );
                })()}

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1">Live Phone Hotline</label>
                  <input
                    type="text"
                    value={siteData.phone}
                    onChange={(e) => setSiteData({ ...siteData, phone: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <label className="text-xs font-mono text-gray-300 block flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Anti-Spam Test Call Safeguard</span>
                  </label>
                  <select
                    value={siteData.maxCalls}
                    onChange={(e) => setSiteData({ ...siteData, maxCalls: parseInt(e.target.value, 10) })}
                    className="w-full bg-[#05060A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value={3}>3 Calls Max per Demo Link</option>
                    <option value={5}>5 Calls Max (Recommended)</option>
                    <option value={10}>10 Calls Max</option>
                    <option value={20}>20 Calls Max</option>
                    <option value={0}>Unlimited Calls (No Limit)</option>
                  </select>
                  <p className="text-[10px] text-gray-400">
                    Prevents prospects from exhausting API credits when sharing publicly.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: SERVICES & PRICING */}
            {activeControlTab === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Services & Pricing Rates Customizer
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Set custom pricing, package rates, tags, and service details.
                    </p>
                  </div>
                  {siteData.services.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Service</span>
                    </button>
                  )}
                </div>

                {/* Quick Pricing Presets */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-cyan-400" />
                    <span>Quick Pricing Strategy Presets</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPricingPreset('local')}
                      className="p-1.5 text-center rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/10 text-[10px] font-medium transition-all"
                    >
                      Local ($99-$299)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPricingPreset('high-ticket')}
                      className="p-1.5 text-center rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/10 text-[10px] font-medium transition-all"
                    >
                      High-Ticket ($1.5k+)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPricingPreset('retainer')}
                      className="p-1.5 text-center rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/10 text-[10px] font-medium transition-all"
                    >
                      Recurring Tier ($49-$299/mo)
                    </button>
                  </div>
                </div>

                {/* Service Cards List */}
                <div className="space-y-3">
                  {siteData.services.map((svc, idx) => (
                    <div key={idx} className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-gray-300">
                          Service #0{idx + 1}
                        </span>
                        {siteData.services.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveService(idx)}
                            className="p-1 text-gray-500 hover:text-rose-400 rounded transition-colors"
                            title="Remove this service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 block mb-1">Service Title</label>
                          <input
                            type="text"
                            value={svc.title}
                            onChange={(e) => {
                              const updated = [...siteData.services];
                              updated[idx].title = e.target.value;
                              setSiteData({ ...siteData, services: updated });
                            }}
                            placeholder="e.g. Comprehensive Dental Exam"
                            className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-cyan-400 block mb-1">Price / Rate Display</label>
                          <input
                            type="text"
                            value={svc.price}
                            onChange={(e) => {
                              const updated = [...siteData.services];
                              updated[idx].price = e.target.value;
                              setSiteData({ ...siteData, services: updated });
                            }}
                            placeholder="e.g. From $149, $1,500 Retainer"
                            className="w-full bg-[#05060A] border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-gray-400 block">Badge / Tag (Optional)</label>
                          <span className="text-[9px] text-gray-500 font-mono">e.g. Popular, Same-Day, 24/7</span>
                        </div>
                        <input
                          type="text"
                          value={svc.tag || ''}
                          onChange={(e) => {
                            const updated = [...siteData.services];
                            updated[idx].tag = e.target.value;
                            setSiteData({ ...siteData, services: updated });
                          }}
                          placeholder="e.g. Most Popular or Same-Day"
                          className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-amber-300 placeholder:text-gray-600 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-400 block mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={svc.desc}
                          onChange={(e) => {
                            const updated = [...siteData.services];
                            updated[idx].desc = e.target.value;
                            setSiteData({ ...siteData, services: updated });
                          }}
                          placeholder="Short summary of what is included in this service..."
                          className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-300 focus:border-cyan-400 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS & TESTIMONIALS */}
            {activeControlTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Customer Reviews & Testimonials</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Edit verified reviews and 5-star ratings displayed on the demo website.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetReviews}
                      className="px-2 py-1 text-gray-400 hover:text-white text-[10px] font-mono transition-colors"
                      title="Reset to default reviews"
                    >
                      Reset
                    </button>
                    {siteData.reviews.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddReview}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Review</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-3">
                  {siteData.reviews.map((rev, idx) => (
                    <div key={idx} className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-gray-300">
                            Review #0{idx + 1}
                          </span>
                          
                          {/* Star rating selector */}
                          <div className="flex items-center gap-0.5 ml-2">
                            {[1, 2, 3, 4, 5].map((starVal) => (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => {
                                  const updated = [...siteData.reviews];
                                  updated[idx].rating = starVal;
                                  setSiteData({ ...siteData, reviews: updated });
                                }}
                                className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                                title={`Set rating to ${starVal} stars`}
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    starVal <= (rev.rating || 5)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-[10px] font-mono text-amber-400 ml-1">
                              {rev.rating || 5}.0
                            </span>
                          </div>
                        </div>

                        {siteData.reviews.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveReview(idx)}
                            className="p-1 text-gray-500 hover:text-rose-400 rounded transition-colors"
                            title="Remove this review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-gray-400 block mb-1">Customer / Client Name</label>
                          <input
                            type="text"
                            value={rev.name}
                            onChange={(e) => {
                              const updated = [...siteData.reviews];
                              updated[idx].name = e.target.value;
                              setSiteData({ ...siteData, reviews: updated });
                            }}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-gray-400 block mb-1">Role / Badge Label</label>
                          <input
                            type="text"
                            value={rev.role || ''}
                            onChange={(e) => {
                              const updated = [...siteData.reviews];
                              updated[idx].role = e.target.value;
                              setSiteData({ ...siteData, reviews: updated });
                            }}
                            placeholder="e.g. Verified Patient, Homeowner"
                            className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-gray-400 block mb-1">Testimonial Comment</label>
                        <textarea
                          rows={2}
                          value={rev.comment}
                          onChange={(e) => {
                            const updated = [...siteData.reviews];
                            updated[idx].comment = e.target.value;
                            setSiteData({ ...siteData, reviews: updated });
                          }}
                          placeholder="Write the customer's glowing review..."
                          className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:border-cyan-400 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: FREQUENTLY ASKED QUESTIONS (FAQ) */}
            {activeControlTab === 'faq' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Frequently Asked Questions (FAQ)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Add common questions and answers. Used by the website accordion and voice agent.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateSmartFaqs}
                      className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                      title="Generate intelligent industry FAQs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>AI FAQs</span>
                    </button>
                    {siteData.faqs.length < 8 && (
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add FAQ</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                  {siteData.faqs.map((faq, idx) => (
                    <div key={idx} className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-teal-400">
                          Question #0{idx + 1}
                        </span>
                        {siteData.faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(idx)}
                            className="p-1 text-gray-500 hover:text-rose-400 rounded transition-colors"
                            title="Remove this question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => {
                            const updated = [...siteData.faqs];
                            updated[idx].q = e.target.value;
                            setSiteData({ ...siteData, faqs: updated });
                          }}
                          placeholder="e.g. How quickly can your team get started?"
                          className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) => {
                            const updated = [...siteData.faqs];
                            updated[idx].a = e.target.value;
                            setSiteData({ ...siteData, faqs: updated });
                          }}
                          placeholder="Write the clear and concise answer..."
                          className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-300 focus:border-cyan-400 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: SOCIAL PROOF & STATS */}
            {activeControlTab === 'trust' && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Key Trust Proof Points & Metric Badges
                </div>
                <p className="text-[11px] text-gray-400">
                  Configure numerical milestones that prove credibility to high-intent prospective customers.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400">Metric 1</span>
                    <input
                      type="text"
                      value={siteData.stats.stat1Val}
                      onChange={(e) => setSiteData({ ...siteData, stats: { ...siteData.stats, stat1Val: e.target.value } })}
                      className="w-full bg-[#05060A] border border-white/10 rounded px-2 py-1 text-xs text-white font-bold"
                    />
                    <input
                      type="text"
                      value={siteData.stats.stat1Label}
                      onChange={(e) => setSiteData({ ...siteData, stats: { ...siteData.stats, stat1Label: e.target.value } })}
                      className="w-full bg-[#05060A] border border-white/10 rounded px-2 py-1 text-[10px] text-gray-400"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400">Metric 2</span>
                    <input
                      type="text"
                      value={siteData.stats.stat2Val}
                      onChange={(e) => setSiteData({ ...siteData, stats: { ...siteData.stats, stat2Val: e.target.value } })}
                      className="w-full bg-[#05060A] border border-white/10 rounded px-2 py-1 text-xs text-white font-bold"
                    />
                    <input
                      type="text"
                      value={siteData.stats.stat2Label}
                      onChange={(e) => setSiteData({ ...siteData, stats: { ...siteData.stats, stat2Label: e.target.value } })}
                      className="w-full bg-[#05060A] border border-white/10 rounded px-2 py-1 text-[10px] text-gray-400"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400">Metric 3</span>
                    <input
                      type="text"
                      value={siteData.stats.stat3Val}
                      onChange={(e) => setSiteData({ ...siteData, stats: { ...siteData.stats, stat3Val: e.target.value } })}
                      className="w-full bg-[#05060A] border border-white/10 rounded px-2 py-1 text-xs text-white font-bold"
                    />
                    <input
                      type="text"
                      value={siteData.stats.stat3Label}
                      onChange={(e) => setSiteData({ ...siteData, stats: { ...siteData.stats, stat3Label: e.target.value } })}
                      className="w-full bg-[#05060A] border border-white/10 rounded px-2 py-1 text-[10px] text-gray-400"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Conversion Guarantee Badge</span>
                  </div>
                  <p className="text-[10px] text-gray-300">
                    All demo sites include instant response metrics, verified reviews, and 24/7 AI availability guarantees automatically embedded.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: INSTANT LIVE GENERATED WEBSITE PREVIEW */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Web Canvas Container */}
            <div className="bg-[#05060A] border-2 border-white/15 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Browser Window Header */}
              <div className="bg-[#0A1020] border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="ml-3 text-[11px] font-mono text-gray-400 bg-black/40 px-3 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                    <span className="text-emerald-400">https://</span>
                    <span>{siteData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <a
                    href={getStandaloneDemoUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-white transition-colors bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Standalone ↗</span>
                  </a>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE PREVIEW</span>
                  </div>
                </div>
              </div>

              {/* RENDERED CLIENT WEBSITE */}
              <div className="max-h-[850px] overflow-y-auto">
                <DemoWebsiteView data={siteData} autoStartCallSignal={autoStartCallSignal} />
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
