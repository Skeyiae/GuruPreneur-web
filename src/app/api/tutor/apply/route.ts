import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";
import { z } from "zod";

/* =========================
   VALIDATION SCHEMA
========================= */
const TutorApplicationSchema = z.object({
  fullName: z.string().min(3, "Full name terlalu pendek"),
  bio: z.string().min(20, "Bio minimal 20 karakter"),
  portfolioLinks: z
    .array(z.string().url("Portfolio harus berupa URL"))
    .min(1, "Minimal 1 portfolio link"),
  skills: z
    .array(z.string().min(2))
    .min(1, "Minimal 1 skill"),
  teachingPlan: z.string().min(20, "Teaching plan terlalu pendek"),
});

/* =========================
   POST: APPLY TUTOR
========================= */
export async function POST(req: Request) {
  try {
    /* AUTH */
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* BODY */
    const body = await req.json();
    const parsed = TutorApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, bio, portfolioLinks, skills, teachingPlan } =
      parsed.data;

    /* CEK SUDAH APPLY ATAU BELUM */
    const existingApplication =
      await prisma.tutorApplication.findFirst({
        where: {
          clerkId: userId,
          status: { in: ["PENDING", "APPROVED"] },
        },
      });

    if (existingApplication) {
      return NextResponse.json(
        {
          message:
            "You have already applied or already approved as tutor",
        },
        { status: 409 }
      );
    }

    /* CREATE APPLICATION */
    const application = await prisma.tutorApplication.create({
      data: {
        clerkId: userId,
        fullName,
        bio,
        portfolioLinks,
        skills,
        teachingPlan,
      },
    });

    /* RESPONSE */
    return NextResponse.json(
      {
        message: "Tutor application submitted successfully",
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("APPLY TUTOR ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
