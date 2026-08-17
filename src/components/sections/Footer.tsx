import { Logo } from '../Logo';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0E1A] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-8 text-gray-400 max-w-sm leading-relaxed text-sm">
              Building fast websites and smart AI helpers to save you time and grow your business.
            </p>
            <div className="mt-4 text-xs text-gray-300 font-mono space-y-1">
              <p>💬 WhatsApp Business: <span className="text-brand-teal font-bold">+92 370 0146156</span> <span className="text-[11px] text-gray-400 font-normal">(Messages Only)</span></p>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-tight">Services & Solutions</h4>
            <ul className="space-y-4">
              <li><Link to="/voice-agent" className="text-sm text-brand-teal font-semibold hover:text-white transition-colors">AI Voice Agent Showcase</Link></li>
              <li><Link to="/industry" className="text-sm text-brand-teal font-semibold hover:text-white transition-colors">Industry AI Solutions</Link></li>
              <li><Link to="/pricing" className="text-sm text-brand-teal font-semibold hover:text-white transition-colors">Pricing & ROI Calculator</Link></li>
              <li><Link to="/services" className="text-sm text-gray-400 hover:text-white transition-colors">Custom Websites</Link></li>
              <li><Link to="/compare" className="text-sm text-gray-400 hover:text-white transition-colors">Quorik vs Traditional Agencies</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-tight">Industries & Pages</h4>
            <ul className="space-y-3 text-xs">
              <li><Link to="/industry/dental-medical" className="text-gray-400 hover:text-brand-teal transition-colors">Dental & Medical AI</Link></li>
              <li><Link to="/industry/legal-law-firms" className="text-gray-400 hover:text-brand-teal transition-colors">Legal Intake AI</Link></li>
              <li><Link to="/industry/hvac-home-services" className="text-gray-400 hover:text-brand-teal transition-colors">HVAC & Dispatch AI</Link></li>
              <li><Link to="/industry/real-estate" className="text-gray-400 hover:text-brand-teal transition-colors">Real Estate & Showing AI</Link></li>
              <li><Link to="/industry/ecommerce-retail" className="text-gray-400 hover:text-brand-teal transition-colors">E-Commerce Voice Support</Link></li>
              <li><Link to="/industry/financial-services" className="text-gray-400 hover:text-brand-teal transition-colors">Financial Services AI</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-tight">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/work" className="text-sm text-gray-400 hover:text-white transition-colors">Our Work</Link></li>
              <li><Link to="/testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">Client Reviews</Link></li>
              <li><Link to="/process" className="text-sm text-gray-400 hover:text-white transition-colors">Process</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} Quorik Technologies. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-brand-teal transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="text-gray-400 hover:text-brand-teal transition-colors">Refund Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-brand-teal transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
