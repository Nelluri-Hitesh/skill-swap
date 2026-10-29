import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSkills, follows } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { MatchRecommendation, UserSkill } from "@/types";

function formatSkill(s: any): UserSkill {
  return {
    id: s.id,
    userId: s.userId,
    type: s.type as "offering" | "wanted",
    skillName: s.skillName,
    category: s.category,
    proficiency: s.proficiency as any,
    description: s.description ?? undefined,
    yearsExperience: s.yearsExperience ?? 0,
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : undefined,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get("userId") || "usr_current";

    // 1. Get current user's skills
    const mySkills = await db.select().from(userSkills).where(eq(userSkills.userId, currentUserId));
    const myOffering = mySkills.filter((s) => s.type === "offering");
    const myWanted = mySkills.filter((s) => s.type === "wanted");

    // 2. Get all other users
    const otherUsers = await db.select().from(users).where(ne(users.id, currentUserId));

    // 3. Get all other users' skills
    const allSkills = await db.select().from(userSkills);

    // 4. Get current user's following list
    const myFollows = await db.select().from(follows).where(eq(follows.followerId, currentUserId));
    const followedUserIds = new Set(myFollows.map((f) => f.followingId));

    const matches: MatchRecommendation[] = [];

    for (const otherUser of otherUsers) {
      const theirSkills = allSkills.filter((s) => s.userId === otherUser.id);
      const theirOffering = theirSkills.filter((s) => s.type === "offering");
      const theirWanted = theirSkills.filter((s) => s.type === "wanted");

      // What they can teach current user
      const canTeachYou: UserSkill[] = [];
      for (const theirOffer of theirOffering) {
        const matchesMyWanted = myWanted.some(
          (myW) =>
            myW.skillName.toLowerCase().includes(theirOffer.skillName.toLowerCase()) ||
            theirOffer.skillName.toLowerCase().includes(myW.skillName.toLowerCase()) ||
            myW.category.toLowerCase() === theirOffer.category.toLowerCase()
        );
        if (matchesMyWanted) {
          canTeachYou.push(formatSkill(theirOffer));
        }
      }

      // What current user can teach them
      const wantsFromYou: UserSkill[] = [];
      for (const myOffer of myOffering) {
        const matchesTheirWanted = theirWanted.some(
          (theirW) =>
            theirW.skillName.toLowerCase().includes(myOffer.skillName.toLowerCase()) ||
            myOffer.skillName.toLowerCase().includes(theirW.skillName.toLowerCase()) ||
            theirW.category.toLowerCase() === myOffer.category.toLowerCase()
        );
        if (matchesTheirWanted) {
          wantsFromYou.push(formatSkill(myOffer));
        }
      }

      // Calculate 2-way exchange match score
      let score = 55;
      if (canTeachYou.length > 0) score += 20;
      if (wantsFromYou.length > 0) score += 18;
      if (canTeachYou.length > 0 && wantsFromYou.length > 0) score += 5;
      if (otherUser.isOnline) score += 1;

      score = Math.min(score, 99);

      matches.push({
        user: {
          ...otherUser,
          credits: otherUser.credits ?? 100,
          rating: otherUser.rating ?? "5.0",
          reviewCount: otherUser.reviewCount ?? 0,
          isOnline: otherUser.isOnline ?? false,
          headline: otherUser.headline ?? undefined,
          bio: otherUser.bio ?? undefined,
          location: otherUser.location ?? undefined,
          instagramHandle: otherUser.instagramHandle ?? undefined,
          githubHandle: otherUser.githubHandle ?? undefined,
          twitterHandle: otherUser.twitterHandle ?? undefined,
          createdAt: otherUser.createdAt ? otherUser.createdAt.toISOString() : new Date().toISOString(),
          isFollowing: followedUserIds.has(otherUser.id),
        },
        score,
        canTeachYou: canTeachYou.length > 0 ? canTeachYou : theirOffering.slice(0, 2).map(formatSkill),
        wantsFromYou: wantsFromYou.length > 0 ? wantsFromYou : myOffering.slice(0, 2).map(formatSkill),
        commonInterests: [
          ...new Set([...canTeachYou.map((s) => s.category), ...wantsFromYou.map((s) => s.category)]),
        ],
      });
    }

    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({ matches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
