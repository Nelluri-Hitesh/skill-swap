import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users } from "@/db/schema";
import { eq, or, and, asc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get("userId") || "usr_current";
    const partnerId = searchParams.get("partnerId");

    const allUsers = await db.select().from(users);

    if (partnerId) {
      // Fetch conversation with specific partner
      const chat = await db
        .select()
        .from(messages)
        .where(
          or(
            and(eq(messages.senderId, currentUserId), eq(messages.receiverId, partnerId)),
            and(eq(messages.senderId, partnerId), eq(messages.receiverId, currentUserId))
          )
        )
        .orderBy(asc(messages.createdAt));

      // Mark messages received by current user as read
      await db
        .update(messages)
        .set({ isRead: true })
        .where(and(eq(messages.senderId, partnerId), eq(messages.receiverId, currentUserId)));

      const formatted = chat.map((m) => {
        const sender = allUsers.find((u) => u.id === m.senderId);
        return {
          ...m,
          isRead: m.isRead ?? false,
          createdAt: m.createdAt.toISOString(),
          sender: sender
            ? {
                ...sender,
                createdAt: sender.createdAt.toISOString(),
                credits: sender.credits ?? 100,
                rating: sender.rating ?? "5.0",
                reviewCount: sender.reviewCount ?? 0,
                isOnline: sender.isOnline ?? false,
              }
            : undefined,
        };
      });

      return NextResponse.json({ messages: formatted });
    }

    // Otherwise return list of recent conversation partners
    const userMessages = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, currentUserId), eq(messages.receiverId, currentUserId)))
      .orderBy(asc(messages.createdAt));

    // Group by partner
    const partnerMap = new Map<string, { lastMessage: any; unreadCount: number }>();

    for (const msg of userMessages) {
      const partnerId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
      const existing = partnerMap.get(partnerId) || { lastMessage: msg, unreadCount: 0 };
      existing.lastMessage = msg;
      if (msg.receiverId === currentUserId && !msg.isRead) {
        existing.unreadCount++;
      }
      partnerMap.set(partnerId, existing);
    }

    const conversations = Array.from(partnerMap.entries()).map(([pId, data]) => {
      const partner = allUsers.find((u) => u.id === pId);
      return {
        partnerId: pId,
        partner: partner
          ? {
              ...partner,
              createdAt: partner.createdAt.toISOString(),
              credits: partner.credits ?? 100,
              rating: partner.rating ?? "5.0",
              reviewCount: partner.reviewCount ?? 0,
              isOnline: partner.isOnline ?? false,
              headline: partner.headline ?? undefined,
            }
          : null,
        lastMessage: {
          ...data.lastMessage,
          createdAt: data.lastMessage.createdAt.toISOString(),
        },
        unreadCount: data.unreadCount,
      };
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId = "usr_current", receiverId, content } = body;

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: "Missing receiverId or content" }, { status: 400 });
    }

    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId,
      receiverId,
      content: content.trim(),
      isRead: false,
      createdAt: new Date(),
    };

    const inserted = await db.insert(messages).values(newMsg).returning();
    return NextResponse.json({
      message: {
        ...inserted[0],
        createdAt: inserted[0].createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
