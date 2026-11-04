"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Video,
  PhoneOff,
  AlertTriangle,
  Info,
  Calendar,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { calculateMatchScore } from "@/lib/matching";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScheduleModal } from "@/components/scheduling/ScheduleModal";
import { SKILL_CATEGORIES } from "@/lib/utils";
import type { ProfileWithSkills } from "@/types/database";

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const sessionCompletedParam = searchParams.get("sessionCompleted");

  const {
    currentUser,
    community,
    connections,
    sessions,
    activeLiveSessionId,
    startInstantZoomSession,
    endSession,
  } = useSkillSwapStore();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ProfileWithSkills | undefined>();

  // Single Session & Time Check Conflict States
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [pendingTargetUser, setPendingTargetUser] = useState<ProfileWithSkills | null>(null);
  const [timeCheckedFeedback, setTimeCheckedFeedback] = useState<string | null>(null);

  // Check if there is an active live session right now
  const activeSession = sessions.find(
    (s) => s.status === "IN_PROGRESS" || s.id === activeLiveSessionId
  );

  // Filter and calculate dynamic match scores for each user
  const filteredUsers = useMemo(() => {
    return community
      .map((user) => {
        const match = calculateMatchScore(currentUser, user);
        return { user, match };
      })
      .filter(({ user }) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        if (q) {
          const nameMatch = user.full_name.toLowerCase().includes(q);
          const bioMatch = (user.bio || "").toLowerCase().includes(q);
          const teachMatch = user.teach_skills.some((s) =>
            s.skill_name.toLowerCase().includes(q)
          );
          const learnMatch = user.learn_skills.some((s) =>
            s.skill_name.toLowerCase().includes(q)
          );
          if (!nameMatch && !bioMatch && !teachMatch && !learnMatch) return false;
        }

        // Category filter
        if (selectedCategory !== "All") {
          const inCategory =
            user.teach_skills.some((s) => s.skill_category === selectedCategory) ||
            user.learn_skills.some((s) => s.skill_category === selectedCategory);
          if (!inCategory) return false;
        }

        // Level filter
        if (selectedLevel !== "All") {
          const hasLevel = user.teach_skills.some((s) => s.level === selectedLevel);
          if (!hasLevel) return false;
        }

        return true;
      });
  }, [community, currentUser, searchQuery, selectedCategory, selectedLevel]);

  // Handle Connect click:
  // 1. Checks current time
  // 2. Enforces single-session rule (allows only 1 active session)
  // 3. Redirects to Zoom meeting page
  const handleConnect = (targetUser: ProfileWithSkills) => {
    // 1. Check the time
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    setTimeCheckedFeedback(`Checked at ${timeStr}, ${dateStr}`);

    // If user is already in an active session with this exact person, redirect directly to Zoom
    if (activeSession && activeSession.partner.id === targetUser.id) {
      router.push(`/zoom?sessionId=${activeSession.id}`);
      return;
    }

    // 2. Allow only one session: check if user already has an active session in progress
    if (activeSession) {
      setPendingTargetUser(targetUser);
      setConflictModalOpen(true);
      return;
    }

    // 3. No active session exists -> create session and redirect to Zoom meeting page
    const res = startInstantZoomSession(targetUser);
    if (res.success && res.sessionId) {
      router.push(`/zoom?sessionId=${res.sessionId}`);
    }
  };

  // Switch session: End previous active session and immediately start with new user
  const handleEndPreviousAndStartNew = () => {
    if (activeSession) {
      endSession(activeSession.id);
    }
    setConflictModalOpen(false);
    if (pendingTargetUser) {
      const res = startInstantZoomSession(pendingTargetUser);
      if (res.success && res.sessionId) {
        router.push(`/zoom?sessionId=${res.sessionId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] mx-auto w-full space-y-6">
          {/* Active Session Alert Banner (Single session indicator) */}
          {activeSession && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white shadow-xl animate-in fade-in">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">
                      Active Live Zoom Session in Progress
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      1 Active Session Allowed
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    Currently in call with <strong className="text-white">{activeSession.partner.full_name}</strong> for {activeSession.skill_name} • Started: {activeSession.displayTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => router.push(`/zoom?sessionId=${activeSession.id}`)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  Resume Zoom Meeting
                </button>
                <button
                  onClick={() => endSession(activeSession.id)}
                  className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-gray-700"
                >
                  End Session
                </button>
              </div>
            </div>
          )}

          {/* Session Completed Feedback Banner */}
          {sessionCompletedParam === "true" && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between text-blue-200 text-xs shadow-md animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>
                  <strong>Zoom session completed successfully!</strong> Your session slot is now open. You can connect to another mentor below.
                </span>
              </div>
              <button
                onClick={() => router.replace("/discover")}
                className="text-blue-300 hover:text-white font-semibold cursor-pointer underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8">
            <div className="max-w-2xl">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Discover Skills & People
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Find compatible peer mentors and learners ready to teach what you want to learn.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Python, UI/UX, Guitar, English, React..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Filter Row */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </div>

              {/* Categories */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-gray-700"
              >
                <option value="All">All Categories</option>
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Skill Level */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-gray-700"
              >
                <option value="All">All Skill Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>

              {/* Clear filters button */}
              {(searchQuery || selectedCategory !== "All" || selectedLevel !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedLevel("All");
                  }}
                  className="text-xs text-blue-600 hover:underline ml-auto cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map(({ user, match }) => {
              const isPartnerInActiveSession =
                activeSession && activeSession.partner.id === user.id;

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 transition-card flex flex-col justify-between"
                >
                  <div>
                    {/* Top User Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || ""}
                          alt={user.full_name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-100"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">
                            {user.full_name}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{user.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-600" />
                        {match.score > 0 ? `${match.score}% Match` : "Peer"}
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                      {user.bio}
                    </p>

                    {/* Stats summary */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 pb-3 border-b border-gray-50">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-gray-800">
                          {user.rating_avg.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ({user.rating_count})
                        </span>
                      </div>
                      <span>•</span>
                      <span>{user.completed_sessions_count} sessions</span>
                    </div>

                    {/* Skills They Teach */}
                    <div className="mb-2.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Teaches:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {user.teach_skills.map((s) => (
                          <SkillBadge
                            key={s.id}
                            name={s.skill_name}
                            level={s.level}
                            type="TEACH"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Skills They Want to Learn */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Wants to Learn:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {user.learn_skills.map((s) => (
                          <SkillBadge
                            key={s.id}
                            name={s.skill_name}
                            type="LEARN"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/profile/${user.username}`)}
                      className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>

                    {/* Connect Button: Checks time, enforces 1 session rule, redirects to Zoom meeting */}
                    {isPartnerInActiveSession ? (
                      <button
                        onClick={() => router.push(`/zoom?sessionId=${activeSession.id}`)}
                        className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 animate-pulse cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Zoom (Live)
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(user)}
                        className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-sm font-semibold text-gray-700">
                No matching learners or mentors found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try clearing your search query or selecting another category.
              </p>
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        preselectedPartner={selectedPartner}
      />

      {/* SINGLE SESSION & TIME CHECK CONFLICT MODAL */}
      {conflictModalOpen && activeSession && pendingTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">
                Only 1 Active Session Allowed
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                SkillSwap enforces a <strong>single active session rule</strong> so mentors and learners remain focused.
              </p>
            </div>

            {/* Ongoing session details */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-semibold text-gray-700">Current Session:</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE NOW
                </span>
              </div>
              <div className="font-medium text-gray-800">
                {activeSession.skill_name} with {activeSession.partner.full_name}
              </div>
              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Started: {activeSession.displayTime}</span>
              </div>
            </div>

            {/* Time verification pill */}
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>Time checked: New request for <strong>{pendingTargetUser.full_name}</strong> is queued.</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setConflictModalOpen(false);
                  router.push(`/zoom?sessionId=${activeSession.id}`);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                Resume Current Zoom Call
              </button>

              <button
                onClick={handleEndPreviousAndStartNew}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5 text-gray-600" />
                End Current & Connect with {pendingTargetUser.full_name}
              </button>

              <button
                onClick={() => setConflictModalOpen(false)}
                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Discover...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
