import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(req: Request) {
  const { title, videoUrl, content, chapterId } = await req.json();

  const lesson = await prisma.lesson.create({
    data: {
      title,
      videoUrl,
      content,
      chapterId,
    },
  });

  return NextResponse.json(lesson);
}
