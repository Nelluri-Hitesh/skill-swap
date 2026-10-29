import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Notification01Icon, SparklesIcon, CheckmarkCircle02Icon,
  Alert01Icon, InformationCircleIcon, BellOffIcon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';

const typeIcon = {
  alert:   { icon: Alert01Icon,               color: '#ef4444', bg: 'bg-red-50',   border: 'border-red-100' },
  success: { icon: CheckmarkCircle02Icon,      color: '#22c55e', bg: 'bg-green-50', border: 'border-green-100' },
  info:    { icon: InformationCircleIcon,      color: '#00ABF0', bg: 'bg-accent-light', border: 'border-accent-mid' },
  ai:      { icon: SparklesIcon,              color: '#7c3aed', bg: 'bg-purple-50', border: 'border-purple-100' },
};

export const NotificationsView: React.FC = () => {
  const { notifications, markAllNotificationsRead, showToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayed = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Notifications</h2>
          <p className="section-subtitle">AI-triaged alerts and campus updates</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'unread'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-accent text-white' : 'btn-ghost'}`}
            >
              {f}
            </button>
          ))}
          <button onClick={markAllNotificationsRead} className="btn-ghost px-3 py-1.5 text-xs ml-1">
            Mark all read
          </button>
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface2 border border-border flex items-center justify-center mb-4">
            <HugeiconsIcon icon={BellOffIcon} size={26} color="#a0a6b1" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-text">You're all caught up!</p>
          <p className="text-xs text-muted mt-1">No unread notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(n => {
            const type = (n.type as keyof typeof typeIcon) || 'info';
            const { icon, color, bg, border } = typeIcon[type] ?? typeIcon.info;
            return (
              <div
                key={n.id}
                className={`card p-4 flex items-start gap-4 transition-all ${!n.read ? 'border-accent/30 bg-accent-light/20' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                  <HugeiconsIcon icon={icon} size={17} color={color} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-semibold text-text leading-snug">{n.title}</p>
                    <span className="text-2xs text-faint whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  <p className="text-2xs text-muted mt-1 leading-relaxed">{n.message}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
