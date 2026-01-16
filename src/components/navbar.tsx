"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


type TutorStatus = {
  isTutor: boolean;
  isActive: boolean;
};

export default function Navbar() {
  const { userId } = useAuth();
  const pathname = usePathname();
  const [tutorStatus, setTutorStatus] = useState<TutorStatus>({
    isTutor: false,
    isActive: false,
  });
  const [loadingTutor, setLoadingTutor] = useState(true);

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    if (!userId) {
      setLoadingTutor(false);
      return;
    }

    fetch("/api/tutor/me")
      .then((res) => res.json())
      .then((data) => {
        setTutorStatus(data);
        setLoadingTutor(false);
      })
      .catch(() => {
        setLoadingTutor(false);
      });
  }, [userId]);

  return (
    <header className="w-full bg-white text-black shadow-xl flex items-center p-4 h-16 relative">
      {/* Logo */}
      <h1 className="text-xl font-bold ml-4">
        <a href="/" aria-label="Homepage">
          Skill Mentor
        </a>
      </h1>

      {/* Navigation */}
      <nav
        aria-label="Main Navigation"
        className="flex-1 flex justify-center items-center"
      >
        <ul className="flex gap-10">
          <li>
            <a
              href="/"
              className={`hover:bg-blue-100 p-2 rounded-md transition ${isActive("/")
                  ? "bg-blue-100 font-semibold border-b-2 border-blue-600"
                  : ""
                }`}
            >Home</a>
          </li>
          <li>
            <a href="/benefits" className="hover:bg-blue-100 p-2 rounded-md">
              Benefits
            </a>
          </li>
          <li>
            <a href="/about" className="hover:bg-blue-100 p-2 rounded-md">
              About
            </a>
          </li>

          {/* ================= TUTOR LOGIC ================= */}

          {!loadingTutor && userId && !tutorStatus.isTutor && (
            <li>
              <a
                href="/tutor/apply-tutor"
                className="hover:bg-blue-100 p-2 rounded-md"
              >
                Become Tutor
              </a>
            </li>
          )}

          {!loadingTutor && userId && tutorStatus.isTutor && !tutorStatus.isActive && (
            <li>
              <a
                href="/tutor/status"
                className="hover:bg-blue-100 p-2 rounded-md"
              >
                Status Pengajuan
              </a>
            </li>
          )}

          {!loadingTutor && userId && tutorStatus.isTutor && tutorStatus.isActive && (
            <li>
              <a
                href="/tutor/dashboard"
                className="hover:bg-blue-100 p-2 rounded-md font-semibold"
              >
                Dashboard Tutor
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4 mr-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
