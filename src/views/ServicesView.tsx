import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  BookOpen,
  Bus,
  ShieldAlert,
  HeartPulse,
  HelpCircle,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ServicesView: React.FC = () => {
  const { showToast, setActiveTab, setActiveAssistantQuery } = useApp();
  const [activeTabSection, setActiveTabSection] = useState<'Hostel' | 'Library' | 'Transport' | 'Grievance'>('Hostel');

  const [gatePassReason, setGatePassReason] = useState('');
  const [gatePassDate, setGatePassDate] = useState('2026-08-10');

  const handleApplyPass = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Hostel Night Outing Pass #8493 submitted! Sent to Chief Warden for approval.');
    setGatePassReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-2xl glass-panel-glow border border-[#00E5FF]/40">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 animate-pulse" />
            <span>Smart Campus Services</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Student Services & Logistics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Hostel Gate Pass • Library Auto-Renewal • Live Bus GPS • Grievance Portal
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          {(['Hostel', 'Library', 'Transport', 'Grievance'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveTabSection(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTabSection === s ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {activeTabSection === 'Hostel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hostel Pass Request Form */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center">
              <Building2 className="w-4 h-4 text-amber-400 mr-2" /> Apply for Hostel Outing / Night Pass
            </h3>

            <form onSubmit={handleApplyPass} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Outing Date</label>
                <input
                  type="date"
                  value={gatePassDate}
                  onChange={(e) => setGatePassDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Purpose / Event Details</label>
                <textarea
                  rows={3}
                  value={gatePassReason}
                  onChange={(e) => setGatePassReason(e.target.value)}
                  placeholder="e.g. Attending Agentic AI Hackathon 2026 at Main Auditorium..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400 placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit AI Pass Request</span>
              </button>
            </form>
          </div>

          {/* Active Gate Passes History */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center">
              <Clock className="w-4 h-4 text-[#00E5FF] mr-2" /> Recent Gate Passes Status
            </h3>

            <div className="space-y-3">
              {[
                { id: '#8492', date: 'Aug 09, 2026', purpose: 'Hackathon 2026 Weekend Pass', status: 'APPROVED', warden: 'Chief Warden Dr. Sharma' },
                { id: '#8321', date: 'Jul 24, 2026', purpose: 'Medical Checkup Drive', status: 'APPROVED', warden: 'Chief Warden Dr. Sharma' }
              ].map((pass) => (
                <div key={pass.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-100">{pass.id}</span>
                      <span className="text-[10px] text-slate-400">• {pass.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{pass.purpose}</p>
                    <span className="text-[9px] text-slate-500 mt-1 block">Signed by {pass.warden}</span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    {pass.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTabSection === 'Library' && (
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-between">
            <span className="flex items-center"><BookOpen className="w-4 h-4 text-[#00E5FF] mr-2" /> Issued Books & Digital Reservation</span>
            <button onClick={() => showToast('Library catalog synced')} className="text-xs text-[#00E5FF]">Search E-Books →</button>
          </h3>

          <div className="space-y-3">
            {[
              { title: 'Quantum Computation and Quantum Information', author: 'Nielsen & Chuang', dueDate: 'Aug 08, 2026', status: 'DUE TOMORROW' },
              { title: 'Deep Learning', author: 'Ian Goodfellow', dueDate: 'Aug 20, 2026', status: 'ACTIVE' }
            ].map((b, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-xs text-slate-100">{b.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Author: {b.author} • Due: {b.dueDate}</div>
                </div>

                <button
                  onClick={() => showToast(`Extended ${b.title} due date by 14 days!`)}
                  className="px-3 py-1.5 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold border border-[#00E5FF]/30"
                >
                  Auto-Renew
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTabSection === 'Transport' && (
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center">
            <Bus className="w-4 h-4 text-purple-400 mr-2" /> Live Campus Shuttle GPS Tracker
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { route: 'Route A: Main Gate ↔ Innovation Hub', status: 'Arriving in 3 mins', speed: '24 km/h', busNo: 'BUS-04' },
              { route: 'Route B: Hostel Block B ↔ Tech Park', status: 'On Schedule (8 mins)', speed: '30 km/h', busNo: 'BUS-09' }
            ].map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-xs text-slate-100">{r.route}</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">{r.status}</div>
                <div className="text-[10px] text-slate-400 mt-1">{r.busNo} • Current Speed: {r.speed}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTabSection === 'Grievance' && (
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center justify-between">
            <span className="flex items-center"><ShieldAlert className="w-4 h-4 text-rose-400 mr-2" /> Student Grievance Ticketing Portal</span>
            <button onClick={() => showToast('New Grievance Ticket Created #GR-9420')} className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
              Submit Grievance
            </button>
          </h3>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-xs text-slate-100">Ticket #GR-8841: Hostel Block B Wi-Fi Packet Loss</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Assigned to IT Network Ops • Raised 2 days ago</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              RESOLVED
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
