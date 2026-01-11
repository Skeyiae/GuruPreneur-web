import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const applicationId = Number(id);
    console.log("Reject applicationId:", applicationId);

    if (isNaN(applicationId)) {
      console.error("❌ Invalid applicationId");
      return NextResponse.json({ message: "Invalid application id" }, { status: 400 });
    }

    const body = await req.json();
    const reason = body.reason;
    if (!reason) {
      console.error("❌ Reject reason missing");
      return NextResponse.json({ message: "Reject reason required" }, { status: 400 });
    }

    const application = await prisma.tutorApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      console.error("❌ Application not found");
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    if (application.status !== "PENDING") {
      console.error("❌ Application already processed");
      return NextResponse.json({ message: "Application already processed" }, { status: 400 });
    }

    await prisma.tutorApplication.update({
      where: { id: applicationId },
      data: { status: "REJECTED", rejectionReason: reason, reviewedAt: new Date() },
    });

    console.log("✅ Application rejected:", applicationId);
    return NextResponse.json({ success: true, message: "Tutor application rejected" });
  } catch (err: any) {
    console.error("❌ Error rejecting application:", err);
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
