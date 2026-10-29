import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Analytics01Icon, BarChartIcon, SparklesIcon,
  TrendingUpDownIcon, UserGroupIcon, Activity01Icon,
  ArrowUp01Icon, ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { weeklyRequestsData, attendanceTrendData } from '../data/mockData';

const deptData = [
  { dept: 'CS', active: 1240 }, { dept: 'EC', active: 850 },
  { dept: 'ME', active: 620 },  { dept: 'CE', active: 440 },
  { dept: 'EE', active: 780 },
];

const agentUsage = [
  { name: 'Academic',      value: 34, color: '#00ABF0' },
  { name: 'Placement',     value: 24, color: '#7c3aed' },
  { name: 'Knowledge RAG', value: 19, color: '#22c55e' },
  { name: 'Communication', value: 12, color: '#f59e0b' },
  { name: 'Others',        value: 11, color: '#e4e6eb' },
];

export const AnalyticsView: React.FC = () => {
  const kpis = [
    { label: 'Total AI Requests', value: '34.6K', delta: '+18.4%', up: true, icon: Activity01Icon, color: 'text-accent' },
    { label: 'Avg Response Time', value: '84ms',  delta: '-12ms',   up: true, icon: TrendingUpDownIcon, color: 'text-green-600' },
    { label: 'Active Students',   value: '3,932', delta: '+210',    up: true, icon: UserGroupIcon, color: 'text-purple-600' },
    { label: 'Agent SLA',         value: '99.6%', delta: '+0.2%',   up: true, icon: SparklesIcon, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Analytics & Insights</h2>
          <p className="section-subtitle">Real-time campus AI utilisation metrics and trends</p>
        </div>
        <span className="badge badge-green flex items-center gap-1">
          <HugeiconsIcon icon={SparklesIcon} size={10} color="currentColor" strokeWidth={2} />
          Live data
        </span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, up, icon, color }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted">{label}</span>
              <HugeiconsIcon icon={icon} size={15} color="currentColor" strokeWidth={1.5} className={color} />
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className={`text-2xs mt-1 flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-500'}`}>
              <HugeiconsIcon icon={up ? ArrowUp01Icon : ArrowDown01Icon} size={11} color="currentColor" strokeWidth={2.5} />
              {delta} vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={BarChartIcon} size={14} color="#00ABF0" strokeWidth={1.5} />
            Weekly AI Request Volume
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRequestsData}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ABF0" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#00ABF0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
                <Area type="monotone" dataKey="requests" stroke="#00ABF0" strokeWidth={2} fill="url(#reqGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={Analytics01Icon} size={14} color="#7c3aed" strokeWidth={1.5} />
            Agent Usage Distribution
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={agentUsage} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {agentUsage.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} formatter={(v: number) => [`${v}%`, 'Usage']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={UserGroupIcon} size={14} color="#22c55e" strokeWidth={1.5} />
            Active Users by Department
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} barCategoryGap="35%">
                <XAxis dataKey="dept" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
                <Bar dataKey="active" fill="#00ABF0" radius={[5, 5, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={TrendingUpDownIcon} size={14} color="#f59e0b" strokeWidth={1.5} />
            Campus Attendance Trend
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData}>
                <defs>
                  <linearGradient id="attGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
                <Area type="monotone" dataKey="attendance" stroke="#f59e0b" strokeWidth={2} fill="url(#attGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
