import { NextResponse } from "next/server";
import { db } from "@/db";
import { seedDatabase } from "@/lib/seed";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    // Run seed if needed
    try {
      await seedDatabase();
    } catch {
      // Table might not exist before push or already seeded
    }
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
  }
}
