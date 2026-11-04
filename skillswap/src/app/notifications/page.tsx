"use client";

import {
  Bell,
  Check,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Users,
  Star,
} from "lucide-react";
import { useSkillSwapStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function NotificationsPage() {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useSkillSwapStore();

  const getIcon = (type: string) => {
    switch (type) {
      case "CONNECTION_ACCEPTED":
        return <Users className="w-4 h-4 text-emerald-600" />;
      case "SESSION_REMINDER":
      case "SESSION_SCHEDULED":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "NEW_MESSAGE":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "SESSION_COMPLETED":
        return <Star className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 px-8 pb-12 max-w-[1200px] mx-auto w-full space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl border border-[#f0f0f0] p-8 shadow-xs flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Notifications
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Stay updated on peer swap requests, upcoming sessions, and messages
              </p>
            </div>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer bg-blue-50/60 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Mark All as Read
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((n) => {
              const isUnread = !n.read_at;
              return (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`bg-white rounded-2xl border border-[#f0f0f0] shadow-xs p-5 transition-all flex items-start gap-4 cursor-pointer hover:shadow-sm ${
                    isUnread ? "border-l-4 border-l-blue-600 bg-blue-50/10" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {formatRelativeTime(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                  {isUnread && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}

            {notifications.length === 0 && (
              <div className="bg-white rounded-3xl border border-[#f0f0f0] p-12 text-center text-xs text-slate-400 shadow-xs">
                You have caught up with all notifications.
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
