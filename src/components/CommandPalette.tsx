import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  ArrowRight01Icon,
  AiChatIcon,
  GraduationCapIcon,
  Briefcase01Icon,
  BookOpenIcon,
  Mail01Icon,
  WorkflowCircle01Icon,
  SparklesIcon,
  Settings01Icon,
} from '@hugeicons/core-free-icons';

const commands = [
  { label: 'AI Assistant Studio',          tab: 'assistant',      icon: AiChatIcon,           cat: 'Navigation' },
  { label: 'Check Attendance Prediction',  tab: 'academic',       icon: GraduationCapIcon,    cat: 'Academic' },
  { label: 'Upload Resume (ATS Scan)',     tab: 'placement',      icon: Briefcase01Icon,      cat: 'Placement' },
  { label: 'Search Regulations (RAG)',     tab: 'knowledge',      icon: BookOpenIcon,         cat: 'Knowledge' },
  { label: 'Generate Leave Email Draft',   tab: 'communication',  icon: Mail01Icon,           cat: 'Communication' },
  { label: 'Multi-Agent Orchestrator',     tab: 'orchestrator',   icon: WorkflowCircle01Icon, cat: 'System' },
  { label: 'AI Explainability Inspector',  tab: 'explainability', icon: SparklesIcon,         cat: 'System' },
  { label: 'Settings',                    tab: 'settings',       icon: Settings01Icon,       cat: 'System' },
] as const;

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setIsCommandPaletteOpen(true); }
      if (e.key === 'Escape') setIsCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setIsCommandPaletteOpen]);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.cat.toLowerCase().includes(query.toLowerCase())
  );

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: 'rgba(15,17,23,0.25)', backdropFilter: 'blur(4px)' }}
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-[520px] bg-bg border border-border rounded-2xl shadow-card-hover overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={1.5} className="text-faint flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules or type a command…"
            className="flex-1 bg-transparent text-sm text-text placeholder-faint outline-none"
          />
          <kbd className="text-2xs text-faint bg-surface px-1.5 py-0.5 rounded border border-border font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-[320px] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-faint py-8">No results for "{query}"</p>
          ) : (
            filtered.map(({ label, tab, icon, cat }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as any); setIsCommandPaletteOpen(false); setQuery(''); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-surface2 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-light transition-colors">
                  <HugeiconsIcon icon={icon} size={15} color="currentColor" strokeWidth={1.5} className="text-muted group-hover:text-accent" />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-sm text-text group-hover:text-accent font-medium">{label}</p>
                  <p className="text-2xs text-faint">{cat}</p>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={1.5} className="text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-2xs text-faint">
          <span>↑↓ Navigate · ↵ Open</span>
          <span className="text-accent font-medium">AgentX Smart Campus</span>
        </div>
      </div>
    </div>
  );
};
