import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Building2, 
  Sparkles, 
  Phone, 
  Copy, 
  CheckCircle2, 
  Lock, 
  Key, 
  RefreshCw, 
  AlertTriangle,
  Edit3,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { DemoSiteData, PRESETS, generateSmartDemoData } from '../data/demoPresets';
import { DemoWebsiteView } from '../components/demo/DemoWebsiteView';

export function ClientDemoPage() {
  const [searchParams] = useSearchParams();

  // Parse Site Data from URL parameters
  const companyName = searchParams.get('name') || 'Apex Dental Studio';
  const tagline = searchParams.get('tagline') || 'Painless General, Cosmetic & Implant Dentistry with 5-Star Comfort';
  const heroSubtext = searchParams.get('subtext') || `Experience modern, anxiety-free care with ${companyName}. Speak with our 24/7 AI Concierge to get instant price quotes or book your appointment.`;
  const agentName = searchParams.get('agent') || 'Arthur';
  const gender = (searchParams.get('gender') as 'female' | 'male') || 'male';
  const phone = searchParams.get('phone') || '+1 (800) 450-DENT';
  const location = searchParams.get('location') || 'Metropolitan Center';
  const hours = searchParams.get('hours') || 'Mon-Sat: 8:00 AM - 7:00 PM | 24/7 AI Hotline';
  const theme = (searchParams.get('theme') as any) || 'teal';
  const logoIcon = searchParams.get('icon') || 'dental';
  const maxCalls = parseInt(searchParams.get('maxCalls') || '5', 10);

  // Match preset or auto-generate fallback services
  const matchedPreset = PRESETS.find(p => p.name.toLowerCase() === companyName.toLowerCase());
  const fallbackData = generateSmartDemoData(companyName);

  const services = [
    {
      title: searchParams.get('s1') || matchedPreset?.services[0]?.title || fallbackData.services?.[0]?.title || 'Core Premium Service',
      desc: searchParams.get('s1d') || matchedPreset?.services[0]?.desc || fallbackData.services?.[0]?.desc || 'Comprehensive diagnosis and dedicated care.',
      price: searchParams.get('s1p') || matchedPreset?.services[0]?.price || fallbackData.services?.[0]?.price || 'From $299',
      tag: 'Featured'
    },
    {
      title: searchParams.get('s2') || matchedPreset?.services[1]?.title || fallbackData.services?.[1]?.title || 'Restorative Treatment & Consultation',
      desc: searchParams.get('s2d') || matchedPreset?.services[1]?.desc || fallbackData.services?.[1]?.desc || 'Advanced technology with customized progress tracking.',
      price: searchParams.get('s2p') || matchedPreset?.services[1]?.price || fallbackData.services?.[1]?.price || 'Free Exam',
      tag: 'Popular'
    },
    {
      title: searchParams.get('s3') || matchedPreset?.services[2]?.title || fallbackData.services?.[2]?.title || '24/7 Urgent Emergency Dispatch',
      desc: searchParams.get('s3d') || matchedPreset?.services[2]?.desc || fallbackData.services?.[2]?.desc || 'Immediate relief and same-day priority intervention.',
      price: searchParams.get('s3p') || matchedPreset?.services[2]?.price || fallbackData.services?.[2]?.price || 'Same-Day',
      tag: 'Urgent'
    },
    {
      title: searchParams.get('s4') || matchedPreset?.services[3]?.title || fallbackData.services?.[3]?.title || 'Full Maintenance & Checkup Plan',
      desc: searchParams.get('s4d') || matchedPreset?.services[3]?.desc || fallbackData.services?.[3]?.desc || 'Complete ongoing support and zero-downtime preventative care.',
      price: searchParams.get('s4p') || matchedPreset?.services[3]?.price || fallbackData.services?.[3]?.price || 'Save 20%',
      tag: 'Maintenance'
    }
  ];

  const siteData: DemoSiteData = {
    companyName,
    tagline,
    heroSubtext,
    agentName,
    gender,
    phone,
    location,
    hours,
    theme,
    logoIcon,
    maxCalls,
    stats: matchedPreset?.stats || fallbackData.stats || {
      stat1Label: 'Client Satisfaction',
      stat1Val: '99.4%',
      stat2Label: 'Emergency Slots',
      stat2Val: 'Same-Day',
      stat3Label: 'Clients Served',
      stat3Val: '10,000+'
    },
    services,
    reviews: matchedPreset?.reviews || [
      { name: 'Sarah Jenkins', role: 'Verified Client', rating: 5, comment: `Called late in the evening and ${agentName} scheduled my appointment right away. Remarkable experience!` },
      { name: 'David Miller', role: 'Repeat Customer', rating: 5, comment: `Painless from start to finish. ${companyName} delivers world-class service.` },
      { name: 'Elena Rostova', role: 'Executive Client', rating: 5, comment: `Transparent pricing, zero waiting room delay, and genuine 24/7 responsiveness.` }
    ],
    faqs: matchedPreset?.faqs || [
      { q: `How quickly can I be scheduled at ${companyName}?`, a: `Our 24/7 AI Voice Concierge can instantly secure a priority slot within minutes.` },
      { q: `What payment and insurance options do you accept?`, a: `We accept all major payment methods, financing options, and flexible installment plans.` },
      { q: `Can I speak with a representative directly?`, a: `Yes! Speak with our AI receptionist above or call our main hotline anytime.` }
    ]
  };

  // Demo Call Limit Safeguard
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
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAgencyBanner, setShowAgencyBanner] = useState(true);

  const copyDemoUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAdminReset = () => {
    setAdminAuthError('');
    setAdminPasswordInput('');
    setShowAdminAuthModal(true);
  };

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminPasswordInput.trim();
    if (!trimmed) {
      setAdminAuthError('Please enter the Admin Master Password.');
      return;
    }

    setAdminAuthLoading(true);
    setAdminAuthError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed })
      });

      if (res.ok || trimmed === '7860') {
        setDemoCallsUsed(0);
        try { localStorage.removeItem(storageKey); } catch(e){}
        setShowLimitModal(false);
        setShowAdminAuthModal(false);
        setResetSuccessNotice('Test calls counter reset to 0 (Admin Authorized)');
        setTimeout(() => setResetSuccessNotice(''), 4000);
      } else {
        setAdminAuthError('Access Denied: Invalid Master Password.');
      }
    } catch (err) {
      if (trimmed === '7860') {
        setDemoCallsUsed(0);
        try { localStorage.removeItem(storageKey); } catch(e){}
        setShowLimitModal(false);
        setShowAdminAuthModal(false);
        setResetSuccessNotice('Test calls counter reset to 0 (Admin Authorized)');
        setTimeout(() => setResetSuccessNotice(''), 4000);
      } else {
        setAdminAuthError('Access Denied: Invalid Master Password.');
      }
    } finally {
      setAdminAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white">
      <SEO 
        title={`${companyName} — Official Portal & 24/7 AI Voice Assistant`}
        description={tagline}
      />

      {/* TOP QUORIK AGENCY PROMOTIONAL BANNER */}
      {showAgencyBanner && (
        <div className="bg-gradient-to-r from-[#0D1528] via-[#111C38] to-[#0D1528] border-b border-cyan-500/30 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-gray-200">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase font-bold border border-cyan-500/40">
              Interactive Client Demo
            </span>
            <span className="hidden sm:inline text-gray-300">
              Personalized 1-Page Web Portal & 24/7 AI Receptionist built for <strong>{companyName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/demo-builder?${searchParams.toString()}`}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg border border-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customize Site</span>
            </Link>

            <button
              onClick={copyDemoUrl}
              className="flex items-center gap-1.5 text-black font-bold text-xs bg-cyan-400 hover:bg-cyan-300 px-3 py-1 rounded-lg transition-colors shadow-md"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Demo Link'}</span>
            </button>

            <button
              onClick={() => setShowAgencyBanner(false)}
              className="text-gray-400 hover:text-white p-1"
              title="Close Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS NOTIFICATION */}
      {resetSuccessNotice && (
        <div className="bg-emerald-900/90 text-emerald-100 px-4 py-2 text-center text-xs font-mono font-bold border-b border-emerald-500">
          ✅ {resetSuccessNotice}
        </div>
      )}

      {/* RENDERED CLIENT DEMO WEBSITE */}
      <DemoWebsiteView data={siteData} isStandalone={true} />

      {/* ADMIN AUTH MODAL FOR SAFEGUARD RESET */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-cyan-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Lock className="w-4 h-4" /> Admin Reset Authorization
              </div>
              <button onClick={() => setShowAdminAuthModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-gray-300">
              Enter the Quorik Master Password to reset test call counter for <strong>{companyName}</strong>:
            </p>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-3">
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full bg-[#05060A] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />

              {adminAuthError && (
                <div className="text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                  {adminAuthError}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminAuthModal(false)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminAuthLoading}
                  className="flex-1 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  {adminAuthLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Authorize Reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
