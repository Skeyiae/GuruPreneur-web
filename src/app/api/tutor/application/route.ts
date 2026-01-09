import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";

export async function GET() {
  try {
    // 1️⃣ AUTH
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ FIND APPLICATION
    const application = await prisma.tutorApplication.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        status: true,
        createdAt: true,
        reviewedAt: true,
      },
    });

    // 3️⃣ BELUM APPLY
    if (!application) {
      return NextResponse.json(
        { message: "Tutor application not found" },
        { status: 404 }
      );
    }

    // 4️⃣ SUCCESS
    return NextResponse.json(application);
  } catch (error) {
    console.error("GET TUTOR APPLICATION ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
