import ceoImage from '../assets/images/ceo_shehram_exact_1787773615857.jpg';
import mrImage from '../assets/images/mr_tech_director_exact_1787773636586.jpg';
import akImage from '../assets/images/ak_voice_exact_1787773652611.jpg';
import farhajImage from '../assets/images/farhaj_ops_exact_1787773678438.jpg';
import dcImage from '../assets/images/dc_lead_exact_1787773700053.jpg';
import erImage from '../assets/images/team_er_architect_1787845901729.jpg';

export interface TeamMember {
  id: string;
  order: number;
  name: string;
  displayRole: string;
  badge: string;
  tagline: string;
  image: string;
  bio: string;
  specialties: string[];
  techStack: string[];
  responsibilities: string[];
  stats: { label: string; value: string }[];
  linkedin?: string;
  isFounder?: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'shehram-meellu',
    order: 1,
    name: 'Shehram Meellu',
    displayRole: 'Founder & CEO / Lead Developer',
    badge: 'Executive & Technical Leadership',
    tagline: 'Building Scalable Solutions. Driving Innovation.',
    image: ceoImage,
    bio: 'Founder and Chief Executive Officer of Quorik Systems. Senior AI engineering architect and full-stack technologist pioneering the convergence of high-performance web engineering with autonomous 24/7 AI voice intelligence.',
    specialties: [
      'Autonomous AI Voice Architectures',
      'High-Performance Edge Web Engineering',
      'System Scalability & Product Strategy',
      'Executive Technology Vision'
    ],
    techStack: ['Gemini AI', 'TypeScript', 'React', 'Node.js', 'Next.js', 'WebSockets', 'Cloud Architecture'],
    responsibilities: [
      'Sets overarching company roadmap and proprietary AI product innovation',
      'Oversees end-to-end full-stack software development and client architectures',
      'Spearheads strategic partnerships and enterprise agency alliances'
    ],
    stats: [
      { label: 'Role', value: 'Founder & CEO' },
      { label: 'Focus', value: 'AI & Full-Stack' },
      { label: 'Leadership', value: 'Core Council' }
    ],
    linkedin: 'https://www.linkedin.com/in/shehram-meellu-218812370',
    isFounder: true
  },
  {
    id: 'm-r',
    order: 2,
    name: 'M.R.',
    displayRole: 'Tech Director',
    badge: 'Technology Direction',
    tagline: 'Architecting Resilient, High-Throughput Digital Foundations.',
    image: mrImage,
    bio: 'Directs Quorik’s global technology standards, backend infrastructure, and software scalability paradigms. Ensures microsecond response times and bulletproof fault tolerance across enterprise deployments.',
    specialties: [
      'Enterprise Architecture & Scalability',
      'Distributed Systems & Edge Pipelines',
      'Code Quality & Engineering Governance',
      'Continuous Security & Performance Audits'
    ],
    techStack: ['Golang', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'GraphQL'],
    responsibilities: [
      'Manages technical roadmaps and architectural reviews for all client systems',
      'Enforces strict latency benchmarks and code quality across engineering pipelines',
      'Leads cloud infrastructure hardening and zero-downtime release cycles'
    ],
    stats: [
      { label: 'Position', value: 'Tech Director' },
      { label: 'Focus', value: 'Architecture' },
      { label: 'Uptime Standard', value: '99.99%' }
    ]
  },
  {
    id: 'a-k',
    order: 3,
    name: 'A.K.',
    displayRole: 'Voice Solutions Lead',
    badge: 'Neural Speech & Conversational AI',
    tagline: 'Pioneering Natural, Ultra-Low Latency Conversational Voice.',
    image: akImage,
    bio: 'Leads Quorik’s neural voice technology and telephony orchestration layer. Specializes in low-latency speech synthesis, conversational turn-taking, sentiment recognition, and multi-accent acoustic tuning.',
    specialties: [
      'Neural Speech Synthesis (TTS/STT)',
      'Conversational Flow Modeling',
      'SIP / WebRTC Telephony Pipelines',
      'Real-Time Interruptibility Engineering'
    ],
    techStack: ['Edge Neural Voice', 'WebRTC', 'SIP / Twilio', 'Whisper STT', 'Deepgram', 'Speech Synthesizers'],
    responsibilities: [
      'Engineers studio-grade lifelike voice personas with sub-800ms response turns',
      'Optimizes telephone audio compression and acoustic clarity across global carriers',
      'Builds multi-lingual speech models and dynamic emotion adaptation'
    ],
    stats: [
      { label: 'Position', value: 'Voice Solutions' },
      { label: 'Latency', value: '<800ms' },
      { label: 'Voice Accents', value: 'Global Multi-Dialect' }
    ]
  },
  {
    id: 'farhaj',
    order: 4,
    name: 'Farhaj',
    displayRole: 'Systems Ops Director',
    badge: 'Cloud Infrastructure & High-Availability Ops',
    tagline: 'Unbreakable Infrastructure. 24/7 Flawless Reliability.',
    image: farhajImage,
    bio: 'Oversees 24/7 cloud infrastructure, server reliability, monitoring pipelines, and site reliability engineering across Quorik’s high-concurrency client clusters.',
    specialties: [
      'High-Availability Cloud Operations',
      'Containerization & Microservices',
      'Automated CI/CD & Deployments',
      'Live Telemetry & Infrastructure Monitoring'
    ],
    techStack: ['Kubernetes', 'Terraform', 'GCP / AWS Cloud', 'Prometheus', 'Grafana', 'Nginx Reverse Proxy'],
    responsibilities: [
      'Maintains 24/7 automated health probes and disaster recovery protocols',
      'Optimizes container resource allocation and edge ingress routing',
      'Coordinates continuous integration pipelines with automated security verification'
    ],
    stats: [
      { label: 'Position', value: 'Systems Ops' },
      { label: 'Reliability', value: '24/7 Active Ops' },
      { label: 'Deployment', value: 'Automated CI/CD' }
    ]
  },
  {
    id: 'd-c',
    order: 5,
    name: 'D.C.',
    displayRole: 'Integration Lead',
    badge: 'Ecosystem & CRM Integrations',
    tagline: 'Seamlessly Connecting Voice AI to Global CRM Pipelines.',
    image: dcImage,
    bio: 'Leads Quorik’s enterprise integrations, CRM synchronization, and multi-channel webhook dispatch architectures. Ensures all voice leads flow instantly into client CRMs, WhatsApp dispatch alerts, and calendar calendars.',
    specialties: [
      'CRM Synchronization (HubSpot, GoHighLevel, Salesforce)',
      'Instant WhatsApp & SMS Dispatch Webhooks',
      'Automated Google Calendar & Calendly Booking',
      'REST & GraphQL API Custom Connectors'
    ],
    techStack: ['Webhooks API', 'Zapier / Make', 'HubSpot API', 'GoHighLevel CRM', 'Twilio Messaging', 'Stripe Payments'],
    responsibilities: [
      'Architects bidirectional live synchronization with enterprise CRM databases',
      'Builds zero-loss event queues and WhatsApp notification dispatches',
      'Standardizes security compliance and OAuth token workflows across integrations'
    ],
    stats: [
      { label: 'Position', value: 'Integration Lead' },
      { label: 'Sync Latency', value: 'Real-Time (<1s)' },
      { label: 'Integrations', value: 'CRM & Webhooks' }
    ]
  },
  {
    id: 'e-r',
    order: 6,
    name: 'E.R.',
    displayRole: 'AI Architect',
    badge: 'Cognitive Architecture & Deep Learning',
    tagline: 'Building Intelligent Systems. Shaping Tomorrow.',
    image: erImage,
    bio: 'Directs Quorik’s cognitive architectures, deep learning model engineering, and agentic reasoning systems. Specializes in LLM fine-tuning, multi-agent coordination, semantic vector search, and next-generation neural decision workflows.',
    specialties: [
      'Cognitive Multi-Agent Architectures',
      'LLM Fine-Tuning & Prompt Engineering',
      'Vector Search & RAG Knowledge Graphs',
      'Autonomous Neural Decision Systems'
    ],
    techStack: ['PyTorch', 'Gemini AI', 'LangChain', 'Python / FastAPI', 'Vector Databases', 'TensorRT', 'CUDA'],
    responsibilities: [
      'Architects proprietary neural reasoning pipelines and specialized model fine-tuning',
      'Leads cognitive multi-agent orchestration for enterprise client workflows',
      'Optimizes inference latency and semantic retrieval accuracy across model clusters'
    ],
    stats: [
      { label: 'Position', value: 'AI Architect' },
      { label: 'Domain', value: 'Cognitive AI' },
      { label: 'Systems', value: 'Multi-Agent RAG' }
    ]
  }
];
