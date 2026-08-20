import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { DollarSign, ShieldCheck, RefreshCw, Clock, CheckCircle2, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export function RefundPolicyPage() {
  const lastUpdated = "August 13, 2026";

  return (
    <div className="pt-28 pb-20 bg-[#05060A] text-white min-h-screen">
      <SEO
        title="Refund Policy & Project Delivery Guarantee | Quorik"
        description="Review Quorik's transparent refund policy, agreed timeline delivery guarantee, and simple subscription cancellation policy."
        keywords="Quorik refund policy, money back guarantee, AI voice agent cancellation, web development refund terms"
        canonicalPath="/refund-policy"
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* TOP NAV BREADCRUMB */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-brand-teal transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quorik Home
        </Link>

        {/* HERO TITLE */}
        <div className="space-y-4 mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-xs font-mono font-bold uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            Fair & Transparent Billing Terms
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold font-outfit tracking-tight">
            Refund & Cancellation Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">● Agreed Timeline Delivery Guarantee Included</span>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-10 text-gray-300 font-sans text-sm leading-relaxed">
          {/* GUARANTEE CARD */}
          <section className="bg-gradient-to-br from-brand-teal/15 via-[#070913] to-blue-950/30 border border-brand-teal/40 rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-outfit text-white">Our Project Delivery Guarantee</h2>
                <p className="text-xs font-mono text-brand-teal">Risk-Free Custom Engineering</p>
              </div>
            </div>

            <p className="text-gray-200">
              We stand behind our quality, speed, and execution. If Quorik fails to deliver your fully functional custom website or AI Voice Agent within the agreed project timeline window, or if the delivered system fails to pass core functional testing, <strong className="text-white underline decoration-brand-teal">you are entitled to a 100% full refund of your initial setup deposit</strong>.
            </p>
          </section>

          {/* 1. SUBSCRIPTION CANCELLATION */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-brand-teal" />
              1. Monthly & Annual Subscription Billing
            </h2>
            <p className="text-gray-300">
              Quorik AI Voice Agent monthly plans (Starter, Growth, Enterprise) operate on a recurring billing cycle processed securely via Stripe.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
              <div className="bg-[#070913] border border-white/10 p-5 rounded-2xl space-y-2">
                <span className="text-brand-teal font-bold block text-sm">CANCEL ANYTIME</span>
                <p className="text-gray-400">
                  You may cancel your monthly subscription at any time prior to your next billing renewal date. No cancellation penalties or hidden lock-in fees apply.
                </p>
              </div>

              <div className="bg-[#070913] border border-white/10 p-5 rounded-2xl space-y-2">
                <span className="text-emerald-400 font-bold block text-sm">PRO-RATED USAGE CREDITS</span>
                <p className="text-gray-400">
                  If you cancel mid-cycle, your AI Voice Agent and phone line allocation will remain active through the end of your current paid billing period.
                </p>
              </div>
            </div>
          </section>

          {/* 2. CUSTOM ENGINEERING & SETUP FEES */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-teal" />
              2. Custom Web & AI Setup Fees
            </h2>
            <p className="text-gray-300">
              Initial setup and engineering fees cover bespoke UI design, custom voice model tuning, CRM integration webhooks, and telephony line provisioning tailored to your specific scope and agreed timeline.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-white">Pre-Kickoff Cancellation:</strong> 100% refund available if requested within 24 hours of payment before engineering work begins.</li>
              <li><strong className="text-white">Milestone Review Stage:</strong> 50% refund available if requested during initial design mockups prior to code deployment.</li>
              <li><strong className="text-white">Post-Launch & Sign-Off:</strong> Setup fees are non-refundable once custom web code and voice agents are transferred to production and accepted by the client.</li>
            </ul>
          </section>

          {/* 3. SLA UPTIME GUARANTEE REFUNDS */}
          <section className="bg-[#070913] border border-white/10 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold font-outfit text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              3. 99.9% Voice AI Uptime SLA Credits
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Quorik guarantees 99.9% uptime for voice call routing and speech synthesis servers. In the rare event of verified platform downtime exceeding 0.1% in a given calendar month, clients receive automatic pro-rated service credits applied toward their subsequent billing statement.
            </p>
          </section>

          {/* 4. HOW TO REQUEST A REFUND */}
          <section className="border-t border-white/10 pt-8 space-y-4">
            <h2 className="text-xl font-bold font-outfit text-white">4. How to Request a Refund or Cancel</h2>
            <p className="text-gray-300">
              To request a refund or modify your active subscription, simply email our team with your account email address and invoice ID:
            </p>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-teal" />
                <div>
                  <a href="mailto:info@quoriksystems.com" className="font-mono text-sm text-white font-bold block hover:text-brand-teal transition-colors">
                    info@quoriksystems.com
                  </a>
                  <span className="text-xs text-gray-400">Response time: &lt;24 hours</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all"
              >
                Contact Billing Team
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}