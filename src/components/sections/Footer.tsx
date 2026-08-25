import { Logo } from '../Logo';
import { Link } from 'react-router-dom';
import { 
  Linkedin, 
  Instagram, 
  Facebook, 
  ArrowUpRight, 
  Mail, 
  Sparkles,
  Calendar
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'LinkedIn (@quoriksystems)',
      href: 'https://www.linkedin.com/in/shehram-meellu-218812370',
      icon: Linkedin,
      hoverColor: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10',
    },
    {
      name: 'Instagram (@quoriksystems)',
      href: 'https://www.instagram.com/quoriksystems?igsh=MTNiNnI2cmZ6ZWZ1aQ==',
      icon: Instagram,
      hoverColor: 'hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10',
    },
    {
      name: 'Facebook (@quoriksystems)',
      href: 'https://www.facebook.com/share/1Eypk3khnj/',
      icon: Facebook,
      hoverColor: 'hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10',
    },
  ];

  return (
    <footer className="relative bg-[#05060A] text-gray-400 border-t border-white/[0.08] overflow-hidden">
      {/* Top subtle ambient glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-24 bg-brand-teal/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-14 border-b border-white/[0.06]">
          
          {/* Brand & Socials Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="inline-block transition-transform hover:scale-[1.02] duration-200">
              <Logo />
            </Link>

            <p className="text-gray-400 text-sm max-w-md leading-relaxed font-normal">
              Autonomous 24/7 AI Voice receptionists and ultra-fast web platforms engineered to capture leads and accelerate business growth.
            </p>

            {/* Social Media Links */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between max-w-md">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 font-medium">
                  Connect With Us
                </p>
              </div>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow Quorik on ${social.name}`}
                      className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-300 transition-all duration-300 ${social.hoverColor} group`}
                    >
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>

              {/* Direct Profile Badges */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/shehram-meellu-218812370"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-xs font-mono text-gray-300 hover:text-white hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/20 transition-all duration-200 group"
                  aria-label="Quorik Systems LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                  <span>@quoriksystems</span>
                  <ArrowUpRight className="w-3 h-3 text-[#0A66C2] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                <a
                  href="https://www.instagram.com/quoriksystems?igsh=MTNiNnI2cmZ6ZWZ1aQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E4405F]/10 border border-[#E4405F]/30 text-xs font-mono text-gray-300 hover:text-white hover:border-[#E4405F]/60 hover:bg-[#E4405F]/20 transition-all duration-200 group"
                  aria-label="Quorik Systems Instagram Profile"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#E4405F] group-hover:scale-110 transition-transform" />
                  <span>@quoriksystems</span>
                  <ArrowUpRight className="w-3 h-3 text-[#E4405F] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                <a
                  href="https://www.facebook.com/share/1Eypk3khnj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/30 text-xs font-mono text-gray-300 hover:text-white hover:border-[#1877F2]/60 hover:bg-[#1877F2]/20 transition-all duration-200 group"
                  aria-label="Quorik Systems Facebook Page"
                >
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2] group-hover:scale-110 transition-transform" />
                  <span>@quoriksystems</span>
                  <ArrowUpRight className="w-3 h-3 text-[#1877F2] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Quick Email Channels */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono">
              <a 
                href="mailto:info@quoriksystems.com" 
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-brand-teal" />
                <span>info@quoriksystems.com</span>
              </a>
              <a 
                href="mailto:sales@quoriksystems.com" 
                className="flex items-center gap-1.5 text-gray-400 hover:text-brand-teal transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                <span>sales@quoriksystems.com</span>
              </a>
            </div>
          </div>

          {/* Solutions Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-mono uppercase tracking-widest font-semibold">
              Solutions & AI
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  to="/voice-agent" 
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>AI Voice Receptionists</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-teal/10 text-brand-teal border border-brand-teal/20">Live</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/partnerships" 
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Partner Program</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">20-30%</span>
                </Link>
              </li>
              <li>
                <Link to="/industry" className="text-gray-400 hover:text-white transition-colors">
                  Industry AI Blueprints
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  Custom Edge Web Development
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing & ROI Estimator
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-gray-400 hover:text-white transition-colors">
                  Quorik vs Traditional Agencies
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-mono uppercase tracking-widest font-semibold">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/partnerships" className="text-gray-400 hover:text-brand-teal font-medium transition-colors">
                  Agency Alliances
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Quorik
                </Link>
              </li>
              <li>
                <Link to="/work" className="text-gray-400 hover:text-white transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link to="/process" className="text-gray-400 hover:text-white transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Action Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-mono uppercase tracking-widest font-semibold">
              Get Started
            </h4>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Transform your inbound pipeline with custom AI automation.
              </p>
              <Link
                to="/contact"
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white hover:shadow-lg hover:shadow-brand-teal/20 transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Call</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>© {currentYear} Quorik Technologies LLC. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-brand-teal transition-colors">
              Privacy Policy
            </Link>
            <Link to="/refund-policy" className="hover:text-brand-teal transition-colors">
              Refund Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-brand-teal transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



