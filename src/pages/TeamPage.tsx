import { TeamShowcase } from '../components/sections/TeamShowcase';
import { Testimonials } from '../components/sections/Testimonials';
import { SEO } from '../components/SEO';
import { ShieldCheck, Cpu, Code2, Users2, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TeamPage() {
  return (
    <div className="pt-20">
      <SEO
        title="Quorik Leadership & Engineering Team - Founder Shehram Meellu & Technical Council"
        description="Meet the core 5 specialists at Quorik Systems: Founder & CEO Shehram Meellu, Tech Director M.R., Voice Solutions Lead A.K., Systems Ops Farhaj, and Integration Lead D.C."
        keywords="Quorik team, Shehram Meellu, M.R. tech director, A.K. voice solutions, Farhaj systems ops, D.C. integration lead, AI voice engineering agency"
        canonicalPath="/team"
      />

      {/* Page Hero */}
      <section className="relative py-20 md:py-28 bg-[#05060A] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-blue/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-mono tracking-widest uppercase">
            <Users2 className="w-3.5 h-3.5" />
            <span>Company Leadership & Roster</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            The Masterminds Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-teal to-cyan-400">
              Autonomous Systems & Web Intelligence
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Led by Founder & CEO Shehram Meellu alongside a council of seasoned technical directors, we engineer bespoke digital platforms and zero-latency voice receptionists that redefine customer engagement.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white">5</p>
              <p className="text-xs font-mono text-brand-teal uppercase mt-1">Core Council Specialists</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white">100%</p>
              <p className="text-xs font-mono text-brand-teal uppercase mt-1">In-House Engineering</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white">&lt;800ms</p>
              <p className="text-xs font-mono text-brand-teal uppercase mt-1">Voice AI Turn Latency</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-white">99.99%</p>
              <p className="text-xs font-mono text-brand-teal uppercase mt-1">Cloud Reliability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Team Showcase Component */}
      <TeamShowcase isFullPage={true} />

      {/* Core Company Values */}
      <section className="py-24 bg-[#0A0E1A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-brand-teal font-semibold">
              The Quorik Standard
            </h3>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineering Values We Live By
            </h2>
            <p className="text-sm text-gray-400">
              How our team operates every day across all client deliverables.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#05060A] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                <Code2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Zero Technical Debt</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                We write strictly typed, modern TypeScript and robust backend architectures designed for enterprise longevity and instant scalability.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#05060A] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Zero-Latency Mindset</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Whether web asset rendering or neural voice turn responses, microsecond speed is prioritized across all layers of our stack.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#05060A] border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Founder Accountability</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every project is personally audited and guaranteed by Founder & CEO Shehram Meellu and our principal technical council.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}
