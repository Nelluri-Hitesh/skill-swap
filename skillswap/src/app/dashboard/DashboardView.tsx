"use client";

import Link from "next/link";
import { Sparkles, Calendar, ArrowLeftRight } from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";

export default function DashboardView() {
  const { currentUser } = useSkillSwapStore();

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] w-full mx-auto space-y-6">
          {/* Welcome Card */}
          <section className="bg-white rounded-3xl border border-[#f0f0f0] p-8 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>IT&apos;S GREAT TO SEE YOU AGAIN</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
              Welcome back, <span className="text-[#0284c7]">nani.</span>
            </h1>

            <div className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase flex items-center gap-2 select-none">
              <span>LEARN</span>
              <span className="text-slate-300 font-normal">◄—►</span>
              <span>GROW</span>
              <span className="text-slate-300 font-normal">◄—►</span>
              <span>CONNECT</span>
            </div>
          </section>

          {/* Schedule & Pending Requests Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Today's Schedule Card */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#f0f0f0] shadow-xs overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#f3f4f6]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <h2 className="text-xs font-bold text-slate-900">Today&apos;s Schedule</h2>
                </div>
                <Link
                  href="/sessions"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Full Timetable →
                </Link>
              </div>

              <div className="py-20 px-6 flex items-center justify-center min-h-[160px]">
                <p className="text-xs text-slate-400 text-center font-normal">
                  No sessions scheduled for today. Explore AI matches to book one!
                </p>
              </div>
            </div>

            {/* Pending Requests Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#f0f0f0] shadow-xs overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#f3f4f6]">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <h2 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    PENDING REQUESTS (0)
                  </h2>
                </div>
                <Link
                  href="/connections"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Manage
                </Link>
              </div>

              <div className="py-20 px-6 flex items-center justify-center min-h-[160px]">
                <p className="text-xs text-slate-400 text-center font-normal">
                  No pending requests. Check AI matches to propose one!
                </p>
              </div>
            </div>
          </div>

          {/* High-Reciprocity Matches Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#f0f0f0] shadow-xs overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#f3f4f6]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <h2 className="text-xs font-bold text-slate-900">High-Reciprocity Matches</h2>
                </div>
                <Link
                  href="/matches"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  View all →
                </Link>
              </div>

              <div className="py-12 px-6 flex items-center justify-center min-h-[90px]">
                <p className="text-xs text-slate-400 text-center font-normal"></p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
