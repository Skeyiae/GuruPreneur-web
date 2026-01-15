import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
      },
      orderBy: { id: "desc" },
    });

    // 🔒 hardening (opsional tapi aman)
    return NextResponse.json(
      courses.map(c => ({
        ...c,
        id: Number(c.id),
      }))
    );
  } catch (error: any) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
