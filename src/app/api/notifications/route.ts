import { NextResponse } from "next/server";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_current";

    const notifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    const allUsers = await db.select().from(users);

    const enriched = notifs.map((n) => {
      const actor = n.actorId ? allUsers.find((u) => u.id === n.actorId) : undefined;
      return {
        ...n,
        isRead: n.isRead ?? false,
        link: n.link ?? undefined,
        createdAt: n.createdAt.toISOString(),
        actor: actor
          ? {
              ...actor,
              createdAt: actor.createdAt.toISOString(),
              credits: actor.credits ?? 100,
              rating: actor.rating ?? "5.0",
              reviewCount: actor.reviewCount ?? 0,
              isOnline: actor.isOnline ?? false,
            }
          : undefined,
      };
    });

    const unreadCount = enriched.filter((n) => !n.isRead).length;

    return NextResponse.json({ notifications: enriched, unreadCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, markAll, userId = "usr_current" } = body;

    if (markAll) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
      return NextResponse.json({ success: true });
    }

    if (id) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, id));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
