import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "GuruPreneur",
  description: "GuruPreneur Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body className="antialiased flex flex-col min-h-screen">
          <Navbar />

          {/* INI PENTING */}
          <main className="flex-1 w-full">{children}</main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
