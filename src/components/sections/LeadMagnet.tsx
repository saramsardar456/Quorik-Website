import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, CheckCircle, ArrowRight, Download, Phone, MessageSquare, AlertTriangle, TrendingUp, Clock, Globe, Building, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AuditResult {
  id: string;
  businessName: string;
  websiteUrl: string;
  industry: string;
  currentPlatform: string;
  goals: string;
  contactName: string;
  email: string;
  phone: string;
  score: number;
  summary: string;
  opportunities: Array<{ title: string; impact: string; description: string; estimatedSavings: string }>;
  bottlenecks: Array<{ issue: string; severity: string; fix: string }>;
  estimatedMonthlyRevenueGrowth: string;
  hoursSavedPerWeek: number;
  actionPlan: string[];
  createdAt: string;
}

export function LeadMagnet() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: URL/Info, 2: Tech/Goals, 3: Contact, 4: Results
  
  // Form State
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('E-commerce');
  const [currentPlatform, setCurrentPlatform] = useState('WordPress');
  const [goals, setGoals] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Scanning site structure...');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStartAudit = async (e: FormEvent) => {
    e.preventDefault();
    if (!websiteUrl || !goals || !name || !phone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const steps = [
      'Scanning website architecture & mobile responsiveness...',
      'Evaluating current lead conversion bottlenecks...',
      'Calculating AI Voice & WhatsApp automation opportunities...',
      'Generating custom ROI blueprint with Gemini AI...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl,
          businessName,
          industry,
          currentPlatform,
          goals,
          name,
          email,
          phone
        })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format.');
      }

      const data = await res.json();
      if (res.ok && data.audit) {
        setAuditResult(data.audit);
        setStep(4);
      } else {
        setErrorMsg(data.error || 'Failed to generate audit. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Network error while running AI audit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportPDF = () => {
    if (!auditResult) return;
    const doc = new jsPDF();
    
    // Header banner
    doc.setFillColor(7, 9, 15);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('QUORIK AI AUTOMATION AUDIT', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated for: ${auditResult.businessName} (${auditResult.websiteUrl})`, 14, 30);

    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Automation & Conversion Score: ${auditResult.score}/100`, 14, 48);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitSummary = doc.splitTextToSize(`Executive Summary: ${auditResult.summary}`, 180);
    doc.text(splitSummary, 14, 56);

    let startY = 75;

    // Opportunities Table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Missed Automation Opportunities', 14, startY);
    
    const oppData = auditResult.opportunities.map(o => [o.title, o.impact, o.description, o.estimatedSavings]);
    autoTable(doc, {
      startY: startY + 4,
      head: [['Opportunity', 'Impact', 'Solution Description', 'Est. Savings / Growth']],
      body: oppData,
      headStyles: { fillColor: [37, 99, 235] },
    });

    // Bottlenecks Table
    startY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Identified UX & Funnel Bottlenecks', 14, startY);

    const botData = auditResult.bottlenecks.map(b => [b.issue, b.severity, b.fix]);
    autoTable(doc, {
      startY: startY + 4,
      head: [['Identified Bottleneck', 'Severity', 'Recommended Quorik Fix']],
      body: botData,
      headStyles: { fillColor: [6, 182, 212] },
    });

    // Action Plan
    startY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Strategic Implementation Plan', 14, startY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    auditResult.actionPlan.forEach((plan, idx) => {
      doc.text(`• ${plan}`, 18, startY + 8 + (idx * 6));
    });

    doc.save(`Quorik_AI_Audit_${auditResult.businessName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <section id="ai-auditor" className="py-24 bg-[#07090F] relative overflow-hidden border-y border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-full text-brand-teal text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Interactive AI Website & Automation Auditor</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Is Your Website Losing Leads & Potential Customers?
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Get an instant, 3-step AI audit report highlighting missed automation opportunities, UX bottlenecks, and estimated monthly revenue growth.
          </p>
        </div>

        <div className="bg-[#05060A]/90 border border-white/10 rounded-[28px] p-6 md:p-10 shadow-2xl backdrop-blur-xl relative">
          
          {step !== 4 && (
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-md mx-auto mb-3">
                <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-brand-teal' : 'text-gray-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-brand-teal text-black' : 'bg-white/10 text-gray-400'}`}>1</span>
                  <span>Website & Niche</span>
                </div>
                <div className="w-12 h-0.5 bg-white/10" />
                <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-brand-teal' : 'text-gray-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-brand-teal text-black' : 'bg-white/10 text-gray-400'}`}>2</span>
                  <span>Goals & Tech</span>
                </div>
                <div className="w-12 h-0.5 bg-white/10" />
                <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-brand-teal' : 'text-gray-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-brand-teal text-black' : 'bg-white/10 text-gray-400'}`}>3</span>
                  <span>Contact</span>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Website URL *</label>
                  <div className="relative">
                    <Globe className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="e.g. https://yourbusiness.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Business Name</label>
                    <div className="relative">
                      <Building className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Legal Group"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Industry / Niche</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-[#0D1222] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-teal transition-colors"
                    >
                      <option value="E-commerce">E-commerce / Retail</option>
                      <option value="Real Estate">Real Estate & Property</option>
                      <option value="Healthcare / Dental">Healthcare & Dental</option>
                      <option value="Legal & Financial">Legal & Financial Services</option>
                      <option value="Home Services">Home Services & Contracting</option>
                      <option value="B2B SaaS & Tech">B2B SaaS & Technology</option>
                      <option value="Agency & Consulting">Agency & Professional Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!websiteUrl) {
                      setErrorMsg('Please enter your website URL.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(2);
                  }}
                  className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-blue/25"
                >
                  <span>Next: Current Goals & Bottlenecks</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Current Website Platform</label>
                  <select
                    value={currentPlatform}
                    onChange={(e) => setCurrentPlatform(e.target.value)}
                    className="w-full bg-[#0D1222] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-teal transition-colors"
                  >
                    <option value="WordPress">WordPress / Elementor</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Webflow">Webflow</option>
                    <option value="Custom React / Next.js">Custom Code (React / Next.js)</option>
                    <option value="Wix / Squarespace">Wix / Squarespace</option>
                    <option value="Not Sure / Legacy">Not Sure / Legacy Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">What are your main business goals & bottlenecks? *</label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="e.g. We miss 40% of after-hours calls, form submissions take 2 days to follow up, site converts poorly on mobile, want automated WhatsApp confirmations."
                    rows={4}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors text-sm"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!goals) {
                        setErrorMsg('Please briefly describe your current goals or bottlenecks.');
                        return;
                      }
                      setErrorMsg('');
                      setStep(3);
                    }}
                    className="flex-1 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-blue/25"
                  >
                    <span>Next: Get Instant AI Audit</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleStartAudit}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div className="p-4 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-xs text-brand-teal flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 shrink-0 text-brand-teal" />
                  <span>Enter your phone number below to receive an instant WhatsApp & SMS copy of your AI audit report!</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Your Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Phone Number (WhatsApp/SMS) *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gradient-to-r from-brand-blue to-brand-teal hover:opacity-90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-brand-teal/20"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-xs tracking-wide">{loadingStep}</span>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Instant AI Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 4: RESULTS DASHBOARD */}
            {step === 4 && auditResult && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Header score card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="bg-[#0D1222] border border-brand-teal/30 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/10 blur-xl rounded-full" />
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-2">Automation Readiness Score</div>
                    <div className="flex items-baseline gap-2 my-2">
                      <span className="text-5xl font-black text-white">{auditResult.score}</span>
                      <span className="text-gray-400 text-lg font-bold">/ 100</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-brand-blue to-brand-teal h-full transition-all duration-1000"
                        style={{ width: `${auditResult.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#0D1222] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Est. Monthly Revenue Growth</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white my-2">{auditResult.estimatedMonthlyRevenueGrowth}</div>
                    <div className="text-xs text-gray-400">Calculated from converting missed voice calls & instant WhatsApp leads</div>
                  </div>

                  <div className="bg-[#0D1222] border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Hours Saved / Week</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white my-2">{auditResult.hoursSavedPerWeek} hrs/wk</div>
                    <div className="text-xs text-gray-400">Automated reception, appointment booking & instant SMS text confirmations</div>
                  </div>

                </div>

                {/* Executive Summary */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-brand-teal" />
                    <span>Executive AI Analysis for {auditResult.businessName}</span>
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{auditResult.summary}</p>
                </div>

                {/* Opportunities Cards */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">📲 Top Missed Automation Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {auditResult.opportunities.map((opp, idx) => (
                      <div key={idx} className="bg-[#0D1222] border border-white/10 p-5 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-brand-blue/20 text-brand-teal border border-brand-teal/30">
                              {opp.impact} Impact
                            </span>
                            <span className="text-xs font-semibold text-green-400">{opp.estimatedSavings}</span>
                          </div>
                          <h4 className="font-bold text-white text-base mb-2">{opp.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{opp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UX & Funnel Bottlenecks */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">⚠️ Identified Conversion Bottlenecks & Fixes</h3>
                  <div className="bg-[#0D1222] border border-white/10 rounded-xl overflow-hidden">
                    <div className="divide-y divide-white/5">
                      {auditResult.bottlenecks.map((bot, idx) => (
                        <div key={idx} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                            <div>
                              <div className="text-sm font-bold text-white">{bot.issue}</div>
                              <div className="text-xs text-gray-400">Severity: <span className="text-amber-300">{bot.severity}</span></div>
                            </div>
                          </div>
                          <div className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 text-xs px-3 py-1.5 rounded-lg font-semibold">
                            Fix: {bot.fix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="bg-gradient-to-r from-brand-blue/10 to-brand-teal/10 border border-brand-teal/20 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-3">🚀 Quorik Strategic Action Plan</h3>
                  <div className="space-y-2">
                    {auditResult.actionPlan.map((plan, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-gray-200">
                        <CheckCircle className="w-4 h-4 text-brand-teal shrink-0" />
                        <span>{plan}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-teal" />
                    <span>A confirmation copy of this audit has been logged for WhatsApp / SMS text delivery to <strong>{auditResult.phone}</strong>.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={exportPDF}
                      className="flex-1 sm:flex-none py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-brand-teal" />
                      <span>Download PDF Report</span>
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Hi Quorik AI Team, I just generated an AI Website Audit for ${auditResult.businessName} (Automation Score: ${auditResult.score}/100) and would like to discuss implementing our AI roadmap!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none py-3 px-5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}

