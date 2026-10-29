import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  WorkflowCircle01Icon, SparklesIcon, FlashIcon,
  CheckmarkCircle02Icon, Clock01Icon, Alert01Icon,
  Add01Icon, PlayIcon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const workflows = [
  {
    id: 'wf-1', name: 'Leave Auto-Approval Pipeline',
    description: 'Classify → RAG policy check → draft email → notify faculty',
    status: 'active', runs: 142, successRate: 98.6,
    steps: ['Input Classify', 'RAG Policy Check', 'Email Draft', 'Faculty Notify'],
    color: '#00ABF0',
  },
  {
    id: 'wf-2', name: 'ATS Resume Optimizer',
    description: 'Parse PDF → keyword gap analysis → rewrite → ATS score',
    status: 'active', runs: 87, successRate: 94.2,
    steps: ['PDF Parse', 'Keyword Gap', 'AI Rewrite', 'ATS Score'],
    color: '#7c3aed',
  },
  {
    id: 'wf-3', name: 'Event RSVP + QR Pass',
    description: 'Register → validate eligibility → generate QR → wallet export',
    status: 'paused', runs: 203, successRate: 99.8,
    steps: ['Register', 'Eligibility Check', 'QR Generate', 'Wallet Export'],
    color: '#22c55e',
  },
  {
    id: 'wf-4', name: 'Campus Alert Broadcast',
    description: 'Source event → classify priority → route channels → confirm delivery',
    status: 'error', runs: 56, successRate: 87.0,
    steps: ['Source Event', 'Priority Classify', 'Channel Route', 'Delivery Confirm'],
    color: '#ef4444',
  },
];

const statusBadge: Record<string, string> = {
  active: 'badge-green',
  paused: 'badge-amber',
  error:  'badge-red',
};
const statusDot: Record<string, string> = {
  active: 'bg-green-500',
  paused: 'bg-amber-400',
  error:  'bg-red-500 animate-pulse',
};

export const WorkflowsView: React.FC = () => {
  const { showToast } = useApp();
  const [selected, setSelected] = useState(workflows[0]);

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Workflow Automation</h2>
          <p className="section-subtitle">Visual pipeline builder and execution monitor for agentic tasks</p>
        </div>
        <button onClick={() => showToast('New workflow builder opened!')} className="btn-primary flex items-center gap-1.5 px-4 py-2">
          <HugeiconsIcon icon={Add01Icon} size={14} color="#fff" strokeWidth={2.5} />
          New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Workflow list */}
        <div className="space-y-3">
          {workflows.map(wf => (
            <div
              key={wf.id}
              onClick={() => setSelected(wf)}
              className={`card p-4 cursor-pointer transition-all ${selected.id === wf.id ? 'border-accent' : 'hover:border-border/70'} ${wf.status === 'error' ? 'border-red-200 bg-red-50/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <span className={`status-dot ${statusDot[wf.status]}`} />
                  <span className="text-xs font-semibold text-text">{wf.name}</span>
                </span>
                <span className={`badge ${statusBadge[wf.status]}`}>{wf.status}</span>
              </div>
              <p className="text-2xs text-muted leading-relaxed">{wf.description}</p>
              <div className="mt-3 flex items-center gap-3 text-2xs text-faint">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={FlashIcon} size={10} color="currentColor" strokeWidth={1.5} />
                  {wf.runs} runs
                </span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={10} color="#22c55e" strokeWidth={2} />
                  {wf.successRate}% success
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline visualizer */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: `${selected.color}18`, borderColor: `${selected.color}40` }}>
                <HugeiconsIcon icon={WorkflowCircle01Icon} size={18} color={selected.color} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-text">{selected.name}</p>
                <p className="text-2xs text-muted">{selected.runs} executions · {selected.successRate}% success</p>
              </div>
            </div>
            <button
              onClick={() => showToast(`Running: ${selected.name}`)}
              className="btn-primary flex items-center gap-1.5 px-4 py-1.5 text-xs"
            >
              <HugeiconsIcon icon={PlayIcon} size={13} color="#fff" strokeWidth={2} />
              Run Now
            </button>
          </div>

          {/* Pipeline steps */}
          <div className="flex items-center gap-0 overflow-x-auto pb-4">
            {selected.steps.map((step, idx) => (
              <React.Fragment key={step}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-2 min-w-[120px]"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 text-white font-bold text-sm shadow-card"
                    style={{ background: selected.color, borderColor: selected.color }}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-2xs font-semibold text-text text-center leading-tight px-1">{step}</p>
                  <div className={`w-2 h-2 rounded-full ${idx < selected.steps.length - 1 ? 'bg-green-400' : 'bg-faint'}`} />
                </motion.div>
                {idx < selected.steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-border min-w-[20px] mb-8" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            {[
              { label: 'Avg Exec Time', value: '2.4s',         icon: Clock01Icon },
              { label: 'Last Run',      value: '3 min ago',     icon: FlashIcon },
              { label: 'Status',        value: selected.status, icon: selected.status === 'error' ? Alert01Icon : CheckmarkCircle02Icon },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card-surface p-3 rounded-xl text-center">
                <HugeiconsIcon icon={icon} size={16} color={selected.color} strokeWidth={1.5} className="mx-auto mb-1" />
                <p className="text-xs font-bold text-text capitalize">{value}</p>
                <p className="text-2xs text-faint">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
