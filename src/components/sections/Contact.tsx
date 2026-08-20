import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Monitor, MessageSquare, Mic, CalendarClock, Zap, Clock, Search, ArrowRight, ArrowLeft, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';

type Step = 1 | 2 | 3;

export function Contact() {
  const [searchParams] = useSearchParams();
  const selectedTier = searchParams.get('tier');
  const selectedType = searchParams.get('type');
  const selectedCycle = searchParams.get('cycle') || 'monthly';

  const [step, setStep] = useState<Step>(1);
  const [selections, setSelections] = useState({
    projectType: selectedTier ? 'voice' : '',
    timeline: selectedTier ? 'asap' : '',
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (selectedTier) {
      const modeText = selectedType === 'setup' ? 'One-Time Setup Service' : `${selectedCycle === 'annual' ? 'Annual' : 'Monthly'} Subscription Plan`;
      setSelections(prev => ({
        ...prev,
        projectType: prev.projectType || 'voice',
        timeline: prev.timeline || 'asap',
        message: prev.message || `Hi Quorik Team, I am interested in the ${selectedTier.toUpperCase()} Plan (${modeText}). Please contact me regarding the deployment requirements and onboarding.`
      }));
    }
  }, [selectedTier, selectedType, selectedCycle]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selections)
      });
      
      if (!response.ok) throw new Error('Failed to submit form');
      
      setIsSubmitted(true);
      setStep(1);
    } catch (error) {
      console.error(error);
      alert('There was an issue submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { id: 'website', label: 'Custom Website', icon: Monitor, description: 'Modern, fast, and responsive.' },
    { id: 'chatbot', label: 'Smart Chatbot', icon: MessageSquare, description: 'AI-driven customer support.' },
    { id: 'voice', label: 'Voice Agent', icon: Mic, description: 'Automated call handling.' },
    { id: 'automation', label: 'Automations', icon: Zap, description: 'Streamline your workflows.' }
  ];

  const timelines = [
    { id: 'asap', label: 'ASAP', icon: Zap, description: 'Ready to start immediately' },
    { id: '1-3months', label: '1-3 Months', icon: Clock, description: 'Planning near term' },
    { id: '3months+', label: '3+ Months', icon: CalendarClock, description: 'Long term project' },
    { id: 'exploring', label: 'Just Exploring', icon: Search, description: 'Looking for ideas' }
  ];

  const updateSelection = (field: keyof typeof selections, value: string) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-32 bg-[#0A0E1A] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
          
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Let's build <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-teal">together.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-md">
              Whether you need a new website or want to save time with an AI helper, we're ready to help your business grow.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4 text-gray-300">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                  <Mail className="w-5 h-5 text-gray-300" />
                </div>
                <div className="pt-1.5">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Email Us</p>
                  <a href="mailto:info@quoriksystems.com" className="font-semibold text-white hover:text-brand-teal transition-colors block">
                    info@quoriksystems.com
                  </a>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Sales & Custom Quotes: <a href="mailto:sales@quoriksystems.com" className="text-brand-teal hover:underline">sales@quoriksystems.com</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-300">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                  <PhoneCall className="w-5 h-5 text-brand-teal" />
                </div>
                <div className="pt-1.5">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">WhatsApp Business Only</p>
                  <p className="font-semibold text-white">+92 370 0146156</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">(WhatsApp Messages & Voice Notes Only)</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-300">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                  <MapPin className="w-5 h-5 text-gray-300" />
                </div>
                <div className="pt-1.5">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-semibold text-white">Global Remote</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 bg-[#0F1423] border border-white/5 p-8 md:p-10 rounded-[32px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-brand-teal" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Project Request Sent</h3>
                  <p className="text-gray-400">We'll review your details and get back to you within 24 hours.</p>
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelections({ projectType: '', timeline: '', name: '', email: '', message: '' });
                    }}
                    className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-full transition-colors border border-white/10"
                  >
                    Start new request
                  </button>
                </div>
              ) : (
                <div className="min-h-[400px] flex flex-col">
                  {selectedTier && (
                    <div className="mb-6 p-4 rounded-2xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-brand-teal" />
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-brand-teal uppercase tracking-wider">
                            Selected Plan: {selectedTier.toUpperCase()} ({selectedType === 'setup' ? 'One-Time Setup' : `${selectedCycle === 'annual' ? 'Annual' : 'Monthly'} Subscription`})
                          </p>
                          <p className="text-xs text-gray-300">
                            Tell us your timeline and contact details below to finalize onboarding.
                          </p>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 hidden sm:block" />
                    </div>
                  )}

                  <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                      <div 
                        key={s} 
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          s <= step ? 'bg-brand-teal' : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                      >
                        <h3 className="text-xl font-bold text-white mb-6">What are you looking to build?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {projectTypes.map((type) => {
                            const Icon = type.icon;
                            const isSelected = selections.projectType === type.id;
                            return (
                              <button
                                key={type.id}
                                onClick={() => updateSelection('projectType', type.id)}
                                className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                                  isSelected 
                                    ? 'bg-brand-teal/10 border-brand-teal shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                                    : 'bg-[#0A0E1A] border-white/5 hover:border-white/20'
                                }`}
                              >
                                <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-brand-teal' : 'text-gray-400'}`} />
                                <div className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                  {type.label}
                                </div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                      >
                        <h3 className="text-xl font-bold text-white mb-6">What is your timeline?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {timelines.map((time) => {
                            const Icon = time.icon;
                            const isSelected = selections.timeline === time.id;
                            return (
                              <button
                                key={time.id}
                                onClick={() => updateSelection('timeline', time.id)}
                                className={`text-left p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                                  isSelected 
                                    ? 'bg-brand-teal/10 border-brand-teal shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                                    : 'bg-[#0A0E1A] border-white/5 hover:border-white/20'
                                }`}
                              >
                                <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-brand-teal' : 'text-gray-400'}`} />
                                <div>
                                  <div className={`font-semibold text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                    {time.label}
                                  </div>
                                  <div className="text-xs text-gray-500">{time.description}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.form
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmit}
                        className="flex-1 space-y-5"
                      >
                        <h3 className="text-xl font-bold text-white mb-6">Tell us about yourself</h3>
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
                            <input 
                              type="text" 
                              id="name"
                              required
                              value={selections.name}
                              onChange={(e) => updateSelection('name', e.target.value)}
                              className="w-full bg-[#0A0E1A] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue/50 transition-colors"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                            <input 
                              type="email" 
                              id="email"
                              required
                              value={selections.email}
                              onChange={(e) => updateSelection('email', e.target.value)}
                              className="w-full bg-[#0A0E1A] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue/50 transition-colors"
                              placeholder="john@company.com"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Project Details</label>
                          <textarea 
                            id="message"
                            rows={3}
                            value={selections.message}
                            onChange={(e) => updateSelection('message', e.target.value)}
                            className="w-full bg-[#0A0E1A] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
                            placeholder="Tell us a bit more about your goals..."
                          ></textarea>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
                      className={`px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-2 ${
                        step === 1 ? 'invisible' : 'visible'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    {step < 3 ? (
                      <button
                        onClick={() => setStep((s) => Math.min(3, s + 1) as Step)}
                        disabled={(step === 1 && !selections.projectType) || (step === 2 && !selections.timeline)}
                        className="px-6 py-2.5 bg-white text-[#0A0E1A] font-bold rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Next Step <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selections.name || !selections.email}
                        className="px-8 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Submit Request'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
