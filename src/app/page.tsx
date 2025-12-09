import HeroCarousel from "@/components/homepageimage";
import { CourseList } from "@/components/course";

const courses = [
  {
    id: 1,
    title: "Belajar React dari Nol",
    description: "Making an aesthetic place in blender",
    image: "/images/react-course.jpg",
  },
  {
    id: 2,
    title: "Next.js Fullstack",
    description: "Belajar Shortcut Penting Blender",
    image: "/images/next-course.jpg",
  },
];

export default function FindTutorsPage() {
  return (
    <main className="p-10">
      <HeroCarousel />
      <h1 className="text-3xl font-bold mb-6 text-black py-5 px-8">Course Terbaru</h1>
      <CourseList courses={courses} />
    </main>
  );
}
