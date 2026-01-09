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
      orderBy: { id: "desc" }, // opsional: terbaru muncul dulu
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
