import { Course } from "./types";
import Image from "next/image";
import BelthanBlender from "@/images/findtutors/BelthanBlender.webp";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition p-3 bg-white">
      
      <figure className="mb-3">
        <Image
            src={BelthanBlender}
            alt={course.title}
            className="w-full h-40 object-cover rounded-md"
          />
      </figure>

      <header>
        <h3 className="text-lg font-semibold">{course.title}</h3>
      </header>

      <p className="text-sm text-gray-600 mt-1">
        {course.description}
      </p>

    </article>
  );
}
