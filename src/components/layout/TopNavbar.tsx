"use client";

import Link from "next/link";
import {
  Stack,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export function TopNavbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isDiscover = pathname === "/discover" || pathname.startsWith("/discover");

  return (
    <header className="h-16 bg-[#fafafa] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Skills Nav Link (only on discover feed) */}
      <div className="flex items-center gap-3 flex-1">
        {isDiscover && (
          <Link
            href="/skills"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              pathname === "/skills" || pathname.startsWith("/skills")
                ? "bg-zinc-900 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
            }`}
          >
            <Stack className="w-4 h-4" />
            My Skills
          </Link>
        )}
      </div>

      {/* Action Buttons & Status */}
      <div className="flex items-center gap-2.5">
        <div className="h-5 w-px bg-zinc-200 mx-0.5" />

        {/* User Mini Avatar Pill */}
        <Link
          href={`/profile/${user?.username || "alexmorgan"}`}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-zinc-100/80 border border-zinc-200 hover:bg-zinc-200/80 transition-colors"
        >
          <img
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
            alt="User"
            className="w-6 h-6 rounded-full object-cover bg-white ring-1 ring-zinc-200"
          />
          <span className="text-xs font-semibold text-zinc-800 hidden sm:inline">
            {user?.name?.split(" ")[0] || "Alex"}
          </span>
        </Link>
      </div>
    </header>
  );
}
