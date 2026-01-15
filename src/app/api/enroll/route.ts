import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { courseId } = await req.json();

        // 1. cari user di DB
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. cek apakah sudah enroll
        const existing = await prisma.enrollment.findFirst({
            where: {
                userId: user.id,
                courseId,
            },
        });

        if (existing) {
            return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
        }

        // 3. create enrollment
        await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId,
            },
        });

        // 4. update role jadi STUDENT
        if (user.role === "USER") {
            await prisma.user.update({
                where: { id: user.id },
                data: { role: "STUDENT" },
            });
        }


        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("ENROLL ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
