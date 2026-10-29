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

  const {
    currentUser,
    community,
    connections,
    sendConnectionRequest,
  } = useSkillSwapStore();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [filterType, setFilterType] = useState<"ALL" | "TEACH" | "LEARN">("ALL");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ProfileWithSkills | undefined>();

  // Filter and calculate dynamic match scores for each user
  const filteredUsers = useMemo(() => {
    return community.map((user) => {
      const match = calculateMatchScore(currentUser, user);
      return { user, match };
    }).filter(({ user }) => {
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

  const getConnectionStatus = (userId: string) => {
    const conn = connections.find(
      (c) =>
        (c.requester_id === currentUser.id && c.receiver_id === userId) ||
        (c.receiver_id === currentUser.id && c.requester_id === userId)
    );
    return conn ? conn.status : null;
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-60 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
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
                  className="text-xs text-blue-600 hover:underline ml-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map(({ user, match }) => {
              const status = getConnectionStatus(user.id);
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
                      className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                    >
                      View Profile
                    </button>

                    {status === "ACCEPTED" ? (
                      <button
                        onClick={() => {
                          setSelectedPartner(user);
                          setScheduleModalOpen(true);
                        }}
                        className="flex-1 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Schedule
                      </button>
                    ) : status === "PENDING" ? (
                      <button
                        disabled
                        className="flex-1 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg opacity-80 cursor-default"
                      >
                        Pending...
                      </button>
                    ) : (
                      <button
                        onClick={() => sendConnectionRequest(user.id)}
                        className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                      >
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
