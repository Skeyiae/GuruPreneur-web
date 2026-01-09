import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const tutor = await prisma.tutor.findUnique({
    where: { clerkId: user.id },
  });

  if (!tutor || !tutor.isActive)
    return NextResponse.json({}, { status: 403 });

  const body = await req.json();

  await prisma.course.update({
    where: { id: Number(params.id), tutorId: tutor.id },
    data: body,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const tutor = await prisma.tutor.findUnique({
    where: { clerkId: user.id },
  });

  if (!tutor || !tutor.isActive)
    return NextResponse.json({}, { status: 403 });

  await prisma.course.delete({
    where: { id: Number(params.id), tutorId: tutor.id },
  });

  return NextResponse.json({ success: true });
}
