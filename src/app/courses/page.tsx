import { prisma } from "@/../lib/prisma";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      tutor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="h-40 bg-gray-200">
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {course.description}
              </p>

              <p className="text-sm mb-1">
                Mentor: <strong>{course.tutor.fullName ?? "Unknown"}</strong>
              </p>

              <p className="text-sm font-bold">
                Rp {course.price.toLocaleString("id-ID")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
