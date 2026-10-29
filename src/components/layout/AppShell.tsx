"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/onboarding");

  if (isAuthPage) {
    return <main className="min-h-screen bg-zinc-950 text-zinc-100">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white font-sans">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa]">
        <TopNavbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
