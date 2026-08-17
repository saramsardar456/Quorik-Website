import { useState, useEffect } from 'react';
import { Logo } from '../Logo';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency, CURRENCIES, CurrencyCode } from '../../context/CurrencyContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  
  const { currency, currencyConfig, setCurrency } = useCurrency();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Voice Agent', href: '/voice-agent' },
    { name: 'Industries', href: '/industry' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Services', href: '/services' },
    { name: 'Work', href: '/work' },
    { name: 'Compare', href: '/compare' },
    { name: 'Process', href: '/process' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#05060A]/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                className="text-[10px] font-bold text-white/60 hover:text-white uppercase tracking-widest transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Currency Selector */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold font-mono text-gray-200 transition-colors"
                title="Change Global Currency"
              >
                <span>{currencyConfig.flag}</span>
                <span>{currencyConfig.code}</span>
                <ChevronDown className={`w-3 h-3 text-brand-teal transition-transform duration-200 ${isCurrencyMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-[#0A0E1A] border border-white/15 rounded-xl p-1.5 shadow-2xl z-50 space-y-0.5">
                  <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-400 border-b border-white/5 mb-1">
                    Select Currency
                  </div>
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                    const item = CURRENCIES[code];
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 text-left rounded-lg flex items-center justify-between text-xs transition-colors ${
                          currency === code 
                            ? 'bg-brand-teal/20 text-brand-teal font-bold border border-brand-teal/30' 
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{item.flag}</span>
                          <span>{item.code}</span>
                        </span>
                        <span className="font-mono text-[10px] text-gray-400">{item.symbol.trim()}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Link 
              to="/contact"
              className="px-5 py-2.5 bg-white hover:bg-gray-100 text-[#07090F] text-[10px] font-bold uppercase tracking-widest transition-colors ml-1"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu & Currency Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold font-mono text-gray-200"
            >
              <span>{currencyConfig.flag}</span>
              <span>{currencyConfig.code}</span>
            </button>

            <button 
              className="text-white/50 hover:text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Currency Dropdown on Mobile */}
        {isCurrencyMenuOpen && (
          <div className="lg:hidden absolute top-full left-6 right-6 mt-2 bg-[#0A0E1A] border border-white/15 rounded-xl p-2 shadow-2xl z-50 space-y-1">
            <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-400 border-b border-white/5 mb-1">
              Select Currency
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                const item = CURRENCIES[code];
                return (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setIsCurrencyMenuOpen(false);
                    }}
                    className={`p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      currency === code 
                        ? 'bg-brand-teal/20 text-brand-teal font-bold border border-brand-teal/30' 
                        : 'text-gray-300 bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{item.flag}</span>
                      <span>{item.code}</span>
                    </span>
                    <span className="font-mono text-[10px] text-gray-400">{item.symbol.trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#05060A] border-b border-white/5 py-6 px-6 flex flex-col gap-5 shadow-2xl backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] font-bold text-white/60 hover:text-white uppercase tracking-widest transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center px-6 py-3.5 mt-1 bg-white text-[#07090F] text-[11px] font-bold uppercase tracking-widest transition-colors"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
