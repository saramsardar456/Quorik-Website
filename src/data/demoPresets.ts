export interface ServiceItem {
  title: string;
  desc: string;
  price: string;
  tag?: string;
}

export interface ReviewItem {
  name: string;
  role: string;
  rating: number;
  comment: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface DemoSiteData {
  companyName: string;
  name?: string;
  tagline: string;
  heroSubtext: string;
  agentName: string;
  gender: 'female' | 'male' | 'male-uk' | 'female-uk' | 'male-sales' | 'female-vibrant' | 'male-au' | 'female-au' | string;
  phone: string;
  location: string;
  hours: string;
  theme: 'teal' | 'gold' | 'emerald' | 'blue' | 'purple' | 'crimson' | 'amber';
  logoIcon: string;
  icon?: string;
  maxCalls: number;
  stats: {
    stat1Label: string;
    stat1Val: string;
    stat2Label: string;
    stat2Val: string;
    stat3Label: string;
    stat3Val: string;
  };
  services: ServiceItem[];
  reviews: ReviewItem[];
  faqs: FaqItem[];
}

export interface Preset extends Omit<DemoSiteData, 'companyName' | 'logoIcon'> {
  id: string;
  name: string;
  companyName?: string;
  industry: string;
  icon: string;
  logoIcon?: string;
}

export const THEME_CONFIGS: Record<string, {
  name: string;
  accent: string;
  glow: string;
  btnBg: string;
  badge: string;
  border: string;
  gradient: string;
  textAccent: string;
}> = {
  teal: {
    name: 'Cyber Cyan & Teal',
    accent: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.35)',
    btnBg: 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:from-cyan-300 hover:to-teal-300 shadow-[0_0_20px_rgba(0,229,255,0.4)]',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    border: 'border-cyan-500/30 group-hover:border-cyan-400/60',
    gradient: 'from-cyan-500/20 via-transparent to-transparent',
    textAccent: 'text-cyan-400'
  },
  gold: {
    name: 'Royal Gold & Champagne',
    accent: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.35)',
    btnBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    border: 'border-amber-500/30 group-hover:border-amber-400/60',
    gradient: 'from-amber-500/20 via-transparent to-transparent',
    textAccent: 'text-amber-400'
  },
  emerald: {
    name: 'Emerald Mint & Energy',
    accent: '#10B981',
    glow: 'rgba(16, 185, 129, 0.35)',
    btnBg: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black hover:from-emerald-300 hover:to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    border: 'border-emerald-500/30 group-hover:border-emerald-400/60',
    gradient: 'from-emerald-500/20 via-transparent to-transparent',
    textAccent: 'text-emerald-400'
  },
  blue: {
    name: 'Electric Sapphire & Blue',
    accent: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.35)',
    btnBg: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    border: 'border-blue-500/30 group-hover:border-blue-400/60',
    gradient: 'from-blue-500/20 via-transparent to-transparent',
    textAccent: 'text-blue-400'
  },
  purple: {
    name: 'Midnight Amethyst & Violet',
    accent: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.35)',
    btnBg: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-400 hover:to-fuchsia-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    border: 'border-purple-500/30 group-hover:border-purple-400/60',
    gradient: 'from-purple-500/20 via-transparent to-transparent',
    textAccent: 'text-purple-400'
  },
  crimson: {
    name: 'Sunset Rose & Crimson',
    accent: '#F43F5E',
    glow: 'rgba(244, 63, 94, 0.35)',
    btnBg: 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-400 hover:to-red-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    border: 'border-rose-500/30 group-hover:border-rose-400/60',
    gradient: 'from-rose-500/20 via-transparent to-transparent',
    textAccent: 'text-rose-400'
  },
  amber: {
    name: 'Blaze Orange & Titanium',
    accent: '#FB923C',
    glow: 'rgba(251, 146, 60, 0.35)',
    btnBg: 'bg-gradient-to-r from-orange-400 to-amber-500 text-black hover:from-orange-300 hover:to-amber-400 shadow-[0_0_20px_rgba(251,146,60,0.4)]',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    border: 'border-orange-500/30 group-hover:border-orange-400/60',
    gradient: 'from-orange-500/20 via-transparent to-transparent',
    textAccent: 'text-orange-400'
  }
};

export const PRESETS: Preset[] = [
  {
    id: 'dental',
    name: 'Apex Dental Studio',
    industry: 'Dental & Healthcare',
    tagline: 'Painless General, Cosmetic & Implant Dentistry with 5-Star Comfort',
    heroSubtext: 'Experience modern, anxiety-free dental care in Manhattan. Speak with Arthur, our 24/7 AI Concierge, to get instant price quotes or book your same-day appointment.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'dental',
    theme: 'teal',
    phone: '+1 (800) 450-DENT',
    location: '5th Avenue, Manhattan, NY',
    hours: 'Mon-Sat: 8:00 AM - 7:00 PM | 24/7 AI Hotline',
    maxCalls: 5,
    stats: {
      stat1Label: 'Patient Satisfaction',
      stat1Val: '99.4%',
      stat2Label: 'Emergency Slots',
      stat2Val: 'Same-Day',
      stat3Label: 'Patients Treated',
      stat3Val: '14,200+'
    },
    services: [
      { title: 'Teeth Whitening & Veneers', desc: 'Laser whitening and handcrafted porcelain veneers for an instant red-carpet smile.', price: 'From $299', tag: 'Cosmetic' },
      { title: 'Dental Implants & 3D Imaging', desc: 'Permanent titanium tooth replacement with guided 3D scan and natural crown fitting.', price: 'Free 3D Scan', tag: 'Restorative' },
      { title: '24/7 Urgent Emergency Care', desc: 'Immediate relief for severe toothaches, chipped teeth, and broken crowns within 60 mins.', price: '$49 Exam', tag: 'Urgent' },
      { title: 'Invisalign Clear Aligners', desc: 'Discreet orthodontic straightening with customized smart-track progress trays.', price: 'From $1,800', tag: 'Orthodontics' }
    ],
    reviews: [
      { name: 'Sarah Jenkins', role: 'Verified Patient', rating: 5, comment: 'Called at 11 PM on Sunday and their AI assistant scheduled my emergency filling for 8 AM Monday. Absolute lifesaver!' },
      { name: 'David Miller', role: 'Cosmetic Veneers', rating: 5, comment: 'Painless from start to finish. The team is stellar and the new 3D facility is truly world-class.' },
      { name: 'Elena Rostova', role: 'Invisalign Patient', rating: 5, comment: 'Best dental experience I’ve had in New York. Transparent pricing and zero waiting room delay.' }
    ],
    faqs: [
      { q: 'Do you accept major dental PPO insurances?', a: 'Yes! We accept Delta Dental, MetLife, Cigna, Aetna, Guardian, and offer zero-interest financing plans.' },
      { q: 'How quickly can I be seen for an emergency?', a: 'Our 24/7 AI receptionist can instantly secure a priority same-day emergency slot within 2 hours.' },
      { q: 'Is cosmetic laser whitening safe for sensitive teeth?', a: 'Yes, our proprietary desensitizing gel ensures zero discomfort during and after treatment.' }
    ]
  },
  {
    id: 'roofing',
    name: 'Solarix Roofing & Solar Pro',
    industry: 'Roofing & Clean Energy',
    tagline: 'Zero-Down Solar Panels & Storm-Proof Architectural Roof Replacements',
    heroSubtext: 'Protect your home and eliminate electric bills with Tier-1 solar systems and 50-year guaranteed architectural roofing. Speak with our 24/7 AI estimator to get a free drone assessment.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'solar',
    theme: 'amber',
    phone: '+1 (800) 300-SOLAR',
    location: 'Dallas & Fort Worth, TX',
    hours: 'Mon-Sun: 7:00 AM - 8:00 PM | 24/7 Emergency Tarping',
    maxCalls: 5,
    stats: {
      stat1Label: 'Roofs Installed',
      stat1Val: '3,850+',
      stat2Label: 'Warranty Period',
      stat2Val: '50 Years',
      stat3Label: 'Avg Energy Saved',
      stat3Val: '$2,400/yr'
    },
    services: [
      { title: 'Complete Roof Replacement', desc: 'Severe storm-rated architectural shingles, standing seam metal, and Spanish tile.', price: 'Free Drone Audit', tag: 'Roofing' },
      { title: 'Zero-Down Tier 1 Solar Systems', desc: 'Max-efficiency solar panels with 25-year full generation warranty and battery storage.', price: '$0 Down', tag: 'Solar' },
      { title: 'Emergency Storm & Hail Repair', desc: '24/7 rapid dispatch for wind damage, fallen tree branches, and heavy leak tarping.', price: 'Same-Day Dispatch', tag: 'Emergency' },
      { title: 'Insurance Claim Representation', desc: 'We meet your insurance adjuster on-site to ensure full coverage of storm damages.', price: '100% Free Service', tag: 'Insurance' }
    ],
    reviews: [
      { name: 'Marcus Vance', role: 'Homeowner, Dallas', rating: 5, comment: 'Hailstorm took out our shingles on a Friday. Their AI rep booked an inspection within 5 minutes and the crew finished the new roof in 1 day.' },
      { name: 'Brenda Coleman', role: 'Solar Customer', rating: 5, comment: 'My electric bill dropped from $380/mo to $18/mo. Clean installation and zero upfront costs.' },
      { name: 'Robert Chen', role: 'Commercial Property', rating: 5, comment: 'Top-tier professionalism. The drone inspection video report was extremely comprehensive.' }
    ],
    faqs: [
      { q: 'How much can I save by switching to solar in Texas?', a: 'Most homeowners save between 60% to 95% on their monthly electric utility bill, plus qualify for the 30% Federal Tax Credit.' },
      { q: 'Do you help with insurance claims for hail damage?', a: 'Yes! Our certified insurance specialists handle all documentation and adjuster meetings at zero extra cost to you.' },
      { q: 'How long does a full roof replacement take?', a: 'Most residential roofs are fully torn off, replaced, and cleaned up in a single day.' }
    ]
  },
  {
    id: 'realestate',
    name: 'Prestige Realty Group',
    industry: 'Luxury Real Estate',
    tagline: 'Prime Residential Estates, Waterfront Villas & High-Yield Investments',
    heroSubtext: 'Discover off-market penthouses, beachfront estates, and prime commercial developments with Miami’s premier luxury brokerage. Arthur is available 24/7 to provide private property briefs.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'house',
    theme: 'gold',
    phone: '+1 (888) 920-REAL',
    location: 'Brickell Avenue, Miami, FL',
    hours: 'Mon-Sun: 24/7 VIP Concierge',
    maxCalls: 5,
    stats: {
      stat1Label: 'Closed Volume',
      stat1Val: '$450M+',
      stat2Label: 'Off-Market Access',
      stat2Val: '100% Private',
      stat3Label: 'Avg Days on Market',
      stat3Val: '18 Days'
    },
    services: [
      { title: 'Luxury Waterfront Representation', desc: 'Exclusive access to unlisted waterfront estates, private islands, and luxury penthouses.', price: 'Private Portfolio', tag: 'Residential' },
      { title: 'Global 4K Cinematic Marketing', desc: 'Drone videography, targeted UHNW international buyer outreach, and Architectural Digest features.', price: '1.5% Listing Fee', tag: 'Sellers' },
      { title: 'Commercial Property Acquisition', desc: 'High-yield multi-family, prime retail plazas, and boutique hotel development land.', price: 'Advisory Retainer', tag: 'Commercial' },
      { title: 'Relocation & Concierge Setup', desc: 'VIP tax-friendly Florida domicile transition, private school placement, and yacht mooring.', price: 'Complimentary', tag: 'VIP Concierge' }
    ],
    reviews: [
      { name: 'Alexander Sterling', role: 'UHNW Investor', rating: 5, comment: 'Secured an off-market penthouse on Fisher Island within 72 hours. The speed and discretion were unmatched.' },
      { name: 'Chloe Montgomery', role: 'Estate Seller', rating: 5, comment: 'Sold our Venetian Islands home for $1.2M over asking price in 9 days. Their media production is breathtaking.' },
      { name: 'Harrison Thorne', role: 'Commercial Developer', rating: 5, comment: 'The most analytical and well-connected real estate advisory group in South Florida.' }
    ],
    faqs: [
      { q: 'How do I access your unlisted off-market portfolio?', a: 'Speak with our AI Concierge or submit your buyer profile to receive a private, NDA-protected catalog.' },
      { q: 'What is Florida’s tax advantage for incoming residents?', a: 'Florida has 0% state personal income tax, 0% estate tax, and substantial homestead asset protections.' },
      { q: 'Can you arrange private helicopter or yacht property tours?', a: 'Yes, our VIP concierge coordinates executive private transportation for all qualified estate showings.' }
    ]
  },
  {
    id: 'medspa',
    name: 'Radiance Aesthetics & Laser',
    industry: 'Aesthetics & Wellness',
    tagline: 'Physician-Led Botox, Dermal Fillers & Laser Skin Rejuvenation',
    heroSubtext: 'Enhance your natural beauty with board-certified medical aesthetics, advanced body contouring, and medical-grade facials in Beverly Hills. Book your VIP consultation with our 24/7 AI Concierge.',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'spa',
    theme: 'crimson',
    phone: '+1 (800) 330-GLOW',
    location: 'Rodeo Drive, Beverly Hills, CA',
    hours: 'Tue-Sat: 9:00 AM - 7:00 PM | 24/7 Booking Assistant',
    maxCalls: 5,
    stats: {
      stat1Label: '5-Star Reviews',
      stat1Val: '1,450+',
      stat2Label: 'Board Certified',
      stat2Val: '100% Doctors',
      stat3Label: 'Treatment Comfort',
      stat3Val: 'Zero Downtime'
    },
    services: [
      { title: 'Botox & Subtle Lip Fillers', desc: 'Natural, micro-dosed wrinkle relaxation and hyaluronic lip sculpting by physician injectors.', price: '$12 / Unit', tag: 'Injectables' },
      { title: 'HydraFacial Elite Glow MD', desc: 'Triple-action vortex pore extraction, lymphatic drainage, and antioxidant peptide infusion.', price: '$199 / Session', tag: 'Skin Health' },
      { title: 'Morpheus8 RF Microneedling', desc: 'Collagen-stimulating subdermal remodeling for deep tightening of jawline and neck.', price: 'From $450', tag: 'Anti-Aging' },
      { title: 'Painless Laser Hair Removal', desc: 'Quad-wave cooling laser technology effective on all skin tones with zero discomfort.', price: 'Packages from $149', tag: 'Laser' }
    ],
    reviews: [
      { name: 'Jessica Alba M.', role: 'Loyal Client (3 Yrs)', rating: 5, comment: 'The most subtle, natural Botox in LA. You look refreshed and glowing, never frozen.' },
      { name: 'Dr. Kimberly Adams', role: 'Dermatology Colleague', rating: 5, comment: 'Impeccable sterile technique and state-of-the-art laser machinery. Highly recommend Radiance.' },
      { name: 'Natasha Vance', role: 'HydraFacial Member', rating: 5, comment: 'My skin has never looked this glass-smooth. Their membership program is worth every penny.' }
    ],
    faqs: [
      { q: 'Who performs the injectable treatments?', a: 'All botox, fillers, and biostimulator treatments are performed exclusively by board-certified MDs and nurse practitioners.' },
      { q: 'How long do results from dermal fillers last?', a: 'Depending on the product and treatment area, results last between 9 to 18 months.' },
      { q: 'Is there any downtime after a HydraFacial?', a: 'Zero downtime! You will leave with an immediate luminous red-carpet glow ready for any event.' }
    ]
  },
  {
    id: 'legal',
    name: 'Vanguard Law Associates',
    industry: 'Corporate & Trial Defense',
    tagline: 'High-Asset Corporate Litigation, Mergers & Complex Estate Protection',
    heroSubtext: 'Relentless courtroom advocacy and bulletproof asset protection for founders, executives, and high-net-worth families. Arthur is on standby 24/7 for confidential case intakes.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'legal',
    theme: 'blue',
    phone: '+1 (800) 770-LAWS',
    location: 'Financial District, Chicago, IL',
    hours: '24/7 Confidential Case Evaluation Hotline',
    maxCalls: 5,
    stats: {
      stat1Label: 'Recovered for Clients',
      stat1Val: '$120M+',
      stat2Label: 'Trial Win Rate',
      stat2Val: '96.8%',
      stat3Label: 'Confidentiality',
      stat3Val: '100% Guaranteed'
    },
    services: [
      { title: 'Commercial Contract & M&A', desc: 'Cross-border acquisitions, intellectual property licensing, and shareholder agreements.', price: 'Strategy Retainer', tag: 'Corporate' },
      { title: 'High-Net Living Trusts & Estates', desc: 'Dynasty trusts, generational tax shields, and private family office governance structures.', price: 'Flat-Fee Review', tag: 'Asset Protection' },
      { title: 'High-Stakes Business Litigation', desc: 'Aggressive trial defense for breach of fiduciary duty, IP theft, and partnership disputes.', price: 'Case Evaluation', tag: 'Litigation' },
      { title: 'Regulatory Compliance & SEC Defense', desc: 'White-collar defense, SEC inquiry navigation, and executive internal audits.', price: 'Immediate Counsel', tag: 'Compliance' }
    ],
    reviews: [
      { name: 'Gregory Vance, CEO', role: 'FinTech Founder', rating: 5, comment: 'Vanguard dismantled a $15M predatory lawsuit before it even reached trial. Absolute masters of corporate law.' },
      { name: 'Marianne DuPont', role: 'Family Office Director', rating: 5, comment: 'Restructured our multi-generational estate trusts seamlessly. Unrivaled tax efficiency and peace of mind.' },
      { name: 'Thomas Keller', role: 'Commercial Real Estate', rating: 5, comment: 'Responsive 24/7. When a midnight injunction was filed, their team had our response ready by sunrise.' }
    ],
    faqs: [
      { q: 'Is my initial call confidential under attorney-client privilege?', a: 'Yes, all case evaluation inquiries and AI voice interactions are protected under preliminary legal confidentiality.' },
      { q: 'What fee structures do you offer?', a: 'We offer structured flat fees for estate plans and contracts, competitive hourly retainers, and hybrid fee arrangements for select litigation.' },
      { q: 'How quickly can your litigation team file emergency motions?', a: 'Our trial team is equipped for emergency 24-hour TROs (Temporary Restraining Orders) and injunctions.' }
    ]
  },
  {
    id: 'hvac',
    name: 'ProFlow Climate & 24/7 Plumbing',
    industry: 'Home Services & HVAC',
    tagline: 'Emergency AC, Heating & Plumbing Repair with Guaranteed Same-Day Fix',
    heroSubtext: 'Never suffer in the heat or freeze in the cold. Certified master technicians dispatched within 45 minutes across the metro area. Speak with Arthur to book immediate emergency dispatch.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'hvac',
    theme: 'emerald',
    phone: '+1 (800) 550-FLOW',
    location: 'Phoenix & Scottsdale, AZ',
    hours: '24 Hours / 7 Days a Week / 365 Days a Year',
    maxCalls: 5,
    stats: {
      stat1Label: 'Avg Arrival Time',
      stat1Val: '38 Mins',
      stat2Label: 'Upfront Pricing',
      stat2Val: '100% Fixed',
      stat3Label: 'Repairs Completed',
      stat3Val: '28,000+'
    },
    services: [
      { title: 'Emergency AC Repair & Diagnostics', desc: 'Rapid refrigerant leak detection, compressor replacement, and capacitor tune-ups.', price: '$49 Diagnostic', tag: 'Cooling' },
      { title: 'Complete High-Efficiency Heat Pump', desc: '20+ SEER variable-speed systems with 10-year parts & labor warranty and utility rebates.', price: 'Free Estimate', tag: 'Install' },
      { title: 'Hydro-Jetting & Trenchless Pipe', desc: 'High-pressure sewer clearing and no-dig pipe lining with 50-year structural warranty.', price: 'Same-Day Service', tag: 'Plumbing' },
      { title: 'Tankless Water Heater Upgrades', desc: 'Continuous endless hot water with 40% energy savings and space-saving wall mounts.', price: 'From $1,299', tag: 'Hot Water' }
    ],
    reviews: [
      { name: 'Carl Simmons', role: 'Homeowner, Phoenix', rating: 5, comment: 'AC blew warm air on a 115°F Sunday afternoon. Technician was at my door in 35 minutes and had us cold again.' },
      { name: 'Diana Ross', role: 'Property Manager', rating: 5, comment: 'Managing 24 rental units, ProFlow is the only HVAC team I trust. Transparent quotes and zero surprise fees.' },
      { name: 'Samuel Ortiz', role: 'Tankless Install', rating: 5, comment: 'Clean work, polite technicians, and they left the workspace spotless. Top notch company.' }
    ],
    faqs: [
      { q: 'Do you charge extra for nights and weekends?', a: 'No! We maintain standard transparent flat-rate pricing 24 hours a day, 7 days a week.' },
      { q: 'Are your technicians licensed and background-checked?', a: '100% of our technicians are master certified, drug-tested, and background-verified for your safety.' },
      { q: 'What warranties do you provide on new HVAC installations?', a: 'We provide a 10-year manufacturer warranty plus our exclusive 5-year ProFlow 100% labor guarantee.' }
    ]
  },
  {
    id: 'auto',
    name: 'Apex Auto & Performance Tuning',
    industry: 'Auto Repair & Exotics',
    tagline: 'Precision European Engine Diagnostics, Brake Overhauls & Ceramic Coating',
    heroSubtext: 'Dealership-grade technology with personalized independent care for Porsche, BMW, Mercedes, Audi, and domestic performance vehicles. Arthur is ready 24/7 to quote your service.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'auto',
    theme: 'amber',
    phone: '+1 (800) 780-AUTO',
    location: 'Houston & The Woodlands, TX',
    hours: 'Mon-Fri: 7:30 AM - 6:30 PM | Sat: 8:00 AM - 3:00 PM',
    maxCalls: 5,
    stats: {
      stat1Label: 'Warranty on Repairs',
      stat1Val: '3Yr / 36k Mi',
      stat2Label: 'Certified Techs',
      stat2Val: 'ASE Master',
      stat3Label: 'Vehicles Serviced',
      stat3Val: '19,500+'
    },
    services: [
      { title: 'Factory Computer Diagnostics', desc: 'OEM coding, electrical troubleshooting, and ECU performance map optimization.', price: '$89 Scan', tag: 'Diagnostics' },
      { title: 'Performance Ceramic Brakes & Fluid', desc: 'Brembo & OEM ceramic pads, slotted rotors, and high-temp DOT 5.1 brake flush.', price: 'From $199', tag: 'Brakes' },
      { title: 'Stage 1-3 Engine Tune & Dyno', desc: 'Custom dynamometer tuning, turbo upgrades, and stainless exhaust fabrication.', price: 'Custom Quote', tag: 'Tuning' },
      { title: 'Multi-Stage Paint Correction & Ceramic', desc: '9H hardness graphene ceramic coating with 5-year hydrophobic shine guarantee.', price: 'From $499', tag: 'Detailing' }
    ],
    reviews: [
      { name: 'Victor Vance', role: 'Porsche 911 GT3 Owner', rating: 5, comment: 'They diagnosed a misfire that two separate official dealerships failed to solve. Honest mechanics with genuine passion.' },
      { name: 'Samantha Reed', role: 'BMW M4 Driver', rating: 5, comment: 'The ceramic coating looks like liquid glass! Plus their loaner car program made the whole process effortless.' },
      { name: 'Derrick Moore', role: 'Audi RS6 Avant', rating: 5, comment: 'Transparent digital inspection reports with photos sent straight to your phone. 10/10 service.' }
    ],
    faqs: [
      { q: 'Do repairs at your shop void my new car factory warranty?', a: 'No! Under the Federal Magnuson-Moss Act, using our certified technicians maintains 100% of your factory warranty.' },
      { q: 'Do you offer complimentary loaner vehicles?', a: 'Yes, we have a fleet of clean loaner cars available for any service taking longer than 3 hours.' },
      { q: 'What warranty is included on replacement parts?', a: 'All our repairs include a 3-Year / 36,000-Mile Nationwide Peace of Mind Warranty.' }
    ]
  },
  {
    id: 'dining',
    name: 'Bella Vista Trattoria & Wine Bar',
    industry: 'Fine Dining & Hospitality',
    tagline: 'Handmade Artisanal Pasta, Wood-Fired Neapolitan Pizza & Sommelier Cellar',
    heroSubtext: 'Immerse your senses in authentic Roman gastronomy and rare vintage Italian wines in downtown Seattle. Speak with Arthur, our 24/7 AI Sommelier, to reserve your private table or banquet.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'restaurant',
    theme: 'gold',
    phone: '+1 (800) 990-DINE',
    location: 'Pike Place District, Seattle, WA',
    hours: 'Tue-Sun: 4:30 PM - 11:00 PM | 24/7 Table Booking',
    maxCalls: 5,
    stats: {
      stat1Label: 'Michelin Guide',
      stat1Val: 'Recommended',
      stat2Label: 'Wine Labels',
      stat2Val: '450+ Bottles',
      stat3Label: 'Table Satisfaction',
      stat3Val: '99.8%'
    },
    services: [
      { title: 'Chef Tasting Menu with Wine Pairing', desc: '7-course seasonal culinary journey paired with rare reserve Barolo and Brunello vintages.', price: '$145 / Person', tag: 'Signature' },
      { title: 'Private Wine Cellar Dining Room', desc: 'Exclusive dining room for private celebrations, corporate events, and wedding banquets.', price: 'Up to 24 Guests', tag: 'Private Events' },
      { title: 'Handmade Black Truffle Tagliolini', desc: 'Fresh egg pasta tossed in 24-month Parmigiano-Reggiano wheel with shaved Norcia truffles.', price: '$38 A La Carte', tag: 'Fresh Pasta' },
      { title: 'Catering & Mobile Pizza Oven Service', desc: 'Full-service catering with our imported Italian wood-fired oven for private estate parties.', price: 'Custom Menu', tag: 'Catering' }
    ],
    reviews: [
      { name: 'Chef Anthony Laurent', role: 'Food & Wine Critic', rating: 5, comment: 'The Cacio e Pepe and truffle pasta rival the best trattorias in Trastevere, Rome. Extraordinary cellar.' },
      { name: 'Emily Thorne', role: 'Anniversary Dinner', rating: 5, comment: 'Reserved through their AI voice agent in 30 seconds. When we arrived, our table had champagne ready.' },
      { name: 'Marco Bellini', role: 'Private Event Host', rating: 5, comment: 'Hosted our company executive dinner in the cellar. Flawless hospitality from start to finish.' }
    ],
    faqs: [
      { q: 'Do you accommodate gluten-free and vegan dietary needs?', a: 'Yes! We craft house-made gluten-free pasta and offer a dedicated vegan tasting menu upon request.' },
      { q: 'What is the dress code at Bella Vista?', a: 'Smart casual to elegant evening attire is recommended.' },
      { q: 'Can I bring my own bottle of wine (corkage)?', a: 'Yes, corkage is $35 per 750ml bottle for labels not currently represented on our master wine list.' }
    ]
  },
  {
    id: 'fitness',
    name: 'Pulse Elite Athletic Club',
    industry: 'Fitness & Performance',
    tagline: 'Science-Backed Strength Conditioning, Cryotherapy & 1-on-1 Coaching',
    heroSubtext: 'Transform your body and athletic longevity with olympic-grade equipment, infrared sauna recovery, and elite trainers. Speak with our 24/7 AI coach to claim your VIP 3-Day Pass.',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'fitness',
    theme: 'teal',
    phone: '+1 (800) 650-PULSE',
    location: 'South Beach, Miami, FL',
    hours: 'Open 24/7/365 with Keycard & AI Access',
    maxCalls: 5,
    stats: {
      stat1Label: 'Member Transformation',
      stat1Val: '94% Success',
      stat2Label: 'Facility Size',
      stat2Val: '25,000 Sq Ft',
      stat3Label: 'Recovery Tech',
      stat3Val: 'Full Spa & Cryo'
    },
    services: [
      { title: 'Elite Personal Strength Coaching', desc: 'Custom biomechanics analysis, progressive overload programming, and macro nutrition planning.', price: 'From $75 / Session', tag: 'Coaching' },
      { title: 'Unlimited All-Access Club Membership', desc: '24/7 keycard access, cold plunge pools, infrared sauna, and high-intensity group classes.', price: '$129 / Month', tag: 'Membership' },
      { title: 'Cryotherapy & Contrast Hydrotherapy', desc: '-160°F whole-body cryo chamber, hot/cold contrast baths for accelerated muscle recovery.', price: '$45 Session', tag: 'Recovery' },
      { title: 'VO2 Max & Metabolic Body Composition', desc: 'Clinical DEXA body fat scan and cardio metabolic efficiency assessment.', price: '$150 Test', tag: 'Biometrics' }
    ],
    reviews: [
      { name: 'Jason Miller', role: 'Member (2 Yrs)', rating: 5, comment: 'Dropped 30 lbs of fat and gained 12 lbs of muscle with their training protocol. Best gym in Florida.' },
      { name: 'Alexis Sterling', role: 'Triathlete', rating: 5, comment: 'The cold plunge and infrared sauna recovery suite is a game-changer for athletic performance.' },
      { name: 'Dr. Ryan Cooper', role: 'Sports Physician', rating: 5, comment: 'Uncompromising standard of cleanliness, state-of-the-art Keiser equipment, and great community.' }
    ],
    faqs: [
      { q: 'What is included in the complimentary 3-day guest pass?', a: 'Your guest pass includes full facility access, one group HIIT class, and an intro body composition scan.' },
      { q: 'Is there a long-term contract or cancellation fee?', a: 'No, we believe in earning your membership every month. All plans are flexible month-to-month.' },
      { q: 'Is the facility open on holidays?', a: 'Yes! Members enjoy 24/7 keycard access 365 days a year, including all major holidays.' }
    ]
  }
];

export function generateSmartDemoData(businessQuery: string): Partial<DemoSiteData> {
  const q = (businessQuery || '').toLowerCase().trim();
  
  if (q.includes('barber') || q.includes('fade') || q.includes('haircut') || q.includes('salon')) {
    return {
      companyName: businessQuery.includes(' ') ? businessQuery : `${businessQuery} Grooming Lounge`,
      tagline: 'Executive Haircuts, Precision Beard Sculpting & Luxury Hot Towel Shaves',
      heroSubtext: 'Experience classic craftsmanship and modern styling in an upscale, relaxed atmosphere. Speak with Arthur to book your chair instantly.',
      theme: 'emerald',
      logoIcon: 'barber',
      agentName: 'Arthur',
      gender: 'male',
      phone: '+1 (800) 880-FADE',
      location: 'Downtown Arts District',
      hours: 'Tue-Sat: 9:00 AM - 7:30 PM | 24/7 AI Booking',
      stats: { stat1Label: '5-Star Reviews', stat1Val: '850+', stat2Label: 'Master Barbers', stat2Val: '10+ Pros', stat3Label: 'Complimentary', stat3Val: 'Cold Craft Brew' },
      services: [
        { title: 'Executive Fade & Beard Sculpting', desc: 'Precision skin fade, straight razor lineup, hot lather beard trim, and soothing oil massage.', price: '$55 Package', tag: 'Signature' },
        { title: 'Traditional Straight Razor Shave', desc: 'Pre-shave essential oils, 3 hot steam towels, badger brush lather, and cooling aftershave balm.', price: '$40 Session', tag: 'Classic' },
        { title: 'Royal Scalp Detox & Face Steam', desc: 'Tea tree exfoliating scalp treatment, facial steam scrub, and pore tightening cold mask.', price: '$35 Add-on', tag: 'Spa' },
        { title: 'Father & Son VIP Combo Cut', desc: 'Side-by-side chair styling with complimentary beverages and styling pomade.', price: '$85 Duo', tag: 'Special' }
      ],
      reviews: [
        { name: 'Marcus Vance', role: 'Executive Client', rating: 5, comment: 'Sharpest taper fade in town and Arthur booked my Friday evening slot in under 30 seconds!' },
        { name: 'Derek Thorne', role: 'Regular Member', rating: 5, comment: 'Hot towel shave and beard sculpting are unmatched. Always consistent, professional, and on time.' },
        { name: 'Julian Hayes', role: 'Verified Client', rating: 5, comment: 'Clean shop, great atmosphere, and zero waiting time. Best barbershop experience hands down.' }
      ],
      faqs: [
        { q: 'Do you accept walk-ins or appointments only?', a: 'We accept walk-ins when available, but reserving your slot via our AI receptionist guarantees zero waiting room time.' },
        { q: 'What is included in the Executive Fade & Beard package?', a: 'It includes custom hair consultation, precision fade, straight razor perimeter lineup, hot lather beard trim, and styling balm.' },
        { q: 'Can I book for multiple people at once?', a: 'Yes! Our AI voice agent or online portal can schedule back-to-back or combo sessions for fathers, sons, and groups.' }
      ]
    };
  }

  if (q.includes('vet') || q.includes('pet') || q.includes('dog') || q.includes('cat') || q.includes('animal')) {
    return {
      companyName: businessQuery.includes(' ') ? businessQuery : `${businessQuery} Veterinary Hospital`,
      tagline: 'Compassionate 24/7 Veterinary Medicine, Surgery & Wellness Care',
      heroSubtext: 'Gentle, fear-free medical care for your beloved pets. From routine vaccinations to emergency surgery, Arthur is on standby 24/7 to assist your pet.',
      theme: 'teal',
      logoIcon: 'vet',
      agentName: 'Zephyr',
      gender: 'female',
      phone: '+1 (800) 720-PETS',
      location: 'Oakridge Plaza, Austin, TX',
      hours: '24/7 Emergency Animal Hospital',
      stats: { stat1Label: 'Pets Healed', stat1Val: '22,000+', stat2Label: 'Fear-Free Certified', stat2Val: '100% Staff', stat3Label: 'Emergency Care', stat3Val: '24/7 Live' },
      services: [
        { title: 'Comprehensive Wellness Exam', desc: 'Full nose-to-tail physical exam, vital diagnostics, vaccine titers, and parasite prevention.', price: '$65 Exam', tag: 'Preventive' },
        { title: 'Ultrasonic Dental Cleaning', desc: 'General anesthesia scaling, gum pocket treatment, polishing, and digital dental X-rays.', price: 'From $250', tag: 'Dental' },
        { title: '24/7 Urgent Emergency Surgery', desc: 'Immediate trauma stabilization, digital ultrasound, oxygen therapy, and soft-tissue surgery.', price: 'Immediate Intake', tag: 'Emergency' },
        { title: 'Laser Pain Relief Therapy', desc: 'Non-invasive photobiomodulation for arthritis, hip dysplasia, and rapid wound healing.', price: '$45 Session', tag: 'Therapy' }
      ],
      reviews: [
        { name: 'Jessica Vance', role: 'Golden Retriever Mom', rating: 5, comment: 'Called at midnight in a panic when Milo ate chocolate. Zephyr triaged him calmly and had a room ready!' },
        { name: 'Dr. Michael Chen', role: 'Dog Foster Care', rating: 5, comment: 'The most compassionate veterinarians in the state. Transparent fees and true fear-free handling.' },
        { name: 'Rachel Gomez', role: 'Cat Owner', rating: 5, comment: 'They treat every pet like family. Clean surgical suite, kind technicians, and 24/7 peace of mind.' }
      ],
      faqs: [
        { q: 'Do you accept emergency cases without prior notice?', a: 'Yes! Our emergency intake is open 24/7/365. You can call our AI concierge anytime so our trauma staff is prepped on arrival.' },
        { q: 'Do you offer pet insurance direct billing or payment plans?', a: 'We work with all major pet insurance providers (Trupanion, Nationwide, Healthy Paws) and offer 0% APR CareCredit.' },
        { q: 'How do you keep anxious dogs and cats calm?', a: 'We are 100% Fear-Free certified, featuring pheromone-infused waiting rooms, separate cat/dog entrances, and gentle handling techniques.' }
      ]
    };
  }

  if (q.includes('clean') || q.includes('maid') || q.includes('janitor') || q.includes('housekeeping')) {
    return {
      companyName: businessQuery.includes(' ') ? businessQuery : `${businessQuery} Cleaning Co`,
      tagline: 'Eco-Friendly Residential Deep Cleaning & Commercial Janitorial Services',
      heroSubtext: 'Immaculate, hospital-grade sanitized spaces with 100% bonded and insured cleaners. Speak with our 24/7 AI coordinator for an instant custom estimate.',
      theme: 'emerald',
      logoIcon: 'cleaning',
      agentName: 'Arthur',
      gender: 'male',
      phone: '+1 (800) 440-MAID',
      location: 'Metro Area & Suburbs',
      hours: 'Mon-Sun: 7:00 AM - 8:00 PM | 24/7 Online Quotes',
      stats: { stat1Label: 'Homes Cleaned', stat1Val: '18,500+', stat2Label: 'Satisfaction', stat2Val: '100% Guaranteed', stat3Label: 'Eco-Safe Products', stat3Val: '100% Non-Toxic' },
      services: [
        { title: 'Whole-Home Deep Clean & Sanitize', desc: 'Inside oven/fridge, baseboards, window sills, bathroom descaling, and HEPA floor scrub.', price: 'From $179', tag: 'Residential' },
        { title: 'Move-In / Move-Out Turnover', desc: 'Comprehensive deposit-back cleaning for tenants, landlords, and real estate staging.', price: 'Flat Rate Quote', tag: 'Turnover' },
        { title: 'Recurring Weekly / Bi-Weekly Maid', desc: 'Reliable dedicated cleaning team keeping your home pristine on autopilot.', price: 'Save 20% on Plans', tag: 'Recurring' },
        { title: 'Commercial Office & Medical Facility', desc: 'Nightly janitorial sanitation, trash removal, restroom stocking, and floor buffing.', price: 'Custom Bid', tag: 'Commercial' }
      ],
      reviews: [
        { name: 'Katherine Lewis', role: 'Homeowner', rating: 5, comment: 'House smelled clean and fresh without chemical fumes. They even cleaned inside the oven and behind the fridge!' },
        { name: 'Robert Tanaka', role: 'Property Manager', rating: 5, comment: 'They clean our 24 rental units between tenants. Flawless turnover inspection every single time.' },
        { name: 'Samantha Ross', role: 'Bi-Weekly Client', rating: 5, comment: 'Having the same trusted crew every 2 weeks gives me my entire weekend back. Worth every penny!' }
      ],
      faqs: [
        { q: 'Are your cleaning technicians background-checked and insured?', a: 'Yes, 100% of our staff undergo comprehensive background checks and are fully bonded and insured with $2M liability coverage.' },
        { q: 'Do I need to supply cleaning products or vacuums?', a: 'No, our team arrives fully equipped with hospital-grade HEPA vacuums, microfiber systems, and plant-based non-toxic detergents.' },
        { q: 'What happens if I am unsatisfied with a spot or room?', a: 'We offer an ironclad 24-Hour Clean Guarantee: notify us within 24 hours and a supervisor will return to re-clean the area free of charge.' }
      ]
    };
  }

  // Universal Default Heuristic Generator
  const formattedName = businessQuery.length > 2 
    ? (businessQuery.includes(' ') ? businessQuery : `${businessQuery} Solutions & Advisory`) 
    : 'Apex Commercial Partners';

  return {
    companyName: formattedName,
    tagline: `Premier Client Solutions, Dedicated 24/7 Service & 5-Star Excellence`,
    heroSubtext: `Delivering industry-leading standards, transparent pricing, and rapid execution for ${formattedName}. Arthur is available 24/7 to answer questions and schedule appointments.`,
    theme: 'teal',
    logoIcon: 'tech',
    agentName: 'Arthur',
    gender: 'male',
    phone: '+1 (800) 550-0199',
    location: 'Metropolitan Center, Suite 400',
    hours: 'Mon-Sat: 8:00 AM - 7:00 PM | 24/7 AI Hotline',
    stats: { stat1Label: 'Client Satisfaction', stat1Val: '99.2%', stat2Label: 'Average Response', stat2Val: '< 15 Mins', stat3Label: 'Clients Served', stat3Val: '5,000+' },
    services: [
      { title: 'Premium Core Service & Consultation', desc: 'Comprehensive diagnosis, tailored implementation plan, and dedicated specialist oversight.', price: 'From $299', tag: 'Core Service' },
      { title: 'Priority Expedited Delivery & Support', desc: 'Accelerated turnaround with 24/7 direct communication and guaranteed milestone delivery.', price: 'Free Consultation', tag: 'Fast Track' },
      { title: 'Full-Service Maintenance & Retainer', desc: 'Proactive monitoring, regular optimizations, and zero-downtime preventative care.', price: 'Custom Quote', tag: 'Enterprise' },
      { title: 'Emergency On-Demand Dispatch', desc: 'Rapid response team deployed for urgent troubleshooting and mission-critical interventions.', price: 'Same-Day Slot', tag: 'Urgent' }
    ],
    reviews: [
      { name: 'Sarah Jenkins', role: 'Verified Client', rating: 5, comment: `Called after business hours and ${formattedName}'s AI receptionist Arthur secured my priority appointment in under 1 minute!` },
      { name: 'David Miller', role: 'Repeat Customer', rating: 5, comment: `Transparent pricing, zero waiting room delays, and genuine 24/7 responsiveness. Highly recommended.` },
      { name: 'Elena Rostova', role: 'Managing Director', rating: 5, comment: `Exceeded all expectations with immaculate execution and professional communication from day one.` }
    ],
    faqs: [
      { q: `How quickly can I be scheduled with ${formattedName}?`, a: `Our 24/7 AI Voice Concierge can instantly verify availability and secure a priority slot within 60 seconds.` },
      { q: `What pricing and payment options are available?`, a: `We offer transparent upfront quotes, flexible payment schedules, and major card/invoice options with zero surprise fees.` },
      { q: `Can I speak with a live representative directly?`, a: `Yes! You can speak directly to our AI voice concierge right here, or call our direct phone line anytime.` }
    ]
  };
}
