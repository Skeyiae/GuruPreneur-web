import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const applicationId = Number(id);
    console.log("Approve applicationId:", applicationId);

    if (isNaN(applicationId)) {
      console.error("Invalid applicationId");
      return NextResponse.json({ message: "Invalid application id" }, { status: 400 });
    }

    const application = await prisma.tutorApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      console.error("Application not found");
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    if (application.status !== "PENDING") {
      console.error("Application already processed");
      return NextResponse.json({ message: "Application already processed" }, { status: 400 });
    }

    // 1️⃣ Update status application
    await prisma.tutorApplication.update({
      where: { id: applicationId },
      data: { status: "APPROVED", reviewedAt: new Date() },
    });

    // 2️⃣ Create atau update user (upsert) - PERBAIKAN UTAMA
    const user = await prisma.user.upsert({
      where: { clerkId: application.clerkId },
      update: {
        role: "TUTOR", // Update role jika user sudah ada
      },
      create: {
        clerkId: application.clerkId,
        role: "TUTOR",
      },
    });

    // 3️⃣ Cek apakah tutor sudah ada (untuk menghindari duplicate)
    const existingTutor = await prisma.tutor.findUnique({
      where: { clerkId: application.clerkId },
    });

    if (existingTutor) {
      // Jika sudah ada, update saja
      await prisma.tutor.update({
        where: { id: existingTutor.id },
        data: {
          fullName: application.fullName,
          bio: application.bio,
          portfolioLinks: application.portfolioLinks,
          skills: application.skills,
          isActive: true,
        },
      });
      console.log("✅ Tutor updated:", existingTutor.id);
    } else {
      // 4️⃣ Create tutor + CONNECT ke user
      await prisma.tutor.create({
        data: {
          clerkId: application.clerkId,
          fullName: application.fullName,
          bio: application.bio,
          portfolioLinks: application.portfolioLinks,
          skills: application.skills,
          isActive: true,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      console.log("✅ Tutor created for user:", user.id);
    }

    console.log("✅ Application approved & tutor created:", applicationId);
    return NextResponse.json({ success: true, message: "Tutor approved & activated" });
  } catch (err: any) {
    console.error("Error approving application:", err);
    console.error("Error details:", err.message, err.code);

    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Handle Prisma unique constraint errors
    if (err.code === "P2002") {
      return NextResponse.json({ 
        message: "Tutor already exists with this clerkId",
        error: err.meta 
      }, { status: 409 });
    }

    return NextResponse.json({ 
      message: "Internal server error", 
      error: err.message 
    }, { status: 500 });
  }
}