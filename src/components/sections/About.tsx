import { motion } from 'motion/react';
import { Linkedin, ArrowUpRight } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-32 bg-[#0F1423] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              We believe <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-teal">every customer matters.</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
              <p>
                At Quorik, we know that people want quick answers. Many businesses lose money simply because they couldn't pick up the phone or reply to an email fast enough.
              </p>
              <p>
                We help you fix this. We build great websites and set up smart AI helpers so your business is always open, always friendly, and always ready to help your customers.
              </p>
            </div>
            <div className="pt-6 border-t border-white/5">
              <p className="text-white font-semibold text-lg tracking-tight">Our Promise to You</p>
              <p className="text-brand-teal text-sm mt-1.5 font-medium">Great Service & Real Results</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-teal rounded-[32px] blur-2xl opacity-10" />
            <div className="relative bg-[#0A0E1A] border border-white/5 p-10 md:p-14 rounded-[32px]">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-10 border border-white/10">
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-10 tracking-tight">
                "We build tools that make your life easier and help your business make more money. Your technology should work harder than you do."
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold text-base tracking-tight">Shehram Meellu</p>
                  <p className="text-brand-teal text-xs font-semibold uppercase tracking-wider mt-0.5">Founder & CEO, Quorik</p>
                </div>
                <a
                  href="https://www.linkedin.com/in/shehram-meellu-218812370"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-xs font-mono text-gray-300 hover:text-white hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/20 transition-all duration-200 group"
                  aria-label="Shehram Meellu LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                  <span>Connect on LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-[#0A66C2] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
