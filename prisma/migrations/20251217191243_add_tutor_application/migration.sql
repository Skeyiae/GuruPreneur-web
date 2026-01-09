-- CreateEnum
CREATE TYPE "TutorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "TutorApplication" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "portfolioLinks" TEXT[],
    "skills" TEXT[],
    "teachingPlan" TEXT NOT NULL,
    "status" "TutorApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "TutorApplication_pkey" PRIMARY KEY ("id")
);
