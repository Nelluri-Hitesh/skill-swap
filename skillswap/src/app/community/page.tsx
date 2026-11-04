"use client";

import { useState } from "react";
import {
  Globe,
  Calendar,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const communityEvents = [
  {
    id: "evt-1",
    title: "SkillSwap Coding Circle",
    description: "Weekly peer code review and collaborative problem solving. Bring a snippet or architecture question!",
    time: "Saturday • 5:00 PM PST",
    attendees: 24,
    tags: ["Coding", "React", "Python"],
    joined: true,
  },
  {
    id: "evt-2",
    title: "Design Critique & UX Heuristics",
    description: "Live feedback on Figma prototypes, color contrasts, and accessibility standards.",
    time: "Sunday • 11:00 AM PST",
    attendees: 18,
    tags: ["Figma", "UI/UX", "Accessibility"],
    joined: false,
  },
  {
    id: "evt-3",
    title: "English & Public Speaking Practice",
    description: "Safe environment for tech talks, pitch decks, and spontaneous conversational fluency.",
    time: "Next Tuesday • 6:30 PM PST",
    attendees: 31,
    tags: ["Speaking", "ESL", "Pitching"],
    joined: false,
  },
];

export default function CommunityPage() {
  const { currentUser, community } = useSkillSwapStore();
  const [events, setEvents] = useState(communityEvents);

  const toggleJoin = (id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              joined: !e.joined,
              attendees: e.joined ? e.attendees - 1 : e.attendees + 1,
            }
          : e
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] mx-auto w-full space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
              <Globe className="w-3.5 h-3.5" /> Global Peer Network
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              SkillSwap Community & Study Circles
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl">
              Connect with fellow learners beyond 1-on-1 sessions. Join weekly peer circles, group feedback workshops, and collaborative sprints.
            </p>
          </div>

          {/* Events Grid */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">
              Upcoming Study Circles & Group Swaps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 transition-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {evt.time}
                      </span>
                      <span className="text-xs text-gray-400">
                        {evt.attendees} attending
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {evt.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleJoin(evt.id)}
                    className={`w-full py-2 text-xs font-bold rounded-xl transition-all ${
                      evt.joined
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    }`}
                  >
                    {evt.joined ? "Joined ✓" : "Join Circle"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Community Members Highlights */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Active Peer Mentors & Learners
              </h2>
              <span className="text-xs text-gray-400">1,240 Online</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {community.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all text-center space-y-2"
                >
                  <img
                    src={m.avatar_url || ""}
                    alt={m.full_name}
                    className="w-12 h-12 rounded-full object-cover mx-auto border border-gray-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {m.full_name}
                    </h4>
                    <p className="text-[10px] text-gray-400">{m.location}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                    {m.teach_skills[0]?.skill_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
