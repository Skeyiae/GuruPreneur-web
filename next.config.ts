import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: [
      "img.clerk.com",        // Clerk (JANGAN DIHAPUS)
      "res.cloudinary.com",   // Cloudinary (course image)
    ],
  },
};

export default nextConfig;
