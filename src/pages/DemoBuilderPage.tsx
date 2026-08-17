import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Building2, 
  Sparkles, 
  Phone, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Play, 
  Square, 
  RefreshCw, 
  Stethoscope, 
  Home, 
  Scale, 
  Car, 
  Wrench, 
  Smile, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Send, 
  Zap, 
  ExternalLink,
  Laptop,
  Utensils,
  Dumbbell,
  Sun,
  Calculator,
  Scissors,
  Dog,
  Cpu,
  Hotel,
  Briefcase,
  Wand2,
  Search,
  PlusCircle
} from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  agentName: string;
  gender: 'female' | 'male';
  icon: string;
  theme: 'teal' | 'emerald' | 'gold' | 'blue' | 'purple';
  phone: string;
  services: Array<{ title: string; desc: string; price: string }>;
}

const PRESETS: Preset[] = [
  {
    id: 'dental',
    name: 'Apex Dental Studio',
    industry: 'Dental & Healthcare',
    tagline: 'Painless General, Cosmetic & Implant Dentistry in Manhattan',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'dental',
    theme: 'teal',
    phone: '+1 (800) 450-DENT',
    services: [
      { title: 'Teeth Whitening & Veneers', desc: 'Laser teeth whitening and custom porcelain veneers for instant celebrity smile.', price: 'From $299' },
      { title: 'Dental Implants & Crowns', desc: 'Permanent titanium tooth replacement with natural cosmetic crown fitting.', price: 'Free Exam & Consultation' },
      { title: '24/7 Emergency Care', desc: 'Immediate relief for toothaches, broken crowns, and urgent dental injuries.', price: 'Same-Day Slot' }
    ]
  },
  {
    id: 'realestate',
    name: 'Prestige Realty Group',
    industry: 'Real Estate & Property',
    tagline: 'Luxury Residential Properties & Commercial Investments',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'house',
    theme: 'gold',
    phone: '+1 (888) 920-REAL',
    services: [
      { title: 'Luxury Listing & Marketing', desc: '4K video walkthroughs, drone photography, and targeted buyer outreach.', price: '1.5% Listing Rate' },
      { title: 'VIP Buyer Representation', desc: 'Exclusive access to off-market penthouses, villas, and prime plots.', price: 'Free Buyer Advisory' },
      { title: 'Commercial Property Leasing', desc: 'End-to-end office, retail, and industrial lease negotiation.', price: 'Custom Portfolio' }
    ]
  },
  {
    id: 'legal',
    name: 'Vanguard Law Associates',
    industry: 'Legal & Corporate Advisory',
    tagline: 'Corporate Defense, Mergers & High-Asset Estate Planning',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'legal',
    theme: 'blue',
    phone: '+1 (800) 770-LAWS',
    services: [
      { title: 'Corporate Contract & M&A', desc: 'Bulletproof business agreements, partner buyouts, and merger compliance.', price: 'Strategy Retainer' },
      { title: 'High-Net Estate Planning', desc: 'Asset protection, living trusts, and tax-minimized wealth succession.', price: 'Flat Fee Review' },
      { title: 'Commercial Litigation', desc: 'Aggressive courtroom defense and dispute arbitration for business owners.', price: 'Case Evaluation' }
    ]
  },
  {
    id: 'medspa',
    name: 'Radiance Aesthetics & Spa',
    industry: 'Wellness & Skincare',
    tagline: 'Medical Skincare, Laser Treatments & Advanced Rejuvenation',
    agentName: 'Clara',
    gender: 'female',
    icon: 'spa',
    theme: 'purple',
    phone: '+1 (800) 330-GLOW',
    services: [
      { title: 'Botox & Dermal Fillers', desc: 'Natural wrinkle smoothing and lip augmentation by board-certified doctors.', price: '$12 / Unit' },
      { title: 'HydraFacial & Glow Therapy', desc: 'Deep pore cleansing, exfoliation, and antioxidant serum infusion.', price: '$199 Session' },
      { title: 'Painless Laser Hair Removal', desc: 'Triple-wavelength cooling laser for permanent smooth skin.', price: 'Packages From $149' }
    ]
  },
  {
    id: 'hvac',
    name: 'ProFlow Climate & Plumbing',
    industry: 'Home Services & HVAC',
    tagline: '24/7 Emergency Heating, Air Conditioning & Plumbing Service',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'hvac',
    theme: 'emerald',
    phone: '+1 (800) 550-FLOW',
    services: [
      { title: '24/7 Emergency Leak Repair', desc: 'Rapid response for burst pipes, sewer backups, and drain clearing.', price: '$49 Inspection' },
      { title: 'AC & Heating System Tune-Up', desc: 'Comprehensive seasonal maintenance to lower energy bills and prevent outages.', price: '$89 Flat Rate' },
      { title: 'Tankless Water Heater Install', desc: 'On-demand endless hot water conversion with 10-year warranty.', price: 'Free In-Home Quote' }
    ]
  },
  {
    id: 'auto',
    name: 'Apex Auto & Performance',
    industry: 'Auto Repair & Detailing',
    tagline: 'Precision Engine Diagnostics, Brake Service & Ceramic Coating',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'auto',
    theme: 'gold',
    phone: '+1 (800) 780-AUTO',
    services: [
      { title: 'Full Synthetic Oil & Brakes', desc: '60-point inspection, multi-grade oil refresh, and ceramic brake pad replacement.', price: 'From $89' },
      { title: 'Engine Diagnostics & Tuning', desc: 'Computerized OBD-II scanning, performance tuning, and emissions fix.', price: 'Free Scan' },
      { title: 'Paint Correction & Ceramic Shield', desc: 'Multi-stage swirl removal and 5-year hydrophobic ceramic gloss shield.', price: 'Packages From $399' }
    ]
  },
  {
    id: 'restaurant',
    name: 'Savory Bistro & Catering',
    industry: 'Restaurants & Dining',
    tagline: 'Artisanal Farm-to-Table Dining, Fine Wines & Corporate Catering',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'restaurant',
    theme: 'gold',
    phone: '+1 (800) 220-DINE',
    services: [
      { title: 'VIP Table Reservations', desc: 'Guaranteed prime seating for anniversary, birthday, and business dinners.', price: 'Instant Slot' },
      { title: 'Corporate & Wedding Catering', desc: 'Custom multi-course gourmet menus and full banquet service staff.', price: 'Custom Quote' },
      { title: 'Private Chef Experience', desc: 'Exclusive in-home dining with bespoke wine pairings.', price: 'Inquire' }
    ]
  },
  {
    id: 'fitness',
    name: 'Pulse Athletic Club',
    industry: 'Fitness & Sports Studio',
    tagline: '24/7 Elite Gym, HIIT Classes, Personal Training & Recovery Lounge',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'fitness',
    theme: 'teal',
    phone: '+1 (800) 990-PULSE',
    services: [
      { title: 'VIP 1-on-1 Personal Training', desc: 'Customized body transformation coaching and tailored nutrition plan.', price: 'Free Trial Session' },
      { title: 'Unlimited HIIT & Yoga Pass', desc: 'Access over 40 weekly group classes guided by master trainers.', price: '$79 / Month' },
      { title: 'Cryo & Infrared Recovery Lounge', desc: 'Post-workout muscle relief with cryotherapy and sauna pods.', price: 'Per Session' }
    ]
  },
  {
    id: 'solar',
    name: 'Solarix Roofing & Solar',
    industry: 'Solar & Roofing Contracting',
    tagline: 'Zero-Down Solar Panel Installation & Premium Architectural Roofs',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'solar',
    theme: 'gold',
    phone: '+1 (800) 300-SOLAR',
    services: [
      { title: 'Zero-Down Solar Panel Install', desc: 'Tier-1 high efficiency solar panels with 25-year power guarantee.', price: '$0 Down Payment' },
      { title: 'Emergency Roof Replacement', desc: 'Architectural shingles, tile, and metal roofing built for storms.', price: 'Free Drone Audit' },
      { title: 'Battery Backup Storage', desc: 'Whole-home battery backup system for continuous power outages.', price: 'Incentive Rebate' }
    ]
  },
  {
    id: 'accounting',
    name: 'Summit Tax & CPA Advisory',
    industry: 'Accounting & Tax Advisory',
    tagline: 'Strategic Tax Savings, Payroll & CFO Consulting for Business Owners',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'accounting',
    theme: 'blue',
    phone: '+1 (800) 660-TAXES',
    services: [
      { title: 'Corporate Tax Strategy & Audit', desc: 'Maximize legal tax write-offs and shield assets with CPA advisory.', price: 'Free Tax Audit' },
      { title: 'Bookkeeping & Payroll Management', desc: 'Automated QuickBooks management, monthly P&L reports, and payroll.', price: 'Monthly Plans' },
      { title: 'Fractional CFO Consulting', desc: 'High-level financial forecasting and capital growth strategy.', price: 'Monthly Retainer' }
    ]
  },
  {
    id: 'barber',
    name: 'Crown & Blade Grooming',
    industry: 'Barbershop & Beauty Salons',
    tagline: 'Executive Haircuts, Beard Sculpting & Luxury Hot Towel Shaves',
    agentName: 'Arthur',
    gender: 'male',
    icon: 'barber',
    theme: 'emerald',
    phone: '+1 (800) 880-FADE',
    services: [
      { title: 'Executive Cut & Beard Trim', desc: 'Precision fade, hot towel massage, razor lineup, and styling.', price: '$45 Package' },
      { title: 'Straight Razor Hot Towel Shave', desc: 'Traditional lather shave with facial steam treatment and balm.', price: '$35 Session' },
      { title: 'Scalp & Facial Therapy', desc: 'Exfoliating scalp treatment to promote hair health and relaxation.', price: '$30 Add-on' }
    ]
  },
  {
    id: 'vet',
    name: 'Paws & Palms Vet Hospital',
    industry: 'Veterinary & Pet Care',
    tagline: 'Compassionate 24/7 Pet Wellness, Surgery & Urgent Animal Care',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'vet',
    theme: 'teal',
    phone: '+1 (800) 400-PETS',
    services: [
      { title: 'Wellness Exam & Vaccinations', desc: 'Comprehensive nose-to-tail checkup and core puppy/kitten shots.', price: '$59 Nose-to-Tail' },
      { title: '24/7 Emergency Pet Surgery', desc: 'Immediate trauma relief, bloodwork, and advanced surgical care.', price: 'Urgent Slot' },
      { title: 'Dental Cleaning & Polishing', desc: 'Ultrasonic plaque scaling under safe anesthesia for fresh breath.', price: 'Package From $199' }
    ]
  },
  {
    id: 'cleaning',
    name: 'SparklePro Maid & Commercial',
    industry: 'Cleaning & Janitorial',
    tagline: 'Eco-Friendly Residential Deep Cleaning & Commercial Janitorial',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'cleaning',
    theme: 'purple',
    phone: '+1 (800) 220-CLEAN',
    services: [
      { title: 'Move-In / Move-Out Deep Clean', desc: 'Top-to-bottom sanitize of appliances, cabinets, baseboards, and floors.', price: 'From $149' },
      { title: 'Recurring Housekeeping Pass', desc: 'Weekly or bi-weekly eco-friendly cleaning tailored to your home.', price: '$99 Flat Pass' },
      { title: 'Commercial Office Janitorial', desc: 'Daily after-hours office cleaning and floor buffing.', price: 'Custom Quote' }
    ]
  },
  {
    id: 'tech',
    name: 'Vanguard Cyber & IT Solutions',
    industry: 'IT Services & Software',
    tagline: 'Managed IT Support, Cloud Migration & Cyber Security Defense',
    agentName: 'Zephyr',
    gender: 'female',
    icon: 'tech',
    theme: 'blue',
    phone: '+1 (800) 900-TECH',
    services: [
      { title: '24/7 Managed IT Helpdesk', desc: 'Instant remote tech support and workstation management for teams.', price: '$49 / User' },
      { title: 'Cyber Security & Penetration Test', desc: 'Firewall hardening, ransomware protection, and employee training.', price: 'Free Vulnerability Scan' },
      { title: 'Cloud Server & AWS Migration', desc: 'Zero-downtime server migration to AWS or Azure infrastructure.', price: 'Project Quote' }
    ]
  },
  {
    id: 'hotel',
    name: 'Grand Haven Boutique Hotel',
    industry: 'Hotels & Hospitality',
    tagline: 'Luxury Oceanfront Suites, Fine Dining & Event Sanctuaries',
    agentName: 'Clara',
    gender: 'female',
    icon: 'hotel',
    theme: 'purple',
    phone: '+1 (800) 500-STAY',
    services: [
      { title: 'Oceanfront Luxury Suite Booking', desc: 'Panoramic ocean balcony views, king bed, and complimentary spa pass.', price: 'Best Rate Guarantee' },
      { title: 'Private Event & Wedding Venue', desc: 'Full ballroom, beachfront vows, and gourmet banqueting setup.', price: 'Venue Tour' },
      { title: 'Concierge Airport Transfer', desc: 'Chauffeur luxury sedan transfer to and from the airport.', price: '$75 One-Way' }
    ]
  }
];

export function DemoBuilderPage({ embedded = false }: { embedded?: boolean } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Builder Form State
  const [companyName, setCompanyName] = useState('Apex Dental Studio');
  const [tagline, setTagline] = useState('Painless General, Cosmetic & Implant Dentistry');
  const [agentName, setAgentName] = useState('Arthur');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [phone, setPhone] = useState('+1 (800) 450-DENT');
  const [theme, setTheme] = useState<'teal' | 'emerald' | 'gold' | 'blue' | 'purple'>('teal');
  const [logoIcon, setLogoIcon] = useState('dental');

  const [service1, setService1] = useState({ title: 'Teeth Whitening & Veneers', desc: 'Laser teeth whitening and custom porcelain veneers.', price: 'From $299' });
  const [service2, setService2] = useState({ title: 'Dental Implants & Crowns', desc: 'Permanent titanium tooth replacement with natural cosmetic fitting.', price: 'Free Exam' });
  const [service3, setService3] = useState({ title: '24/7 Emergency Care', desc: 'Immediate relief for toothaches and urgent dental injuries.', price: 'Same-Day' });

  // Anti-Spam Safeguard Limit (Default 5 calls per client demo link)
  const [maxCalls, setMaxCalls] = useState<number>(5);

  // Universal Custom Business AI Generator state
  const [customBusinessInput, setCustomBusinessInput] = useState('');
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);

  // Call Simulator State for Client Site
  const [isCallActive, setIsCallActive] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [userQueryInput, setUserQueryInput] = useState('');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([]);
  const [capturedLead, setCapturedLead] = useState<{ callerName: string; topic: string; requestedSlot: string } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'fullpreview'>('builder');

  const recognitionRef = useRef<any>(null);
  const audioFallbackRef = useRef<HTMLAudioElement | null>(null);

  // Load state from URL params on mount if present
  useEffect(() => {
    const urlName = searchParams.get('name');
    if (urlName) {
      setCompanyName(urlName);
      if (searchParams.get('tagline')) setTagline(searchParams.get('tagline')!);
      if (searchParams.get('agent')) setAgentName(searchParams.get('agent')!);
      if (searchParams.get('phone')) setPhone(searchParams.get('phone')!);
      if (searchParams.get('gender')) setGender(searchParams.get('gender') as any);
      if (searchParams.get('theme')) setTheme(searchParams.get('theme') as any);
      if (searchParams.get('icon')) setLogoIcon(searchParams.get('icon')!);

      if (searchParams.get('s1')) setService1(prev => ({ ...prev, title: searchParams.get('s1')! }));
      if (searchParams.get('s1d')) setService1(prev => ({ ...prev, desc: searchParams.get('s1d')! }));
      if (searchParams.get('s2')) setService2(prev => ({ ...prev, title: searchParams.get('s2')! }));
      if (searchParams.get('s2d')) setService2(prev => ({ ...prev, desc: searchParams.get('s2d')! }));
      if (searchParams.get('s3')) setService3(prev => ({ ...prev, title: searchParams.get('s3')! }));
      if (searchParams.get('s3d')) setService3(prev => ({ ...prev, desc: searchParams.get('s3d')! }));
    }
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Keep speech alive
  useEffect(() => {
    let interval: any;
    if (isAiSpeaking) {
      interval = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAiSpeaking]);

  const applyPreset = (preset: Preset) => {
    setCompanyName(preset.name);
    setTagline(preset.tagline);
    setAgentName(preset.agentName);
    setGender(preset.gender);
    setPhone(preset.phone);
    setTheme(preset.theme);
    setLogoIcon(preset.icon);

    if (preset.services[0]) setService1(preset.services[0]);
    if (preset.services[1]) setService2(preset.services[1]);
    if (preset.services[2]) setService3(preset.services[2]);

    // End existing call if any
    endCall();
  };

  const handleAiAutoGenerate = (inputQuery?: string) => {
    const rawQuery = (inputQuery || customBusinessInput || companyName || 'Business').trim();
    if (!rawQuery) return;

    setIsGeneratingProfile(true);

    setTimeout(() => {
      const queryLower = rawQuery.toLowerCase();
      let generatedPreset: Partial<Preset> = {};

      if (queryLower.includes('barber') || queryLower.includes('salon') || queryLower.includes('hair') || queryLower.includes('beauty') || queryLower.includes('fade')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Hair & Grooming`) : 'Crown & Blade Grooming Studio',
          industry: 'Barbershop & Beauty Salon',
          tagline: 'Executive Haircuts, Beard Sculpting & Luxury Hot Towel Shaves',
          agentName: 'Arthur',
          gender: 'male',
          icon: 'barber',
          theme: 'emerald',
          phone: '+1 (800) 880-FADE',
          services: [
            { title: 'Executive Cut & Beard Trim', desc: 'Precision fade, razor lineup, hot towel massage, and beard styling.', price: '$45 Package' },
            { title: 'Straight Razor Hot Towel Shave', desc: 'Traditional lather shave with facial steam treatment and balm.', price: '$35 Session' },
            { title: 'Scalp & Facial Therapy', desc: 'Exfoliating scalp scrub to promote hair health and relaxation.', price: '$30 Add-on' }
          ]
        };
      } else if (queryLower.includes('roof') || queryLower.includes('solar') || queryLower.includes('gutter') || queryLower.includes('construction')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Roofing & Solar`) : 'Solarix Roofing & Solar Pro',
          industry: 'Roofing & Clean Energy',
          tagline: 'Zero-Down Solar Panel Installation & Storm-Proof Architectural Roofs',
          agentName: 'Arthur',
          gender: 'male',
          icon: 'solar',
          theme: 'gold',
          phone: '+1 (800) 300-SOLAR',
          services: [
            { title: 'Zero-Down Solar Installation', desc: 'Tier-1 high efficiency solar panels with 25-year full power warranty.', price: '$0 Down Payment' },
            { title: 'Emergency Roof Replacement', desc: 'Architectural shingles, tile, and metal roofing built for severe weather.', price: 'Free Drone Audit' },
            { title: 'Battery Backup Power', desc: 'Whole-home battery backup system for continuous power during grid outages.', price: 'Rebate Eligible' }
          ]
        };
      } else if (queryLower.includes('gym') || queryLower.includes('fit') || queryLower.includes('crossfit') || queryLower.includes('yoga') || queryLower.includes('trainer')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Athletic Club`) : 'Pulse Fitness & Gym',
          industry: 'Fitness & Sports Studio',
          tagline: '24/7 Elite Gym Access, HIIT Group Classes & Personal Coaching',
          agentName: 'Zephyr',
          gender: 'female',
          icon: 'fitness',
          theme: 'teal',
          phone: '+1 (800) 990-PULSE',
          services: [
            { title: 'VIP 1-on-1 Personal Training', desc: 'Customized body transformation coaching and tailored meal plans.', price: 'Free Trial Pass' },
            { title: 'Unlimited HIIT & Yoga Classes', desc: 'Access over 40 weekly group fitness classes guided by master trainers.', price: '$79 / Month' },
            { title: 'Cryo & Infrared Recovery Lounge', desc: 'Post-workout muscle recovery with cryotherapy pods and infrared sauna.', price: '$25 / Pass' }
          ]
        };
      } else if (queryLower.includes('bake') || queryLower.includes('restaur') || queryLower.includes('bistro') || queryLower.includes('food') || queryLower.includes('pizz') || queryLower.includes('cater')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Gourmet Kitchen`) : 'Savory Bistro & Catering',
          industry: 'Restaurants & Dining',
          tagline: 'Artisanal Farm-to-Table Dining, Fine Wines & Corporate Events',
          agentName: 'Zephyr',
          gender: 'female',
          icon: 'restaurant',
          theme: 'gold',
          phone: '+1 (800) 220-DINE',
          services: [
            { title: 'VIP Table Reservations', desc: 'Guaranteed prime table seating for anniversaries, birthdays, and business dinners.', price: 'Instant Slot' },
            { title: 'Corporate & Wedding Catering', desc: 'Custom multi-course gourmet menus with full banquet service staff.', price: 'Custom Quote' },
            { title: 'Private Chef Experience', desc: 'Exclusive in-home dining with bespoke sommelier wine pairings.', price: 'Inquire' }
          ]
        };
      } else if (queryLower.includes('auto') || queryLower.includes('car') || queryLower.includes('detail') || queryLower.includes('wash') || queryLower.includes('mechanic')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Auto Repair`) : 'Apex Auto & Performance',
          industry: 'Auto Repair & Detailing',
          tagline: 'Precision Engine Diagnostics, Ceramic Coating & Brake Service',
          agentName: 'Arthur',
          gender: 'male',
          icon: 'auto',
          theme: 'gold',
          phone: '+1 (800) 780-AUTO',
          services: [
            { title: 'Full Synthetic Oil & Brakes', desc: '60-point inspection, multi-grade synthetic oil refresh, and ceramic brake pads.', price: 'From $89' },
            { title: 'OBD-II Engine Diagnostics', desc: 'Computerized diagnostic scanning, performance tuning, and emissions check.', price: 'Free Scan' },
            { title: 'Paint Correction & Ceramic Shield', desc: 'Multi-stage swirl removal and 5-year hydrophobic ceramic gloss shield.', price: 'From $399' }
          ]
        };
      } else if (queryLower.includes('pet') || queryLower.includes('vet') || queryLower.includes('dog') || queryLower.includes('cat') || queryLower.includes('groom')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Pet Hospital`) : 'Paws & Palms Vet Hospital',
          industry: 'Veterinary & Pet Care',
          tagline: 'Compassionate 24/7 Pet Wellness, Surgery & Gentle Grooming',
          agentName: 'Clara',
          gender: 'female',
          icon: 'vet',
          theme: 'teal',
          phone: '+1 (800) 400-PETS',
          services: [
            { title: 'Wellness Exam & Shots', desc: 'Comprehensive nose-to-tail physical exam and core puppy/kitten vaccinations.', price: '$59 Checkup' },
            { title: '24/7 Emergency Surgery', desc: 'Immediate trauma relief, bloodwork, digital X-rays, and urgent surgical care.', price: 'Urgent Slot' },
            { title: 'Gentle Pet Spa & Grooming', desc: 'Hypoallergenic bath, coat blowout, nail trim, and ear hygiene.', price: 'From $65' }
          ]
        };
      } else if (queryLower.includes('clean') || queryLower.includes('maid') || queryLower.includes('janitor')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Cleaning Services`) : 'SparklePro Cleaning Services',
          industry: 'Cleaning & Janitorial',
          tagline: 'Eco-Friendly Residential Deep Cleaning & Commercial Office Janitorial',
          agentName: 'Zephyr',
          gender: 'female',
          icon: 'cleaning',
          theme: 'purple',
          phone: '+1 (800) 220-CLEAN',
          services: [
            { title: 'Move-In / Move-Out Deep Clean', desc: 'Top-to-bottom sanitize of appliances, cabinets, baseboards, and floors.', price: 'From $149' },
            { title: 'Recurring Housekeeping Pass', desc: 'Weekly or bi-weekly eco-friendly housekeeping tailored to your home.', price: '$99 Flat Pass' },
            { title: 'Commercial Office Janitorial', desc: 'Daily after-hours office sanitization, desk wiping, and floor care.', price: 'Custom Quote' }
          ]
        };
      } else if (queryLower.includes('tax') || queryLower.includes('account') || queryLower.includes('cpa') || queryLower.includes('finance')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} CPA Advisory`) : 'Summit Tax & Wealth CPA',
          industry: 'Accounting & Tax Advisory',
          tagline: 'Strategic Tax Savings, Payroll & CFO Consulting for Business Owners',
          agentName: 'Arthur',
          gender: 'male',
          icon: 'accounting',
          theme: 'blue',
          phone: '+1 (800) 660-TAXES',
          services: [
            { title: 'Corporate Tax Strategy & Audit', desc: 'Maximize legal tax write-offs and shield assets with licensed CPA advisory.', price: 'Free Tax Audit' },
            { title: 'Bookkeeping & Payroll Management', desc: 'Automated QuickBooks management, monthly P&L financial reports, and payroll.', price: 'Monthly Plans' },
            { title: 'Fractional CFO Consulting', desc: 'High-level financial forecasting, budgeting, and capital growth strategy.', price: 'Retainer' }
          ]
        };
      } else if (queryLower.includes('hotel') || queryLower.includes('resort') || queryLower.includes('stay') || queryLower.includes('lodge')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Hotel & Resort`) : 'Grand Haven Boutique Hotel',
          industry: 'Hotels & Hospitality',
          tagline: 'Luxury Oceanfront Suites, Fine Dining & Exclusive Event Venues',
          agentName: 'Clara',
          gender: 'female',
          icon: 'hotel',
          theme: 'purple',
          phone: '+1 (800) 500-STAY',
          services: [
            { title: 'Oceanfront Luxury Suite Booking', desc: 'Panoramic ocean balcony views, king plush bed, and VIP spa pass.', price: 'Best Rate' },
            { title: 'Private Event & Wedding Venue', desc: 'Full ballroom, beachfront wedding vows, and gourmet banqueting setup.', price: 'Venue Tour' },
            { title: 'Concierge Airport Transfer', desc: 'Chauffeur luxury sedan transfer directly to and from airport terminals.', price: '$75 One-Way' }
          ]
        };
      } else if (queryLower.includes('tech') || queryLower.includes('software') || queryLower.includes('saas') || queryLower.includes('cyber') || queryLower.includes('it')) {
        generatedPreset = {
          name: rawQuery.length > 3 ? (rawQuery.includes(' ') ? rawQuery : `${rawQuery} Cyber & IT`) : 'Vanguard Tech & Cyber Solutions',
          industry: 'IT & Software Services',
          tagline: '24/7 Managed IT Support, Cloud Server Migration & Cyber Security',
          agentName: 'Zephyr',
          gender: 'female',
          icon: 'tech',
          theme: 'blue',
          phone: '+1 (800) 900-TECH',
          services: [
            { title: '24/7 Managed IT Helpdesk', desc: 'Instant remote tech support and workstation security management for teams.', price: '$49 / User' },
            { title: 'Cyber Security & Penetration Test', desc: 'Firewall hardening, ransomware protection, and employee security training.', price: 'Free Scan' },
            { title: 'Cloud Infrastructure Migration', desc: 'Zero-downtime server migration to AWS or Microsoft Azure cloud.', price: 'Project Quote' }
          ]
        };
      } else {
        const capitalizedName = rawQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        generatedPreset = {
          name: capitalizedName.length > 3 ? capitalizedName : 'Apex Custom Business Studio',
          industry: `${capitalizedName} Industry`,
          tagline: `Premier 24/7 Client Advisory, Consultation & Professional Services for ${capitalizedName}`,
          agentName: 'Arthur',
          gender: 'male',
          icon: 'dental',
          theme: 'teal',
          phone: '+1 (800) 550-SERVICE',
          services: [
            { title: 'VIP Consultation & Discovery Slot', desc: '1-on-1 discovery call to evaluate client requirements and build custom roadmap.', price: 'Free Consultation' },
            { title: 'Standard Service Package', desc: 'Comprehensive execution with 100% quality guarantee and dedicated support.', price: 'Custom Quote' },
            { title: '24/7 Urgent Service Hotline', desc: 'Rapid priority response slot for urgent client requests and bookings.', price: 'Same-Day Slot' }
          ]
        };
      }

      setCompanyName(generatedPreset.name || 'Custom Business');
      setTagline(generatedPreset.tagline || '');
      setAgentName(generatedPreset.agentName || 'Arthur');
      setGender(generatedPreset.gender || 'female');
      setPhone(generatedPreset.phone || '+1 (800) 550-0000');
      setTheme(generatedPreset.theme || 'teal');
      setLogoIcon(generatedPreset.icon || 'dental');
      
      if (generatedPreset.services) {
        setService1(generatedPreset.services[0]);
        setService2(generatedPreset.services[1]);
        setService3(generatedPreset.services[2]);
      }

      setIsGeneratingProfile(false);
      setCustomBusinessInput('');
      endCall();
    }, 300);
  };

  const getStandaloneDemoUrl = () => {
    const params = new URLSearchParams();
    params.set('name', companyName);
    params.set('tagline', tagline);
    params.set('agent', agentName);
    params.set('gender', gender);
    params.set('phone', phone);
    params.set('theme', theme);
    params.set('icon', logoIcon);

    params.set('s1', service1.title);
    params.set('s1d', service1.desc);
    params.set('s2', service2.title);
    params.set('s2d', service2.desc);
    params.set('s3', service3.title);
    params.set('s3d', service3.desc);
    params.set('maxCalls', maxCalls.toString());

    return `${window.location.origin}/client-demo?${params.toString()}`;
  };

  const generateShareableLink = () => {
    const fullUrl = getStandaloneDemoUrl();
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const playAudioFallback = (text: string) => {
    try {
      if (audioFallbackRef.current) {
        audioFallbackRef.current.pause();
      }
      const encoded = encodeURIComponent(text.slice(0, 200));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en&client=tw-ob`;
      
      const audio = new Audio(ttsUrl);
      audioFallbackRef.current = audio;
      audio.playbackRate = 0.95;
      audio.onplay = () => setIsAiSpeaking(true);
      audio.onended = () => setIsAiSpeaking(false);
      audio.onerror = () => setIsAiSpeaking(false);
      audio.play().catch(() => setIsAiSpeaking(false));
    } catch (e) {
      setIsAiSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (!('speechSynthesis' in window)) {
      playAudioFallback(text);
      return;
    }

    try {
      window.speechSynthesis.resume();

      const executeSpeak = () => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.92;
          utterance.pitch = gender === 'female' ? 1.08 : 0.90;

          if (typeof window !== 'undefined') {
            (window as any)._speechUtterances = (window as any)._speechUtterances || [];
            (window as any)._speechUtterances.push(utterance);
          }

          const cleanup = () => {
            setIsAiSpeaking(false);
            if (typeof window !== 'undefined' && (window as any)._speechUtterances) {
              (window as any)._speechUtterances = (window as any)._speechUtterances.filter((u: any) => u !== utterance);
            }
          };

          utterance.onstart = () => setIsAiSpeaking(true);
          utterance.onend = cleanup;
          utterance.onerror = () => {
            cleanup();
            playAudioFallback(text);
          };

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          playAudioFallback(text);
        }
      };

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setTimeout(executeSpeak, 60);
      } else {
        executeSpeak();
      }
    } catch (err) {
      playAudioFallback(text);
    }
  };

  const startCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsCallActive(true);
    setCallState('connecting');
    setSimMessages([]);

    setTimeout(() => {
      setCallState('connected');
      const greeting = `Hello and thank you for calling ${companyName}! My name is ${agentName}. I can assist you with our services, answer questions regarding ${service1.title}, ${service2.title}, or ${service3.title}, and schedule your consultation today. How may I help you?`;
      
      setSimMessages([{ sender: 'ai', text: greeting, time: '00:01' }]);
      speakText(greeting);
    }, 400);
  };

  const endCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioFallbackRef.current) {
      audioFallbackRef.current.pause();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsCallActive(false);
    setCallState('ended');
    setIsAiSpeaking(false);
    setIsRecordingMic(false);
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || userQueryInput;
    if (!textToSend.trim() || isAiThinking) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);

    const now = new Date();
    const userTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSimMessages(prev => [...prev, { sender: 'user', text: textToSend, time: userTimeStr }]);
    setUserQueryInput('');
    setIsAiThinking(true);

    try {
      const historyForApi = simMessages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        text: m.text
      }));

      const res = await fetch('/api/voice-agent/simulate-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          userQuery: textToSend,
          conversationHistory: historyForApi,
          customCompany: {
            name: companyName,
            agentName: agentName,
            services: [service1.title, service2.title, service3.title]
          }
        })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await res.json();
      setIsAiThinking(false);

      if (data.success && data.aiSpeechText) {
        const aiTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSimMessages(prev => [...prev, { sender: 'ai', text: data.aiSpeechText, time: aiTimeStr }]);
        speakText(data.aiSpeechText);

        if (data.extractedLead) {
          setCapturedLead({
            callerName: data.extractedLead.callerName || 'Valued Client',
            topic: data.extractedLead.topic || service1.title,
            requestedSlot: data.extractedLead.requestedSlot || 'Tomorrow @ 11:00 AM EST'
          });
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      setIsAiThinking(false);
      const fallback = `Thank you for asking about ${companyName}. I have recorded your request for ${service1.title} and will have our specialist contact you.`;
      setSimMessages(prev => [...prev, { sender: 'ai', text: fallback, time: '00:30' }]);
      speakText(fallback);
    }
  };

  const toggleMicListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query in the input box.");
      return;
    }

    if (isRecordingMic) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsRecordingMic(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsRecordingMic(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (finalTranscript.trim()) {
          setUserQueryInput(finalTranscript);
          recognition.stop();
          setIsRecordingMic(false);
          handleSendQuery(finalTranscript);
        } else if (interim.trim()) {
          setUserQueryInput(interim);
        }
      };

      recognition.onerror = () => setIsRecordingMic(false);
      recognition.onend = () => setIsRecordingMic(false);

      recognition.start();
    } catch (e) {
      setIsRecordingMic(false);
    }
  };

  // Theme styles helper
  const getThemeClasses = () => {
    switch (theme) {
      case 'gold':
        return {
          primary: 'from-amber-500 to-yellow-600',
          border: 'border-amber-500/30 hover:border-amber-500',
          bgGlow: 'bg-amber-500/10',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          accentText: 'text-amber-400',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-black',
        };
      case 'emerald':
        return {
          primary: 'from-emerald-500 to-teal-600',
          border: 'border-emerald-500/30 hover:border-emerald-500',
          bgGlow: 'bg-emerald-500/10',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          accentText: 'text-emerald-400',
          btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-black',
        };
      case 'blue':
        return {
          primary: 'from-blue-500 to-indigo-600',
          border: 'border-blue-500/30 hover:border-blue-500',
          bgGlow: 'bg-blue-500/10',
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          accentText: 'text-blue-400',
          btnBg: 'bg-blue-500 hover:bg-blue-400 text-white',
        };
      case 'purple':
        return {
          primary: 'from-purple-500 to-pink-600',
          border: 'border-purple-500/30 hover:border-purple-500',
          bgGlow: 'bg-purple-500/10',
          badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          accentText: 'text-purple-400',
          btnBg: 'bg-purple-500 hover:bg-purple-400 text-white',
        };
      default: // teal
        return {
          primary: 'from-cyan-400 to-brand-teal',
          border: 'border-brand-teal/30 hover:border-brand-teal',
          bgGlow: 'bg-brand-teal/10',
          badge: 'bg-brand-teal/20 text-brand-teal border-brand-teal/30',
          accentText: 'text-brand-teal',
          btnBg: 'bg-brand-teal hover:bg-cyan-300 text-black',
        };
    }
  };

  const themeStyles = getThemeClasses();

  const getLogoIconComponent = () => {
    switch (logoIcon) {
      case 'dental': return <Stethoscope className="w-5 h-5 text-brand-teal" />;
      case 'house': return <Home className="w-5 h-5 text-amber-400" />;
      case 'legal': return <Scale className="w-5 h-5 text-blue-400" />;
      case 'spa': return <Smile className="w-5 h-5 text-purple-400" />;
      case 'hvac': return <Wrench className="w-5 h-5 text-emerald-400" />;
      case 'auto': return <Car className="w-5 h-5 text-amber-400" />;
      case 'restaurant': return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'fitness': return <Dumbbell className="w-5 h-5 text-cyan-400" />;
      case 'solar': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'accounting': return <Calculator className="w-5 h-5 text-blue-400" />;
      case 'barber': return <Scissors className="w-5 h-5 text-emerald-400" />;
      case 'vet': return <Dog className="w-5 h-5 text-rose-400" />;
      case 'cleaning': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'tech': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'hotel': return <Hotel className="w-5 h-5 text-indigo-400" />;
      default: return <Building2 className="w-5 h-5 text-brand-teal" />;
    }
  };

  return (
    <div className={embedded ? "p-4 md:p-6 bg-[#05060A] text-white" : "pt-28 pb-20 px-4 md:px-8 min-h-screen bg-[#05060A] text-white"}>
      <SEO
        title="Interactive AI Website & Voice Demo Builder | Quorik"
        description="Build a live custom AI website and voice agent preview for any industry in seconds. Test real-time AI speech and appointment booking."
        keywords="AI website builder, voice agent demo, interactive website preview, AI agency demo builder, Quorik builder"
        canonicalPath="/demo-builder"
      />
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal rounded-full text-xs font-mono uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5" /> Quorik Instant Site Builder
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              5-Minute Custom Demo Builder
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Customize any client's company name, logo badge, and 3 services to instantly build a live 1-page website with a fully trained Embedded AI Web Voice Agent.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={getStandaloneDemoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal hover:bg-cyan-300 text-black text-xs font-black uppercase tracking-wider rounded-lg transition-all shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Full Client Demo Site</span>
            </a>

            <button
              onClick={generateShareableLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Shareable Link'}</span>
            </button>
          </div>
        </div>

        {/* Industry Presets & AI Universal Generator Bar */}
        <div className="bg-[#0A0E1A] border border-white/10 p-4 rounded-xl space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-teal animate-pulse" /> 1-Click Presets & Universal AI Business Generator
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Select a preset or enter ANY business name/category to automatically configure a complete website & voice agent.
              </p>
            </div>

            {/* AI Custom Business Generator Input */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customBusinessInput}
                  onChange={(e) => setCustomBusinessInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiAutoGenerate()}
                  placeholder="Type ANY Business (e.g. Barber, Roofing, Bakery)..."
                  className="w-full bg-[#05060A] border border-white/20 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-brand-teal focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleAiAutoGenerate()}
                disabled={isGeneratingProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal hover:bg-cyan-300 text-black text-xs font-black uppercase tracking-wider rounded-lg transition-all shrink-0 shadow-lg disabled:opacity-50"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isGeneratingProfile ? 'animate-spin' : ''}`} />
                <span>{isGeneratingProfile ? 'Generating...' : '✨ AI Auto Fill'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-52 overflow-y-auto pr-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-2.5 text-left border rounded-lg transition-all flex flex-col justify-between ${
                  companyName === p.name 
                    ? 'bg-brand-teal/15 border-brand-teal text-white shadow-lg' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-bold truncate">{p.name}</div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.industry}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Builder Controls & Live Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Customizer Form Controls */}
          <div className="lg:col-span-4 bg-[#0A0E1A] border border-white/10 p-5 rounded-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-teal flex items-center gap-2">
                <Laptop className="w-4 h-4" /> Customized Inputs
              </h2>
              <span className="text-[10px] font-mono text-gray-400">Live Updating</span>
            </div>

            {/* Business Info Inputs */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-gray-300 block">1. Client Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Dental Studio"
                className="w-full bg-[#05060A] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal focus:outline-none"
              />

              <label className="text-xs font-mono text-gray-300 block pt-1">2. Company Tagline / Niche</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Painless General & Cosmetic Dentistry"
                className="w-full bg-[#05060A] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-mono text-gray-300 block">Agent Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-[#05060A] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-300 block">Voice Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2 py-2 text-xs text-white focus:border-brand-teal focus:outline-none mt-1"
                  >
                    <option value="female">Female Voice</option>
                    <option value="male">Male Voice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#05060A] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-teal focus:outline-none mt-1"
                />
              </div>

              {/* Theme, Icon & Anti-Spam Limit */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-mono text-gray-300 block">Brand Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2 py-2 text-xs text-white focus:border-brand-teal focus:outline-none mt-1"
                  >
                    <option value="teal">Cyber Teal</option>
                    <option value="gold">Gold Luxury</option>
                    <option value="emerald">Emerald Green</option>
                    <option value="blue">Sapphire Blue</option>
                    <option value="purple">Violet Tech</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-gray-300 block">Logo Icon</label>
                  <select
                    value={logoIcon}
                    onChange={(e) => setLogoIcon(e.target.value)}
                    className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2 py-2 text-xs text-white focus:border-brand-teal focus:outline-none mt-1"
                  >
                    <option value="dental">Dental Cross</option>
                    <option value="house">Real Estate House</option>
                    <option value="legal">Legal Scale</option>
                    <option value="spa">Wellness Spa</option>
                    <option value="hvac">HVAC Wrench</option>
                    <option value="auto">Auto Repair Car</option>
                    <option value="restaurant">Restaurant Utensils</option>
                    <option value="fitness">Fitness Dumbbell</option>
                    <option value="solar">Solar Energy</option>
                    <option value="accounting">Tax Calculator</option>
                    <option value="barber">Barber Scissors</option>
                    <option value="vet">Pet Veterinary</option>
                    <option value="cleaning">Cleaning Sparkles</option>
                    <option value="tech">IT Cyber CPU</option>
                    <option value="hotel">Hotel Suite</option>
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <label className="text-[11px] font-mono text-gray-300 block flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Anti-Spam Test Call Safeguard</span>
                </label>
                <select
                  value={maxCalls}
                  onChange={(e) => setMaxCalls(parseInt(e.target.value, 10))}
                  className="w-full bg-[#05060A] border border-white/15 rounded-lg px-2.5 py-2 text-xs text-white focus:border-brand-teal focus:outline-none mt-1"
                >
                  <option value={3}>3 Calls Max per Demo Link</option>
                  <option value={5}>5 Calls Max (Recommended)</option>
                  <option value={10}>10 Calls Max</option>
                  <option value={20}>20 Calls Max</option>
                  <option value={0}>Unlimited Calls (No Safeguard)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  Limits client test calls to prevent API credit exhaustion when sharing public links.
                </p>
              </div>
            </div>

            {/* 3 Core Services Customization */}
            <div className="space-y-4 border-t border-white/10 pt-4">
              <div className="text-xs font-mono uppercase tracking-wider text-brand-teal">
                3 Customized Core Services
              </div>

              {/* Service 1 */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <span className="text-[10px] font-mono text-gray-400 block">Service #1</span>
                <input
                  type="text"
                  value={service1.title}
                  onChange={(e) => setService1({ ...service1, title: e.target.value })}
                  placeholder="Service Title"
                  className="w-full bg-[#05060A] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  value={service1.desc}
                  onChange={(e) => setService1({ ...service1, desc: e.target.value })}
                  placeholder="Short Description"
                  className="w-full bg-[#05060A] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-gray-300"
                />
              </div>

              {/* Service 2 */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <span className="text-[10px] font-mono text-gray-400 block">Service #2</span>
                <input
                  type="text"
                  value={service2.title}
                  onChange={(e) => setService2({ ...service2, title: e.target.value })}
                  placeholder="Service Title"
                  className="w-full bg-[#05060A] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  value={service2.desc}
                  onChange={(e) => setService2({ ...service2, desc: e.target.value })}
                  placeholder="Short Description"
                  className="w-full bg-[#05060A] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-gray-300"
                />
              </div>

              {/* Service 3 */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <span className="text-[10px] font-mono text-gray-400 block">Service #3</span>
                <input
                  type="text"
                  value={service3.title}
                  onChange={(e) => setService3({ ...service3, title: e.target.value })}
                  placeholder="Service Title"
                  className="w-full bg-[#05060A] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  value={service3.desc}
                  onChange={(e) => setService3({ ...service3, desc: e.target.value })}
                  placeholder="Short Description"
                  className="w-full bg-[#05060A] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-gray-300"
                />
              </div>
            </div>

          </div>

          {/* RIGHT: Instant Live Generated 1-Page Website Preview */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Web Canvas Container */}
            <div className="bg-[#05060A] border-2 border-white/15 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Browser Top Bar Mock */}
              <div className="bg-[#0D111D] border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="ml-3 text-[11px] font-mono text-gray-400 bg-black/40 px-3 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                    <span className="text-emerald-400">https://</span>
                    <span>{companyName.toLowerCase().replace(/[^a-z0-0]/g, '')}.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <a
                    href={getStandaloneDemoUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-brand-teal hover:text-white transition-colors bg-brand-teal/10 px-2.5 py-1 rounded border border-brand-teal/30"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Standalone ↗</span>
                  </a>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>PREVIEW MODE</span>
                  </div>
                </div>
              </div>

              {/* GENERATED CLIENT WEBSITE CONTENT */}
              <div className="p-6 md:p-8 space-y-12 bg-gradient-to-b from-[#080C16] to-[#040508]">
                
                {/* 1. Client Header Navbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-white/5 border ${themeStyles.border} shadow-md`}>
                      {getLogoIconComponent()}
                    </div>
                    <div>
                      <div className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                        {companyName}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">Official Web Portal & AI Voice Hotline</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <Phone className="w-3.5 h-3.5 text-brand-teal" /> {phone}
                    </div>

                    <button
                      onClick={startCall}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2 transition-transform hover:scale-105 ${themeStyles.btnBg}`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Call {agentName} (AI Agent)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Client Hero Section */}
                <div className="text-center py-8 space-y-5 relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border shadow-inner ${themeStyles.badge}">
                    <Sparkles className="w-3.5 h-3.5" /> 24/7 AI Receptionist Active
                  </div>

                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
                    {tagline}
                  </h2>

                  <p className="text-gray-300 text-xs md:text-sm max-w-xl mx-auto">
                    Welcome to <span className="text-white font-bold">{companyName}</span>. Speak with our 24/7 AI Voice Assistant <span className="text-brand-teal font-bold">{agentName}</span> below to learn about our services or book your slot immediately.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 pt-2">
                    <button
                      onClick={startCall}
                      className={`px-6 py-3 text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-2 ${themeStyles.btnBg}`}
                    >
                      <Phone className="w-4 h-4" /> Speak With AI Agent Now
                    </button>
                  </div>
                </div>

                {/* 3. Client 3 Featured Services Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-brand-teal" /> Featured Services
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">Tailored Solutions</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Service Card 1 */}
                    <div className={`p-5 rounded-xl bg-white/5 border ${themeStyles.border} space-y-3 relative group transition-all hover:-translate-y-1`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Service 01</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${themeStyles.badge}`}>{service1.price || 'Custom'}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-teal transition-colors">{service1.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{service1.desc}</p>
                      <button 
                        onClick={() => handleSendQuery(`I would like to inquire about ${service1.title}`)}
                        className="text-[11px] font-bold text-brand-teal hover:underline flex items-center gap-1 pt-1"
                      >
                        Ask Voice Agent <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Service Card 2 */}
                    <div className={`p-5 rounded-xl bg-white/5 border ${themeStyles.border} space-y-3 relative group transition-all hover:-translate-y-1`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Service 02</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${themeStyles.badge}`}>{service2.price || 'Custom'}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-teal transition-colors">{service2.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{service2.desc}</p>
                      <button 
                        onClick={() => handleSendQuery(`Tell me details regarding ${service2.title}`)}
                        className="text-[11px] font-bold text-brand-teal hover:underline flex items-center gap-1 pt-1"
                      >
                        Ask Voice Agent <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Service Card 3 */}
                    <div className={`p-5 rounded-xl bg-white/5 border ${themeStyles.border} space-y-3 relative group transition-all hover:-translate-y-1`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Service 03</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${themeStyles.badge}`}>{service3.price || 'Custom'}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-teal transition-colors">{service3.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{service3.desc}</p>
                      <button 
                        onClick={() => handleSendQuery(`I need help booking ${service3.title}`)}
                        className="text-[11px] font-bold text-brand-teal hover:underline flex items-center gap-1 pt-1"
                      >
                        Ask Voice Agent <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. EMBEDDED WEB VOICE AGENT LIVE CALL CONSOLE */}
                <div className="bg-[#0A0E1A] border-2 border-brand-teal/40 p-6 rounded-2xl shadow-2xl space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                    <span className="px-2.5 py-1 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[9px] font-mono uppercase tracking-widest rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping"></span> Embedded Voice Engine
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-teal/20 border border-brand-teal/40 rounded-xl">
                      <Phone className="w-6 h-6 text-brand-teal" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        {companyName} — Live Voice Agent Console
                      </h3>
                      <p className="text-xs text-gray-400">
                        Persona: <span className="text-white font-bold">{agentName}</span> ({gender.toUpperCase()}) • Trained on {companyName}'s 3 Services
                      </p>
                    </div>
                  </div>

                  {/* Call Status & Action Controls */}
                  <div className="bg-[#05060A] border border-white/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></div>
                      <div className="text-xs font-mono text-gray-300">
                        Status: <span className="text-white font-bold uppercase">{isCallActive ? 'Live Voice Call Active' : 'Call Idle'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {!isCallActive ? (
                        <button
                          onClick={startCall}
                          className="px-5 py-2.5 bg-brand-teal hover:bg-cyan-300 text-black text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                        >
                          <Phone className="w-4 h-4" /> Start Demo Call
                        </button>
                      ) : (
                        <button
                          onClick={endCall}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-2"
                        >
                          <Square className="w-4 h-4" /> End Call
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Transcript Log Window */}
                  <div className="bg-[#05060A] border border-white/10 rounded-xl p-4 h-48 overflow-y-auto space-y-3 font-sans text-xs">
                    {simMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500 font-mono text-center text-xs">
                        Click "Start Demo Call" or type a query below to test {companyName}'s Voice Agent in real-time.
                      </div>
                    ) : (
                      simMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg max-w-[85%] ${
                            msg.sender === 'ai'
                              ? 'bg-brand-teal/10 border border-brand-teal/30 text-gray-200 mr-auto'
                              : 'bg-white/10 border border-white/20 text-white ml-auto text-right'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-mono text-gray-400">
                            <span className={msg.sender === 'ai' ? 'text-brand-teal font-bold' : 'text-gray-300'}>
                              {msg.sender === 'ai' ? `${agentName} (${companyName})` : 'Caller'}
                            </span>
                            <span>{msg.time}</span>
                          </div>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      ))
                    )}
                    {isAiThinking && (
                      <div className="p-3 rounded-lg bg-brand-teal/5 border border-brand-teal/20 text-brand-teal text-xs mr-auto flex items-center gap-2 font-mono">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {agentName} is formulating response...
                      </div>
                    )}
                  </div>

                  {/* Caller Query Input Box */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userQueryInput}
                      onChange={(e) => setUserQueryInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                      placeholder={`Ask ${agentName} anything about ${service1.title}, ${service2.title}, or pricing...`}
                      className="flex-1 bg-[#05060A] border border-white/20 text-white text-xs px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-teal font-sans"
                    />

                    <button
                      onClick={toggleMicListening}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-bold transition-colors ${
                        isRecordingMic 
                          ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                          : 'bg-white/5 border-white/20 text-gray-300 hover:text-white'
                      }`}
                      title="Speak into Microphone"
                    >
                      {isRecordingMic ? <Mic className="w-4 h-4 text-red-400" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleSendQuery()}
                      disabled={isAiThinking}
                      className="px-5 py-2.5 bg-brand-teal hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Send
                    </button>
                  </div>

                  {/* Lead Captured Box */}
                  {capturedLead && (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-mono">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Lead Captured: <strong>{capturedLead.callerName}</strong> ({capturedLead.topic})</span>
                      </div>
                      <span className="text-[10px] bg-emerald-900/60 px-2 py-1 rounded text-emerald-200">
                        {capturedLead.requestedSlot}
                      </span>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Explanatory Details Section */}
        <div className="bg-[#0A0E1A] border border-white/10 p-6 md:p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Sparkles className="w-6 h-6 text-brand-teal" />
            <div>
              <h3 className="text-lg font-extrabold text-white">How Quorik 5-Minute Custom Demos Drive Agency Sales</h3>
              <p className="text-xs text-gray-400">Deliver unforgettable high-converting live demos to clients before signing contracts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-gray-300">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-teal" /> 1. Tailored Client Branding
              </div>
              <p className="text-gray-400">
                Instantly swap business name, logo, theme, and 3 core services to match any prospective client's niche (Dental, Real Estate, Legal, HVAC, etc.).
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-brand-teal" /> 2. Context-Aware Voice Agent
              </div>
              <p className="text-gray-400">
                The embedded Gemini AI engine dynamically speaks on behalf of the client's business, answering service queries and booking appointments out loud.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4 text-brand-teal" /> 3. One-Click Shareable Link
              </div>
              <p className="text-gray-400">
                Copy the unique demo URL to send to clients directly via WhatsApp, Email, or live sales presentations to close high-ticket website & AI automation retainers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
