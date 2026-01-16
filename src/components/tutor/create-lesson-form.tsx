"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLessonForm({ chapterId }: { chapterId: number }) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/tutor/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        videoUrl,
        content,
        chapterId,
      }),
    });

    router.refresh();
    setTitle("");
    setVideoUrl("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Judul Lesson"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        required
      />

      <input
        type="text"
        placeholder="Video URL (Cloudinary)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <textarea
        placeholder="Materi teks (optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Tambah Lesson
      </button>
    </form>
  );
}
