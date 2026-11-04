"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Compass,
  Sparkles,
  Layers,
  Calendar,
  MessageSquare,
  Star,
  Bell,
  Settings,
  ChevronRight,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeText?: string;
  badgeCount?: number;
  hasChevron?: boolean;
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Dashboard",
    hasChevron: true,
  },
  {
    href: "/discover",
    icon: Compass,
    label: "Discover Feed",
    badgeText: "Social",
  },
  {
    href: "/matches",
    icon: Sparkles,
    label: "AI Synergy Match",
    badgeText: "98% AI",
  },
  {
    href: "/skills",
    icon: Layers,
    label: "My Skills Hub",
    hasChevron: true,
  },
  {
    href: "/sessions",
    icon: Calendar,
    label: "Swap Sessions",
    hasChevron: true,
  },
  {
    href: "/messages",
    icon: MessageSquare,
    label: "Direct Messages",
    hasChevron: true,
  },
  {
    href: "/reviews",
    icon: Star,
    label: "Reviews & Vouch",
    hasChevron: true,
  },
  {
    href: "/notifications",
    icon: Bell,
    label: "Notifications",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    hasChevron: true,
  },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 flex flex-col",
        "bg-white border-r border-[#f0f0f0]",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-6 py-6 select-none">
        <Link2 className="w-5 h-5 text-black stroke-[2.5]" />
        <span className="font-bold text-base tracking-tight text-black">
          SkillSwap
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                active
                  ? "bg-[#111111] text-white shadow-xs"
                  : "text-slate-600 hover:text-black hover:bg-slate-50"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-white" : "text-slate-400"
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>

              {item.badgeText && (
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#f4f4f5] text-slate-500"
                  )}
                >
                  {item.badgeText}
                </span>
              )}

              {item.badgeCount !== undefined && (
                <span
                  className={cn(
                    "text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#f4f4f5] text-slate-500"
                  )}
                >
                  {item.badgeCount}
                </span>
              )}

              {item.hasChevron && (
                <ChevronRight
                  className={cn(
                    "w-3.5 h-3.5 flex-shrink-0",
                    active ? "text-white" : "text-slate-300"
                  )}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
