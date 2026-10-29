import { NextResponse } from "next/server";
import { db } from "@/db";
import { swapSessions, users, notifications } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_current";

    const sessions = await db
      .select()
      .from(swapSessions)
      .where(or(eq(swapSessions.hostId, userId), eq(swapSessions.participantId, userId)))
      .orderBy(desc(swapSessions.createdAt));

    const allUsers = await db.select().from(users);

    const enriched = sessions.map((s) => {
      const host = allUsers.find((u) => u.id === s.hostId);
      const participant = allUsers.find((u) => u.id === s.participantId);
      return {
        ...s,
        durationMinutes: s.durationMinutes ?? 45,
        status: (s.status ?? "upcoming") as "upcoming" | "in_progress" | "completed" | "cancelled",
        createdAt: s.createdAt.toISOString(),
        notes: s.notes ?? undefined,
        meetingLink: s.meetingLink ?? undefined,
        host: host
          ? {
              ...host,
              createdAt: host.createdAt.toISOString(),
              credits: host.credits ?? 100,
              rating: host.rating ?? "5.0",
              reviewCount: host.reviewCount ?? 0,
              isOnline: host.isOnline ?? false,
              headline: host.headline ?? undefined,
              bio: host.bio ?? undefined,
              location: host.location ?? undefined,
              instagramHandle: host.instagramHandle ?? undefined,
              githubHandle: host.githubHandle ?? undefined,
              twitterHandle: host.twitterHandle ?? undefined,
            }
          : undefined,
        participant: participant
          ? {
              ...participant,
              createdAt: participant.createdAt.toISOString(),
              credits: participant.credits ?? 100,
              rating: participant.rating ?? "5.0",
              reviewCount: participant.reviewCount ?? 0,
              isOnline: participant.isOnline ?? false,
              headline: participant.headline ?? undefined,
              bio: participant.bio ?? undefined,
              location: participant.location ?? undefined,
              instagramHandle: participant.instagramHandle ?? undefined,
              githubHandle: participant.githubHandle ?? undefined,
              twitterHandle: participant.twitterHandle ?? undefined,
            }
          : undefined,
      };
    });

    return NextResponse.json({ sessions: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      hostId = "usr_current",
      participantId,
      skillTaughtByHost,
      skillTaughtByParticipant,
      scheduledAt,
      durationMinutes = 45,
      notes = "",
    } = body;

    if (!participantId || !skillTaughtByHost || !skillTaughtByParticipant || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newSession = {
      id: sessionId,
      proposalId: null,
      hostId,
      participantId,
      skillTaughtByHost,
      skillTaughtByParticipant,
      scheduledAt,
      durationMinutes: Number(durationMinutes),
      status: "upcoming",
      meetingLink: `https://meet.jit.si/skillswap-${Date.now().toString(36)}`,
      notes,
      createdAt: new Date(),
    };

    try {
      const inserted = await db.insert(swapSessions).values(newSession).returning();

      // Notify participant
      await db.insert(notifications).values({
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: participantId,
        actorId: hostId,
        type: "session_scheduled",
        title: "New Session Scheduled! 🗓️",
        message: `You have a new swap session for ${skillTaughtByHost} on ${scheduledAt}`,
        link: "/sessions",
        isRead: false,
        createdAt: new Date(),
      });

      return NextResponse.json({ session: inserted[0] }, { status: 201 });
    } catch (e) {
      return NextResponse.json({ session: newSession }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    const updated = await db
      .update(swapSessions)
      .set(updateFields)
      .where(eq(swapSessions.id, id))
      .returning();

    return NextResponse.json({ session: updated[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
