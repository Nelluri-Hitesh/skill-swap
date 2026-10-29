"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkle,
  ArrowSquareOut,
  ChatCircle,
  ArrowsLeftRight,
  Clock,
  Check,
  Compass,
  VideoCamera,
  CheckCircle,
  ShieldCheck,
  Users,
  Star,
  ArrowUpRight,
  CalendarBlank,
  Medal,
  BookOpen,
  TrendUp,
  PlusCircle,
  MagnifyingGlass,
  Lightning
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { CATEGORY_COLORS } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, matchRes, sessRes, propRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/matches"),
          fetch("/api/sessions"),
          fetch("/api/proposals"),
        ]);

        const safeJson = async (res: Response) => {
          if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return {};
          return res.json().catch(() => ({}));
        };

        const [dashData, matchData, sessData, propData] = await Promise.all([
          safeJson(dashRes),
          safeJson(matchRes),
          safeJson(sessRes),
          safeJson(propRes),
        ]);

        if (dashData.stats) setStats(dashData.stats);
        if (matchData.matches) setMatches(matchData.matches.slice(0, 3));
        if (sessData.sessions) setSessions(sessData.sessions);
        if (propData.proposals) setProposals(propData.proposals);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming").slice(0, 3);
  const pendingProposals = proposals.filter((p) => p.status === "pending").slice(0, 2);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto font-sans">
      {/* Hero Welcome Card */}
      <div className="bg-white rounded-2xl border-none p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col space-y-3 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 text-zinc-500 text-[10px] font-semibold tracking-wider uppercase w-fit">
            <Sparkle className="w-3.5 h-3.5" />
            It’s great to see you again 
          </div>

          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-900">
            Welcome back, <span className="text-cyan-500">{user?.name || "Alex"}</span>.
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed font-normal">
            LEARN ►◄ GROW ►◄ CONNECT
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Proactive AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Schedule / Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border-none p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100/50">
              <div className="flex items-center gap-2">
                <CalendarBlank className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-medium text-zinc-900">Today's Schedule</h2>
              </div>
              <Link href="/sessions" className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors">
                Full Timetable &rarr;
              </Link>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-400 font-normal">
                No sessions scheduled for today. Explore AI matches to book one!
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingSessions.map((session, idx) => (
                  <div
                    key={session.id || idx}
                    className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-300 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-900">
                          {session.skillTaughtByHost || "Next.js & React System"}
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-medium bg-zinc-200 text-zinc-800 border border-zinc-300">
                          Now
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 font-normal">
                        <Clock className="w-3 h-3 text-zinc-400" /> {session.scheduledAt || "10:00-11:30 AM"} &bull; with {session.host?.name || "Sarah Chen"}
                      </p>
                    </div>

                    <a
                      href={session.meetingLink || "https://meet.jit.si"}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-all text-center shrink-0"
                    >
                      Check-in Video
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Synergy Matches List */}
          <div className="bg-white rounded-2xl border-none p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100/50">
              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-medium text-zinc-900">High-Reciprocity Matches</h2>
              </div>
              <Link href="/matches" className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors">
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {matches.map((item) => (
                <div
                  key={item.user.id}
                  className="bg-zinc-50/60 border border-zinc-200/80 rounded-xl p-4.5 hover:border-zinc-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Link href={`/profile/${item.user.username}`}>
                        <img
                          src={item.user.avatarUrl}
                          alt={item.user.name}
                          className="w-10 h-10 rounded-full object-cover bg-white ring-1 ring-zinc-200"
                        />
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/profile/${item.user.username}`}
                            className="font-semibold text-zinc-900 hover:text-zinc-700 transition-colors text-sm"
                          >
                            {item.user.name}
                          </Link>
                          <span className="text-xs text-zinc-400 font-normal">@{item.user.username}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1 font-normal">{item.user.headline}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400 font-normal">
                          <span className="flex items-center gap-1 text-amber-700 font-medium">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {item.user.rating} ({item.user.reviewCount})
                          </span>
                          <span>&bull;</span>
                          <span>{item.user.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 font-semibold text-xs flex items-center gap-1">
                        <Sparkle className="w-3 h-3 text-zinc-500" />
                        {item.score}% Match
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1 font-normal">2-Way Reciprocity</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-200/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 items-center text-xs">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Teaches:</span>
                      {item.canTeachYou?.map((s: any) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded bg-white text-zinc-800 border border-zinc-200 font-medium text-[11px]"
                        >
                          {s.skillName}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/messages?partner=${item.user.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 transition-colors"
                      >
                        Chat
                      </Link>
                      <Link
                        href={`/matches?target=${item.user.id}`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
                      >
                        Propose Swap
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Proactive AI Suggestions & Pending Requests */}
        <div className="space-y-6">


          {/* Pending Requests Widget */}
          <div className="bg-white rounded-2xl border-none p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100/50">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <ArrowsLeftRight className="w-3.5 h-3.5" />
                Pending Requests ({pendingProposals.length})
              </h3>
              <Link href="/matches" className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors">
                Manage
              </Link>
            </div>

            {pendingProposals.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-medium">
                No pending requests. Check AI matches to propose one!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProposals.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 rounded-xl bg-zinc-50 border-none space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={prop.sender?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"}
                        alt={prop.sender?.name || "Sender"}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-zinc-900 truncate">
                          {prop.sender?.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate font-normal">
                          Teaches {prop.offeredSkill} &bull; Wants {prop.wantedSkill}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-end">
                      <Link
                        href="/matches"
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
                      >
                        Respond
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
