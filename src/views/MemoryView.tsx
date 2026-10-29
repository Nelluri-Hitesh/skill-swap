import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AiBrain01Icon, SparklesIcon, Database01Icon,
  Clock01Icon, Add01Icon, Cancel01Icon, FlashIcon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';

const memories = [
  { id: 'm1', type: 'preference', content: 'Prefers concise, technical answers with code examples.', created: '2026-08-01', importance: 'high', icon: SparklesIcon, color: '#00ABF0' },
  { id: 'm2', type: 'academic',   content: 'CS401 attendance is 88%. Target: maintain above 85%.', created: '2026-08-03', importance: 'high', icon: AiBrain01Icon, color: '#7c3aed' },
  { id: 'm3', type: 'placement',  content: 'Interested in AI Systems and Distributed Training roles (OpenAI, DeepMind).', created: '2026-08-02', importance: 'medium', icon: Database01Icon, color: '#22c55e' },
  { id: 'm4', type: 'context',    content: 'Registered for Hackathon 2026. Gate pass approved.', created: '2026-08-06', importance: 'medium', icon: FlashIcon, color: '#f59e0b' },
  { id: 'm5', type: 'preference', content: 'Dark mode disabled. Prefers minimal, clean UI.', created: '2026-08-07', importance: 'low', icon: SparklesIcon, color: '#a0a6b1' },
];

const importanceBadge = { high: 'badge-red', medium: 'badge-amber', low: 'badge-blue' };

export const MemoryView: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">AI Memory</h2>
          <p className="section-subtitle">Persistent contextual memory for personalised multi-agent AI responses</p>
        </div>
        <button onClick={() => showToast('Memory flushed and re-indexed!')} className="btn-ghost flex items-center gap-1.5 px-4 py-2 text-xs">
          <HugeiconsIcon icon={Add01Icon} size={14} color="currentColor" strokeWidth={2} />
          Add Memory
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Memory Records', value: String(memories.length), color: 'text-accent' },
          { label: 'High Importance', value: String(memories.filter(m => m.importance === 'high').length), color: 'text-red-500' },
          { label: 'Vector Index Size', value: '1.2MB', color: 'text-purple-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Memory list */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-text mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={AiBrain01Icon} size={14} color="#00ABF0" strokeWidth={1.5} />
          Stored Memory Records
        </h3>
        <div className="space-y-3">
          {memories.map(m => (
            <div key={m.id} className="card-surface p-4 rounded-xl flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${m.color}18`, border: `1px solid ${m.color}40` }}
                >
                  <HugeiconsIcon icon={m.icon} size={15} color={m.color} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xs font-bold uppercase tracking-wider text-faint">{m.type}</span>
                    <span className={`badge ${importanceBadge[m.importance]}`}>{m.importance}</span>
                  </div>
                  <p className="text-xs text-text leading-relaxed">{m.content}</p>
                  <p className="text-2xs text-faint mt-1 flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} size={10} color="currentColor" strokeWidth={1.5} />
                    Stored {m.created}
                  </p>
                </div>
              </div>
              <button
                onClick={() => showToast('Memory record deleted')}
                className="p-1.5 rounded-lg border border-border text-faint hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex-shrink-0"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={13} color="currentColor" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info card */}
      <div className="card p-4 border-accent/20 bg-accent-light">
        <p className="text-xs font-semibold text-accent mb-1 flex items-center gap-1.5">
          <HugeiconsIcon icon={SparklesIcon} size={13} color="currentColor" strokeWidth={1.5} />
          How AgentX Memory Works
        </p>
        <p className="text-2xs text-muted leading-relaxed">
          Each AI response builds semantic memory using vector embeddings (FAISS index). High-importance records are surfaced first to every agent query, enabling personalised and context-aware answers across all 8 campus modules.
        </p>
      </div>
    </div>
  );
};
