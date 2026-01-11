import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { requireTutor } from "@/lib/require-tutor";

export const dynamic = "force-dynamic";
type CourseBody = {
  title: string;
  description: string;
  imageUrl?: string;
};

export async function POST(req: NextRequest) {
  const tutorOrResponse = await requireTutor();
  if (tutorOrResponse instanceof NextResponse) return tutorOrResponse;

  const tutor = tutorOrResponse;

  const body: CourseBody = await req.json();
  const { title, description, imageUrl } = body;

  const course = await prisma.course.create({
    data: {
      tutorId: tutor.id,
      title,
      description,
      imageUrl,
    },
  });

  return NextResponse.json({ success: true, course }, { status: 201 });
}
