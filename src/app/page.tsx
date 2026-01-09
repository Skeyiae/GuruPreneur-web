"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import CourseList from "@/components/course-list";
import HeroSection from "@/components/header";

export default function HomePage() {
  const { user, isSignedIn } = useUser();

  return (
    <>
      <header className="bg-white">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between py-6 px-4 sm:px-6 lg:px-64">
          <div className="flex items-center gap-4">
            {isSignedIn && user.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="Profile picture"
                width={60}
                height={60}
                className="rounded-full border-2 border-white object-cover"
              />
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              Welcome back {isSignedIn && user.firstName ? `, ${user.firstName}` : ""}
            </h1>
          </div>
        </div>

        <HeroSection />
      </header>

      <main>
        <CourseList />
      </main>
    </>
  );
}
