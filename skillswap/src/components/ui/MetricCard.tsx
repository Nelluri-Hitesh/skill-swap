import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  supporting: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}

export function MetricCard({
  title,
  value,
  supporting,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5 transition-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1 leading-none">
            {value}
          </p>
        </div>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-4.5 h-4.5", iconColor)} style={{ width: 18, height: 18 }} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trendUp ? "text-emerald-600" : "text-gray-500"
            )}
          >
            {trendUp ? "↑" : ""} {trend}
          </span>
        )}
        <span className="text-xs text-gray-400">{supporting}</span>
      </div>
    </div>
  );
}
