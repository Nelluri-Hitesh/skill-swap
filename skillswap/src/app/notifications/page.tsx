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
    <div className="min-h-screen bg-[#0f1117] text-gray-900 font-sans">
      <AppSidebar className="hidden md:flex" />

      <div className="md:pl-60 flex flex-col min-h-screen">
        <TopNavbar profile={currentUser} />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Notifications
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                Stay updated on peer swap requests, upcoming sessions, and messages
              </p>
            </div>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                  className={`bg-white rounded-xl border border-gray-100 shadow-card p-4 transition-card flex items-start gap-3.5 cursor-pointer ${
                    isUnread ? "border-l-4 border-l-blue-600 bg-blue-50/20" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {formatRelativeTime(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
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
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
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
