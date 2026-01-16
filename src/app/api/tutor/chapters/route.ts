import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export async function POST(req: Request) {
  const { title, courseId } = await req.json();

  const chapter = await prisma.chapter.create({
    data: {
      title,
      courseId,
    },
  });

  return NextResponse.json(chapter);
}
