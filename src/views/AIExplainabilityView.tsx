import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SparklesIcon, Database01Icon, CheckmarkCircle02Icon,
  Alert01Icon, ChartHistogramIcon, ArrowRight01Icon,
  FlashIcon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';

export const AIExplainabilityView: React.FC = () => {
  const { setIsExplainabilityModalOpen } = useApp();

  const factors = [
    { label: 'Academic Ordinance 2026 Clause 4.2', pct: 48, color: '#00ABF0' },
    { label: 'CS401 Attendance (88%)',              pct: 32, color: '#7c3aed' },
    { label: 'Hackathon Ticket Verification',       pct: 20, color: '#22c55e' },
  ];

  const decisions = [
    { title: 'Leave Application Approval',      score: 99.4, agents: ['Academic', 'RAG', 'Orchestrator'], verdict: 'Approved', ok: true },
    { title: 'Resume ATS Score Calculation',    score: 94.2, agents: ['Placement', 'Knowledge RAG'],      verdict: 'Score: 94%', ok: true },
    { title: 'Campus Alert Priority Override',  score: 72.1, agents: ['Notifications', 'Orchestrator'],   verdict: 'Escalated', ok: false },
  ];

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">AI Explainability</h2>
          <p className="section-subtitle">SHAP attribution, RAG provenance, and transparent agent reasoning</p>
        </div>
        <button onClick={() => setIsExplainabilityModalOpen(true)} className="btn-primary flex items-center gap-1.5 px-4 py-2">
          <HugeiconsIcon icon={SparklesIcon} size={14} color="#fff" strokeWidth={2} />
          Open Inspector
        </button>
      </div>

      {/* Latest Decision Audit */}
      <div className="card p-5 border-accent/20 bg-gradient-to-br from-white to-accent-light">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={SparklesIcon} size={15} color="#00ABF0" strokeWidth={1.5} />
          <p className="text-sm font-bold text-text">Latest Decision Audit</p>
          <span className="badge badge-blue ml-auto">99.4% Confidence</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Confidence Score', value: '99.4%', color: 'text-accent' },
            { label: 'Cosine Distance',  value: '0.942',  color: 'text-purple-600' },
            { label: 'Consensus Nodes',  value: '3/3',    color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-2xs text-faint mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* SHAP bars */}
        <div className="space-y-3">
          <p className="text-2xs font-semibold text-faint uppercase tracking-wider flex items-center gap-1.5">
            <HugeiconsIcon icon={ChartHistogramIcon} size={11} color="currentColor" strokeWidth={1.5} />
            SHAP Feature Attribution
          </p>
          {factors.map(f => (
            <div key={f.label} className="card-surface p-3 rounded-xl">
              <div className="flex justify-between text-xs text-text mb-2">
                <span>{f.label}</span>
                <span className="font-mono font-bold" style={{ color: f.color }}>{f.pct}%</span>
              </div>
              <div className="progress-track h-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, background: f.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Citation */}
        <div className="mt-4 p-3.5 rounded-xl bg-bg border border-border text-xs">
          <p className="text-accent font-semibold flex items-center gap-1.5 mb-1.5">
            <HugeiconsIcon icon={Database01Icon} size={13} color="#00ABF0" strokeWidth={1.5} />
            Verified Source Citation
          </p>
          <p className="text-muted italic leading-relaxed font-mono text-2xs">
            "Students representing the university in approved hackathons are eligible for duty leave up to 5 working days per semester." — Academic Ordinance 2026 · Clause 4.2
          </p>
        </div>
      </div>

      {/* Decision log */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-text mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={FlashIcon} size={14} color="#f59e0b" strokeWidth={1.5} />
          Recent AI Decisions
        </h3>
        <div className="space-y-3">
          {decisions.map(d => (
            <div key={d.title} className="card-surface p-4 rounded-xl flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${d.ok ? 'bg-green-50 border border-green-100' : 'bg-amber-50 border border-amber-100'}`}>
                  <HugeiconsIcon icon={d.ok ? CheckmarkCircle02Icon : Alert01Icon} size={16} color={d.ok ? '#22c55e' : '#d97706'} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">{d.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {d.agents.map(a => <span key={a} className="badge badge-blue">{a}</span>)}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-text">{d.verdict}</p>
                <p className="text-2xs text-muted font-mono">{d.score}%</p>
                <button onClick={() => setIsExplainabilityModalOpen(true)} className="text-2xs text-accent hover:underline mt-1 flex items-center gap-0.5 ml-auto">
                  Inspect <HugeiconsIcon icon={ArrowRight01Icon} size={10} color="currentColor" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
