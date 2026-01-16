import CreateChapterForm from "@/components/tutor/create-chapter-form";

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const courseId = Number(params.courseId);

  return (
    <div>
      <h1>Detail Course</h1>

      <CreateChapterForm courseId={courseId} />
    </div>
  );
}
