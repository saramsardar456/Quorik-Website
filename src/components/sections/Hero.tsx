import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden bg-brand-navy noise-bg">
      {/* Precision grid and subtle lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-blue/20 blur-[120px] pointer-events-none rounded-full opacity-40 mix-blend-screen" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center text-center w-full max-w-5xl"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/70 text-[11px] font-bold uppercase tracking-[0.2em] mb-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            Smart Technology
          </div>
          
          <h1 className="text-[12vw] leading-[0.85] md:text-[90px] lg:text-[110px] md:leading-[0.9] font-bold text-white mb-10 tracking-tighter uppercase">
            Websites That <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Work For You</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-14 max-w-2xl leading-relaxed font-sans font-medium">
            Stop losing customers to slow replies and old websites. We build beautiful websites and smart AI helpers that grow your business.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <Link 
              to="/contact"
              className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-gray-100 text-[#07090F] text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 group border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
            <a 
              href="#demo"
              className="w-full sm:w-auto px-10 py-4 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-4 h-4 fill-current" />
              See How It Works
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
