import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  GraduationCapIcon, Calendar03Icon, CheckmarkCircle02Icon,
  Alert01Icon, SparklesIcon, BookOpenIcon, ChartHistogramIcon,
  ArrowRight01Icon, FlashIcon,
} from '@hugeicons/core-free-icons';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { attendanceTrendData } from '../data/mockData';
import { useApp } from '../context/AppContext';

const subjects = [
  { code: 'CS401', name: 'Deep Learning & Neural Networks',    att: 88, grade: 'A+', credits: 4, prof: 'Dr. Yann LeCun', next: 'Assignment #5 — Transformer Arch.' },
  { code: 'CS402', name: 'Distributed Systems & Cloud',        att: 92, grade: 'A',  credits: 4, prof: 'Dr. Jeff Dean',  next: 'Lab: Kubernetes Orchestration' },
  { code: 'CS403', name: 'Natural Language Processing',        att: 79, grade: 'B+', credits: 3, prof: 'Dr. Emily Bender',next: 'Paper Review: RLHF Survey' },
  { code: 'CS404', name: 'Quantum Computing & Algorithms',     att: 95, grade: 'O',  credits: 4, prof: 'Dr. John Preskill',next: 'Midterm Revision — Shor\'s Algorithm' },
  { code: 'MA401', name: 'Advanced Statistics & Probability',  att: 83, grade: 'A',  credits: 3, prof: 'Dr. Terence Tao', next: 'Problem Set #7' },
];

const cgpaHistory = [
  { sem: 'S1', cgpa: 8.4 }, { sem: 'S2', cgpa: 8.8 },
  { sem: 'S3', cgpa: 9.1 }, { sem: 'S4', cgpa: 9.1 },
  { sem: 'S5', cgpa: 9.24 },{ sem: 'S6 (pred)', cgpa: 9.4 },
];

const gradeColor = (g: string) => {
  if (g === 'O') return 'badge-purple';
  if (g === 'A+') return 'badge-blue';
  if (g === 'A')  return 'badge-green';
  return 'badge-amber';
};

export const AcademicView: React.FC = () => {
  const { showToast } = useApp();
  const [activeSubject, setActiveSubject] = useState(subjects[0]);

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Academic Intelligence</h2>
          <p className="section-subtitle">AI-powered academic tracking, prediction & alerts</p>
        </div>
        <button onClick={() => showToast('Academic report generated!')} className="btn-primary flex items-center gap-1.5 px-4 py-2">
          <HugeiconsIcon icon={SparklesIcon} size={14} color="#fff" strokeWidth={2} />
          AI Generate Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall CGPA', value: '9.24', sub: 'Top 3% in department', color: 'text-accent', icon: FlashIcon },
          { label: 'Attendance',   value: '87.4%', sub: '12.4% above cutoff',  color: 'text-green-600', icon: CheckmarkCircle02Icon },
          { label: 'Credits Done', value: '108',   sub: '12 remaining',         color: 'text-purple-600', icon: GraduationCapIcon },
          { label: 'AI Risk Score',value: 'Low',   sub: '0 subjects at risk',   color: 'text-green-600', icon: SparklesIcon },
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

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={ChartHistogramIcon} size={14} color="#00ABF0" strokeWidth={1.5} />
            Attendance Trend — AI Projection
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ABF0" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#00ABF0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'Cutoff 75%', fill: '#ef4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="attendance" stroke="#00ABF0" strokeWidth={2} fill="url(#aGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={ChartHistogramIcon} size={14} color="#7c3aed" strokeWidth={1.5} />
            CGPA Progression & AI Prediction
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpaHistory} barCategoryGap="35%">
                <XAxis dataKey="sem" stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a6b1" fontSize={10} tickLine={false} axisLine={false} domain={[7.5, 10]} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e6eb', borderRadius: 10, fontSize: 11 }} />
                <Bar dataKey="cgpa" radius={[5, 5, 0, 0]}
                  fill="#7c3aed"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-xs font-semibold text-text mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={BookOpenIcon} size={14} color="#22c55e" strokeWidth={1.5} />
            Subject Tracker
          </h3>
          <div className="space-y-2">
            {subjects.map(sub => (
              <div
                key={sub.code}
                onClick={() => setActiveSubject(sub)}
                className={`card-surface p-4 rounded-xl cursor-pointer transition-all ${activeSubject.code === sub.code ? 'border-accent' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xs font-mono font-bold text-accent">{sub.code}</span>
                    <p className="text-xs font-semibold text-text">{sub.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${gradeColor(sub.grade)}`}>{sub.grade}</span>
                    <span className={`badge ${sub.att >= 85 ? 'badge-green' : sub.att >= 75 ? 'badge-amber' : 'badge-red'}`}>{sub.att}%</span>
                  </div>
                </div>
                <div className="mt-2.5 progress-track h-1">
                  <div className="progress-fill h-full" style={{ width: `${sub.att}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="text-xs font-semibold text-text flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={14} color="#00ABF0" strokeWidth={1.5} />
            {activeSubject.code} — AI Insights
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { label: 'Subject', value: activeSubject.name },
              { label: 'Professor', value: activeSubject.prof },
              { label: 'Credits', value: String(activeSubject.credits) },
              { label: 'Grade', value: activeSubject.grade },
              { label: 'Attendance', value: `${activeSubject.att}%` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-border pb-2.5 last:border-0 last:pb-0">
                <span className="text-muted">{label}</span>
                <span className="font-semibold text-text">{value}</span>
              </div>
            ))}
          </div>
          <div className="card-surface p-3 rounded-xl">
            <p className="text-2xs font-semibold text-accent mb-1 flex items-center gap-1">
              <HugeiconsIcon icon={Calendar03Icon} size={11} color="currentColor" strokeWidth={1.5} />
              Next Task
            </p>
            <p className="text-2xs text-muted">{activeSubject.next}</p>
          </div>
          {activeSubject.att < 80 && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 text-2xs text-amber-700">
              <HugeiconsIcon icon={Alert01Icon} size={13} color="#d97706" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
              <span>Attendance borderline. Attend next 4 lectures to raise above 85%.</span>
            </div>
          )}
          <button onClick={() => showToast('Study plan exported!')} className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5">
            <HugeiconsIcon icon={SparklesIcon} size={13} color="#fff" strokeWidth={2} />
            Generate AI Study Plan
          </button>
        </div>
      </div>
    </div>
  );
};
