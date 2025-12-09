"use client";

import Image from "next/image";

import image1 from "@/images/findtutors/image1.jpg";

export default function HeroSection() {
  return (
    <header className="relative w-full">
      <section
        aria-label="Hero Section"
        className="relative w-full h-[320px] overflow-hidden rounded-md"
      >
        {/* Hero Background */}
        <figure className="absolute inset-0 w-full h-full">
          <Image
            src={image1}
            alt="Background visual for hero section"
            fill
            priority
            className="object-cover"
          />
          <figcaption className="sr-only">Hero Background</figcaption>
        </figure>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content Section */}
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <article className="bg-white/20 backdrop-blur-md text-white p-6 md:p-10 rounded-xl max-w-[90%] md:max-w-lg">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
              Welcome to Our Website
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg">
              Discover our content and explore more with modern UI experiences.
            </p>

            <nav className="mt-6">
              <a
                href="#start"
                className="inline-block px-4 py-2 sm:px-5 sm:py-3 bg-white text-black  rounded-lg font-semibold  text-sm sm:text-base"
              >
                Get Started
              </a>
            </nav>
          </article>
        </div>
      </section>
    </header>
  );
}
