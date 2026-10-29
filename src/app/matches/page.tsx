"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChatCircle,
  ArrowsLeftRight,
  Check,
  Clock,
  Star,
  X,
  Sparkle,
  Stack,
  Lightning,
  ArrowUpRight,
  CalendarBlank,
  ShieldCheck
} from "@phosphor-icons/react";
import { MatchRecommendation, SwapProposal } from "@/types";

function MatchesContent() {
  const searchParams = useSearchParams();
  const preselectedTarget = searchParams.get("target");

  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const [proposals, setProposals] = useState<SwapProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recommendations" | "proposals">("recommendations");

  // Proposal modal
  const [modalTarget, setModalTarget] = useState<any | null>(null);
  const [mySkillToOffer, setMySkillToOffer] = useState("React & Next.js");
  const [theirSkillWanted, setTheirSkillWanted] = useState("");
  const [proposedDate, setProposedDate] = useState("Tomorrow at 4:00 PM EST");
  const [proposalMsg, setProposalMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([
        fetch("/api/matches"),
        fetch("/api/proposals"),
      ]);

      const safeJson = async (res: Response) => {
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return {};
        return res.json().catch(() => ({}));
      };

      const [mData, pData] = await Promise.all([safeJson(mRes), safeJson(pRes)]);

      if (mData.matches) {
        setMatches(mData.matches);
        if (preselectedTarget) {
          const match = mData.matches.find((m: any) => m.user.id === preselectedTarget);
          if (match) openProposalModal(match.user, match.canTeachYou?.[0]?.skillName);
        }
      }
      if (pData.proposals) setProposals(pData.proposals);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [preselectedTarget]);

  const openProposalModal = (user: any, initialSkill?: string) => {
    setModalTarget(user);
    setTheirSkillWanted(initialSkill || user.offeringSkills?.[0]?.skillName || "Figma UI/UX Design");
    setProposalMsg(
      `Hey ${user.name}! I would love to do a 1-on-1 skill swap. I can help you with modern web development in return for your design & creative feedback.`
    );
    setSuccessMsg("");
  };

  const handleCreateProposal = async () => {
    if (!modalTarget) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: "usr_current",
          receiverId: modalTarget.id,
          offeredSkill: mySkillToOffer,
          wantedSkill: theirSkillWanted,
          message: proposalMsg,
          proposedDate,
          durationMinutes: 45,
          matchScore: 95,
        }),
      });

      if (res.ok) {
        setSuccessMsg("Proposal sent! Your peer will be notified.");
        loadData();
        setTimeout(() => {
          setModalTarget(null);
          setSuccessMsg("");
          setActiveTab("proposals");
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProposalStatus = async (id: string, status: "accepted" | "declined") => {
    try {
      const res = await fetch("/api/proposals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 border-none">
              <Sparkle className="w-4 h-4 text-zinc-600" />
            </span>
            <h1 className="text-xl md:text-2xl font-medium text-zinc-900 tracking-tight">AI Synergy Matches & Proposals</h1>
          </div>
          <p className="text-xs text-zinc-500 font-normal mt-1">
            Our algorithmic engine computes 2-way skill reciprocity. When you have what they want, and they teach what you need, magic happens!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-white border border-zinc-200 rounded-lg shadow-2xs">
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "recommendations"
                ? "bg-zinc-900 text-white shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Recommended Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "proposals"
                ? "bg-zinc-900 text-white shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Active Proposals ({proposals.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-white border border-slate-200" />
          ))}
        </div>
      ) : activeTab === "recommendations" ? (
        /* RECOMMENDATIONS VIEW (AgentX White Card Theme) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {matches.map((item) => (
            <div
              key={item.user.id}
              className="bg-white border-none rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Header User + Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${item.user.username}`}>
                      <img
                        src={item.user.avatarUrl}
                        alt={item.user.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white hover:ring-cyan-500 transition-all"
                      />
                    </Link>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${item.user.username}`}
                          className="font-extrabold text-slate-900 hover:text-cyan-600 text-sm"
                        >
                          {item.user.name}
                        </Link>
                        <span className="text-xs text-slate-500 font-medium">@{item.user.username}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 font-medium">{item.user.headline}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {item.user.rating}
                        </span>
                        <span>&bull;</span>
                        <span>{item.user.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 border-none text-zinc-800 font-medium text-[10px] flex items-center gap-1">
                      <Sparkle className="w-3 h-3 text-zinc-500" />
                      {item.score}% Match
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1 font-normal">High Reciprocity</span>
                  </div>
                </div>

                {/* 2-Way Exchange Box */}
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-black text-cyan-700 uppercase tracking-wider block">
                      They teach what you want:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.canTeachYou.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded bg-white text-cyan-800 border border-slate-200 text-[11px] font-bold"
                        >
                          {s.skillName} ({s.proficiency})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">
                      You teach what they want:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.wantsFromYou.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded bg-white text-purple-800 border border-slate-200 text-[11px] font-bold"
                        >
                          {s.skillName} ({s.proficiency})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-zinc-100/50 flex items-center justify-between">
                <Link
                  href={`/messages?partner=${item.user.id}`}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
                >
                  <ChatCircle className="w-3.5 h-3.5" /> Chat
                </Link>

                <button
                  onClick={() => openProposalModal(item.user, item.canTeachYou?.[0]?.skillName)}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <ArrowsLeftRight className="w-3.5 h-3.5" />
                  Swap
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* PROPOSALS VIEW */
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
              <p className="text-sm text-slate-500 font-medium">No swap proposals yet.</p>
            </div>
          ) : (
            proposals.map((prop) => {
              const isReceiver = prop.receiverId === "usr_current";
              const partner = isReceiver ? prop.sender : prop.receiver;

              return (
                <div
                  key={prop.id}
                  className="bg-white border-none rounded-2xl p-5 hover:shadow-md transition-all space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={partner?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                        alt={partner?.name || "Peer"}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{partner?.name}</span>
                          <span className="text-xs text-slate-500 font-medium">@{partner?.username}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {isReceiver ? "Sent you a swap offer" : "You sent a swap offer"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                          prop.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : prop.status === "declined"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                  </div>

                  {/* Skills Exchange Box */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-black">
                          Offering to Teach:
                        </span>
                        <span className="font-bold text-emerald-700">{prop.offeredSkill}</span>
                      </div>
                      <ArrowsLeftRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-black">
                          Wants in Return:
                        </span>
                        <span className="font-bold text-cyan-700">{prop.wantedSkill}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <CalendarBlank className="w-3.5 h-3.5 text-slate-400" /> {prop.proposedDate}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {prop.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  {/* Note */}
                  {prop.message && (
                    <p className="text-xs text-slate-700 italic bg-slate-100/60 p-3 rounded-xl border border-slate-200 font-medium">
                      &quot;{prop.message}&quot;
                    </p>
                  )}

                  {/* Action row */}
                  {isReceiver && prop.status === "pending" && (
                    <div className="pt-2 flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleUpdateProposalStatus(prop.id, "declined")}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleUpdateProposalStatus(prop.id, "accepted")}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/25"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept & Schedule
                      </button>
                    </div>
                  )}

                  {prop.status === "accepted" && (
                    <div className="pt-2 flex items-center justify-between text-xs text-emerald-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Scheduled in your Swap Sessions calendar
                      </span>
                      <Link
                        href="/sessions"
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-bold"
                      >
                        View Meeting
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Propose Swap Modal */}
      {modalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ArrowsLeftRight className="w-4 h-4 text-cyan-600" />
                  Propose Swap with {modalTarget.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Collaborate 1-on-1 and trade skills</p>
              </div>
              <button
                onClick={() => setModalTarget(null)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-900">{successMsg}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What skill do you offer to teach?
                  </label>
                  <select
                    value={mySkillToOffer}
                    onChange={(e) => setMySkillToOffer(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="React & Next.js">React & Next.js (5 yrs exp)</option>
                    <option value="TypeScript">TypeScript (4 yrs exp)</option>
                    <option value="Node.js & Postgres">Node.js & Postgres (4 yrs exp)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What skill do you want from {modalTarget.name}?
                  </label>
                  <input
                    type="text"
                    value={theirSkillWanted}
                    onChange={(e) => setTheirSkillWanted(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Proposed Date & Time
                  </label>
                  <input
                    type="text"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Message / Agenda
                  </label>
                  <textarea
                    rows={3}
                    value={proposalMsg}
                    onChange={(e) => setProposalMsg(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                  <button
                    onClick={() => setModalTarget(null)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProposal}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold disabled:opacity-50 shadow-md shadow-cyan-500/25"
                  >
                    {isSubmitting ? "Sending..." : "Submit Proposal"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400 font-medium">Loading AI Matches...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
