import { NextResponse } from "next/server";
import { prisma } from "@../../../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { title } = await req.json();
    const courseId = Number(params.courseId);

    const chapter = await prisma.chapter.create({
      data: {
        title,
        courseId,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("CREATE CHAPTER ERROR:", error);
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
  }
}
