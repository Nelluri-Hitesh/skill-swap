"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  Compass,
  Sparkle,
  Stack,
  CalendarBlank,
  ChatCircle,
  Star,
  Bell,
  Gear,
  ArrowsLeftRight,
  SignOut,
  CaretRight,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  label: string;
  href?: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  isLogout?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: SquaresFour },
  { label: "Discover Feed", href: "/discover", icon: Compass, badge: "Social" },
  { label: "AI Synergy Match", href: "/matches", icon: Sparkle, badge: "98% AI" },
  { label: "My Skills Hub", href: "/skills", icon: Stack },
  { label: "Swap Sessions", href: "/sessions", icon: CalendarBlank },
  { label: "Direct Messages", href: "/messages", icon: ChatCircle },
  { label: "Reviews & Vouch", href: "/reviews", icon: Star },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: "2" },
  { label: "Settings", href: "/settings", icon: Gear },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-zinc-200/80 flex flex-col shrink-0 min-h-screen text-zinc-800 select-none z-40">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-5 justify-between bg-white">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img src="/logo-icon.png" alt="SkillSwap Logo" className="w-full h-full object-contain" />
            </div>

          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-900 text-lg tracking-tight">
                SkillSwap
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Buttons List */}
      <div className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
        <div className="space-y-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))) : false;

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-white font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-700"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                        isActive
                          ? "bg-white/20 text-white border-white/20"
                          : "bg-zinc-100 text-zinc-600 border-zinc-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {!item.badge && (
                    <CaretRight
                      weight="bold"
                      className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                        isActive ? "text-white/60" : "text-zinc-300 group-hover:text-zinc-500"
                      }`}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>


      {/* User Profile Mini Bar */}
      <div className="p-3 flex items-center justify-between mb-2 mx-2">
        <Link
          href={`/profile/${user?.username || "alexmorgan"}`}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity min-w-0"
        >
          <div className="relative shrink-0">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={user?.name || "User"}
              className="w-8 h-8 rounded-full object-cover bg-zinc-100 ring-1 ring-zinc-200"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-zinc-900 truncate">
              {user?.name || "Alex Morgan"}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-0.5">
          <Link
            href="/settings"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
            title="Account Settings"
          >
            <Gear className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign Out"
            type="button"
          >
            <SignOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

