import { NextResponse } from "next/server";
import { db } from "@/db";
import { swapProposals, users, notifications, swapSessions } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_current";

    const proposals = await db
      .select()
      .from(swapProposals)
      .where(or(eq(swapProposals.senderId, userId), eq(swapProposals.receiverId, userId)))
      .orderBy(desc(swapProposals.createdAt));

    const allUsers = await db.select().from(users);

    const enriched = proposals.map((p) => {
      const sender = allUsers.find((u) => u.id === p.senderId);
      const receiver = allUsers.find((u) => u.id === p.receiverId);
      return {
        ...p,
        matchScore: p.matchScore ?? 85,
        durationMinutes: p.durationMinutes ?? 45,
        status: (p.status ?? "pending") as "pending" | "accepted" | "declined" | "completed" | "cancelled",
        createdAt: p.createdAt.toISOString(),
        sender: sender
          ? {
              ...sender,
              createdAt: sender.createdAt.toISOString(),
              credits: sender.credits ?? 100,
              rating: sender.rating ?? "5.0",
              reviewCount: sender.reviewCount ?? 0,
              isOnline: sender.isOnline ?? false,
              headline: sender.headline ?? undefined,
              bio: sender.bio ?? undefined,
              location: sender.location ?? undefined,
              instagramHandle: sender.instagramHandle ?? undefined,
              githubHandle: sender.githubHandle ?? undefined,
              twitterHandle: sender.twitterHandle ?? undefined,
            }
          : undefined,
        receiver: receiver
          ? {
              ...receiver,
              createdAt: receiver.createdAt.toISOString(),
              credits: receiver.credits ?? 100,
              rating: receiver.rating ?? "5.0",
              reviewCount: receiver.reviewCount ?? 0,
              isOnline: receiver.isOnline ?? false,
              headline: receiver.headline ?? undefined,
              bio: receiver.bio ?? undefined,
              location: receiver.location ?? undefined,
              instagramHandle: receiver.instagramHandle ?? undefined,
              githubHandle: receiver.githubHandle ?? undefined,
              twitterHandle: receiver.twitterHandle ?? undefined,
            }
          : undefined,
      };
    });

    return NextResponse.json({ proposals: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      senderId = "usr_current",
      receiverId,
      offeredSkill,
      wantedSkill,
      message,
      proposedDate,
      durationMinutes = 45,
      matchScore = 90,
    } = body;

    if (!receiverId || !offeredSkill || !wantedSkill || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const proposalId = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newProposal = {
      id: proposalId,
      senderId,
      receiverId,
      offeredSkill,
      wantedSkill,
      message,
      status: "pending",
      durationMinutes: Number(durationMinutes),
      proposedDate: proposedDate || "Next Monday at 3:00 PM EST",
      matchScore: Number(matchScore),
      createdAt: new Date(),
    };

    const inserted = await db.insert(swapProposals).values(newProposal).returning();

    // Trigger notification to receiver
    await db.insert(notifications).values({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: receiverId,
      actorId: senderId,
      type: "proposal_received",
      title: "New Swap Proposal!",
      message: `Someone proposed a skill swap: ${offeredSkill} for ${wantedSkill}`,
      link: "/matches",
      isRead: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ proposal: inserted[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Proposal ID and status required" }, { status: 400 });
    }

    const updated = await db
      .update(swapProposals)
      .set({ status })
      .where(eq(swapProposals.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const prop = updated[0];

    // If accepted, schedule an upcoming session
    if (status === "accepted") {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await db.insert(swapSessions).values({
        id: sessionId,
        proposalId: prop.id,
        hostId: prop.receiverId,
        participantId: prop.senderId,
        skillTaughtByHost: prop.wantedSkill,
        skillTaughtByParticipant: prop.offeredSkill,
        scheduledAt: prop.proposedDate,
        durationMinutes: prop.durationMinutes ?? 45,
        status: "upcoming",
        meetingLink: `https://meet.jit.si/skillswap-${prop.id.substring(5, 12)}`,
        notes: `Confirmed swap session between peers.`,
        createdAt: new Date(),
      });

      // Send notification to sender
      await db.insert(notifications).values({
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: prop.senderId,
        actorId: prop.receiverId,
        type: "proposal_accepted",
        title: "Swap Proposal Accepted! 🎉",
        message: `Your skill exchange session is scheduled for ${prop.proposedDate}`,
        link: "/sessions",
        isRead: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ proposal: prop });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
