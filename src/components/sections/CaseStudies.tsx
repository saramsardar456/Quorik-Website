import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, CheckCircle2, Sparkles, Building, ShoppingBag, Activity, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CaseStudy {
  id: string;
  client: string;
  category: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
  keyFeatures: string[];
  techStack: string[];
  heroImage: string;
  galleryImages: string[];
  icon: typeof Building;
}

const studies: CaseStudy[] = [
  {
    id: 'lumina-real-estate',
    client: 'Lumina Luxury Real Estate',
    category: 'Web AI Voice Agent & Custom Portal',
    title: 'Automating Property Inquiries & Site Viewings',
    shortDescription: 'We deployed a 24/7 Web AI Voice Agent & custom interactive property portal that qualifies buyers and books site viewings automatically.',
    fullDescription: 'Lumina Luxury Real Estate struggled with high-volume off-peak website traffic from international investors who wanted immediate property specifications and viewing schedules. Quorik engineered a custom responsive web portal integrated with a zero-latency Web AI Voice Assistant.',
    challenge: 'Over 40% of prospective luxury homebuyers visited the website after business hours. Standard contact forms resulted in a 24-hour response delay, causing high lead drop-off and lost listing opportunities.',
    solution: 'Quorik built a custom React web platform with an embedded 24/7 Web AI Voice Assistant capable of answering property pricing in Urdu and English, checking agent calendar availability, and dispatching instant WhatsApp summaries.',
    metrics: [
      { label: 'Increase in Booked Showings', value: '34%' },
      { label: 'Instant Visitor Engagement', value: '100%' },
      { label: 'Weekly Hours Saved for Agents', value: '14 hrs' }
    ],
    keyFeatures: [
      '24/7 Web AI Voice Agent with Bilingual (Urdu & English) speech',
      'Real-time Google Calendar & Outlook appointment syncing',
      'Instant WhatsApp lead summary dispatch to sales agents',
      'Interactive floorplan viewer & 3D virtual tour portal integration'
    ],
    techStack: ['React 18', 'Tailwind CSS', 'Gemini AI Voice Pipeline', 'Node.js Express', 'WhatsApp Cloud API'],
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    icon: Building
  },
  {
    id: 'apex-ecommerce',
    client: 'Apex E-Commerce Storefront',
    category: 'Custom Website & Conversational AI',
    title: 'Next-Gen Digital Storefront & Sales AI',
    shortDescription: 'A complete custom website overhaul coupled with an intelligent AI sales chatbot that recommends products and automates customer support.',
    fullDescription: 'Apex E-Commerce needed a modern high-speed custom web storefront that could handle thousands of daily shoppers and guide them through complex product selections using conversational AI.',
    challenge: 'Legacy e-commerce platform suffered from 3.8s page load times and abandoned carts due to lack of immediate product support during evening peak shopping hours.',
    solution: 'Quorik designed and built a headless React custom web storefront with sub-second loading speeds, paired with a custom trained Gemini AI Chatbot widget that acts as a virtual personal shopper.',
    metrics: [
      { label: 'E-Commerce Conversion Rate', value: '+21%' },
      { label: 'Support Queries Automated', value: '85%' },
      { label: 'Average Page Load Time', value: '< 0.8s' }
    ],
    keyFeatures: [
      'Custom high-performance web storefront architecture',
      'AI-powered product finder & personalized recommendation engine',
      'Automated order tracking & instant return request processing',
      'Multi-currency & localized language support'
    ],
    techStack: ['TypeScript', 'Vite React', 'Gemini 2.5 Flash API', 'Stripe Payments', 'Tailwind CSS'],
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80'
    ],
    icon: ShoppingBag
  },
  {
    id: 'nexus-healthcare',
    client: 'Nexus Healthcare Network',
    category: 'Web App Development & Patient Portal',
    title: 'Modernizing Patient Portals & Clinical Booking',
    shortDescription: 'We built a fast, accessible patient web portal and AI booking receptionist that eliminated phone queues and streamlined medical appointments.',
    fullDescription: 'Nexus Healthcare Network operated across multiple clinics, but faced patient frustration over busy phone lines and slow online appointment booking.',
    challenge: 'Patients spent an average of 12 minutes on hold trying to schedule specialist visits or retrieve clinical lab reports.',
    solution: 'Quorik engineered a secure, HIPAA-compliant patient web portal with an integrated AI voice and chat concierge that guides patients to available specialist slots in seconds.',
    metrics: [
      { label: 'Active Monthly Patients', value: '50,000+' },
      { label: 'Reduction in Queue Hold Times', value: '92%' },
      { label: 'Platform Infrastructure Uptime', value: '99.99%' }
    ],
    keyFeatures: [
      'HIPAA & GDPR compliant secure portal infrastructure',
      'Voice & text driven medical appointment booking',
      'Automated SMS & WhatsApp appointment reminder dispatches',
      'Doctor schedule management & electronic health record sync'
    ],
    techStack: ['React', 'Express Node.js', 'PostgreSQL Cloud SQL', 'Twilio SMS', 'Tailwind CSS'],
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80'
    ],
    icon: Activity
  },
  {
    id: 'vance-capital',
    client: 'Vance Capital Group',
    category: 'Enterprise Web Platform & AI Workflow',
    title: 'Automated Lead Qualification & CRM Sync',
    shortDescription: 'Engineered a custom financial advisory platform with real-time AI lead qualification, document parsing, and automated CRM routing.',
    fullDescription: 'Vance Capital required an enterprise web system to handle high-net-worth investor applications, qualify leads instantly based on portfolio size, and route them to designated senior advisors.',
    challenge: 'Manual application processing resulted in 48-hour delays before high-value leads received personal follow-ups.',
    solution: 'Quorik built a custom client portal with an embedded AI Voice Assistant that qualifies investors, parses initial documentation, and instantly syncs data with Salesforce CRM.',
    metrics: [
      { label: 'Lead Response Time', value: '< 15 sec' },
      { label: 'Increase in Qualified Pipeline', value: '42%' },
      { label: 'Advisor Administrative Time Saved', value: '25 hrs/wk' }
    ],
    keyFeatures: [
      'Custom investor onboarding web portal',
      'AI Document parsing & automated eligibility verification',
      'Salesforce & HubSpot bidirectional CRM integration',
      'Encrypted client communications vault'
    ],
    techStack: ['React 18', 'Node.js', 'Gemini AI', 'Salesforce REST API', 'Tailwind CSS'],
    heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    icon: Briefcase
  }
];

export function CaseStudies() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  return (
    <section className="py-32 bg-[#05060A] border-t border-white/5 relative noise-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 md:flex items-end justify-between relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-6">Our Portfolio & Impact</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter uppercase leading-none max-w-2xl">
              Recent <br/> Case Studies
            </h3>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm mt-8 md:mt-0 font-sans font-medium">
            Discover how our custom web applications, AI Chatbots, and Voice Agents transform business operations and recover lost revenue.
          </p>
        </div>

        <div className="space-y-24 relative z-10">
          {studies.map((study, index) => {
            const IconComp = study.icon;
            return (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                {/* Project Image Card with Hover Effects */}
                <div 
                  onClick={() => setSelectedStudy(study)}
                  className={`w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 group-hover:border-brand-teal/50 transition-all duration-500 relative bg-[#0A0E1A] ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={study.heroImage} 
                      alt={study.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    
                    {/* Floating Overlay Badge */}
                    <div className="absolute top-4 left-4 bg-[#05060A]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <IconComp className="w-3.5 h-3.5 text-brand-teal" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">{study.category}</span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-brand-teal text-[#05060A] font-mono font-bold text-[11px] px-3 py-1.5 uppercase tracking-wider flex items-center gap-1.5 rounded group-hover:bg-white transition-colors">
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                
                {/* Text Content Area */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest font-mono">{study.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">{study.client}</span>
                  </div>
                  
                  <h4 
                    onClick={() => setSelectedStudy(study)}
                    className="text-3xl md:text-4xl font-bold text-white tracking-tighter uppercase mb-6 group-hover:text-brand-teal transition-colors cursor-pointer"
                  >
                    {study.title}
                  </h4>
                  
                  <p className="text-gray-400 leading-relaxed font-sans font-medium mb-8 text-base md:text-lg">
                    {study.shortDescription}
                  </p>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pt-6 border-t border-white/10">
                    {study.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col gap-1 bg-white/5 p-3 rounded border border-white/5">
                        <span className="text-brand-teal font-bold text-xl leading-none flex items-center gap-1 font-mono">
                          {metric.value}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide font-mono mt-1">{metric.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedStudy(study)}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-teal uppercase tracking-widest hover:text-white transition-colors w-fit bg-brand-teal/10 border border-brand-teal/30 px-4 py-2.5 rounded"
                  >
                    <span>Read Full Case Study Details</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* DETAILED CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0E1A] border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl relative shadow-2xl text-white my-auto"
            >
              {/* Modal Sticky Header */}
              <div className="sticky top-0 z-20 bg-[#0A0E1A]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-brand-teal uppercase font-bold tracking-widest block">{selectedStudy.client}</span>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-white">{selectedStudy.category}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudy(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 space-y-8 font-sans">
                {/* Hero Image Banner */}
                <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-white/10">
                  <img src={selectedStudy.heroImage} alt={selectedStudy.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white drop-shadow-md">
                      {selectedStudy.title}
                    </h2>
                  </div>
                </div>

                {/* Metrics Highlight Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#05060A] border border-white/10 p-4 rounded-xl">
                  {selectedStudy.metrics.map((metric, i) => (
                    <div key={i} className="text-center p-3 border-r border-white/5 last:border-0">
                      <div className="text-2xl font-bold text-brand-teal font-mono">{metric.value}</div>
                      <div className="text-[11px] text-gray-400 font-mono uppercase mt-1">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Challenge & Solution Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#05060A] border border-white/10 p-6 rounded-xl">
                    <div className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400" /> The Challenge
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedStudy.challenge}
                    </p>
                  </div>

                  <div className="bg-[#05060A] border border-brand-teal/30 p-6 rounded-xl bg-brand-teal/5">
                    <div className="text-xs font-mono font-bold uppercase tracking-widest text-brand-teal mb-2 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" /> Quorik Solution
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {selectedStudy.solution}
                    </p>
                  </div>
                </div>

                {/* Key Delivered Features */}
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-widest mb-4">
                    Delivered System Features
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedStudy.keyFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 bg-[#05060A] border border-white/5 p-3 rounded-lg text-xs text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-widest mb-3">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudy.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-brand-teal font-mono text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Gallery Images */}
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-widest mb-4">
                    Interface & Platform Visuals
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedStudy.galleryImages.map((img, i) => (
                      <div key={i} className="aspect-[16/10] rounded-lg overflow-hidden border border-white/10 bg-[#05060A] relative">
                        <img 
                          src={img} 
                          alt={`${selectedStudy.title} visual ${i + 1}`} 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback to high quality tech/dashboard unsplash image if image load fails
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer CTA */}
                <div className="bg-gradient-to-r from-brand-teal/20 to-brand-blue/20 border border-brand-teal/40 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <h4 className="text-base font-bold uppercase tracking-tight text-white">Want similar automated results for your business?</h4>
                    <p className="text-xs text-gray-300 font-sans mt-1">Book a 15-minute project consultation with Quorik's web & AI engineers.</p>
                  </div>
                  <Link
                    to="/contact"
                    onClick={() => setSelectedStudy(null)}
                    className="px-6 py-3 bg-brand-teal text-[#05060A] font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors shrink-0 rounded"
                  >
                    Start Your Project
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
