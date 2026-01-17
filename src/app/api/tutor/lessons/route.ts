import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, videoUrl, content, chapterId, fileUrl } = await req.json();

    const lesson = await prisma.lesson.create({
      data: {
        title,
        videoUrl: videoUrl || null,
        content: content || null,
        fileUrl: fileUrl || null,
        chapterId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
