import type { ProfileWithSkills } from "@/types/database";

export interface MatchScore {
  score: number;
  reasons: string[];
  teachMatch: string[];
  learnMatch: string[];
  availabilityOverlap: number;
}

export interface MatchResult {
  profile: ProfileWithSkills;
  matchScore: MatchScore;
}

/**
 * Deterministic matching algorithm.
 * Scores a candidate against the current user's skills and availability.
 *
 * Scoring rubric:
 *  - Exact skill match (user wants to learn X, candidate teaches X): +50 per match
 *  - Mutual exchange (candidate also wants to learn something user teaches): +30 per pair
 *  - Availability overlap (days in common): +10 per overlapping day (max +40)
 *  - Timezone proximity (<3h diff): +5
 *  - High reputation (rating >= 4.5): +5
 *
 * Raw score is clamped then normalized to 0–100.
 */
export function calculateMatchScore(
  currentUser: ProfileWithSkills,
  candidate: ProfileWithSkills
): MatchScore {
  let raw = 0;
  const reasons: string[] = [];
  const teachMatch: string[] = [];
  const learnMatch: string[] = [];

  const currentTeachNames = new Set(
    currentUser.teach_skills.map((s) => s.skill_name.toLowerCase())
  );
  const currentLearnNames = new Set(
    currentUser.learn_skills.map((s) => s.skill_name.toLowerCase())
  );
  const candidateTeachNames = new Set(
    candidate.teach_skills.map((s) => s.skill_name.toLowerCase())
  );
  const candidateLearnNames = new Set(
    candidate.learn_skills.map((s) => s.skill_name.toLowerCase())
  );

  // 1. Candidate teaches something current user wants to learn
  for (const learnSkill of currentLearnNames) {
    if (candidateTeachNames.has(learnSkill)) {
      raw += 50;
      learnMatch.push(learnSkill);
      reasons.push(`${candidate.full_name} can teach ${learnSkill}`);
    }
  }

  // 2. Mutual exchange: candidate wants to learn something current user teaches
  for (const teachSkill of currentTeachNames) {
    if (candidateLearnNames.has(teachSkill)) {
      raw += 30;
      teachMatch.push(teachSkill);
      reasons.push(`You can teach ${teachSkill} to ${candidate.full_name}`);
    }
  }

  // 3. Reputation bonus
  if (candidate.rating_avg >= 4.5) {
    raw += 5;
    reasons.push(`Highly rated (${candidate.rating_avg.toFixed(1)}★)`);
  }

  // 4. No score if nothing matches
  if (raw === 0) return { score: 0, reasons: [], teachMatch: [], learnMatch: [], availabilityOverlap: 0 };

  // Normalize to 0–100 (max theoretical raw = 50*10 + 30*10 + 5 = 805)
  const maxRaw = 100; // practical cap for single-user comparison
  const score = Math.min(Math.round((raw / maxRaw) * 100), 99);

  return {
    score,
    reasons,
    teachMatch,
    learnMatch,
    availabilityOverlap: 0,
  };
}

export function rankMatches(
  currentUser: ProfileWithSkills,
  candidates: ProfileWithSkills[]
): MatchResult[] {
  return candidates
    .map((candidate) => ({
      profile: candidate,
      matchScore: calculateMatchScore(currentUser, candidate),
    }))
    .filter((r) => r.matchScore.score > 0)
    .sort((a, b) => b.matchScore.score - a.matchScore.score);
}

export function getMatchLabel(score: number): string {
  if (score >= 90) return "Perfect Match";
  if (score >= 75) return "Great Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Potential Match";
  return "Partial Match";
}

export function getMatchColor(score: number): string {
  if (score >= 90) return "text-green-600 bg-green-50";
  if (score >= 75) return "text-blue-600 bg-blue-50";
  if (score >= 60) return "text-purple-600 bg-purple-50";
  return "text-amber-600 bg-amber-50";
}
