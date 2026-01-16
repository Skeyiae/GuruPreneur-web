"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateChapterForm({ courseId }: { courseId: number }) {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/tutor/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, courseId }),
    });

    router.refresh();
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Judul Chapter"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        required
      />
      <button className="bg-black text-white px-4 py-2 rounded">
        Tambah Chapter
      </button>
    </form>
  );
}
