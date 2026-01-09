"use client";

import {useAuth} from "@clerk/nextjs";
import HeroSection from "@/components/header";

export default function HomePage() {
  const { userId } = useAuth();
  console.log("Current User ID:", userId);
  return (
    <main>
        <HeroSection />
    </main>
  );
}
