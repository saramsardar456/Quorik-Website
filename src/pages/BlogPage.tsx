import { motion } from 'motion/react';
import { ArrowUpRight, Search, Clock, Sparkles, BookOpen, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  category?: string;
  readTime?: string;
  status: 'draft' | 'published';
  image?: string;
  createdAt: string;
}

const CATEGORIES = ['All', 'Web Engineering', 'AI & Automation', 'Growth & UX', 'Systems & Workflows', 'Global AI Strategy'];

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setPosts(Array.isArray(data) ? data.filter((p: BlogPost) => p.status === 'published') : []);
        }
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0];
  const remainingPosts = selectedCategory === 'All' && !searchQuery ? filteredPosts.slice(1) : filteredPosts;

  return (
    <section className="py-28 bg-[#05060A] relative border-t border-white/5 noise-bg min-h-screen text-white font-sans">
      <SEO
        title="AI Voice Agents & Web Development Journal | Quorik Insights"
        description="In-depth articles, architectural breakdowns, and benchmarks on custom web engineering, AI voice receptionists, and conversion rate optimization."
        keywords="web engineering blog, AI voice agent tutorials, CRO strategies, business automation blog, Quorik journal"
        canonicalPath="/blog"
      />
      <div className="max-w-7xl mx-auto px-6 pt-16">
        
        {/* JOURNAL HERO HEADER */}
        <div className="mb-16 md:flex items-end justify-between border-b border-white/10 pb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-xs font-mono font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quorik Engineering Journal</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter uppercase leading-none">
              Insights & <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-white to-brand-blue">Innovations</span>
            </h1>
          </div>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-md mt-8 md:mt-0 font-medium">
            Architectural breakdowns, AI benchmarks, and growth engineering strategies from Quorik's core development team.
          </p>
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-16">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === category
                    ? 'bg-brand-teal text-[#05060A] shadow-lg shadow-brand-teal/20'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles & topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0E1A] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal/60 transition-colors font-mono"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest">Loading Journal Articles...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#0A0E1A] border border-white/10 rounded-3xl p-8">
            <BookOpen className="w-10 h-10 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold uppercase text-white mb-2">No Articles Found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Try searching for another topic or resetting your category filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-6 py-2.5 bg-brand-teal text-[#05060A] font-mono font-bold text-xs uppercase rounded hover:bg-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* FEATURED SPOTLIGHT CARD (When All & No Search) */}
            {selectedCategory === 'All' && !searchQuery && featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative bg-[#0A0E1A] border border-white/10 rounded-3xl overflow-hidden hover:border-brand-teal/50 transition-all duration-500 shadow-2xl grid lg:grid-cols-12"
              >
                {/* Image Area */}
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#0A0E1A]">
                  <img
                    src={featuredPost.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent opacity-80 lg:hidden" />
                  <div className="absolute top-4 left-4 bg-[#05060A]/80 backdrop-blur-md border border-brand-teal/40 px-3 py-1 rounded-full text-brand-teal text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-brand-teal" /> Featured Story
                  </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-b from-[#0A0E1A] to-[#05060A]">
                  <div>
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2.5 py-1 rounded border border-brand-teal/20">
                        {featuredPost.category || 'Engineering'}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" /> {featuredPost.readTime || '5 min read'}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase mb-4 leading-snug group-hover:text-brand-teal transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal font-mono font-bold text-xs">
                        {featuredPost.author.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{featuredPost.author}</span>
                        <span className="text-[10px] font-mono text-gray-500 block">{featuredPost.date}</span>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="px-5 py-2.5 bg-brand-teal text-[#05060A] font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-white transition-colors flex items-center gap-1.5"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ARTICLES GRID */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-widest flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-brand-teal" />
                  {selectedCategory === 'All' ? 'Latest Journal Entries' : `${selectedCategory} Articles`}
                </h3>
                <span className="text-xs font-mono text-gray-500">{remainingPosts.length} Articles</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group flex flex-col bg-[#0A0E1A] border border-white/10 rounded-2xl overflow-hidden hover:border-brand-teal/40 transition-all duration-300 shadow-lg"
                  >
                    {/* Article Image Header */}
                    <div className="w-full aspect-[16/10] relative overflow-hidden bg-[#0A0E1A]">
                      <img
                        src={article.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-3 left-3 bg-[#05060A]/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-brand-teal">
                        {article.category || 'Insight'}
                      </div>

                      {article.readTime && (
                        <div className="absolute bottom-3 right-3 bg-[#05060A]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-gray-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-teal" />
                          {article.readTime}
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mb-3">
                          <span className="text-white font-medium">{article.author}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                        </div>

                        <h4 className="text-lg font-bold text-white tracking-tight uppercase mb-3 line-clamp-2 group-hover:text-brand-teal transition-colors">
                          {article.title}
                        </h4>

                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-6">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <Link
                          to={`/blog/${article.slug}`}
                          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-teal uppercase tracking-widest hover:text-white transition-colors"
                        >
                          Read Article <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM AUDIT NEWSLETTER CALLOUT */}
        <div className="mt-24 bg-gradient-to-r from-[#0A0E1A] via-brand-teal/10 to-[#0A0E1A] border border-brand-teal/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-mono font-bold text-brand-teal uppercase tracking-widest block mb-3">Instant Business Growth Audit</span>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-4">
              Is Your Business Leaking Uncaptured Web Leads?
            </h3>
            <p className="text-gray-300 text-sm font-sans max-w-xl mx-auto mb-8">
              Run our instant AI Website & Automation Audit to identify performance bottlenecks and revenue recovery opportunities in under 60 seconds.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-teal text-[#05060A] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white transition-colors shadow-lg shadow-brand-teal/20"
            >
              <span>Get Free AI Audit Report</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

