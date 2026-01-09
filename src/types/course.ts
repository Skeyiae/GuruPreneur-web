import type { Course } from "@prisma/client";

export type CourseDTO = Pick<
  Course,
  "id" | "title" | "description" | "imageUrl"
>;
