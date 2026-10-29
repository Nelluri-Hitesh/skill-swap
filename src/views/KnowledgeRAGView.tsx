import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BookOpenIcon, Search01Icon, SparklesIcon,
  Database01Icon, ArrowRight01Icon, CheckmarkCircle02Icon,
  UploadIcon, FileEditIcon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';

const documents = [
  { id: 'doc-1', title: 'Academic Ordinance 2026',       chunks: 142, updated: 'Mar 2026', category: 'Academic', score: 99.4 },
  { id: 'doc-2', title: 'Placement Process Handbook',    chunks: 89,  updated: 'Feb 2026', category: 'Placement', score: 97.8 },
  { id: 'doc-3', title: 'Hostel Rules & Regulations',    chunks: 63,  updated: 'Jan 2026', category: 'Hostel',   score: 98.1 },
  { id: 'doc-4', title: 'CS Curriculum 2023–27',         chunks: 214, updated: 'Jul 2025', category: 'Academic', score: 96.5 },
  { id: 'doc-5', title: 'Campus Grievance Policy',       chunks: 45,  updated: 'Dec 2025', category: 'Admin',    score: 95.0 },
];

const catColor: Record<string, string> = {
  Academic: 'badge-blue',
  Placement: 'badge-purple',
  Hostel: 'badge-amber',
  Admin: 'badge-green',
};

export const KnowledgeRAGView: React.FC = () => {
  const { showToast, setActiveTab, setActiveAssistantQuery } = useApp();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [ragResult, setRagResult] = useState<null | { text: string; citation: string; doc: string }>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setRagResult(null);
    setTimeout(() => {
      setRagResult({
        text: 'Students participating in approved inter-college hackathons representing the institution are eligible for **Duty Leave** (Clause 4.2) for up to 5 working days per semester. Attendance recorded as \'P\' for duty-leave days. Supporting documents required: organizer letter + faculty HoD approval.',
        citation: 'Academic Ordinance 2026 · Clause 4.2 · Page 18',
        doc: 'Academic Ordinance 2026',
      });
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Knowledge Base (RAG)</h2>
          <p className="section-subtitle">Semantic search over campus documents via retrieval-augmented generation</p>
        </div>
        <button onClick={() => showToast('Document uploaded to RAG corpus!')} className="btn-primary flex items-center gap-1.5 px-4 py-2">
          <HugeiconsIcon icon={UploadIcon} size={14} color="#fff" strokeWidth={2} />
          Upload Document
        </button>
      </div>

      {/* Search */}
      <div className="card p-5 border-accent/20 bg-gradient-to-br from-white to-accent-light">
        <p className="text-xs font-semibold text-accent mb-3 flex items-center gap-1.5">
          <HugeiconsIcon icon={SparklesIcon} size={13} color="currentColor" strokeWidth={1.5} />
          AgentX RAG Semantic Search
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2.5 focus-within:border-accent transition-all">
            <HugeiconsIcon icon={Search01Icon} size={14} color="#a0a6b1" strokeWidth={1.5} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. 'Can I attend hackathon without losing attendance?'"
              className="flex-1 bg-transparent text-sm text-text placeholder-faint outline-none"
            />
          </div>
          <button onClick={handleSearch} disabled={searching} className="btn-primary px-5 py-2.5 disabled:opacity-60">
            {searching ? 'Searching…' : 'Ask RAG'}
          </button>
        </div>

        {/* Result */}
        {ragResult && (
          <div className="mt-4 card border-accent/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} color="#22c55e" strokeWidth={2} />
              <span className="text-xs font-semibold text-green-700">RAG Answer (Confidence 99.4%)</span>
            </div>
            <p className="text-sm text-text leading-relaxed">{ragResult.text}</p>
            <div className="flex items-center justify-between pt-2 border-t border-border text-2xs">
              <span className="text-faint flex items-center gap-1">
                <HugeiconsIcon icon={FileEditIcon} size={11} color="#00ABF0" strokeWidth={1.5} />
                {ragResult.citation}
              </span>
              <button
                onClick={() => { setActiveAssistantQuery(query); setActiveTab('assistant'); }}
                className="text-accent font-medium hover:underline flex items-center gap-1"
              >
                Expand in AI Chat <HugeiconsIcon icon={ArrowRight01Icon} size={12} color="currentColor" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-text mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={Database01Icon} size={14} color="#7c3aed" strokeWidth={1.5} />
          Indexed Document Corpus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map(doc => (
            <div key={doc.id} className="card-surface p-4 rounded-xl flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-light border border-accent-mid flex items-center justify-center flex-shrink-0">
                  <HugeiconsIcon icon={BookOpenIcon} size={15} color="#00ABF0" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">{doc.title}</p>
                  <p className="text-2xs text-faint mt-0.5">{doc.chunks} chunks · Updated {doc.updated}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`badge ${catColor[doc.category]}`}>{doc.category}</span>
                    <span className="text-2xs text-muted">Score: {doc.score}%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setQuery(`Search in ${doc.title}`); handleSearch(); }}
                className="text-2xs text-accent hover:underline whitespace-nowrap flex items-center gap-0.5"
              >
                Search <HugeiconsIcon icon={ArrowRight01Icon} size={11} color="currentColor" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
