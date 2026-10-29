import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Briefcase01Icon, SparklesIcon, Upload01Icon, CheckmarkCircle02Icon,
  Alert01Icon, TrendingUpDownIcon, Location01Icon, Calendar03Icon,
  ArrowRight01Icon, FlashIcon, StarIcon,
} from '@hugeicons/core-free-icons';
import { placementCompanies } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const PlacementView: React.FC = () => {
  const { setIsResumeModalOpen, showToast } = useApp();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'AI/ML', 'Cloud', 'Full Stack', 'Data Science'];
  const filtered = filter === 'All' ? placementCompanies : placementCompanies.filter(c => c.category === filter);

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Placement Intelligence</h2>
          <p className="section-subtitle">AI-powered job matching, ATS scoring, and application tracking</p>
        </div>
        <button onClick={() => setIsResumeModalOpen(true)} className="btn-primary flex items-center gap-1.5 px-4 py-2">
          <HugeiconsIcon icon={Upload01Icon} size={14} color="#fff" strokeWidth={2} />
          Upload Resume
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ATS Score',     value: '94/100', sub: 'Top 6% applicant pool', color: 'text-accent',    icon: FlashIcon },
          { label: 'Profile Match', value: '96%',    sub: '24 matching drives',    color: 'text-green-600', icon: CheckmarkCircle02Icon },
          { label: 'Applications',  value: '2 Sent', sub: 'OpenAI & Google DM',    color: 'text-purple-600',icon: Briefcase01Icon },
          { label: 'Offer Potential',value: 'High',  sub: 'AI prediction 82%',     color: 'text-amber-600', icon: TrendingUpDownIcon },
        ].map(({ label, value, sub, color, icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted">{label}</span>
              <HugeiconsIcon icon={icon} size={15} color="currentColor" strokeWidth={1.5} className={color} />
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-2xs text-faint mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === cat
                ? 'bg-accent text-white'
                : 'btn-ghost'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-faint">{filtered.length} drives found</span>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="card p-5 hover:shadow-card-hover transition-all">
            {/* Company header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-base font-bold text-accent">
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-text">{c.name}</p>
                  <p className="text-2xs text-muted">{c.role}</p>
                </div>
              </div>
              <span className="badge badge-green">{c.package}</span>
            </div>

            {/* Location & Deadline */}
            <div className="flex items-center gap-3 text-2xs text-faint mb-3">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Location01Icon} size={11} color="currentColor" strokeWidth={1.5} />
                {c.location}
              </span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Calendar03Icon} size={11} color="currentColor" strokeWidth={1.5} />
                {c.deadline}
              </span>
            </div>

            {/* ATS Score */}
            <div className="flex items-center justify-between text-2xs mb-1">
              <span className="text-muted">AI Match Score</span>
              <span className="font-mono font-bold text-accent">{c.atsScore}%</span>
            </div>
            <div className="progress-track h-1.5 mb-4">
              <div className="progress-fill h-full" style={{ width: `${c.atsScore}%` }} />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {c.skills.slice(0, 4).map((s: string) => (
                <span key={s} className="badge badge-blue">{s}</span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <button onClick={() => setIsResumeModalOpen(true)} className="btn-ghost flex-1 py-1.5 text-xs">
                ATS Scan
              </button>
              <button onClick={() => showToast(`Applied to ${c.name}!`)} className="btn-primary flex-1 py-1.5 text-xs flex items-center justify-center gap-1">
                <HugeiconsIcon icon={SparklesIcon} size={12} color="#fff" strokeWidth={2} />
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
