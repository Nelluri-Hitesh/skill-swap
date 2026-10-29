import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSwap – Peer-to-Peer Skill Exchange Platform",
  description:
    "Exchange your skills, find friends like Instagram, learn anything 1-on-1 without spending cash.",
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-[#fafafa] text-zinc-900 min-h-screen antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
