import { NextResponse } from "next/server";
import { prisma } from "@../../../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { title, content, videoUrl, order } = await req.json();
    const chapterId = Number(params.chapterId);

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        order: order ?? 0,
        chapterId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
