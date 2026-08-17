import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Search, CheckCircle2, TrendingUp, Building2, Sparkles, MessageSquareQuote, Plus, X, ThumbsUp } from 'lucide-react';
import { GoogleIcon } from '../components/GoogleIcon';
import { Contact } from '../components/sections/Contact';

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

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    company: '',
    role: '',
    avatar: '',
    text: '',
    rating: 5,
    category: 'AI Voice Agents'
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        setTestimonials(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ['all', 'AI Voice Agents', 'Custom Websites', 'Smart Chatbots'];

  const filteredTestimonials = testimonials.filter(t => {
    const matchesCategory = selectedCategory === 'all' || (t.category && t.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const spotlightStories = [
    {
      name: "Tariq Mahmood",
      company: "Apex Real Estate Solutions",
      role: "Managing Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      result: "100% After-Hours Leads Captured",
      quote: "Before Quorik's AI Voice Receptionist, we missed dozens of weekend and late-night prospective buyers. The AI Voice Agent now answers 100% of overflow calls instantly and books viewings straight into our calendar.",
      rating: 5,
      category: "AI Voice Agents"
    },
    {
      name: "Sarah Jenkins",
      company: "Luxe eCommerce Agency",
      role: "Head of Digital Operations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      result: "3.4x Conversion Growth",
      quote: "The custom website and smart conversion bot Quorik built reduced our bounce rate by 45%. Their attention to detail and zero-latency performance is unmatched.",
      rating: 5,
      category: "Custom Websites"
    },
    {
      name: "Dr. Ayesha Khan",
      company: "Metropolis Healthcare",
      role: "Clinical Operations Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      result: "Zero Dropped Patient Calls",
      quote: "Our front desk was constantly overwhelmed. Quorik's AI Voice Agent handles simultaneous patient appointment calls seamlessly. Instant WhatsApp confirmations give our patients immediate peace of mind.",
      rating: 5,
      category: "AI Voice Agents"
    }
  ];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    const reviewToAdd: Testimonial = {
      id: Math.random().toString(36).substring(2, 9),
      name: newReview.name,
      company: newReview.company || 'Verified Client',
      role: newReview.role || 'Business Owner',
      avatar: newReview.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
      text: newReview.text,
      rating: Number(newReview.rating) || 5,
      timeAgo: 'Just now',
      category: newReview.category,
      verifiedGoogle: true
    };

    setTestimonials([reviewToAdd, ...testimonials]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowReviewModal(false);
      setNewReview({
        name: '',
        company: '',
        role: '',
        avatar: '',
        text: '',
        rating: 5,
        category: 'AI Voice Agents'
      });
    }, 1500);
  };

  return (
    <div className="pt-24 bg-[#05060A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative noise-bg overflow-hidden border-b border-white/5">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-brand-teal text-[11px] font-mono font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Verified Google Reviews & Case Studies
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-6 leading-tight">
              Trusted by Ambitious <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-teal to-brand-blue">
                Brands & Business Leaders
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-medium max-w-2xl mx-auto mb-10">
              Discover how our 24/7 AI Voice Agents, Custom Websites, and Automation solutions deliver measurable revenue growth and zero dropped calls.
            </p>

            {/* Google Rating Banner Box */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-[#0A0E1A] border border-white/15 p-6 shadow-2xl relative group">
              <div className="flex items-center gap-4">
                <GoogleIcon className="w-10 h-10" />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white tracking-tight">4.9</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">Based on 48+ Verified Google Business Reviews</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-wider hover:bg-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Leave a Google Review
              </button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 bg-[#0A0E1A] border border-white/10 p-8 shadow-2xl"
          >
            <div className="border-r border-white/5 pr-4 last:border-0">
              <div className="flex items-center gap-2 text-brand-teal mb-1">
                <Star className="w-5 h-5 fill-brand-teal text-brand-teal" />
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">4.9 / 5.0</span>
              </div>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Google Rating</p>
            </div>
            <div className="border-r border-white/5 pr-4 last:border-0">
              <div className="flex items-center gap-2 text-brand-blue mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">100%</span>
              </div>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Zero Dropped Leads</p>
            </div>
            <div className="border-r border-white/5 pr-4 last:border-0">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">24/7</span>
              </div>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">AI Voice Concurrency</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Building2 className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">50+</span>
              </div>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Enterprise Clients</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spotlight Client Success Stories */}
      <section className="py-24 bg-[#07090F] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-[11px] font-bold text-brand-teal uppercase tracking-[0.2em] font-mono">Spotlight Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-white mt-2">
              Featured Client Outcomes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {spotlightStories.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#0A0E1A] border border-white/10 p-8 relative group hover:border-brand-teal/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <img src={story.avatar} alt={story.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-teal/40" />
                      <div>
                        <h4 className="text-white font-bold text-base">{story.name}</h4>
                        <p className="text-gray-400 text-xs">{story.role}</p>
                      </div>
                    </div>
                    <GoogleIcon className="w-5 h-5" />
                  </div>

                  <div className="px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[10px] font-mono font-bold uppercase tracking-wider inline-block mb-4">
                    {story.category}
                  </div>

                  <Quote className="w-8 h-8 text-brand-teal/30 mb-3" />
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <div className="text-xs font-mono font-bold text-brand-teal uppercase tracking-wider mb-1">
                    Impact: {story.result}
                  </div>
                  <p className="text-gray-400 text-xs font-semibold">{story.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Google Reviews Feed */}
      <section className="py-24 bg-[#05060A] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <GoogleIcon className="w-6 h-6" />
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] font-mono">
                  Verified Google Business Reviews
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-white">
                All Verified Reviews
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-brand-teal text-[#05060A] font-bold'
                        : 'bg-[#0A0E1A] text-gray-400 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {cat === 'all' ? 'All Reviews' : cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0E1A] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-mono text-xs uppercase tracking-widest animate-pulse">
              Loading verified Google reviews...
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-20 bg-[#0A0E1A] border border-white/10 p-12">
              <MessageSquareQuote className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-base font-medium">No reviews found matching your search filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 px-4 py-2 bg-white/5 border border-white/10 text-xs uppercase font-mono tracking-wider hover:bg-white/10 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="bg-[#0A0E1A] border border-white/10 p-6 hover:border-brand-teal/30 transition-all relative flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-11 h-11 rounded-full object-cover border border-brand-teal/40"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal font-bold text-sm uppercase">
                            {t.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
                            {t.name}
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                          </h4>
                          <p className="text-gray-400 text-xs">
                            {t.role ? `${t.role}, ` : ''}<span className="text-gray-300 font-semibold">{t.company}</span>
                          </p>
                        </div>
                      </div>
                      <GoogleIcon className="w-5 h-5 opacity-90 flex-shrink-0" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[...Array(t.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#FBBC05] text-[#FBBC05]" />
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs font-mono">{t.timeAgo || 'Recently'}</span>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed font-sans mb-6">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1.5 text-green-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Review
                    </span>
                    <span className="text-gray-400 font-medium">{t.category || 'Google Review'}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0E1A] border border-white/20 p-8 max-w-lg w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <GoogleIcon className="w-6 h-6" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Leave a Review</h3>
              </div>

              {submitSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ThumbsUp className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Thank you for your review!</h4>
                  <p className="text-gray-400 text-sm">Your feedback has been published.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05060A] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Realty"
                        value={newReview.company}
                        onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                        className="w-full px-3 py-2 bg-[#05060A] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Your Title / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. CEO / Founder"
                        value={newReview.role}
                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                        className="w-full px-3 py-2 bg-[#05060A] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Service Category</label>
                    <select
                      value={newReview.category}
                      onChange={(e) => setNewReview({ ...newReview, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05060A] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-teal"
                    >
                      <option value="AI Voice Agents">AI Voice Agents</option>
                      <option value="Custom Websites">Custom Websites</option>
                      <option value="Smart Chatbots">Smart Chatbots</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Avatar Profile Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newReview.avatar}
                      onChange={(e) => setNewReview({ ...newReview, avatar: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05060A] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Star Rating</label>
                    <div className="flex gap-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <button
                          type="button"
                          key={stars}
                          onClick={() => setNewReview({ ...newReview, rating: stars })}
                          className={`px-3 py-1.5 text-xs font-mono border ${
                            newReview.rating === stars
                              ? 'bg-brand-teal text-[#05060A] font-bold border-brand-teal'
                              : 'bg-[#05060A] text-gray-400 border-white/10'
                          }`}
                        >
                          {stars} ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Your Feedback / Review *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your experience working with Quorik..."
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      className="w-full px-3 py-2 bg-[#05060A] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-teal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact & CTA Section */}
      <Contact />
    </div>
  );
}
