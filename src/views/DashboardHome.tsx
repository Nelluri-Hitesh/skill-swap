import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SparklesIcon, Mic01Icon, MailSend01Icon, Calendar03Icon,
  Clock01Icon, Briefcase01Icon, BookOpenIcon, Building01Icon,
  Notification01Icon, TrendingUpDownIcon, CheckmarkCircle02Icon,
  Activity01Icon, ArrowRight01Icon, FlashIcon, UserIcon,
} from '@hugeicons/core-free-icons';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  campusEvents, placementCompanies,
  attendanceTrendData, weeklyRequestsData,
} from '../data/mockData';
import { motion } from 'framer-motion';

export const DashboardHome: React.FC = () => {
  const { setActiveTab, setIsVoiceModalOpen, setIsTicketModalOpen, setSelectedEvent, setIsResumeModalOpen, showToast, setActiveAssistantQuery } = useApp();
  const [promptInput, setPromptInput] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;
    setActiveAssistantQuery(promptInput);
    setActiveTab('assistant');
  };

  const kpiCards = [
    { label: 'Attendance', value: '87.4%', sub: '+2.1% above cutoff', icon: UserIcon, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'CGPA',       value: '9.24',  sub: 'AI target: 9.40',   icon: FlashIcon, color: 'text-accent', bg: 'bg-accent-light', border: 'border-accent-mid' },
    { label: 'Drives Live',value: '24',    sub: '2 applications sent', icon: Briefcase01Icon, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Agent SLA',  value: '99.6%', sub: 'Avg 84ms response',  icon: Activity01Icon, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* ── AI Input Hero ── */}
      <div className="card p-6 border-accent/20 bg-gradient-to-br from-white to-accent-light">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-blue text-2xs">AgentX Campus Copilot Active</span>
        </div>
        <h1 className="text-2xl font-bold text-text mt-2">
          Welcome back, <span className="text-accent">Alex!</span>
        </h1>
        <p className="text-sm text-muted mt-1 mb-5">
          Your multi-agent network is actively monitoring academics, placements, and campus tasks.
        </p>

        <form onSubmit={handleSend} className="flex items-center gap-2 p-2 bg-bg border border-border rounded-xl shadow-card focus-within:border-accent transition-all">
          <HugeiconsIcon icon={SparklesIcon} size={16} color="#00ABF0" strokeWidth={1.5} className="ml-2 flex-shrink-0" />
          <input
            type="text"
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
            placeholder="Ask: 'Predict attendance', 'Scan resume for OpenAI', 'Apply gate pass'…"
            className="flex-1 bg-transparent text-sm text-text placeholder-faint outline-none py-1.5 px-1"
          />
          <button type="button" onClick={() => setIsVoiceModalOpen(true)} className="p-2 rounded-lg border border-border text-muted hover:text-accent hover:border-accent/50 transition-all">
            <HugeiconsIcon icon={Mic01Icon} size={15} color="currentColor" strokeWidth={1.5} />
          </button>
          <button type="submit" className="btn-primary flex items-center gap-1.5 px-4 py-2">
            Ask AI
            <HugeiconsIcon icon={MailSend01Icon} size={13} color="#fff" strokeWidth={2} />
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-2xs text-faint font-medium">Try:</span>
          {['Check CS401 Syllabus', 'OpenAI ATS Scan', 'Hostel Gate Pass', 'Hackathon QR Ticket'].map(s => (
            <button
              key={s}
              onClick={() => { setActiveAssistantQuery(s); setActiveTab('assistant'); }}
              className="text-2xs px-2.5 py-1 rounded-lg bg-bg border border-border text-muted hover:border-accent hover:text-accent transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, sub, icon, color, bg, border }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted">{label}</span>
              <span className={`w-7 h-7 rounded-lg ${bg} border ${border} flex items-center justify-center`}>
                <HugeiconsIcon icon={icon} size={14} color="currentColor" strokeWidth={1.5} className={color} />
              </span>
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-2xs text-faint mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2-col area */}
        <div className="lg:col-span-2 space-y-5">
          {/* Today's Schedule */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <HugeiconsIcon icon={Calendar03Icon} size={15} color="#00ABF0" strokeWidth={1.5} />
                Today's Schedule
              </h3>
              <button onClick={() => setActiveTab('academic')} className="text-xs text-accent hover:underline flex items-center gap-1">
                Full Timetable <HugeiconsIcon icon={ArrowRight01Icon} size={12} color="currentColor" strokeWidth={2} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { time: '10:00–11:30 AM', subject: 'Deep Learning & Neural Networks', venue: 'Lab A1', status: 'Now', statusColor: 'badge-blue' },
                { time: '01:30–03:00 PM', subject: 'Distributed Systems & Cloud',    venue: 'Hall CS-301', status: 'Next', statusColor: 'badge-green' },
                { time: '03:30–05:00 PM', subject: 'Natural Language Processing',    venue: 'Innovation Hub', status: 'Later', statusColor: '' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-text">{c.subject}</p>
                      {c.statusColor && <span className={`badge ${c.statusColor}`}>{c.status}</span>}
                    </div>
                    <p className="text-2xs text-faint mt-0.5 flex items-center gap-2">
                      <HugeiconsIcon icon={Clock01Icon} size={11} color="currentColor" strokeWidth={1.5} className="inline" />
                      {c.time} · {c.venue}
                    </p>
                  </div>
                  <button onClick={() => showToast(`Checked in for ${c.subject}`)} className="btn-ghost text-2xs px-2.5 py-1">
                    Check-in
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-text">Attendance Trend</p>
                <span className="badge badge-green text-2xs">75% cutoff</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrendData}>
                    <defs>
                      <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ABF0" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#00ABF0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} domain={[60, 100]} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
                    <Area type="monotone" dataKey="attendance" stroke="#00ABF0" strokeWidth={2} fill="url(#attGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-text">Weekly AI Requests</p>
                <span className="badge badge-blue text-2xs">34.6K total</span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRequestsData} barCategoryGap="35%">
                    <XAxis dataKey="day" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="requests" fill="#00ABF0" radius={[4, 4, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Placement Drives */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <HugeiconsIcon icon={Briefcase01Icon} size={15} color="#7c3aed" strokeWidth={1.5} />
                Featured Placement Drives
              </h3>
              <button onClick={() => setActiveTab('placement')} className="text-xs text-accent hover:underline">View All →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {placementCompanies.slice(0, 2).map(c => (
                <div key={c.id} className="card-surface p-4 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-text">{c.name}</p>
                      <p className="text-2xs text-muted mt-0.5">{c.role}</p>
                    </div>
                    <span className="badge badge-green text-2xs">{c.package}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-2xs text-faint">Deadline: {c.deadline}</span>
                    <button onClick={() => setIsResumeModalOpen(true)} className="btn-ghost text-2xs px-2.5 py-1">
                      ATS Scan & Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* AI Suggestions */}
          <div className="card p-4 border-accent/25">
            <h3 className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <HugeiconsIcon icon={SparklesIcon} size={13} color="#00ABF0" strokeWidth={1.5} />
              Proactive AI Suggestions
            </h3>
            <div className="space-y-2">
              {[
                { title: 'GPA Boost Opportunity', body: 'Submit CS401 optional assignment #3 — raises internal grade margin to 95%.' },
                { title: 'Hostel Night Pass',      body: 'Hackathon 2026 ticket found. Auto-generate warden leave request?' },
              ].map(({ title, body }) => (
                <div key={title} className="card-surface p-3 rounded-xl">
                  <p className="text-xs font-semibold text-text">{title}</p>
                  <p className="text-2xs text-muted mt-1 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Event */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <HugeiconsIcon icon={Calendar03Icon} size={14} color="#22c55e" strokeWidth={1.5} />
                Campus Events
              </h3>
              <button onClick={() => setActiveTab('events')} className="text-xs text-accent hover:underline">View All →</button>
            </div>
            {campusEvents.slice(0, 1).map(ev => (
              <div key={ev.id} className="card-surface p-3 rounded-xl">
                <p className="text-xs font-bold text-text">{ev.title}</p>
                <p className="text-2xs text-faint mt-0.5">{ev.date} · {ev.venue}</p>
                <button
                  onClick={() => { setSelectedEvent(ev); setIsTicketModalOpen(true); }}
                  className="btn-primary w-full mt-3 py-1.5 text-xs"
                >
                  View RSVP Ticket Pass
                </button>
              </div>
            ))}
          </div>

          {/* Campus Notices */}
          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <HugeiconsIcon icon={Notification01Icon} size={14} color="#f59e0b" strokeWidth={1.5} />
              Campus Notices
            </h3>
            <div className="card-surface p-3 rounded-xl">
              <p className="text-2xs font-semibold text-amber-600 flex items-center gap-1.5">
                <HugeiconsIcon icon={BookOpenIcon} size={11} color="#d97706" strokeWidth={2} />
                Library Book Due Tomorrow
              </p>
              <p className="text-2xs text-muted mt-1">"Quantum Computation" due tomorrow.</p>
              <button onClick={() => showToast('Book renewed for 14 days!')} className="text-2xs text-accent font-medium mt-1.5 hover:underline">
                Auto-Renew Now
              </button>
            </div>
            <div className="card-surface p-3 rounded-xl">
              <p className="text-2xs font-semibold text-red-600 flex items-center gap-1.5">
                <HugeiconsIcon icon={Building01Icon} size={11} color="#dc2626" strokeWidth={2} />
                Hostel Wi-Fi Maintenance
              </p>
              <p className="text-2xs text-muted mt-1">Block B router maintenance tonight 11 PM.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
