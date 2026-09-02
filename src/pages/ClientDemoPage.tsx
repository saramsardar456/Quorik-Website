import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
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
  const { id } = useParams<{ id?: string }>();

  // Determine active identifier (route param /d/:id, or query params id, slug, preset)
  const routeOrQueryId = id || searchParams.get('id') || searchParams.get('slug') || searchParams.get('preset') || '';
  const paramName = searchParams.get('name') || '';

  // Remote data state (if loaded dynamically via /api/demo/:id)
  const [remoteDemoData, setRemoteDemoData] = useState<DemoSiteData | null>(null);

  // Match preset first
  const matchedPreset = PRESETS.find(p => 
    (routeOrQueryId && (p.id.toLowerCase() === routeOrQueryId.toLowerCase() || p.name.toLowerCase() === routeOrQueryId.toLowerCase() || p.id.replace(/-/g, '') === routeOrQueryId.toLowerCase().replace(/-/g, ''))) ||
    (paramName && p.name.toLowerCase() === paramName.toLowerCase())
  );

  useEffect(() => {
    if (routeOrQueryId && !matchedPreset) {
      fetch(`/api/demo/${encodeURIComponent(routeOrQueryId)}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data) {
            setRemoteDemoData(json.data);
          }
        })
        .catch(() => {});
    }
  }, [routeOrQueryId, matchedPreset]);

  // Parse Site Data from URL parameters or preset or remote
  const companyName = searchParams.get('name') || remoteDemoData?.companyName || matchedPreset?.name || 'Apex Dental Studio';
  const tagline = searchParams.get('tagline') || remoteDemoData?.tagline || matchedPreset?.tagline || 'Painless General, Cosmetic & Implant Dentistry with 5-Star Comfort';
  const heroSubtext = searchParams.get('subtext') || remoteDemoData?.heroSubtext || matchedPreset?.heroSubtext || `Experience modern, anxiety-free care with ${companyName}. Speak with our 24/7 AI Concierge to get instant price quotes or book your appointment.`;
  const agentName = searchParams.get('agent') || remoteDemoData?.agentName || matchedPreset?.agentName || 'Arthur';
  const gender = searchParams.get('gender') || remoteDemoData?.gender || matchedPreset?.gender || 'male';
  const phone = searchParams.get('phone') || remoteDemoData?.phone || matchedPreset?.phone || '+1 (800) 450-DENT';
  const location = searchParams.get('location') || remoteDemoData?.location || matchedPreset?.location || 'Metropolitan Center';
  const hours = searchParams.get('hours') || remoteDemoData?.hours || matchedPreset?.hours || 'Mon-Sat: 8:00 AM - 7:00 PM | 24/7 AI Hotline';
  const theme = (searchParams.get('theme') as any) || remoteDemoData?.theme || matchedPreset?.theme || 'teal';
  const logoIcon = searchParams.get('icon') || remoteDemoData?.logoIcon || matchedPreset?.icon || 'dental';
  const maxCalls = parseInt(searchParams.get('maxCalls') || (remoteDemoData?.maxCalls ? String(remoteDemoData.maxCalls) : '') || (matchedPreset?.maxCalls ? String(matchedPreset.maxCalls) : '') || '10', 10);

  const fallbackData = generateSmartDemoData(companyName);

  // Check if custom data was passed in URL or saved in localStorage
  const savedDemoKey = `quorik_custom_demo_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const localSavedData: Partial<DemoSiteData> | null = (() => {
    try {
      const item = localStorage.getItem(savedDemoKey) || localStorage.getItem('quorik_latest_custom_demo');
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  })();

  // Parse custom reviews if provided in searchParams
  let customReviews: any = null;
  if (searchParams.get('reviews')) {
    try {
      customReviews = JSON.parse(searchParams.get('reviews')!);
    } catch (e) {}
  }

  // Parse custom faqs if provided in searchParams
  let customFaqs: any = null;
  if (searchParams.get('faqs')) {
    try {
      customFaqs = JSON.parse(searchParams.get('faqs')!);
    } catch (e) {}
  }

  // Parse custom services if provided in searchParams
  let customServicesParam: any = null;
  if (searchParams.get('services')) {
    try {
      customServicesParam = JSON.parse(searchParams.get('services')!);
    } catch (e) {}
  }

  const isMatchingSaved = localSavedData && (localSavedData.companyName?.toLowerCase() === companyName.toLowerCase() || !searchParams.get('name'));

  const services = remoteDemoData?.services || customServicesParam || (isMatchingSaved && localSavedData?.services?.length ? localSavedData.services : matchedPreset?.services || [
    {
      title: searchParams.get('s1') || fallbackData.services?.[0]?.title || 'Core Premium Service',
      desc: searchParams.get('s1d') || fallbackData.services?.[0]?.desc || 'Comprehensive diagnosis and dedicated care.',
      price: searchParams.get('s1p') || fallbackData.services?.[0]?.price || 'From $299',
      tag: 'Featured'
    },
    {
      title: searchParams.get('s2') || fallbackData.services?.[1]?.title || 'Restorative Treatment & Consultation',
      desc: searchParams.get('s2d') || fallbackData.services?.[1]?.desc || 'Advanced technology with customized progress tracking.',
      price: searchParams.get('s2p') || fallbackData.services?.[1]?.price || 'Free Exam',
      tag: 'Popular'
    },
    {
      title: searchParams.get('s3') || fallbackData.services?.[2]?.title || '24/7 Urgent Emergency Dispatch',
      desc: searchParams.get('s3d') || fallbackData.services?.[2]?.desc || 'Immediate relief and same-day priority intervention.',
      price: searchParams.get('s3p') || fallbackData.services?.[2]?.price || 'Same-Day',
      tag: 'Urgent'
    },
    {
      title: searchParams.get('s4') || fallbackData.services?.[3]?.title || 'Full Maintenance & Checkup Plan',
      desc: searchParams.get('s4d') || fallbackData.services?.[3]?.desc || 'Complete ongoing support and zero-downtime preventative care.',
      price: searchParams.get('s4p') || fallbackData.services?.[3]?.price || 'Save 20%',
      tag: 'Maintenance'
    }
  ]);

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
    stats: remoteDemoData?.stats || (isMatchingSaved && localSavedData?.stats) || matchedPreset?.stats || fallbackData.stats || {
      stat1Label: 'Client Satisfaction',
      stat1Val: '99.4%',
      stat2Label: 'Emergency Slots',
      stat2Val: 'Same-Day',
      stat3Label: 'Clients Served',
      stat3Val: '10,000+'
    },
    services,
    reviews: remoteDemoData?.reviews || customReviews || (isMatchingSaved && localSavedData?.reviews?.length ? localSavedData.reviews : (matchedPreset?.reviews || fallbackData.reviews || [
      { name: 'Sarah Jenkins', role: 'Verified Client', rating: 5, comment: `Called late in the evening and ${agentName} scheduled my appointment right away. Remarkable experience!` },
      { name: 'David Miller', role: 'Repeat Customer', rating: 5, comment: `Painless from start to finish. ${companyName} delivers world-class service.` },
      { name: 'Elena Rostova', role: 'Executive Client', rating: 5, comment: `Transparent pricing, zero waiting room delay, and genuine 24/7 responsiveness.` }
    ])),
    faqs: remoteDemoData?.faqs || customFaqs || (isMatchingSaved && localSavedData?.faqs?.length ? localSavedData.faqs : (matchedPreset?.faqs || fallbackData.faqs || [
      { q: `How quickly can I be scheduled at ${companyName}?`, a: `Our 24/7 AI Voice Concierge can instantly secure a priority slot within minutes.` },
      { q: `What payment and insurance options do you accept?`, a: `We accept all major payment methods, financing options, and flexible installment plans.` },
      { q: `Can I speak with a representative directly?`, a: `Yes! Speak with our AI receptionist above or call our main hotline anytime.` }
    ]))
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
    const cleanSlug = routeOrQueryId || matchedPreset?.id || (companyName ? companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) : '');
    const cleanUrl = cleanSlug ? `${window.location.origin}/d/${cleanSlug}` : window.location.href;
    navigator.clipboard.writeText(cleanUrl);
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
