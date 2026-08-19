import { useState, useEffect } from 'react';
import { Calendar, Phone, Clock, User, ArrowLeft, RefreshCw, Mail, MessageSquare, Edit2, Trash2, Save, X, Download, FileText, Plus, Star, Send, CheckCircle2, Sparkles, Globe, Search, AlertTriangle, TrendingUp, CreditCard, Users, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatWhatsAppPhone } from '../utils/phone';
import { DemoBuilderPage } from './DemoBuilderPage';
import { ClientAccountsManager } from '../components/admin/ClientAccountsManager';
import { ClientAccount } from '../types/client';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  date_time: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  timeline: string;
  message: string;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  status: 'draft' | 'published';
  image?: string;
  createdAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
  rating: number;
  createdAt: string;
}

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

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'clients' | 'appointments' | 'contacts' | 'notifications' | 'audits' | 'blog' | 'testimonials' | 'demo-builder'>('clients');

  const [clients, setClients] = useState<ClientAccount[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AuditReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingContact, setEditingContact] = useState<ContactMessage | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Manual dispatch state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualMessage, setManualMessage] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState('');

  const sendReminder = async (appointmentId: string) => {
    try {
      const res = await fetch(`/api/notifications/remind/${appointmentId}`, { method: 'POST' });
      if (res.ok) {
        setDispatchStatus('1-Hour Reminder Sent via WhatsApp & SMS!');
        setTimeout(() => setDispatchStatus(''), 4000);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPhone || !manualMessage) return;
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: manualName || 'Client',
          phone: manualPhone,
          messageText: manualMessage,
          channel: 'manual'
        })
      });
      if (res.ok) {
        setDispatchStatus('Custom WhatsApp & SMS message dispatched!');
        setManualMessage('');
        setTimeout(() => setDispatchStatus(''), 4000);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      if (res.ok) {
        setAppointments(appointments.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact lead?')) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      if (res.ok) {
        setContacts(contacts.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveAppointment = async () => {
    if (!editingAppointment) return;
    try {
      const res = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify(editingAppointment)
      });
      if (res.ok) {
        const updated = await res.json();
        setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
        setEditingAppointment(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveContact = async () => {
    if (!editingContact) return;
    try {
      const res = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify(editingContact)
      });
      if (res.ok) {
        const updated = await res.json();
        setContacts(contacts.map(c => c.id === updated.id ? updated : c));
        setEditingContact(null);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
      if (res.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveTestimonial = async () => {
    if (!editingTestimonial) return;
    try {
      const isNew = !editingTestimonial.id;
      const url = isNew ? '/api/testimonials' : `/api/testimonials/${editingTestimonial.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify(editingTestimonial)
      });

      if (res.ok) {
        const updated = await res.json();
        if (isNew) {
          setTestimonials([updated, ...testimonials]);
        } else {
          setTestimonials(testimonials.map(t => t.id === updated.id ? updated : t));
        }
        setEditingTestimonial(null);
        setIsCreatingTestimonial(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const savePost = async () => {
    if (!editingPost) return;
    try {
      const isNew = !editingPost.id;
      const url = isNew ? '/api/posts' : `/api/posts/${editingPost.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify(editingPost)
      });
      
      if (res.ok) {
        const updated = await res.json();
        if (isNew) {
          setPosts([updated, ...posts]);
        } else {
          setPosts(posts.map(p => p.id === updated.id ? updated : p));
        }
        setEditingPost(null);
        setIsCreatingPost(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    if (activeTab === 'clients') {
      doc.text("Client Accounts & Voice Usage Report", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Business', 'Owner', 'Tier', 'Minutes Used / Limit', 'Status', 'Leads Captured']],
        body: clients.map(c => [
          c.businessName, 
          c.clientName, 
          c.tier.toUpperCase(), 
          `${Math.round(c.voiceMinutesUsed)} / ${c.monthlyVoiceMinutesLimit} mins`, 
          c.status.toUpperCase(), 
          c.leadsCaptured
        ])
      });
      doc.save("client-voice-usage.pdf");
    } else if (activeTab === 'appointments') {
      doc.text("Appointments Report", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Name', 'Phone', 'Requested Time', 'Booked On']],
        body: appointments.map(a => [a.name, a.phone, a.date_time, new Date(a.createdAt).toLocaleString()])
      });
      doc.save("appointments.pdf");
    } else if (activeTab === 'contacts') {
      doc.text("Contact Form Leads Report", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Name', 'Email', 'Project Type', 'Timeline', 'Submitted On']],
        body: contacts.map(c => [c.name, c.email, c.projectType, c.timeline, new Date(c.createdAt).toLocaleString()])
      });
      doc.save("contact-leads.pdf");
    } else if (activeTab === 'notifications') {
      doc.text("WhatsApp & SMS Automation Log", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Recipient', 'Phone', 'Type', 'Channel', 'Status', 'Sent At']],
        body: notifications.map(n => [n.recipientName, n.phone, n.type, n.channel, n.status, new Date(n.createdAt).toLocaleString()])
      });
      doc.save("whatsapp-sms-logs.pdf");
    } else if (activeTab === 'audits') {
      doc.text("AI Website & Automation Audits", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Business', 'Website', 'Contact', 'Score', 'Est Growth', 'Date']],
        body: audits.map(a => [a.businessName, a.websiteUrl, `${a.contactName} (${a.email})`, `${a.score}/100`, a.estimatedMonthlyRevenueGrowth, new Date(a.createdAt).toLocaleString()])
      });
      doc.save("ai-audits.pdf");
    } else {
      doc.text("Blog Posts Report", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Title', 'Status', 'Date', 'Author']],
        body: posts.map(p => [p.title, p.status, p.date, p.author])
      });
      doc.save("blog-posts.pdf");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('Incorrect password');
      }
    } catch (err) {
      setAuthError('Login failed');
    }
  };

  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchData = async (silent: boolean = false) => {
    if (!isAuthenticated) return;
    if (!silent) setLoading(true);
    setIsSyncing(true);
    setError(null);
    try {
      const [appRes, contRes, postRes, testRes, notifRes, auditRes, clientRes] = await Promise.all([
        fetch('/api/appointments', { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }),
        fetch('/api/contacts', { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }),
        fetch('/api/posts'),
        fetch('/api/testimonials'),
        fetch('/api/notifications', { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }),
        fetch('/api/audits', { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }),
        fetch('/api/clients', { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } })
      ]);
      
      const isJson = (res: Response) => res.ok && res.headers.get('content-type')?.includes('application/json');

      const appData = isJson(appRes) ? await appRes.json() : [];
      const contData = isJson(contRes) ? await contRes.json() : [];
      const postData = isJson(postRes) ? await postRes.json() : [];
      const testData = isJson(testRes) ? await testRes.json() : [];
      const notifData = isJson(notifRes) ? await notifRes.json() : [];
      const auditData = isJson(auditRes) ? await auditRes.json() : [];
      const clientData = isJson(clientRes) ? await clientRes.json() : [];
      
      setAppointments(Array.isArray(appData) ? [...appData].reverse() : []);
      setContacts(Array.isArray(contData) ? [...contData].reverse() : []);
      setPosts(Array.isArray(postData) ? [...postData].reverse() : []);
      setTestimonials(Array.isArray(testData) ? [...testData].reverse() : []);
      setNotifications(Array.isArray(notifData) ? [...notifData].reverse() : []);
      setAudits(Array.isArray(auditData) ? [...auditData].reverse() : []);
      setClients(Array.isArray(clientData) ? clientData : []);
      setLastSyncTime(new Date());
    } catch (err: any) {
      if (!silent) {
        setError(err.message || 'An error occurred while fetching data.');
      }
    } finally {
      if (!silent) setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(false);
      // Auto-poll every 3.5s so interactions from client sites (e.g. quoriksystem.online) update instantly
      const interval = setInterval(() => {
        fetchData(true);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090F] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />
        <div className="max-w-md w-full bg-[#05060A]/80 backdrop-blur-md border border-white/10 p-8 shadow-2xl relative z-10">
          <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] text-white/50 font-mono tracking-widest uppercase block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal"
                placeholder="Enter password"
              />
            </div>
            {authError && <p className="text-red-400 text-sm font-sans">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-brand-teal hover:bg-brand-teal/90 text-[#07090F] font-bold uppercase tracking-widest text-sm transition-colors"
            >
              Enter Dashboard
            </button>
          </form>
          <div className="mt-6 text-center">
             <Link to="/" className="text-brand-teal/60 hover:text-brand-teal text-xs font-mono uppercase tracking-widest">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090F] pt-32 pb-20 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none opacity-50 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-teal/10 blur-[120px] rounded-full pointer-events-none opacity-30 -translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="text-brand-teal/60 hover:text-brand-teal text-xs font-mono uppercase tracking-widest flex items-center gap-2 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Admin <span className="text-brand-teal">Dashboard</span></h2>
            <p className="text-gray-400 font-sans text-lg">Manage leads and appointments booked by Quorik AI.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Sync Active (3.5s)</span>
            </div>
            <button onClick={exportToPDF} className="flex items-center gap-2 px-5 py-3 bg-brand-teal text-[#07090F] font-bold text-xs uppercase tracking-widest transition-colors hover:bg-brand-teal/90">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button 
              onClick={() => fetchData(false)} 
              className="flex items-center gap-2 px-5 py-3 bg-white/5 text-white border border-white/10 hover:bg-white/10 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-brand-teal ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('adminToken');
                setIsAuthenticated(false);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {dispatchStatus && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-none font-mono text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>{dispatchStatus}</span>
          </div>
        )}

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'clients' ? 'bg-brand-teal text-[#07090F] font-bold shadow-lg shadow-brand-teal/20' : 'bg-white/5 text-white hover:bg-white/10 border border-brand-teal/30'
            }`}
          >
            <Users className="w-4 h-4 text-brand-teal" />
            Client Accounts & Voice Usage ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'appointments' ? 'bg-brand-teal text-[#07090F] font-bold' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'contacts' ? 'bg-brand-teal text-[#07090F] font-bold' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Contact Form Leads ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'notifications' ? 'bg-brand-teal text-[#07090F] font-bold' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Send className="w-4 h-4" />
            WhatsApp & SMS ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audits' ? 'bg-brand-teal text-[#07090F] font-bold' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Audits ({audits.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'blog' ? 'bg-brand-teal text-[#07090F] font-bold' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            Blog CMS ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'testimonials' ? 'bg-brand-teal text-[#07090F] font-bold' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Star className="w-4 h-4" />
            Testimonials ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab('demo-builder')}
            className={`px-6 py-3 font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'demo-builder' ? 'bg-brand-teal text-[#07090F] font-bold' : 'bg-white/5 text-white hover:bg-white/10 border border-brand-teal/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-teal" />
            Demo Builder (Admin)
          </button>
        </div>

        <div className="bg-[#05060A]/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl p-6">
          {loading && appointments.length === 0 && contacts.length === 0 && posts.length === 0 && testimonials.length === 0 && clients.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-sans">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-teal" />
              Loading data...
            </div>
          ) : activeTab === 'clients' ? (
            <ClientAccountsManager clients={clients} onRefresh={fetchData} />
          ) : activeTab === 'appointments' ? (
            appointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">No Appointments Yet</h3>
                <p className="text-gray-400 font-sans">Wait for users to book discovery calls through the voice agent.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/4">Client Name</th>
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/4">Phone</th>
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/4">Date & Time</th>
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6 align-top">
                          {editingAppointment?.id === appt.id ? (
                            <input 
                              type="text" 
                              value={editingAppointment.name}
                              onChange={e => setEditingAppointment({...editingAppointment, name: e.target.value})}
                              className="w-full bg-[#05060A] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-brand-teal"
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold shrink-0">
                                {appt.name.charAt(0)}
                              </div>
                              <span className="font-bold text-white">{appt.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-6 align-top">
                          {editingAppointment?.id === appt.id ? (
                            <input 
                              type="text" 
                              value={editingAppointment.phone}
                              onChange={e => setEditingAppointment({...editingAppointment, phone: e.target.value})}
                              className="w-full bg-[#05060A] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-brand-teal"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Phone className="w-4 h-4 text-white/30" />
                              {appt.phone}
                            </div>
                          )}
                        </td>
                        <td className="p-6 align-top">
                          {editingAppointment?.id === appt.id ? (
                            <input 
                              type="text" 
                              value={editingAppointment.date_time}
                              onChange={e => setEditingAppointment({...editingAppointment, date_time: e.target.value})}
                              className="w-full bg-[#05060A] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-brand-teal"
                            />
                          ) : (
                            <div className="flex flex-col gap-1 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-white/30" />
                                {appt.date_time}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-6 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            {editingAppointment?.id === appt.id ? (
                              <>
                                <button onClick={saveAppointment} className="p-2 bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-[#07090F] transition-colors rounded">
                                  <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingAppointment(null)} className="p-2 bg-white/10 text-gray-400 hover:text-white transition-colors rounded">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => sendReminder(appt.id)}
                                  title="Send 1-Hour Reminder via WhatsApp & SMS"
                                  className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                                >
                                  <Send className="w-3.5 h-3.5" /> 1h Remind
                                </button>
                                <a 
                                  href={`https://wa.me/${formatWhatsAppPhone(appt.phone)}?text=${encodeURIComponent(`Hi ${appt.name}, confirming your Quorik AI Discovery Call scheduled for ${appt.date_time}. Let us know if you need to reschedule!`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open WhatsApp Chat"
                                  className="px-3 py-1.5 bg-brand-teal/10 text-brand-teal border border-brand-teal/20 hover:bg-brand-teal/20 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                                >
                                  💬 WhatsApp
                                </a>
                                <button onClick={() => setEditingAppointment(appt)} className="p-2 bg-white/5 text-gray-400 hover:text-brand-teal hover:bg-white/10 transition-colors rounded">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteAppointment(appt.id)} className="p-2 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'contacts' ? (
            contacts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">No Contact Forms Yet</h3>
                <p className="text-gray-400 font-sans">Wait for users to submit requests via the contact page.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/5">Client Name</th>
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/5">Contact Info</th>
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-[25%]">Project Details</th>
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-[15%]">Submitted On</th>
                      <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold shrink-0">
                              {contact.name.charAt(0)}
                            </div>
                            <span className="font-bold text-white">{contact.name}</span>
                          </div>
                        </td>
                        <td className="p-6 align-top">
                          <div className="flex flex-col gap-2 text-sm">
                            <a href={`mailto:${contact.email}`} className="text-brand-teal hover:underline flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" />
                              {contact.email}
                            </a>
                          </div>
                        </td>
                        <td className="p-6 align-top">
                          <div className="flex flex-col gap-2 text-sm">
                            <div><span className="text-gray-500 uppercase font-mono text-[10px] tracking-widest mr-2">Type</span><span className="text-white">{contact.projectType}</span></div>
                            <div><span className="text-gray-500 uppercase font-mono text-[10px] tracking-widest mr-2">Time</span><span className="text-white">{contact.timeline}</span></div>
                            <div className="mt-2 text-gray-400 bg-white/5 p-3 rounded text-xs whitespace-pre-wrap">{contact.message}</div>
                          </div>
                        </td>
                        <td className="p-6 align-top">
                          <div className="flex flex-col gap-1 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-white/30" />
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-white/30 text-xs ml-5">
                              {new Date(contact.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-6 align-top text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => deleteContact(contact.id)} className="p-2 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'notifications' ? (
            <div className="p-6 space-y-8">
              {/* Dispatch Form */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
                  <Send className="w-5 h-5 text-brand-teal" />
                  Dispatch Custom WhatsApp & SMS Message
                </h3>
                <p className="text-gray-400 text-sm mb-6">Send an instant follow-up, reminder, or custom text directly to any phone number.</p>
                <form onSubmit={handleManualDispatch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={manualName}
                        onChange={e => setManualName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full bg-[#05060A] border border-white/10 text-white p-3 text-sm focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Phone Number (with Country Code)</label>
                      <input
                        type="text"
                        value={manualPhone}
                        onChange={e => setManualPhone(e.target.value)}
                        placeholder="e.g. +15550192834 or +923700146156"
                        className="w-full bg-[#05060A] border border-white/10 text-white p-3 text-sm focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Message Text</label>
                    <textarea
                      value={manualMessage}
                      onChange={e => setManualMessage(e.target.value)}
                      rows={3}
                      placeholder="Type your WhatsApp & SMS confirmation or reminder here..."
                      className="w-full bg-[#05060A] border border-white/10 text-white p-3 text-sm focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-teal text-[#07090F] font-bold text-sm uppercase tracking-widest hover:bg-brand-teal/90 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Dispatch WhatsApp & SMS
                  </button>
                </form>
              </div>

              {/* Logs Table */}
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-4">Automation Log</h3>
                {notifications.length === 0 ? (
                  <div className="p-12 text-center bg-white/5 border border-white/10">
                    <Send className="w-8 h-8 text-white/30 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No notifications logged yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-white/10">
                    <table className="w-full text-left font-sans">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Recipient</th>
                          <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Phone</th>
                          <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Channel / Type</th>
                          <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Message Body</th>
                          <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Status</th>
                          <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Sent At</th>
                          <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {notifications.map((n) => (
                          <tr key={n.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white text-sm">{n.recipientName}</td>
                            <td className="p-4 text-gray-300 text-sm font-mono">{n.phone}</td>
                            <td className="p-4">
                              <span className="inline-block px-2 py-0.5 bg-brand-teal/10 text-brand-teal font-mono text-[11px] uppercase tracking-wider border border-brand-teal/20">
                                {n.type} • {n.channel}
                              </span>
                            </td>
                            <td className="p-4 text-gray-300 text-xs max-w-xs truncate">{n.message}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 text-green-400 text-xs font-mono">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {n.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 text-xs font-mono">
                              {new Date(n.createdAt).toLocaleString()}
                            </td>
                            <td className="p-4 text-right">
                              <a
                                href={`https://wa.me/${formatWhatsAppPhone(n.phone)}?text=${encodeURIComponent(n.message)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-brand-teal/10 text-brand-teal border border-brand-teal/20 text-xs font-mono hover:bg-brand-teal/20"
                              >
                                💬 Open WhatsApp
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'audits' ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-display font-bold text-white mb-1">Interactive AI Website & Automation Audits</h3>
                <p className="text-gray-400 text-sm">Leads generated via the 3-Step AI Auditor lead magnet.</p>
              </div>

              {audits.length === 0 ? (
                <div className="p-12 text-center bg-white/5 border border-white/10">
                  <Sparkles className="w-8 h-8 text-white/30 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No website audits submitted yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {audits.map((audit) => (
                    <div key={audit.id} className="bg-white/5 border border-white/10 p-6 flex flex-col justify-between hover:border-brand-teal/50 transition-colors">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-white">{audit.businessName}</h4>
                            <a href={audit.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-teal text-xs font-mono flex items-center gap-1 hover:underline">
                              <Globe className="w-3 h-3" /> {audit.websiteUrl}
                            </a>
                          </div>
                          <div className="px-3 py-1 bg-brand-teal/20 border border-brand-teal text-brand-teal font-mono font-bold text-sm">
                            {audit.score}/100
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-gray-300 font-sans mb-4 border-t border-b border-white/5 py-3">
                          <div><span className="text-gray-500 font-mono">Contact:</span> <span className="text-white font-medium">{audit.contactName}</span></div>
                          <div><span className="text-gray-500 font-mono">Email:</span> <a href={`mailto:${audit.email}`} className="text-brand-teal hover:underline">{audit.email}</a></div>
                          <div><span className="text-gray-500 font-mono">Phone:</span> <span className="text-white font-mono">{audit.phone}</span></div>
                          <div><span className="text-gray-500 font-mono">Est Growth:</span> <span className="text-green-400 font-bold">{audit.estimatedMonthlyRevenueGrowth}</span></div>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-3 mb-4">{audit.summary}</p>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => setSelectedAudit(audit)}
                          className="flex-1 py-2 bg-brand-teal text-[#07090F] font-bold text-xs uppercase tracking-wider hover:bg-brand-teal/90 transition-colors text-center"
                        >
                          Inspect Audit Report
                        </button>
                        <a
                          href={`https://wa.me/${formatWhatsAppPhone(audit.phone)}?text=${encodeURIComponent(`Hi ${audit.contactName}, this is Quorik AI regarding your AI Website Audit for ${audit.businessName}. Your automation score was ${audit.score}/100! Would you like to review the growth plan?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-mono hover:bg-green-500/20"
                          title="Contact via WhatsApp"
                        >
                          💬
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Audit Modal */}
              {selectedAudit && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                  <div className="bg-[#05060A] border border-brand-teal/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative my-auto text-left rounded-xl">
                    <button
                      onClick={() => setSelectedAudit(null)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/10 pb-4 gap-4">
                      <div>
                        <span className="text-xs font-mono text-brand-teal uppercase tracking-widest block">AI Business Audit Report</span>
                        <h3 className="text-2xl font-bold text-white">{selectedAudit.businessName}</h3>
                        <a href={selectedAudit.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:underline flex items-center gap-1 mt-1">
                          <Globe className="w-3.5 h-3.5 text-brand-teal" /> {selectedAudit.websiteUrl}
                        </a>
                      </div>
                      <div className="text-center px-4 py-2 bg-brand-teal/10 border border-brand-teal shrink-0">
                        <span className="text-[10px] font-mono uppercase text-gray-400 block">Automation Score</span>
                        <span className="text-3xl font-bold text-brand-teal font-mono">{selectedAudit.score}/100</span>
                      </div>
                    </div>

                    <div className="space-y-6 text-sm text-gray-300">
                      
                      {/* Contact & Meta */}
                      <div className="bg-white/5 border border-white/10 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div><span className="text-gray-500 font-mono block">Contact Name:</span> <span className="text-white font-semibold">{selectedAudit.contactName}</span></div>
                        <div><span className="text-gray-500 font-mono block">Email Address:</span> <a href={`mailto:${selectedAudit.email}`} className="text-brand-teal hover:underline">{selectedAudit.email}</a></div>
                        <div><span className="text-gray-500 font-mono block">Phone (WhatsApp):</span> <span className="text-white font-mono">{selectedAudit.phone}</span></div>
                      </div>

                      {/* Executive Summary */}
                      <div>
                        <h4 className="text-xs font-mono uppercase text-brand-teal tracking-widest mb-1 flex items-center gap-1.5">
                          <Search className="w-4 h-4" /> Executive AI Analysis
                        </h4>
                        <p className="text-gray-200 bg-white/5 p-4 border border-white/10 leading-relaxed rounded-lg">{selectedAudit.summary}</p>
                      </div>

                      {/* ROI Summary Boxes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-brand-teal/10 border border-brand-teal/30 p-4 rounded-lg">
                          <span className="text-[10px] font-mono text-brand-teal uppercase block">Est. Monthly Growth</span>
                          <span className="text-2xl font-bold text-white">{selectedAudit.estimatedMonthlyRevenueGrowth}</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                          <span className="text-[10px] font-mono text-gray-400 uppercase block">Weekly Hours Saved</span>
                          <span className="text-2xl font-bold text-white">{selectedAudit.hoursSavedPerWeek} hrs/week</span>
                        </div>
                      </div>

                      {/* Opportunities */}
                      {selectedAudit.opportunities && selectedAudit.opportunities.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono uppercase text-brand-teal tracking-widest mb-3 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" /> Key Automation Opportunities
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {selectedAudit.opportunities.map((opp, idx) => (
                              <div key={idx} className="bg-white/5 p-4 border border-white/10 rounded-lg flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-mono px-2 py-0.5 bg-brand-teal/20 text-brand-teal font-bold">{opp.impact}</span>
                                    <span className="text-[11px] text-green-400 font-mono">{opp.estimatedSavings}</span>
                                  </div>
                                  <h5 className="font-bold text-white text-sm mb-1">{opp.title}</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed">{opp.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottlenecks */}
                      {selectedAudit.bottlenecks && selectedAudit.bottlenecks.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono uppercase text-amber-400 tracking-widest mb-3 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" /> Conversion Bottlenecks & Solutions
                          </h4>
                          <div className="space-y-2">
                            {selectedAudit.bottlenecks.map((b, idx) => (
                              <div key={idx} className="bg-white/5 p-3 border border-white/10 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                                <div>
                                  <span className="text-white font-semibold">{b.issue}</span>
                                  <span className="text-gray-500 ml-2 font-mono">({b.severity} Severity)</span>
                                </div>
                                <span className="px-2.5 py-1 bg-brand-teal/10 text-brand-teal border border-brand-teal/20 font-mono font-bold shrink-0">Fix: {b.fix}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Plan */}
                      {selectedAudit.actionPlan && selectedAudit.actionPlan.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono uppercase text-brand-teal tracking-widest mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-brand-teal" /> Recommended Action Roadmap
                          </h4>
                          <ul className="space-y-1.5 bg-white/5 p-4 border border-white/10 rounded-lg text-xs text-gray-300">
                            {selectedAudit.actionPlan.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-brand-teal font-bold font-mono">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Footer */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs text-gray-400 font-mono">Recipient Phone: {selectedAudit.phone}</span>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <a
                            href={`https://wa.me/${formatWhatsAppPhone(selectedAudit.phone)}?text=${encodeURIComponent(`Hi ${selectedAudit.contactName}, this is Quorik AI following up on your AI Website Audit for ${selectedAudit.businessName}. Your automation readiness score was ${selectedAudit.score}/100. Would you like to review your ROI growth roadmap?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none px-5 py-3 bg-green-500 hover:bg-green-400 text-black font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-lg"
                          >
                            💬 Contact Lead on WhatsApp
                          </a>
                          <button
                            onClick={() => setSelectedAudit(null)}
                            className="px-5 py-3 bg-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-colors rounded-lg"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'demo-builder' ? (
            <div>
              <DemoBuilderPage embedded={true} />
            </div>
          ) : activeTab === 'testimonials' ? (
            <div>
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-display font-bold text-white">Testimonials</h3>
                <button
                  onClick={() => {
                    setIsCreatingTestimonial(true);
                    setEditingTestimonial({
                      id: '',
                      name: '',
                      company: '',
                      text: '',
                      rating: 5,
                    } as Testimonial);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-[#07090F] font-bold text-sm uppercase tracking-widest transition-colors hover:bg-brand-teal/90"
                >
                  <Plus className="w-4 h-4" /> Add Review
                </button>
              </div>
              
              {isCreatingTestimonial || (editingTestimonial && editingTestimonial.id) ? (
                <div className="p-6 bg-white/5 border-b border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">
                    {isCreatingTestimonial ? 'Add New Testimonial' : 'Edit Testimonial'}
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Client Name</label>
                        <input
                          type="text"
                          value={editingTestimonial?.name || ''}
                          onChange={(e) => setEditingTestimonial(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="w-full bg-[#05060A] border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Company / Role</label>
                        <input
                          type="text"
                          value={editingTestimonial?.company || ''}
                          onChange={(e) => setEditingTestimonial(prev => prev ? {...prev, company: e.target.value} : null)}
                          className="w-full bg-[#05060A] border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Review Text</label>
                      <textarea
                        value={editingTestimonial?.text || ''}
                        onChange={(e) => setEditingTestimonial(prev => prev ? {...prev, text: e.target.value} : null)}
                        className="w-full bg-[#05060A] border border-white/10 text-white p-3 h-32 focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1" max="5"
                        value={editingTestimonial?.rating || 5}
                        onChange={(e) => setEditingTestimonial(prev => prev ? {...prev, rating: parseInt(e.target.value)} : null)}
                        className="w-full bg-[#05060A] border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveTestimonial} className="px-6 py-3 bg-brand-teal text-[#07090F] font-bold text-sm uppercase tracking-widest hover:bg-brand-teal/90 transition-colors">
                        Save Review
                      </button>
                      <button 
                        onClick={() => { setEditingTestimonial(null); setIsCreatingTestimonial(false); }} 
                        className="px-6 py-3 bg-white/5 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {testimonials.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">No Testimonials</h3>
                  <p className="text-gray-400 font-sans">Add reviews from your clients to show on the homepage.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="p-6 hover:bg-white/5 transition-colors group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{testimonial.name} <span className="text-brand-teal text-sm ml-2">{testimonial.company}</span></h4>
                          <div className="flex gap-1 my-2">
                            {Array.from({length: testimonial.rating || 5}).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-brand-teal text-brand-teal" />
                            ))}
                          </div>
                          <p className="text-gray-400 text-sm mt-2">{testimonial.text}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => setEditingTestimonial(testimonial)} className="p-2 bg-white/5 text-gray-400 hover:text-brand-teal hover:bg-white/10 transition-colors rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteTestimonial(testimonial.id)} className="p-2 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-display font-bold text-white">Blog Posts</h3>
                <button
                  onClick={() => {
                    setIsCreatingPost(true);
                    setEditingPost({
                      id: '',
                      title: '',
                      slug: '',
                      content: '',
                      excerpt: '',
                      date: new Date().toISOString().split('T')[0],
                      author: 'Quorik Team',
                      status: 'draft',
                      createdAt: new Date().toISOString()
                    } as BlogPost);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-[#07090F] font-bold text-sm uppercase tracking-widest transition-colors hover:bg-brand-teal/90"
                >
                  <Plus className="w-4 h-4" /> New Post
                </button>
              </div>
              
              {isCreatingPost || (editingPost && editingPost.id) ? (
                <div className="p-6 bg-white/5 border-b border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">
                    {isCreatingPost ? 'Create New Post' : 'Edit Post'}
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={editingPost?.title || ''}
                          onChange={(e) => {
                            const title = e.target.value;
                            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                            setEditingPost(prev => prev ? {...prev, title, slug} : null)
                          }}
                          className="w-full bg-[#05060A] border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Slug (URL)</label>
                        <input
                          type="text"
                          value={editingPost?.slug || ''}
                          onChange={(e) => setEditingPost(prev => prev ? {...prev, slug: e.target.value} : null)}
                          className="w-full bg-[#05060A] border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Excerpt</label>
                      <textarea
                        value={editingPost?.excerpt || ''}
                        onChange={(e) => setEditingPost(prev => prev ? {...prev, excerpt: e.target.value} : null)}
                        className="w-full bg-[#05060A] border border-white/10 text-white p-3 h-20 focus:outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Content (Markdown supported)</label>
                      <textarea
                        value={editingPost?.content || ''}
                        onChange={(e) => setEditingPost(prev => prev ? {...prev, content: e.target.value} : null)}
                        className="w-full bg-[#05060A] border border-white/10 text-white p-3 h-64 focus:outline-none focus:border-brand-teal font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Status</label>
                        <select
                          value={editingPost?.status || 'draft'}
                          onChange={(e) => setEditingPost(prev => prev ? {...prev, status: e.target.value as 'draft' | 'published'} : null)}
                          className="w-full bg-[#05060A] border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Date</label>
                        <input
                          type="date"
                          value={editingPost?.date || ''}
                          onChange={(e) => setEditingPost(prev => prev ? {...prev, date: e.target.value} : null)}
                          className="w-full bg-[#05060A] border border-white/10 text-white p-3 focus:outline-none focus:border-brand-teal [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={savePost} className="px-6 py-3 bg-brand-teal text-[#07090F] font-bold text-sm uppercase tracking-widest hover:bg-brand-teal/90 transition-colors">
                        Save Post
                      </button>
                      <button 
                        onClick={() => { setEditingPost(null); setIsCreatingPost(false); }} 
                        className="px-6 py-3 bg-white/5 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {posts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">No Blog Posts</h3>
                  <p className="text-gray-400 font-sans">Create your first blog post to start sharing updates.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-2/5">Title</th>
                        <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/5">Status</th>
                        <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/5">Date</th>
                        <th className="p-6 text-[10px] font-mono tracking-widest uppercase text-white/50 w-1/5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-6 align-top">
                            <span className="font-bold text-white text-lg block mb-1">{post.title}</span>
                            <span className="text-gray-500 font-mono text-xs">/{post.slug}</span>
                          </td>
                          <td className="p-6 align-top">
                            <span className={`inline-flex px-2 py-1 text-xs font-mono uppercase tracking-widest ${post.status === 'published' ? 'bg-brand-teal/10 text-brand-teal' : 'bg-white/10 text-gray-400'}`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="p-6 align-top">
                            <span className="text-gray-400 text-sm">
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-6 align-top text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingPost(post)} className="p-2 bg-white/5 text-gray-400 hover:text-brand-teal hover:bg-white/10 transition-colors rounded">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deletePost(post.id)} className="p-2 bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
