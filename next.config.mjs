/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "img.clerk.com",      // Clerk (JANGAN DIHAPUS)
      "res.cloudinary.com" // Cloudinary (course image)
    ],
  },
};

export default nextConfig;
