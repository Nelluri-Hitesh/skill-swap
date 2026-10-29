import { cn } from "@/lib/utils";

const levelColors = {
  BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-100",
  INTERMEDIATE: "bg-blue-50 text-blue-700 border-blue-100",
  ADVANCED: "bg-purple-50 text-purple-700 border-purple-100",
};

const levelLabels = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

interface SkillBadgeProps {
  name: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  type?: "TEACH" | "LEARN";
  className?: string;
}

export function SkillBadge({ name, level, type, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        level ? levelColors[level] : type === "TEACH"
          ? "bg-blue-50 text-blue-700 border-blue-100"
          : "bg-amber-50 text-amber-700 border-amber-100",
        className
      )}
    >
      {type === "TEACH" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      {type === "LEARN" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
      {name}
      {level && (
        <span className="opacity-60 text-[10px]">{levelLabels[level]}</span>
      )}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-100",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CANCELLED: "bg-gray-50 text-gray-600 border-gray-200",
  IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-100",
  Next: "bg-blue-600 text-white border-blue-600",
  Upcoming: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] || "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize",
        style,
        className
      )}
    >
      {status.toLowerCase().replace(/_/g, " ")}
    </span>
  );
}
