import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
      },
      orderBy: { id: "desc" }, // opsional: terbaru muncul dulu
    });

    return NextResponse.json(courses);
  } catch (error: any) {
    // ✅ Tambah logging lebih jelas
    console.error("❌ Failed to fetch courses:", error);

    // ✅ Kembalikan error detail supaya di browser kelihatan
    return NextResponse.json(
      {
        error: true,
        message: error.message,
        // stack: error.stack // uncomment ini kalau mau detail stack di dev
      },
      { status: 500 }
    );
  }
}
