import { prisma } from "@/../lib/prisma";
import CreateLessonForm from "@/components/tutor/create-lesson-form";
import VideoPlayer from "@/components/video-player";
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
            Upload file materi (PDF, DOC, DOCX, TXT) atau masukkan video URL dari YouTube atau Cloudinary
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
            <div className="space-y-6">
              {chapter.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-6 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {lesson.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {lesson.videoUrl && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            🎥 Video
                          </span>
                        )}
                        {lesson.fileUrl && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            📄 File
                          </span>
                        )}
                        {lesson.content && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            📝 Teks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video Player */}
                  {lesson.videoUrl && (
                    <div className="mb-4">
                      <VideoPlayer videoUrl={lesson.videoUrl} />
                    </div>
                  )}

                  {/* File Download */}
                  {lesson.fileUrl && (
                    <div className="mb-4">
                      <a
                        href={lesson.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                      >
                        📄 Download File Materi
                      </a>
                    </div>
                  )}

                  {/* Content Text */}
                  {lesson.content && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {lesson.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
