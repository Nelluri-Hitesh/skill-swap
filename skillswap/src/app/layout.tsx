import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillSwap – Teach What You Know. Learn What You Want.",
  description:
    "SkillSwap is a peer-to-peer skill exchange platform. Find mentors, teach others, and grow your knowledge through real human connections.",
  keywords: ["skill exchange", "peer learning", "mentorship", "education", "community"],
  openGraph: {
    title: "SkillSwap",
    description: "Teach What You Know. Learn What You Want.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
