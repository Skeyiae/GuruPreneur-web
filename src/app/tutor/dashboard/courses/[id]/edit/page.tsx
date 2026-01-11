import { redirect } from "next/navigation";
import { prisma } from "@/../lib/prisma";
import CourseForm from "../../course-form";

export const dynamic = "force-dynamic";
export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const courseId = Number(params.id);

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) redirect("/tutor/dashboard");

  return (
    <div className="p-10 max-w-xl">
      <CourseForm
        courseId={course.id}
        initialData={{
          title: course.title,
          description: course.description,
          imageUrl: course.imageUrl ?? "",
        }}
        onClose={() => redirect("/tutor/dashboard")}
      />
    </div>
  );
}
