"use client";

import { useState } from "react";
import CourseForm from "./courses/course-form";
import type { CourseDTO } from "@/types/course";
import Image from "next/image";

type Props = {
  courses: CourseDTO[];
};

export default function TutorDashboardClient({ courses }: Props) {
  const [editing, setEditing] = useState<CourseDTO | null>(null);

  return (
    <div className="space-y-6">
      {editing && (
        <CourseForm
          courseId={editing.id}
          initialData={{
            title: editing.title,
            description: editing.description,
            imageUrl: editing.imageUrl ?? "",
          }}
          onClose={() => setEditing(null)}
        />
      )}

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <li key={course.id} className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col">
            {/* IMAGE */}
            {course.imageUrl ? (
              <div className="relative h-40 w-full">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            ) : (
              <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-xl">
                No Image
              </div>
            )}

            {/* CONTENT */}
            <h3 className="font-semibold text-lg mt-3 line-clamp-2">{course.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-1">
              {course.description || "No description"}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-3">
              <button
                className="text-blue-600 text-sm"
                onClick={() => setEditing(course)}
              >
                Edit
              </button>
              <button
                className="text-red-600 text-sm"
                onClick={async () => {
                  await fetch(`/api/tutor/courses/${course.id}`, {
                    method: "DELETE",
                  });
                  location.reload();
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
