import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, users, notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    let query = db.select().from(reviews).orderBy(desc(reviews.createdAt));
    const allReviews = targetUserId 
      ? await db.select().from(reviews).where(eq(reviews.targetUserId, targetUserId)).orderBy(desc(reviews.createdAt))
      : await query;

    const allUsers = await db.select().from(users);

    const formatted = allReviews.map((r) => {
      const author = allUsers.find((u) => u.id === r.authorId);
      return {
        ...r,
        createdAt: r.createdAt.toISOString(),
        author: author
          ? {
              ...author,
              createdAt: author.createdAt.toISOString(),
              credits: author.credits ?? 100,
              rating: author.rating ?? "5.0",
              reviewCount: author.reviewCount ?? 0,
              isOnline: author.isOnline ?? false,
            }
          : undefined,
      };
    });

    return NextResponse.json({ reviews: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorId = "usr_current", targetUserId, skillName, rating, comment } = body;

    if (!targetUserId || !skillName || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newReview = {
      id: reviewId,
      authorId,
      targetUserId,
      skillName,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    const inserted = await db.insert(reviews).values(newReview).returning();

    // Notify user of new review
    await db.insert(notifications).values({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: targetUserId,
      actorId: authorId,
      type: "review_received",
      title: "New 5-Star Skill Review! ⭐",
      message: `You received a review for your ${skillName} session!`,
      link: "/reviews",
      isRead: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ review: inserted[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
