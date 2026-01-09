// app/api/tutor/courses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { requireTutor } from "@/lib/require-tutor";

export async function POST(req: Request) {
  const tutorOrResponse = await requireTutor();
  if (tutorOrResponse instanceof NextResponse) return tutorOrResponse;

  const tutor = tutorOrResponse;

  const body = await req.json();
  const { title, description, imageUrl } = body;

  const course = await prisma.course.create({
    data: {
      tutorId: tutor.id,
      title,
      description,
      imageUrl,
    },
  });

  return NextResponse.json({ success: true, course });
}
