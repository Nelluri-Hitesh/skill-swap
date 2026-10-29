"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  Check,
  FileText,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { ScheduleModal } from "@/components/scheduling/ScheduleModal";

export default function SessionsView() {
  const { currentUser, sessions, completeSession } = useSkillSwapStore();

  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED">("ALL");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const displayedSessions = sessions.filter((s) => {
    if (filter === "UPCOMING") return s.status === "SCHEDULED";
    if (filter === "COMPLETED") return s.status === "COMPLETED";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] w-full mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <h1 className="text-xl font-bold text-slate-900">
                  Swap Sessions &amp; Calendar
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage your booked 1-on-1 skill exchanges, join video rooms, and log completed sessions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center bg-white border border-[#f0f0f0] p-1 rounded-xl shadow-2xs">
                <button
                  onClick={() => setFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === "ALL"
                      ? "bg-black text-white"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("UPCOMING")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === "UPCOMING"
                      ? "bg-black text-white"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter("COMPLETED")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === "COMPLETED"
                      ? "bg-black text-white"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                + Schedule Session
              </button>
            </div>
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {displayedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-3xl border border-[#f0f0f0] p-6 shadow-xs space-y-4 transition-shadow hover:shadow-sm"
              >
                {/* Card Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{session.displayDate}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-[#f4f4f5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {session.status === "COMPLETED" ? "COMPLETED" : "UPCOMING"}
                  </span>
                </div>

                {/* User Row */}
                <div className="flex items-center gap-3">
                  <img
                    src={session.partner.avatar_url || "/avatar-sofia.jpg"}
                    alt={session.partner.full_name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {session.partner.full_name}
                      </h3>
                      <span className="text-xs text-slate-400">
                        @{session.partner.username}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.displayTime || "45 Minutes Peer Session"}
                    </p>
                  </div>
                </div>

                {/* Exchange Box */}
                <div className="bg-[#f8f9fa] border border-slate-100/80 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-normal">Host teaches:</span>
                    <span className="text-[#059669] font-bold">
                      {session.hostTeaches || session.skill_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-normal">Participant teaches:</span>
                    <span className="text-[#7c3aed] font-bold">
                      {session.participantTeaches || "Figma UI/UX Design"}
                    </span>
                  </div>
                </div>

                {/* Notes Box */}
                {session.notes && (
                  <div className="bg-[#f8f9fa] border border-slate-100/80 rounded-2xl p-3 flex items-center gap-2 text-xs text-slate-600 italic">
                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 not-italic" />
                    <span className="truncate">{session.notes}</span>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() =>
                      window.open(session.meeting_link || "https://meet.google.com", "_blank")
                    }
                    className="bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#059669] font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join Room
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert("Session cancellation requested.")}
                      className="text-slate-500 hover:text-slate-800 text-xs font-medium px-3 py-2 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => completeSession(session.id)}
                      className="bg-[#18181b] hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}
