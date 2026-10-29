import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PartyIcon, Calendar03Icon, Location01Icon, QrCodeIcon,
  SparklesIcon, UserGroupIcon, ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { campusEvents } from '../data/mockData';
import { useApp } from '../context/AppContext';

const typeColor: Record<string, string> = {
  Hackathon:  'badge-blue',
  Workshop:   'badge-purple',
  Seminar:    'badge-green',
  Placement:  'badge-amber',
  Cultural:   'badge-red',
};

export const EventsView: React.FC = () => {
  const { setIsTicketModalOpen, setSelectedEvent, showToast } = useApp();

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Campus Events</h2>
          <p className="section-subtitle">AI-curated event feed · RSVP · QR Wallet Pass</p>
        </div>
        <button onClick={() => showToast('Event digest sent to email!')} className="btn-primary flex items-center gap-1.5 px-4 py-2">
          <HugeiconsIcon icon={SparklesIcon} size={14} color="#fff" strokeWidth={2} />
          AI Event Digest
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Events This Month', value: '14',  color: 'text-accent' },
          { label: 'RSVP\'d',            value: '3',   color: 'text-green-600' },
          { label: 'AI Recommended',    value: '6',   color: 'text-purple-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {campusEvents.map(ev => (
          <div key={ev.id} className="card hover:shadow-card-hover transition-all overflow-hidden">
            {/* Colored header band */}
            <div className="h-1.5 w-full" style={{ background: ev.color || '#00ABF0' }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${typeColor[ev.type] ?? 'badge-blue'}`}>{ev.type}</span>
                {ev.aiRecommended && (
                  <span className="badge badge-blue flex items-center gap-1">
                    <HugeiconsIcon icon={SparklesIcon} size={10} color="currentColor" strokeWidth={2} />
                    AI Pick
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-text leading-snug mb-1">{ev.title}</p>
              <p className="text-xs text-muted mb-4 leading-relaxed">{ev.description}</p>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-2xs text-faint">
                  <HugeiconsIcon icon={Calendar03Icon} size={12} color="#00ABF0" strokeWidth={1.5} />
                  <span>{ev.date} · {ev.time}</span>
                </div>
                <div className="flex items-center gap-2 text-2xs text-faint">
                  <HugeiconsIcon icon={Location01Icon} size={12} color="#7c3aed" strokeWidth={1.5} />
                  <span>{ev.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-2xs text-faint">
                  <HugeiconsIcon icon={UserGroupIcon} size={12} color="#22c55e" strokeWidth={1.5} />
                  <span>{ev.registrations}/{ev.capacity} registered</span>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="progress-track h-1 mb-4">
                <div className="progress-fill h-full" style={{ width: `${Math.round((ev.registrations / ev.capacity) * 100)}%`, background: ev.color || '#00ABF0' }} />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedEvent(ev); setIsTicketModalOpen(true); }}
                  className="btn-ghost flex-1 py-1.5 text-xs flex items-center justify-center gap-1"
                >
                  <HugeiconsIcon icon={QrCodeIcon} size={12} color="currentColor" strokeWidth={1.5} />
                  View Ticket
                </button>
                <button
                  onClick={() => showToast(`RSVP confirmed for ${ev.title}!`)}
                  className="btn-primary flex-1 py-1.5 text-xs flex items-center justify-center gap-1"
                >
                  <HugeiconsIcon icon={PartyIcon} size={12} color="#fff" strokeWidth={2} />
                  RSVP Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
