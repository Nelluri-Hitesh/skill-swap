import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CpuIcon, ActivityIcon, SparklesIcon, Alert01Icon,
  CheckmarkCircle02Icon, PauseIcon, Refresh01Icon,
  ArrowRight01Icon, FlashIcon,
} from '@hugeicons/core-free-icons';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip, AreaChart, Area, XAxis, YAxis,
} from 'recharts';

const agentsData = [
  { name: 'Academic',      status: 'active',   tasks: 8,  latency: 42,  accuracy: 98.4, success: 99, type: 'Educational AI',    color: '#00ABF0', load: 72 },
  { name: 'Placement',     status: 'active',   tasks: 12, latency: 67,  accuracy: 96.8, success: 98, type: 'Career Intelligence', color: '#7c3aed', load: 85 },
  { name: 'Events',        status: 'idle',     tasks: 2,  latency: 28,  accuracy: 99.1, success: 100,type: 'Schedule Manager',   color: '#22c55e', load: 18 },
  { name: 'Services',      status: 'active',   tasks: 5,  latency: 51,  accuracy: 97.6, success: 97, type: 'Campus Operations',  color: '#f59e0b', load: 54 },
  { name: 'RAG',           status: 'active',   tasks: 24, latency: 94,  accuracy: 99.7, success: 100,type: 'Knowledge Retrieval',color: '#ef4444', load: 91 },
  { name: 'Communication', status: 'active',   tasks: 7,  latency: 35,  accuracy: 98.2, success: 99, type: 'Messaging AI',       color: '#06b6d4', load: 63 },
  { name: 'Notifications', status: 'idle',     tasks: 1,  latency: 14,  accuracy: 99.9, success: 100,type: 'Alert System',       color: '#84cc16', load: 8  },
  { name: 'Orchestrator',  status: 'critical', tasks: 0,  latency: 120, accuracy: 94.0, success: 92, type: 'Workflow Planner',   color: '#f97316', load: 99 },
];

const statusColor: Record<string, string> = {
  active: 'badge-green',
  idle: 'badge-blue',
  critical: 'badge-red',
};

const statusDot: Record<string, string> = {
  active: 'bg-green-500',
  idle: 'bg-blue-400',
  critical: 'bg-red-500 animate-pulse',
};

const performanceSeries = [
  { time: '08:00', latency: 44, requests: 120 },
  { time: '09:00', latency: 62, requests: 210 },
  { time: '10:00', latency: 55, requests: 340 },
  { time: '11:00', latency: 71, requests: 480 },
  { time: '12:00', latency: 84, requests: 390 },
  { time: '13:00', latency: 49, requests: 260 },
  { time: 'Now',   latency: 94, requests: 520 },
];

const radarData = agentsData.map(a => ({ subject: a.name, A: a.accuracy }));

export const MultiAgentMonitorView: React.FC = () => {
  const [selected, setSelected] = useState(agentsData[0]);

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Multi-Agent Monitor</h2>
          <p className="section-subtitle">Real-time agent health across 8 autonomous modules</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot bg-green-500" />
          <span className="text-xs text-muted">7 Active · 1 Critical</span>
          <button className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 ml-2">
            <HugeiconsIcon icon={Refresh01Icon} size={13} color="currentColor" strokeWidth={2} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Agent Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agentsData.map(agent => (
          <div
            key={agent.name}
            onClick={() => setSelected(agent)}
            className={`card p-4 cursor-pointer transition-all ${selected.name === agent.name ? 'border-accent shadow-card-hover' : 'hover:border-border/80'} ${agent.status === 'critical' ? 'border-red-200 bg-red-50/30' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <span className={`status-dot ${statusDot[agent.status]}`} />
                <span className="text-xs font-semibold text-text">{agent.name}</span>
              </span>
              <span className={`badge ${statusColor[agent.status]}`}>{agent.status}</span>
            </div>
            <p className="text-2xs text-muted mb-3">{agent.type}</p>

            {/* Load bar */}
            <div className="flex items-center justify-between text-2xs text-faint mb-1">
              <span>Load</span>
              <span className="font-mono">{agent.load}%</span>
            </div>
            <div className="progress-track h-1.5 mb-3">
              <div
                className="progress-fill h-full"
                style={{ width: `${agent.load}%`, background: agent.load > 90 ? '#ef4444' : agent.color }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-2xs">
              <div className="card-surface p-2 rounded-lg text-center">
                <p className="font-mono font-bold text-text">{agent.latency}ms</p>
                <p className="text-faint">Latency</p>
              </div>
              <div className="card-surface p-2 rounded-lg text-center">
                <p className="font-mono font-bold text-text">{agent.tasks}</p>
                <p className="text-faint">Tasks</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Detail + Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Agent Detail */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: `${selected.color}18`, borderColor: `${selected.color}40` }}>
              <HugeiconsIcon icon={CpuIcon} size={20} color={selected.color} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-text">{selected.name} Agent</p>
              <p className="text-2xs text-muted">{selected.type}</p>
            </div>
          </div>

          {[
            { label: 'Accuracy', value: `${selected.accuracy}%` },
            { label: 'Success Rate', value: `${selected.success}%` },
            { label: 'Avg Latency', value: `${selected.latency}ms` },
            { label: 'Active Tasks', value: String(selected.tasks) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-xs">
              <span className="text-muted">{label}</span>
              <span className="font-semibold text-text font-mono">{value}</span>
            </div>
          ))}

          {selected.status === 'critical' && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700">
              <HugeiconsIcon icon={Alert01Icon} size={14} color="#dc2626" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
              <span>High queue saturation. Auto-scaling initiated by Orchestrator.</span>
            </div>
          )}
          {selected.status === 'active' && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-xs text-green-700">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color="#16a34a" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
              <span>Operating within SLA parameters. All checks passed.</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button className="btn-ghost flex-1 py-1.5 text-xs flex items-center justify-center gap-1">
              <HugeiconsIcon icon={PauseIcon} size={12} color="currentColor" strokeWidth={2} /> Pause
            </button>
            <button className="btn-primary flex-1 py-1.5 text-xs flex items-center justify-center gap-1">
              <HugeiconsIcon icon={FlashIcon} size={12} color="#fff" strokeWidth={2} /> Prioritize
            </button>
          </div>
        </div>

        {/* Latency Chart */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={ActivityIcon} size={14} color="#00ABF0" strokeWidth={1.5} />
            System Latency (ms) — Last 7h
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceSeries}>
                <defs>
                  <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ABF0" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#00ABF0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
                <Area type="monotone" dataKey="latency" stroke="#00ABF0" strokeWidth={2} fill="url(#latGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={14} color="#7c3aed" strokeWidth={1.5} />
            Agent Accuracy Radar
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e4e6eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#5c6370', fontSize: 10 }} />
                <Radar name="Accuracy" dataKey="A" stroke="#00ABF0" fill="#00ABF0" fillOpacity={0.12} strokeWidth={2} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
