import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Shield01Icon, SparklesIcon, UserGroupIcon,
  Database01Icon, Alert01Icon, CheckmarkCircle02Icon,
  LockIcon, ArrowRight01Icon, Refresh01Icon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const systemMetrics = [
  { label: 'API Gateway RPS', value: '2,840',  color: 'text-accent' },
  { label: 'DB Query p99',    value: '38ms',    color: 'text-green-600' },
  { label: 'Cache Hit Rate',  value: '99.1%',   color: 'text-purple-600' },
  { label: 'Error Rate',      value: '0.04%',   color: 'text-amber-600' },
];

const usageData = [
  { day: 'Mon', req: 4200 }, { day: 'Tue', req: 5100 },
  { day: 'Wed', req: 4800 }, { day: 'Thu', req: 6200 },
  { day: 'Fri', req: 5500 }, { day: 'Sat', req: 2800 },
  { day: 'Sun', req: 1900 },
];

const adminUsers = [
  { name: 'Dr. Alan Turing',    role: 'CS Faculty',      status: 'active',   last: '10 min ago' },
  { name: 'Prof. Ada Lovelace', role: 'Academic Admin',  status: 'active',   last: '32 min ago' },
  { name: 'John McCarthy',      role: 'IT Administrator',status: 'inactive', last: '2d ago' },
];

export const AdminView: React.FC = () => {
  const { showToast } = useApp();
  const [seeding, setSeeding] = useState(false);

  const handleReseed = () => {
    setSeeding(true);
    setTimeout(() => { setSeeding(false); showToast('Data re-seeded successfully!'); }, 1200);
  };

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Admin Control Panel</h2>
          <p className="section-subtitle">System health, user management, and platform configuration</p>
        </div>
        <button onClick={handleReseed} disabled={seeding} className="btn-ghost flex items-center gap-1.5 px-4 py-2 text-xs">
          <HugeiconsIcon icon={Refresh01Icon} size={13} color="currentColor" strokeWidth={2} className={seeding ? 'animate-spin' : ''} />
          {seeding ? 'Reseeding…' : 'Re-seed Data'}
        </button>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {systemMetrics.map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-muted mb-2">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Usage chart */}
        <div className="lg:col-span-2 card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={Database01Icon} size={14} color="#00ABF0" strokeWidth={1.5} />
            API Request Volume — Last 7 Days
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} barCategoryGap="35%">
                <XAxis dataKey="day" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
                <Bar dataKey="req" fill="#00ABF0" radius={[5, 5, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security panel */}
        <div className="card p-5 space-y-3">
          <h3 className="text-xs font-semibold text-text flex items-center gap-2">
            <HugeiconsIcon icon={Shield01Icon} size={14} color="#22c55e" strokeWidth={1.5} />
            Security Status
          </h3>
          {[
            { label: 'WAF Protection',       ok: true },
            { label: 'Data Encryption AES-256', ok: true },
            { label: 'RBAC Policies Active', ok: true },
            { label: 'GDPR Compliance',      ok: true },
            { label: 'Audit Logging',        ok: false },
          ].map(({ label, ok }) => (
            <div key={label} className="flex items-center justify-between text-xs py-1.5 border-b border-border last:border-0">
              <span className="text-muted">{label}</span>
              <div className={`flex items-center gap-1 ${ok ? 'text-green-600' : 'text-amber-600'}`}>
                <HugeiconsIcon icon={ok ? CheckmarkCircle02Icon : Alert01Icon} size={13} color="currentColor" strokeWidth={2} />
                <span className="font-medium">{ok ? 'OK' : 'Review'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-text mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={UserGroupIcon} size={14} color="#7c3aed" strokeWidth={1.5} />
          Admin Users
        </h3>
        <div className="space-y-2">
          {adminUsers.map(u => (
            <div key={u.name} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent-mid flex items-center justify-center text-xs font-bold text-accent">
                  {u.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">{u.name}</p>
                  <p className="text-2xs text-faint">{u.role} · Last: {u.last}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-blue'}`}>{u.status}</span>
                <button onClick={() => showToast(`Managing ${u.name}`)} className="btn-ghost p-1.5 text-2xs">
                  <HugeiconsIcon icon={LockIcon} size={13} color="currentColor" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
