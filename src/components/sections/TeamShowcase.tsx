import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Linkedin, 
  ArrowUpRight, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  Mic, 
  Server, 
  Workflow, 
  Brain,
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  X, 
  Camera, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TEAM_MEMBERS, TeamMember } from '../../data/teamData';

const roleIcons: Record<string, any> = {
  'shehram-meellu': Code2,
  'm-r': Cpu,
  'a-k': Mic,
  'farhaj': Server,
  'd-c': Workflow,
  'e-r': Brain
};

export function TeamShowcase({ isFullPage = false }: { isFullPage?: boolean }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>(TEAM_MEMBERS[0].id);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});

  // Load custom uploaded images from server and localStorage + listen for updates
  useEffect(() => {
    const loadImages = () => {
      try {
        const saved = localStorage.getItem('quorik_team_images');
        if (saved) {
          setCustomImages(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }

      fetch('/api/team/images')
        .then(res => res.json())
        .then(data => {
          if (data && typeof data === 'object') {
            setCustomImages(data);
            try {
              localStorage.setItem('quorik_team_images', JSON.stringify(data));
            } catch (e) {}
          }
        })
        .catch(err => console.log('Team images API load:', err));
    };

    loadImages();

    // Real-time custom event listener
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setCustomImages(e.detail);
      } else {
        loadImages();
      }
    };

    window.addEventListener('quorik_team_images_updated', handleUpdate);
    window.addEventListener('storage', loadImages);

    return () => {
      window.removeEventListener('quorik_team_images_updated', handleUpdate);
      window.removeEventListener('storage', loadImages);
    };
  }, []);

  const getMemberImage = (member: TeamMember) => {
    return customImages[member.id] || member.image;
  };

  const activeMember = TEAM_MEMBERS.find(m => m.id === activeTabId) || TEAM_MEMBERS[0];
  const ActiveIcon = roleIcons[activeMember.id] || Sparkles;

  return (
    <section id="team" className={`relative bg-[#05060A] text-white overflow-hidden ${isFullPage ? 'py-16 md:py-24' : 'py-24 md:py-32 border-t border-white/5'}`}>
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-mono tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quorik Leadership & Engineering Council</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Specialists Behind <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-teal to-cyan-400">
              Autonomous Systems & Neural Voice
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-400 font-normal leading-relaxed">
            Every Quorik deployment is engineered, optimized, and overseen by our core 5-member technical and executive council.
          </p>
        </div>

        {/* Featured Founder Spotlight Card */}
        <div className="mb-16 rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#0A0E1A] to-[#07090E] border border-brand-teal/40 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Founder Photo */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-brand-teal/80 p-1 bg-[#05060A] shadow-2xl shadow-brand-teal/20 group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={getMemberImage(TEAM_MEMBERS[0])} 
                    alt={TEAM_MEMBERS[0].name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = TEAM_MEMBERS[0].image;
                    }}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-brand-teal text-[#05060A] font-bold text-xs font-mono shadow-lg">
                  CEO / Council 01
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mt-4 tracking-tight">{TEAM_MEMBERS[0].name}</h3>
              <p className="text-xs font-mono text-brand-teal mt-0.5">{TEAM_MEMBERS[0].displayRole}</p>
              
              {TEAM_MEMBERS[0].linkedin && (
                <a
                  href={TEAM_MEMBERS[0].linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 hover:border-[#0A66C2]/40 text-xs font-mono text-gray-300 hover:text-white transition-all"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>Verified LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400" />
                </a>
              )}
            </div>

            {/* Right: Founder Executive Overview */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-teal font-semibold">
                  Strategic Council Lead
                </span>
                <h4 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                  "{TEAM_MEMBERS[0].tagline}"
                </h4>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed mt-3">
                  {TEAM_MEMBERS[0].bio}
                </p>
              </div>

              {/* Core Deliverables Grid */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {TEAM_MEMBERS[0].specialties.map((spec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                    <span className="text-xs text-gray-200 font-medium">{spec}</span>
                  </div>
                ))}
              </div>

              {/* Founder Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {TEAM_MEMBERS[0].techStack.slice(0, 5).map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-xs font-mono text-brand-teal">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMember(TEAM_MEMBERS[0])}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono text-white transition-all flex items-center gap-1.5"
                  >
                    <span>Full Executive Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to="/contact"
                    className="px-5 py-2 rounded-xl bg-brand-teal hover:bg-white text-[#05060A] font-bold text-xs font-mono transition-all shadow-lg shadow-brand-teal/20"
                  >
                    Book Executive Discovery
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 5-Member Grid Showcase */}
        <div className="space-y-6 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                All 5 Executive & Technical Council Members
              </h3>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mt-0.5">
                Full Company Roster & Strategic Disciplines
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-teal">
              <Sparkles className="w-4 h-4" />
              <span>5 Core Pillars • 100% In-House Engineering</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => {
              const MemberIcon = roleIcons[member.id] || Sparkles;
              return (
                <motion.div
                  key={member.id}
                  id={`team-card-${member.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: member.order * 0.08 }}
                  className={`group relative rounded-2xl bg-[#0A0E1A] border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    member.isFounder 
                      ? 'border-brand-teal/40 hover:border-brand-teal shadow-lg hover:shadow-brand-teal/10' 
                      : 'border-white/10 hover:border-brand-blue/50 hover:bg-[#0D1222]'
                  }`}
                >
                  {/* Card Top Banner Accent */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-blue via-brand-teal to-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 space-y-6">
                    
                    {/* Header: Photo + Name + Badge */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-teal/60 p-0.5 bg-[#05060A] shadow-lg shadow-brand-blue/20 group-hover:border-brand-teal group-hover:scale-105 transition-all relative">
                          <img 
                            src={getMemberImage(member)} 
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Always gracefully fall back to default image
                              (e.target as HTMLImageElement).src = member.image;
                            }}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#05060A] border border-brand-teal flex items-center justify-center text-brand-teal text-[10px] font-mono font-bold shadow-md">
                          0{member.order}
                        </div>
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <MemberIcon className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-teal font-semibold truncate">
                            {member.badge}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-brand-teal transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-xs text-gray-300 font-mono">
                          {member.displayRole}
                        </p>
                      </div>
                    </div>

                    {/* Tagline / Quote */}
                    <p className="text-xs text-gray-400 italic bg-white/[0.02] p-2.5 rounded-xl border border-white/5 line-clamp-2">
                      "{member.tagline}"
                    </p>

                    {/* Core Specialties */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-medium">
                        Core Discipline
                      </p>
                      <ul className="space-y-1.5 text-xs text-gray-300">
                        {member.specialties.slice(0, 3).map((spec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 shrink-0" />
                            <span className="line-clamp-1">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.techStack.slice(0, 4).map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-teal/60" />
                      <span>Council Member 0{member.order}</span>
                    </span>

                    <button
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-teal hover:text-white transition-colors ml-auto"
                    >
                      <span>Scope Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Interactive Department & Architecture Explorer */}
        <div className="rounded-3xl bg-[#0A0E1A] border border-white/10 p-6 md:p-10 shadow-2xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-teal uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Organizational Hierarchy & System Division</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Departmental Architecture & Execution Pillars
              </h3>
            </div>
            <p className="text-xs font-mono text-gray-400 max-w-md">
              Explore the exact technical deliverables, technology stacks, and operational scopes governed by each council member.
            </p>
          </div>

          {/* Member Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {TEAM_MEMBERS.map((m) => {
              const TabIcon = roleIcons[m.id] || Sparkles;
              const isActive = activeTabId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveTabId(m.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border shrink-0 ${
                    isActive 
                      ? 'bg-brand-teal/15 border-brand-teal text-white shadow-lg shadow-brand-teal/10' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-brand-teal/40">
                    <img 
                      src={getMemberImage(m)} 
                      alt="" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = m.image;
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-teal' : 'text-gray-400'}`} />
                  <span className="font-bold">0{m.order}: {m.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Detailed View */}
          <div className="grid lg:grid-cols-12 gap-8 items-start pt-2">
            
            {/* Left Column: Portrait & Snapshot */}
            <div className="lg:col-span-4 rounded-2xl bg-[#05060A] border border-white/10 p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-teal p-0.5 bg-[#0A0E1A] shrink-0">
                  <img 
                    src={getMemberImage(activeMember)} 
                    alt={activeMember.name} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = activeMember.image;
                    }}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-teal font-semibold">
                    Council Seat 0{activeMember.order}
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">{activeMember.name}</h4>
                  <p className="text-xs font-mono text-gray-400">{activeMember.displayRole}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Core Metrics & Ownership</span>
                <div className="grid grid-cols-1 gap-2">
                  {activeMember.stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs font-mono">
                      <span className="text-gray-400">{stat.label}</span>
                      <span className="text-brand-teal font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Execution Responsibilities & Arsenal */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <ActiveIcon className="w-4 h-4 text-brand-teal" />
                  <span>Strategic Mandate & Responsibilities</span>
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {activeMember.responsibilities.map((resp, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-teal" />
                  <span>Production Arsenal & Toolchain</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeMember.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-xl bg-brand-teal/10 border border-brand-teal/30 text-xs font-mono text-brand-teal"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0A0E1A] border border-white/20 p-6 md:p-8 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-brand-teal p-1 bg-[#05060A] shrink-0 shadow-2xl shadow-brand-blue/30 relative">
                    <img 
                      src={getMemberImage(selectedMember)} 
                      alt={selectedMember.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = selectedMember.image;
                      }}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-teal font-semibold">
                      Member 0{selectedMember.order} • {selectedMember.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{selectedMember.name}</h3>
                    <p className="text-sm font-mono text-brand-teal">{selectedMember.displayRole}</p>
                    <p className="text-xs text-gray-400 italic pt-1">"{selectedMember.tagline}"</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">Executive Bio</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedMember.bio}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">Key Specialties</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedMember.specialties.map((spec, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-gray-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">Technical Toolchain</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-xs font-mono text-brand-teal">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {selectedMember.linkedin && (
                      <a
                        href={selectedMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-[#0A66C2]/20 border border-[#0A66C2]/40 text-[#0A66C2] hover:text-white hover:bg-[#0A66C2] transition-all text-xs font-mono flex items-center gap-1.5"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>

                  <Link
                    to="/contact"
                    onClick={() => setSelectedMember(null)}
                    className="px-5 py-2.5 rounded-xl bg-brand-teal text-[#05060A] font-bold text-xs font-mono hover:bg-white transition-all shadow-lg shadow-brand-teal/20"
                  >
                    Connect with Leadership
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
