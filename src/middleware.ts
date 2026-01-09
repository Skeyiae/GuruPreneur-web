import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // match semua route app + api
    "/((?!_next|.*\\..*).*)",
    "/api/(.*)",
  ],
};
