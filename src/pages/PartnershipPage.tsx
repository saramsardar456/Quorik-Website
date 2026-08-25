import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Handshake, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  Globe, 
  Cpu, 
  Clock, 
  Check, 
  Layers, 
  MessageSquare,
  Lock,
  Headphones,
  Sliders,
  Send,
  Calendar,
  Share2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

interface PartnerTrack {
  id: string;
  badge: string;
  title: string;
  idealFor: string;
  commission: string;
  highlights: string[];
  icon: typeof Building2;
  ctaText: string;
  popular?: boolean;
}

export function PartnershipPage() {
  const { formatPrice } = useCurrency();
  
  // Interactive Partner ROI Calculator State
  const [referredClients, setReferredClients] = useState<number>(5);
  const [avgDealValue, setAvgDealValue] = useState<number>(2500); // monthly retainer or project value
  const [partnerTierPercent, setPartnerTierPercent] = useState<number>(20); // 20% standard rev-share

  // Interactive Application Form State
  const [formState, setFormState] = useState({
    companyName: '',
    websiteUrl: '',
    partnerTrack: 'agency-software-house',
    clientBaseSize: '10-50',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate annual partner revenue
  const annualPartnerRevenue = Math.round(referredClients * avgDealValue * (partnerTierPercent / 100) * 12);
  const totalClientPipelineValue = Math.round(referredClients * avgDealValue * 12);

  const partnerTracks: PartnerTrack[] = [
    {
      id: 'agency-software-house',
      badge: 'Co-Selling & Full-Stack Synergy',
      title: 'Software Houses & Dev Agencies',
      idealFor: 'Custom software companies, IT consultancies & digital agencies (e.g. Xeven Solutions, enterprise dev shops)',
      commission: '20% – 30% Recurring or Wholesale Margin',
      popular: true,
      icon: Building2,
      highlights: [
        'You deliver complex backends & custom software; we power turnkey 24/7 AI Voice receptionists & conversion frontends',
        'Direct co-bidding on high-ticket enterprise contracts ($20k–$100k+ scopes)',
        'Sub-second voice response engines (<800ms latency) ready to deploy without building voice infrastructure from scratch',
        'Dedicated Solutions Architect & joint technical pitch support on client discovery calls'
      ],
      ctaText: 'Apply as Agency Partner'
    },
    {
      id: 'certified-solution-integrator',
      badge: 'Implementation & Expansion',
      title: 'Solution & CRM Integrators',
      idealFor: 'HubSpot/Salesforce partners, telephony providers, and business automation consultants',
      commission: '20% Ongoing Rev-Share + 100% Implementation Fees',
      icon: Layers,
      highlights: [
        'Keep 100% of your billable setup, custom workflow, and CRM integration fees',
        'Earn 20% recurring monthly margin on all voice minutes and platform tiers',
        'Direct REST/Webhook APIs for seamless syncing with HubSpot, HighLevel, EHRs, and SQL databases',
        'White-glove developer sandbox with pre-configured client blueprints'
      ],
      ctaText: 'Become Certified Integrator'
    },
    {
      id: 'strategic-referral',
      badge: 'Frictionless Pipeline Growth',
      title: 'Strategic Referral Partners',
      idealFor: 'Venture studios, business brokers, fractional CMOs/CTOs, and industry advisors',
      commission: '15% – 20% Recurring for 12–24 Months',
      icon: TrendingUp,
      highlights: [
        'Simple intro model: Introduce your portfolio companies or clients, we handle 100% of demo and delivery',
        'Transparent automated monthly payouts via direct wire / Stripe',
        'Real-time tracking of deal stages, demo completions, and retained client revenue',
        'Zero technical management or support burden on your team'
      ],
      ctaText: 'Join Referral Network'
    },
    {
      id: 'white-label-reseller',
      badge: 'Brand Sovereignty',
      title: 'White-Label AI Voice Resellers',
      idealFor: 'Marketing agencies and SaaS platforms looking to offer branded AI Voice agents to their roster',
      commission: 'Set Your Own Retail Pricing (40%+ Margins)',
      icon: Cpu,
      highlights: [
        'Deliver state-of-the-art AI Voice agents under your agency branding & custom domain',
        'Wholesale per-account volume pricing with generous margin buffers',
        'Custom client onboarding portal with multi-tenant sub-accounts',
        'Priority feature requests and dedicated 24/7 engineering SLA'
      ],
      ctaText: 'Inquire for White-Label'
    }
  ];

  const valuePillars = [
    {
      title: 'Sub-Second Voice Latency (<800ms)',
      desc: 'Industry-leading real-time conversational turnaround with 8 natural male/female accents across US, UK, and Australian locales.',
      icon: Zap
    },
    {
      title: 'Zero Development Friction',
      desc: 'No need to hire $200k/yr voice AI engineers or manage fragile WebRTC / SIP infrastructure. Plug in our battle-tested engine immediately.',
      icon: Cpu
    },
    {
      title: 'Enterprise Security & Isolation',
      desc: 'Multi-tenant architecture with isolated client vaults, encrypted audio pipelines, and strict SOC-2/HIPAA compliance readiness.',
      icon: Lock
    },
    {
      title: 'Dedicated Co-Selling Lead',
      desc: 'Get assigned a senior Quorik Technical Partner Manager to join high-stakes client calls, run custom voice demos, and close deals together.',
      icon: Headphones
    }
  ];

  const comparisonData = [
    {
      metric: 'Time to Market',
      inHouse: '6 – 9 Months of heavy R&D',
      quorikPartner: 'Instant (Under 48 Hours live)'
    },
    {
      metric: 'Engineering Overhead',
      inHouse: '$150k – $300k+ in specialist salaries',
      quorikPartner: '$0 (Pure profit margin)'
    },
    {
      metric: 'Voice Latency & Naturalness',
      inHouse: 'Stuttery 2.5s–4s multi-hop lag',
      quorikPartner: 'Crisp ~800ms instantaneous response'
    },
    {
      metric: 'Ongoing Maintenance & Telephony',
      inHouse: 'SIP trunk breaks, API rate-limits, drift',
      quorikPartner: '100% managed 99.9% uptime SLA'
    },
    {
      metric: 'Client Demonstration',
      inHouse: 'Requires complex custom staging',
      quorikPartner: 'Instant live voice sandbox in 1 click'
    }
  ];

  const faqs = [
    {
      q: 'How does revenue share work for agency partners (like Xeven Solutions or software houses)?',
      a: 'We offer flexible alliance structures. You can either receive a recurring 20%–30% revenue share on all client retainers and voice usage, or buy wholesale seats at volume discount and bundle it into your own high-ticket development packages.'
    },
    {
      q: 'Can we co-sell to our existing enterprise and healthcare clients?',
      a: 'Yes! We actively support co-selling. If your agency specializes in backend systems, mobile apps, or enterprise integrations, Quorik provides the specialized 24/7 AI Voice receptionist and high-converting frontend, creating a complete end-to-end package that wins larger contracts.'
    },
    {
      q: 'How quickly can we spin up a demo for a prospect?',
      a: 'Within 2 minutes. Our platform features an interactive voice sandbox with 8 studio voices and instant industry knowledge templates (medical, legal, real estate, software, trade services) that you can demo live on screen or over phone.'
    },
    {
      q: 'Who owns the client relationship and intellectual property?',
      a: 'You retain 100% ownership of your client relationship. For white-label and agency partners, your clients never need to know Quorik exists unless you choose a co-branded alliance model.'
    },
    {
      q: 'When and how are partner payouts distributed?',
      a: 'Partner payouts are automatically processed on the 1st of every month via Direct Bank Wire, ACH, Stripe, or PayPal with transparent real-time statements in your Partner Portal.'
    }
  ];

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/partnerships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        setSubmitError(errData.error || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white pt-28 pb-20 relative overflow-hidden">
      <SEO 
        title="Partner Program & Strategic Alliances | Quorik Systems"
        description="Partner with Quorik Systems. Co-sell high-performance 24/7 AI Voice receptionists and edge web platforms. Earn 20%-30% recurring revenue with software houses, dev agencies, and integrators."
      />

      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-brand-teal/15 via-brand-blue/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-0 w-96 h-96 bg-brand-cyan/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-brand-teal/10"
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Quorik Strategic Partner Alliance</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]"
          >
            Deliver Sub-Second Voice AI & High-Performance Web.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-cyan to-blue-400">
              Co-Sell with Zero Overhead.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Join an elite network of software engineering houses, digital agencies, and technology consultancies. Unlock 
            <strong className="text-white"> 20%–30% recurring margin</strong> and close high-ticket enterprise contracts with battle-tested 24/7 AI Voice receptionists.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <a 
              href="#partner-apply"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-teal text-[#05070D] font-bold text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white hover:shadow-xl hover:shadow-brand-teal/20 transition-all duration-200 group"
            >
              <span>Apply for Partnership</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a 
              href="#calculator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <Sliders className="w-4 h-4 text-brand-teal" />
              <span>Calculate Partner ROI</span>
            </a>
          </motion.div>

          {/* Trust Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/[0.08]">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-brand-teal">&lt;800ms</div>
              <div className="text-xs text-gray-400 mt-1">Sub-Second Voice Turnaround</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">20%–30%</div>
              <div className="text-xs text-gray-400 mt-1">Recurring Revenue Share</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-brand-cyan">99.9%</div>
              <div className="text-xs text-gray-400 mt-1">Production Uptime SLA</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">48 Hours</div>
              <div className="text-xs text-gray-400 mt-1">Co-Branded Prototype Speed</div>
            </div>
          </div>
        </section>


        {/* --- 2. PARTNER TRACKS & COLLABORATION TIERS --- */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Tailored Alliance Tracks
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Choose the engagement model that best aligns with your firm’s capabilities, client base, and growth objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTracks.map((track) => {
              const Icon = track.icon;
              return (
                <div 
                  key={track.id}
                  className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    track.popular 
                      ? 'bg-[#0A0E1A] border-brand-teal/40 shadow-2xl shadow-brand-teal/10' 
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  {track.popular && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-brand-teal text-[#05070D] text-[10px] font-mono font-bold uppercase tracking-wider">
                      Most Strategic
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-teal">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-brand-teal uppercase tracking-widest block font-semibold">
                          {track.badge}
                        </span>
                        <h3 className="text-xl font-bold text-white">{track.title}</h3>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-[11px] text-gray-400 font-mono uppercase">Compensation / Economics:</div>
                      <div className="text-sm font-bold text-brand-teal font-mono">{track.commission}</div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      <strong className="text-white">Ideal for:</strong> {track.idealFor}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">Program Deliverables:</div>
                      <ul className="space-y-2">
                        {track.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <a
                      href="#partner-apply"
                      onClick={() => setFormState(prev => ({ ...prev, partnerTrack: track.id }))}
                      className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        track.popular
                          ? 'bg-brand-teal text-[#05070D] hover:bg-white'
                          : 'bg-white/10 text-white hover:bg-brand-teal hover:text-[#05070D]'
                      }`}
                    >
                      <span>{track.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* --- 3. INTERACTIVE PARTNER COMMISSIONS & REVENUE CALCULATOR --- */}
        <section id="calculator" className="scroll-mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0A0E1A] to-[#05070D] border border-brand-teal/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Sliders Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-mono font-bold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Interactive Co-Selling Economics</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white">
                  Estimate Your Annual Partner Earnings
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Calculate the recurring income and client pipeline generated by bundling Quorik AI Voice and Web engineering into your agency's pipeline.
                </p>
              </div>

              {/* Slider 1: Number of Clients */}
              <div className="space-y-3 bg-black/30 p-5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 font-semibold">Active Clients Co-Sold / Referred</span>
                  <span className="font-mono text-brand-teal font-bold text-lg bg-brand-teal/10 px-3 py-0.5 rounded-lg border border-brand-teal/30">
                    {referredClients} Clients
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={referredClients}
                  onChange={(e) => setReferredClients(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
                <div className="flex justify-between text-[11px] font-mono text-gray-500">
                  <span>1 Client</span>
                  <span>25 Clients</span>
                  <span>50+ Enterprise Clients</span>
                </div>
              </div>

              {/* Slider 2: Average Monthly Retainer */}
              <div className="space-y-3 bg-black/30 p-5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 font-semibold">Avg. Client Monthly Retainer / Value</span>
                  <span className="font-mono text-brand-cyan font-bold text-lg bg-brand-cyan/10 px-3 py-0.5 rounded-lg border border-brand-cyan/30">
                    {formatPrice(avgDealValue)}/mo
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="10000" 
                  step="500"
                  value={avgDealValue}
                  onChange={(e) => setAvgDealValue(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                />
                <div className="flex justify-between text-[11px] font-mono text-gray-500">
                  <span>{formatPrice(1000)}/mo (Starter)</span>
                  <span>{formatPrice(5000)}/mo (Growth)</span>
                  <span>{formatPrice(10000)}/mo (Enterprise)</span>
                </div>
              </div>

              {/* Partner Tier Selector */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Commission Structure:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPartnerTierPercent(15)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                      partnerTierPercent === 15 
                        ? 'bg-brand-teal text-[#05070D]' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    15% Referral
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnerTierPercent(20)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                      partnerTierPercent === 20 
                        ? 'bg-brand-teal text-[#05070D]' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    20% Agency Co-Sell
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnerTierPercent(30)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                      partnerTierPercent === 30 
                        ? 'bg-brand-teal text-[#05070D]' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    30% Master Alliance
                  </button>
                </div>
              </div>
            </div>

            {/* Right Output Card */}
            <div className="lg:col-span-5 bg-black/60 border border-brand-teal/30 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-brand-teal font-semibold mb-2">
                  Projected Partner Earnings
                </div>
                <div className="text-4xl sm:text-5xl font-bold font-mono text-white tracking-tight">
                  {formatPrice(annualPartnerRevenue)}
                  <span className="text-sm font-normal text-gray-400 block mt-1 font-sans">
                    Annual Recurring Revenue to Your Agency
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-y border-white/10 py-5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Recurring Payout:</span>
                  <span className="font-mono font-bold text-brand-teal">
                    {formatPrice(Math.round(annualPartnerRevenue / 12))}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Client Pipeline Value:</span>
                  <span className="font-mono font-bold text-white">
                    {formatPrice(totalClientPipelineValue)}/yr
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Technical Maintenance Required:</span>
                  <span className="font-mono font-bold text-emerald-400">0 Hours (100% Handled by Quorik)</span>
                </div>
              </div>

              <a
                href="#partner-apply"
                className="w-full py-3.5 rounded-xl bg-brand-teal text-[#05070D] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <span>Lock In This Partnership Tier</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </section>


        {/* --- 4. WHY ALLY WITH QUORIK VS IN-HOUSE R&D --- */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Why Strategic Partners Build with Us
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Avoid spending hundreds of thousands of dollars reinventing voice latency pipelines, audio stream buffers, and telephony infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand-teal/40 transition-all duration-300 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-teal">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0A0E1A]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-4 font-mono uppercase tracking-wider text-gray-400 font-semibold">Capability Dimension</th>
                  <th className="p-4 font-mono uppercase tracking-wider text-red-400 font-semibold">Building In-House</th>
                  <th className="p-4 font-mono uppercase tracking-wider text-brand-teal font-semibold">Partnering with Quorik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono">{row.metric}</td>
                    <td className="p-4 text-gray-400 flex items-center gap-2">
                      <span className="text-red-400">✕</span> {row.inHouse}
                    </td>
                    <td className="p-4 text-brand-teal font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-brand-teal" /> {row.quorikPartner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>


        {/* --- 5. ONBOARDING ROADMAP --- */}
        <section className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Frictionless 4-Step Partner Launch
            </h2>
            <p className="text-gray-400 text-sm">
              We go from initial discovery call to live client demo delivery in under 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative space-y-3">
              <div className="text-3xl font-bold font-mono text-brand-teal/40">01</div>
              <h3 className="text-sm font-bold text-white">Application & Strategic Fit Call</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We review your agency roster, ideal client profiles, and identify high-converting co-selling opportunities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative space-y-3">
              <div className="text-3xl font-bold font-mono text-brand-teal/40">02</div>
              <h3 className="text-sm font-bold text-white">Sandbox & Co-Branded Assets</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive partner sandbox credentials, white-label client pitch decks, and live voice demo links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative space-y-3">
              <div className="text-3xl font-bold font-mono text-brand-teal/40">03</div>
              <h3 className="text-sm font-bold text-white">Joint Discovery & Pilot Closing</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our solutions engineer joins your client pitch calls to demonstrate live voice capabilities and secure contracts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative space-y-3">
              <div className="text-3xl font-bold font-mono text-brand-teal/40">04</div>
              <h3 className="text-sm font-bold text-white">Monthly Automated Rev-Share</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Receive hands-off recurring margin payouts every month as your clients scale active minutes and seats.
              </p>
            </div>
          </div>
        </section>


        {/* --- 6. PARTNER INTAKE APPLICATION FORM --- */}
        <section id="partner-apply" className="scroll-mt-24 max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#0A0E1A] border border-brand-teal/30 shadow-2xl relative">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Partner Intake</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Apply for the Quorik Partner Program
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Our Strategic Alliances Lead reviews all applications within 24 business hours.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-brand-teal/10 border border-brand-teal/30 text-center space-y-4"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Application Received Successfully!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                Thank you for applying, <strong className="text-white">{formState.contactName || 'Partner'}</strong> ({formState.companyName || 'Your Agency'}). 
                Our Strategic Alliances Lead has logged your request and will reach out to <strong className="text-white">{formState.contactEmail}</strong> within 24 hours to schedule our alignment call.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/voice-agent"
                  className="px-5 py-2.5 rounded-xl bg-brand-teal text-[#05070D] font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Explore Voice Sandbox
                </Link>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  Submit Another Inflow
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Company / Agency Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Xeven Solutions, Apex Digital"
                    value={formState.companyName}
                    onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                    className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Company Website *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.xevensolutions.com"
                    value={formState.websiteUrl}
                    onChange={(e) => setFormState({ ...formState, websiteUrl: e.target.value })}
                    className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Partnership Track *</label>
                  <select
                    value={formState.partnerTrack}
                    onChange={(e) => setFormState({ ...formState, partnerTrack: e.target.value })}
                    className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-teal focus:outline-none transition-colors"
                  >
                    <option value="agency-software-house">Software House & Dev Agency (Co-Selling)</option>
                    <option value="certified-solution-integrator">Solution & CRM Integrator</option>
                    <option value="strategic-referral">Strategic Referral Partner</option>
                    <option value="white-label-reseller">White-Label AI Voice Reseller</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Current Client Base Size</label>
                  <select
                    value={formState.clientBaseSize}
                    onChange={(e) => setFormState({ ...formState, clientBaseSize: e.target.value })}
                    className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-teal focus:outline-none transition-colors"
                  >
                    <option value="1-10">1 – 10 Active Clients</option>
                    <option value="10-50">10 – 50 Active Clients</option>
                    <option value="50-200">50 – 200 Enterprise Clients</option>
                    <option value="200+">200+ High-Volume Enterprise Roster</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shehram Meellu"
                    value={formState.contactName}
                    onChange={(e) => setFormState({ ...formState, contactName: e.target.value })}
                    className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="partnerships@company.com"
                    value={formState.contactEmail}
                    onChange={(e) => setFormState({ ...formState, contactEmail: e.target.value })}
                    className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formState.contactPhone}
                    onChange={(e) => setFormState({ ...formState, contactPhone: e.target.value })}
                    className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-300 block mb-1.5 uppercase">Partnership Goals / Proposed Co-Selling Scope</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about the services you currently offer, your target vertical, and how we can co-sell AI voice and web platforms together..."
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  className="w-full bg-[#05070D] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand-teal focus:outline-none transition-colors resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-brand-teal text-[#05070D] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white hover:shadow-xl hover:shadow-brand-teal/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#05070D] border-t-transparent rounded-full animate-spin" />
                    Submitting Application...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Partner Application</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-500 text-center font-mono">
                🔒 Protected by enterprise NDA & strict client isolation protocols.
              </p>
            </form>
          )}
        </section>


        {/* --- 7. PARTNER PROGRAM FAQ --- */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Clear answers on payouts, client ownership, and engineering collaboration.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-brand-teal font-mono">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
