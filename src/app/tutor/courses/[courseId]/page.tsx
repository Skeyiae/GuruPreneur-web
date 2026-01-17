import { prisma } from "@/../lib/prisma";
import CreateChapterForm from "@/components/tutor/create-chapter-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ 
  params 
}: { 
  params: { courseId: string } 
}) {
  const courseId = Number(params.courseId);

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        include: {
          lessons: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!course) {
    return <div className="p-10 text-red-500">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
          <Link
            href="/tutor/dashboard"
            className="inline-block mt-4 text-blue-600 hover:underline text-sm"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Form Tambah Chapter */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tambah Chapter Baru</h2>
          <CreateChapterForm courseId={courseId} />
        </div>

        {/* Daftar Chapter */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Daftar Chapter ({course.chapters.length})
          </h2>

          {course.chapters.length === 0 ? (
            <p className="text-gray-500">Belum ada chapter. Tambah chapter baru di atas.</p>
          ) : (
            <div className="space-y-3">
              {course.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {chapter.lessons.length} Lesson
                      </p>
                    </div>
                    <Link
                      href={`/tutor/chapters/${chapter.id}`}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm"
                    >
                      Manage Lesson
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
