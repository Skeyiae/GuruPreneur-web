import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/../lib/prisma";
import TutorDashboardClient from "./tutor-dashboard-client";

export const dynamic = "force-dynamic";

export default async function TutorDashboard() {
  // 1️⃣ AUTH
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 2️⃣ GET TUTOR + COURSES
  const tutor = await prisma.tutor.findUnique({
    where: { clerkId: userId },
    include: {
      courses: {
        include: {
          chapters: true,
        },
      },
    },
  });

  // 3️⃣ BELUM DAFTAR TUTOR
  if (!tutor) redirect("/tutor/register");

  // 4️⃣ BELUM DI-APPROVE ADMIN
  if (!tutor.isActive) redirect("/tutor/pending");

  const totalCourses = tutor.courses.length;
  const totalChapters = tutor.courses.reduce(
    (acc: number, course: any) => acc + course.chapters.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* ================= TOP BAR ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="font-medium">{tutor.fullName ?? "Tutor"}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              {tutor.bio || "Lengkapi bio kamu agar murid lebih tertarik mengikuti kelasmu."}
            </p>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Courses" value={totalCourses} subtitle="Course yang kamu buat" />
          <StatCard title="Total Chapters" value={totalChapters} subtitle="Materi yang tersedia" />
          <StatCard
            title="Account Status"
            value={tutor.isActive ? "Active" : "Pending"}
            subtitle="Status akun tutor"
            highlight
          />
        </div>

        {/* ================= COURSES ================= */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
          </div>

          {totalCourses === 0 ? (
            <EmptyState />
          ) : (
            <TutorDashboardClient courses={tutor.courses} />
          )}
        </section>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
  subtitle,
  highlight = false,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border shadow-sm ${highlight ? "bg-black text-white" : "bg-white"
        }`}
    >
      <p className="text-sm opacity-70">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm mt-1 opacity-60">{subtitle}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-dashed rounded-2xl p-12 text-center">
      <h3 className="text-lg font-semibold mb-2">Belum ada course</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Kamu belum membuat course apapun. Mulai dengan membuat course pertamamu dan bagikan ilmu ke murid.
      </p>
    </div>
  );
}
