import { Course } from "./types";
import CourseCard from "./coursecard";

export default function CourseList({ courses }: { courses: Course[] }) {
  return (
    <section className="my-6">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {courses.map((c) => (
          <li key={c.id}>
            <CourseCard course={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}
