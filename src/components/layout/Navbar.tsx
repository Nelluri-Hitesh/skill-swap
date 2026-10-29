import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Mic01Icon,
  Notification01Icon,
  Add01Icon,
  CommandIcon,
  ArrowDown01Icon,
  UserCircleIcon,
  SparklesIcon,
  Settings01Icon,
  Logout01Icon,
} from '@hugeicons/core-free-icons';

export const Navbar: React.FC = () => {
  const {
    sidebarCollapsed, setIsCommandPaletteOpen, setIsVoiceModalOpen,
    unreadCount, notifications, markAllNotificationsRead,
    showToast, setActiveTab
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-[56px] bg-bg border-b border-border flex items-center px-5 gap-3 transition-all duration-200 ${
        sidebarCollapsed ? 'left-[60px]' : 'left-[220px]'
      }`}
    >
      {/* ── Search trigger ── */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-faint hover:border-accent/40 hover:text-muted transition-all flex-1 max-w-[400px] text-left"
      >
        <HugeiconsIcon icon={Search01Icon} size={14} color="currentColor" strokeWidth={1.5} />
        <span className="flex-1 text-xs">Search or ask anything…</span>
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface2 text-faint text-2xs font-mono border border-border">
          <HugeiconsIcon icon={CommandIcon} size={10} color="currentColor" strokeWidth={1.5} />
          K
        </span>
      </button>

      {/* ── Voice btn ── */}
      <button
        onClick={() => setIsVoiceModalOpen(true)}
        className="relative p-2 rounded-lg border border-border bg-bg text-muted hover:border-accent hover:text-accent hover:bg-accent-light transition-all"
        title="Voice search"
      >
        <HugeiconsIcon icon={Mic01Icon} size={15} color="currentColor" strokeWidth={1.5} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
      </button>

      <div className="flex-1" />

      {/* ── Quick action ── */}
      <button
        onClick={() => { setActiveTab('assistant'); showToast('AI Assistant opened'); }}
        className="btn-primary flex items-center gap-1.5 px-3.5 py-1.5"
      >
        <HugeiconsIcon icon={Add01Icon} size={14} color="#fff" strokeWidth={2.5} />
        <span>Ask AI</span>
      </button>

      {/* ── Notifications ── */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
          className="relative p-2 rounded-lg border border-border bg-bg text-muted hover:text-text hover:bg-surface transition-all"
        >
          <HugeiconsIcon icon={Notification01Icon} size={15} color="currentColor" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-2xs flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] bg-bg border border-border rounded-xl shadow-card-hover z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-text">Notifications</span>
              <button onClick={markAllNotificationsRead} className="text-xs text-accent hover:underline">Mark all read</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-border last:border-0 ${n.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-text leading-snug">{n.title}</p>
                    <span className="text-2xs text-faint whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  <p className="text-2xs text-muted mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setActiveTab('notifications'); setShowNotifs(false); }}
              className="w-full py-2.5 text-xs text-accent font-medium hover:bg-accent-light transition-colors border-t border-border"
            >
              View all notifications →
            </button>
          </div>
        )}
      </div>

      {/* ── Avatar ── */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
          className="flex items-center gap-2 p-1 pr-2.5 rounded-lg border border-border bg-bg hover:bg-surface transition-all"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
            alt="Alex"
            className="w-7 h-7 rounded-md object-cover"
          />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-text leading-tight">Alex Mercer</p>
            <p className="text-2xs text-faint">B.Tech AI · Senior</p>
          </div>
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} color="currentColor" strokeWidth={2} />
        </button>

        {showProfile && (
          <div className="absolute right-0 top-[calc(100%+8px)] w-[180px] bg-bg border border-border rounded-xl shadow-card-hover z-50 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-xs font-bold text-text">Alex Mercer</p>
              <p className="text-2xs text-accent">2023-CS-9420</p>
            </div>
            {[
              { label: 'Profile Settings', icon: Settings01Icon, tab: 'settings' },
              { label: 'AI Memory',         icon: SparklesIcon,    tab: 'memory' },
            ].map(({ label, icon, tab }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as any); setShowProfile(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-muted hover:bg-surface hover:text-text transition-colors"
              >
                <HugeiconsIcon icon={icon} size={14} color="currentColor" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
