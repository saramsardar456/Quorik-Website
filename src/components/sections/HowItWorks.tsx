import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    title: 'We Listen',
    description: 'First, we chat about your business. We find out what you need, what problems you have, and how we can help you get more customers.'
  },
  {
    number: '02',
    title: 'We Build',
    description: 'Our team gets to work building your website or AI helper. We make sure it looks great, works perfectly on phones, and is easy to use.'
  },
  {
    number: '03',
    title: 'We Launch',
    description: 'We put your new tool online. We connect it to your email or calendar so everything works together smoothly from day one.'
  },
  {
    number: '04',
    title: 'We Support',
    description: 'We don’t just leave you after it’s built. We stick around to fix any issues, make updates, and ensure your business keeps growing.'
  }
];

export function HowItWorks() {
  return (
    <section id="process" className="py-32 bg-[#05060A] border-t border-white/5 relative noise-bg">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-24">
          <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-6">How It Works</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter uppercase leading-none max-w-2xl">
            Our Simple <br/> Process
          </h3>
        </div>

        <div className="max-w-4xl border-l border-white/10 pl-8 md:pl-16 ml-4 md:ml-8 space-y-24 relative">
          {/* Timeline Line Highlight */}
          <div className="absolute top-0 left-[-1px] w-[2px] h-32 bg-gradient-to-b from-brand-teal to-transparent" />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Dot */}
              <div className="absolute top-2 -left-[41px] md:-left-[73px] w-4 h-4 rounded-full bg-[#05060A] border-2 border-white/20 group-hover:border-brand-teal transition-colors" />
              
              <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-16 items-start">
                <div className="text-sm font-bold text-white/30 font-mono tracking-widest mt-1">
                  STEP {step.number}
                </div>
                
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tighter uppercase">{step.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-sans font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
