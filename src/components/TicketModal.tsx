import React from 'react';
import { useApp } from '../context/AppContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, QrCodeIcon, Calendar03Icon, Location01Icon, Download01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';

export const TicketModal: React.FC = () => {
  const { isTicketModalOpen, setIsTicketModalOpen, selectedEvent, showToast } = useApp();

  if (!isTicketModalOpen || !selectedEvent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,17,23,0.25)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-[360px] bg-bg border border-border rounded-2xl shadow-card-hover p-6 text-center relative"
      >
        <button
          onClick={() => setIsTicketModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border text-faint hover:text-text hover:bg-surface transition-all"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" strokeWidth={2} />
        </button>

        <span className="badge badge-green inline-flex items-center gap-1 mb-3">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} color="currentColor" strokeWidth={2} />
          Confirmed RSVP
        </span>

        <h3 className="text-base font-bold text-text">{selectedEvent.title}</h3>
        <p className="text-xs text-accent font-semibold mt-0.5">{selectedEvent.type} Pass</p>

        {/* QR Code */}
        <div className="my-5 inline-block p-4 bg-white border-2 border-accent rounded-xl shadow-card">
          <div className="w-36 h-36 bg-surface2 flex items-center justify-center rounded-lg">
            <HugeiconsIcon icon={QrCodeIcon} size={96} color="#00ABF0" strokeWidth={1} />
          </div>
          <p className="text-2xs font-mono text-faint mt-2">{selectedEvent.qrCodeId}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-left bg-surface border border-border p-3 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-muted">
            <HugeiconsIcon icon={Calendar03Icon} size={13} color="#00ABF0" strokeWidth={1.5} />
            <span>{selectedEvent.date} · {selectedEvent.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <HugeiconsIcon icon={Location01Icon} size={13} color="#7c3aed" strokeWidth={1.5} />
            <span>{selectedEvent.venue}</span>
          </div>
          <p className="text-2xs text-faint pt-1 border-t border-border font-mono">Attendee: Alex Mercer (2023-CS-9420)</p>
        </div>

        <button
          onClick={() => { showToast('Pass saved to Wallet'); setIsTicketModalOpen(false); }}
          className="btn-primary w-full mt-4 py-2.5 flex items-center justify-center gap-2"
        >
          <HugeiconsIcon icon={Download01Icon} size={15} color="#fff" strokeWidth={2} />
          Download Wallet Pass
        </button>
      </motion.div>
    </div>
  );
};
