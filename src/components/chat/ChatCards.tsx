import React, { useState } from 'react';
import { TrendingUp, CheckCircle, ExternalLink, ArrowRight, DollarSign, Users, Award, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { formatWhatsAppPhone } from '../../utils/phone';
import { useCurrency } from '../../context/CurrencyContext';

interface ChatCardProps {
  onSelectAction?: (text: string) => void;
}

export const ChatROICalculatorCard: React.FC<ChatCardProps> = ({ onSelectAction }) => {
  const { currencyConfig, formatPrice } = useCurrency();
  const [inquiries, setInquiries] = useState<number>(60);
  const [dealValue, setDealValue] = useState<number>(500);

  // Estimate 35% missed call / lead bounce recovery with Quorik AI
  const recoveredLeads = Math.round(inquiries * 0.35);
  const monthlyRevenue = recoveredLeads * dealValue;

  const handleWhatsAppClick = () => {
    const msg = `Hi Quorik AI Team, I used the Chat ROI Calculator! I get ~${inquiries} monthly inquiries at ${formatPrice(dealValue)}/deal. I want to recover ~${formatPrice(monthlyRevenue)}/mo with your AI system.`;
    window.open(`https://wa.me/923700146156?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="mt-3 p-4 bg-[#070A14] border border-brand-teal/30 rounded-2xl text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-brand-teal" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">ROI Calculator ({currencyConfig.code})</h4>
            <p className="text-[10px] text-gray-400">See monthly revenue recovered with Quorik AI</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal border border-brand-teal/30">
          Live Estimate
        </span>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-blue" /> Monthly Inquiries:
            </span>
            <span className="font-mono text-brand-teal font-bold">{inquiries} calls/leads</span>
          </div>
          <input
            type="range"
            min="10"
            max="300"
            step="5"
            value={inquiries}
            onChange={(e) => setInquiries(Number(e.target.value))}
            className="w-full accent-brand-teal bg-white/10 rounded-lg h-1.5 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-gray-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-green-400" /> Avg Deal Value:
            </span>
            <span className="font-mono text-green-400 font-bold">{formatPrice(dealValue)}</span>
          </div>
          <input
            type="range"
            min="50"
            max="2500"
            step="50"
            value={dealValue}
            onChange={(e) => setDealValue(Number(e.target.value))}
            className="w-full accent-green-400 bg-white/10 rounded-lg h-1.5 cursor-pointer"
          />
        </div>
      </div>

      {/* Result box */}
      <div className="p-3 bg-gradient-to-r from-brand-blue/20 to-brand-teal/20 border border-brand-teal/30 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-300 uppercase tracking-widest block">Est. Revenue Recovered</span>
          <span className="text-lg font-black font-mono text-green-400">+{formatPrice(monthlyRevenue)}<span className="text-xs text-gray-400 font-normal">/mo</span></span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block">Recovered Leads</span>
          <span className="text-xs font-bold text-white font-mono">~{recoveredLeads} deals/mo</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleWhatsAppClick}
          className="flex-1 py-2.5 px-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-green-900/30"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Claim ROI via Executive Desk</span>
        </button>
        {onSelectAction && (
          <button
            onClick={() => onSelectAction(`I want to book a call to implement this ${formatPrice(monthlyRevenue)}/mo ROI strategy.`)}
            className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all"
          >
            Book Call
          </button>
        )}
      </div>
    </div>
  );
};

export const ChatPortfolioCard: React.FC<ChatCardProps> = ({ onSelectAction }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const projects = [
    {
      title: "Apex Fitness & Gyms",
      category: "24/7 AI Voice Receptionist",
      metric: "+340%",
      metricLabel: "Member Tour Bookings",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      description: "Deployed an AI voice receptionist answering peak-hour calls & scheduling gym tours 24/7.",
      tags: ["Voice AI", "Live Booking", "SMS Auto-Text"]
    },
    {
      title: "Luxe E-Commerce Store",
      category: "AI Conversational Sales Bot",
      metric: "+48%",
      metricLabel: "Checkout Conversion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
      description: "Instant product recommendations & automated WhatsApp cart abandonment recovery.",
      tags: ["AI Chatbot", "WhatsApp Flow", "Shopify Integration"]
    },
    {
      title: "FinTech Consulting",
      category: "Autonomous Lead Qualifier",
      metric: "62%",
      metricLabel: "Faster Lead Response",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      description: "Instant website audit & qualified discovery call booking within 30 seconds.",
      tags: ["Lead Magnet", "CRM Sync", "Custom Web"]
    }
  ];

  const current = projects[activeIdx];

  return (
    <div className="mt-3 p-4 bg-[#070A14] border border-white/10 rounded-2xl text-white shadow-xl space-y-3.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-teal" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quorik Featured Work</h4>
        </div>
        <div className="flex gap-1">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${activeIdx === i ? 'bg-brand-teal w-4' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-white/10 group">
        <img src={current.image} alt={current.title} className="w-full h-28 object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A14] via-[#070A14]/60 to-transparent p-3 flex flex-col justify-end">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[9px] font-mono text-brand-teal uppercase tracking-widest">{current.category}</span>
              <h5 className="text-sm font-bold text-white">{current.title}</h5>
            </div>
            <div className="text-right bg-brand-blue/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-brand-blue/40">
              <span className="text-sm font-black text-brand-teal font-mono block leading-tight">{current.metric}</span>
              <span className="text-[8px] text-gray-300 font-medium block">{current.metricLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed">{current.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {current.tags.map((t, idx) => (
          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-mono">
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        {onSelectAction && (
          <button
            onClick={() => onSelectAction(`I want an AI system like ${current.title} (${current.category})!`)}
            className="w-full py-2 bg-brand-blue hover:bg-brand-blue/80 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span>Get Similar System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const ChatPricingCard: React.FC<ChatCardProps> = ({ onSelectAction }) => {
  const { formatPrice } = useCurrency();
  const [selectedPlan, setSelectedPlan] = useState<number>(1);

  const plans = [
    {
      name: "Starter AI",
      setupFee: 999,
      rawUsd: 159,
      monthlyRawUsd: 199,
      period: "/ month",
      desc: "Custom High-Performance Website (Up to 5 Pages) + 1 Embedded In-Browser AI Voice Assistant & Chatbot.",
      features: [
        "Modern React Website (Up to 5 Pages)",
        "1 In-Browser AI Voice Agent",
        "300 Voice Mins + 1,000 Chats / Mo",
        "Instant Email & WhatsApp Lead Alerts",
        "Google Calendar & Basic CRM Sync"
      ]
    },
    {
      name: "Growth Suite",
      setupFee: 1999,
      rawUsd: 319,
      monthlyRawUsd: 399,
      period: "/ month",
      desc: "Full Custom Web Application + 2 Dedicated AI Voice Agents (Sales & Support) + Multi-Language & Voice Persona Support.",
      features: [
        "Full Custom Web App & Interactive UI",
        "2 Dedicated AI Voice Agents (Sales/Support)",
        "1,200 Voice Mins + 5,000 Chats / Mo",
        "Multi-Language & Voice Persona Support",
        "Two-Way CRM & Webhook Automation",
        "Priority Engineering Support (12h SLA)"
      ],
      popular: true
    },
    {
      name: "Enterprise Ultra",
      setupFee: 3999,
      rawUsd: 639,
      monthlyRawUsd: 799,
      period: "/ month",
      desc: "Full-Stack Enterprise Web Platform + Unlimited AI Voice Agents with Custom Cloned Neural Voice Models.",
      features: [
        "Enterprise Full-Stack Web Platform",
        "Unlimited AI Voice Agents & Cloned Voices",
        "4,000+ Voice Mins + Unlimited Chats",
        "Custom LLM Fine-Tuning & Knowledge (RAG)",
        "Deep ERP, CRM & Webhook Integrations",
        "Dedicated Solution Architect & Priority SLA"
      ]
    }
  ];

  const plan = plans[selectedPlan];
  const displayPrice = formatPrice(plan.rawUsd);
  const displaySetupFee = formatPrice(plan.setupFee);

  return (
    <div className="mt-3 p-4 bg-[#070A14] border border-white/10 rounded-2xl text-white shadow-xl space-y-3.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-teal" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quorik Service Packages</h4>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">1-Time Setup + Monthly</span>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
        {plans.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPlan(idx)}
            className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              selectedPlan === idx 
                ? 'bg-brand-blue text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Selected Plan Details */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2 relative overflow-hidden">
        {plan.popular && (
          <span className="absolute top-2 right-2 text-[8px] font-bold font-mono uppercase bg-brand-teal text-black px-2 py-0.5 rounded-full">
            Most Popular
          </span>
        )}
        <div className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 border border-white/10 rounded-lg text-[10px] font-mono">
          <span className="text-gray-400 uppercase font-semibold">1-Time Custom Setup:</span>
          <span className="text-brand-teal font-black">{displaySetupFee}</span>
        </div>

        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-2xl font-black text-white font-mono">{displayPrice}</span>
          <span className="text-[10px] text-gray-400 font-mono">{plan.period}</span>
          <span className="text-[9px] text-brand-teal font-mono ml-auto">(Annual Rate)</span>
        </div>
        <p className="text-xs font-bold text-brand-teal uppercase tracking-wider">{plan.name} Tier</p>
        <p className="text-[11px] text-gray-300 leading-snug">{plan.desc}</p>

        <ul className="space-y-1 pt-1.5 border-t border-white/5">
          {plan.features.map((f, i) => (
            <li key={i} className="text-[11px] text-gray-300 flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-brand-teal shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {onSelectAction && (
        <button
          onClick={() => onSelectAction(`I am interested in the ${plan.name} (${displayPrice}/mo) package. Can you help me get started?`)}
          className="w-full py-2.5 bg-brand-teal hover:bg-brand-teal/80 text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <span>Inquire About {plan.name} Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
