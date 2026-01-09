import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";

export const PUT = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bio, portfolio, skills } = body;

    const tutor = await prisma.tutor.update({
      where: { clerkId: userId },
      data: { bio, portfolio, skills },
    });

    return NextResponse.json({ success: true, tutor });
  } catch (err) {
    console.error("UPDATE TUTOR ERROR:", err);
    return NextResponse.json({ success: false, message: "Gagal update tutor" }, { status: 500 });
  }
};
