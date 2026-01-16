import CreateLessonForm from "@/components/tutor/create-lesson-form";

export default function ChapterDetailPage({ params }: { params: { chapterId: string } }) {
  const chapterId = Number(params.chapterId);

  return (
    <div>
      <h1>Detail Chapter</h1>

      <CreateLessonForm chapterId={chapterId} />

    </div>
  );
}
