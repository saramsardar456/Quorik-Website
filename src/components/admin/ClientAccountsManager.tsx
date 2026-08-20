import React, { useState } from 'react';
import { 
  Users, 
  Mic, 
  Search, 
  Plus, 
  Clock, 
  Globe, 
  Phone, 
  Mail, 
  Zap, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  X, 
  Save, 
  Bot,
  Layers,
  ArrowUpRight,
  Code,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { ClientAccount, VoiceConversation } from '../../types/client';
import { formatWhatsAppPhone } from '../../utils/phone';

interface ClientAccountsManagerProps {
  clients: ClientAccount[];
  onRefresh: () => void;
}

export function ClientAccountsManager({ clients, onRefresh }: ClientAccountsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [addModalError, setAddModalError] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<ClientAccount | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedClientForHistory, setSelectedClientForHistory] = useState<ClientAccount | null>(null);
  const [simulatingClientId, setSimulatingClientId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [embedModalClient, setEmbedModalClient] = useState<ClientAccount | null>(null);
  const [embedTab, setEmbedTab] = useState<'react' | 'html'>('react');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // New Client Form State
  const [newClient, setNewClient] = useState({
    id: '',
    clientName: '',
    businessName: '',
    industry: 'Google Ads & Performance Marketing',
    email: '',
    phone: '',
    websiteUrl: '',
    tier: 'starter' as 'starter' | 'growth' | 'enterprise',
    voiceAgentName: 'Arthur (Executive Concierge)',
    voiceLanguage: 'English & Urdu'
  });

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Calculations for agency stats
  const activeSelectedClient = selectedClientForHistory 
    ? clients.find(c => c.id === selectedClientForHistory.id) || selectedClientForHistory
    : null;

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalMinutesUsed = clients.reduce((acc, c) => acc + c.voiceMinutesUsed, 0);
  const totalMinutesCap = clients.reduce((acc, c) => acc + c.monthlyVoiceMinutesLimit, 0);
  const totalLeadsCaptured = clients.reduce((acc, c) => acc + c.leadsCaptured, 0);
  
  // Approximate MRR
  const totalMRR = clients.reduce((acc, c) => {
    if (c.tier === 'starter') return acc + 199;
    if (c.tier === 'growth') return acc + 399;
    return acc + 799;
  }, 0);

  // Filtered clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = selectedTier === 'all' || c.tier === selectedTier;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Handle Add New Client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.businessName.trim() || !newClient.clientName.trim()) {
      setAddModalError('Please fill in both Business Name and Contact Name.');
      return;
    }

    setIsCreating(true);
    setAddModalError(null);

    // Format URL if user typed without protocol
    let formattedUrl = newClient.websiteUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const payload = {
      ...newClient,
      websiteUrl: formattedUrl || 'https://quoriksystems.com/'
    };

    try {
      const token = localStorage.getItem('adminToken') || 'admin';
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewClient({
          id: '',
          clientName: '',
          businessName: '',
          industry: 'Google Ads & Performance Marketing',
          email: '',
          phone: '',
          websiteUrl: '',
          tier: 'starter',
          voiceAgentName: 'Arthur (Executive Concierge)',
          voiceLanguage: 'English & Urdu'
        });
        showNotification(`✅ Client "${payload.businessName}" provisioned successfully!`);
        onRefresh();
        if (data.client) {
          setEmbedModalClient(data.client);
        }
      } else {
        setAddModalError(data.error || 'Failed to provision client portal. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setAddModalError(err.message || 'Network error occurred while provisioning portal.');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Update Client
  const handleUpdateClient = async () => {
    if (!editingClient) return;
    try {
      const token = localStorage.getItem('adminToken') || 'admin';
      const res = await fetch(`/api/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingClient)
      });

      if (res.ok) {
        setEditingClient(null);
        showNotification(`Client "${editingClient.businessName}" updated successfully!`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Client Execution
  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('adminToken') || 'admin';
      const res = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification(`✅ Client "${clientToDelete.businessName}" removed successfully.`);
        setClientToDelete(null);
        onRefresh();
      } else {
        const data = await res.json().catch(() => ({}));
        showNotification(`❌ Error: ${data.error || 'Could not delete client.'}`);
      }
    } catch (err: any) {
      console.error(err);
      showNotification(`❌ Error: ${err.message || 'Failed to delete client.'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Reset Usage
  const handleResetUsage = async (id: string, name: string) => {
    try {
      const token = localStorage.getItem('adminToken') || 'admin';
      const res = await fetch(`/api/clients/${id}/reset-minutes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification(`🔄 Voice minutes and text chats reset to 0 for "${name}". Status set to Active.`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Set Status
  const handleSetStatus = async (id: string, status: 'active' | 'voice_paused' | 'chat_paused' | 'paused') => {
    try {
      const token = localStorage.getItem('adminToken') || 'admin';
      const res = await fetch(`/api/clients/${id}/toggle-status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const label = status === 'active' 
          ? 'All On (Voice & Text 24/7)' 
          : status === 'voice_paused' 
          ? 'Voice Off (Text Chat Active)' 
          : status === 'chat_paused'
          ? 'Chat Off (Voice Calling Active)'
          : 'All Off (Fully Paused)';
        showNotification(`Client status updated to: ${label}`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate a test voice conversation
  const handleSimulateCall = async (client: ClientAccount) => {
    setSimulatingClientId(client.id);
    try {
      // Simulate random test call between 1.2 to 2.5 minutes
      const randomSeconds = Math.floor(Math.random() * 90) + 60; // 60 to 150 secs
      const sampleTopics = [
        'Pricing & Package Details',
        'Weekend Appointment Booking',
        'Insurance Coverage Verification',
        'Custom Web & Voice Quote'
      ];
      const selectedTopic = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];

      const res = await fetch(`/api/clients/${client.id}/log-voice-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: 'Live Web Visitor',
          visitorPhone: '+1 555-01' + Math.floor(1000 + Math.random() * 9000),
          durationSeconds: randomSeconds,
          topic: selectedTopic,
          transcriptSummary: `Visitor spoke with ${client.voiceAgentName} for ${(randomSeconds/60).toFixed(1)} mins about ${selectedTopic}. AI answered questions and logged contact lead.`,
          leadCaptured: true
        })
      });

      if (res.ok) {
        showNotification(`Simulated test call logged (+${(randomSeconds / 60).toFixed(1)} mins) for ${client.businessName}!`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingClientId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Notification Pill */}
      {actionNotice && (
        <div className="p-4 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal rounded-xl font-mono text-xs flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Agency Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Total Client Accounts</p>
              <h3 className="text-3xl font-extrabold text-white font-mono mt-2">{totalClients}</h3>
              <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {activeClients} Active Voice Portals
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Network Voice Minutes</p>
              <h3 className="text-3xl font-extrabold text-white font-mono mt-2">
                {Math.round(totalMinutesUsed).toLocaleString()} <span className="text-sm font-normal text-gray-500">/ {totalMinutesCap.toLocaleString()}m</span>
              </h3>
              <p className="text-[11px] text-brand-teal font-mono mt-1 flex items-center gap-1">
                <Mic className="w-3 h-3" /> {Math.round((totalMinutesUsed / (totalMinutesCap || 1)) * 100)}% Monthly Capacity Used
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Mic className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Leads & Bookings Captured</p>
              <h3 className="text-3xl font-extrabold text-white font-mono mt-2">{totalLeadsCaptured}</h3>
              <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Captured by AI Voice Concierges
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#0A0E1A] border border-white/10 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Monthly Recurring Revenue</p>
              <h3 className="text-3xl font-extrabold text-white font-mono mt-2">${totalMRR.toLocaleString()}<span className="text-xs text-gray-500">/mo</span></h3>
              <p className="text-[11px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-brand-teal" /> Subscriptions & Voice Retainers
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Add Client Button */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0A0E1A] p-4 rounded-2xl border border-white/10">
        <div className="flex flex-1 items-center gap-3 bg-[#05060A] border border-white/10 px-3.5 py-2 rounded-xl">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search clients by name, business, industry, or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white text-xs font-mono focus:outline-none placeholder-gray-500"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-gray-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto">
          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-[#05060A] border border-white/10 text-gray-300 text-xs font-mono px-3 py-2 rounded-xl focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Tiers</option>
            <option value="starter">Starter (300 mins)</option>
            <option value="growth">Growth (1,200 mins)</option>
            <option value="enterprise">Enterprise (4,000 mins)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#05060A] border border-white/10 text-gray-300 text-xs font-mono px-3 py-2 rounded-xl focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Statuses</option>
            <option value="active">All On (Active)</option>
            <option value="voice_paused">Voice Off (Chat Active)</option>
            <option value="chat_paused">Chat Off (Voice Active)</option>
            <option value="paused">All Off (Paused)</option>
            <option value="limit_reached">Quota Limit Reached</option>
          </select>

          {/* Add New Client Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-white transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-brand-teal/20"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      {/* Client List Grid / Cards */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center bg-[#0A0E1A] border border-white/10 rounded-2xl">
            <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white font-display">No Clients Found</h3>
            <p className="text-xs text-gray-400 font-mono mt-1">Try adjusting your search query or add your first client account.</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const usagePercent = Math.min(100, Math.round((client.voiceMinutesUsed / client.monthlyVoiceMinutesLimit) * 100));
            const remainingMinutes = Math.max(0, Math.round(client.monthlyVoiceMinutesLimit - client.voiceMinutesUsed));

            // Status Badge Formatting
            let statusBadge = (
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All On (Voice & Text)
              </span>
            );

            if (client.status === 'voice_paused') {
              statusBadge = (
                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Voice Off (Chat Active)
                </span>
              );
            } else if (client.status === 'chat_paused') {
              statusBadge = (
                <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Chat Off (Voice Active)
                </span>
              );
            } else if (client.status === 'limit_reached') {
              statusBadge = (
                <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Quota Limit Reached
                </span>
              );
            } else if (client.status === 'paused') {
              statusBadge = (
                <span className="px-2.5 py-1 bg-gray-500/10 border border-gray-500/20 text-gray-400 text-[10px] font-mono font-bold uppercase rounded-full flex items-center gap-1">
                  <PauseCircle className="w-3 h-3" /> All Off (Fully Paused)
                </span>
              );
            }

            // Progress bar color based on percentage
            let progressColor = 'bg-brand-teal';
            if (usagePercent >= 90) progressColor = 'bg-amber-500';
            if (usagePercent >= 100) progressColor = 'bg-red-500';

            return (
              <div
                key={client.id}
                className="bg-[#0A0E1A] border border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:border-white/20 space-y-5"
              >
                {/* Header Row: Business Name, Tier, Status, Link */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-white/5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 border border-brand-teal/30 flex items-center justify-center text-brand-teal font-bold font-mono text-sm shrink-0">
                      {client.businessName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white font-display">{client.businessName}</h3>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono uppercase rounded">
                          {client.tier.toUpperCase()} TIER
                        </span>
                        {statusBadge}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <p className="text-xs text-gray-400 font-mono flex items-center gap-2 flex-wrap">
                          <span>Owner: <strong className="text-gray-300">{client.clientName}</strong></span>
                          <span>•</span>
                          <span>{client.industry}</span>
                          {client.phone && (
                            <>
                              <span>•</span>
                              <a
                                href={`https://wa.me/${formatWhatsAppPhone(client.phone)}?text=${encodeURIComponent(`Hello ${client.clientName}, this is Quorik AI Support regarding your ${client.businessName} AI Assistant portal.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 bg-emerald-950/30 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[11px]"
                                title="Message Client on WhatsApp"
                              >
                                <span>💬</span>
                                <span>{client.phone}</span>
                              </a>
                            </>
                          )}
                        </p>
                        <div className="flex items-center gap-1 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300">
                          <span className="text-gray-400 text-[10px]">Client ID:</span>
                          <span className="font-bold">{client.id}</span>
                          <button
                            onClick={() => copyToClipboard(client.id, `id-${client.id}`)}
                            title="Copy Client ID"
                            className="ml-1 text-cyan-400 hover:text-white transition-colors"
                          >
                            {copiedKey === `id-${client.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEmbedModalClient(client)}
                      className="px-3 py-1.5 bg-gradient-to-r from-brand-teal/20 to-brand-blue/20 hover:from-brand-teal/30 hover:to-brand-blue/30 text-brand-teal border border-brand-teal/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-brand-teal/10"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Embed Code</span>
                    </button>
                    <a
                      href={client.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-brand-teal" />
                      <span>Visit Site</span>
                      <ArrowUpRight className="w-3 h-3 text-gray-500" />
                    </a>
                  </div>
                </div>

                {/* Middle: Interactive Voice Meter & Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Column: Dual Voice Minutes & Text Chat Progress Meters (6 cols) */}
                  <div className="lg:col-span-6 bg-[#05060A] border border-white/5 p-4 rounded-xl space-y-4">
                    {/* Meter 1: Voice Minutes */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-brand-teal" />
                          Monthly Voice Minutes:
                        </span>
                        <span className="text-white font-bold">
                          {client.voiceMinutesUsed % 1 === 0 ? client.voiceMinutesUsed : client.voiceMinutesUsed.toFixed(1)} / {client.monthlyVoiceMinutesLimit} mins
                          <span className="text-brand-teal ml-1.5">({usagePercent}%)</span>
                        </span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Meter 2: Text Chats Limit (Option A Cap) */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          Monthly AI Text Chats:
                        </span>
                        <span className="text-white font-bold">
                          {client.textChatsUsed || 0} / {(client.monthlyTextChatLimit || (client.tier === 'starter' ? 1000 : client.tier === 'growth' ? 5000 : 25000)).toLocaleString()} chats
                          <span className="text-cyan-400 ml-1.5">
                            ({Math.min(100, Math.round(((client.textChatsUsed || 0) / (client.monthlyTextChatLimit || 1000)) * 100))}%)
                          </span>
                        </span>
                      </div>

                      {/* Chat Progress Bar */}
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 relative">
                        <div
                          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round(((client.textChatsUsed || 0) / (client.monthlyTextChatLimit || (client.tier === 'starter' ? 1000 : 5000))) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 pt-1">
                      <span>{remainingMinutes > 0 ? `${remainingMinutes} voice mins left` : 'Voice Limit Reached'}</span>
                      <span className="text-gray-500">Resets on 1st of month</span>
                    </div>
                  </div>

                  {/* Middle Column: Voice Agent Info & Activity (3 cols) */}
                  <div className="lg:col-span-3 space-y-1.5 text-xs font-mono">
                    <div className="text-gray-400 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Agent: <strong className="text-white">{client.voiceAgentName}</strong></span>
                    </div>
                    <div className="text-gray-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>Language: <strong className="text-gray-300">{client.voiceLanguage}</strong></span>
                    </div>
                    <div className="text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Last Voice Chat: <span className="text-gray-300">{new Date(client.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                    </div>
                  </div>

                  {/* Right Column: Lead Metric & Capture (3 cols) */}
                  <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-mono uppercase text-gray-500">Conversations</p>
                      <p className="text-lg font-bold text-white font-mono">{client.totalConversations}</p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-mono uppercase text-gray-500">Leads Booked</p>
                      <p className="text-lg font-bold text-emerald-400 font-mono">+{client.leadsCaptured}</p>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Toolbar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  {/* Left Action: View Call Transcripts, Test Call & Test Chat */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedClientForHistory(client)}
                      className="px-3 py-1.5 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/30 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View Logs ({client.conversations.length})</span>
                    </button>

                    <button
                      disabled={simulatingClientId === client.id}
                      onClick={() => handleSimulateCall(client)}
                      title="Simulate a test 1-2 min visitor call on this client's site"
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Mic className="w-3.5 h-3.5 text-brand-teal" />
                      <span>{simulatingClientId === client.id ? 'Logging...' : '+ Test Call'}</span>
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/clients/${client.id}/log-text-chat`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ leadCaptured: true })
                          });
                          if (res.ok) {
                            showNotification(`Logged 1 test AI text chat for ${client.businessName}!`);
                            onRefresh();
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      title="Simulate a test text chat message"
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>+ Test Chat</span>
                    </button>
                  </div>

                  {/* Right Actions: Reset, Status Control, Edit, Delete */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => handleResetUsage(client.id, client.businessName)}
                      title="Reset used minutes and chats to 0 for a new billing cycle"
                      className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-lg flex items-center gap-1 transition-colors text-xs font-mono"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset Quotas</span>
                    </button>

                    {/* 4 Dedicated Status Controls: All On, Voice Off, Chat Off, All Off */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-lg text-xs font-mono">
                      <button
                        onClick={() => handleSetStatus(client.id, 'active')}
                        title="All On: Enable Voice Calling and Text Chat 24/7"
                        className={`px-2 py-1 rounded transition-colors ${
                          client.status === 'active'
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        All On
                      </button>
                      <button
                        onClick={() => handleSetStatus(client.id, 'voice_paused')}
                        title="Voice Off: Pause Voice Calling (Keep Text Chat Active)"
                        className={`px-2 py-1 rounded transition-colors ${
                          client.status === 'voice_paused'
                            ? 'bg-amber-500 text-black font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Voice Off
                      </button>
                      <button
                        onClick={() => handleSetStatus(client.id, 'chat_paused')}
                        title="Chat Off: Pause Text Chat (Keep Voice Calling Active)"
                        className={`px-2 py-1 rounded transition-colors ${
                          client.status === 'chat_paused'
                            ? 'bg-blue-500 text-white font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Chat Off
                      </button>
                      <button
                        onClick={() => handleSetStatus(client.id, 'paused')}
                        title="All Off: Pause Everything (Voice & Text Off)"
                        className={`px-2 py-1 rounded transition-colors ${
                          client.status === 'paused'
                            ? 'bg-red-500 text-white font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        All Off
                      </button>
                    </div>

                    <button
                      onClick={() => setEditingClient(client)}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-brand-teal border border-white/10 rounded-lg transition-colors"
                      title="Edit Client Settings"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setClientToDelete(client)}
                      className="p-1.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 rounded-lg transition-colors"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL 1: ADD NEW CLIENT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Provision New Client Account</h3>
                  <p className="text-xs text-gray-400 font-mono">Deploy a dedicated website voice assistant & usage meter.</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4 font-mono text-xs">
              {/* Error notice if any */}
              {addModalError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addModalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Business / Agency Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Performance Ads"
                    value={newClient.businessName}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 20);
                      setNewClient({ ...newClient, businessName: name, id: newClient.id || slug });
                    }}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Client Owner / Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saram Sardar"
                    value={newClient.clientName}
                    onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5 flex items-center justify-between">
                    <span>Client ID (for Widget script)</span>
                    <span className="text-[10px] text-brand-teal font-mono">Unique Key</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. apex-performance-ads"
                    value={newClient.id}
                    onChange={(e) => setNewClient({ ...newClient, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                    className="w-full bg-[#05060A] border border-cyan-500/30 text-cyan-300 p-3 rounded-xl focus:outline-none focus:border-brand-teal font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Industry / Niche</label>
                  <input
                    type="text"
                    placeholder="e.g. Google Ads & Performance Marketing"
                    value={newClient.industry}
                    onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Client Email</label>
                  <input
                    type="email"
                    placeholder="e.g. sarah@apexdental.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">WhatsApp / Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555-019-2834"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Website Domain URL</label>
                  <input
                    type="text"
                    placeholder="https://apexdental.com"
                    value={newClient.websiteUrl}
                    onChange={(e) => setNewClient({ ...newClient, websiteUrl: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Plan Tier (Voice Minutes)</label>
                  <select
                    value={newClient.tier}
                    onChange={(e) => setNewClient({ ...newClient, tier: e.target.value as any })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  >
                    <option value="starter">Starter Plan (300 Voice Mins / 1,000 Chats / mo)</option>
                    <option value="growth">Growth Suite (1,200 Voice Mins / 5,000 Chats / mo)</option>
                    <option value="enterprise">Enterprise Ultra (4,000+ Voice Mins / Unlimited / mo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Voice Agent Persona Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah (Dental Concierge)"
                    value={newClient.voiceAgentName}
                    onChange={(e) => setNewClient({ ...newClient, voiceAgentName: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Language & Dialect</label>
                  <select
                    value={newClient.voiceLanguage}
                    onChange={(e) => setNewClient({ ...newClient, voiceLanguage: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  >
                    <option value="English & Urdu">English & Roman Urdu (Bilingual)</option>
                    <option value="English Only">English (Standard / US / UK)</option>
                    <option value="Multi-lingual (EN/UR/AR)">Multi-lingual (English, Urdu, Arabic)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 bg-brand-teal text-[#05060A] font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-brand-teal/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#05060A] border-t-transparent rounded-full animate-spin" />
                      <span>Provisioning Portal...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Provision Client Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT CLIENT MODAL --- */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Edit Client: {editingClient.businessName}</h3>
                  <p className="text-xs text-gray-400 font-mono">Modify tier, voice minutes allowance, or agent settings.</p>
                </div>
              </div>
              <button onClick={() => setEditingClient(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Business Name</label>
                  <input
                    type="text"
                    value={editingClient.businessName}
                    onChange={(e) => setEditingClient({ ...editingClient, businessName: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Owner / Contact Name</label>
                  <input
                    type="text"
                    value={editingClient.clientName}
                    onChange={(e) => setEditingClient({ ...editingClient, clientName: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Industry / Niche</label>
                  <input
                    type="text"
                    placeholder="e.g. Google Ads & Performance Marketing"
                    value={editingClient.industry}
                    onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Plan Tier</label>
                  <select
                    value={editingClient.tier}
                    onChange={(e) => {
                      const tier = e.target.value as 'starter' | 'growth' | 'enterprise';
                      const limit = tier === 'starter' ? 300 : tier === 'growth' ? 1200 : 4000;
                      setEditingClient({ ...editingClient, tier, monthlyVoiceMinutesLimit: limit });
                    }}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  >
                    <option value="starter">Starter (300 mins)</option>
                    <option value="growth">Growth (1,200 mins)</option>
                    <option value="enterprise">Enterprise (4,000 mins)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Voice Minutes Used This Month</label>
                  <input
                    type="number"
                    value={editingClient.voiceMinutesUsed}
                    onChange={(e) => setEditingClient({ ...editingClient, voiceMinutesUsed: Number(e.target.value) })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Monthly Minute Limit</label>
                  <input
                    type="number"
                    value={editingClient.monthlyVoiceMinutesLimit}
                    onChange={(e) => setEditingClient({ ...editingClient, monthlyVoiceMinutesLimit: Number(e.target.value) })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 block mb-1.5">Status</label>
                  <select
                    value={editingClient.status}
                    onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as any })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  >
                    <option value="active">All On (Voice & Text 24/7)</option>
                    <option value="voice_paused">Voice Off (AI Text Chat Active)</option>
                    <option value="chat_paused">Chat Off (AI Voice Calling Active)</option>
                    <option value="paused">All Off (Fully Paused)</option>
                    <option value="limit_reached">Limit Reached (Text Only)</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1.5">Voice Agent Name</label>
                  <input
                    type="text"
                    value={editingClient.voiceAgentName}
                    onChange={(e) => setEditingClient({ ...editingClient, voiceAgentName: e.target.value })}
                    className="w-full bg-[#05060A] border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateClient}
                  className="px-6 py-2.5 bg-brand-teal text-[#05060A] font-bold rounded-xl hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: VIEW VISITOR TRANSCRIPTS & LOGS MODAL --- */}
      {activeSelectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-white/10 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-teal" />
                  Visitor Voice Transcripts: {activeSelectedClient.businessName}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Logged interactions between website visitors and {activeSelectedClient.voiceAgentName}.
                </p>
              </div>
              <button onClick={() => setSelectedClientForHistory(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 font-mono text-xs">
              {activeSelectedClient.conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No visitor voice conversations recorded yet for this client.</p>
                </div>
              ) : (
                activeSelectedClient.conversations.map((conv) => (
                  <div key={conv.id} className="p-4 bg-[#05060A] border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{conv.visitorName}</span>
                        {conv.visitorPhone && (
                          <span className="text-gray-400 text-[11px]">({conv.visitorPhone})</span>
                        )}
                        {conv.leadCaptured && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded font-bold">
                            Lead Captured
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-brand-teal font-bold">
                        {conv.durationMinutes.toFixed(1)} mins ({conv.durationSeconds}s)
                      </span>
                    </div>

                    <div className="text-gray-300 text-xs bg-white/[0.02] p-2.5 rounded border border-white/5 leading-relaxed">
                      <strong className="text-gray-400 block text-[10px] uppercase mb-1">Topic: {conv.topic}</strong>
                      "{conv.transcriptSummary}"
                    </div>

                    <div className="text-[10px] text-gray-500 flex justify-between">
                      <span>Status: {conv.status}</span>
                      <span>{new Date(conv.date).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono shrink-0">
              <span className="text-gray-400">
                Total Used: <strong className="text-white">{Math.round(activeSelectedClient.voiceMinutesUsed)} / {activeSelectedClient.monthlyVoiceMinutesLimit} mins</strong>
              </span>
              <button
                onClick={() => setSelectedClientForHistory(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: DELETE CLIENT CONFIRMATION MODAL --- */}
      {clientToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Delete Client Portal</h3>
                <p className="text-xs text-gray-400 font-mono">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-mono leading-relaxed bg-[#05060A] p-3.5 rounded-xl border border-white/5">
              Are you sure you want to permanently remove <strong className="text-white">{clientToDelete.businessName}</strong>? All their logged voice minutes, chat transcripts, and widget credentials will be deleted.
            </p>

            <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteClient}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: CLIENT EMBED CODE & INTEGRATION MODAL --- */}
      {embedModalClient && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0E1A] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/50 max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/20 to-cyan-500/20 border border-brand-teal/40 flex items-center justify-center text-brand-teal shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-display">Client Embed Code</h3>
                    <span className="px-2 py-0.5 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[10px] font-mono rounded">
                      Live Widget Ready
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Website Integration for: <strong className="text-white">{embedModalClient.businessName}</strong> ({embedModalClient.industry})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmbedModalClient(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client ID Quick Copy Highlight */}
            <div className="bg-[#05060A] border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs shrink-0">
              <div>
                <span className="text-gray-400 text-[11px] block">Client ID Key:</span>
                <span className="text-cyan-300 font-bold text-sm tracking-wide">{embedModalClient.id}</span>
              </div>
              <button
                onClick={() => copyToClipboard(embedModalClient.id, 'modal-id')}
                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg flex items-center gap-1.5 transition-all text-xs font-bold shrink-0"
              >
                {copiedKey === 'modal-id' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Client ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Framework Switcher Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 font-mono text-xs shrink-0">
              <button
                onClick={() => setEmbedTab('react')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-bold ${
                  embedTab === 'react'
                    ? 'bg-brand-teal text-[#05060A] shadow-md shadow-brand-teal/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>⚡ React / Vite / Next.js Component</span>
              </button>
              <button
                onClick={() => setEmbedTab('html')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-bold ${
                  embedTab === 'html'
                    ? 'bg-brand-teal text-[#05060A] shadow-md shadow-brand-teal/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🌐 HTML / WordPress / Webflow Script</span>
              </button>
            </div>

            {/* Code Display Area */}
            <div className="flex-1 overflow-y-auto space-y-4 font-mono text-xs pr-1">
              {embedTab === 'react' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px]">
                      1. Create <code className="text-brand-teal bg-white/5 px-1.5 py-0.5 rounded">src/components/QuorikVoiceWidget.tsx</code> in your client's React / Vite project:
                    </span>
                    <button
                      onClick={() => {
                        const code = `import { useEffect } from 'react';

export function QuorikVoiceWidget() {
  useEffect(() => {
    if (document.getElementById('quorik-widget-script')) return;

    const script = document.createElement('script');
    script.id = 'quorik-widget-script';
    script.src = '${window.location.origin}/widget.js';
    script.setAttribute('data-client-id', '${embedModalClient.id}');
    script.setAttribute('data-accent', '#00E5FF');
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const el = document.getElementById('quorik-widget-script');
      if (el) el.remove();
      const root = document.getElementById('quorik-voice-widget-root');
      if (root) root.remove();
    };
  }, []);

  return null;
}`;
                        copyToClipboard(code, 'react-comp');
                      }}
                      className="px-3 py-1 bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 text-brand-teal rounded-lg flex items-center gap-1.5 text-xs transition-colors"
                    >
                      {copiedKey === 'react-comp' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied React Code!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy React Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="bg-[#05060A] border border-white/10 rounded-xl p-4 text-[11px] text-gray-300 overflow-x-auto font-mono leading-relaxed">
{`import { useEffect } from 'react';

export function QuorikVoiceWidget() {
  useEffect(() => {
    if (document.getElementById('quorik-widget-script')) return;

    const script = document.createElement('script');
    script.id = 'quorik-widget-script';
    script.src = '${window.location.origin}/widget.js';
    script.setAttribute('data-client-id', '${embedModalClient.id}');
    script.setAttribute('data-accent', '#00E5FF');
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const el = document.getElementById('quorik-widget-script');
      if (el) el.remove();
      const root = document.getElementById('quorik-voice-widget-root');
      if (root) root.remove();
    };
  }, []);

  return null;
}`}
                  </pre>

                  <div className="bg-[#05060A] border border-white/5 rounded-xl p-3.5 text-gray-400 space-y-1">
                    <p className="text-white font-bold text-[11px]">2. Render it inside their App.tsx:</p>
                    <pre className="text-[11px] text-cyan-300 font-mono">{`<QuorikVoiceWidget />`}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px]">
                      Paste this script right before the closing <code className="text-brand-teal">&lt;/body&gt;</code> tag:
                    </span>
                    <button
                      onClick={() => {
                        const htmlSnippet = `<!-- Quorik 24/7 AI Voice & Chat Assistant for ${embedModalClient.businessName} -->\n<script \n  src="${window.location.origin}/widget.js" \n  data-client-id="${embedModalClient.id}"\n  data-accent="#00E5FF"\n  async>\n</script>`;
                        copyToClipboard(htmlSnippet, 'html-snip');
                      }}
                      className="px-3 py-1 bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 text-brand-teal rounded-lg flex items-center gap-1.5 text-xs transition-colors"
                    >
                      {copiedKey === 'html-snip' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied HTML Script!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Script Tag</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="bg-[#05060A] border border-white/10 rounded-xl p-4 text-[11px] text-gray-300 overflow-x-auto font-mono leading-relaxed">
{`<!-- Quorik 24/7 AI Voice & Chat Assistant for ${embedModalClient.businessName} -->
<script 
  src="${window.location.origin}/widget.js" 
  data-client-id="${embedModalClient.id}"
  data-accent="#00E5FF"
  async>
</script>`}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono shrink-0">
              <span className="text-gray-400 text-[11px]">
                Status: <strong className="text-emerald-400">Active & Ready to Connect</strong>
              </span>
              <button
                onClick={() => setEmbedModalClient(null)}
                className="px-6 py-2 bg-brand-teal text-[#05060A] font-bold rounded-xl hover:bg-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
