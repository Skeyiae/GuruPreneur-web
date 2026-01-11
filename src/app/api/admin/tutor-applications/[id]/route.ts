import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;                  // ✅ unwrap params
    const applicationId = Number(id);
    console.log("Parsed applicationId:", applicationId);

    if (isNaN(applicationId)) {
      console.error("❌ Invalid applicationId");
      return NextResponse.json({ message: "Invalid application id" }, { status: 400 });
    }

    const application = await prisma.tutorApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      console.error("❌ Application not found");
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    console.log("Fetched application:", application);
    return NextResponse.json(application);
  } catch (err: any) {
    console.error("❌ Error GET single application:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
