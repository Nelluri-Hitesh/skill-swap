import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Mail01Icon, SparklesIcon, MailSend01Icon, UserIcon,
  ArrowRight01Icon, CheckmarkCircle02Icon, Refresh01Icon,
} from '@hugeicons/core-free-icons';
import { useApp } from '../context/AppContext';

const emailTemplates = [
  {
    id: 'leave',
    label: 'Leave Application',
    to: 'Dr. Alan Turing (CS401 Faculty)',
    subject: 'Duty Leave Request — Hackathon 2026',
    body: 'Respected Dr. Turing,\n\nI, Alex Mercer (Roll: 2023-CS-9420, B.Tech AI & CS, Semester VI), humbly request duty leave from [Date] to [Date] to represent our institution at the Inter-University Hackathon 2026 (IIT Bombay).\n\nMy current CS401 attendance is 88%, ensuring compliance with the 75% cutoff even after this absence, as per Academic Ordinance 2026 Clause 4.2.\n\nKindly approve and forward to HoD.\n\nThank you,\nAlex Mercer',
  },
  {
    id: 'placement',
    label: 'Placement Query',
    to: 'training.placement@university.edu',
    subject: 'Eligibility Query — OpenAI Placement Drive 2026',
    body: 'Dear Placement Cell,\n\nI, Alex Mercer (2023-CS-9420), would like to confirm my eligibility for the upcoming OpenAI Placement Drive 2026. My CGPA is 9.24 with no active backlogs.\n\nKindly guide me on any additional verification required.\n\nThank you,\nAlex Mercer',
  },
  {
    id: 'hostel',
    label: 'Hostel Complaint',
    to: 'hostel.warden@university.edu',
    subject: 'Wi-Fi Connectivity Issue — Hostel Block B, Room 204',
    body: 'Dear Warden,\n\nI, Alex Mercer (2023-CS-9420, Block B Room 204), would like to report persistent Wi-Fi connectivity issues since August 3rd, affecting my academic submissions and remote internship work.\n\nKindly escalate to IT Services for urgent resolution.\n\nThank you,\nAlex Mercer',
  },
];

export const CommunicationView: React.FC = () => {
  const { showToast } = useApp();
  const [activeTemplate, setActiveTemplate] = useState(emailTemplates[0]);
  const [body, setBody] = useState(emailTemplates[0].body);
  const [drafting, setDrafting] = useState(false);

  const selectTemplate = (tpl: typeof emailTemplates[0]) => {
    setActiveTemplate(tpl);
    setBody(tpl.body);
  };

  const aiImprove = () => {
    setDrafting(true);
    setTimeout(() => {
      setBody(prev => prev.replace('[Date]', 'August 15–17, 2026'));
      setDrafting(false);
      showToast('AI auto-filled dates and formal tone applied!');
    }, 900);
  };

  const sendEmail = () => showToast(`Email sent: "${activeTemplate.subject}"`);

  return (
    <div className="space-y-5 pb-12">
      <div>
        <h2 className="section-title">Communication Hub</h2>
        <p className="section-subtitle">AI-drafted emails, bulk announcements, and faculty messaging</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Template list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text mb-2">Email Templates</p>
          {emailTemplates.map(tpl => (
            <div
              key={tpl.id}
              onClick={() => selectTemplate(tpl)}
              className={`card p-4 cursor-pointer transition-all ${activeTemplate.id === tpl.id ? 'border-accent bg-accent-light' : 'hover:border-border/80'}`}
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} size={14} color={activeTemplate.id === tpl.id ? '#00ABF0' : '#a0a6b1'} strokeWidth={1.5} />
                <p className="text-xs font-semibold text-text">{tpl.label}</p>
              </div>
              <p className="text-2xs text-muted mt-1 truncate">To: {tpl.to}</p>
            </div>
          ))}

          {/* Recent sent */}
          <div className="card p-4 mt-4">
            <p className="text-xs font-semibold text-text mb-3 flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} color="#22c55e" strokeWidth={2} />
              Recently Sent
            </p>
            {['Leave approved — AI drafted in 4s', 'Placement confirmation sent', 'Library renewal auto-email'].map(item => (
              <div key={item} className="text-2xs text-muted py-1.5 border-b border-border last:border-0">{item}</div>
            ))}
          </div>
        </div>

        {/* Compose pane */}
        <div className="lg:col-span-2 card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} size={15} color="#00ABF0" strokeWidth={1.5} />
              AI Email Composer
            </h3>
            <button onClick={aiImprove} disabled={drafting} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
              <HugeiconsIcon icon={drafting ? Refresh01Icon : SparklesIcon} size={13} color="currentColor" strokeWidth={2} className={drafting ? 'animate-spin' : ''} />
              {drafting ? 'Improving…' : 'AI Improve'}
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {/* To */}
            <div>
              <label className="text-2xs text-faint font-semibold uppercase tracking-wider">To</label>
              <div className="input mt-1 px-3 py-2.5 flex items-center gap-2 text-xs text-text">
                <HugeiconsIcon icon={UserIcon} size={13} color="#a0a6b1" strokeWidth={1.5} />
                {activeTemplate.to}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-2xs text-faint font-semibold uppercase tracking-wider">Subject</label>
              <input
                defaultValue={activeTemplate.subject}
                className="input mt-1 w-full px-3 py-2.5 text-xs"
              />
            </div>

            {/* Body */}
            <div className="flex-1">
              <label className="text-2xs text-faint font-semibold uppercase tracking-wider">Body</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={12}
                className="input mt-1 w-full px-3 py-2.5 text-xs leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <p className="text-2xs text-faint flex items-center gap-1">
              <HugeiconsIcon icon={SparklesIcon} size={11} color="#00ABF0" strokeWidth={1.5} />
              AI drafted · Tone: Formal · RAG citations applied
            </p>
            <button onClick={sendEmail} className="btn-primary flex items-center gap-2 px-5 py-2.5">
              <HugeiconsIcon icon={MailSend01Icon} size={14} color="#fff" strokeWidth={2} />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
