"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { useSkillSwapStore } from "@/lib/store";

interface TopNavbarProps {
  profile?: Profile | null;
}

export function TopNavbar({ profile }: TopNavbarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser } = useSkillSwapStore();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    router.push("/login");
  };

  const avatarSrc = currentUser.avatar_url || "/avatar-nani.jpg";
  const displayName = currentUser.full_name || profile?.username || "nani";

  return (
    <header className="h-14 flex items-center justify-end px-8 z-30">
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-slate-100/60 transition-colors cursor-pointer"
        >
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover border border-slate-100"
          />
          <span className="text-xs font-medium text-slate-800 leading-none">
            {displayName}
          </span>
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1.5 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-semibold text-slate-800">
                  {displayName}
                </div>
                <div className="text-[10px] text-slate-400">
                  @{profile?.username || "nani"}
                </div>
              </div>
              <button
                onClick={() => {
                  router.push(`/profile/${profile?.username || "nani"}`);
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <User className="w-3.5 h-3.5" /> View Profile
              </button>
              <button
                onClick={() => {
                  router.push("/settings");
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
