// app/courses/[id]/page.tsx
import { prisma } from "@/../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import EnrollButton from "@/components/enroll-button";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string }; // params langsung object, tidak pakai Promise
};

// Type-safe DTO untuk course + nested relations
type CourseWithRelations = {
  id: number;
  title: string;
  description: string;
  price: number | null;
  benefits?: string[]; // optional
  tutor: {
    fullName?: string | null;
    bio?: string | null;
    skills?: string[]; // optional
  };
  chapters: { id: number; title: string }[];
};


export default async function CourseDetailPage({ params }: PageProps) {
  const courseId = Number(params.id);

  if (isNaN(courseId)) {
    return <div className="p-10 text-red-500">Invalid course id</div>;
  }

    // Get current user's enrollment status
    const { userId: clerkId } = await auth();
    let isEnrolled = false;
  
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
      });
  
      if (user) {
        const enrollment = await prisma.enrollment.findFirst({
          where: {
            userId: user.id,
            courseId,
          },
        });
        isEnrolled = !!enrollment;
      }
    }
  

  const course = (await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      tutor: true,
      chapters: true,
      // jika benefits itu relation, include juga
      // benefits: true, 
    },
  })) as unknown as CourseWithRelations;

  if (!course) {
    return <div className="p-10 text-red-500">Course not found</div>;
  }

  const benefits = course.benefits ?? [];
  const skills = course.tutor.skills ?? [];

  return (
    <div className="w-full bg-gray-50">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-64 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6">
              {course.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👨‍🏫 Mentor: {course.tutor.fullName ?? "Mentor Profesional"}</span>
              <span>📚 {course.chapters.length} Materi</span>
            </div>
          </div>

          {/* RIGHT - CARD */}
          <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm text-gray-500">Harga Course</p>
              <p className="text-2xl font-bold text-gray-900">
                {!course.price || course.price === 0
                  ? "Gratis"
                  : `Rp ${course.price.toLocaleString("id-ID")}`}
              </p>
            </div>

            <EnrollButton courseId={course.id} isEnrolled={isEnrolled} />

            <p className="text-xs text-gray-500 text-center">
              Akses penuh setelah mendaftar
            </p>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      {benefits.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-64">
          <h2 className="text-2xl font-bold mb-6">Yang Akan Kamu Dapatkan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white p-4 rounded-lg border"
              >
                <span className="text-green-500 mt-1">✔</span>
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= MATERI / CHAPTERS ================= */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-64 border-t border-b">
        <h2 className="text-2xl font-bold mb-6">Materi Pembelajaran</h2>

        {course.chapters.length === 0 ? (
          <p className="text-gray-500">Belum ada materi.</p>
        ) : (
          <div className="space-y-4">
            {course.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-sm">
                    {index + 1}
                  </span>
                  <p className="font-medium text-gray-800">{chapter.title}</p>
                </div>
                <span className="text-sm text-gray-400">Preview</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= MENTOR ================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-64">
        <h2 className="text-2xl font-bold mb-6">Tentang Mentor</h2>

        <div className="bg-white p-6 rounded-xl border flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl">
            👨‍🏫
          </div>

          <div>
            <h3 className="text-lg font-bold">{course.tutor.fullName ?? "Mentor Profesional"}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {course.tutor.bio ?? "Mentor berpengalaman di bidangnya dan siap membimbing kamu sampai bisa."}
            </p>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
