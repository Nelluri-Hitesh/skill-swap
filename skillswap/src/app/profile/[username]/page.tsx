"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Globe,
  Clock,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Share2,
  BookOpen,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ScheduleModal } from "@/components/scheduling/ScheduleModal";
import type { ProfileWithSkills } from "@/types/database";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const {
    currentUser,
    community,
    connections,
    reviews,
    sendConnectionRequest,
  } = useSkillSwapStore();

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Find target profile
  const profile: ProfileWithSkills =
    username === currentUser.username
      ? currentUser
      : community.find((u) => u.username === username) || community[0];

  const isSelf = profile.id === currentUser.id;

  const connection = connections.find(
    (c) =>
      (c.requester_id === currentUser.id && c.receiver_id === profile.id) ||
      (c.receiver_id === currentUser.id && c.requester_id === profile.id)
  );

  const isConnected = connection?.status === "ACCEPTED";
  const isPending = connection?.status === "PENDING";

  // Filter reviews for this profile
  const userReviews = reviews.filter((r) => r.to_user_id === profile.id);

  const handleReport = () => {
    const reason = prompt("Please enter the reason for reporting this profile:");
    if (reason) {
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-60 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* TOP PROFILE CARD */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <img
                  src={profile.avatar_url || ""}
                  alt={profile.full_name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-100 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                      {profile.full_name}
                    </h1>
                    <span className="text-xs text-gray-400">@{profile.username}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5 max-w-xl leading-relaxed">
                    {profile.bio}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{profile.timezone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span>{profile.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isSelf && (
                <div className="flex flex-wrap md:flex-col gap-2.5 justify-end">
                  {isConnected ? (
                    <>
                      <button
                        onClick={() => setScheduleModalOpen(true)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Calendar className="w-4 h-4" /> Schedule Session
                      </button>
                      <button
                        onClick={() => router.push("/messages")}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </button>
                    </>
                  ) : isPending ? (
                    <button
                      disabled
                      className="px-5 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl opacity-80"
                    >
                      Request Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => sendConnectionRequest(profile.id)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Connect to Swap Skills
                    </button>
                  )}

                  <button
                    onClick={handleReport}
                    className="px-3 py-1.5 text-[11px] text-gray-400 hover:text-red-600 flex items-center justify-center gap-1 transition-colors"
                  >
                    <AlertTriangle className="w-3 h-3" /> Report
                  </button>
                </div>
              )}

              {isSelf && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/settings")}
                    className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Rating
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-extrabold text-gray-900">
                    {profile.rating_avg.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">({profile.rating_count})</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Sessions Completed
                </span>
                <div className="text-lg font-extrabold text-gray-900 mt-0.5">
                  {profile.completed_sessions_count}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Skills Offered
                </span>
                <div className="text-lg font-extrabold text-gray-900 mt-0.5">
                  {profile.teach_skills.length}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Looking to Learn
                </span>
                <div className="text-lg font-extrabold text-gray-900 mt-0.5">
                  {profile.learn_skills.length}
                </div>
              </div>
            </div>
          </div>

          {reportSuccess && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Thank you. The report has been logged and our moderation team will review this profile.
            </div>
          )}

          {/* TWO COLUMN LAYOUT: TEACH & LEARN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT: Skills I Teach */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Skills I Teach
                  </h2>
                  <p className="text-xs text-gray-400">
                    Mentorship & knowledge available for exchange
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {profile.teach_skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-gray-900">
                        {skill.skill_name}
                      </h3>
                      <SkillBadge name={skill.level} level={skill.level} />
                    </div>
                    {skill.description && (
                      <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                        {skill.description}
                      </p>
                    )}
                    <span className="text-[11px] text-gray-400">
                      {skill.hours_count} hours taught on SkillSwap
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Want to Learn */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Want to Learn
                  </h2>
                  <p className="text-xs text-gray-400">
                    Skills looking to acquire through peer exchange
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {profile.learn_skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-gray-900">
                        {skill.skill_name}
                      </h3>
                      <SkillBadge name={skill.level} level={skill.level} />
                    </div>
                    {skill.description && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {skill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Reviews & Peer Endorsements
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Real feedback from completed SkillSwap sessions
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-black text-gray-900">
                  {profile.rating_avg.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {userReviews.length > 0 ? (
                userReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.from_user.avatar_url || ""}
                          alt={rev.from_user.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">
                            {rev.from_user.full_name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {rev.type === "TEACHING" ? "Learner Feedback" : "Mentor Feedback"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-400">
                  No public reviews for this user yet. Complete a session together to be the first!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        preselectedPartner={profile}
      />
    </div>
  );
}
