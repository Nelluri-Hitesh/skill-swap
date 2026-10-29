import { cn, getInitials } from "@/lib/utils";
import { getMatchColor, getMatchLabel } from "@/lib/matching";
import { Star, MapPin } from "lucide-react";
import type { ProfileWithSkills } from "@/types/database";
import type { MatchScore } from "@/lib/matching";
import { SkillBadge } from "./SkillBadge";

interface MatchCardProps {
  profile: ProfileWithSkills;
  matchScore: MatchScore;
  onViewProfile: () => void;
  onConnect: () => void;
  isConnected?: boolean;
  isPending?: boolean;
  compact?: boolean;
}

export function MatchCard({
  profile,
  matchScore,
  onViewProfile,
  onConnect,
  isConnected,
  isPending,
  compact,
}: MatchCardProps) {
  const scoreColor = getMatchColor(matchScore.score);
  const scoreLabel = getMatchLabel(matchScore.score);

  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-100 shadow-card p-4 transition-card",
      compact ? "p-4" : "p-5"
    )}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
          ) : getInitials(profile.full_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 leading-none">
                {profile.full_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                {profile.location && (
                  <div className="flex items-center gap-0.5 text-[11px] text-gray-400">
                    <MapPin className="w-2.5 h-2.5" />
                    {profile.location}
                  </div>
                )}
              </div>
            </div>
            {/* Match score */}
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", scoreColor)}>
              {matchScore.score}% {compact ? "" : scoreLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        <span className="text-xs font-medium text-gray-700">{profile.rating_avg.toFixed(1)}</span>
        <span className="text-[11px] text-gray-400">({profile.rating_count} reviews)</span>
        <span className="text-gray-200 mx-1">·</span>
        <span className="text-[11px] text-gray-400">{profile.completed_sessions_count} sessions</span>
      </div>

      {/* Skill match reasons */}
      {!compact && matchScore.reasons.length > 0 && (
        <div className="mb-3 space-y-1">
          {matchScore.reasons.slice(0, 2).map((reason, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="text-emerald-500 font-bold">✓</span>
              {reason}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {profile.teach_skills.slice(0, 2).map((s) => (
          <SkillBadge key={s.id} name={s.skill_name} type="TEACH" />
        ))}
        {profile.learn_skills.slice(0, 2).map((s) => (
          <SkillBadge key={s.id} name={s.skill_name} type="LEARN" />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onViewProfile}
          className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
        {!isConnected && (
          <button
            onClick={onConnect}
            disabled={isPending}
            className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isPending ? "Pending…" : "Connect"}
          </button>
        )}
        {isConnected && (
          <button
            onClick={onViewProfile}
            className="flex-1 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg"
          >
            Connected ✓
          </button>
        )}
      </div>
    </div>
  );
}
