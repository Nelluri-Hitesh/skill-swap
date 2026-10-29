import React from 'react';
import { useApp } from '../../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  AiChatIcon,
  CpuIcon,
  WorkflowCircle01Icon,
  GraduationCapIcon,
  Briefcase01Icon,
  PartyIcon,
  Building01Icon,
  BookOpenIcon,
  Mail01Icon,
  BellIcon,
  WorkflowSquare10Icon,
  AiBrain01Icon,
  Analytics01Icon,
  Shield01Icon,
  SparklesIcon,
  Settings01Icon,
  FlashIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

const sidebarItems = [
  { id: 'dashboard',      label: 'Dashboard',             icon: Home01Icon },
  { id: 'assistant',      label: 'AI Assistant',           icon: AiChatIcon,              badge: 'v4.5' },
  { id: 'multi-agent',    label: 'Multi-Agent Monitor',    icon: CpuIcon,                 badge: '8 Live', badgeColor: 'green' },
  { id: 'orchestrator',   label: 'Orchestrator',           icon: WorkflowCircle01Icon },
  { id: 'academic',       label: 'Academic',               icon: GraduationCapIcon },
  { id: 'placement',      label: 'Placement',              icon: Briefcase01Icon,         badge: '24', badgeColor: 'blue' },
  { id: 'events',         label: 'Events',                 icon: PartyIcon },
  { id: 'services',       label: 'Student Services',       icon: Building01Icon },
  { id: 'knowledge',      label: 'Knowledge Base (RAG)',   icon: BookOpenIcon },
  { id: 'communication',  label: 'Communication',          icon: Mail01Icon },
  { id: 'notifications',  label: 'Notifications',          icon: BellIcon,                badge: '2', badgeColor: 'red' },
  { id: 'workflows',      label: 'Workflows',              icon: WorkflowSquare10Icon },
  { id: 'memory',         label: 'Memory',                 icon: AiBrain01Icon },
  { id: 'analytics',      label: 'Analytics',              icon: Analytics01Icon },
  { id: 'admin',          label: 'Admin',                  icon: Shield01Icon },
  { id: 'explainability', label: 'AI Explainability',      icon: SparklesIcon },
  { id: 'settings',       label: 'Settings',               icon: Settings01Icon },
] as const;

const badgeClass: Record<string, string> = {
  blue:  'badge badge-blue',
  green: 'badge badge-green',
  red:   'badge badge-red',
};

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = useApp();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col bg-bg border-r border-border transition-all duration-200 ${
        sidebarCollapsed ? 'w-[60px]' : 'w-[220px]'
      }`}
    >
      {/* ── Logo ── */}
      <div className="h-[56px] flex items-center justify-between px-3 border-b border-border flex-shrink-0">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={FlashIcon} size={14} color="#fff" strokeWidth={2} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-text truncate leading-tight">AgentX AI</p>
              <p className="text-2xs text-faint leading-tight">Smart Campus OS</p>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="mx-auto w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <HugeiconsIcon icon={FlashIcon} size={14} color="#fff" strokeWidth={2} />
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed((p: boolean) => !p)}
          className="p-1 rounded-md text-faint hover:text-muted hover:bg-surface transition-colors flex-shrink-0"
        >
          <HugeiconsIcon
            icon={sidebarCollapsed ? ArrowRight01Icon : ArrowLeft01Icon}
            size={14}
            color="currentColor"
            strokeWidth={2}
          />
        </button>
      </div>

      {/* ── Nav items ── */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {sidebarItems.map(({ id, label, icon, badge, badgeColor }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              title={sidebarCollapsed ? label : undefined}
              className={`nav-item w-full px-2.5 py-2 ${isActive ? 'active' : ''}`}
            >
              <HugeiconsIcon
                icon={icon}
                size={16}
                color="currentColor"
                strokeWidth={isActive ? 2 : 1.5}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{label}</span>
                  {badge && (
                    <span className={badgeColor ? badgeClass[badgeColor] : 'badge badge-blue'}>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Status footer ── */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2 text-2xs text-faint">
            <span className="status-dot bg-green-500 flex-shrink-0" />
            <span>All 8 agents operational</span>
          </div>
          <div className="mt-1.5 progress-track h-1">
            <div className="progress-fill h-full w-[94%]" />
          </div>
          <p className="text-2xs text-faint mt-1 text-right font-mono">42ms avg</p>
        </div>
      )}
    </aside>
  );
};
