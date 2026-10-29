import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, username } = body;

    // For demo/mock authentication:
    // If username or email matches an existing user, return that user
    let user = null;
    if (email) {
      const found = await db.select().from(users).where(eq(users.email, email));
      if (found.length > 0) user = found[0];
    }

    if (!user && username) {
      const found = await db.select().from(users).where(eq(users.username, username));
      if (found.length > 0) user = found[0];
    }

    // If still no user, either return usr_current or create a new user account
    if (!user) {
      if (email || username) {
        const newId = `usr_${Date.now().toString(36)}`;
        const cleanUsername = (username || email?.split("@")[0] || "user").toLowerCase().replace(/[^a-z0-9_]/g, "");
        const cleanName = name || "SkillSwapper";
        
        const inserted = await db.insert(users).values({
          id: newId,
          name: cleanName,
          username: cleanUsername,
          email: email || `${cleanUsername}@skillswap.dev`,
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
          headline: "New Skill Explorer",
          bio: "Excited to share knowledge and learn from peers on SkillSwap!",
          location: "Global",
          credits: 100,
          rating: "5.0",
          reviewCount: 0,
          isOnline: true,
          createdAt: new Date(),
        }).returning();

        user = inserted[0];
      } else {
        // Fallback default
        const current = await db.select().from(users).where(eq(users.id, "usr_current"));
        user = current[0];
      }
    }

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user?.createdAt?.toISOString?.() ?? new Date().toISOString(),
      },
      token: "demo_token_" + Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
