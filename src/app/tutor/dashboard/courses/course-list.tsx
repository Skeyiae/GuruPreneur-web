"use client";

import { useState } from "react";
import CourseForm from "./course-form";
import type { CourseDTO } from "@/types/course";

import Image from "next/image";

type Props = {
  courses: CourseDTO[];
};

export default function CourseList({ courses }: Props) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CourseDTO | null>(null);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setCreating(true)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        + Create Course
      </button>

      {(creating || editing) && (
        <CourseForm
          courseId={editing?.id}
          initialData={
            editing
              ? {
                  title: editing.title,
                  description: editing.description,
                  imageUrl: editing.imageUrl ?? "",
                }
              : undefined
          }
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <ul className="grid md:grid-cols-3 gap-4">
        {courses.map(course => (
          <li key={course.id} className="border p-4 rounded space-y-2">
             {/* IMAGE */}
          {course.imageUrl && (
            <div className="relative h-40 w-full">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          )}
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>

            <div className="flex gap-3 text-sm">
              <button
                className="text-blue-600"
                onClick={() => setEditing(course)}
              >
                Edit
              </button>

              <button
                className="text-red-600"
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
