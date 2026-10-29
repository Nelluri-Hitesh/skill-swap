import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Database, Cpu, CheckCircle2, GitBranch, Award, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExplainabilityView: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl glass-panel-glow border border-[#00E5FF]/40">
        <div>
          <div className="flex items-center space-x-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>XAI & Model Governance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">AI Explainability & Provenance</h1>
          <p className="text-xs text-slate-400 mt-1">
            SHAP Attribution • Knowledge Sources Trace • Reasoning Decision Trees • Confidence Breakdown
          </p>
        </div>

        <button
          onClick={() => showToast('Explainability Report Exported')}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-purple-400 font-semibold hover:border-purple-500"
        >
          Export Audit Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Attribution Confidence</div>
          <div className="text-2xl font-black text-[#00E5FF] mt-1">99.4%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">SHAP Values Converged</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Vector Cosine Distance</div>
          <div className="text-2xl font-black text-purple-400 mt-1">0.942</div>
          <div className="text-[10px] text-purple-400 mt-0.5">Dense Retrieval Match</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Consensus Agents</div>
          <div className="text-2xl font-black text-amber-400 mt-1">3 Swarm Nodes</div>
          <div className="text-[10px] text-amber-400 mt-0.5">Academic + RAG + Comm</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Hallucination Risk</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">0.00%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Citation Verified</div>
        </div>
      </div>

      {/* Deep-dive Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Feature Weights */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center">
            <Layers className="w-4 h-4 text-[#00E5FF] mr-2" /> Top Feature Attribution Weights (SHAP Values)
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { factor: 'Academic Ordinance 2026 Clause 4.2 (Duty Leave)', weight: '48%', color: 'bg-[#00E5FF]' },
              { factor: 'CS401 Current Attendance Metric (88%)', weight: '32%', color: 'bg-purple-500' },
              { factor: 'Agentic AI Hackathon 2026 Ticket Status', weight: '20%', color: 'bg-emerald-400' }
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{f.factor}</span>
                  <span className="font-mono text-[#00E5FF] font-bold">{f.weight}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`${f.color} h-full rounded-full`} style={{ width: f.weight }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Document Citation Trace */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center">
            <Database className="w-4 h-4 text-purple-400 mr-2" /> Exact Vector Document Provenance
          </h3>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-[#00E5FF]">Document Chunk #10492</div>
            <p className="text-slate-300 italic leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
              "Clause 4.2: Students participating in approved national hackathons, paper presentations, or university-sponsored competitions shall be granted Duty Leave for up to 5 academic working days per semester, provided their aggregate attendance remains at or above 75% post-exemption."
            </p>
            <div className="text-[10px] text-slate-500 font-mono pt-1">
              Source: 2026 Academic Ordinance & Grading Policy.pdf • Page 14 • Line 284
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
