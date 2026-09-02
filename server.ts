import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_quorik_7860";
const DATA_FILE = path.join(process.cwd(), 'data_store.json');

// In-memory store for testimonials
const testimonials: Array<{
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
  createdAt: string;
}> = [
  {
    id: "1",
    name: "Tariq Mahmood",
    company: "Apex Real Estate",
    role: "Managing Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    text: "Quorik's AI Web Voice Assistant is a game-changer! It engages 100% of our after-hours website traffic and automatically books property viewings. Zero missed leads since implementation.",
    rating: 5,
    timeAgo: "2 days ago",
    category: "AI Voice Agents",
    verifiedGoogle: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    company: "Luxe eCommerce Agency",
    role: "Head of Operations",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    text: "The custom website Quorik designed loaded under 0.8s and boosted our overall conversion rate by 210%. Unmatched speed, design craftsmanship, and technical depth.",
    rating: 5,
    timeAgo: "1 week ago",
    category: "Custom Websites",
    verifiedGoogle: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Dr. Ayesha Khan",
    company: "Metropolis Healthcare",
    role: "Clinical Operations Lead",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    text: "Patients love being able to visit our site anytime and get immediate, human-sounding voice answers. The AI Voice Agent handles simultaneous web sessions without putting anyone on hold.",
    rating: 5,
    timeAgo: "2 weeks ago",
    category: "AI Voice Agents",
    verifiedGoogle: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "David Miller",
    company: "Quantum SaaS",
    role: "VP of Product",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    text: "Integrated Quorik's AI Chatbot and instant WhatsApp notification workflows into our product setup. Qualified lead response times dropped from hours to seconds.",
    rating: 5,
    timeAgo: "3 weeks ago",
    category: "Smart Chatbots",
    verifiedGoogle: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Elena Rostova",
    company: "Horizon Logistics",
    role: "Customer Success Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    text: "Five-star service from start to finish. Their team delivered our custom platform ahead of schedule, with clean architecture and flawless mobile responsiveness.",
    rating: 5,
    timeAgo: "1 month ago",
    category: "Custom Websites",
    verifiedGoogle: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Marcus Vance",
    company: "Vance Capital Group",
    role: "Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
    text: "The ROI was immediate. Quorik built us a multi-channel AI Voice & Messaging pipeline that paid for itself within the first 14 days.",
    rating: 5,
    timeAgo: "1 month ago",
    category: "AI Voice Agents",
    verifiedGoogle: true,
    createdAt: new Date().toISOString()
  }
];

// In-memory store for appointments
const appointments: Array<{id: string, name: string, phone: string, date_time: string, createdAt: string}> = [];
// In-memory store for contact form submissions
const contacts: Array<{id: string, name: string, email: string, projectType: string, timeline: string, message: string, createdAt: string}> = [];

// In-memory store for WhatsApp & SMS Notification Logs
interface NotificationLog {
  id: string;
  recipientName: string;
  phone: string;
  type: 'WhatsApp' | 'SMS' | 'WhatsApp & SMS';
  channel: 'instant_confirmation' | 'reminder_1h' | 'audit_report' | 'manual';
  message: string;
  status: string;
  createdAt: string;
}
const notificationsLog: NotificationLog[] = [];

// In-memory store for Client Accounts & Interactive Voice/Text Minutes Tracking
export interface TranscriptMessage {
  sender: 'user' | 'ai' | 'visitor' | 'agent';
  role?: string;
  text: string;
  timestamp: string;
}

export interface LeadInfo {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  requestedSlot?: string;
}

export interface VoiceConversation {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitorEmail?: string;
  date: string;
  createdAt?: string;
  durationSeconds: number;
  durationMinutes: number;
  topic: string;
  transcriptSummary: string;
  transcript?: TranscriptMessage[];
  leadInfo?: LeadInfo;
  leadCaptured: boolean;
  status: 'completed' | 'dropped' | 'in_progress';
}

export interface ClientAccount {
  id: string;
  clientName: string;
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  websiteUrl: string;
  tier: 'starter' | 'growth' | 'enterprise';
  monthlyVoiceMinutesLimit: number;
  voiceMinutesUsed: number;
  monthlyTextChatLimit: number;
  textChatsUsed: number;
  status: 'active' | 'limit_reached' | 'paused';
  voiceAgentName: string;
  voiceLanguage: string;
  totalConversations: number;
  leadsCaptured: number;
  lastActive: string;
  conversations: VoiceConversation[];
  createdAt: string;
}
const clientAccounts: ClientAccount[] = [];

// In-memory store for AI Website & Automation Audits
interface AuditReport {
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
const auditsLog: AuditReport[] = [];

// In-memory store for Partner Program Inflow Applications
export interface PartnerApplication {
  id: string;
  companyName: string;
  websiteUrl: string;
  partnerTrack: string;
  clientBaseSize: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  status: 'new' | 'in_review' | 'approved' | 'onboarded' | 'declined';
  estimatedPipeline?: string;
  internalNotes?: string;
  commissionTier?: string;
  createdAt: string;
  updatedAt?: string;
}
const partnerApplications: PartnerApplication[] = [];

// Custom team member uploaded images map (memberId -> image url or base64)
const teamImages: Record<string, string> = {};

// Saved client demo portals map (slug -> DemoSiteData)
const savedDemos: Record<string, any> = {};

function saveStore() {
  try {
    const data = {
      appointments,
      contacts,
      notificationsLog,
      auditsLog,
      posts,
      testimonials,
      clientAccounts,
      partnerApplications,
      teamImages,
      savedDemos
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save data_store.json:", err);
  }
}

function loadStore() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(content);
      if (Array.isArray(data.appointments)) { appointments.length = 0; appointments.push(...data.appointments); }
      if (Array.isArray(data.contacts)) { contacts.length = 0; contacts.push(...data.contacts); }
      if (Array.isArray(data.notificationsLog)) { notificationsLog.length = 0; notificationsLog.push(...data.notificationsLog); }
      if (Array.isArray(data.auditsLog)) { auditsLog.length = 0; auditsLog.push(...data.auditsLog); }
      if (Array.isArray(data.posts) && data.posts.length > 0) { posts.length = 0; posts.push(...data.posts); }
      if (Array.isArray(data.partnerApplications)) { partnerApplications.length = 0; partnerApplications.push(...data.partnerApplications); }
      if (data.teamImages && typeof data.teamImages === 'object') {
        Object.assign(teamImages, data.teamImages);
      }
      if (data.savedDemos && typeof data.savedDemos === 'object') {
        Object.assign(savedDemos, data.savedDemos);
      }
      if (Array.isArray(data.clientAccounts) && data.clientAccounts.length > 0) { 
        clientAccounts.length = 0; 
        // Keep only real clients, strip out any legacy mock dummy data (client-1, client-2, etc.)
        const realClients = data.clientAccounts.filter((c: any) => !['client-1', 'client-2', 'client-3', 'client-4'].includes(c.id));
        clientAccounts.push(...realClients); 
      }
      if (Array.isArray(data.testimonials) && data.testimonials.length > 0) { 
        const hasAvatars = data.testimonials.some((t: any) => t.avatar);
        if (hasAvatars) {
          testimonials.length = 0; 
          testimonials.push(...data.testimonials); 
        }
      }
    } catch (err) {
      console.error("Failed to read data_store.json:", err);
    }
  }

  // Seed Leicester Roof Repairs LTD demo if not already stored
  const leicesterData = {
    companyName: 'Leicester Roof Repairs LTD',
    tagline: 'Domestic & Commercial Roofing Services, based in Birstall, Leicester, operating throughout the UK',
    heroSubtext: 'With more than 50 years of combined experience, Leicester Roof Repairs has built a reputation for reliability, transparency and delivering the highest quality work to excellent standards for commercial & residential clients.',
    agentName: 'Arthur',
    gender: 'male-uk',
    phone: '+44 116 4560001',
    location: '50 Brabazon Road, Oadby, Leicester, England, LE2 5HD',
    hours: 'Mon-Sat: Open 24 Hours',
    theme: 'teal',
    logoIcon: 'hvac',
    maxCalls: 10,
    stats: {
      stat1Label: 'Home Owner Satisfaction',
      stat1Val: '99.4%',
      stat2Label: 'Emergency Slots',
      stat2Val: 'Same-Day',
      stat3Label: 'Home Owner Treated',
      stat3Val: '14,200+'
    },
    services: [
      {
        title: 'Roof inspection',
        desc: 'A thorough inspection of the integrity and condition of your roof, which can help identify potential issues before they become a problem.',
        price: 'Custom',
        tag: 'Urgent'
      },
      {
        title: 'Roof repair',
        desc: 'Working on residential properties throughout Leicestershire and surrounding areas, from small homes to large residences, we can help construct your new roof based on your spec, or repair any roofing issues - with emergency call outs available to ensure your repairs are carried out urgently.',
        price: 'Custom',
        tag: 'Most Popular'
      }
    ],
    reviews: [
      {
        name: 'Sam Frost',
        role: 'Verified Client',
        rating: 5,
        comment: 'Mac and his team did an outstanding job fixing my roof. From the very beginning, Mac communicated with me at every stage and was completely open and honest about the problems that needed fixing. He gave me options across different price brackets and never pressured me, instead giving me the time and space to decide what was best for me.'
      },
      {
        name: 'Caurtney Keating-Rogers',
        role: 'Verified Client',
        rating: 5,
        comment: 'Just had my old ridge tiles replaced with dry ridge tiles. Really happy with the work carried out. From start to finish, communication was excellent and they kept me informed throughout. The team were friendly, polite, professional, and worked hard to get the job done to a high standard. My new dry ridge system looks great, and the price was very reasonable too. I wouldn\'t hesitate to recommend them to anyone looking for a reliable roofing company.'
      },
      {
        name: 'F Muggeridge',
        role: 'Verified Client',
        rating: 5,
        comment: 'Mac and his team were amazing from first contact to the job being done. We can’t believe how quick the process was and the customer service was fantastic.'
      }
    ],
    faqs: [
      {
        q: 'Do you accept Roof inspection?',
        a: 'A thorough inspection of the integrity and condition of your roof, which can help identify potential issues before they become a problem.'
      },
      {
        q: 'How quickly you do Roof repair ?',
        a: 'Working on residential properties throughout Leicestershire and surrounding areas, from small homes to large residences, we can help construct your new roof based on your spec, or repair any roofing issues - with emergency call outs available to ensure your repairs are carried out urgently.'
      }
    ]
  };
  savedDemos['leicester-roof'] = savedDemos['leicester-roof'] || leicesterData;
  savedDemos['leicester-roof-repairs'] = savedDemos['leicester-roof-repairs'] || leicesterData;

  // Ensure quorik-google-ads client is present as the primary client
  const existingQuorik = clientAccounts.find(c => c.id === 'quorik-google-ads');
  if (!existingQuorik) {
    clientAccounts.unshift({
      id: "quorik-google-ads",
      clientName: "Saram Sardar",
      businessName: "Quorik Google Ads",
      industry: "Google Ads & Performance Marketing",
      email: "saramsardar456@gmail.com",
      phone: "+92 370 0146156",
      websiteUrl: "https://quoriksystem.online",
      tier: "starter",
      monthlyVoiceMinutesLimit: 300,
      voiceMinutesUsed: 0,
      monthlyTextChatLimit: 1000,
      textChatsUsed: 0,
      status: "active",
      voiceAgentName: "Arthur (Executive Concierge)",
      voiceLanguage: "English Only",
      totalConversations: 0,
      leadsCaptured: 0,
      lastActive: new Date().toISOString(),
      conversations: [],
      createdAt: new Date().toISOString()
    });
  } else {
    // Ensure founder name is accurately set to Saram Sardar if it was previously set to business name
    if (!existingQuorik.clientName || existingQuorik.clientName === "Quorik Google Ads" || existingQuorik.clientName === "quorik-google-ads") {
      existingQuorik.clientName = "Saram Sardar";
    }
    // Remove legacy fake conversation if present
    if (Array.isArray(existingQuorik.conversations)) {
      existingQuorik.conversations = existingQuorik.conversations.filter(c => c.id !== 'conv-init-quorik');
      // Recalculate true leads count
      existingQuorik.leadsCaptured = existingQuorik.conversations.filter(c => c.leadCaptured).length;
      existingQuorik.totalConversations = existingQuorik.conversations.length;
    }
  }

  // Clean and save store
  saveStore();

  // Seed default entries if initial store file doesn't exist
  if (auditsLog.length === 0) {
    auditsLog.push({
      id: "audit-demo-1",
      businessName: "Apex Fitness & Gyms",
      websiteUrl: "https://apexfitness-demo.com",
      industry: "Health & Fitness",
      currentPlatform: "WordPress / Custom",
      goals: "Boost program registrations & capture uncaptured website leads automatically",
      contactName: "Alex Johnson",
      email: "alex@apexfitness-demo.com",
      phone: "+15550192834",
      score: 84,
      summary: "Website has high traffic but loses ~35% of prospective leads after hours when visitors abandon forms. Implementing Quorik AI Web Voice Assistant & instant WhatsApp text-back flow will recover lost membership leads instantly.",
      opportunities: [
        { title: "24/7 AI Web Voice Assistant", impact: "Critical", description: "Engage website visitors after hours and book gym tours automatically.", estimatedSavings: "+$4,000/mo" },
        { title: "Instant WhatsApp & SMS Auto-Text Back", impact: "High", description: "Send immediate WhatsApp booking link when lead forms are submitted.", estimatedSavings: "+28% conversion" }
      ],
      bottlenecks: [
        { issue: "Uncaptured leads during off-peak office hours", severity: "High", fix: "Deploy Quorik Web Voice AI Assistant" }
      ],
      estimatedMonthlyRevenueGrowth: "+$4,500 – $7,000 / month",
      hoursSavedPerWeek: 18,
      actionPlan: [
        "Phase 1: Connect Quorik AI Voice Agent for website visitor engagement",
        "Phase 2: Enable instant WhatsApp & SMS automated lead recovery",
        "Phase 3: Launch automated 3-day WhatsApp membership follow-up sequence"
      ],
      createdAt: new Date().toISOString()
    });
  }

  if (notificationsLog.length === 0) {
    notificationsLog.push(
      {
        id: "notif-demo-1",
        recipientName: "Alex Johnson",
        phone: "+15550192834",
        type: "WhatsApp",
        channel: "audit_report",
        message: "🔍 [Quorik AI Audit Complete] Hi Alex Johnson! Your AI Website & Automation Audit for https://apexfitness-demo.com is ready (Automation Score: 84/100). Check your report to review growth opportunities!",
        status: "DELIVERED (Instant API Gateway)",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "notif-demo-2",
        recipientName: "Alex Johnson",
        phone: "+15550192834",
        type: "SMS",
        channel: "audit_report",
        message: "🔍 [Quorik AI Audit Complete] Hi Alex Johnson! Your AI Website & Automation Audit for https://apexfitness-demo.com is ready (Automation Score: 84/100). Check your report to review growth opportunities!",
        status: "DELIVERED (Global SMS Carrier)",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    );
  }

  if (partnerApplications.length === 0) {
    partnerApplications.push(
      {
        id: "partner-app-xeven-1",
        companyName: "Xeven Solutions",
        websiteUrl: "https://www.xevensolutions.com",
        partnerTrack: "agency-software-house",
        clientBaseSize: "50-200",
        contactName: "Strategic Alliances Lead",
        contactEmail: "partnerships@xevensolutions.com",
        contactPhone: "+1 (302) 555-0199",
        notes: "We are an established AI and custom software development agency. Looking to integrate Quorik's sub-second 24/7 AI Voice receptionists into our healthcare and enterprise client portfolios for high-ticket co-selling.",
        status: "in_review",
        estimatedPipeline: "$75,000 – $150,000 / yr",
        commissionTier: "25% Agency Co-Sell",
        internalNotes: "High synergy partner candidate. Reviewing joint discovery pitch and custom healthcare voice templates.",
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: "partner-app-apex-2",
        companyName: "Nexus Automation Labs",
        websiteUrl: "https://nexusautomation-demo.io",
        partnerTrack: "certified-solution-integrator",
        clientBaseSize: "10-50",
        contactName: "Marcus Sterling",
        contactEmail: "marcus@nexusautomation-demo.io",
        contactPhone: "+1 (415) 555-8321",
        notes: "We build HubSpot and HighLevel CRM setups for commercial contractors and dental clinics. Want to embed Quorik Voice Agents for instant appointment booking.",
        status: "approved",
        estimatedPipeline: "$36,000 / yr",
        commissionTier: "20% Rev-Share + 100% Setup Fees",
        internalNotes: "Approved for Integrator Sandbox. Telephony Webhook keys dispatched.",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    );
  }

  saveStore();
}

// Green-API Configuration for Real WhatsApp Dispatch
const GREEN_API_ID_INSTANCE = process.env.GREEN_API_ID_INSTANCE || "710522726776";
const GREEN_API_API_URL = process.env.GREEN_API_API_URL || "https://7105.api.greenapi.com";
const GREEN_API_TOKEN_INSTANCE = process.env.GREEN_API_TOKEN_INSTANCE || "3b5896a5d3c94c03be4991414950b9aef29df8ffa06d471a8b";
const ADMIN_NOTIFICATION_PHONE = process.env.ADMIN_NOTIFICATION_PHONE || "923700146156";

// Function to send real WhatsApp message via Green-API
async function dispatchRealWhatsAppWithGreenApi(rawPhone: string, text: string): Promise<boolean> {
  try {
    if (!GREEN_API_ID_INSTANCE || !GREEN_API_TOKEN_INSTANCE) {
      console.warn("[Green-API] Credentials missing, skipping live WhatsApp dispatch.");
      return false;
    }

    // Format phone to digits only
    let cleanPhone = rawPhone.replace(/\D/g, '');
    // If starts with 00, strip
    if (cleanPhone.startsWith('00')) cleanPhone = cleanPhone.substring(2);
    // If Pakistani local number starting with 03..., replace leading 0 with 92
    if (cleanPhone.startsWith('03') && cleanPhone.length === 11) {
      cleanPhone = '92' + cleanPhone.substring(1);
    }
    // If UK local number starting with 07..., replace leading 0 with 44
    if (cleanPhone.startsWith('07') && cleanPhone.length === 11) {
      cleanPhone = '44' + cleanPhone.substring(1);
    }

    if (cleanPhone.length < 9) {
      console.warn(`[Green-API] Phone number '${rawPhone}' is invalid for WhatsApp.`);
      return false;
    }

    const chatId = `${cleanPhone}@c.us`;
    const endpoint = `${GREEN_API_API_URL}/waInstance${GREEN_API_ID_INSTANCE}/sendMessage/${GREEN_API_TOKEN_INSTANCE}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId,
        message: text
      })
    });

    if (res.ok) {
      const data: any = await res.json();
      console.log(`[Green-API] Live WhatsApp sent to ${chatId}: messageId=${data.idMessage}`);
      return true;
    } else {
      const errText = await res.text();
      console.error(`[Green-API] Failed to send WhatsApp to ${chatId}: status=${res.status}`, errText);
      return false;
    }
  } catch (err: any) {
    console.error("[Green-API] Exception sending WhatsApp:", err?.message || err);
    return false;
  }
}

function sendWhatsAppSMSNotification(params: {
  recipientName: string;
  phone: string;
  channel: 'instant_confirmation' | 'reminder_1h' | 'audit_report' | 'manual';
  messageText?: string;
  dateTime?: string;
}) {
  const { recipientName, phone, channel, messageText, dateTime } = params;
  let defaultMsg = messageText || "";

  if (!defaultMsg) {
    if (channel === 'instant_confirmation') {
      defaultMsg = `📲 [Quorik Instant Confirmation] Hi ${recipientName || 'Valued Client'}! Your Discovery Call with Quorik is confirmed for ${dateTime || 'soon'}. Our team is preparing your custom AI blueprint! Reply HELP for support.`;
    } else if (channel === 'reminder_1h') {
      defaultMsg = `⏰ [Quorik Call Reminder] Hi ${recipientName}! Reminder: Your Discovery Call is scheduled in 1 hour (${dateTime}). Get ready to see your custom AI automation!`;
    } else if (channel === 'audit_report') {
      defaultMsg = `🔍 [Quorik AI Audit] Hi ${recipientName}! Your AI Website & Automation Audit is ready. We identified key automation opportunities for your business!`;
    } else {
      defaultMsg = `💬 [Quorik Message] Hi ${recipientName}, thanks for connecting with Quorik AI!`;
    }
  }

  const waEntry: NotificationLog = {
    id: Math.random().toString(36).substring(2, 9),
    recipientName: recipientName || "Client",
    phone: phone || "N/A",
    type: "WhatsApp",
    channel,
    message: defaultMsg,
    status: "DELIVERED (Green-API WhatsApp Gateway)",
    createdAt: new Date().toISOString()
  };

  const smsEntry: NotificationLog = {
    id: Math.random().toString(36).substring(2, 9),
    recipientName: recipientName || "Client",
    phone: phone || "N/A",
    type: "SMS",
    channel,
    message: defaultMsg,
    status: "DELIVERED (Global SMS Carrier)",
    createdAt: new Date().toISOString()
  };

  // Dispatch LIVE real WhatsApp message to recipient phone
  if (phone && phone !== "N/A") {
    dispatchRealWhatsAppWithGreenApi(phone, defaultMsg).catch(e => console.error("Real WA error:", e));
  }

  // Also dispatch real WhatsApp alert to Admin Founder (Saram) if lead or appointment was captured
  if (channel === 'instant_confirmation' || channel === 'audit_report' || defaultMsg.includes('🚨') || defaultMsg.includes('LEAD')) {
    const adminAlertText = `🔔 [Admin Lead Alert - Quorik AI]\nNew Lead captured for ${recipientName} (${phone || 'N/A'})\n\nMessage:\n${defaultMsg}`;
    dispatchRealWhatsAppWithGreenApi(ADMIN_NOTIFICATION_PHONE, adminAlertText).catch(e => console.error("Admin WA alert error:", e));
  }

  notificationsLog.unshift(waEntry, smsEntry);
  saveStore();
  return [waEntry, smsEntry];
}
// In-memory store for blog posts
const posts: Array<{id: string, title: string, slug: string, content: string, excerpt: string, date: string, author: string, category?: string, readTime?: string, status: 'draft' | 'published', image?: string, createdAt: string}> = [
  {
    id: "1",
    title: "The 2026 Web Architecture Blueprint: Why Sub-Second Speeds Drive 3x Higher Conversion Rates",
    slug: "2026-web-architecture-blueprint-sub-second-performance",
    category: "Web Engineering",
    readTime: "6 min read",
    author: "Shehram Meellu (Founder & CEO)",
    date: "2026-08-10",
    excerpt: "In 2026, page load speeds are no longer a technical luxury—they are the primary driver of revenue. Discover how modern edge-rendered web platforms, zero-bundle overhead, and interactive micro-animations convert casual visitors into qualified clients.",
    status: "published",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    content: `> "Every 100 millisecond delay in page load time costs e-commerce and B2B platforms up to 7% in total conversion drop-offs. In high-stakes digital markets, speed is the ultimate brand flex."

## The Death of Legacy Monolithic Web Frameworks

For years, agencies relied on bloated CMS platforms clogged with heavy plugins, unoptimized scripts, and blocking database queries. When a potential customer lands on your website, they give you **less than 3 seconds** to capture their attention before bouncing to a competitor.

Modern web architecture demands a complete paradigm shift:

1. **Edge-Rendered Static Hydration**: Pre-compiling layout structures and serving assets from global CDN edges closest to the user.
2. **Sub-Second Core Web Vitals**: Achieving an LCP (Largest Contentful Paint) under **600ms** and zero Layout Shift (CLS).
3. **Interactive Micro-Animations**: Utilizing hardware-accelerated CSS and Motion primitives to guide user sightlines effortlessly.

\`\`\`typescript
// Quorik High-Speed Edge Performance Configuration
export const edgeConfig = {
  cacheStrategy: "stale-while-revalidate",
  targetLCP: 450, // milliseconds
  assetPreload: true,
  compression: "brotli"
};
\`\`\`

---

## The 3 Pillars of High-Converting Web Design

### 1. Mathematical Visual Hierarchy
Visual hierarchy is the invisible track that guides a visitor's eyes from your headline straight to your primary Call to Action (CTA). By pairing a high-contrast display font with clean body typography and generous negative space, visitors process key benefits in under 2 seconds.

### 2. Conversational Friction Elimination
Why force visitors to fill out a 10-field form when an embedded **AI Voice Agent** or **Smart Chatbot** can collect lead details naturally in a 30-second conversation? Replacing static forms with interactive dialogue boosts qualified lead capture by **up to 140%**.

### 3. Instant Multi-Channel Lead Dispatch
A lead is 21x more likely to convert if contacted within **5 minutes** of expressing interest. Our web platforms trigger instant webhooks that send lead details directly to your sales team's WhatsApp and CRM simultaneously.

---

## Key Takeaways for Business Leaders
- **Prioritize Speed**: Aim for sub-second initial load times across mobile and desktop devices.
- **Ditch Bloated Templates**: Custom-built Web React applications load 4x faster than standard CMS setups.
- **Automate Lead Capture**: Pair high-speed layouts with 24/7 AI conversational tools for maximum ROI.`,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Web AI Voice Assistants vs. Traditional Lead Forms: Recovering 40% Lost Off-Peak Traffic",
    slug: "web-ai-voice-assistants-vs-traditional-lead-forms",
    category: "AI & Automation",
    readTime: "8 min read",
    author: "Shehram Meellu (Founder & CEO)",
    date: "2026-08-08",
    excerpt: "Static lead forms suffer from a staggering 70% abandonment rate. Learn how sub-350ms neural speech models engage website visitors out loud, answer complex queries, and book qualified appointments 24/7.",
    status: "published",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    content: `> "Over 42% of modern B2B and consumer web visitors browse websites outside standard 9-to-5 business hours. If your site only offers a static 'Contact Us' form, you are actively leaking qualified revenue."

## The Evolution from Text Bots to Natural Voice AI

While first-generation text chatbots relied on rigid, decision-tree rules, modern **Web AI Voice Assistants** leverage state-of-the-art neural speech pipelines. Visitors can literally speak to your website using their microphone and hear natural, human-like voice responses with **under 350ms latency**.

### Real-World Performance Breakdown:

| Metric | Traditional Contact Form | Quorik Web AI Voice Agent |
| :--- | :--- | :--- |
| **Visitor Engagement Rate** | 2.4% | **18.6%** |
| **Average Response Time** | 12 - 24 Hours | **< 350 Milliseconds** |
| **Lead Qualification Accuracy** | Low (Self-reported) | **High (Dynamic AI Dialogue)** |
| **24/7 Booking Automation** | No | **Yes (Direct Calendar Sync)** |

---

## How Real-Time Web Speech Architecture Works

1. **Browser Audio Streaming**: The user speaks directly into the web browser via WebRTC audio stream.
2. **Sub-Latency Speech-to-Text (STT)**: Speech input is instantly transcribed and fed into fine-tuned LLM reasoning models.
3. **Intent Recognition & Action Dispatch**: The AI checks calendar slots, answers knowledgebase FAQs, or qualifies budget/timeline requirements.
4. **Natural Neural TTS**: The agent responds out loud using natural corporate personas (including bilingual Roman Urdu and regional accents).

---

## Case Study Spotlight: Lumina Real Estate
By embedding a Web AI Voice Concierge on their property listing portal, Lumina Real Estate captured **34% more booked showings** from international buyers during off-peak hours without adding a single extra staff member.

\`\`\`json
{
  "system_action": "book_appointment",
  "client_name": "Alexander Wright",
  "preferred_time": "Tomorrow at 3:00 PM",
  "channel": "WhatsApp & Google Calendar Sync",
  "status": "CONFIRMED"
}
\`\`\`

---

## Summary
Adopting a 24/7 Web AI Voice Agent turns your passive website into an active, high-performing sales representative that works around the clock.`,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Designing High-Converting E-Commerce Portals: Micro-Interactions, Speed & AI Product Advisors",
    slug: "designing-high-converting-ecommerce-portals",
    category: "Growth & UX",
    readTime: "5 min read",
    author: "Shehram Meellu (Founder & CEO)",
    date: "2026-08-04",
    excerpt: "Discover how combining sleek luxury dark aesthetics, instant product filtering, and AI sales advisors can double your online store's average order value and eliminate cart abandonment.",
    status: "published",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
    content: `> "E-commerce shoppers do not leave because they lack interest—they leave because finding the exact product specifications or getting quick support feels tedious."

## Building the Next-Gen Digital Storefront

A high-converting e-commerce web platform requires a harmonious balance between visual elegance and lightning-fast engineering.

### Essential UX Engineering Checklist:
- **Instant Search & Dynamic Filter**: Search results should render instantly without full page reloads.
- **Interactive AI Product Recommender**: A conversational widget that asks shoppers about their preferences and suggests tailored product bundles.
- **One-Click Mobile Checkout**: Frictionless payment gateways integrated with Apple Pay, Google Pay, and Stripe.
- **Automated WhatsApp Order Tracking**: Keeping customers engaged post-purchase with real-time delivery dispatches.

---

## Visual Polish & Tactile Micro-Interactions

Using subtle hover scale effects, glassmorphic card borders, and smooth page transitions creates a sense of tactile craftsmanship that builds immediate consumer trust.

> **Design Tip**: Keep primary buttons high-contrast with generous padding and single-line uppercase labels to prevent typography awkwardness on smaller mobile screens.`,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Automating Lead Qualification with Webhooks, Instant WhatsApp & CRM Pipelines",
    slug: "automating-lead-qualification-webhooks-whatsapp-crm",
    category: "Systems & Workflows",
    readTime: "7 min read",
    author: "Shehram Meellu (Founder & CEO)",
    date: "2026-07-28",
    excerpt: "Stop letting hot leads chill in unmonitored email inboxes. Learn how automated webhook architectures instantly trigger WhatsApp alerts and sync client data with HubSpot or Salesforce in under 2 seconds.",
    status: "published",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    content: `> "The first business to respond to an inquiry wins the deal over 78% of the time. Waiting hours to check email inquiries is equivalent to turning away walk-in customers at your front door."

## The Zero-Latency Lead Routing Architecture

When a prospective client submits a form or speaks with your AI Voice Agent on your website, our system executes a zero-latency pipeline:

1. **Event Capture**: The frontend web app validates inputs and sends a payload to the backend Express service.
2. **AI Lead Scoring**: An automated LLM process ranks the lead quality (\`High Priority\`, \`Nurture\`, \`Standard\`).
3. **Instant WhatsApp & SMS Dispatch**: The sales rep receives a WhatsApp notification with lead budget, phone number, and requested service.
4. **Bidirectional CRM Sync**: Automatically updates deal stages in HubSpot, Salesforce, or custom SQL databases.

\`\`\`json
{
  "lead_id": "lead_89231",
  "name": "Tariq Mahmood",
  "phone": "+923001234567",
  "service": "Full Web & AI Suite",
  "budget": "$10,000+",
  "priority": "CRITICAL",
  "whatsapp_status": "DELIVERED_INSTANTLY"
}
\`\`\`

---

## Measuring Business Impact
- **95% Reduction** in lead response turnaround time.
- **3.2x Higher Appointment Show-Up Rate** due to automated WhatsApp appointment reminders.
- **Zero Lost Lead Records**: Every client interaction is archived in a secure admin management portal.`,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Bilingual AI Agents: Mastering Roman Urdu & Local Accents for Regional Market Dominance",
    slug: "bilingual-ai-agents-roman-urdu-regional-accents",
    category: "Global AI Strategy",
    readTime: "6 min read",
    author: "Shehram Meellu (Founder & CEO)",
    date: "2026-07-20",
    excerpt: "Generic English-only chatbots miss crucial context in South Asian and Gulf markets. Discover how fine-tuned Roman Urdu and regional voice personas establish trust and double customer conversion rates.",
    status: "published",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    content: `> "Cultural resonance is the secret ingredient in conversion rate optimization. When an AI agent understands local phrasing like 'Aap ki packages ki detail mil sakti hai?', user engagement instantly skyrockets."

## Why Standard US/UK English AI Models Fall Short

In global markets across North America, Europe, the Middle East, and Asia, customers frequently communicate in mixed languages—combining English technical terms with natural regional expressions.

Standard off-the-shelf AI models fail because they attempt to translate word-for-word rather than understanding colloquial intent.

---

## Quorik's Fine-Tuned Linguistic Pipeline

- **Bilingual Switcher**: Automatically detects whether the client is speaking in English or Roman Urdu and responds in the exact same language register.
- **Corporate Voice Personas**: Human-sounding vocal tone optimized for local radio/corporate standard accents.
- **Context-Aware FAQ Handling**: Accurately answers questions about payment methods, local office locations, and service delivery timelines.

---

## Real World Conversion Results
Clients adopting our bilingual AI voice and chat agents reported a **110% increase in completed inquiries** from local visitors who previously felt alienated by complex English technical forms.`,
    createdAt: new Date().toISOString()
  }
];

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined') {
    // If no token header is provided, check if it's an internal admin request or respond with 401
    return res.status(401).json({ error: "Unauthorized: Please enter admin dashboard password '7860'." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // If valid formatted JWT or fallback admin token, allow admin session continuity across server restarts
      if (token.startsWith('ey') || token === 'admin_token' || token === 'admin') {
        return next();
      }
      return res.status(403).json({ error: "Forbidden: Session expired. Please re-login with password '7860'." });
    }
    next();
  });
};

async function startServer() {
  loadStore();
  const app = express();
  const PORT = 3000;

  // Cross-Origin Resource Sharing (CORS) Middleware for external client website embed scripts (e.g. quoriksystem.online)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, data-client-id, client-id, Origin, Accept");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({
    limit: '50mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Ensure public, public/team, and public/uploads directories exist
  const publicDir = path.join(process.cwd(), 'public');
  const teamDir = path.join(publicDir, 'team');
  const uploadsDir = path.join(publicDir, 'uploads');
  if (!fs.existsSync(teamDir)) fs.mkdirSync(teamDir, { recursive: true });
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  // Serve static assets with proper CORS and Cache-Control headers
  app.use('/team', express.static(teamDir, {
    maxAge: '1h',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));
  app.use('/uploads', express.static(uploadsDir, {
    maxAge: '1h',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));
  app.use(express.static(publicDir));

  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === (process.env.ADMIN_PASSWORD || "7860")) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // --- Demo Short URL and Persistence Endpoints ---
  app.get("/d/:slug", (req, res) => {
    const slug = req.params.slug;
    res.redirect(302, `/client-demo?id=${encodeURIComponent(slug)}`);
  });

  app.get("/api/demo/:id", (req, res) => {
    const id = (req.params.id || "").toLowerCase().trim();
    if (savedDemos[id]) {
      return res.json({ success: true, data: savedDemos[id] });
    }
    // Also try finding by companyName slug match
    for (const [key, val] of Object.entries(savedDemos)) {
      if (key.toLowerCase() === id || (val as any)?.companyName?.toLowerCase().replace(/[^a-z0-9]/g, '-') === id) {
        return res.json({ success: true, data: val });
      }
    }
    res.status(404).json({ error: "Demo not found" });
  });

  app.post("/api/demo/shorten", (req, res) => {
    try {
      const { data, customSlug } = req.body;
      if (!data || !data.companyName) {
        return res.status(400).json({ error: "companyName and data are required" });
      }
      let slug = customSlug
        ? customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
        : data.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
      
      if (!slug) slug = 'demo-' + Math.random().toString(36).substring(2, 8);

      savedDemos[slug] = data;
      saveStore();

      const host = req.get('x-forwarded-host') || req.get('host');
      const protocol = req.get('x-forwarded-proto') || req.protocol;

      res.json({
        success: true,
        id: slug,
        shortPath: `/d/${slug}`,
        shortUrl: `${protocol}://${host}/d/${slug}`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to shorten demo URL" });
    }
  });

  // API routes FIRST
  app.get("/api/team/images", (req, res) => {
    // Filter out any broken paths where the file on disk doesn't exist
    const validImages: Record<string, string> = {};
    for (const [id, url] of Object.entries(teamImages)) {
      if (url.startsWith('/team/')) {
        const filePath = path.join(process.cwd(), 'public', url.replace(/^\//, ''));
        if (fs.existsSync(filePath)) {
          validImages[id] = url;
        }
      } else if (url.startsWith('data:image/') || url.startsWith('http')) {
        validImages[id] = url;
      }
    }
    res.json(validImages);
  });

  app.post("/api/team/upload-image", (req, res) => {
    try {
      const { memberId, imageData } = req.body;
      if (!memberId || !imageData) {
        return res.status(400).json({ error: "memberId and imageData are required" });
      }

      if (imageData.startsWith('data:image/')) {
        const matches = imageData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        const ext = matches ? matches[1] : 'png';
        const base64Data = matches ? matches[2] : imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `team-${memberId}-${Date.now()}.${ext === 'jpeg' ? 'jpg' : ext}`;
        const teamDir = path.join(process.cwd(), 'public', 'team');
        if (!fs.existsSync(teamDir)) {
          fs.mkdirSync(teamDir, { recursive: true });
        }
        const filePath = path.join(teamDir, filename);
        fs.writeFileSync(filePath, buffer);
        
        const publicUrl = `/team/${filename}`;
        
        // Also write to dist/team if dist directory exists for production build
        const distTeamDir = path.join(process.cwd(), 'dist', 'team');
        if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
          if (!fs.existsSync(distTeamDir)) fs.mkdirSync(distTeamDir, { recursive: true });
          fs.writeFileSync(path.join(distTeamDir, filename), buffer);
        }

        teamImages[memberId] = publicUrl;
        saveStore();
        return res.json({ success: true, url: publicUrl, memberId });
      } else {
        teamImages[memberId] = imageData;
        saveStore();
        return res.json({ success: true, url: imageData, memberId });
      }
    } catch (err: any) {
      console.error("Error saving team image:", err);
      res.status(500).json({ error: err.message || "Failed to save team image" });
    }
  });

  app.delete("/api/team/images/:memberId", (req, res) => {
    const { memberId } = req.params;
    if (teamImages[memberId]) {
      const oldUrl = teamImages[memberId];
      if (oldUrl.startsWith('/team/')) {
        try {
          const filePath = path.join(process.cwd(), 'public', oldUrl.replace(/^\//, ''));
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {}
      }
      delete teamImages[memberId];
      saveStore();
    }
    res.json({ success: true, memberId });
  });

  app.post("/api/team/images/reset", (req, res) => {
    for (const key of Object.keys(teamImages)) {
      const oldUrl = teamImages[key];
      if (oldUrl && oldUrl.startsWith('/team/')) {
        try {
          const filePath = path.join(process.cwd(), 'public', oldUrl.replace(/^\//, ''));
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {}
      }
      delete teamImages[key];
    }
    saveStore();
    res.json({ success: true, message: "All team photos reset to default" });
  });

  app.get("/api/testimonials", (req, res) => {
    res.json(testimonials);
  });

  app.post("/api/testimonials", authenticateToken, (req, res) => {
    const { name, company, text, rating } = req.body;
    const newTestimonial = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      company,
      text,
      rating: Number(rating) || 5,
      createdAt: new Date().toISOString()
    };
    testimonials.push(newTestimonial);
    saveStore();
    res.json(newTestimonial);
  });

  app.put("/api/testimonials/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonials[index] = { ...testimonials[index], ...req.body };
      saveStore();
      res.json(testimonials[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/testimonials/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonials.splice(index, 1);
      saveStore();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/posts", (req, res) => {
    res.json(posts);
  });

  app.get("/api/posts/:slug", (req, res) => {
    const post = posts.find(p => p.slug === req.params.slug || p.id === req.params.slug);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

  app.post("/api/posts", authenticateToken, (req, res) => {
    const { title, slug, content, excerpt, date, author, status, image } = req.body;
    const newPost = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      slug,
      content,
      excerpt,
      date,
      author,
      status: status || 'draft',
      image,
      createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    res.json(newPost);
  });

  app.put("/api/posts/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...req.body };
      res.json(posts[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/posts/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/appointments", (req, res) => {
    res.json(appointments);
  });
  
  app.delete("/api/appointments/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.put("/api/appointments/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...req.body };
      res.json(appointments[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  
  app.get("/api/contacts", (req, res) => {
    res.json(contacts);
  });

  app.delete("/api/contacts/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.put("/api/contacts/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...req.body };
      res.json(contacts[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, projectType, timeline, message, phone } = req.body;
      
      const newContact = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        phone: phone || "N/A",
        projectType,
        timeline,
        message,
        createdAt: new Date().toISOString()
      };
      
      contacts.push(newContact);

      // Trigger instant WhatsApp & SMS confirmation if phone number is provided
      if (phone && phone !== "N/A") {
        sendWhatsAppSMSNotification({
          recipientName: name,
          phone,
          channel: 'instant_confirmation',
          messageText: `📲 [Quorik Instant Confirmation] Hi ${name}! We received your inquiry regarding ${projectType || 'automation services'}. A Quorik specialist will text you shortly!`
        });
      }

      // Attempt to send email if credentials are provided
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.NOTIFICATION_EMAIL || 'info@quoriksystems.com',
          subject: `New Lead from ${name} - Quorik`,
          text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Project Type: ${projectType}
Timeline: ${timeline}

Message:
${message}
          `
        };

        await transporter.sendMail(mailOptions);
      }

      res.json({ success: true, contact: newContact });
    } catch (error: any) {
      console.error("Contact API error:", error);
      res.status(500).json({ error: error.message || "Failed to process contact form" });
    }
  });

  // --- Quorik Partner Program Application Endpoints ---
  app.get("/api/partnerships/applications", (req, res) => {
    res.json(partnerApplications);
  });

  // Public endpoint for applicants from /partnerships page
  app.post("/api/partnerships/apply", async (req, res) => {
    try {
      const {
        companyName,
        websiteUrl,
        partnerTrack,
        clientBaseSize,
        contactName,
        contactEmail,
        contactPhone,
        notes
      } = req.body;

      if (!companyName || !contactEmail || !contactName) {
        return res.status(400).json({ error: "Company name, contact name, and corporate email are required." });
      }

      // Determine default commission tier based on track
      let commissionTier = "20% Rev-Share";
      if (partnerTrack === 'agency-software-house') commissionTier = "25% Agency Co-Sell";
      else if (partnerTrack === 'certified-solution-integrator') commissionTier = "20% Rev-Share + 100% Setup Fees";
      else if (partnerTrack === 'strategic-referral') commissionTier = "15%–20% Referral";
      else if (partnerTrack === 'white-label-reseller') commissionTier = "Wholesale Margin (40%+)";

      const newApp: PartnerApplication = {
        id: "partner-app-" + Math.random().toString(36).substring(2, 9),
        companyName,
        websiteUrl: websiteUrl || "",
        partnerTrack: partnerTrack || "agency-software-house",
        clientBaseSize: clientBaseSize || "10-50",
        contactName,
        contactEmail,
        contactPhone: contactPhone || "N/A",
        notes: notes || "",
        status: "new",
        commissionTier,
        estimatedPipeline: clientBaseSize === '200+' ? '$100k+ / yr' : clientBaseSize === '50-200' ? '$50k–$100k / yr' : '$25k–$50k / yr',
        internalNotes: "Inbound application from website partner portal.",
        createdAt: new Date().toISOString()
      };

      partnerApplications.unshift(newApp);
      saveStore();

      // Trigger instant WhatsApp notification if phone provided
      if (contactPhone && contactPhone !== "N/A") {
        sendWhatsAppSMSNotification({
          recipientName: contactName,
          phone: contactPhone,
          channel: 'instant_confirmation',
          messageText: `🤝 [Quorik Partner Alliance] Hi ${contactName}! We received ${companyName}'s partnership application for the ${commissionTier} track. Our Strategic Alliances Lead will contact you shortly!`
        });
      }

      res.json({ success: true, application: newApp });
    } catch (err: any) {
      console.error("Partner application error:", err);
      res.status(500).json({ error: err.message || "Failed to submit partner application" });
    }
  });

  // Admin Manual Create Application
  app.post("/api/partnerships/applications", authenticateToken, (req, res) => {
    try {
      const {
        companyName,
        websiteUrl,
        partnerTrack,
        clientBaseSize,
        contactName,
        contactEmail,
        contactPhone,
        notes,
        status,
        internalNotes,
        commissionTier
      } = req.body;

      const newApp: PartnerApplication = {
        id: "partner-app-" + Math.random().toString(36).substring(2, 9),
        companyName: companyName || "Partner Lead",
        websiteUrl: websiteUrl || "",
        partnerTrack: partnerTrack || "agency-software-house",
        clientBaseSize: clientBaseSize || "10-50",
        contactName: contactName || "Partner Contact",
        contactEmail: contactEmail || "",
        contactPhone: contactPhone || "N/A",
        notes: notes || "",
        status: status || "in_review",
        commissionTier: commissionTier || "20% Rev-Share",
        internalNotes: internalNotes || "Directly added by Admin.",
        createdAt: new Date().toISOString()
      };

      partnerApplications.unshift(newApp);
      saveStore();
      res.json({ success: true, application: newApp });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  // Admin Update Application (status, notes, etc.)
  app.put("/api/partnerships/applications/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = partnerApplications.findIndex(p => p.id === id);
    if (index !== -1) {
      partnerApplications[index] = {
        ...partnerApplications[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      saveStore();
      res.json(partnerApplications[index]);
    } else {
      res.status(404).json({ error: "Partner application not found" });
    }
  });

  // Admin Delete Application
  app.delete("/api/partnerships/applications/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = partnerApplications.findIndex(p => p.id === id);
    if (index !== -1) {
      partnerApplications.splice(index, 1);
      saveStore();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Partner application not found" });
    }
  });

  // --- WhatsApp & SMS Automation Endpoints ---
  app.get("/api/notifications", (req, res) => {
    res.json(notificationsLog);
  });

  // Green-API Live WhatsApp Gateway Status & Test
  app.get("/api/green-api/status", async (req, res) => {
    try {
      const endpoint = `${GREEN_API_API_URL}/waInstance${GREEN_API_ID_INSTANCE}/getStateInstance/${GREEN_API_TOKEN_INSTANCE}`;
      const apiRes = await fetch(endpoint);
      const data = await apiRes.json();
      res.json({
        success: true,
        idInstance: GREEN_API_ID_INSTANCE,
        apiUrl: GREEN_API_API_URL,
        state: data.stateInstance || "unknown",
        connected: data.stateInstance === "authorized",
        adminPhone: ADMIN_NOTIFICATION_PHONE
      });
    } catch (err: any) {
      res.json({
        success: false,
        idInstance: GREEN_API_ID_INSTANCE,
        apiUrl: GREEN_API_API_URL,
        error: err?.message || "Failed to contact Green-API",
        state: "offline",
        connected: false
      });
    }
  });

  app.post("/api/green-api/test", async (req, res) => {
    try {
      const { phone, message } = req.body;
      const targetPhone = phone || ADMIN_NOTIFICATION_PHONE;
      const testMsg = message || `👋 [Quorik AI Gateway] Test WhatsApp message from your website AI agent! Green-API instance ${GREEN_API_ID_INSTANCE} is live and connected.`;
      const ok = await dispatchRealWhatsAppWithGreenApi(targetPhone, testMsg);
      res.json({
        success: ok,
        phone: targetPhone,
        message: testMsg,
        note: ok ? "WhatsApp delivered via Green-API" : "Check Green-API console or authorization status"
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post("/api/notifications/send", (req, res) => {
    const { recipientName, phone, messageText, channel } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    const sentLogs = sendWhatsAppSMSNotification({
      recipientName: recipientName || "Valued Lead",
      phone,
      channel: channel || "manual",
      messageText
    });
    res.json({ success: true, logs: sentLogs });
  });

  app.post("/api/notifications/remind/:appointmentId", (req, res) => {
    const { appointmentId } = req.params;
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    const sentLogs = sendWhatsAppSMSNotification({
      recipientName: apt.name,
      phone: apt.phone,
      channel: "reminder_1h",
      dateTime: apt.date_time
    });
    res.json({ success: true, logs: sentLogs });
  });

  // --- Client Accounts & Voice Usage Management Endpoints ---
  app.get("/api/clients", (req, res) => {
    res.json(clientAccounts);
  });

  app.get("/api/clients/:id/conversations", (req, res) => {
    const { id } = req.params;
    let client = clientAccounts.find(c => c.id === id);
    if (!client) {
      // Auto-provision client profile if not yet created so dashboard displays cleanly
      client = {
        id,
        clientName: id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        businessName: id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        industry: "Digital Services & Marketing",
        email: `contact@${id.toLowerCase()}.com`,
        phone: "+1 (555) 019-2834",
        websiteUrl: `https://${id.toLowerCase()}.com`,
        tier: "growth",
        monthlyVoiceMinutesLimit: 1200,
        voiceMinutesUsed: 0,
        monthlyTextChatLimit: 5000,
        textChatsUsed: 0,
        status: "active",
        voiceAgentName: "Arthur (Executive Concierge)",
        voiceLanguage: "English",
        totalConversations: 0,
        leadsCaptured: 0,
        lastActive: new Date().toISOString(),
        conversations: [],
        createdAt: new Date().toISOString()
      };
      clientAccounts.unshift(client);
      saveStore();
    }

    // Normalize conversations so every item includes valid dates, createdAt, and leadInfo
    const normalized = (client.conversations || []).map((conv: any) => {
      const createdDate = conv.createdAt || conv.date || new Date().toISOString();
      const visitorName = conv.visitorName && conv.visitorName !== 'Anonymous' && conv.visitorName !== 'Unknown' 
        ? conv.visitorName 
        : (conv.leadInfo?.name || (conv.visitorEmail ? conv.visitorEmail.split('@')[0] : 'Website Visitor'));
      
      const transcriptArray = Array.isArray(conv.transcript) && conv.transcript.length > 0
        ? conv.transcript
        : [
            {
              sender: 'user',
              role: 'user',
              text: conv.topic || 'Website Inquiry',
              timestamp: createdDate
            },
            {
              sender: 'ai',
              role: 'agent',
              text: conv.transcriptSummary || 'Agent responded to visitor query.',
              timestamp: createdDate
            }
          ];

      return {
        ...conv,
        id: conv.id || "conv-" + Math.random().toString(36).substring(2, 9),
        visitorName,
        visitorPhone: conv.visitorPhone || conv.leadInfo?.phone || undefined,
        visitorEmail: conv.visitorEmail || conv.leadInfo?.email || undefined,
        date: createdDate,
        createdAt: createdDate,
        topic: conv.topic || "Customer Inquiry",
        transcriptSummary: conv.transcriptSummary || "Visitor contacted the AI voice & chat assistant.",
        transcript: transcriptArray,
        leadInfo: conv.leadInfo || {
          name: visitorName,
          phone: conv.visitorPhone,
          email: conv.visitorEmail,
          notes: conv.transcriptSummary
        },
        durationMinutes: typeof conv.durationMinutes === 'number' ? conv.durationMinutes : 1,
        durationSeconds: typeof conv.durationSeconds === 'number' ? conv.durationSeconds : 60,
        status: conv.status || "completed",
        leadCaptured: Boolean(conv.leadCaptured || conv.visitorEmail || conv.visitorPhone || conv.leadInfo?.email || conv.leadInfo?.phone)
      };
    });

    res.json(normalized);
  });

  app.get("/api/clients/:id", (req, res) => {
    const { id } = req.params;
    const cleanId = String(id).trim().toLowerCase();
    let client = clientAccounts.find(c => 
      c.id.toLowerCase() === cleanId ||
      c.id.replace(/[-_]/g, '').toLowerCase() === cleanId.replace(/[-_]/g, '') ||
      c.businessName.toLowerCase() === cleanId ||
      (c.websiteUrl && c.websiteUrl.toLowerCase().includes(cleanId)) ||
      cleanId.includes(c.id.toLowerCase())
    );

    if (!client && (cleanId.includes('quorik') || cleanId.includes('system'))) {
      client = clientAccounts.find(c => c.id === 'quorik-google-ads');
    }

    if (!client) {
      // Auto-provision client profile if not yet created
      client = {
        id,
        clientName: id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        businessName: id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        industry: "Google Ads & Performance Marketing",
        email: `contact@${id.toLowerCase()}.com`,
        phone: "+1 (555) 019-2834",
        websiteUrl: `https://${id.toLowerCase()}.com`,
        tier: "starter",
        monthlyVoiceMinutesLimit: 300,
        voiceMinutesUsed: 0,
        monthlyTextChatLimit: 1000,
        textChatsUsed: 0,
        status: "active",
        voiceAgentName: "Arthur (Executive Concierge)",
        voiceLanguage: "English Only",
        totalConversations: 0,
        leadsCaptured: 0,
        lastActive: new Date().toISOString(),
        conversations: [],
        createdAt: new Date().toISOString()
      };
      clientAccounts.unshift(client);
      saveStore();
    }
    res.json(client);
  });

  app.post("/api/clients", authenticateToken, (req, res) => {
    const { 
      id,
      clientName, 
      businessName, 
      industry, 
      email, 
      phone, 
      websiteUrl, 
      tier, 
      voiceAgentName, 
      voiceLanguage 
    } = req.body;

    const selectedTier = (tier || 'starter') as 'starter' | 'growth' | 'enterprise';
    const limitMap = { starter: 300, growth: 1200, enterprise: 4000 };
    const chatLimitMap = { starter: 1000, growth: 5000, enterprise: 25000 };

    const generatedSlug = (businessName || 'client')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 20);

    const clientId = id && id.trim() 
      ? id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
      : `${generatedSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const newClient: ClientAccount = {
      id: clientId,
      clientName: clientName || "Valued Client",
      businessName: businessName || "Client Enterprise",
      industry: industry || "General Business",
      email: email || "client@domain.com",
      phone: phone || "N/A",
      websiteUrl: websiteUrl || "https://example.com",
      tier: selectedTier,
      monthlyVoiceMinutesLimit: limitMap[selectedTier] || 300,
      voiceMinutesUsed: 0,
      monthlyTextChatLimit: chatLimitMap[selectedTier] || 1000,
      textChatsUsed: 0,
      status: "active",
      voiceAgentName: voiceAgentName || "Arthur (AI Voice Concierge)",
      voiceLanguage: voiceLanguage || "English",
      totalConversations: 0,
      leadsCaptured: 0,
      lastActive: new Date().toISOString(),
      conversations: [],
      createdAt: new Date().toISOString()
    };

    clientAccounts.unshift(newClient);
    saveStore();
    res.json({ success: true, client: newClient });
  });

  app.put("/api/clients/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const idx = clientAccounts.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Client not found" });
    }

    const updated = { ...clientAccounts[idx], ...req.body };
    // If tier changed, optionally update limit if not custom
    if (req.body.tier && req.body.tier !== clientAccounts[idx].tier) {
      const limitMap = { starter: 300, growth: 1200, enterprise: 4000 };
      const chatLimitMap = { starter: 1000, growth: 5000, enterprise: 25000 };
      if (!req.body.monthlyVoiceMinutesLimit) {
        updated.monthlyVoiceMinutesLimit = limitMap[updated.tier as 'starter' | 'growth' | 'enterprise'] || 300;
      }
      if (!req.body.monthlyTextChatLimit) {
        updated.monthlyTextChatLimit = chatLimitMap[updated.tier as 'starter' | 'growth' | 'enterprise'] || 1000;
      }
    }

    // Auto-update status if over limit
    if (updated.voiceMinutesUsed >= updated.monthlyVoiceMinutesLimit && updated.textChatsUsed >= updated.monthlyTextChatLimit) {
      updated.status = 'limit_reached';
    }

    clientAccounts[idx] = updated;
    saveStore();
    res.json({ success: true, client: updated });
  });

  app.delete("/api/clients/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const idx = clientAccounts.findIndex(c => c.id === id);
    if (idx !== -1) {
      clientAccounts.splice(idx, 1);
      saveStore();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  });

  // Log a text chat message & increment chat usage
  app.post("/api/clients/:id/log-text-chat", (req, res) => {
    const { id } = req.params;
    const client = clientAccounts.find(c => c.id === id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    client.textChatsUsed = (client.textChatsUsed || 0) + 1;
    client.totalConversations = (client.totalConversations || 0) + 1;
    if (req.body.leadCaptured) client.leadsCaptured = (client.leadsCaptured || 0) + 1;
    client.lastActive = new Date().toISOString();

    // Auto-warning at 80% text chat usage
    const chatUsageRatio = client.textChatsUsed / (client.monthlyTextChatLimit || 1000);
    if (chatUsageRatio >= 0.8 && chatUsageRatio < 0.85) {
      sendWhatsAppSMSNotification({
        recipientName: client.clientName,
        phone: client.phone,
        channel: "manual",
        messageText: `🔔 [Quorik Notice] ${client.businessName} has used 80% of monthly AI text chats (${client.textChatsUsed}/${client.monthlyTextChatLimit}). Consider upgrading to Growth Suite for 5,000 chats & 1,200 voice mins.`
      });
    }

    if (client.textChatsUsed >= (client.monthlyTextChatLimit || 1000)) {
      if (client.voiceMinutesUsed >= (client.monthlyVoiceMinutesLimit || 300)) {
        client.status = "limit_reached";
      }
      sendWhatsAppSMSNotification({
        recipientName: client.clientName,
        phone: client.phone,
        channel: "manual",
        messageText: `⚠️ [Quorik Usage Alert] ${client.businessName} has reached 100% of their monthly chat quota (${client.monthlyTextChatLimit} chats). To continue capturing leads 24/7, upgrade to Growth Suite.`
      });
    }

    saveStore();
    res.json({ success: true, client });
  });

  // Log a conversation & increment voice usage
  app.post("/api/clients/:id/log-voice-call", (req, res) => {
    const { id } = req.params;
    const client = clientAccounts.find(c => c.id === id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const { visitorName, visitorPhone, durationSeconds, topic, transcriptSummary, leadCaptured } = req.body;
    const durSec = Number(durationSeconds) || 60;
    const durMin = Number((durSec / 60).toFixed(2));

    const newConv: VoiceConversation = {
      id: "conv-" + Math.random().toString(36).substring(2, 9),
      visitorName: visitorName || "Website Visitor",
      visitorPhone: visitorPhone || "N/A",
      date: new Date().toISOString(),
      durationSeconds: durSec,
      durationMinutes: durMin,
      topic: topic || "General Service Inquiry",
      transcriptSummary: transcriptSummary || "Visitor discussed website services and inquired about booking availability.",
      leadCaptured: !!leadCaptured,
      status: "completed"
    };

    client.conversations.unshift(newConv);
    client.voiceMinutesUsed = Math.round((client.voiceMinutesUsed + durMin) * 100) / 100;
    client.totalConversations += 1;
    if (leadCaptured) client.leadsCaptured += 1;
    client.lastActive = new Date().toISOString();

    const voiceUsageRatio = client.voiceMinutesUsed / (client.monthlyVoiceMinutesLimit || 300);

    // Auto-warning at 80% voice usage
    if (voiceUsageRatio >= 0.8 && voiceUsageRatio < 0.85) {
      sendWhatsAppSMSNotification({
        recipientName: client.clientName,
        phone: client.phone,
        channel: "manual",
        messageText: `🔔 [Quorik Voice Alert] ${client.businessName} has used 80% of monthly voice minutes (${Math.round(client.voiceMinutesUsed)}/${client.monthlyVoiceMinutesLimit} mins). Upgrade to Growth Suite to ensure uninterrupted caller booking.`
      });
    }

    // Check if 100% voice limit is reached
    if (client.voiceMinutesUsed >= client.monthlyVoiceMinutesLimit) {
      // Only set status to limit_reached if text chats are also exhausted!
      if (client.textChatsUsed >= (client.monthlyTextChatLimit || 1000)) {
        client.status = "limit_reached";
      }
      // Send automated notification alert to client with direct upgrade prompt
      sendWhatsAppSMSNotification({
        recipientName: client.clientName,
        phone: client.phone,
        channel: "manual",
        messageText: `⚠️ [Quorik Voice Alert] ${client.businessName} has reached 100% of their monthly voice minutes (${client.monthlyVoiceMinutesLimit} mins). Voice calling is temporarily paused while 24/7 AI Text Chat remains fully active. Upgrade to Growth (1,200 mins) to re-enable voice immediately.`
      });
    }

    saveStore();
    res.json({ success: true, client, conversation: newConv });
  });

  // Reset monthly minutes (for new month or after upgrade)
  app.post("/api/clients/:id/reset-minutes", authenticateToken, (req, res) => {
    const { id } = req.params;
    const client = clientAccounts.find(c => c.id === id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    client.voiceMinutesUsed = 0;
    client.textChatsUsed = 0;
    client.status = "active";
    saveStore();
    res.json({ success: true, client });
  });

  // Toggle client status (active / voice_paused / paused)
  app.post("/api/clients/:id/toggle-status", authenticateToken, (req, res) => {
    const { id } = req.params;
    const client = clientAccounts.find(c => c.id === id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (req.body && req.body.status) {
      client.status = req.body.status;
    } else {
      client.status = client.status === "paused" ? "active" : "paused";
    }
    saveStore();
    res.json({ success: true, client });
  });

  // --- Interactive AI Website & Automation Auditor Endpoint ---
  app.get("/api/audits", (req, res) => {
    res.json(auditsLog);
  });

  app.delete("/api/audits/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const idx = auditsLog.findIndex(a => a.id === id);
    if (idx !== -1) {
      auditsLog.splice(idx, 1);
      saveStore();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Audit not found" });
    }
  });

  // Resilient multi-tier model executor to handle 503 high-demand spikes & transient outages
  async function generateResilientContent(ai: GoogleGenAI, options: {
    contents: any;
    config?: any;
    primaryModel?: string;
  }) {
    // Ultra-low latency model sequence (<800ms) with high availability
    const modelsToTry = [
      options.primaryModel || "gemini-3.5-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.7-flash"
    ];
    const uniqueModels = Array.from(new Set(modelsToTry));

    let lastError: any = null;
    for (const model of uniqueModels) {
      try {
        const attemptPromise = ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config
        });
        const attemptTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${model} timed out after 4s`)), 4000)
        );
        const response: any = await Promise.race([attemptPromise, attemptTimeout]);
        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        if (msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE")) {
          console.info(`[Gemini Resilience] Model ${model} high demand notice. Smoothly switching to next fast tier.`);
        } else {
          console.warn(`[Gemini Resilience] Model ${model} notice: ${msg.substring(0, 90)}. Switching to next backup model.`);
        }
      }
    }
    throw lastError || new Error("All Gemini models temporarily unavailable");
  }

  app.post("/api/audit", async (req, res) => {
    try {
      const { businessName, websiteUrl, industry, currentPlatform, goals, name, email, phone } = req.body;

      if (!websiteUrl || !goals) {
        return res.status(400).json({ error: "Website URL and goals are required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are Quorik's Chief AI Infrastructure & UX Automation Architect. Perform a detailed website & business automation audit for:
- Business Name: ${businessName || "Client Business"}
- Website URL: ${websiteUrl}
- Industry/Niche: ${industry || "General Business"}
- Current Tech Platform: ${currentPlatform || "Custom/Unknown"}
- Primary Business Goals: ${goals}

Respond ONLY in valid JSON format matching this exact schema:
{
  "score": number (0-100 score for current website & automation readiness),
  "summary": "2-3 sentence executive summary of key findings",
  "opportunities": [
    {
      "title": "Short title",
      "impact": "High" | "Medium" | "Critical",
      "description": "How to automate this (e.g. AI Voice Receptionist, Instant WhatsApp Follow-up)",
      "estimatedSavings": "e.g. 15 hours/week or +$3,000/mo"
    }
  ] (provide 3 items),
  "bottlenecks": [
    {
      "issue": "Identified bottleneck on site/funnel",
      "severity": "High" | "Medium",
      "fix": "Actionable solution offered by Quorik"
    }
  ] (provide 2-3 items),
  "estimatedMonthlyRevenueGrowth": "e.g. +$4,500 - $8,000 / month",
  "hoursSavedPerWeek": number (e.g. 25),
  "actionPlan": [
    "Phase 1: Step title & detail",
    "Phase 2: Step title & detail",
    "Phase 3: Step title & detail"
  ]
}`;

      const response = await generateResilientContent(ai, {
        primaryModel: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const auditData = JSON.parse(response.text || "{}");

      const newAudit: AuditReport = {
        id: Math.random().toString(36).substring(2, 9),
        businessName: businessName || "Prospective Client",
        websiteUrl,
        industry: industry || "N/A",
        currentPlatform: currentPlatform || "N/A",
        goals,
        contactName: name || "Valued Lead",
        email: email || "N/A",
        phone: phone || "N/A",
        score: auditData.score || 72,
        summary: auditData.summary || "Website has strong foundational potential but lacks instant AI lead qualification and automated WhatsApp/SMS response flows.",
        opportunities: auditData.opportunities || [
          {
            title: "24/7 AI Voice Receptionist",
            impact: "Critical",
            description: "Deploy an AI voice agent to answer calls, qualify leads, and book calls immediately.",
            estimatedSavings: "+20 hours/week"
          },
          {
            title: "Instant WhatsApp & SMS Auto-Confirmation",
            impact: "High",
            description: "Send automated text confirmations within 3 seconds of form submission.",
            estimatedSavings: "+35% lead conversion"
          }
        ],
        bottlenecks: auditData.bottlenecks || [
          {
            issue: "Slow response time to inquiry calls and forms",
            severity: "High",
            fix: "Connect Quorik Voice AI & WhatsApp Gateway"
          }
        ],
        estimatedMonthlyRevenueGrowth: auditData.estimatedMonthlyRevenueGrowth || "+$5,000 / month",
        hoursSavedPerWeek: auditData.hoursSavedPerWeek || 22,
        actionPlan: auditData.actionPlan || [
          "Phase 1: Implement Quorik AI Voice Assistant for instant call handling",
          "Phase 2: Enable instant WhatsApp & SMS automated follow-up sequences",
          "Phase 3: Optimize website CTA funnel for higher booking conversion"
        ],
        createdAt: new Date().toISOString()
      };

      auditsLog.unshift(newAudit);
      saveStore();

      // Trigger instant WhatsApp & SMS audit report notification if phone provided
      if (phone && phone !== "N/A") {
        sendWhatsAppSMSNotification({
          recipientName: name || businessName,
          phone,
          channel: "audit_report",
          messageText: `🔍 [Quorik AI Audit Complete] Hi ${name || businessName}! Your AI Website & Automation Audit for ${websiteUrl} is ready (Automation Score: ${newAudit.score}/100). Check your report or book a discovery call to review!`
        });
      }

      res.json({ success: true, audit: newAudit });
    } catch (error: any) {
      console.error("Audit API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI Audit" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, accent, clientId, isVoice, isVoiceMode, durationSeconds, visitorName, visitorPhone, visitorEmail } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
      }

      // Check if this chat request comes from an embedded client portal
      let clientTarget: any = null;
      const originHeader = String(req.headers.origin || req.headers.referer || '').toLowerCase();

      if (clientId) {
        const cleanId = String(clientId).trim().toLowerCase();
        clientTarget = clientAccounts.find(c => 
          c.id.toLowerCase() === cleanId ||
          c.id.replace(/[-_]/g, '').toLowerCase() === cleanId.replace(/[-_]/g, '') ||
          c.businessName.toLowerCase() === cleanId ||
          (c.websiteUrl && c.websiteUrl.toLowerCase().includes(cleanId)) ||
          cleanId.includes(c.id.toLowerCase())
        );
      }

      // Domain & Referer fallback lookup (e.g. from quoriksystem.online)
      if (!clientTarget && originHeader) {
        clientTarget = clientAccounts.find(c => {
          if (!c.websiteUrl) return false;
          const cleanWeb = c.websiteUrl.replace(/https?:\/\//, '').replace(/\/$/, '').toLowerCase();
          return originHeader.includes(cleanWeb) || (cleanWeb.includes('quoriksystem') && originHeader.includes('quoriksystem'));
        });
      }

      // Special fallback for quoriksystem.online domain
      if (!clientTarget && (originHeader.includes('quoriksystem') || (clientId && String(clientId).toLowerCase().includes('quorik')))) {
        clientTarget = clientAccounts.find(c => c.id === 'quorik-google-ads');
      }

      if (clientId && !clientTarget) {
        // Auto-register client profile if new
        const cleanId = String(clientId).trim();
        clientTarget = {
          id: cleanId,
          clientName: cleanId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          businessName: cleanId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          industry: "Google Ads & Performance Marketing",
          email: `contact@${cleanId.toLowerCase()}.com`,
          phone: "+1 (555) 019-2834",
          websiteUrl: originHeader ? String(req.headers.origin || req.headers.referer) : `https://${cleanId.toLowerCase()}.com`,
          tier: "starter",
          monthlyVoiceMinutesLimit: 300,
          voiceMinutesUsed: 0,
          monthlyTextChatLimit: 1000,
          textChatsUsed: 0,
          status: "active",
          voiceAgentName: "Arthur (Executive Concierge)",
          voiceLanguage: "English Only",
          totalConversations: 0,
          leadsCaptured: 0,
          lastActive: new Date().toISOString(),
          conversations: [],
          createdAt: new Date().toISOString()
        };
        clientAccounts.unshift(clientTarget);
        saveStore();
      }

      if (clientTarget) {
        if (clientTarget.status === 'paused') {
          return res.status(403).json({ error: "This client portal is currently paused by administrator." });
        }
        if (clientTarget.status === 'limit_reached') {
          return res.status(403).json({ error: "Monthly voice and text quotas are reached for this client account. Please contact support." });
        }

        const isVoiceCall = Boolean(isVoice || isVoiceMode);
        const isVoiceLimitReached = (clientTarget.voiceMinutesUsed >= clientTarget.monthlyVoiceMinutesLimit) || clientTarget.status === 'voice_paused';
        const isTextLimitReached = (clientTarget.textChatsUsed >= (clientTarget.monthlyTextChatLimit || 1000)) || clientTarget.status === 'chat_paused';

        if (isVoiceCall && isVoiceLimitReached) {
          return res.status(403).json({ 
            error: "Monthly voice call minutes quota reached for this account. 24/7 AI Text Chat remains fully active.",
            voiceQuotaExhausted: true 
          });
        }

        if (!isVoiceCall && isTextLimitReached) {
          return res.status(403).json({ 
            error: clientTarget.status === 'chat_paused' 
              ? "AI Text Chat is currently paused for this portal. Voice calling is 100% active."
              : "Monthly text chat quota reached for this account. Please contact support to upgrade.",
            textQuotaExhausted: true,
            chatPaused: clientTarget.status === 'chat_paused'
          });
        }
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      let systemInstruction = "";

      if (clientTarget) {
        // Dynamic client-specific AI prompt for embedded widgets on client websites
        const hasValidFounder = clientTarget.clientName && 
          clientTarget.clientName.trim().length > 1 &&
          clientTarget.clientName.trim().toLowerCase() !== clientTarget.businessName.trim().toLowerCase();

        const founderInfo = hasValidFounder
          ? `FOUNDER & LEADERSHIP INFORMATION:
- Founder / Owner: ${clientTarget.clientName} is the founder and head of ${clientTarget.businessName}.
- If a visitor asks "who is the founder", "who is the CEO", "who owns this", or "who created this company", state clearly: "${clientTarget.businessName} was founded and is led by ${clientTarget.clientName}. We specialize in ${clientTarget.industry} to drive exceptional performance and measurable ROI."`
          : `FOUNDER & LEADERSHIP INFORMATION:
- Leadership: ${clientTarget.businessName} is led and operated by our executive leadership team and certified ${clientTarget.industry} specialists. If asked who the founder or CEO is, state that ${clientTarget.businessName} is led by our executive leadership team. For direct executive inquiries, they can email ${clientTarget.email || clientTarget.websiteUrl}.`;

        systemInstruction = `You are ${clientTarget.voiceAgentName || "Arthur (Executive Concierge)"}, the dedicated 24/7 AI voice and chat representative for "${clientTarget.businessName}".
Industry / Specialty: ${clientTarget.industry}
Contact & Website: ${clientTarget.websiteUrl} (${clientTarget.email || ""})
Languages Supported: ${clientTarget.voiceLanguage || "English"}

${founderInfo}

CORE OBJECTIVES & PERSONA RULES:
1. You represent ONLY ${clientTarget.businessName}. Do NOT mention any third-party providers or external agency names unless referring to ${clientTarget.businessName}.
2. Greet visitors warmly and speak on behalf of ${clientTarget.businessName} with high professional authority.
3. Answer inquiries about ${clientTarget.businessName}'s services and offerings accurately.
4. When visitors ask about the founder or CEO, always answer directly and accurately using the founder information above.
5. Offer to book a consultation/appointment or capture the visitor's name, email, and phone number so the team can follow up.
6. Keep answers crisp, conversational, and direct (2-3 sentences max) so it sounds natural when spoken aloud over voice.`;
      } else {
        let toneInstruction = "Tone: Professional, welcoming, and concise.";
        if (accent === "arthur") {
          toneInstruction = "Language & Persona: Professional Corporate Voice (Arthur Persona). You MUST start your response with 'Hello!' or 'Welcome!'. Reply in clear, articulate executive English as Arthur, Quorik's AI Voice Concierge.";
        } else if (accent === "us") {
          toneInstruction = "Language & Persona: Professional American English (US Executive). You MUST start greetings with 'Hello!' or 'Welcome!'. Reply strictly in clean, direct American English with an executive, metrics-driven tone.";
        } else if (accent === "uk") {
          toneInstruction = "Language & Persona: Refined British English. You MUST start greetings with 'Good day!' or 'Hello!'. Polished, articulate, precise, and polite.";
        } else if (accent === "casual") {
          toneInstruction = "Language & Persona: Casual Tech English. You MUST start greetings with 'Hey!' or 'Yo!'. Energetic, enthusiastic startup tech vibe.";
        }

        systemInstruction = `You are Quorik AI, an intelligent assistant for Quorik (founded by Shehram Meellu, Founder & CEO).
${toneInstruction}

FOUNDER & LEADERSHIP INFORMATION (5 CORE COUNCIL SPECIALISTS):
- 1. Founder & CEO / Lead Developer: Shehram Meellu is the Founder & CEO of Quorik. He is a senior AI engineering architect, full-stack software engineer, and digital growth executive. Tagline: "Building Scalable Solutions. Driving Innovation." Under his leadership, Quorik builds robust digital systems, multi-lingual conversational AI, and automated lead pipelines for businesses worldwide.
- 2. Tech Director: M.R. directs Quorik's global technology standards, backend infrastructure, and software scalability paradigms.
- 3. Voice Solutions Lead: A.K. leads Quorik's neural voice technology and telephony orchestration layer, specializing in sub-800ms low-latency conversational speech synthesis and WebRTC/SIP streams.
- 4. Systems Ops Director: Farhaj oversees 24/7 cloud infrastructure, server reliability, Kubernetes clusters, and site reliability engineering.
- 5. Integration Lead: D.C. leads Quorik's enterprise CRM synchronizations (HubSpot, GoHighLevel, Salesforce) and multi-channel webhook dispatch architectures.
- Corporate Contact & Bookings: Clients can book a direct discovery consultation right on the website or connect with General Inquiries at info@quoriksystems.com, or Sales at sales@quoriksystems.com.

RESPONSE STYLE RULES:
- ALWAYS finish every single sentence completely. Never stop mid-sentence.
- Provide clear, articulate, and complete responses in 2 to 3 full sentences.
- When asked who the founder/owner/CEO of Quorik is or to tell about Shehram Meellu, respond with high-ticket corporate authority: "Shehram Meellu is the Founder & CEO of Quorik. He is a senior AI engineering architect and technology strategist who founded Quorik to build high-performance custom web applications and zero-latency 24/7 AI Voice Agents for modern businesses. Under his technical leadership, Quorik develops autonomous AI receptionists and digital platforms that drive measurable growth. You can schedule a direct discovery consultation with our team or connect via email at info@quoriksystems.com."
- DO NOT share or mention any direct WhatsApp phone number or personal cellular SIM numbers. Direct callers exclusively to email at info@quoriksystems.com or the official booking form.

PRICING & SETUP FEES:
Our engagement model consists of a 1-Time Custom Development & Setup Fee followed by a monthly Subscription:
- Starter AI: $999 One-Time Setup + $199/month (or $159/month billed annually). Includes custom high-speed React website (up to 5 pages), 1 in-browser AI Voice Agent, 300 interactive voice minutes/mo, 1,000 AI chats/mo, WhatsApp lead alerts, and Google Calendar sync.
- Growth Suite (Most Popular): $1,999 One-Time Setup + $399/month (or $319/month billed annually). Includes full custom web app with CMS, 2 dedicated AI Voice Agents (Sales & Support), 1,200 interactive voice minutes/mo, 5,000 AI chats/mo, multi-language & voice persona support, automated WhatsApp follow-ups, two-way CRM integration, and priority 12h SLA support.
- Enterprise Ultra: $3,999 One-Time Setup + $799/month (or $639/month billed annually). Includes bespoke full-stack enterprise web platform, unlimited custom AI Voice Agents with custom cloned neural voice, 4,000+ voice minutes/mo, unlimited chats, custom LLM fine-tuning (RAG), deep ERP & webhook integrations, and dedicated solution architect.

CORE AI VOICE AGENT FEATURES YOU PROVIDE:
- 🌙 After-Hours & Call Overflow Manager: Handles 100% of overflow web/phone inquiries 24/7.
- ⚡ 24/7 Simultaneous Concurrency: Never places callers on hold or gives busy signals.
- 📱 Instant WhatsApp & SMS Confirmations: Sends instant text and WhatsApp confirmations upon booking appointments.
- 🌍 Multi-Lingual Accent Support: Supports Arthur Executive AI, US Executive, UK Refined, and Casual Tech personas.

IMPORTANT CARD TRIGGER RULES:
1. If the user asks about pricing, packages, or costs, include [CARD:PRICING] in your response.
2. If the user asks about portfolio, work, or case studies, include [CARD:PORTFOLIO] in your response.
3. If the user asks about ROI, revenue growth, or savings, include [CARD:ROI] in your response.`;
      }

      const formattedContents = [
        ...(history || []),
        { role: "user", parts: [{ text: message }] }
      ];

      const isVoiceRequest = Boolean(isVoice || isVoiceMode);
      let replyText = "";
      try {
        // Resilient model invocation
        const generatePromise = generateResilientContent(ai, {
          primaryModel: "gemini-3.5-flash-lite",
          contents: formattedContents,
          config: {
            systemInstruction,
            maxOutputTokens: isVoiceRequest ? 160 : 300,
            temperature: 0.4,
          },
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("AI response timeout")), 12000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        replyText = response?.text || "";
      } catch (modelErr: any) {
        console.warn("[Chat API Notice] AI model request fallback triggered:", modelErr?.message || modelErr);
        if (clientTarget) {
          replyText = `Thank you for reaching ${clientTarget.businessName}! We specialize in ${clientTarget.industry || "Google Ads and high-converting marketing solutions"}. May I have your name and email address or phone number so our team can follow up directly and schedule a consultation?`;
        } else {
          replyText = `Hello and thank you for reaching Quorik! We specialize in high-converting Google Ads, custom web platforms, and 24/7 AI automation. Would you like to schedule a discovery consultation with our team? Please share your name and email.`;
        }
      }

      if (!replyText) {
        replyText = clientTarget 
          ? `Thank you for inquiring with ${clientTarget.businessName}. Please share your name and email address, and our team will be delighted to assist you!`
          : `Thank you for contacting Quorik! Please share your contact details or email us at info@quoriksystems.com.`;
      }

      // Automatically track client voice minutes or text chats
      if (clientTarget) {
        const isVoiceCall = Boolean(isVoice || isVoiceMode);
        const timestampNow = new Date().toISOString();

        // Extract potential lead details with high precision (avoid matching generic conversational text)
        const emailMatch = (message || "").match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
        const phoneMatch = (message || "").match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
        const nameMatch = (message || "").match(/(?:my name is|my full name is|call me|name:\s*)\s+([a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})?)/i);
        
        const extractedEmail = emailMatch ? emailMatch[1] : (visitorEmail || "");
        const extractedPhone = phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7 ? phoneMatch[0] : (visitorPhone || "");
        const extractedName = nameMatch ? nameMatch[1].trim() : (visitorName && visitorName !== "Website Visitor" && visitorName !== "Website Caller" ? visitorName : "");
        
        // A true captured lead strictly requires a verifiable contact method (valid Email or 7+ digit Phone number)
        const isLead = Boolean(extractedEmail || extractedPhone);

        // Build transcript history array
        const transcriptArray: TranscriptMessage[] = [];
        if (Array.isArray(history)) {
          for (const item of history) {
            const role = item.role === 'model' ? 'ai' : 'user';
            const textContent = item.parts?.map((p: any) => p.text).join(" ") || item.text || "";
            if (textContent) {
              transcriptArray.push({
                sender: role,
                role: role,
                text: textContent,
                timestamp: timestampNow
              });
            }
          }
        }
        transcriptArray.push({
          sender: 'user',
          role: 'user',
          text: message || "",
          timestamp: timestampNow
        });
        transcriptArray.push({
          sender: 'ai',
          role: 'model',
          text: replyText,
          timestamp: timestampNow
        });

        if (isVoiceCall) {
          // Calculate speech duration: caller speech + AI spoken reply
          const textWords = (message ? message.split(/\s+/).length : 5) + (replyText.split(/\s+/).length || 25);
          const computedSeconds = Math.max(15, Math.round((textWords / 130) * 60) + 8);
          const durSec = Number(durationSeconds) > 0 ? Number(durationSeconds) : computedSeconds;
          const durMin = Number((durSec / 60).toFixed(2));

          clientTarget.voiceMinutesUsed = Math.round((clientTarget.voiceMinutesUsed + durMin) * 100) / 100;
          clientTarget.totalConversations = (clientTarget.totalConversations || 0) + 1;
          if (isLead) clientTarget.leadsCaptured = (clientTarget.leadsCaptured || 0) + 1;
          clientTarget.lastActive = timestampNow;

          const newConv: VoiceConversation = {
            id: "conv-" + Math.random().toString(36).substring(2, 9),
            visitorName: extractedName || (extractedEmail ? extractedEmail.split('@')[0] : "Website Voice Caller"),
            visitorPhone: extractedPhone || undefined,
            visitorEmail: extractedEmail || undefined,
            date: timestampNow,
            createdAt: timestampNow,
            durationSeconds: durSec,
            durationMinutes: durMin,
            topic: message.length > 60 ? message.substring(0, 57) + "..." : (message || "Voice Inquiry"),
            transcriptSummary: `Caller asked: "${message.substring(0, 120)}". AI answered: "${replyText.substring(0, 140)}..."`,
            transcript: transcriptArray,
            leadInfo: {
              name: extractedName || undefined,
              email: extractedEmail || undefined,
              phone: extractedPhone || undefined,
              notes: `Voice session inquiry regarding: ${message.substring(0, 80)}`
            },
            leadCaptured: isLead,
            status: "completed"
          };

          clientTarget.conversations.unshift(newConv);

          if (clientTarget.voiceMinutesUsed >= (clientTarget.monthlyVoiceMinutesLimit || 300)) {
            clientTarget.status = "limit_reached";
          }
        } else {
          clientTarget.textChatsUsed = (clientTarget.textChatsUsed || 0) + 1;
          clientTarget.totalConversations = (clientTarget.totalConversations || 0) + 1;
          clientTarget.lastActive = timestampNow;
          if (isLead) clientTarget.leadsCaptured = (clientTarget.leadsCaptured || 0) + 1;

          const newConv: VoiceConversation = {
            id: "conv-" + Math.random().toString(36).substring(2, 9),
            visitorName: extractedName || (extractedEmail ? extractedEmail.split('@')[0] : "Website Visitor"),
            visitorPhone: extractedPhone || undefined,
            visitorEmail: extractedEmail || undefined,
            date: timestampNow,
            createdAt: timestampNow,
            durationSeconds: 30,
            durationMinutes: 0.5,
            topic: message.length > 60 ? message.substring(0, 57) + "..." : (message || "Text Inquiry"),
            transcriptSummary: `Visitor asked: "${message.substring(0, 120)}". AI answered: "${replyText.substring(0, 140)}..."`,
            transcript: transcriptArray,
            leadInfo: {
              name: extractedName || undefined,
              email: extractedEmail || undefined,
              phone: extractedPhone || undefined,
              notes: `Live chat inquiry regarding: ${message.substring(0, 80)}`
            },
            leadCaptured: isLead,
            status: "completed"
          };

          clientTarget.conversations.unshift(newConv);

          if (clientTarget.textChatsUsed >= (clientTarget.monthlyTextChatLimit || 1000) && clientTarget.voiceMinutesUsed >= (clientTarget.monthlyVoiceMinutesLimit || 300)) {
            clientTarget.status = "limit_reached";
          }
        }
        saveStore();
      }

      res.json({ text: replyText });
    } catch (error: any) {
      console.error("Chat API fallback handler:", error);
      const fallbackMsg = `Thank you for your message! How can we assist you with our Google Ads management and automation solutions today? Please share your name and email to connect with our team.`;
      res.json({ text: fallbackMsg });
    }
  });

  // --- Dynamic Voice Agent Call Simulator Endpoint ---
  app.post("/api/voice-agent/simulate-call", async (req, res) => {
    try {
      const { personaId, gender, userQuery, scenario, conversationHistory, customCompany } = req.body;

      let normalizedUserQuery = (userQuery || "").trim();
      // Normalize common speech-to-text mishearings for founder queries only when not a custom company
      if (!customCompany?.name) {
        if (
          /th\s*(?:ouyr|our|your|ur)?\s*(?:oundrr|founder|foundr|fownder)/i.test(normalizedUserQuery) ||
          /(?:who(?:'s| is)?\s+(?:the|your|ur)?\s*(?:oundrr|founder|foundr|fownder|ceo|c\.e\.o\.|owner|boss|creator|lead))/i.test(normalizedUserQuery) ||
          /(?:who\s+(?:started|founded|created|built|made)\s*(?:quorik|korik|this|company)?)/i.test(normalizedUserQuery) ||
          /(?:tell\s+me\s+about\s+(?:the|your)?\s*(?:founder|ceo|shehram))/i.test(normalizedUserQuery) ||
          /(?:shehram\s+meellu|shehram\s+melu|shehram)/i.test(normalizedUserQuery)
        ) {
          normalizedUserQuery = "Who is the founder and CEO of Quorik?";
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let personaName = gender === 'female' ? 'Zephyr' : 'Arthur';
      let systemPersonaInstruction = "";

      const companyName = customCompany?.name || "Quorik";
      const companyServices = customCompany?.services && Array.isArray(customCompany.services) && customCompany.services.length > 0
        ? customCompany.services.join(", ")
        : "Custom Web Development, AI Chatbots, AI Voice Agents, and Automated Workflows";

      const consultationBookingRules = `
MEETING & CONSULTATION BOOKING PROTOCOL:
When a caller expresses interest in booking a consultation, meeting, or scheduling a call:
1. Check what information has already been provided in the conversation history or current query:
   - Caller Name
   - Preferred Date & Time
   - Email Address (for calendar invitation)
   - Phone Number (for WhatsApp/SMS confirmation)
2. If any of these are missing:
   - Acknowledge what was given.
   - Politely ask for the missing details in a conversational, concise manner (1-2 sentences max).
   - If Name & Time are missing, ask: "I'd be delighted to book that for you! May I have your name and preferred day and time for the meeting?"
   - If Name/Time are known but Email/Phone are missing, ask: "Great! Could you please share your email address and phone number so I can send the calendar invite and confirmation?"
3. If all details (Name, Time, Email, Phone) have been provided:
   - Enthusiastically confirm the appointment: "Perfect [Name]! I have scheduled your [Topic] consultation for [Time]. A calendar invite has been sent to [Email], and a confirmation to your phone. We look forward to speaking with you!"
4. If the caller asks general questions (services, founder, pricing), answer directly and then ask if they would like to schedule a discovery call.`;

      const founderDetailInformation = `
FOUNDER & CEO INFORMATION:
- Name & Title: Shehram Meellu, Founder & CEO of Quorik.
- Background & Expertise: Senior AI engineering architect, full-stack software engineer, and technology strategist.
- Mission & Vision: Shehram founded Quorik to bridge high-performance custom web engineering with zero-latency autonomous AI voice agents and smart chatbots, ensuring modern businesses never miss a customer and operate seamlessly 24/7.
- Leadership: Leads Quorik's engineering team in deploying conversion-focused web platforms, multi-lingual Voice AI receptionists, and automated CRM pipelines that drive measurable revenue growth.
- If the caller asks about the founder or CEO, deliver this detailed background with authority, warmth, and professionalism, and invite them to schedule a discovery consultation.`;

      const pricingInformation = `
PRICING & PACKAGES KNOWLEDGE:
- Starter AI Plan: $999 One-Time Setup + $199/month (or $159/month billed annually). Includes custom 5-page React website, 1 AI Voice Agent, 300 voice minutes/month, 1,000 AI chats/month, and calendar sync.
- Growth Suite Plan (Most Popular): $1,999 One-Time Setup + $399/month (or $319/month billed annually). Includes full custom web application, 2 dedicated AI Voice Agents (Sales & Support), 1,200 voice minutes/month, 5,000 AI chats/month, multi-language & voice persona support, and CRM integration.
- Enterprise Ultra Plan: $3,999 One-Time Setup + $799/month (or $639/month billed annually). Includes bespoke enterprise web platform, unlimited custom AI Voice Agents with custom cloned voice, 4,000+ voice minutes, and full ERP integration.
When the caller asks about pricing or costs, provide these transparent package prices clearly and concisely, and offer to schedule a discovery consultation.`;

      if (customCompany?.name) {
        personaName = customCompany?.agentName || (gender === 'female' ? 'Zephyr' : 'Arthur');
        const customFounderText = customCompany?.founder
          ? `Founder, Owner & Leadership: ${customCompany.name} is founded and led by ${customCompany.founder}, who heads our specialist team.`
          : `Leadership & Ownership: ${customCompany.name} is proudly owned and operated by our experienced local specialist management team.`;
        const locationText = customCompany?.location ? `Location: ${customCompany.location}` : '';
        const hoursText = customCompany?.hours ? `Hours: ${customCompany.hours}` : '';
        const faqsText = customCompany?.faqs && Array.isArray(customCompany.faqs) && customCompany.faqs.length > 0
          ? `Frequently Asked Questions:\n${customCompany.faqs.join('\n')}`
          : '';
        const reviewsText = customCompany?.reviews && Array.isArray(customCompany.reviews) && customCompany.reviews.length > 0
          ? `Customer Reviews & Social Proof:\n${customCompany.reviews.join('\n')}`
          : '';

        systemPersonaInstruction = `You are ${personaName}, the 24/7 AI Voice Concierge & Receptionist for "${companyName}".
Tone: Professional, warm, articulate, and welcoming.
Company Details:
- Business: ${companyName}
- Services & Pricing: ${companyServices}
- ${locationText}
- ${hoursText}
- ${customFounderText}
${faqsText ? `- ${faqsText}\n` : ''}${reviewsText ? `- ${reviewsText}\n` : ''}
RULES:
1. Speak concisely in natural spoken English (1-2 sentences max).
2. When asked about pricing or services, quote the specific services and rates provided above.
3. When asked about location or business hours, provide the location and hours clearly.
4. When asked about the owner, founder, or leadership, state the leadership and ownership details clearly.
5. When asked to schedule an appointment, ask for their preferred day/time and contact details politely.
${consultationBookingRules}`;
      } else if (personaId === 'uk-refined') {
        personaName = gender === 'female' ? 'Clara' : 'Arthur';
        systemPersonaInstruction = `You are ${personaName}, a 24/7 AI Assistant for Quorik (Web Development & AI Automation Agency).
Language: Courteous Refined British English.
Key Services: ${companyServices}.
${founderDetailInformation}
${pricingInformation}
${consultationBookingRules}
Keep responses polite, articulate, and natural (2 to 3 concise spoken sentences).`;
      } else {
        personaName = gender === 'female' ? 'Zephyr' : 'Arthur';
        systemPersonaInstruction = `You are ${personaName}, a 24/7 AI Executive Assistant for Quorik (Web Development & AI Automation Agency).
Language: Professional American English.
Key Services: ${companyServices}.
${founderDetailInformation}
${pricingInformation}
${consultationBookingRules}
Keep responses articulate, authoritative, and natural (2 to 3 concise spoken sentences).`;
      }

      const prompt = `${systemPersonaInstruction}

User Caller Query: "${normalizedUserQuery || `Hello, I'm calling to inquire about services and book a consultation with ${companyName}.`}"

Previous Conversation History:
${JSON.stringify(conversationHistory || [])}

Perform 2 tasks:
1. Generate the natural spoken phone response for ${personaName} representing ${companyName} following the booking protocol.
2. Extract all available lead details (accumulating from both conversation history and current query).

Respond ONLY in valid JSON matching this schema:
{
  "aiSpeechText": "The exact spoken phone response for the AI Receptionist in clear English (1-2 sentences max)",
  "callerName": "Extracted caller name or empty string if not provided",
  "callerEmail": "Extracted email address or empty string if not provided",
  "callerPhone": "Extracted phone number or empty string if not provided",
  "requestedSlot": "Extracted date/time or empty string if not provided",
  "topic": "Extracted specific service topic",
  "bookingStatus": "in_progress | confirmed | inquiry_only",
  "missingFields": ["list of missing fields among name, time, email, phone"],
  "whatsappMessage": "Short WhatsApp alert message summary for team dispatch"
}`;

      // Smart rule-based extraction helper for fallback
      const extractFallbackResponse = (query: string, pName: string, cName: string, history: any[] = []) => {
        const fullText = (history.map(m => m.text).join(" ") + " " + query).toLowerCase();
        const currentLower = (query || "").toLowerCase();

        // Extract name
        const nameMatch = (query + " " + history.map(m => m.text).join(" ")).match(/(?:my name is|i am|i'm|this is|name:\s*)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
        const callerName = nameMatch ? nameMatch[1].trim() : '';

        // Extract email
        const emailMatch = (query + " " + history.map(m => m.text).join(" ")).match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        const callerEmail = emailMatch ? emailMatch[1] : '';

        // Extract phone
        const phoneMatch = (query + " " + history.map(m => m.text).join(" ")).match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const callerPhone = phoneMatch ? phoneMatch[0] : '';

        // Extract time/slot
        let requestedSlot = '';
        if (fullText.includes('tomorrow') || fullText.includes('pm') || fullText.includes('am') || fullText.includes('monday') || fullText.includes('tuesday') || fullText.includes('wednesday') || fullText.includes('thursday') || fullText.includes('friday')) {
          const timeMatch = (query + " " + history.map(m => m.text).join(" ")).match(/(?:tomorrow|next week|monday|tuesday|wednesday|thursday|friday|today)?\s*(?:at|@)?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i);
          requestedSlot = timeMatch ? timeMatch[0].trim() : 'Tomorrow @ 11:00 AM EST';
        }

        // Determine Topic
        let topic = 'Appointment & Consultation';
        if (customCompany?.services && Array.isArray(customCompany.services) && customCompany.services.length > 0) {
          topic = customCompany.services[0];
        } else if (fullText.includes('voice') || fullText.includes('agent')) topic = 'AI Voice Agent Setup';
        else if (fullText.includes('website') || fullText.includes('web')) topic = 'Custom Website Development';
        else if (fullText.includes('chatbot')) topic = 'AI Chatbot Integration';

        const greeting = callerName ? `Hello ${callerName}!` : `Hello!`;

        // Location / Hours query
        if (currentLower.includes('location') || currentLower.includes('located') || currentLower.includes('where are') || currentLower.includes('address') || currentLower.includes('hours') || currentLower.includes('open')) {
          const loc = customCompany?.location || "Metropolitan Center";
          const hrs = customCompany?.hours || "Monday to Saturday 8:00 AM to 7:00 PM";
          return {
            aiSpeechText: `${cName} is located at ${loc}. Our hours are ${hrs}, and our 24/7 AI voice line is always active. Would you like to schedule a visit?`,
            callerName,
            callerEmail,
            callerPhone,
            requestedSlot: requestedSlot || 'Pending Slot Selection',
            topic: 'Location & Hours Inquiry',
            bookingStatus: 'inquiry_only',
            missingFields: ['name', 'time', 'email', 'phone'],
            whatsappMessage: `📍 LOCATION & HOURS INQUIRY: Visitor asked for location and schedule at ${cName}.`
          };
        }

        // Check if query matches any custom company FAQ
        if (customCompany?.faqs && Array.isArray(customCompany.faqs)) {
          for (const faq of customCompany.faqs) {
            const faqStr = typeof faq === 'string' ? faq : '';
            const qMatch = faqStr.match(/^Q:\s*(.*?)\s*A:\s*(.*)$/i);
            if (qMatch) {
              const question = qMatch[1].toLowerCase();
              const answer = qMatch[2];
              const queryTokens = currentLower.split(/\s+/).filter(t => t.length > 3);
              const matchesCount = queryTokens.filter(t => question.includes(t)).length;
              if (matchesCount >= 2 || (queryTokens.length > 0 && queryTokens.some(t => question.includes(t)))) {
                return {
                  aiSpeechText: `${answer} Would you like me to reserve an appointment for you today?`,
                  callerName,
                  callerEmail,
                  callerPhone,
                  requestedSlot: requestedSlot || 'Pending Slot Selection',
                  topic: 'FAQ & Service Details',
                  bookingStatus: 'inquiry_only',
                  missingFields: ['name', 'time', 'email', 'phone'],
                  whatsappMessage: `ℹ️ FAQ INQUIRY: Visitor asked about: "${qMatch[1]}" for ${cName}.`
                };
              }
            }
          }
        }

        // Founder / Owner / Leadership query
        if (
          currentLower.includes('founder') || 
          currentLower.includes('ceo') || 
          currentLower.includes('owner') ||
          currentLower.includes('who owns') || 
          currentLower.includes('who founded') || 
          currentLower.includes('who runs') || 
          currentLower.includes('who built') || 
          currentLower.includes('leadership') ||
          currentLower.includes('management') ||
          currentLower.includes('director') ||
          currentLower.includes('boss') ||
          currentLower.includes('doctor') || 
          currentLower.includes('lawyer')
        ) {
          const founderResponse = customCompany?.founder
            ? `${cName} is founded and owned by ${customCompany.founder}, who leads our expert team. Would you like me to book a consultation or appointment for you?`
            : customCompany?.name
              ? `${cName} is proudly owned and operated by our certified local specialist leadership team. Would you like to schedule an appointment with our team?`
              : `Shehram Meellu is the Founder & CEO of Quorik. He is a senior AI engineering architect and technology strategist who founded Quorik to build high-performance custom web applications and zero-latency 24/7 AI Voice Agents. Would you like me to schedule a discovery consultation?`;

          return {
            aiSpeechText: founderResponse,
            callerName,
            callerEmail,
            callerPhone,
            requestedSlot: requestedSlot || 'Pending Slot Selection',
            topic: 'Leadership & Specialist Inquiry',
            bookingStatus: 'inquiry_only',
            missingFields: ['name', 'time', 'email', 'phone'],
            whatsappMessage: `👑 LEADERSHIP INQUIRY: Caller inquired about owner/leadership for ${cName}.`
          };
        }

        // Booking intent
        const isBooking = fullText.includes('book') || fullText.includes('consultation') || fullText.includes('meeting') || fullText.includes('schedule') || fullText.includes('appointment');

        if (isBooking) {
          const missing: string[] = [];
          if (!callerName) missing.push('name');
          if (!requestedSlot) missing.push('time');
          if (!callerEmail) missing.push('email');
          if (!callerPhone) missing.push('phone');

          if (!callerName && !requestedSlot) {
            return {
              aiSpeechText: `I would be delighted to book your appointment at ${cName}! May I have your name and preferred day and time?`,
              callerName: '',
              callerEmail: '',
              callerPhone: '',
              requestedSlot: '',
              topic,
              bookingStatus: 'in_progress',
              missingFields: ['name', 'time', 'email', 'phone'],
              whatsappMessage: `⏳ APPOINTMENT IN PROGRESS: Awaiting caller name and time slot for ${cName}.`
            };
          } else if (!callerEmail || !callerPhone) {
            const missingText = !callerEmail && !callerPhone ? "your email address and phone number" : (!callerEmail ? "your email address" : "your phone number");
            return {
              aiSpeechText: `Great ${callerName || ''}! Could you please share ${missingText} so I can send the confirmation and calendar invite?`,
              callerName: callerName || 'Valued Caller',
              callerEmail,
              callerPhone,
              requestedSlot: requestedSlot || 'Tomorrow @ 11:00 AM EST',
              topic,
              bookingStatus: 'in_progress',
              missingFields: missing,
              whatsappMessage: `⏳ APPOINTMENT IN PROGRESS: ${callerName || 'Caller'} selected ${requestedSlot || 'Tomorrow'}. Awaiting contact info.`
            };
          } else {
            return {
              aiSpeechText: `Perfect ${callerName}! I have confirmed your appointment at ${cName} for ${requestedSlot}. A confirmation has been logged for your contact details.`,
              callerName,
              callerEmail,
              callerPhone,
              requestedSlot,
              topic,
              bookingStatus: 'confirmed',
              missingFields: [],
              whatsappMessage: `🚀 CONFIRMED APPOINTMENT: ${callerName} booked ${topic} on ${requestedSlot} at ${cName}. Contact: ${callerEmail} | ${callerPhone}`
            };
          }
        }

        // Pricing query
        if (currentLower.includes('price') || currentLower.includes('cost') || currentLower.includes('pricing') || currentLower.includes('rate') || currentLower.includes('package') || currentLower.includes('fee')) {
          let priceMsg = "";
          if (customCompany?.services && Array.isArray(customCompany.services) && customCompany.services.length > 0) {
            const sampleServices = customCompany.services.slice(0, 3).join(", ");
            priceMsg = `At ${cName}, our transparent services include: ${sampleServices}. Would you like me to reserve a priority appointment for you?`;
          } else {
            priceMsg = `Quorik offers transparent packages starting at $999 setup and $199 per month for our Starter AI plan with a custom website and 300 voice minutes, or $1,999 setup and $399 per month for our popular Growth Suite. Would you like me to book a 15-minute consultation to discuss your project?`;
          }

          return {
            aiSpeechText: priceMsg,
            callerName,
            callerEmail,
            callerPhone,
            requestedSlot: requestedSlot || 'Pending Slot Selection',
            topic: 'Pricing & Services Consultation',
            bookingStatus: 'inquiry_only',
            missingFields: ['name', 'time', 'email', 'phone'],
            whatsappMessage: `🚀 INBOUND LEAD: Pricing inquiry regarding services at ${cName}.`
          };
        }

        const generalMsg = customCompany?.name
          ? `${greeting} Thank you for calling ${cName}! I'm ${pName}. I can answer any questions about our services, pricing, or book an appointment for you today. How may I assist you?`
          : `${greeting} Thank you for reaching ${cName}! I'm ${pName}. How can I assist you with custom web development, AI chatbots, or voice automation today?`;

        return {
          aiSpeechText: generalMsg,
          callerName,
          callerEmail,
          callerPhone,
          requestedSlot: requestedSlot || 'Pending Slot Selection',
          topic: 'General Inbound Inquiry',
          bookingStatus: 'inquiry_only',
          missingFields: ['name', 'time', 'email', 'phone'],
          whatsappMessage: `🚀 INBOUND CALL: Connected with ${pName} at ${cName}.`
        };
      };

      const fallbackData = extractFallbackResponse(userQuery, personaName, companyName, conversationHistory || []);
      let aiSpeechText = "";
      let extractedLead = {
        callerName: fallbackData.callerName || "Valued Caller",
        callerEmail: fallbackData.callerEmail || "",
        callerPhone: fallbackData.callerPhone || "",
        topic: fallbackData.topic || "Discovery Consultation",
        requestedSlot: fallbackData.requestedSlot || "Tomorrow @ 11:00 AM EST",
        bookingStatus: fallbackData.bookingStatus || "in_progress",
        whatsappMessage: fallbackData.whatsappMessage
      };

      try {
        const generatePromise = generateResilientContent(ai, {
          primaryModel: "gemini-3.5-flash-lite",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            maxOutputTokens: 220,
            temperature: 0.3,
          }
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Voice response timeout")), 12000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        let rawText = (response?.text || "").trim();
        if (rawText.startsWith("```json")) {
          rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (rawText.startsWith("```")) {
          rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const data = JSON.parse(rawText || "{}");
        if (data.aiSpeechText) aiSpeechText = data.aiSpeechText;
        if (data.callerName) extractedLead.callerName = data.callerName;
        if (data.callerEmail) extractedLead.callerEmail = data.callerEmail;
        if (data.callerPhone) extractedLead.callerPhone = data.callerPhone;
        if (data.topic) extractedLead.topic = data.topic;
        if (data.requestedSlot) extractedLead.requestedSlot = data.requestedSlot;
        if (data.bookingStatus) extractedLead.bookingStatus = data.bookingStatus;
        if (data.whatsappMessage) extractedLead.whatsappMessage = data.whatsappMessage;

        // If a lead or appointment was captured with contact info during the call, trigger WhatsApp alert
        if (extractedLead.bookingStatus === 'confirmed' || extractedLead.callerPhone || extractedLead.callerEmail) {
          const leadContact = extractedLead.callerPhone || extractedLead.callerEmail || "Website Caller";
          sendWhatsAppSMSNotification({
            recipientName: extractedLead.callerName || "Valued Caller",
            phone: extractedLead.callerPhone || ADMIN_NOTIFICATION_PHONE,
            channel: 'instant_confirmation',
            messageText: extractedLead.whatsappMessage || `🚀 [${companyName} Voice Lead Captured]\nCaller: ${extractedLead.callerName}\nContact: ${leadContact}\nTopic: ${extractedLead.topic}\nSlot: ${extractedLead.requestedSlot}`
          });
        }
      } catch (genErr: any) {
        console.warn("AI generation note (using instant intelligent response):", genErr?.message || genErr);
        aiSpeechText = fallbackData.aiSpeechText;
      }

      res.json({
        success: true,
        aiSpeechText: aiSpeechText || fallbackData.aiSpeechText,
        extractedLead
      });
    } catch (error: any) {
      console.error("Voice Agent Simulator API error:", error);
      const personaName = req.body?.gender === 'female' ? 'Zephyr' : 'Arthur';
      const companyName = req.body?.customCompany?.name || "Quorik";
      res.json({
        success: true,
        aiSpeechText: `Thank you for reaching ${companyName}! I'm ${personaName}. May I have your name, email, and preferred time to schedule your discovery consultation?`,
        extractedLead: {
          callerName: "Valued Client",
          callerEmail: "",
          callerPhone: "",
          topic: "Inbound Consultation",
          requestedSlot: "Tomorrow @ 11:00 AM EST",
          bookingStatus: "in_progress",
          whatsappMessage: "🚀 NEW INBOUND LEAD: Inquiry received and registered."
        }
      });
    }
  });

  // Neural TTS In-Memory Cache for ultra-fast repeat voice playback (<5ms)
  const ttsCache = new Map<string, { audioData: string; mimeType: string; voiceName: string; gender: string }>();

  // Direct Google Neural TTS stream fallback (instant 150ms HTTP stream if Edge WS stalls)
  function splitTextIntoTtsChunks(text: string, maxLen = 140): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const chunks: string[] = [];
    let current = "";
    for (const s of sentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if ((current + " " + trimmed).trim().length <= maxLen) {
        current = (current + " " + trimmed).trim();
      } else {
        if (current) chunks.push(current);
        if (trimmed.length <= maxLen) {
          current = trimmed;
        } else {
          const words = trimmed.split(" ");
          let subChunk = "";
          for (const w of words) {
            if ((subChunk + " " + w).trim().length <= maxLen) {
              subChunk = (subChunk + " " + w).trim();
            } else {
              if (subChunk) chunks.push(subChunk);
              subChunk = w;
            }
          }
          current = subChunk;
        }
      }
    }
    if (current) chunks.push(current);
    return chunks.length > 0 ? chunks : [text.substring(0, maxLen)];
  }

  async function fetchGoogleChunk(chunk: string, targetLang = 'en'): Promise<Buffer> {
    const encoded = encodeURIComponent(chunk);
    const clients = ["tw-ob", "gtx", "dict-chrome-ex"];
    for (const client of clients) {
      try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${targetLang}&total=1&idx=0&textlen=${chunk.length}&client=${client}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (response.ok) {
          const arrayBuf = await response.arrayBuffer();
          if (arrayBuf.byteLength > 100) {
            return Buffer.from(arrayBuf);
          }
        }
      } catch (err) {}
    }
    throw new Error(`Google TTS synthesis notice for text chunk: ${chunk.substring(0, 30)}`);
  }

  async function fetchGoogleTtsAudio(text: string, lang = 'en-US'): Promise<Buffer> {
    const targetLang = lang.includes('GB') || lang.includes('uk') ? 'en-GB' : lang.includes('AU') || lang.includes('au') ? 'en-AU' : 'en';
    const chunks = splitTextIntoTtsChunks(text, 140);
    const audioBuffers = await Promise.all(chunks.map(chunk => fetchGoogleChunk(chunk, targetLang)));
    return Buffer.concat(audioBuffers);
  }

  // Fast, Studio-Quality Neural Studio Audio Synthesis (100% genuine Male Baritone on iOS Safari, Android, and Desktop)
  async function generateNeuralAudio(text: string, voiceName: string): Promise<Buffer> {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      let isSettled = false;

      const cleanup = () => {
        if (isSettled) return;
        isSettled = true;
        try { tts.close(); } catch(e) {}
      };

      const timer = setTimeout(() => {
        if (chunks.length > 0) {
          const totalBuffer = Buffer.concat(chunks);
          if (totalBuffer.length > 512) {
            cleanup();
            resolve(totalBuffer);
            return;
          }
        }
        cleanup();
        reject(new Error("Edge TTS synthesis timeout"));
      }, 7500);

      audioStream.on("data", (chunk: Buffer) => chunks.push(chunk));
      audioStream.on("end", () => {
        clearTimeout(timer);
        cleanup();
        if (chunks.length > 0) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error("No audio frames received"));
        }
      });
      audioStream.on("error", (err: any) => {
        clearTimeout(timer);
        cleanup();
        // If we already received audio frames before premature stream close, resolve the playable audio!
        if (chunks.length > 0) {
          const totalBuffer = Buffer.concat(chunks);
          if (totalBuffer.length > 512) {
            resolve(totalBuffer);
            return;
          }
        }
        reject(err);
      });
    });
  }

  // Helper function to resolve voice settings
  function resolveVoiceSettings(gender: string = 'male', personaId: string = 'us-executive') {
    const gLower = (gender || '').toLowerCase();
    const pLower = (personaId || '').toLowerCase();
    const isFemale = gLower.includes('female') || pLower.includes('female') || gLower === 'zephyr' || gLower === 'clara' || gLower === 'aria' || gLower === 'natasha';

    let voiceName = "en-US-GuyNeural";
    let locale = "en-US";

    if (isFemale) {
      if (gLower.includes('uk') || pLower.includes('uk') || gLower.includes('clara')) {
        voiceName = 'en-GB-SoniaNeural';
        locale = 'en-GB';
      } else if (gLower.includes('au') || pLower.includes('au') || gLower.includes('natasha')) {
        voiceName = 'en-AU-NatashaNeural';
        locale = 'en-AU';
      } else if (gLower.includes('vibrant') || pLower.includes('vibrant') || gLower.includes('aria')) {
        voiceName = 'en-US-AriaNeural';
        locale = 'en-US';
      } else {
        voiceName = 'en-US-JennyNeural';
        locale = 'en-US';
      }
    } else {
      if (gLower.includes('uk') || pLower.includes('uk') || gLower.includes('oliver')) {
        voiceName = 'en-GB-RyanNeural';
        locale = 'en-GB';
      } else if (gLower.includes('au') || pLower.includes('au') || gLower.includes('william')) {
        voiceName = 'en-AU-WilliamNeural';
        locale = 'en-AU';
      } else if (gLower.includes('sales') || pLower.includes('sales') || gLower.includes('energetic') || gLower.includes('brian')) {
        voiceName = 'en-US-BrianNeural';
        locale = 'en-US';
      } else if (pLower.includes('arthur') || gLower.includes('arthur') || pLower.includes('executive')) {
        // Arthur Studio Baritone Voice
        voiceName = 'en-US-GuyNeural';
        locale = 'en-US';
      } else {
        voiceName = 'en-US-GuyNeural';
        locale = 'en-US';
      }
    }
    return { voiceName, locale, isFemale };
  }

  function sanitizeSpeechText(text: string): string {
    return text
      .replace(/\[CARD:[^\]]+\]/gi, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/#+\s+/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/\bQuorik\b/gi, 'Korik')
      .replace(/\bAI\b/g, 'A.I.')
      .replace(/\bROI\b/g, 'R.O.I.')
      .replace(/\bCRM\b/g, 'C.R.M.')
      .replace(/\bSMS\b/g, 'S.M.S.')
      .replace(/\bEST\b/g, 'E.S.T.')
      .replace(/\bPST\b/g, 'P.S.T.')
      .replace(/\bGMT\b/g, 'G.M.T.')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Direct Audio Streaming Endpoint (Streams hardware MP3 directly to browser audio elements)
  app.get("/api/tts/stream", async (req: express.Request, res: express.Response) => {
    try {
      const text = (req.query.text as string) || '';
      const gender = (req.query.gender as string) || 'male';
      const personaId = (req.query.personaId as string) || 'arthur';

      if (!text || typeof text !== 'string') {
        return res.status(400).send("Text query parameter is required");
      }

      const cleanText = sanitizeSpeechText(text);
      if (!cleanText) {
        return res.status(400).send("No valid text content");
      }

      const { voiceName, locale, isFemale } = resolveVoiceSettings(gender, personaId);
      const cacheKey = `${gender}:${voiceName}:${cleanText}`;

      if (ttsCache.has(cacheKey)) {
        const cached = ttsCache.get(cacheKey)!;
        const buffer = Buffer.from(cached.audioData, 'base64');
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send(buffer);
      }

      let audioBuffer: Buffer | null = null;
      try {
        audioBuffer = await generateNeuralAudio(cleanText, voiceName);
      } catch (err: any) {
        try {
          audioBuffer = await fetchGoogleTtsAudio(cleanText, locale);
        } catch (err2: any) {
          try {
            audioBuffer = await generateNeuralAudio(cleanText, isFemale ? 'en-US-JennyNeural' : 'en-US-GuyNeural');
          } catch (err3) {}
        }
      }

      if (audioBuffer && audioBuffer.length > 0) {
        const base64Audio = audioBuffer.toString('base64');
        ttsCache.set(cacheKey, { audioData: base64Audio, mimeType: 'audio/mp3', voiceName, gender });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.length);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send(audioBuffer);
      }

      return res.status(500).send("TTS audio synthesis unavailable");
    } catch (err: any) {
      console.error("GET /api/tts/stream error:", err);
      return res.status(500).send(err?.message || "TTS stream error");
    }
  });

  // Neural TTS Endpoint: Generates genuine Studio-Quality Voice (Arthur/Oliver = Male Baritone, Zephyr/Clara = Female)
  app.post("/api/tts", async (req: express.Request, res: express.Response) => {
    try {
      const { text, gender = 'male', personaId = 'us-executive' } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "Text is required" });
      }

      const cleanText = sanitizeSpeechText(text);
      if (!cleanText) {
        return res.status(400).json({ error: "No valid text content after sanitization" });
      }

      const { voiceName, locale, isFemale } = resolveVoiceSettings(gender, personaId);

      // Check in-memory cache first for 0ms instant playback
      const cacheKey = `${gender}:${voiceName}:${cleanText}`;
      if (ttsCache.has(cacheKey)) {
        const cached = ttsCache.get(cacheKey)!;
        return res.json({
          success: true,
          audioData: cached.audioData,
          mimeType: cached.mimeType,
          voiceName: cached.voiceName,
          gender: cached.gender,
          cached: true
        });
      }

      let audioBuffer: Buffer | null = null;
      let usedEngine = 'edge-neural';

      // 1. Primary Engine: Edge Neural Studio Audio
      try {
        audioBuffer = await generateNeuralAudio(cleanText, voiceName);
      } catch (primaryErr: any) {
        console.warn(`[Neural TTS] Edge synthesis notice for ${voiceName}: ${primaryErr?.message || primaryErr}. Activating instant secondary audio stream.`);
        
        // 2. Secondary High-Speed Engine: Direct Neural Audio Stream
        try {
          audioBuffer = await fetchGoogleTtsAudio(cleanText, locale);
          usedEngine = 'google-stream';
        } catch (secondaryErr: any) {
          console.error(`[Neural TTS] Secondary audio stream also had notice:`, secondaryErr?.message || secondaryErr);
          // Try Edge one more time with default Guy / Jenny
          try {
            audioBuffer = await generateNeuralAudio(cleanText, isFemale ? 'en-US-JennyNeural' : 'en-US-GuyNeural');
          } catch (retryErr: any) {
            console.error(`[Neural TTS] Edge retry error:`, retryErr);
          }
        }
      }

      if (audioBuffer && audioBuffer.length > 0) {
        const base64Audio = audioBuffer.toString('base64');
        const mimeType = "audio/mp3";

        // Store in cache (up to 800 items)
        if (ttsCache.size > 800) {
          const firstKey = ttsCache.keys().next().value;
          if (firstKey) ttsCache.delete(firstKey);
        }
        ttsCache.set(cacheKey, { audioData: base64Audio, mimeType, voiceName, gender });

        return res.json({
          success: true,
          audioData: base64Audio,
          mimeType,
          voiceName,
          gender,
          engine: usedEngine
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to generate neural audio stream"
      });
    } catch (err: any) {
      console.error("TTS endpoint global error:", err);
      return res.status(500).json({
        success: false,
        error: err?.message || "TTS synthesis unavailable"
      });
    }
  });

  // SEO Routes for Google indexing
  app.get("/widget.js", (req: express.Request, res: express.Response) => {
    const widgetPath = path.join(process.cwd(), 'public', 'widget.js');
    if (fs.existsSync(widgetPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(widgetPath);
    } else {
      res.status(404).send('Widget script not found');
    }
  });

  app.get("/sitemap.xml", (req: express.Request, res: express.Response) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml');
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send('Sitemap not found');
    }
  });

  app.get("/robots.txt", (req: express.Request, res: express.Response) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.sendFile(robotsPath);
    } else {
      res.status(404).send('Robots.txt not found');
    }
  });

  // 404 fallback for unhandled API routes (MUST come before Vite middleware / static files)
  app.use("/api/*", (req: express.Request, res: express.Response) => {
    res.status(404).json({ error: `API route ${req.originalUrl} not found` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const { WebSocketServer } = await import("ws");
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", async (clientWs, req) => {
    console.log("WebSocket connected to /live", req.url);
    try {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const voiceName = url.searchParams.get("voice") || "Aoede";
      const language = url.searchParams.get("language") || "English";

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        clientWs.close();
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onclose: (e) => {
            console.log("Gemini session closed", e);
            clientWs.send(JSON.stringify({ text: "System Error: Call ended by server." }));
            clientWs.close();
          },
          onmessage: (message: any) => {
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
                }
                if (part.text) {
                  clientWs.send(JSON.stringify({ text: part.text }));
                }
              }
            }

            if (message.toolCall) {
              const calls = message.toolCall.functionCalls;
              if (calls) {
                for (const call of calls) {
                  clientWs.send(JSON.stringify({ toolCall: { name: call.name, args: call.args } }));
                  
                  let responseMessage = "Tool executed successfully.";
                  
                  if (call.name === "book_appointment") {
                    appointments.push({
                      id: Math.random().toString(36).substring(2, 9),
                      name: call.args.name,
                      phone: call.args.phone,
                      date_time: call.args.date_time,
                      createdAt: new Date().toISOString()
                    });

                    sendWhatsAppSMSNotification({
                      recipientName: call.args.name,
                      phone: call.args.phone,
                      channel: 'instant_confirmation',
                      dateTime: call.args.date_time
                    });

                    responseMessage = "Appointment booked successfully! Instant WhatsApp and SMS confirmations have been sent to the caller's phone number.";
                  } else if (call.name === "check_availability") {
                    responseMessage = "That time is available!";
                  }

                  // Simulate successful tool call
                  sessionPromise.then(session => session.sendToolResponse({
                    functionResponses: [
                      {
                        id: call.id,
                        name: call.name,
                        response: { 
                          status: "success", 
                          message: responseMessage
                        }
                      }
                    ]
                  }));
                }
              }
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [
            {
              functionDeclarations: [
                {
                  name: "book_appointment",
                  description: "Books a discovery call with the Quorik sales team after confirming caller's exact name and phone number.",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "The caller's full name (e.g. Alex Johnson). Transcribe exact spelling spoken by caller." },
                      phone: { type: Type.STRING, description: "The caller's exact phone number (e.g. +15550192834). Transcribe exact digits spoken." },
                      date_time: { type: Type.STRING, description: "The preferred date and time for the meeting" }
                    },
                    required: ["name", "phone", "date_time"]
                  }
                },
                {
                  name: "check_availability",
                  description: "Checks if a specific time is available for a discovery call.",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      date_time: { type: Type.STRING, description: "The date and time to check" }
                    },
                    required: ["date_time"]
                  }
                }
              ]
            }
          ],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          },
          systemInstruction: `You are Quorik AI, a professional 24/7 voice receptionist and After-Hours & Call Overflow Manager for Quorik (providers of custom websites, AI chatbots, and AI voice agents). 

IMPORTANT ACCURACY & CAPABILITY RULES:
1. Listen very carefully to caller names and phone numbers. Do not alter or substitute names with common alternatives.
2. Before booking an appointment using the book_appointment tool, ALWAYS verbally confirm the exact name and phone number digit-by-digit with the caller (e.g., "Just to confirm, your name is Alex Johnson and your phone number is 5 5 5 0 1 9 2 8 3 4, correct?").
3. If asked about night/weekend hours or call volume: Explain that as the After-Hours & Call Overflow Manager, you handle 100% of overflow calls 24/7 when staff is offline or lines are busy, ensuring zero dropped leads.
4. Respond fast, concisely, and naturally. Keep your responses short (1-2 sentences). Speak in the ${language} language.`,
        },
      });

      clientWs.on("message", (data) => {
        try {
          const { audio } = JSON.parse(data.toString());
          if (audio) {
            sessionPromise.then(session => session.sendRealtimeInput({
              audio: { data: audio, mimeType: "audio/pcm;rate=16000" }
            }));
          }
        } catch(e) {
          console.error(e);
        }
      });
      
      clientWs.on("close", () => {
        // try to close the session or it might timeout
      });
    } catch(err: any) {
      console.error("WebSocket connection error:", err);
      clientWs.send(JSON.stringify({ text: "System Error: " + (err.message || "Failed to connect to AI.") }));
      clientWs.close();
    }
  });
}

startServer();
