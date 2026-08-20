import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Scale, FileText, ShieldAlert, Cpu, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

export function TermsOfServicePage() {
  const lastUpdated = "August 13, 2026";

  return (
    <div className="pt-28 pb-20 bg-[#05060A] text-white min-h-screen">
      <SEO
        title="Terms of Service & AI Voice Compliance | Quorik"
        description="Read Quorik's legal Terms of Service, TCPA voice agent compliance requirements, client intellectual property ownership rights, and service agreements."
        keywords="Quorik terms of service, AI voice agent compliance, TCPA call regulations, custom code ownership"
        canonicalPath="/terms-of-service"
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
            <Scale className="w-4 h-4" />
            Legal Agreement & Service Conditions
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold font-outfit tracking-tight">
            Terms of Service
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">● Client Code Ownership Guaranteed</span>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-10 text-gray-300 font-sans text-sm leading-relaxed">
          {/* 1. ACCEPTANCE */}
          <section className="bg-[#070913] border border-white/10 rounded-2xl p-6 md:p-8 space-y-3">
            <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-teal" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing Quorik websites, subscribing to our AI Voice Agent services, or commissioning custom web engineering work, you agree to be legally bound by these Terms of Service. If you are entering into this agreement on behalf of a company or entity, you confirm that you possess full legal authority to bind that organization.
            </p>
          </section>

          {/* 2. AI VOICE & TELEPHONY COMPLIANCE */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-teal" />
              2. Acceptable Use & Voice AI Compliance (TCPA & Telephony)
            </h2>
            <p className="text-gray-300">
              Quorik provides high-performance voice speech models operating at sub-350ms latency. Users are strictly required to comply with all applicable telecommunications laws, including the Telephone Consumer Protection Act (TCPA), GDPR caller consent mandates, and local call disclosure laws:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">Zero Spam / Unsolicited Robocalls:</strong> Voice AI agents must not be used to transmit illegal, deceptive, or unsolicited commercial marketing calls.</li>
              <li><strong className="text-white">Caller Consent & Disclosures:</strong> You agree to provide proper automated disclosures where required by local law informing callers that an AI voice assistant is aiding the call.</li>
              <li><strong className="text-white">Account Suspension:</strong> Quorik reserves the right to immediately terminate voice line provisioning if a user engages in fraudulent or abusive calling practices.</li>
            </ul>
          </section>

          {/* 3. INTELLECTUAL PROPERTY & CODE OWNERSHIP */}
          <section className="bg-gradient-to-br from-brand-teal/10 to-blue-950/20 border border-brand-teal/30 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-teal" />
              3. Client Code Ownership & Proprietary IP
            </h2>
            <p className="text-gray-200">
              Unlike locked proprietary site builders, <strong className="text-white underline decoration-brand-teal">clients retain 100% full intellectual property ownership of all custom frontend source code, visual designs, and branded assets</strong> engineered by Quorik upon final project settlement.
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Quorik retains ownership of underlying core platform frameworks, proprietary voice orchestration algorithms, and foundational infrastructure code templates.
            </p>
          </section>

          {/* 4. PAYMENT & SUBSCRIPTION TERMS */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-teal" />
              4. Payment Processing & Recurring Subscriptions
            </h2>
            <p className="text-gray-300">
              All subscription fees, voice usage minutes, and custom deployment deposits are billed via Stripe. Payments are due at the start of each monthly or annual billing cycle. You agree to maintain valid payment method details on file.
            </p>
          </section>

          {/* 5. LIMITATION OF LIABILITY */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold font-outfit text-white">5. Limitation of Liability</h2>
            <p className="text-gray-400 leading-relaxed text-xs">
              To the maximum extent permitted by applicable law, Quorik shall not be liable for any indirect, incidental, special, or consequential damages resulting from lost profits, service interruptions, or third-party telephony outage delays. Our total liability for any claim shall not exceed the amount paid by you to Quorik in the preceding 12 months.
            </p>
          </section>

          {/* 6. LEGAL CONTACT */}
          <section className="border-t border-white/10 pt-8 space-y-3">
            <h2 className="text-xl font-bold font-outfit text-white">6. Legal & Compliance Inquiries</h2>
            <p className="text-gray-400">
              For legal notices, contract inquiries, or compliance questions regarding our Terms of Service, please contact us:
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-brand-teal font-mono text-xs">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@quoriksystems.com" className="hover:underline">info@quoriksystems.com</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
