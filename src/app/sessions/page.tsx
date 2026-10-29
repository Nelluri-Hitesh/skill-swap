"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Star,
  FileText,
  Plus,
  XCircle,
  CalendarBlank,
  VideoCamera,
  CheckCircle,
  ArrowSquareOut,
  User
} from "@phosphor-icons/react";
import { SwapSession } from "@/types";

const DEFAULT_INITIAL_SESSIONS: SwapSession[] = [
  {
    id: "sess_1",
    proposalId: "prop_1",
    hostId: "usr_current",
    participantId: "usr_sofia",
    skillTaughtByHost: "React & Next.js",
    skillTaughtByParticipant: "Figma UI/UX Design",
    scheduledAt: "This Friday at 3:00 PM EST",
    durationMinutes: 45,
    status: "upcoming",
    meetingLink: "https://meet.jit.si/skillswap-react-figma",
    notes: "Discuss auto-layout and responsive CSS breakpoints.",
    createdAt: new Date().toISOString(),
    host: {
      id: "usr_current",
      name: "Alex Mercer",
      username: "alexmercer",
      email: "alex@skillswap.dev",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      headline: "Full-Stack Dev & React Specialist",
      credits: 140,
      rating: "4.9",
      reviewCount: 18,
      isOnline: true,
      createdAt: new Date().toISOString(),
    },
    participant: {
      id: "usr_sofia",
      name: "Sofia Rodriguez",
      username: "sofia_design",
      email: "sofia@designstudio.io",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      headline: "Senior Product Designer @ DesignCo",
      credits: 180,
      rating: "5.0",
      reviewCount: 24,
      isOnline: true,
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: "sess_2",
    proposalId: "prop_2",
    hostId: "usr_kenji",
    participantId: "usr_current",
    skillTaughtByHost: "Python & AI Models",
    skillTaughtByParticipant: "TypeScript",
    scheduledAt: "Tomorrow at 6:00 PM EST",
    durationMinutes: 60,
    status: "upcoming",
    meetingLink: "https://meet.jit.si/skillswap-python-ts",
    notes: "Intro to PyTorch tensors and type definitions.",
    createdAt: new Date().toISOString(),
    host: {
      id: "usr_kenji",
      name: "Kenji Sato",
      username: "kenjisato",
      email: "kenji@aitech.jp",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      headline: "AI Engineer & PyTorch Enthusiast",
      credits: 210,
      rating: "4.9",
      reviewCount: 31,
      isOnline: true,
      createdAt: new Date().toISOString(),
    },
    participant: {
      id: "usr_current",
      name: "Alex Mercer",
      username: "alexmercer",
      email: "alex@skillswap.dev",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      headline: "Full-Stack Dev & React Specialist",
      credits: 140,
      rating: "4.9",
      reviewCount: 18,
      isOnline: true,
      createdAt: new Date().toISOString(),
    },
  },
];

const PEER_MAP: Record<string, any> = {
  sofia_design: {
    id: "usr_sofia",
    name: "Sofia Rodriguez",
    username: "sofia_design",
    email: "sofia@designstudio.io",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    headline: "Senior Product Designer @ DesignCo",
    credits: 180,
    rating: "5.0",
    reviewCount: 24,
    isOnline: true,
    createdAt: new Date().toISOString(),
  },
  kenjisato: {
    id: "usr_kenji",
    name: "Kenji Sato",
    username: "kenjisato",
    email: "kenji@aitech.jp",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    headline: "AI Engineer & PyTorch Enthusiast",
    credits: 210,
    rating: "4.9",
    reviewCount: 31,
    isOnline: true,
    createdAt: new Date().toISOString(),
  },
  elena_polyglot: {
    id: "usr_elena",
    name: "Elena Rostova",
    username: "elena_polyglot",
    email: "elena@polyglot.io",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    headline: "Polyglot Language Coach (Spanish/Italian)",
    credits: 160,
    rating: "5.0",
    reviewCount: 15,
    isOnline: true,
    createdAt: new Date().toISOString(),
  },
  marcus_growth: {
    id: "usr_marcus",
    name: "Marcus Vance",
    username: "marcus_growth",
    email: "marcus@saasgrowth.co",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    headline: "SaaS Growth Lead & SEO Strategist",
    credits: 130,
    rating: "4.8",
    reviewCount: 12,
    isOnline: false,
    createdAt: new Date().toISOString(),
  },
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SwapSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form state
  const [partnerUsername, setPartnerUsername] = useState("sofia_design");
  const [skillTaughtByHost, setSkillTaughtByHost] = useState("React & Next.js");
  const [skillTaughtByParticipant, setSkillTaughtByParticipant] = useState("Figma UI/UX Design");
  const [scheduledAt, setScheduledAt] = useState("This Friday at 3:00 PM EST");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState("Discuss auto-layout and responsive CSS breakpoints.");
  const [creating, setCreating] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions?userId=usr_current");
      const safeJson = async (r: Response) => {
        if (!r.ok || !r.headers.get("content-type")?.includes("application/json")) return {};
        return r.json().catch(() => ({}));
      };
      const data = await safeJson(res);

      if (data.sessions && data.sessions.length > 0) {
        setSessions(data.sessions);
        localStorage.setItem("skillswap_user_sessions", JSON.stringify(data.sessions));
      } else {
        const saved = localStorage.getItem("skillswap_user_sessions");
        if (saved) {
          try {
            setSessions(JSON.parse(saved));
          } catch {
            setSessions(DEFAULT_INITIAL_SESSIONS);
          }
        } else {
          setSessions(DEFAULT_INITIAL_SESSIONS);
        }
      }
    } catch (e) {
      console.error(e);
      const saved = localStorage.getItem("skillswap_user_sessions");
      if (saved) {
        try {
          setSessions(JSON.parse(saved));
        } catch {
          setSessions(DEFAULT_INITIAL_SESSIONS);
        }
      } else {
        setSessions(DEFAULT_INITIAL_SESSIONS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const saveToLocalCache = (newList: SwapSession[]) => {
    setSessions(newList);
    try {
      localStorage.setItem("skillswap_user_sessions", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: string, status: "completed" | "cancelled") => {
    const updated = sessions.map((s) => (s.id === id ? { ...s, status } : s));
    saveToLocalCache(updated);

    try {
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const partnerData = PEER_MAP[partnerUsername] || PEER_MAP.sofia_design;

    const newSession: SwapSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      proposalId: null,
      hostId: "usr_current",
      participantId: partnerData.id,
      skillTaughtByHost: skillTaughtByHost.trim(),
      skillTaughtByParticipant: skillTaughtByParticipant.trim(),
      scheduledAt: scheduledAt.trim(),
      durationMinutes: Number(durationMinutes),
      status: "upcoming",
      meetingLink: `https://meet.jit.si/skillswap-${Date.now().toString(36)}`,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      host: {
        id: "usr_current",
        name: "Alex Mercer",
        username: "alexmercer",
        email: "alex@skillswap.dev",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        headline: "Full-Stack Dev & React Specialist",
        credits: 140,
        rating: "4.9",
        reviewCount: 18,
        isOnline: true,
        createdAt: new Date().toISOString(),
      },
      participant: partnerData,
    };

    const updatedList = [newSession, ...sessions];
    saveToLocalCache(updatedList);
    setIsModalOpen(false);

    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId: "usr_current",
          participantId: partnerData.id,
          skillTaughtByHost: skillTaughtByHost.trim(),
          skillTaughtByParticipant: skillTaughtByParticipant.trim(),
          scheduledAt: scheduledAt.trim(),
          durationMinutes: Number(durationMinutes),
          notes: notes.trim(),
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter === "all") return true;
    return s.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200">
              <CalendarBlank className="w-4 h-4 text-zinc-600" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Swap Sessions & Calendar</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your booked 1-on-1 skill exchanges, join video rooms, and log completed sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl text-xs shadow-xs">
            {["all", "upcoming", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition-all ${
                  statusFilter === st
                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/25"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-zinc-900/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-white border border-slate-200" />
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-md">
          <CalendarBlank className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No sessions in this view</h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Book a swap session with any peer through AI matches or the discover page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSessions.map((s) => {
            const isHost = s.hostId === "usr_current";
            const peer = isHost ? s.participant : s.host;

            return (
              <div
                key={s.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-zinc-400 transition-all flex flex-col justify-between space-y-4 shadow-md group"
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {s.scheduledAt}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        s.status === "completed"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : s.status === "cancelled"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  {/* Partner bar */}
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${peer?.username || "peer"}`}>
                      <img
                        src={peer?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                        alt={peer?.name || "Peer"}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white hover:ring-cyan-500 transition-all"
                      />
                    </Link>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/profile/${peer?.username || "peer"}`}
                          className="font-extrabold text-slate-900 text-sm hover:text-zinc-600 transition-colors"
                        >
                          {peer?.name}
                        </Link>
                        <span className="text-xs text-slate-500 font-medium">@{peer?.username}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{s.durationMinutes} Minutes Peer Session</p>
                    </div>
                  </div>

                  {/* Exchange content */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Host teaches:</span>
                      <span className="font-bold text-emerald-700">{s.skillTaughtByHost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Participant teaches:</span>
                      <span className="font-bold text-purple-700">{s.skillTaughtByParticipant}</span>
                    </div>
                  </div>

                  {s.notes && (
                    <p className="text-xs text-slate-600 italic bg-slate-100/70 p-3 rounded-xl border border-slate-200 font-medium flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{s.notes}</span>
                    </p>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={s.meetingLink || "https://meet.jit.si"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <VideoCamera className="w-3.5 h-3.5 text-emerald-600" /> Join Room
                  </a>

                  {s.status === "upcoming" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(s.id, "cancelled")}
                        className="px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(s.id, "completed")}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-zinc-900/20 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Done
                      </button>
                    </div>
                  )}

                  {s.status === "completed" && (
                    <Link
                      href="/reviews"
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Leave Review
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateSession}
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CalendarBlank className="w-4 h-4 text-zinc-500" />
                Schedule a Skill Session
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Partner</label>
              <select
                value={partnerUsername}
                onChange={(e) => setPartnerUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-zinc-500 font-medium"
              >
                <option value="sofia_design">Sofia Rodriguez (@sofia_design)</option>
                <option value="kenjisato">Kenji Sato (@kenjisato)</option>
                <option value="elena_polyglot">Elena Rostova (@elena_polyglot)</option>
                <option value="marcus_growth">Marcus Vance (@marcus_growth)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">You will teach</label>
                <input
                  type="text"
                  required
                  value={skillTaughtByHost}
                  onChange={(e) => setSkillTaughtByHost(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-zinc-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">You will learn</label>
                <input
                  type="text"
                  required
                  value={skillTaughtByParticipant}
                  onChange={(e) => setSkillTaughtByParticipant(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-zinc-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">When</label>
                <input
                  type="text"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  placeholder="e.g. Saturday 2:00 PM EST"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-zinc-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-zinc-500 font-medium"
                >
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                  <option value={90}>90 mins</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Notes & Objectives</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-zinc-500 font-medium"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold disabled:opacity-50 shadow-md shadow-zinc-900/20"
              >
                {creating ? "Scheduling..." : "Create Session"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
