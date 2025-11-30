"use client";

import { FC, ReactNode } from "react";
import Image from "next/image";

import image1 from "@/images/findtutors/image1.jpg";

interface Slide {
  title: string;
  description: ReactNode;
  image: any;
}

const slides: Slide[] = [
  {
    title: "Benefit big-time",
    description: <>Join our email list for offers and more.</>,
    image: image1,
  },
];

const HeroCarousel: FC = () => {
  return (
    <section className="relative bg-teal-200 rounded-xl overflow-hidden h-[350px] md:h-[420px] flex items-center">
      <article className="relative w-full h-full flex items-center justify-start px-8">

        {/* Background Image */}
        <figure className="absolute inset-0 w-full h-full">
          <Image
            src={slides[0].image}
            alt="carousel graphic"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-70"
          />
        </figure>

        {/* Content Overlay */}
        <aside className="relative z-10 max-w-sm bg-white/75 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {slides[0].title}
          </h1>
          <p className="text-sm mt-2 text-gray-800">
            {slides[0].description}
          </p>
        </aside>

      </article>
    </section>
  );
};

export default HeroCarousel;
