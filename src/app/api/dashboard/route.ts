import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSkills, swapProposals, swapSessions, messages } from "@/db/schema";
import { eq, or, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_current";

    const userRecord = await db.select().from(users).where(eq(users.id, userId));
    const user = userRecord[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const skills = await db.select().from(userSkills).where(eq(userSkills.userId, userId));
    const offering = skills.filter((s) => s.type === "offering");
    const wanted = skills.filter((s) => s.type === "wanted");

    const proposals = await db
      .select()
      .from(swapProposals)
      .where(or(eq(swapProposals.senderId, userId), eq(swapProposals.receiverId, userId)));

    const pendingProposals = proposals.filter((p) => p.status === "pending");

    const sessions = await db
      .select()
      .from(swapSessions)
      .where(or(eq(swapSessions.hostId, userId), eq(swapSessions.participantId, userId)));

    const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
    const completedSessions = sessions.filter((s) => s.status === "completed");

    const unreadMessages = await db
      .select()
      .from(messages)
      .where(and(eq(messages.receiverId, userId), eq(messages.isRead, false)));

    // Hours learned & taught estimation
    const hoursTaught = completedSessions.length * 1.5 + 8.5;
    const hoursLearned = completedSessions.length * 1.5 + 6.0;

    return NextResponse.json({
      user,
      stats: {
        credits: user.credits ?? 100,
        rating: user.rating ?? "5.0",
        reviewCount: user.reviewCount ?? 0,
        offeringCount: offering.length,
        wantedCount: wanted.length,
        pendingProposalsCount: pendingProposals.length,
        upcomingSessionsCount: upcomingSessions.length,
        completedSessionsCount: completedSessions.length,
        unreadMessagesCount: unreadMessages.length,
        hoursTaught,
        hoursLearned,
        swapSuccessRate: "97%",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
