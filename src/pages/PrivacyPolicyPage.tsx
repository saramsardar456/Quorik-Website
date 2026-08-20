import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { ShieldCheck, Lock, Eye, Database, HardDrive, FileText, Mail, ArrowLeft } from 'lucide-react';

export function PrivacyPolicyPage() {
  const lastUpdated = "August 13, 2026";

  return (
    <div className="pt-28 pb-20 bg-[#05060A] text-white min-h-screen">
      <SEO
        title="Privacy Policy & Data Security | Quorik"
        description="Learn how Quorik collects, encrypts, and protects user data, voice call transcripts, and payment information with enterprise-grade SOC-2 and TLS 1.3 standards."
        keywords="Quorik privacy policy, voice AI data security, GDPR compliance, CCPA user privacy, encryption standards"
        canonicalPath="/privacy-policy"
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
            <ShieldCheck className="w-4 h-4" />
            Enterprise Data Protection & Privacy
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold font-outfit tracking-tight">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">● SOC-2 / TLS 1.3 Compliant</span>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-10 text-gray-300 font-sans text-sm leading-relaxed">
          {/* OVERVIEW */}
          <section className="bg-[#070913] border border-white/10 rounded-2xl p-6 md:p-8 space-y-3">
            <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-teal" />
              1. Our Privacy Commitment
            </h2>
            <p>
              At Quorik ("we", "our", or "us"), we take your privacy and data security seriously. This Privacy Policy details how we collect, process, encrypt, and store personal information, audio voice recordings, call transcripts, and usage metadata when you interact with our custom web solutions, AI Voice Agents, and interactive software.
            </p>
            <p>
              We operate under a strict policy: <strong className="text-brand-teal">We never sell, rent, or monetize your personal data or caller voice transcripts to third-party ad networks or data brokers.</strong>
            </p>
          </section>

          {/* DATA WE COLLECT */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-teal" />
              2. Information We Collect
            </h2>
            <div className="space-y-3 pl-4 border-l-2 border-brand-teal/30">
              <div>
                <h3 className="font-bold text-white text-base">A. Account & Business Data</h3>
                <p className="text-gray-400">
                  When you register for an account, request an AI Voice Agent demo, or subscribe to our web engineering packages, we collect contact details including your name, business email address, phone number, company name, and billing details.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">B. Voice Agent Audio & Call Transcripts</h3>
                <p className="text-gray-400">
                  When inbound or outbound calls are processed by Quorik Autonomous Voice Receptionists, audio streams are digitized to generate real-time text transcripts and fulfill user requests (e.g., appointment scheduling, CRM updates). You have full control to configure automatic transcript purge schedules (e.g., 7-day, 30-day, or immediate deletion).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">C. Payment & Transaction Security</h3>
                <p className="text-gray-400">
                  All credit card transactions, recurring subscriptions, and setup fee payments are handled by our secure payment gateway partner, Stripe. Quorik does not store or process raw credit card numbers on our local servers.
                </p>
              </div>
            </div>
          </section>

          {/* HOW WE USE YOUR DATA */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-brand-teal" />
              3. How We Use Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Deploying and orchestrating sub-350ms AI Voice Agent interactions and appointment calendar syncs.</li>
              <li>Executing custom CRM webhooks to route client lead inquiries directly to your team.</li>
              <li>Monitoring platform uptime, voice speech latency, and system performance.</li>
              <li>Sending transactional invoices, receipt updates, and essential service alerts.</li>
            </ul>
          </section>

          {/* SECURITY & ENCRYPTION */}
          <section className="bg-gradient-to-br from-brand-teal/10 to-blue-950/20 border border-brand-teal/30 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-teal" />
              4. Encryption & Security Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                <span className="text-brand-teal font-bold block mb-1">DATA IN TRANSIT</span>
                <p className="text-gray-300">Protected with TLS 1.3 high-grade encryption for all API connections and WebSockets.</p>
              </div>
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">DATA AT REST</span>
                <p className="text-gray-300">Stored using AES-256 cloud encryption with isolated client database schemas.</p>
              </div>
            </div>
          </section>

          {/* GDPR & CCPA RIGHTS */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-teal" />
              5. Your Rights (GDPR & CCPA)
            </h2>
            <p className="text-gray-300">
              Regardless of your physical location, Quorik grants all users full sovereign rights over their data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-white">Right to Access & Export:</strong> Request a complete JSON export of all stored account data and call logs.</li>
              <li><strong className="text-white">Right to Erasure ("Right to be Forgotten"):</strong> Request immediate, permanent deletion of your business account and all associated call transcripts.</li>
              <li><strong className="text-white">Right to Opt-Out:</strong> Unsubscribe from non-essential service updates or marketing communications at any time.</li>
            </ul>
          </section>

          {/* CONTACT PRIVACY */}
          <section className="border-t border-white/10 pt-8 space-y-3">
            <h2 className="text-xl font-bold font-outfit text-white">6. Privacy Contacts & DPO</h2>
            <p className="text-gray-400">
              If you have any questions regarding this Privacy Policy or wish to exercise your data protection rights, please contact our Data Protection Officer:
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