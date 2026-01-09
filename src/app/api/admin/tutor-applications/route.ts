import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requireAdmin();

    const applications = await prisma.tutorApplication.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log("✅ Fetched all tutor applications:", applications.length);

    return NextResponse.json(applications);
  } catch (err: any) {
    console.error("❌ Error fetching applications:", err);
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
