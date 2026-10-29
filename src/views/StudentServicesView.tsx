import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Building01Icon, SparklesIcon, CheckmarkCircle02Icon,
  Alert01Icon, FileEditIcon, Clock01Icon, ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const services = [
  {
    id: 'gate-pass',
    title: 'Gate Pass Request',
    description: 'AI drafts warden + HoD approval with reason classification.',
    icon: FileEditIcon,
    color: '#00a3e4ff',
    bg: 'bg-accent-light',
    border: 'border-accent-mid',
    status: 'Approved',
    statusClass: 'badge-green',
    time: '2 min auto-approval',
  },
  {
    id: 'hostel-complaint',
    title: 'Hostel Complaint',
    description: 'Smart complaint routing to the relevant department.',
    icon: Building01Icon,
    color: '#7c3aed',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    status: 'In Review',
    statusClass: 'badge-purple',
    time: 'Avg 4h resolution',
  },
  {
    id: 'medical',
    title: 'Medical / OD Leave',
    description: 'Upload certificate → AI classifies & routes to faculty.',
    icon: Alert01Icon,
    color: '#ef4444',
    bg: 'bg-red-50',
    border: 'border-red-100',
    status: 'Form Ready',
    statusClass: 'badge-amber',
    time: 'Same-day dispatch',
  },
  {
    id: 'library',
    title: 'Library Renewal',
    description: 'Auto-renew books via AI before due date with one click.',
    icon: SparklesIcon,
    color: '#22c55e',
    bg: 'bg-green-50',
    border: 'border-green-100',
    status: 'Auto-Renewed',
    statusClass: 'badge-green',
    time: 'Instant',
  },
];

const recentRequests = [
  { title: 'Gate Pass — Hackathon 2026', status: 'Approved', time: '2h ago', class: 'badge-green' },
  { title: 'Library Book Renewal',       status: 'Done',     time: '1d ago', class: 'badge-blue' },
  { title: 'Lab Booking — ML Lab B2',    status: 'Pending',  time: '3h ago', class: 'badge-amber' },
];

export const StudentServicesView: React.FC = () => {
  const { showToast } = useApp();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Student Services</h2>
          <p className="section-subtitle">AI-automated campus request center</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color="currentColor" strokeWidth={2} />
          <span className="font-medium">All systems online</span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {services.map(svc => (
          <div
            key={svc.id}
            className={`card p-5 cursor-pointer transition-all hover:shadow-card-hover ${active === svc.id ? 'border-accent' : ''}`}
            onClick={() => setActive(active === svc.id ? null : svc.id)}
          >
            <div className={`w-10 h-10 rounded-xl ${svc.bg} border ${svc.border} flex items-center justify-center mb-3`}>
              <HugeiconsIcon icon={svc.icon} size={20} color={svc.color} strokeWidth={1.5} />
            </div>
            <p className="text-xs font-bold text-text mb-1">{svc.title}</p>
            <p className="text-2xs text-muted leading-relaxed mb-3">{svc.description}</p>
            <div className="flex items-center justify-between">
              <span className={`badge ${svc.statusClass}`}>{svc.status}</span>
              <span className="text-2xs text-faint flex items-center gap-1">
                <HugeiconsIcon icon={Clock01Icon} size={10} color="currentColor" strokeWidth={1.5} />
                {svc.time}
              </span>
            </div>

            {active === svc.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-border"
              >
                <button
                  onClick={e => { e.stopPropagation(); showToast(`${svc.title} submitted via AI Agent!`); setActive(null); }}
                  className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  <HugeiconsIcon icon={SparklesIcon} size={13} color="#fff" strokeWidth={2} />
                  Submit with AI
                </button>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-text mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} size={14} color="#00ABF0" strokeWidth={1.5} />
          Recent Requests
        </h3>
        <div className="space-y-2">
          {recentRequests.map(req => (
            <div key={req.title} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
              <div>
                <p className="text-xs font-semibold text-text">{req.title}</p>
                <p className="text-2xs text-faint mt-0.5">{req.time}</p>
              </div>
              <span className={`badge ${req.class}`}>{req.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
