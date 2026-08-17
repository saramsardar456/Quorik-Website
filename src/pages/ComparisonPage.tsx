import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Check, 
  X, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Users, 
  PhoneCall, 
  Bot,
  Layers
} from 'lucide-react';
import { Contact } from '../components/sections/Contact';

interface ComparisonMatrixItem {
  feature: string;
  quorik: string | boolean;
  traditionalAgency: string | boolean;
  humanCallCenter: string | boolean;
  basicChatbot: string | boolean;
}

export function ComparisonPage() {
  const { slug } = useParams<{ slug?: string }>();

  const matrix: ComparisonMatrixItem[] = [
    {
      feature: 'Development & Deployment Time',
      quorik: 'Fast Agreed Timeline',
      traditionalAgency: '3–6 Months',
      humanCallCenter: '30–60 Days Setup',
      basicChatbot: 'Instant Template'
    },
    {
      feature: '24/7 Embedded Website AI Voice Agent',
      quorik: true,
      traditionalAgency: false,
      humanCallCenter: false,
      basicChatbot: false
    },
    {
      feature: 'Voice Speech Latency',
      quorik: '<350ms (In-browser real-time)',
      traditionalAgency: 'N/A',
      humanCallCenter: '2–10s Hold Times',
      basicChatbot: 'N/A (Text only)'
    },
    {
      feature: 'Custom High-Performance Web Architecture',
      quorik: true,
      traditionalAgency: true,
      humanCallCenter: false,
      basicChatbot: false
    },
    {
      feature: 'Monthly Operational Overhead',
      quorik: 'Fixed Affordable Stack',
      traditionalAgency: '$5,000–$15,000+/mo',
      humanCallCenter: '$3,500–$6,000/mo',
      basicChatbot: '$50–$200/mo'
    },
    {
      feature: 'Direct Calendar & CRM Sync',
      quorik: true,
      traditionalAgency: 'Extra Fee',
      humanCallCenter: 'Manual Data Entry',
      basicChatbot: 'Basic Webhooks'
    },
    {
      feature: 'Interactive Voice Lead Qualification',
      quorik: true,
      traditionalAgency: 'Varies',
      humanCallCenter: 'High Script Error Rate',
      basicChatbot: 'Limited Decision Trees'
    }
  ];

  const pageTitle = slug === 'ai-voice-agent-vs-human-receptionist'
    ? 'Website AI Voice Agent vs Human Answering Services | Quorik Comparison'
    : 'Quorik vs Traditional Web Agencies & Virtual Call Services | Comparison';

  const metaDesc = slug === 'ai-voice-agent-vs-human-receptionist'
    ? 'Compare 24/7 in-browser Website AI Voice Agents against traditional human answering services on cost, speed, and lead conversion rates.'
    : 'Compare Quorik Custom Web & AI Voice Engineering against slow legacy web development agencies and expensive manual answering services.';

  return (
    <div className="pt-24 bg-[#05060A] text-white min-h-screen">
      <SEO
        title={pageTitle}
        description={metaDesc}
        keywords="Quorik vs web agency, AI receptionist vs human answering service, custom website cost comparison, AI voice agent ROI, Quorik comparison"
        canonicalPath={slug ? `/compare/${slug}` : '/compare'}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": pageTitle,
          "description": metaDesc
        }}
      />

      {/* HERO SECTION */}
      <section className="py-20 relative noise-bg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-xs font-mono font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Competitive Architectural Comparison
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-outfit tracking-tight">
            Why Modern Businesses Choose <span className="bg-gradient-to-r from-brand-teal via-blue-400 to-indigo-400 bg-clip-text text-transparent">Quorik</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-3xl mx-auto font-sans">
            See how Quorik’s full-stack custom web engineering and sub-350ms AI voice agents outperform legacy agencies and costly human call centers across speed, cost, and conversion capability.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/compare/quorik-vs-traditional-agencies"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                slug !== 'ai-voice-agent-vs-human-receptionist'
                  ? 'bg-brand-teal text-black shadow-lg shadow-brand-teal/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              vs Legacy Web Agencies
            </Link>

            <Link
              to="/compare/ai-voice-agent-vs-human-receptionist"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                slug === 'ai-voice-agent-vs-human-receptionist'
                  ? 'bg-brand-teal text-black shadow-lg shadow-brand-teal/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              vs Human Call Centers
            </Link>
          </div>
        </div>
      </section>

      {/* COMPARISON MATRIX TABLE */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#070913]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#090C1A]">
                <th className="p-6 font-outfit font-bold text-base text-gray-300 w-1/3">Key Feature / Capability</th>
                <th className="p-6 font-outfit font-extrabold text-lg text-brand-teal bg-brand-teal/10 border-x border-brand-teal/20 text-center">
                  ✨ Quorik AI Stack
                </th>
                <th className="p-6 font-outfit font-bold text-sm text-gray-400 text-center">Legacy Web Agencies</th>
                <th className="p-6 font-outfit font-bold text-sm text-gray-400 text-center">Human Answering Services</th>
                <th className="p-6 font-outfit font-bold text-sm text-gray-400 text-center">Basic Chatbot Widgets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans text-sm">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-semibold text-white">{row.feature}</td>

                  {/* Quorik Column */}
                  <td className="p-6 text-center font-bold bg-brand-teal/5 border-x border-brand-teal/20 text-white">
                    {typeof row.quorik === 'boolean' ? (
                      row.quorik ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs">
                          <Check className="w-5 h-5 text-emerald-400" /> Yes (Included)
                        </div>
                      ) : (
                        <X className="w-5 h-5 text-rose-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-brand-teal font-mono text-xs font-bold">{row.quorik}</span>
                    )}
                  </td>

                  {/* Agency */}
                  <td className="p-6 text-center text-gray-400 text-xs">
                    {typeof row.traditionalAgency === 'boolean' ? (
                      row.traditionalAgency ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500/60 mx-auto" />
                    ) : (
                      row.traditionalAgency
                    )}
                  </td>

                  {/* Call Center */}
                  <td className="p-6 text-center text-gray-400 text-xs">
                    {typeof row.humanCallCenter === 'boolean' ? (
                      row.humanCallCenter ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500/60 mx-auto" />
                    ) : (
                      row.humanCallCenter
                    )}
                  </td>

                  {/* Chatbot */}
                  <td className="p-6 text-center text-gray-400 text-xs">
                    {typeof row.basicChatbot === 'boolean' ? (
                      row.basicChatbot ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500/60 mx-auto" />
                    ) : (
                      row.basicChatbot
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SUMMARY HIGHLIGHT BOXES */}
      <section className="py-12 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#090C19] border border-white/10 rounded-2xl p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/20 flex items-center justify-center text-brand-teal">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg font-outfit">10x Speed to Launch</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            While legacy agencies take 4 months to build a static website, Quorik delivers high-speed web infrastructure and autonomous voice AI rapidly on agreed timelines.
          </p>
        </div>

        <div className="bg-[#090C19] border border-white/10 rounded-2xl p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/20 flex items-center justify-center text-brand-teal">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg font-outfit">75% Lower Total Cost</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Convert visitors instantly with an in-browser Website AI Voice Agent operating at sub-350ms speech latency without hiring costly staff.
          </p>
        </div>

        <div className="bg-[#090C19] border border-white/10 rounded-2xl p-8 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/20 flex items-center justify-center text-brand-teal">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg font-outfit">100% Visitor Engagement</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Zero bounced inquiries, immediate natural conversation, and automated calendar bookings for every prospective client who visits your site.
          </p>
        </div>
      </section>

      <Contact />
    </div>
  );
}
