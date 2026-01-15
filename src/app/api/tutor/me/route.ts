import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/../lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    console.log("➡️ userId from Clerk:", userId);

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
  } catch (error: any) {
    console.error("Failed to fetch tutor info:", error);
    return NextResponse.json(
      { isTutor: false, isActive: false, error: error.message },
      { status: 500 }
    );
  }
}
