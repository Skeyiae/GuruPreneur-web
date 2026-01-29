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
import { Menu, X } from "lucide-react";


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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinkClass = (path: string) => {
    return `block hover:bg-blue-100 p-2 rounded-md transition text-sm md:text-base ${isActive(path)
      ? "bg-blue-100 font-semibold border-b-2 border-blue-600"
      : ""
      }`;
  };

  const NavLinks = () => (
    <>
      <li>
        <a href="/" className={navLinkClass("/")}>
          Home
        </a>
      </li>
      <li>
        <a href="/benefits" className={navLinkClass("/benefits")}>
          Benefits
        </a>
      </li>
      <li>
        <a href="/about" className={navLinkClass("/about")}>
          About
        </a>
      </li>

      {/* ================= TUTOR LOGIC ================= */}

      {!loadingTutor && userId && !tutorStatus.isTutor && (
        <li>
          <a
            href="/tutor/apply-tutor"
            className={navLinkClass("/tutor/apply-tutor")}
          >
            Become Tutor
          </a>
        </li>
      )}

      {!loadingTutor && userId && tutorStatus.isTutor && !tutorStatus.isActive && (
        <li>
          <a
            href="/tutor/status"
            className={navLinkClass("/tutor/status")}
          >
            Status Pengajuan
          </a>
        </li>
      )}

      {!loadingTutor && userId && tutorStatus.isTutor && tutorStatus.isActive && (
        <li>
          <a
            href="/tutor/dashboard"
            className={navLinkClass("/tutor/dashboard")}
          >
            Dashboard Tutor
          </a>
        </li>
      )}
    </>
  );

  return (
    <header className="w-full bg-white text-black shadow-xl relative">
      <div className="flex items-center justify-between p-3 md:p-4 h-16">
        {/* Logo */}
        <h1 className="text-lg md:text-xl font-bold ml-2 md:ml-4 flex-shrink-0">
          <a href="/" aria-label="Homepage">
            Skill Mentor
          </a>
        </h1>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex flex-1 justify-center items-center"
        >
          <ul className="flex gap-6 lg:gap-10">
            <NavLinks />
          </ul>
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 mr-4 flex-shrink-0">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm lg:text-base h-10 lg:h-12 px-4 lg:px-5 cursor-pointer whitespace-nowrap">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button & Auth */}
        <div className="flex md:hidden items-center gap-2 mr-2 flex-shrink-0">
          <SignedIn>
            <div className="mr-2">
              <UserButton />
            </div>
          </SignedIn>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav aria-label="Mobile Navigation" className="p-4">
            <ul className="flex flex-col gap-2">
              <NavLinks />
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <SignInButton>
                    <button className="w-full text-left hover:bg-blue-100 p-2 rounded-md transition">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full bg-[#6c47ff] text-white rounded-full font-medium text-base h-12 px-5 cursor-pointer">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
