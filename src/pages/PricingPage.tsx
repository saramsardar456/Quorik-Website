import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Calculator, 
  ShieldCheck, 
  Zap, 
  DollarSign,
  Wrench,
  Bot,
  Mic,
  Calendar,
  Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  tagline: string;
  monthlyUSD: number;
  annualUSD: number;
  setupPriceUSD: number;
  timeline: string;
  includedMinutes: string;
  features: string[];
  notIncluded?: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter AI',
    tagline: 'Ideal for businesses & clinics launching their modern custom website with an embedded interactive AI voice assistant.',
    monthlyUSD: 199,
    annualUSD: 159,
    setupPriceUSD: 999,
    timeline: '5 - 7 Business Days',
    includedMinutes: '300 Voice Mins + 1,000 Text Chats / mo',
    features: [
      'High-Performance Modern React Website (Up to 5 Pages)',
      '1 Custom In-Browser Website AI Voice Agent',
      '300 Interactive Web Voice Minutes / Month',
      '1,000 AI Text Chat Conversations / Month',
      'Smart 24/7 On-Site Voice & Chat Widget',
      'Instant Email & WhatsApp Lead Notifications',
      'Basic CRM & Google Calendar Appointment Sync',
      'High-Speed SSL, Cloud Hosting & SEO Essentials',
      'Email Support (48h Response SLA)'
    ],
    notIncluded: [
      'Multiple Concurrent Voice Personas',
      'Custom Cloned Brand Voices',
      'Dedicated Slack / Priority SLA'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Suite',
    badge: 'Most Popular',
    popular: true,
    tagline: 'Engineered for scaling brands, clinics, and real estate requiring high-traffic web voice engagement & automation.',
    monthlyUSD: 399,
    annualUSD: 319,
    setupPriceUSD: 1999,
    timeline: '10 - 14 Business Days',
    includedMinutes: '1,200 Voice Mins + 5,000 Text Chats / mo',
    features: [
      'Full Custom Web Application with Interactive UI & CMS',
      '2 Dedicated Website AI Voice Agents (Sales & Support)',
      '1,200 Interactive Web Voice Minutes / Month',
      '5,000 AI Text Chat Conversations / Month',
      'Bilingual Language Support (English & Urdu)',
      'Automated WhatsApp Quotations & Follow-up Sequences',
      'Two-Way CRM Integration (HubSpot, Salesforce, Webhooks)',
      'Live Web Voice Transcripts & Visitor Analytics Dashboard',
      'A/B Testing & Conversion Rate Optimization',
      'Priority Engineering Support (12h SLA)'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Ultra',
    badge: 'Custom Architecture',
    tagline: 'Full-stack enterprise web platform with custom cloned neural voice models and bespoke database workflows.',
    monthlyUSD: 799,
    annualUSD: 639,
    setupPriceUSD: 3999,
    timeline: '2 - 3 Weeks Dedicated Sprint',
    includedMinutes: '4,000+ Voice Mins + Unlimited Chats / mo',
    features: [
      'Enterprise Full-Stack Web Platform & Multi-Branch Portals',
      'Unlimited Website AI Voice Agents with Custom Cloned Voice',
      '4,000+ Interactive Web Voice Minutes / Month',
      'Unlimited AI Text Chat & Knowledge Inquiries',
      'Real-Time In-Browser Lead Qualification & Instant Scheduling',
      'Deep ERP, Custom Database & Webhook Integrations',
      'Custom LLM Fine-Tuning & Knowledge Retrieval (RAG)',
      'SOC2 / HIPAA Compliant Data Handling Protocols',
      'Custom Role-Based Staff Dashboard & Visitor Logs',
      'Dedicated Lead Solution Architect & Priority Support'
    ]
  }
];

const COMPARISON_FEATURES = [
  { name: 'Custom React Web Design', starter: 'Up to 5 Pages', growth: 'Unlimited Pages', enterprise: 'Bespoke Multi-Portal' },
  { name: 'Website AI Voice Agents', starter: '1 In-Browser Agent', growth: '2 Agents (Sales/Support)', enterprise: 'Unlimited Custom Agents' },
  { name: 'Interactive Voice Minutes / mo', starter: '300 Mins (~150 calls)', growth: '1,200 Mins (~600 calls)', enterprise: '4,000+ Mins (Dedicated)' },
  { name: 'AI Text Chat Messages / mo', starter: '1,000 Chats / mo', growth: '5,000 Chats / mo', enterprise: 'Unlimited Chats' },
  { name: 'Bilingual Support (English/Urdu)', starter: 'Standard English', growth: 'English + Urdu Included', enterprise: 'Multi-lingual & Regional Accents' },
  { name: 'Calendar & WhatsApp Sync', starter: 'Basic Google Sync', growth: 'Two-Way Live CRM Sync', enterprise: 'Custom ERP & Webhooks' },
  { name: 'Voice Transcripts & Analytics', starter: 'Summary Logs', growth: 'Real-Time Dashboard', enterprise: 'Enterprise BI & Audit Reports' },
  { name: 'Deployment Turnaround', starter: '5 - 7 Days', growth: '10 - 14 Days', enterprise: 'Priority Dedicated Sprint' },
  { name: 'Support SLA', starter: '48h Email', growth: '12h Priority', enterprise: '24/7 Dedicated Channel' }
];

export function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // ROI Calculator state
  const [monthlyInquiries, setMonthlyInquiries] = useState<number>(300);
  const [avgCustomerValue, setAvgCustomerValue] = useState<number>(250);
  const [missedLeadRate, setMissedLeadRate] = useState<number>(30);

  const missedLeads = Math.round((monthlyInquiries * missedLeadRate) / 100);
  const recoveredLeads = Math.round(missedLeads * 0.65); // 65% recovered with 24/7 instant website voice interaction
  const estimatedAddedRevenue = recoveredLeads * avgCustomerValue;

  const handleSelectPlan = (tierId: string, type: 'subscription' | 'setup') => {
    navigate(`/contact?tier=${encodeURIComponent(tierId)}&type=${type}&cycle=${billingCycle}`);
  };

  return (
    <div className="pt-28 pb-24 bg-[#05060A] text-white min-h-screen relative noise-bg overflow-hidden">
      <SEO
        title="Transparent Pricing & Packages | Quorik Website AI Voice Agents"
        description="Explore transparent pricing for Quorik custom web development and embedded website AI voice agents with flexible monthly plans and one-time setup options."
        keywords="website AI voice agent pricing, web development pricing, AI voice assistant cost, on-site voice AI, Quorik packages"
        canonicalPath="/pricing"
      />

      {/* Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-teal/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-brand-blue/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <DollarSign className="w-3.5 h-3.5" /> Transparent Investment Tiers
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase font-display leading-tight">
            Predictable Pricing. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-white to-brand-blue">
              Engineered for Maximum ROI.
            </span>
          </h1>

          <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
            Choose the package that aligns with your scale. Every tier includes a bespoke React website, 
            an embedded in-browser AI voice agent, and automated lead capture workflows.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-[#0A0E1A] border border-white/10 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-brand-teal text-[#05060A] shadow-md shadow-brand-teal/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-brand-teal text-[#05060A] shadow-md shadow-brand-teal/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {PRICING_TIERS.map((tier) => {
            const recurringPrice = billingCycle === 'annual' ? tier.annualUSD : tier.monthlyUSD;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative bg-[#0A0E1A] border rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  tier.popular
                    ? 'border-brand-teal shadow-[0_0_40px_rgba(6,182,212,0.15)] ring-1 ring-brand-teal/40'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-teal to-brand-blue text-[#05060A] text-[11px] font-mono font-extrabold tracking-widest uppercase rounded-full shadow-lg">
                    {tier.badge}
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Tier Title & Tagline */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white uppercase font-display tracking-tight flex items-center justify-between">
                      {tier.name}
                      <span className="text-xs font-mono font-normal text-brand-teal px-2 py-0.5 bg-brand-teal/10 border border-brand-teal/20 rounded">
                        {tier.timeline}
                      </span>
                    </h3>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed min-h-[36px]">
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="p-5 bg-[#05060A] border border-white/5 rounded-xl mb-6 space-y-4">
                    {/* Recurring Subscription Rate */}
                    <div>
                      <span className="text-gray-500 font-mono text-[10px] uppercase block tracking-wider mb-1">
                        Monthly Plan & Voice AI Engine:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                          ${recurringPrice}
                        </span>
                        <span className="text-gray-400 text-xs font-mono">
                          / month {billingCycle === 'annual' && '(billed annually)'}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-teal font-mono">
                        <Mic className="w-3.5 h-3.5" />
                        <span>{tier.includedMinutes}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400">One-Time Setup & Build:</span>
                      <span className="text-white font-bold">${tier.setupPriceUSD.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Separate Choose Plan & One-Time Setup */}
                  <div className="space-y-3 mb-8">
                    {/* Choose Plan (Subscription) Button */}
                    <button
                      onClick={() => handleSelectPlan(tier.id, 'subscription')}
                      className={`w-full py-3.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                        tier.popular
                          ? 'bg-brand-teal text-[#05060A] hover:bg-white shadow-lg shadow-brand-teal/20'
                          : 'bg-white text-[#05060A] hover:bg-gray-200'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Choose Plan (${recurringPrice}/mo)</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                    </button>

                    {/* One-Time Setup Button */}
                    <button
                      onClick={() => handleSelectPlan(tier.id, 'setup')}
                      className="w-full py-3 px-4 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Wrench className="w-3.5 h-3.5 text-brand-teal" />
                      <span>One-Time Setup Only (${tier.setupPriceUSD.toLocaleString()})</span>
                    </button>
                  </div>

                  {/* Included Features List */}
                  <div className="space-y-3">
                    <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Included in Package:
                    </p>
                    <ul className="space-y-2.5">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                          <Check className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Security Pill */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 rounded-b-2xl flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" /> 100% Delivery SLA
                  </span>
                  <span>Turnaround: {tier.timeline.split(' ')[0]} {tier.timeline.split(' ')[1]}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive ROI Calculator Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0A0E1A] border border-white/10 rounded-2xl p-6 sm:p-10 mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Calculator className="w-3.5 h-3.5" /> Interactive ROI Estimator
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase font-display tracking-tight">
              Calculate Your Revenue Growth with a Website AI Voice Agent
            </h2>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Website visitors bounce within seconds if they don't get immediate answers. 
              See how an interactive, in-browser AI voice agent captures high-intent visitors and books clients 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Monthly Website Inquiries / Leads */}
              <div className="bg-[#05060A] border border-white/5 p-5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-300">Estimated Monthly Website Visitors / Inquiries:</span>
                  <span className="text-brand-teal font-bold text-sm">{monthlyInquiries} visitors / inquiries</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={monthlyInquiries}
                  onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>20 inquiries</span>
                  <span>500 inquiries</span>
                  <span>1,000 inquiries</span>
                </div>
              </div>

              {/* Slider 2: Average Deal / Customer Value */}
              <div className="bg-[#05060A] border border-white/5 p-5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-300">Average Customer Order / Retainer Value:</span>
                  <span className="text-brand-teal font-bold text-sm">${avgCustomerValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={avgCustomerValue}
                  onChange={(e) => setAvgCustomerValue(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>$50</span>
                  <span>$1,500</span>
                  <span>$3,000</span>
                </div>
              </div>

              {/* Slider 3: Current Bounced / Unconverted Rate */}
              <div className="bg-[#05060A] border border-white/5 p-5 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-300">Estimated Unconverted / Bounced Web Visitors:</span>
                  <span className="text-brand-teal font-bold text-sm">{missedLeadRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={missedLeadRate}
                  onChange={(e) => setMissedLeadRate(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>10% (Low)</span>
                  <span>30% (Average)</span>
                  <span>50% (High Bounce)</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-brand-teal/10 via-[#0A0E1A] to-brand-blue/10 border border-brand-teal/30 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-teal font-bold block mb-1">
                  Estimated Monthly Value Recovered
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                  +${estimatedAddedRevenue.toLocaleString()}
                </div>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                  Based on converting ~<strong className="text-white">{recoveredLeads} additional visitors</strong> per month 
                  who engage directly with the interactive on-site AI voice assistant.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between text-gray-300">
                  <span>Web Leads Converted:</span>
                  <span className="text-white font-bold">+{recoveredLeads} / mo</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Estimated Annual Value:</span>
                  <span className="text-emerald-400 font-bold">+${(estimatedAddedRevenue * 12).toLocaleString()} / yr</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Payback Period:</span>
                  <span className="text-brand-teal font-bold">&lt; 30 Days</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full py-3.5 bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/20"
              >
                <Bot className="w-4 h-4" /> Book Consultation & Deploy Voice AI
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase font-display">
              Feature Comparison Matrix
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Compare capabilities across Starter, Growth, and Enterprise website voice packages.
            </p>
          </div>

          <div className="overflow-x-auto bg-[#0A0E1A] border border-white/10 rounded-2xl">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 sm:p-5 text-gray-400 font-bold uppercase tracking-wider w-1/3">Feature</th>
                  <th className="p-4 sm:p-5 text-white font-bold uppercase tracking-wider">Starter</th>
                  <th className="p-4 sm:p-5 text-brand-teal font-bold uppercase tracking-wider bg-brand-teal/5">Growth</th>
                  <th className="p-4 sm:p-5 text-white font-bold uppercase tracking-wider">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {COMPARISON_FEATURES.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">{item.name}</td>
                    <td className="p-4 sm:p-5">{item.starter}</td>
                    <td className="p-4 sm:p-5 text-brand-teal font-semibold bg-brand-teal/5">{item.growth}</td>
                    <td className="p-4 sm:p-5">{item.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Everything you need to know about our website AI voice agents, deliverables, and service guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-teal shrink-0" />
                How do visitors interact with the Website AI Voice Agent?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Visitors speak directly into their browser with zero app downloads or phone dialing required. 
                With a single tap on the microphone button, the voice agent responds in real-time with sub-350ms ultra-low latency.
              </p>
            </div>

            <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-teal shrink-0" />
                What is the difference between Setup Fee and Monthly Plan?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                The one-time setup fee covers full custom website development, copywriting, AI voice persona design, 
                and CRM integrations. The monthly plan covers ongoing high-speed cloud hosting, neural voice generation, 
                LLM processing tokens, and continuous model optimization.
              </p>
            </div>

            <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-teal shrink-0" />
                Can the AI Voice Agent speak in Urdu or regional accents?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Yes! Our website voice agents natively support English, Roman Urdu, and clear native accents 
                tailored to your target market with natural conversational intonation.
              </p>
            </div>

            <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-teal shrink-0" />
                Are there long-term contracts or cancellation penalties?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                No. Monthly plans can be paused or modified at any time with zero cancellation penalties. 
                You own 100% of your domain, web code assets, and customer databases.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="bg-gradient-to-r from-brand-teal/20 via-[#0A0E1A] to-brand-blue/20 border border-brand-teal/30 p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold text-white uppercase font-display">
              Ready to Embed AI Voice on Your Website?
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Speak directly with our engineering team. We'll design and build a custom high-performance website with an interactive AI voice agent tailored to your brand.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/20"
              >
                <Calendar className="w-4 h-4" /> Book Consultation Call
              </Link>
              <a
                href="mailto:sales@quoriksystems.com"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 text-white font-bold text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-brand-teal" /> Email Sales Desk: sales@quoriksystems.com
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
