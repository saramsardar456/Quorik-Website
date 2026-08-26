import { useState } from 'react';
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
  CheckCircle2, 
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TEAM_MEMBERS, TeamMember } from '../../data/teamData';

const roleIcons: Record<string, any> = {
  'shehram-meellu': Code2,
  'm-r': Cpu,
  'a-k': Mic,
  'farhaj': Server,
  'd-c': Workflow
};

export function TeamShowcase({ isFullPage = false }: { isFullPage?: boolean }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>(TEAM_MEMBERS[0].id);

  const activeMember = TEAM_MEMBERS.find(m => m.id === activeTabId) || TEAM_MEMBERS[0];
  const ActiveIcon = roleIcons[activeMember.id] || Sparkles;

  return (
    <section id="team" className={`relative bg-[#05060A] text-white overflow-hidden ${isFullPage ? 'py-16 md:py-24' : 'py-24 md:py-32 border-t border-white/5'}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-mono tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quorik Leadership & Engineering Council</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Specialists Behind <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-teal to-cyan-400">
              Quorik Systems
            </span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Meet our executive leadership and specialized engineering team dedicated to delivering high-performance custom web applications and autonomous zero-latency AI voice architectures.
          </p>
        </div>

        {/* Featured Interactive Hero Banner for Founder & CEO */}
        <div className="mb-16">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0F1629]/90 to-[#0A0E1A]/90 border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Founder Image Portrait */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-brand-blue to-brand-teal rounded-full blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-brand-teal/60 p-1.5 bg-[#05060A] shadow-2xl">
                    <img 
                      src={TEAM_MEMBERS[0].image} 
                      alt={TEAM_MEMBERS[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 right-4 px-3 py-1 rounded-full bg-[#05060A] border border-brand-teal/40 text-brand-teal text-[11px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                    <span>Founder & CEO</span>
                  </div>
                </div>
              </div>

              {/* Founder Info & Mission Statement */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-brand-teal font-semibold bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
                      Member 01 • Executive Leadership
                    </span>
                    <span className="text-xs text-gray-400 font-mono">Quorik Systems LLC</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {TEAM_MEMBERS[0].name}
                  </h3>
                  <p className="text-brand-teal font-medium text-sm sm:text-base font-mono">
                    {TEAM_MEMBERS[0].displayRole}
                  </p>
                </div>

                <blockquote className="text-gray-300 text-base sm:text-lg leading-relaxed border-l-2 border-brand-teal pl-4 italic">
                  "{TEAM_MEMBERS[0].tagline}"
                </blockquote>

                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {TEAM_MEMBERS[0].bio}
                </p>

                {/* Specialties Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {TEAM_MEMBERS[0].specialties.map((spec, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                  {TEAM_MEMBERS[0].linkedin && (
                    <a
                      href={TEAM_MEMBERS[0].linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2]/15 border border-[#0A66C2]/40 text-sm font-mono text-gray-200 hover:text-white hover:bg-[#0A66C2]/25 transition-all group"
                    >
                      <Linkedin className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                      <span>LinkedIn Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedMember(TEAM_MEMBERS[0])}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-mono text-gray-300 hover:text-white transition-all"
                  >
                    <span>View Technical Scope</span>
                    <ChevronRight className="w-4 h-4 text-brand-teal" />
                  </button>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal text-[#05060A] font-bold text-sm font-mono hover:bg-white transition-all shadow-lg shadow-brand-teal/20 ml-auto"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Direct Consultation</span>
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
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-teal/60 p-0.5 bg-[#05060A] shadow-lg shadow-brand-blue/20 group-hover:border-brand-teal group-hover:scale-105 transition-all">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            referrerPolicy="no-referrer"
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
                          className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-400 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                      {member.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-brand-teal/10 text-[10px] font-mono text-brand-teal">
                          +{member.techStack.length - 4}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 py-3.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="text-xs font-mono text-brand-teal hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Scope</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#0A66C2] transition-colors"
                        aria-label={`${member.name} LinkedIn Profile`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        Quorik Core
                      </span>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Interactive Discipline Tab Explorer */}
        <div className="rounded-3xl bg-[#0A0E1A] border border-white/10 p-6 md:p-10 shadow-2xl">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-gray-400 mb-2 border border-white/5">
                <Layers className="w-3.5 h-3.5 text-brand-teal" />
                <span>Departmental Engineering Architecture</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Inspect Company Responsibilities & Workflows
              </h3>
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
              {TEAM_MEMBERS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTabId(m.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                    activeTabId === m.id
                      ? 'bg-brand-teal text-[#05060A] font-bold shadow-lg shadow-brand-teal/20'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>0{m.order}.</span>
                  <span>{m.name}</span>
                  <span className="text-[10px] opacity-75">({m.displayRole.split('/')[0].trim()})</span>
                </button>
              ))}
            </div>

            {/* Active Tab Content */}
            <div className="grid lg:grid-cols-12 gap-8 items-center pt-2">
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brand-teal p-1 bg-[#05060A] shadow-xl">
                  <img 
                    src={activeMember.image} 
                    alt={activeMember.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{activeMember.name}</h4>
                  <p className="text-sm font-mono text-brand-teal">{activeMember.displayRole}</p>
                  <p className="text-xs text-gray-400 mt-1">{activeMember.badge}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full pt-2">
                  {activeMember.stats.map((s, idx) => (
                    <div key={idx} className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-mono text-gray-400">{s.label}</p>
                      <p className="text-xs font-bold text-white font-mono mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-5">
                <div>
                  <h5 className="text-xs font-mono uppercase tracking-widest text-brand-teal font-semibold mb-2">
                    Scope of Governance & Deliverables
                  </h5>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {activeMember.bio}
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">
                    Core Responsibilities & Milestones
                  </h5>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {activeMember.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/5 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <h5 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">
                    Associated Technical Arsenal
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activeMember.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-xs font-mono text-brand-teal">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Quorik Standard Bottom Callout */}
        <div className="mt-16 text-center rounded-2xl bg-gradient-to-r from-brand-blue/20 via-brand-teal/10 to-brand-blue/20 border border-white/10 p-8 md:p-10 space-y-4">
          <h3 className="text-2xl font-bold text-white">
            Ready to deploy custom software with our dedicated team?
          </h3>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Schedule a 1-on-1 technical discovery call with Founder & CEO Shehram Meellu and the Quorik engineering leads.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-teal text-[#05060A] font-bold text-xs font-mono uppercase tracking-wider hover:bg-white hover:shadow-lg hover:shadow-brand-teal/30 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Executive Discovery Call</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[#0A0E1A] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-brand-teal p-1 bg-[#05060A] shrink-0 shadow-2xl shadow-brand-blue/30">
                    <img 
                      src={selectedMember.image} 
                      alt={selectedMember.name}
                      referrerPolicy="no-referrer"
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

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">
                    Executive Profile
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">
                    Key Specialties & Focus
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedMember.specialties.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 text-xs text-gray-200 border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 font-semibold">
                    Primary Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-teal/10 text-brand-teal border border-brand-teal/20 text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  {selectedMember.linkedin ? (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2]/15 border border-[#0A66C2]/40 text-xs font-mono text-gray-200 hover:text-white"
                    >
                      <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                      <span>Connect on LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-gray-400">
                      Quorik Systems Engineering Team
                    </span>
                  )}

                  <Link
                    to="/contact"
                    onClick={() => setSelectedMember(null)}
                    className="px-4 py-2 rounded-xl bg-brand-teal text-[#05060A] text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    Consult With Team
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
