import { NextResponse, NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";

export const dynamic = "force-dynamic";
// PUT Handler
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <- note 'Promise<{ id: string }>'
) {
  const { id } = await params; // harus await
  const user = await currentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const tutor = await prisma.tutor.findUnique({
    where: { clerkId: user.id },
  });

  if (!tutor || !tutor.isActive)
    return NextResponse.json({}, { status: 403 });

  const body = await req.json();

  await prisma.course.update({
    where: { id: Number(id), tutorId: tutor.id },
    data: body,
  });

  return NextResponse.json({ success: true });
}

// DELETE Handler
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <- note 'Promise<{ id: string }>'
) {
  const { id } = await params; // harus await
  const user = await currentUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const tutor = await prisma.tutor.findUnique({
    where: { clerkId: user.id },
  });

  if (!tutor || !tutor.isActive)
    return NextResponse.json({}, { status: 403 });

  await prisma.course.delete({
    where: { id: Number(id), tutorId: tutor.id },
  });

  return NextResponse.json({ success: true });
}
