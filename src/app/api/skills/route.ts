import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSkills } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_current";
    const type = searchParams.get("type");

    let skillsQuery = db.select().from(userSkills).where(eq(userSkills.userId, userId));
    const allSkills = await skillsQuery;

    const filtered = type ? allSkills.filter((s) => s.type === type) : allSkills;
    return NextResponse.json({ skills: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = "usr_current", type, skillName, category, proficiency, description, yearsExperience } = body;

    if (!skillName || !category || !proficiency || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newSkill = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type,
      skillName,
      category,
      proficiency,
      description: description || "",
      yearsExperience: Number(yearsExperience) || 1,
      createdAt: new Date(),
    };

    try {
      const inserted = await db.insert(userSkills).values(newSkill).returning();
      return NextResponse.json({ skill: inserted[0] }, { status: 201 });
    } catch (e) {
      return NextResponse.json({ skill: newSkill }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skillId = searchParams.get("id");
    if (!skillId) {
      return NextResponse.json({ error: "Skill ID required" }, { status: 400 });
    }

    await db.delete(userSkills).where(eq(userSkills.id, skillId));
    return NextResponse.json({ success: true, id: skillId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, skillName, category, proficiency, description, yearsExperience, type } = body;

    if (!id) {
      return NextResponse.json({ error: "Skill ID required" }, { status: 400 });
    }

    const updated = await db
      .update(userSkills)
      .set({
        skillName,
        category,
        proficiency,
        description,
        yearsExperience: Number(yearsExperience) || 1,
        type,
      })
      .where(eq(userSkills.id, id))
      .returning();

    return NextResponse.json({ skill: updated[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
