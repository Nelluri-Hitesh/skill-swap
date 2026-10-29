"use client";

import { useState } from "react";
import { Star, MessageSquare, BookOpen, User, CheckCircle2 } from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function ReviewsPage() {
  const { currentUser, reviews } = useSkillSwapStore();
  const [filterType, setFilterType] = useState<"ALL" | "TEACHING" | "LEARNING">("ALL");

  const filteredReviews = reviews.filter((r) => {
    if (filterType === "ALL") return true;
    return r.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-60 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Peer Ratings & Reviews
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Authentic testimonials from your 1-on-1 teaching and learning sessions on SkillSwap.
              </p>
            </div>

            {/* Overall score */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900 leading-none">
                  {currentUser.rating_avg.toFixed(1)}
                </div>
                <div className="flex items-center gap-0.5 justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {reviews.length} total reviews
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 border-b border-[#1f2333] pb-3">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filterType === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setFilterType("TEACHING")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filterType === "TEACHING"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Teaching Reviews
            </button>
            <button
              onClick={() => setFilterType("LEARNING")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filterType === "LEARNING"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Learning Reviews
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-3.5">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-xl border border-gray-100 shadow-card p-5 transition-card space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.from_user.avatar_url || ""}
                      alt={rev.from_user.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">
                        {rev.from_user.full_name}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        {rev.type === "TEACHING" ? "Learner Testimonial" : "Peer Mentor Feedback"} • {formatRelativeTime(rev.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 italic">
                  &quot;{rev.comment}&quot;
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
