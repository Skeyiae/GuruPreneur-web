"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CourseDTO } from "@/types/course";

export default function CourseList() {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then((data: CourseDTO[]) => {
        setCourses(data);
      })
      .catch(err => console.error("Failed to fetch courses:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-10 px-4 sm:px-6 lg:px-64">
        <p className="text-gray-500">Loading courses...</p>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-64">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Daftar Course</h2>

      {courses.length === 0 ? (
        <p className="text-gray-500">Belum ada course tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map(course => {
            //  FINAL GUARD
            if (typeof course.id !== "number") return null;

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col"
              >
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded"
                  />
                )}

                <h3 className="font-bold text-lg mt-2">{course.title}</h3>
                <p className="text-sm mt-1 line-clamp-3 text-gray-600">
                  {course.description}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
