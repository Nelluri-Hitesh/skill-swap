"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { calculateMatchScore, rankMatches } from "@/lib/matching";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScheduleModal } from "@/components/scheduling/ScheduleModal";
import type { ProfileWithSkills } from "@/types/database";

export default function MatchesPage() {
  const router = useRouter();
  const { currentUser, community, connections, sendConnectionRequest } = useSkillSwapStore();

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ProfileWithSkills | undefined>();

  // Rank all matches using the deterministic matching algorithm
  const ranked = rankMatches(currentUser, community);
  const topMatch = ranked[0];
  const otherMatches = ranked.slice(1);

  const getConnectionStatus = (userId: string) => {
    const conn = connections.find(
      (c) =>
        (c.requester_id === currentUser.id && c.receiver_id === userId) ||
        (c.receiver_id === currentUser.id && c.requester_id === userId)
    );
    return conn ? conn.status : null;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Compatibility Engine
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                My Best Matches
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Peer matches calculated by mutual skill reciprocity, overlapping schedules, and timezone compatibility.
              </p>
            </div>
          </div>

          {/* FEATURED BEST MATCH SECTION */}
          {topMatch && (
            <div className="bg-gradient-to-br from-white via-white to-blue-50/40 rounded-2xl border border-blue-100 shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-bl-xl uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3 h-3 fill-white" /> Best Match
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Profile Avatar & Info */}
                <div className="lg:col-span-4 flex items-start gap-4">
                  <img
                    src={topMatch.profile.avatar_url || ""}
                    alt={topMatch.profile.full_name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-100 shadow-md flex-shrink-0"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      {topMatch.profile.full_name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {topMatch.profile.location}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {topMatch.profile.rating_avg.toFixed(1)}
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {topMatch.profile.completed_sessions_count} sessions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why You're A Match */}
                <div className="lg:col-span-5 space-y-2 py-2 lg:border-x lg:border-gray-100 lg:px-6">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Why you are a 94% match:
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs text-gray-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>
                        Teaches <strong>Python</strong> (a skill you want to learn)
                      </span>
                    </li>
                    <li className="text-xs text-gray-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>
                        Wants to learn <strong>React</strong> (a skill you teach)
                      </span>
                    </li>
                    <li className="text-xs text-gray-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>4 overlapping availability slots this week</span>
                    </li>
                    <li className="text-xs text-gray-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Same Pacific Timezone (seamless scheduling)</span>
                    </li>
                  </ul>
                </div>

                {/* Match Score & Action */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center text-center p-4 bg-white/80 rounded-xl border border-blue-50 shadow-xs">
                  <div className="text-3xl font-black text-blue-600 leading-none">
                    94%
                  </div>
                  <span className="text-xs font-semibold text-gray-500 mt-1">
                    Reciprocal Match
                  </span>

                  <div className="mt-4 w-full space-y-2">
                    <button
                      onClick={() => {
                        setSelectedPartner(topMatch.profile);
                        setScheduleModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Schedule Session
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/profile/${topMatch.profile.username}`)
                      }
                      className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 rounded-lg transition-colors"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADDITIONAL MATCHES GRID */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4">
              More High-Compatibility Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherMatches.map(({ profile, matchScore }) => {
                const status = getConnectionStatus(profile.id);
                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 transition-card flex flex-col justify-between"
                  >
                    <div>
                      {/* Top bar */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={profile.avatar_url || ""}
                            alt={profile.full_name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-100"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 leading-tight">
                              {profile.full_name}
                            </h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {profile.location}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-purple-600" />
                          {matchScore.score}%
                        </span>
                      </div>

                      {/* Reasons */}
                      <div className="space-y-1 mb-4">
                        {matchScore.reasons.slice(0, 2).map((r, i) => (
                          <div
                            key={i}
                            className="text-xs text-gray-600 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="line-clamp-1">{r}</span>
                          </div>
                        ))}
                      </div>

                      {/* Skills */}
                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Teaches:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {profile.teach_skills.map((s) => (
                              <SkillBadge key={s.id} name={s.skill_name} type="TEACH" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/profile/${profile.username}`)
                        }
                        className="flex-1 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                      >
                        Profile
                      </button>
                      {status === "ACCEPTED" ? (
                        <button
                          onClick={() => {
                            setSelectedPartner(profile);
                            setScheduleModalOpen(true);
                          }}
                          className="flex-1 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Schedule
                        </button>
                      ) : status === "PENDING" ? (
                        <button
                          disabled
                          className="flex-1 py-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg opacity-80"
                        >
                          Pending...
                        </button>
                      ) : (
                        <button
                          onClick={() => sendConnectionRequest(profile.id)}
                          className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        preselectedPartner={selectedPartner}
      />
    </div>
  );
}
