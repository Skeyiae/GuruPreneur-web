import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ isTutor: false, isActive: false });
  }

  const tutor = await prisma.tutor.findUnique({
    where: { clerkId: userId },
  });

  if (!tutor) {
    return NextResponse.json({ isTutor: false, isActive: false });
  }

  return NextResponse.json({
    isTutor: true,
    isActive: tutor.isActive,
  });
}
