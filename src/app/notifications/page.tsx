"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChatCircle,
  ArrowsLeftRight,
  UserPlus,
  Star,
  Sparkle,
  Checks,
  Bell,
  CheckCircle
} from "@phosphor-icons/react";
import { NotificationItem } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?userId=usr_current");
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true, userId: "usr_current" }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "proposal_received":
      case "proposal_accepted":
        return <ArrowsLeftRight className="w-4 h-4 text-indigo-400" />;
      case "new_follower":
        return <UserPlus className="w-4 h-4 text-pink-400" />;
      case "review_received":
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Bell className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Notifications Center</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Realtime activity on swaps, followers, messages, and feedback.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Checks className="w-3.5 h-3.5" />
          Mark all as read
        </button>
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-zinc-100 border border-zinc-200" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl">
          <p className="text-xs text-zinc-400">All caught up! No new notifications.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                item.isRead
                  ? "bg-white border-zinc-200 text-zinc-500"
                  : "bg-white border-indigo-200 text-zinc-900 shadow-sm shadow-indigo-100"
              }`}
            >
              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-zinc-900">{item.title}</h4>
                  <span className="text-[10px] text-zinc-400 shrink-0">
                    {formatTimeAgo(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-0.5">{item.message}</p>

                {item.link && (
                  <Link
                    href={item.link}
                    className="inline-block mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    View details →
                  </Link>
                )}
              </div>

              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
