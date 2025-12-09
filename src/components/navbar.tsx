"use client";

export default function Navbar() {
  return (
    <header className="w-full bg-gray-800 shadow">
      {/* Navigation container */}
      <nav
        aria-label="Main Navigation"
        className="max-w-6xl mx-auto py-4 px-6 flex justify-between items-center"
      >
        {/* Logo / Brand */}
        <h1 className="text-xl font-bold pl-3">
          <a href="/" aria-label="Homepage">
            Skill Mentor
          </a>
        </h1>

        {/* Navigation Links */}
        <ul className="flex gap-4">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
