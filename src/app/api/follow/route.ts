import { NextResponse } from "next/server";
import { db } from "@/db";
import { follows, notifications, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { followerId = "usr_current", followingId } = body;

    if (!followingId) {
      return NextResponse.json({ error: "followingId required" }, { status: 400 });
    }

    // Check if already following
    const existing = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));

    if (existing.length > 0) {
      // Unfollow
      await db
        .delete(follows)
        .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));

      return NextResponse.json({ following: false });
    }

    // Follow
    const followId = `fol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(follows).values({
      id: followId,
      followerId,
      followingId,
      createdAt: new Date(),
    });

    // Notify user
    const follower = await db.select().from(users).where(eq(users.id, followerId));
    const followerName = follower[0]?.name || "Someone";

    await db.insert(notifications).values({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: followingId,
      actorId: followerId,
      type: "new_follower",
      title: "New Follower! 👤",
      message: `${followerName} started following your skill profile.`,
      link: `/profile/${follower[0]?.username || "alexmorgan"}`,
      isRead: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ following: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
