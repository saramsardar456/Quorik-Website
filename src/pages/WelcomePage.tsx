import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Calendar, Mail, Building2, Sparkles, UserCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function WelcomePage() {
  const [searchParams] = useSearchParams();
  const rawTier = searchParams.get('tier') || 'Starter';
  const tierDisplay = rawTier.charAt(0).toUpperCase() + rawTier.slice(1);

  return (
    <div className="pt-28 pb-20 bg-[#05060A] text-white min-h-screen relative noise-bg overflow-hidden">
      <SEO
        title="Welcome to Quorik | Consultation & Onboarding"
        description="Welcome to Quorik. Let's build your AI voice agent and automated infrastructure."
        canonicalPath="/welcome"
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Main Card */}
          <div className="bg-[#0A0E1A] border border-brand-teal/40 p-6 sm:p-10 shadow-2xl relative">
            
            {/* Header Status */}
            <div className="text-center pb-8 border-b border-white/10">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[11px] font-mono font-bold tracking-widest uppercase mb-3">
                <UserCheck className="w-3.5 h-3.5" /> Quorik Enterprise Onboarding
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white uppercase font-display">
                Welcome to Quorik
              </h1>

              <p className="text-gray-300 text-sm sm:text-base mt-3 max-w-lg mx-auto">
                Thank you for your interest in <span className="text-brand-teal font-semibold">Quorik</span>.
                Our team is ready to architect and deploy your customized AI voice infrastructure.
              </p>
            </div>

            {/* What's Next Section */}
            <div className="py-8 border-b border-white/10 space-y-4">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-teal flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Next Steps & Architecture Plan
              </h2>

              <div className="bg-[#05060A] border border-white/10 p-5 text-gray-300 text-sm leading-relaxed">
                <p>
                  Our engineering team will connect with you to review your tech requirements, phone integrations, and custom CRM triggers.
                </p>
                <div className="mt-4 pt-4 border-t border-white/5 grid sm:grid-cols-2 gap-3 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-teal font-bold">1.</span> Intake & Architecture Discovery
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-teal font-bold">2.</span> AI Voice Persona & Script Tuning
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-teal font-bold">3.</span> Custom CRM & API Integrations
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-teal font-bold">4.</span> Live Testing & Deployment
                  </div>
                </div>
              </div>
            </div>

            {/* Support & Business Information */}
            <div className="pt-6 grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#05060A] border border-white/10 p-4 flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <div>
                  <span className="text-gray-500 uppercase block text-[10px]">Direct Contact:</span>
                  <a href="mailto:info@quoriksystems.com" className="text-white hover:text-brand-teal transition-colors font-semibold">
                    info@quoriksystems.com
                  </a>
                </div>
              </div>

              <div className="bg-[#05060A] border border-white/10 p-4 flex items-center gap-3">
                <Building2 className="w-4 h-4 text-brand-teal shrink-0" />
                <div>
                  <span className="text-gray-500 uppercase block text-[10px]">Organization:</span>
                  <span className="text-white font-semibold">Quorik AI Systems</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/20"
            >
              <Calendar className="w-4 h-4" /> Book Consultation Call
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 text-white font-bold text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              Return Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
