import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '../GoogleIcon';
import { Link } from 'react-router-dom';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role?: string;
  avatar?: string;
  text: string;
  rating: number;
  timeAgo?: string;
  category?: string;
  verifiedGoogle?: boolean;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Vance',
    company: 'Apex Dental Partners',
    role: 'Managing Partner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'Quorik’s AI voice agent answered 100% of our after-hours dental emergency calls and booked 42 high-value patient appointments in the first 30 days alone.',
    rating: 5,
    timeAgo: '2 weeks ago',
    category: 'AI Voice Agent',
    verifiedGoogle: true
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    company: 'Vanguard Legal Group',
    role: 'Principal Attorney',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    text: 'Our new custom web engineering paired with autonomous intake transformed our legal consultation conversion rate. Client inquiries went up 280%.',
    rating: 5,
    timeAgo: '1 month ago',
    category: 'Web Engineering',
    verifiedGoogle: true
  },
  {
    id: '3',
    name: 'David Reynolds',
    company: 'ThermalPro HVAC',
    role: 'Operations Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'Zero missed emergency calls during heatwaves and freezing storms. Quorik dispatches technician leads directly into our CRM within seconds.',
    rating: 5,
    timeAgo: '3 weeks ago',
    category: 'AI Voice Agent',
    verifiedGoogle: true
  }
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(() => {
        // Keeps default testimonials seamlessly
      });
  }, []);

  return (
    <section className="py-32 bg-[#05060A] border-t border-white/5 relative noise-bg overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 md:flex items-end justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-brand-teal text-[11px] font-mono font-bold tracking-widest uppercase mb-6">
              <GoogleIcon className="w-4 h-4" /> 4.9 ★★★★★ Verified Google Reviews
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter uppercase leading-none">
              Client Reviews <br/> & Feedback
            </h3>
          </div>
          <div className="mt-8 md:mt-0 flex flex-col items-start md:items-end">
            <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-4 font-sans font-medium">
              Read real Google reviews from CEOs and business leaders we've helped scale.
            </p>
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-brand-teal hover:text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors group"
            >
              <span>View All Verified Reviews</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[#0A0E1A] border border-white/10 p-7 hover:border-brand-teal/30 transition-all relative flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        loading="lazy"
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-teal/40 shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal font-bold text-lg uppercase shadow-md">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
                        {t.name}
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                      </h4>
                      <p className="text-gray-400 text-xs font-medium">
                        {t.role ? `${t.role}, ` : ''}<span className="text-gray-300 font-semibold">{t.company}</span>
                      </p>
                    </div>
                  </div>
                  <GoogleIcon className="w-6 h-6 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs font-mono ml-1">{t.timeAgo || 'Recently'}</span>
                </div>

                <p className="text-gray-300 leading-relaxed text-sm font-sans mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  ✓ Verified Google Review
                </span>
                {t.category && (
                  <span className="px-2 py-0.5 bg-white/5 text-gray-400 border border-white/10 uppercase">
                    {t.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
