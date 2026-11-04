"use client";

import {
  BarChart2,
  TrendingUp,
  Clock,
  Star,
  Award,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { MetricCard } from "@/components/ui/MetricCard";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function AnalyticsPage() {
  const { currentUser, sessions } = useSkillSwapStore();

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1400px] mx-auto w-full space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Learning & Exchange Analytics
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Detailed tracking of your reciprocal exchange ratio, hours learned, and peer reputation score.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Swap Hours"
              value="48.5 hrs"
              supporting="lifetime on platform"
              trend="+4.5 hrs"
              trendUp={true}
              icon={Clock}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
            <MetricCard
              title="Reciprocal Ratio"
              value="1.08"
              supporting="perfect 1:1 peer balance"
              trend="Balanced"
              trendUp={true}
              icon={TrendingUp}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Attendance Rate"
              value="98.5%"
              supporting="0 no-shows"
              icon={CheckCircle2}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
            />
            <MetricCard
              title="Reputation Tier"
              value="Gold Peer"
              supporting="top 5% of mentors"
              icon={Award}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
          </div>

          {/* Visual Charts */}
          <AnalyticsCharts />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
