import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'Custom Websites',
    description: 'We build fast, beautiful websites that help your business grow. Whether you need a simple landing page or a full web app, we make sure it works perfectly.',
    features: [
      'Custom Code & Design',
      'Online Payments',
      'Easy-to-use Dashboards',
      'Automatic Emails'
    ]
  },
  {
    id: '02',
    title: 'Smart Chatbots',
    description: 'Add a smart AI assistant to your website. It talks to your visitors instantly, answers their questions, and collects their contact info for you 24/7.',
    features: [
      'Learns Your Business',
      'Finds Good Customers',
      'Connects to Your Tools',
      'Help Customers Anytime'
    ]
  },
  {
    id: '03',
    title: 'AI Voice Assistant',
    description: 'Let visitors talk directly to your website 24/7. Our web AI voice agent listens and speaks like a real concierge, booking appointments, answering questions, and capturing leads seamlessly.',
    features: [
      '24/7 Web AI Voice Concierge',
      'Instant Interactive Speech (< 350ms)',
      'Instant WhatsApp & SMS Confirmations',
      'Urdu & Regional Persona Switcher'
    ]
  }
];

export function Services() {
  return (
    <section id="services" className="py-32 bg-[#05060A] border-t border-white/5 relative noise-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 md:flex items-end justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-6">Our Services</h2>
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase leading-none">
              What <br/> We Do
            </h3>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm mt-8 md:mt-0 font-sans font-medium">
            Simple, powerful tools to help your business run better and make more money.
          </p>
        </div>

        <div className="space-y-0 border-t border-white/10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group border-b border-white/10 py-12 md:py-16 grid md:grid-cols-[100px_1fr_1fr] gap-8 md:gap-16 items-start relative hover:bg-white/[0.02] transition-colors -mx-6 px-6"
            >
              <div className="text-2xl font-bold text-brand-teal font-display tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">
                {service.id}
              </div>
              
              <div>
                <h4 className="text-3xl md:text-4xl font-bold text-white tracking-tighter uppercase mb-6 group-hover:text-brand-blue transition-colors">
                  {service.title}
                </h4>
                <p className="text-gray-400 leading-relaxed font-sans font-medium mb-8">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-col h-full justify-between pt-2">
                <ul className="space-y-4 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0 group-hover:bg-brand-teal transition-colors" />
                      <span className="text-sm font-sans font-medium text-gray-300 uppercase tracking-wider">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="inline-flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Explore Service <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
