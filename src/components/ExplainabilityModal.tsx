import React from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, SparklesIcon, Database01Icon } from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

export const ExplainabilityModal: React.FC = () => {
  const { isExplainabilityModalOpen, setIsExplainabilityModalOpen } = useApp();

  if (!isExplainabilityModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,17,23,0.25)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-[480px] bg-bg border border-border rounded-2xl shadow-card-hover p-6 relative"
      >
        <button
          onClick={() => setIsExplainabilityModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border text-faint hover:text-text hover:bg-surface transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent-light border border-accent-mid flex items-center justify-center">
            <HugeiconsIcon icon={SparklesIcon} size={20} color="#00ABF0" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text">AI Reasoning Inspector</h3>
            <p className="text-xs text-muted">SHAP Feature Attribution & Knowledge Provenance</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Confidence Score', value: '99.4%', color: 'text-accent' },
            { label: 'Cosine Distance',  value: '0.942',  color: 'text-purple-600' },
            { label: 'Consensus Agents', value: '3 Nodes', color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-3 text-center">
              <p className={`text-lg font-black ${color}`}>{value}</p>
              <p className="text-2xs text-faint mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* SHAP weights */}
        <div className="space-y-2 mb-4">
          <p className="text-2xs font-semibold text-faint uppercase tracking-wider">Top Factor Attribution (SHAP)</p>
          {[
            { label: 'Academic Ordinance 2026 Clause 4.2', pct: 48, color: 'bg-accent' },
            { label: 'CS401 Attendance (88%)',             pct: 32, color: 'bg-purple-500' },
            { label: 'Hackathon Ticket Verification',      pct: 20, color: 'bg-green-500' },
          ].map(f => (
            <div key={f.label} className="card-surface p-3 rounded-xl">
              <div className="flex justify-between text-xs text-text mb-1.5">
                <span>{f.label}</span>
                <span className="font-mono font-bold text-accent">{f.pct}%</span>
              </div>
              <div className="progress-track h-1.5">
                <div className={`${f.color} h-full rounded-full`} style={{ width: `${f.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Citation */}
        <div className="p-3.5 rounded-xl bg-surface border border-border text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-accent font-semibold">
            <HugeiconsIcon icon={Database01Icon} size={13} color="#00ABF0" strokeWidth={1.5} />
            Verified Document Citation
          </div>
          <p className="text-muted italic leading-relaxed font-mono text-2xs">
            "Students representing the university in approved hackathons are eligible for duty leave up to 5 working days per semester."
          </p>
        </div>

        <button
          onClick={() => setIsExplainabilityModalOpen(false)}
          className="btn-ghost w-full mt-4 py-2.5"
        >
          Close Inspector
        </button>
      </motion.div>
    </div>
  );
};
