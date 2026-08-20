import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Check, Sparkles, Tag, ArrowUpRight, Copy, 
  Play, Pause, ThumbsUp, Bookmark, MessageSquare, Volume2, 
  ExternalLink, ChevronRight, Award, Zap, Share2, Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
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

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';

export function BlogPostPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Audio summary SpeechSynthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'speaking' | 'paused' | 'finished'>('idle');

  // Upvotes & Bookmark interactive states
  const [upvotes, setUpvotes] = useState(142);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Reading progress state
  const [scrollProgress, setScrollProgress] = useState(0);

  // Image load error fallback state
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle SpeechSynthesis audio playback out loud
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support Web Speech Synthesis.');
      return;
    }

    if (speechStatus === 'speaking') {
      window.speechSynthesis.pause();
      setSpeechStatus('paused');
      setIsPlayingAudio(false);
      return;
    }

    if (speechStatus === 'paused') {
      window.speechSynthesis.resume();
      setSpeechStatus('speaking');
      setIsPlayingAudio(true);
      return;
    }

    // Cancel any ongoing speech and start fresh utterance
    window.speechSynthesis.cancel();

    // Clean article markdown text for voice reading
    const cleanContent = article ? article.content.replace(/[*#`>|\\-]/g, ' ').substring(0, 600) : '';
    const textToRead = `Audio summary for article titled ${article?.title}. Executive summary: ${article?.excerpt}. Key insights: ${cleanContent}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Load available voices and select natural English voice if possible
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Alex'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setSpeechStatus('speaking');
      setAudioProgress(0);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setSpeechStatus('finished');
      setAudioProgress(100);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setSpeechStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSpeechStatus('idle');
    setAudioProgress(0);
  };

  // Cleanup speech synthesis on unmount or post change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  // Audio progress animation during speech
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio && speechStatus === 'speaking') {
      interval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 98 ? 98 : prev + 1.5));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, speechStatus]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setArticle(data);
          setImgSrc(data.image || DEFAULT_IMAGE);
        }

        const allRes = await fetch('/api/posts');
        const allContentType = allRes.headers.get('content-type');
        if (allRes.ok && allContentType && allContentType.includes('application/json')) {
          const allData = await allRes.json();
          setAllPosts(Array.isArray(allData) ? allData.filter((p: BlogPost) => p.status === 'published' && p.slug !== id) : []);
        }
      } catch (err) {
        console.error('Failed to fetch post', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    } else {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060A] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Loading Article Architecture...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#05060A] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-[#0A0E1A] border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h1 className="text-2xl font-bold uppercase mb-3">Article Not Found</h1>
          <p className="text-gray-400 text-sm mb-6">The article you are looking for may have been moved or removed.</p>
          <Link to="/blog" className="px-6 py-2.5 bg-brand-teal text-[#05060A] font-mono font-bold text-xs uppercase rounded hover:bg-white transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Quorik Journal
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = allPosts.slice(0, 2);

  return (
    <article className="pt-24 pb-24 bg-[#05060A] min-h-screen text-white font-sans noise-bg relative">
      
      {/* READING PROGRESS BAR AT TOP OF SCREEN */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div 
          className="h-full bg-gradient-to-r from-brand-teal via-brand-blue to-white transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <SEO
          title={article.title}
          description={article.excerpt || article.title}
          keywords={`${article.category || 'AI'}, Quorik journal, web engineering, ${article.title}`}
          canonicalPath={`/blog/${article.slug || article.id}`}
          ogImage={article.image || DEFAULT_IMAGE}
          ogType="article"
          schema={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.excerpt || article.title,
            "image": [article.image || DEFAULT_IMAGE],
            "datePublished": article.date || article.createdAt,
            "author": {
              "@type": "Person",
              "name": article.author || "Shehram Meellu"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Quorik",
              "logo": {
                "@type": "ImageObject",
                "url": "https://quorik.com/favicon.svg"
              }
            }
          }}
        />
        
        {/* TOP NAVIGATION & SHARE BAR */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-teal transition-colors font-mono uppercase text-xs font-bold tracking-wider group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Journal</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`px-3 py-1.5 border rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                isBookmarked 
                  ? 'bg-brand-teal/20 border-brand-teal text-brand-teal' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Save'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-white/20 transition-all text-xs font-mono flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-teal" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Story'}</span>
            </button>
          </div>
        </div>

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* CATEGORY & METADATA BADGES */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-xs font-mono font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-3 py-1 rounded-full border border-brand-teal/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-brand-teal" />
              {article.category || 'Engineering'}
            </span>
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Clock className="w-3.5 h-3.5 text-brand-teal" /> {article.readTime || '6 min read'}
            </span>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {article.date}
            </span>
          </div>

          {/* ARTICLE TITLE */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight uppercase leading-[1.1] mb-8 max-w-5xl">
            {article.title}
          </h1>

          {/* AUTHOR BAR WITH AVATAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0A0E1A] border border-white/10 rounded-2xl mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-teal to-brand-blue flex items-center justify-center text-black font-mono font-bold text-sm shadow-md">
                S
              </div>
              <div>
                <span className="text-white font-bold text-sm block">Shehram Meellu</span>
                <span className="text-brand-teal font-mono text-[11px] block font-semibold">Founder & CEO, Quorik</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1 text-brand-teal">
                <Zap className="w-3.5 h-3.5" /> CEO Insights
              </span>
              <span>•</span>
              <span className="text-gray-400">Updated 2026</span>
            </div>
          </div>

          {/* AI VOICE AUDIO SUMMARY WIDGET */}
          <div className="bg-gradient-to-r from-[#0A0E1A] via-[#0D1322] to-[#0A0E1A] border border-brand-teal/30 rounded-2xl p-5 mb-10 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  className="w-12 h-12 rounded-full bg-brand-teal text-[#05060A] flex items-center justify-center hover:bg-white transition-all shrink-0 shadow-lg shadow-brand-teal/20"
                  title={isPlayingAudio ? 'Pause Voice' : 'Listen Out Loud'}
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-brand-teal" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {isPlayingAudio ? 'Now Reading Article Out Loud...' : speechStatus === 'paused' ? 'Speech Paused' : 'Listen to AI Voice Audio Summary'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs font-sans mt-0.5">
                    {speechStatus === 'speaking' 
                      ? 'Browser Web Speech Engine active — turn up your speakers' 
                      : 'Real-time AI voice synthesis reads excerpt & highlights'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Stop Speech Button */}
                {(isPlayingAudio || speechStatus === 'paused') && (
                  <button
                    onClick={handleStopAudio}
                    className="px-3 py-1 bg-white/10 hover:bg-red-500/20 hover:text-red-400 border border-white/10 rounded-lg text-xs font-mono text-gray-300 transition-colors"
                  >
                    Stop Voice
                  </button>
                )}

                {/* Animated Waveform Equalizer */}
                <div className="flex items-center gap-1 h-6 px-3">
                  {[40, 70, 30, 90, 60, 100, 50, 80, 40, 60, 90, 30].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-brand-teal animate-pulse' : 'bg-white/20'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(20, (h * (audioProgress % 5 + 1)) % 100)}%` : `${h}%`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Audio Progress Bar */}
            {(isPlayingAudio || audioProgress > 0) && (
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="bg-brand-teal h-full transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* COMPLETE FULL-WIDTH HERO IMAGE */}
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/10 bg-[#0A0E1A] relative shadow-2xl group">
            <img
              src={imgSrc || DEFAULT_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setImgSrc(DEFAULT_IMAGE)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-gray-300 bg-[#05060A]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <span className="truncate">Architectural Visual: {article.category || 'Web AI'}</span>
              <span className="text-brand-teal shrink-0">100% HD Render</span>
            </div>
          </div>
        </motion.div>

        {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* ARTICLE CONTENT (8 COLS) */}
          <div className="lg:col-span-8">
            
            {/* EXCERPT HIGHLIGHT BOX */}
            <div className="bg-[#0A0E1A] border-l-4 border-brand-teal p-6 sm:p-8 rounded-r-2xl mb-12 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-widest block mb-2">Executive Summary</span>
              <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-medium">
                {article.excerpt}
              </p>
            </div>

            {/* RICH MARKDOWN ARTICLE CONTENT */}
            <div className="prose prose-invert prose-lg max-w-none 
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-sans
              prose-headings:text-white prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-headings:mt-12 prose-headings:mb-6
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3 prose-h2:text-white
              prose-h3:text-xl prose-h3:text-brand-teal
              prose-a:text-brand-teal prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-brand-teal prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#0A0E1A] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-2xl prose-pre:p-6
              prose-blockquote:border-l-4 prose-blockquote:border-brand-teal prose-blockquote:bg-gradient-to-r prose-blockquote:from-brand-teal/10 prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-100 prose-blockquote:not-italic prose-blockquote:font-medium
              prose-li:text-gray-300 prose-li:font-sans prose-ul:list-disc prose-ol:list-decimal mb-16"
            >
              <div className="markdown-body">
                <Markdown>{article.content}</Markdown>
              </div>
            </div>

            {/* READER REACTION & UPVOTE BAR */}
            <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Was this technical analysis helpful?</h4>
                <p className="text-gray-400 text-xs">Let our engineering team know if this content provided value.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpvote}
                  className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    hasUpvoted
                      ? 'bg-brand-teal text-[#05060A] shadow-lg shadow-brand-teal/20'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:border-brand-teal hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
                  <span>{upvotes} Helpful</span>
                </button>
              </div>
            </div>

            {/* AUTHOR SPOTLIGHT CARD */}
            <div className="bg-gradient-to-br from-[#0A0E1A] to-[#05060A] border border-brand-teal/20 rounded-3xl p-8 mb-16 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-blue p-1 shrink-0 shadow-xl">
                  <div className="w-full h-full bg-[#05060A] rounded-xl flex items-center justify-center text-brand-teal font-mono font-bold text-2xl">
                    S
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold text-brand-teal uppercase tracking-widest block mb-1">Author & Founder Spotlight</span>
                  <h3 className="text-xl font-bold text-white uppercase mb-1">Shehram Meellu</h3>
                  <p className="text-brand-teal font-mono text-xs font-bold uppercase tracking-wider mb-3">Founder & CEO, Quorik</p>
                  <p className="text-gray-300 text-xs leading-relaxed font-sans mb-6 max-w-xl">
                    Shehram Meellu is the Founder & CEO of Quorik. Shehram leads technical design, high-speed web engineering, and custom 24/7 AI Voice integrations at Quorik, delivering sub-second web platforms and automated lead generation engines for global businesses.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-[#05060A] font-mono font-bold text-xs uppercase tracking-wider rounded hover:bg-white transition-colors"
                    >
                      <span>Consult Directly with Shehram</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href="https://www.linkedin.com/in/shehram-meellu-218812370"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:text-white hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/60 font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn Profile</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* QUICK AUDIT CALLOUT STICKY CARD */}
            <div className="sticky top-28 bg-[#0A0E1A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-[10px] font-mono font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3" /> Growth Benchmark
              </div>

              <h3 className="text-lg font-bold uppercase text-white tracking-tight leading-snug">
                Want to Implement These AI & Web Solutions?
              </h3>

              <p className="text-gray-400 text-xs leading-relaxed">
                Quorik designs custom high-speed web platforms and embeds 24/7 AI Voice Assistants tailored to your business model.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                  <Check className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Sub-350ms Latency AI Speech</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                  <Check className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Sub-Second Core Web Vitals</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                  <Check className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Instant WhatsApp & CRM Sync</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full py-3 bg-brand-teal text-[#05060A] font-mono font-bold text-xs uppercase tracking-wider rounded text-center block hover:bg-white transition-colors shadow-lg shadow-brand-teal/20"
              >
                Get Free Strategy Proposal
              </Link>
            </div>

          </div>

        </div>

        {/* RELATED ARTICLES FOOTER */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-mono uppercase font-bold text-white tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-teal" />
                Recommended Reading from Quorik
              </h3>
              <Link to="/blog" className="text-xs font-mono font-bold text-brand-teal hover:underline flex items-center gap-1">
                View All Articles <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map(rel => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group bg-[#0A0E1A] border border-white/10 rounded-2xl p-6 hover:border-brand-teal/40 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-brand-teal uppercase tracking-widest font-bold bg-brand-teal/10 px-2.5 py-0.5 rounded border border-brand-teal/20">
                        {rel.category || 'Engineering'}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">{rel.readTime || '5 min read'}</span>
                    </div>

                    <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-3 group-hover:text-brand-teal transition-colors line-clamp-2">
                      {rel.title}
                    </h4>

                    <p className="text-gray-400 text-xs line-clamp-2 font-sans mb-6">
                      {rel.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">{rel.date}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-brand-teal font-bold group-hover:text-white transition-colors">
                      Read Story <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
