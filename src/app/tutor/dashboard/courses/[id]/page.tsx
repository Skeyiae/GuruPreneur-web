"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CoursePage() {
  const params = useParams();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/tutor/courses/${params.id}`);
      const data = await res.json();
      setCourse(data);
    }
    fetchCourse();
  }, [params.id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p>{course.description}</p>
    </div>
  );
}
