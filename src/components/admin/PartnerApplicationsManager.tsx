import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Users, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Save,
  X,
  Send
} from 'lucide-react';
import { PartnerApplication, PartnerStatus } from '../../types/partner';
import { formatWhatsAppPhone } from '../../utils/phone';

interface PartnerApplicationsManagerProps {
  partnerApplications: PartnerApplication[];
  onRefresh: () => void;
}

export function PartnerApplicationsManager({ 
  partnerApplications, 
  onRefresh 
}: PartnerApplicationsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [internalNotesText, setInternalNotesText] = useState('');
  const [commissionTierText, setCommissionTierText] = useState('');
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // New Application Form State for Manual Entry
  const [newCompany, setNewCompany] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newTrack, setNewTrack] = useState('agency-software-house');
  const [newClientSize, setNewClientSize] = useState('10-50');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newStatus, setNewStatus] = useState<PartnerStatus>('in_review');

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Filter applications
  const filteredApps = partnerApplications.filter((app) => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.contactPhone && app.contactPhone.includes(searchQuery)) ||
      (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesTrack = trackFilter === 'all' || app.partnerTrack === trackFilter;

    return matchesSearch && matchesStatus && matchesTrack;
  });

  // Calculate Metrics
  const totalCount = partnerApplications.length;
  const inReviewCount = partnerApplications.filter(a => a.status === 'in_review' || a.status === 'new').length;
  const approvedCount = partnerApplications.filter(a => a.status === 'approved' || a.status === 'onboarded').length;
  const enterpriseRosterCount = partnerApplications.filter(a => a.clientBaseSize === '50-200' || a.clientBaseSize === '200+').length;

  const handleStatusChange = async (appId: string, newStatus: PartnerStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/partnerships/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Partner status updated to "${newStatus.replace('_', ' ').toUpperCase()}"`);
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/partnerships/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          internalNotes: internalNotesText,
          commissionTier: commissionTierText 
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedApp(updated);
        setIsEditingNotes(false);
        showToast('Internal alliance notes updated successfully');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (appId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete the partnership application from "${companyName}"?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/partnerships/applications/${appId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        showToast(`Partner application from "${companyName}" removed`);
        if (selectedApp?.id === appId) {
          setSelectedApp(null);
        }
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete application');
    }
  };

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newContactEmail || !newContactName) {
      alert('Please provide company name, contact person, and email.');
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/partnerships/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: newCompany,
          websiteUrl: newWebsite,
          partnerTrack: newTrack,
          clientBaseSize: newClientSize,
          contactName: newContactName,
          contactEmail: newContactEmail,
          contactPhone: newContactPhone,
          notes: newNotes,
          status: newStatus
        })
      });

      if (res.ok) {
        showToast(`Manual partner lead "${newCompany}" created!`);
        setIsCreatingModalOpen(false);
        // reset
        setNewCompany('');
        setNewWebsite('');
        setNewContactName('');
        setNewContactEmail('');
        setNewContactPhone('');
        setNewNotes('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to create partner lead');
    } finally {
      setIsSaving(false);
    }
  };

  const exportToCSV = () => {
    if (partnerApplications.length === 0) {
      alert('No partner applications to export');
      return;
    }
    const headers = [
      'ID',
      'Company Name',
      'Website',
      'Track',
      'Client Base Size',
      'Contact Name',
      'Email',
      'Phone',
      'Status',
      'Commission Tier',
      'Estimated Pipeline',
      'Notes',
      'Internal Notes',
      'Created At'
    ];

    const rows = partnerApplications.map(app => [
      `"${app.id}"`,
      `"${(app.companyName || '').replace(/"/g, '""')}"`,
      `"${(app.websiteUrl || '').replace(/"/g, '""')}"`,
      `"${(app.partnerTrack || '').replace(/"/g, '""')}"`,
      `"${(app.clientBaseSize || '').replace(/"/g, '""')}"`,
      `"${(app.contactName || '').replace(/"/g, '""')}"`,
      `"${(app.contactEmail || '').replace(/"/g, '""')}"`,
      `"${(app.contactPhone || '').replace(/"/g, '""')}"`,
      `"${(app.status || '').replace(/"/g, '""')}"`,
      `"${(app.commissionTier || '').replace(/"/g, '""')}"`,
      `"${(app.estimatedPipeline || '').replace(/"/g, '""')}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`,
      `"${(app.internalNotes || '').replace(/"/g, '""')}"`,
      `"${app.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quorik-partner-applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded successfully!');
  };

  const openAppDetails = (app: PartnerApplication) => {
    setSelectedApp(app);
    setInternalNotesText(app.internalNotes || '');
    setCommissionTierText(app.commissionTier || '20%–30% Recurring');
    setIsEditingNotes(false);
  };

  const getTrackBadge = (track: string) => {
    switch (track) {
      case 'agency-software-house':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Briefcase className="w-3 h-3" />
            Software House & Dev Co-Sell
          </span>
        );
      case 'certified-solution-integrator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Layers className="w-3 h-3" />
            Solution & CRM Integrator
          </span>
        );
      case 'strategic-referral':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <TrendingUp className="w-3 h-3" />
            Strategic Referral
          </span>
        );
      case 'white-label-reseller':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            White-Label Reseller
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/10 text-gray-300 border border-white/20">
            {track}
          </span>
        );
    }
  };

  const getStatusBadge = (status: PartnerStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            New Inbound
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            In Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Alliance Approved
          </span>
        );
      case 'onboarded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3 h-3" />
            Active / Onboarded
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* --- 1. METRICS OVERVIEW STRIP --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono uppercase">
            <span>Total Inbound Partners</span>
            <Building2 className="w-4 h-4 text-brand-teal" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{totalCount}</p>
          <p className="text-[11px] text-gray-400">Agencies, integrators & resellers</p>
        </div>

        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-xs font-mono uppercase">
            <span>In Review Pipeline</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 font-mono">{inReviewCount}</p>
          <p className="text-[11px] text-gray-400">Awaiting joint pitch / approval</p>
        </div>

        <div className="p-4 bg-white/[0.03] border border-emerald-500/20 rounded-xl space-y-1 bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-mono uppercase">
            <span>Approved / Active Partners</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-300 font-mono">{approvedCount}</p>
          <p className="text-[11px] text-gray-400">Co-selling & rev-share active</p>
        </div>

        <div className="p-4 bg-white/[0.03] border border-cyan-500/20 rounded-xl space-y-1 bg-cyan-500/[0.02]">
          <div className="flex items-center justify-between text-cyan-400 text-xs font-mono uppercase">
            <span>Enterprise Scale Rosters</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-300 font-mono">{enterpriseRosterCount}</p>
          <p className="text-[11px] text-gray-400">Agencies with 50+ enterprise clients</p>
        </div>
      </div>

      {/* --- 2. CONTROLS BAR: SEARCH, FILTERS & ACTIONS --- */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/10">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by company, contact person, email, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#05070D] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-teal"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="bg-[#05070D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal font-mono"
          >
            <option value="all">All Tracks ({totalCount})</option>
            <option value="agency-software-house">Software House & Dev Agencies</option>
            <option value="certified-solution-integrator">Solution & CRM Integrators</option>
            <option value="strategic-referral">Strategic Referrals</option>
            <option value="white-label-reseller">White-Label Resellers</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#05070D] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="new">New Inbound</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="onboarded">Active / Onboarded</option>
            <option value="declined">Declined</option>
          </select>

          {/* Action Buttons */}
          <button 
            onClick={exportToCSV}
            title="Download full CSV spreadsheet"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono border border-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-teal" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button 
            onClick={() => setIsCreatingModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-teal hover:bg-brand-teal/90 text-[#07090F] font-bold rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Partner Lead</span>
          </button>
        </div>
      </div>

      {/* --- 3. PARTNER APPLICATIONS LIST / TABLE --- */}
      {filteredApps.length === 0 ? (
        <div className="p-12 text-center border border-white/10 rounded-xl bg-white/[0.01] space-y-3">
          <Building2 className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Partner Applications Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all' || trackFilter !== 'all' 
              ? 'No applications match your current filters. Try resetting the filters.' 
              : 'When agencies or software houses fill out the Quorik Partner Application on the website (/partnerships), their detailed intake appears here instantly.'}
          </p>
          {(searchQuery || statusFilter !== 'all' || trackFilter !== 'all') && (
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTrackFilter('all'); }}
              className="text-xs font-mono text-brand-teal underline"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const cleanPhone = formatWhatsAppPhone(app.contactPhone);
            const waGreeting = encodeURIComponent(`Hi ${app.contactName}! This is the Strategic Alliances team at Quorik Systems regarding your partner application for ${app.companyName}. We'd love to schedule our joint discovery session!`);
            const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waGreeting}` : null;
            const mailUrl = `mailto:${app.contactEmail}?subject=${encodeURIComponent(`Quorik Partner Program Alliance - ${app.companyName}`)}`;

            return (
              <div 
                key={app.id}
                className="p-5 rounded-xl bg-[#090D18] border border-white/10 hover:border-brand-teal/40 transition-all space-y-4 shadow-lg group"
              >
                {/* Header Row: Company, Track, Status, and Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-teal shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white group-hover:text-brand-teal transition-colors">
                          {app.companyName}
                        </h4>
                        {app.websiteUrl && (
                          <a 
                            href={app.websiteUrl.startsWith('http') ? app.websiteUrl : `https://${app.websiteUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-teal/80 hover:text-brand-teal underline"
                          >
                            <span>Visit Site</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {getTrackBadge(app.partnerTrack)}
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                          {app.clientBaseSize} Clients
                        </span>
                        {app.estimatedPipeline && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Est. {app.estimatedPipeline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[11px] font-mono text-gray-500 mr-1">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Body Row: Contact details, Proposal Notes, Internal Notes preview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                  
                  {/* Column 1: Contact Dossier */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-mono uppercase text-gray-500">Contact Lead</p>
                    <p className="text-sm font-semibold text-white">{app.contactName}</p>
                    <p className="text-gray-400 font-mono">{app.contactEmail}</p>
                    <p className="text-gray-400 font-mono">{app.contactPhone || 'No phone provided'}</p>
                    <div className="pt-2 flex items-center gap-2">
                      {waUrl && (
                        <a 
                          href={waUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <a 
                        href={mailUrl}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-mono transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Inbound Scope & Goals */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-white/[0.02] border border-white/5 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-mono uppercase text-gray-500">Proposed Alliance Scope / Inbound Notes</p>
                      {app.commissionTier && (
                        <span className="text-[10px] font-mono text-brand-teal px-1.5 py-0.5 rounded bg-brand-teal/10 border border-brand-teal/20">
                          Tier: {app.commissionTier}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 leading-relaxed italic line-clamp-3">
                      "{app.notes || 'No specific notes provided in initial form.'}"
                    </p>
                    {app.internalNotes && (
                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-amber-300/90 font-mono">
                        <Edit3 className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="line-clamp-1"><strong>Internal:</strong> {app.internalNotes}</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer Controls & Quick Status Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-gray-400">Change Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as PartnerStatus)}
                      className="bg-[#05070D] border border-white/20 text-white rounded px-2.5 py-1 text-xs font-mono focus:border-brand-teal focus:outline-none"
                    >
                      <option value="new">New Inbound</option>
                      <option value="in_review">In Review</option>
                      <option value="approved">Alliance Approved</option>
                      <option value="onboarded">Active / Onboarded</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAppDetails(app)}
                      className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-teal" />
                      <span>Review & Dossier</span>
                    </button>

                    <button
                      onClick={() => handleDelete(app.id, app.companyName)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* --- 4. MODAL: DETAILED APPLICATION REVIEW & INTERNAL NOTES --- */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#070A14] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedApp.companyName}</h3>
                  {selectedApp.websiteUrl && (
                    <a 
                      href={selectedApp.websiteUrl.startsWith('http') ? selectedApp.websiteUrl : `https://${selectedApp.websiteUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-brand-teal hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Website</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {getTrackBadge(selectedApp.partnerTrack)}
                  {getStatusBadge(selectedApp.status)}
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 text-xs">
              
              {/* Partner Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <span className="text-gray-500 font-mono uppercase text-[10px] block">Contact Representative</span>
                  <span className="text-sm font-semibold text-white">{selectedApp.contactName}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-mono uppercase text-[10px] block">Corporate Email</span>
                  <a href={`mailto:${selectedApp.contactEmail}`} className="text-brand-teal font-mono hover:underline">
                    {selectedApp.contactEmail}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 font-mono uppercase text-[10px] block">Phone / WhatsApp</span>
                  <span className="text-white font-mono">{selectedApp.contactPhone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-mono uppercase text-[10px] block">Client Base Capacity</span>
                  <span className="text-white font-mono">{selectedApp.clientBaseSize} Active Clients</span>
                </div>
              </div>

              {/* Applicant's Initial Proposal */}
              <div className="space-y-1.5">
                <span className="text-gray-400 font-mono uppercase text-[10px] block font-semibold">
                  Applicant's Inbound Proposal / Notes
                </span>
                <div className="p-4 rounded-xl bg-[#05070D] border border-white/10 text-gray-300 text-xs leading-relaxed italic">
                  "{selectedApp.notes || 'No detailed message was entered during submission.'}"
                </div>
              </div>

              {/* Internal Alliance Management & Commission Tier */}
              <div className="space-y-3 p-4 rounded-xl bg-brand-teal/[0.03] border border-brand-teal/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-brand-teal font-mono font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Internal Alliance Terms & Admin Notes</span>
                  </div>
                  {!isEditingNotes && (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="text-xs font-mono text-brand-teal hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Terms
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Commission Structure / Tier</label>
                      <input 
                        type="text"
                        value={commissionTierText}
                        onChange={(e) => setCommissionTierText(e.target.value)}
                        placeholder="e.g. 25% Agency Co-Sell, 20% Rev-Share + 100% Setup"
                        className="w-full bg-[#05070D] border border-white/20 rounded-lg p-2 text-xs text-white focus:border-brand-teal focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Internal Notes & Meeting Summary</label>
                      <textarea
                        rows={4}
                        value={internalNotesText}
                        onChange={(e) => setInternalNotesText(e.target.value)}
                        placeholder="Log meeting notes, agreed rev-share terms, technical integrations needed..."
                        className="w-full bg-[#05070D] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:border-brand-teal focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingNotes(false)}
                        className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-mono"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                        className="px-4 py-1.5 rounded bg-brand-teal hover:bg-brand-teal/90 text-[#07090F] font-bold text-xs font-mono flex items-center gap-1.5 uppercase"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save Terms'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Commission Tier:</span>
                      <span className="font-mono font-bold text-white">{selectedApp.commissionTier || '20%–30% Standard Rev-Share'}</span>
                    </div>
                    <div className="text-xs text-gray-300 bg-[#05070D] p-3 rounded-lg border border-white/5">
                      {selectedApp.internalNotes || 'No internal notes added yet. Click "Edit Terms" to add meeting logs or custom rev-share agreements.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Outreach Quick Action */}
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedApp.contactPhone && selectedApp.contactPhone !== 'N/A' && (
                  <a
                    href={`https://wa.me/${formatWhatsAppPhone(selectedApp.contactPhone)}?text=${encodeURIComponent(`Hi ${selectedApp.contactName}! Reaching out from Quorik Systems regarding the ${selectedApp.companyName} partnership application.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedApp.contactEmail}?subject=Quorik%20Partner%20Program%20-%20${encodeURIComponent(selectedApp.companyName)}`}
                  className="flex-1 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Direct Email</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- 5. MODAL: MANUAL PARTNER LEAD ENTRY --- */}
      {isCreatingModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#070A14] border border-white/15 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-teal" />
                <h3 className="text-lg font-bold text-white font-display">Add Partner Application / Lead</h3>
              </div>
              <button 
                onClick={() => setIsCreatingModalOpen(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-mono uppercase block mb-1">Company / Agency *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Xeven Solutions"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-mono uppercase block mb-1">Website URL</label>
                  <input
                    type="text"
                    placeholder="https://agency.com"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-mono uppercase block mb-1">Partner Track *</label>
                  <select
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value)}
                    className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none font-mono"
                  >
                    <option value="agency-software-house">Software House & Dev Co-Sell</option>
                    <option value="certified-solution-integrator">Solution & CRM Integrator</option>
                    <option value="strategic-referral">Strategic Referral</option>
                    <option value="white-label-reseller">White-Label Reseller</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 font-mono uppercase block mb-1">Client Capacity</label>
                  <select
                    value={newClientSize}
                    onChange={(e) => setNewClientSize(e.target.value)}
                    className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none font-mono"
                  >
                    <option value="1-10">1 – 10 Clients</option>
                    <option value="10-50">10 – 50 Clients</option>
                    <option value="50-200">50 – 200 Enterprise Clients</option>
                    <option value="200+">200+ Enterprise Roster</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 font-mono uppercase block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-mono uppercase block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@agency.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-mono uppercase block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-mono uppercase block mb-1">Partnership Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes about prospective deal, intro source, or requirements..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#05070D] border border-white/15 rounded-lg p-2 text-white focus:border-brand-teal focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono uppercase text-[10px]">Status:</span>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as PartnerStatus)}
                    className="bg-[#05070D] border border-white/15 rounded p-1 text-white text-xs font-mono"
                  >
                    <option value="new">New Inbound</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="onboarded">Onboarded</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 font-mono text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-lg bg-brand-teal hover:bg-brand-teal/90 text-[#07090F] font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isSaving ? 'Creating...' : 'Create Partner'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
