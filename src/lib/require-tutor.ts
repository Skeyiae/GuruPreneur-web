// lib/require-tutor.ts
import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function requireTutor() {
  try {
    // Ambil session Clerk
    const session = await auth();
    const clerkId = session.userId;

    if (!clerkId) {
      console.log("User not logged in (Clerk ID missing)");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    //  Cari tutor aktif
    const tutor = await prisma.tutor.findUnique({
      where: { clerkId },
    });

    if (!tutor || !tutor.isActive) {
      console.log("User is not an active tutor");
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    console.log(" User is an active tutor", tutor.id);

    //  Kembalikan tutor agar bisa digunakan di handler
    return tutor;
  } catch (err: any) {
    console.error("Error in requireTutor:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
