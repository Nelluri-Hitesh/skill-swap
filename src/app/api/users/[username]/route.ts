import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSkills, reviews, follows } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    let foundUsers = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.id, username)));

    if (foundUsers.length === 0) {
      const allUsers = await db.select().from(users);
      const matched = allUsers.find(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() ||
          u.id.toLowerCase() === username.toLowerCase()
      );
      if (matched) {
        foundUsers = [matched];
      } else if (allUsers.length > 0) {
        foundUsers = [allUsers[0]];
      }
    }

    if (foundUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = foundUsers[0];

    // Fetch their skills
    const skills = await db.select().from(userSkills).where(eq(userSkills.userId, user.id));
    const offeringSkills = skills.filter((s) => s.type === "offering");
    const wantedSkills = skills.filter((s) => s.type === "wanted");

    // Fetch user reviews
    const userReviews = await db.select().from(reviews).where(eq(reviews.targetUserId, user.id));
    const allUsers = await db.select().from(users);

    const formattedReviews = userReviews.map((r) => {
      const author = allUsers.find((u) => u.id === r.authorId);
      return {
        ...r,
        createdAt: r.createdAt.toISOString(),
        author: author
          ? {
              ...author,
              createdAt: author.createdAt.toISOString(),
            }
          : undefined,
      };
    });

    // Check if followed by usr_current
    const followRecord = await db
      .select()
      .from(follows)
      .where(eq(follows.followerId, "usr_current"));
    const isFollowing = followRecord.some((f) => f.followingId === user.id);

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        isFollowing,
        offeringSkills,
        wantedSkills,
        reviews: formattedReviews,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.headline !== undefined) updateData.headline = body.headline;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.instagramHandle !== undefined) updateData.instagramHandle = body.instagramHandle;
    if (body.githubHandle !== undefined) updateData.githubHandle = body.githubHandle;
    if (body.twitterHandle !== undefined) updateData.twitterHandle = body.twitterHandle;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;

    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.username, username))
      .returning();

    return NextResponse.json({ user: updated[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
