import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string | Date | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Coding: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  Design: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  Languages: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  Music: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  Marketing: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  Business: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  Lifestyle: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  Photography: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
};
