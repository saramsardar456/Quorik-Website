export interface IndustryInfo {
  slug: string;
  name: string;
  badge: string;
  headline: string;
  subheadline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  painPoints: { title: string; desc: string }[];
  aiAgentFeatures: { title: string; desc: string }[];
  expectedRoi: { metric: string; label: string }[];
  caseStudy: {
    client: string;
    result: string;
    quote: string;
    author: string;
  };
  sampleQuestions: string[];
  systemPromptPreset: string;
  faq: { q: string; a: string }[];
}

export const INDUSTRIES: Record<string, IndustryInfo> = {
  'dental-medical': {
    slug: 'dental-medical',
    name: 'Dental & Medical Clinics',
    badge: '24/7 Medical Intake & Appointment AI',
    headline: 'Autonomous Voice AI Receptionist for Dental & Medical Practices',
    subheadline: 'Eliminate missed patient calls, answer insurance questions instantly, and schedule emergency appointments 24/7 with zero hold times.',
    metaTitle: 'AI Voice Receptionist for Dental & Medical Practices | Quorik',
    metaDescription: 'Deploy an autonomous AI voice receptionist for dental and medical clinics. Schedule appointments, verify insurance coverage, and qualify emergency cases 24/7 with <350ms speech latency.',
    keywords: 'dental AI receptionist, medical office AI voice agent, HIPAA compliant appointment booking, dental clinic receptionist software, Quorik medical AI',
    painPoints: [
      { title: '42% Missed Patient Calls', desc: 'Front desk staff are overwhelmed during peak morning check-ins, leading to dropped prospective patient inquiries.' },
      { title: 'After-Hours Dental Emergencies', desc: 'Patients experiencing severe pain call after 5 PM and book with competitors who answer immediately.' },
      { title: 'Repetitive Insurance Inquiries', desc: 'Staff spend 15+ hours weekly answering standard copay and network verification questions over the phone.' }
    ],
    aiAgentFeatures: [
      { title: 'Sub-350ms Speech Latency', desc: 'Conversations feel 100% natural and indistinguishable from a top-tier human receptionist.' },
      { title: 'Instant Calendar Integration', desc: 'Syncs directly with Google Calendar, Dentrix, or practice management tools for instant booking.' },
      { title: 'Emergency Triage Rules', desc: 'Detects urgent cases (severe pain, bleeding) and routes call directly to the on-call doctor.' }
    ],
    expectedRoi: [
      { metric: '0', label: 'Missed Calls During Peak Hours' },
      { metric: '+38%', label: 'Increase in Monthly New Patient Intake' },
      { metric: '100%', label: '24/7 Coverage After Hours & Weekends' }
    ],
    caseStudy: {
      client: 'Apex Dental Care Group',
      result: '+47 new patient bookings in month 1 and 0 missed weekend emergency calls',
      quote: 'Quorik’s AI voice receptionist transformed our front desk. It handles 80% of routine booking calls effortlessly while our team focuses on in-person patient care.',
      author: 'Dr. Marcus Vance, Managing Partner'
    },
    sampleQuestions: [
      'Do you take MetLife and Delta Dental insurance?',
      'I have a severe toothache, can I get an emergency appointment today?',
      'What are your office hours and address?'
    ],
    systemPromptPreset: 'You are Sarah, the AI Voice Receptionist for Apex Dental Care. You assist callers with booking appointments, answering insurance coverage questions, and routing emergency cases warmly and professionally.',
    faq: [
      { q: 'How does the AI handle medical emergencies after hours?', a: 'The AI uses pre-set urgency triggers to immediately transfer critical calls to your designated emergency line or capture detailed triage notes for morning follow-ups.' },
      { q: 'Can it integrate with our practice management software?', a: 'Yes! Quorik AI voice agents integrate via webhooks or API with leading calendar and CRM platforms.' },
      { q: 'Will patients know they are talking to an AI?', a: 'Our voice models operate at ultra-low sub-350ms latency with natural inflection, human breathing pauses, and warm tone.' }
    ]
  },

  'legal-law-firms': {
    slug: 'legal-law-firms',
    name: 'Legal & Law Firms',
    badge: '24/7 Client Intake & Case Qualification',
    headline: 'AI Voice Receptionist & Intake Specialist for Law Practices',
    subheadline: 'Capture high-value legal leads the second they call. Qualify case details, run conflict checks, and schedule paid consultations automatically.',
    metaTitle: 'AI Voice Receptionist for Law Firms & Legal Practices | Quorik',
    metaDescription: 'Automate client intake for personal injury, family law, and criminal defense practices with Quorik AI voice agents. Capture every lead 24/7 with instant consultation booking.',
    keywords: 'law firm AI receptionist, legal intake AI voice agent, personal injury call automation, law office virtual assistant, Quorik legal AI',
    painPoints: [
      { title: 'Lost High-Value Retainers', desc: 'Clients calling after accidents expect immediate response; 78% sign with the first firm that answers.' },
      { title: 'Unqualified Consultation Noise', desc: 'Attorneys waste valuable hours on intake calls for cases outside their practice area or jurisdiction.' },
      { title: 'Expensive Answering Services', desc: 'Traditional call centers provide script-reading agents with poor legal knowledge and high monthly costs.' }
    ],
    aiAgentFeatures: [
      { title: 'Dynamic Intake Logic', desc: 'Asks targeted practice-area screening questions (incident date, injury severity, police reports).' },
      { title: 'Retainer Consultation Booking', desc: 'Collects consultation fees or sends automated e-sign agreement links instantly during the call.' },
      { title: 'Zero Intake Delays', desc: 'Answers every call on the 1st ring, even during trials or weekend nights.' }
    ],
    expectedRoi: [
      { metric: '3.4x', label: 'Higher Intake Conversion Rate' },
      { metric: '100%', label: 'First-Call Lead Capture Rate' },
      { metric: '$4,200/mo', label: 'Saved vs Outsourced Call Centers' }
    ],
    caseStudy: {
      client: 'Vanguard Legal Partners',
      result: 'Captured 22 high-value personal injury cases from after-hours calls in 60 days',
      quote: 'When someone gets into an accident at midnight, they won’t leave a voicemail. Quorik’s AI voice intake agent qualifies the caller and sends us the case summary instantly.',
      author: 'Elena Rostova, Managing Attorney'
    },
    sampleQuestions: [
      'I was in a car accident yesterday, can I speak to an attorney?',
      'How much do you charge for an initial legal consultation?',
      'Do you handle family law and divorce cases in California?'
    ],
    systemPromptPreset: 'You are Victoria, Senior Legal Intake Specialist for Vanguard Legal. You gather preliminary incident details, verify jurisdiction, and schedule intake consultations for callers.',
    faq: [
      { q: 'How does the AI qualify caller cases?', a: 'You set the intake criteria (e.g., statute of limitations, injury threshold, location). The AI asks structured questions and flags eligible leads instantly.' },
      { q: 'Can it send case details to our legal CRM (Clio, MyCase)?', a: 'Yes, full call transcripts and structured intake fields are automatically posted to your CRM or inbox via automated webhooks.' }
    ]
  },

  'hvac-home-services': {
    slug: 'hvac-home-services',
    name: 'HVAC, Roofing & Home Services',
    badge: 'Emergency Dispatch & Dispatch AI',
    headline: '24/7 AI Voice Dispatcher for HVAC, Plumbing & Roofing Contractors',
    subheadline: 'Never lose a lucrative emergency job to a competitor. Dispatch technicians, give transparent price estimates, and book service appointments instantly.',
    metaTitle: '24/7 AI Voice Dispatcher for HVAC & Plumbing Contractors | Quorik',
    metaDescription: 'Deploy an AI voice agent for HVAC, plumbing, and roofing businesses. Book service calls 24/7, dispatch emergency technicians, and capture 100% of phone leads.',
    keywords: 'HVAC AI voice dispatcher, contractor phone answering service, plumbing AI receptionist, roofing emergency call booking, Quorik home services AI',
    painPoints: [
      { title: 'No-Answer After Hours', desc: 'Homeowners with broken ACs or leaking roofs call competitors if you go to voicemail after 6 PM.' },
      { title: 'Technician Distraction', desc: 'Field workers waste time answering quote inquiries while on active job sites.' },
      { title: 'Inconsistent Lead Capture', desc: 'Missing crucial job details (address, system age, urgency) leads to wasted service trips.' }
    ],
    aiAgentFeatures: [
      { title: 'Emergency Dispatch Triggers', desc: 'Detects active leaks or HVAC outages and alerts the on-duty technician via SMS.' },
      { title: 'Instant Service Window Booking', desc: 'Integrates with ServiceTitan, Housecall Pro, or Google Calendar to schedule tech visits.' },
      { title: 'Address & Zip Code Validation', desc: 'Confirms whether the caller is in your active service territory in real time.' }
    ],
    expectedRoi: [
      { metric: '100%', label: 'Calls Answered On 1st Ring' },
      { metric: '+45%', label: 'More Emergency Jobs Booked' },
      { metric: '<1 min', label: 'Average Technician Notification Time' }
    ],
    caseStudy: {
      client: 'Apex Climate Control & Roofing',
      result: '$68,000 in additional emergency HVAC repair revenue within the first storm season',
      quote: 'During summer heatwaves our phones ring non-stop. Quorik’s AI voice agent handled over 400 calls in a single weekend without dropping a single lead.',
      author: 'Dave Miller, Founder & Owner'
    },
    sampleQuestions: [
      'My AC stopped blowing cold air and it’s 90 degrees inside.',
      'How much do you charge for a roof inspection?',
      'Can someone come out tomorrow morning between 8 AM and 12 PM?'
    ],
    systemPromptPreset: 'You are Jack, Service Dispatcher for Apex Climate Control. You book technician appointments, confirm service addresses, and dispatch urgent repair calls.',
    faq: [
      { q: 'Can the AI quote estimated pricing?', a: 'Yes! You can configure exact diagnostic fee rates or price ranges that the AI provides to callers before booking.' },
      { q: 'How are emergency technicians notified?', a: 'The AI sends instant SMS/email alerts with complete call summaries, caller name, address, and issue description.' }
    ]
  },

  'real-estate': {
    slug: 'real-estate',
    name: 'Real Estate & Property Management',
    badge: 'Automated Showing & Property Inquiries',
    headline: 'AI Voice Agent & Leasing Specialist for Real Estate Agencies',
    subheadline: 'Book property showings instantly, answer tenant maintenance calls, and qualify buyer leads around the clock with intelligent voice AI.',
    metaTitle: 'AI Voice Receptionist for Real Estate & Property Management | Quorik',
    metaDescription: 'Scale real estate lead capture with Quorik AI voice agents. Schedule property tours, qualify buyer budgets, and handle tenant maintenance inquiries 24/7.',
    keywords: 'real estate AI receptionist, property management voice AI, automated property tour booking, real estate lead qualification, Quorik real estate',
    painPoints: [
      { title: 'Missed Buyer Hotline Inquiries', desc: 'Yard sign and Zillow callers drop off if agents are busy conducting active property tours.' },
      { title: 'Unqualified Buyer Calls', desc: 'Agents spend time driving to showings for buyers without pre-approval letters or sufficient budget.' },
      { title: 'After-Hours Tenant Emergency Calls', desc: 'Property managers receive late-night calls for non-emergency issues like lightbulb changes.' }
    ],
    aiAgentFeatures: [
      { title: 'Automated Showing Scheduler', desc: 'Syncs with Realtor calendars to schedule physical or virtual property walkthroughs.' },
      { title: 'Budget & Pre-Approval Screening', desc: 'Gently verifies timeline, financing status, and budget criteria before booking agent time.' },
      { title: 'Tenant Ticket Categorization', desc: 'Distinguishes genuine plumbing emergencies from routine maintenance requests.' }
    ],
    expectedRoi: [
      { metric: '2.8x', label: 'More Showings Scheduled' },
      { metric: '0', label: 'Ignored Yard Sign Calls' },
      { metric: '15 hrs', label: 'Saved Weekly Per Agent' }
    ],
    caseStudy: {
      client: 'Luxe Realty Group',
      result: '312 automated showing bookings in Q2 with zero agent manual scheduling',
      quote: 'Our agents love that Quorik screens callers for budget and pre-approval before putting showings on their calendar. It transformed our productivity.',
      author: 'Samantha Sterling, Principal Broker'
    },
    sampleQuestions: [
      'Is 425 Maple Street still available for a tour this Saturday?',
      'What is the HOA fee for the condo on Ocean Avenue?',
      'My kitchen sink is leaking and I am a current tenant.'
    ],
    systemPromptPreset: 'You are Claire, Leasing Assistant for Luxe Realty. You assist prospective buyers and renters with property information, touring availability, and pre-qualification.',
    faq: [
      { q: 'Can callers book property tours directly?', a: 'Yes! The AI connects directly to Calendly, Google Calendar, or MLS scheduling software to lock in showing times.' },
      { q: 'Does it work for property management emergency maintenance?', a: 'Yes, it triages emergency calls (busted pipes, gas leaks) and forwards them directly to your designated vendor or manager.' }
    ]
  },

  'ecommerce-retail': {
    slug: 'ecommerce-retail',
    name: 'E-Commerce & Retail Brands',
    badge: 'Order Tracking & Support Voice AI',
    headline: 'Autonomous Order Support & VIP Phone Agent for E-Commerce',
    subheadline: 'Resolve WISMO (Where Is My Order?) inquiries, handle return policies, and drive repeat phone orders 24/7 with zero waiting time.',
    metaTitle: 'AI Voice Support for E-Commerce & Retail Brands | Quorik',
    metaDescription: 'Automate order tracking, returns, and phone support for e-commerce stores with Quorik AI voice agents. Cut support ticket costs by up to 70%.',
    keywords: 'ecommerce AI customer support, order tracking voice AI, retail AI receptionist, automated phone returns, Quorik ecommerce AI',
    painPoints: [
      { title: 'High WISMO Ticket Volume', desc: '60%+ of phone inquiries are customers asking for order tracking updates.' },
      { title: 'Expensive Support Staffing', desc: 'Overnight and holiday phone support agents burn significant operating margins.' },
      { title: 'Lost Repeat Orders', desc: 'Customers get frustrated when phone support lines are busy or on long holds.' }
    ],
    aiAgentFeatures: [
      { title: 'Shopify & Order API Sync', desc: 'Looks up live tracking numbers and shipping statuses directly using customer phone numbers.' },
      { title: 'Automated Return Authorization', desc: 'Explains return policies and texts customer self-service RMA portal links.' },
      { title: 'Personalized VIP Greeting', desc: 'Greets repeat callers by name and summarizes recent purchases.' }
    ],
    expectedRoi: [
      { metric: '70%', label: 'Reduction in Phone Support Costs' },
      { metric: '<15 sec', label: 'Average Inbound Issue Resolution Time' },
      { metric: '24/7', label: 'Instant Global Order Support' }
    ],
    caseStudy: {
      client: 'Aura Athletics Apparel',
      result: 'Automated 84% of inbound order tracking phone calls during Black Friday Cyber Monday',
      quote: 'During peak holiday rushes, our phone queues used to back up for hours. Quorik answered every order lookup call instantly without adding support staff.',
      author: 'Marcus Chen, VP of Customer Experience'
    },
    sampleQuestions: [
      'Where is my order #84920?',
      'What is your holiday return policy?',
      'Can I change my delivery address before it ships?'
    ],
    systemPromptPreset: 'You are Alex, Customer Care Concierge for Aura Athletics. You look up order tracking information, explain return guidelines, and assist callers with product inquiries.',
    faq: [
      { q: 'Can the AI connect to Shopify or WooCommerce?', a: 'Yes! The AI looks up order status, tracking numbers, and shipping carrier information in real time via API.' }
    ]
  },

  'financial-services': {
    slug: 'financial-services',
    name: 'Financial Services & Wealth Management',
    badge: 'Compliant Inbound Screening & Advisory Booking',
    headline: 'High-Touch AI Voice Assistant for Wealth Managers & Financial Advisors',
    subheadline: 'Qualify high-net-worth prospective clients, schedule portfolio reviews, and deliver pristine brand interactions 24 hours a day.',
    metaTitle: 'AI Voice Assistant for Financial Services & Advisors | Quorik',
    metaDescription: 'Scale client booking for financial planners, wealth managers, and CPA firms. Capture high-net-worth inquiries 24/7 with Quorik AI voice agents.',
    keywords: 'financial advisor AI receptionist, wealth management voice agent, CPA firm call automation, financial planning lead intake, Quorik finance AI',
    painPoints: [
      { title: 'Missed High-Net-Worth Leads', desc: 'Advisors in client meetings miss calls from prospective investors looking for wealth management.' },
      { title: 'Unscreened Consultation Scheduling', desc: 'Time lost meeting with prospects who do not meet minimum investable asset thresholds.' },
      { title: 'Tax Season Call Bottlenecks', desc: 'CPA and accounting firms face overwhelming call surges every March and April.' }
    ],
    aiAgentFeatures: [
      { title: 'Asset Threshold Pre-Screening', desc: 'Gently confirms investment goals and minimum asset criteria before advisor calendar booking.' },
      { title: 'Secure Consultation Scheduling', desc: 'Locks in review meetings directly with advisor calendars and sends SMS confirmation links.' },
      { title: 'Strict Verification Standards', desc: 'Ensures tone and protocol strictly align with institutional financial standards.' }
    ],
    expectedRoi: [
      { metric: '4.2x', label: 'Higher Meeting Booking Rate' },
      { metric: '100%', label: 'Screened High-Net-Worth Inquiries' },
      { metric: '0', label: 'Dropped Inquiries During Meetings' }
    ],
    caseStudy: {
      client: 'Sovereign Wealth Management',
      result: 'Booked $4.2M in new investable assets from after-hours phone inquiries in 90 days',
      quote: 'High-net-worth callers expect immediate white-glove service. Quorik gives our firm an institutional, highly polished voice presence 24/7.',
      author: 'Julian Thorne, Principal Wealth Advisor'
    },
    sampleQuestions: [
      'I am looking for a wealth manager for my $1.5M rollover portfolio.',
      'How do I schedule a retirement planning consultation?',
      'Do you offer tax preparation services for small businesses?'
    ],
    systemPromptPreset: 'You are Eleanor, Executive Client Associate at Sovereign Wealth Management. You assist prospective investors with firm services, asset pre-qualification, and consultation scheduling.',
    faq: [
      { q: 'Is the conversation tone appropriate for high-net-worth clients?', a: 'Yes! We customize the voice, accent, pacing, and vocabulary to reflect institutional-grade sophistication.' }
    ]
  }
};
