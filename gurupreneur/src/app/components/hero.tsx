import Image from "next/image";
import Link from "next/link";
import ImageSlider from "./image_slider";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-20 py-20 bg-gray-800">
      
      {/* Text */}
      <div className="max-w-xl space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Belajar 3D Blender dari Tutor Terbaik
        </h1>

        <p className="text-gray-500 text-lg">
          Temukan tutor berpengalaman atau daftar menjadi pengajar Blender secara profesional.
        </p>

        <div className="flex gap-4">
          <Link 
            href="/find-tutor">
            <Button variant="outline" className="px-12 py-5 text-lg bg-cyan-100 text-black hover:bg-cyan-300">Find a Tutor</Button>
          </Link>

          <Link 
            href="/become-tutor">
             <Button variant="outline" className="px-12 py-5 text-lg bg-white text-black hover:bg-gray-300">Become a Tutor</Button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full max-w-md h-80">
        <ImageSlider/>
      </div>

    </section>
  );
}
