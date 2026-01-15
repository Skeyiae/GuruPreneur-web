import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { requireAdmin } from "@/lib/admin";

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

    // Update status
    await prisma.tutorApplication.update({
      where: { id: applicationId },
      data: { status: "APPROVED", reviewedAt: new Date() },
    });

    // Create tutor
    await prisma.tutor.create({
      data: {
        clerkId: application.clerkId,
        fullName: application.fullName,
        bio: application.bio,
        portfolioLinks: application.portfolioLinks,
        skills: application.skills,
        isActive: true,
      },
    });

    console.log("✅ Application approved & tutor created:", applicationId);
    return NextResponse.json({ success: true, message: "Tutor approved & activated" });
  } catch (err: any) {
    console.error("Error approving application:", err);
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
