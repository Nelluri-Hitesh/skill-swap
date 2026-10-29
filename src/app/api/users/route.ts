import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSkills, follows } from "@/db/schema";
import { eq, or, ilike, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const currentUserId = searchParams.get("userId") || "usr_current";

    // Get following list
    const myFollows = await db.select().from(follows).where(eq(follows.followerId, currentUserId));
    const followedUserIds = new Set(myFollows.map((f) => f.followingId));

    // Get all users
    const allUsers = await db.select().from(users);
    const allSkills = await db.select().from(userSkills);

    // Group skills by user
    const usersWithSkills = allUsers.map((u) => {
      const skills = allSkills.filter((s) => s.userId === u.id);
      const offering = skills.filter((s) => s.type === "offering");
      const wanted = skills.filter((s) => s.type === "wanted");
      return {
        ...u,
        credits: u.credits ?? 100,
        rating: u.rating ?? "5.0",
        reviewCount: u.reviewCount ?? 0,
        isOnline: u.isOnline ?? false,
        headline: u.headline ?? undefined,
        bio: u.bio ?? undefined,
        location: u.location ?? undefined,
        instagramHandle: u.instagramHandle ?? undefined,
        githubHandle: u.githubHandle ?? undefined,
        twitterHandle: u.twitterHandle ?? undefined,
        createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
        isFollowing: followedUserIds.has(u.id),
        offeringSkills: offering,
        wantedSkills: wanted,
      };
    });

    // Apply search filter if present
    let filtered = usersWithSkills;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          (u.headline && u.headline.toLowerCase().includes(q)) ||
          (u.bio && u.bio.toLowerCase().includes(q)) ||
          u.offeringSkills.some((s) => s.skillName.toLowerCase().includes(q)) ||
          u.wantedSkills.some((s) => s.skillName.toLowerCase().includes(q))
      );
    }

    if (category && category !== "All") {
      filtered = filtered.filter(
        (u) =>
          u.offeringSkills.some((s) => s.category.toLowerCase() === category.toLowerCase()) ||
          u.wantedSkills.some((s) => s.category.toLowerCase() === category.toLowerCase())
      );
    }

    return NextResponse.json({ users: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
