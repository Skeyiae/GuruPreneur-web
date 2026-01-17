import { prisma } from "@/../lib/prisma";
import CreateLessonForm from "@/components/tutor/create-lesson-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ChapterDetailPage({ 
  params 
}: { 
  params: { chapterId: string } 
}) {
  const chapterId = Number(params.chapterId);

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      course: true,
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!chapter) {
    return <div className="p-10 text-red-500">Chapter not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{chapter.title}</h1>
          <p className="text-gray-500 text-sm">
            Course: <span className="font-medium">{chapter.course.title}</span>
          </p>
          <Link
            href={`/tutor/courses/${chapter.courseId}`}
            className="inline-block mt-4 text-blue-600 hover:underline text-sm"
          >
            ← Kembali ke Course
          </Link>
        </div>

        {/* Form Tambah Lesson */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tambah Lesson Baru</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload file materi (PDF, DOC, DOCX, TXT) atau masukkan video URL
          </p>
          <CreateLessonForm chapterId={chapterId} />
        </div>

        {/* Daftar Lesson */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Daftar Lesson ({chapter.lessons.length})
          </h2>

          {chapter.lessons.length === 0 ? (
            <p className="text-gray-500">
              Belum ada lesson. Tambah lesson baru di atas dengan upload file.
            </p>
          ) : (
            <div className="space-y-3">
              {chapter.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-semibold">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {lesson.title}
                        </h3>
                      </div>
                      <div className="mt-2 space-y-1">
                        {lesson.videoUrl && (
                          <p className="text-xs text-gray-600">
                            🎥 Video URL tersedia
                          </p>
                        )}
                        {lesson.fileUrl && (
                          <p className="text-xs text-gray-600">
                            📄 File materi tersedia
                          </p>
                        )}
                        {lesson.content && (
                          <p className="text-xs text-gray-600">
                            📝 Konten teks tersedia
                          </p>
                        )}
                      </div>
                    </div>
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
