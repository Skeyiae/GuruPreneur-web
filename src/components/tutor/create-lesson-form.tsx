"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain",
];

export default function CreateLessonForm({ chapterId }: { chapterId: number }) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle file upload to Cloudinary
  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to upload file");
    }
    return data.secure_url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validasi tipe file
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      alert("Hanya file PDF, DOC, DOCX, atau TXT yang diizinkan");
      return;
    }

    // Validasi ukuran file
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      let fileUrl = null;

      // Upload file jika ada
      if (file) {
        setUploading(true);
        fileUrl = await handleFileUpload(file);
        setUploading(false);
      }

      await fetch("/api/tutor/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          videoUrl,
          content,
          chapterId,
          fileUrl,
        }),
      });

      router.refresh();
      setTitle("");
      setVideoUrl("");
      setContent("");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("lesson-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengupload file. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Judul Lesson"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        required
        disabled={uploading || loading}
      />

      <input
        type="text"
        placeholder="Video URL (Cloudinary) - Optional"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        disabled={uploading || loading}
      />

      {/* File Upload untuk Materi */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload File Materi (PDF, DOC, DOCX, TXT)
        </label>
        <input
          id="lesson-file"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="border px-3 py-2 rounded w-full"
          disabled={uploading || loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Format: PDF, DOC, DOCX, atau TXT (Maks. 10MB)
        </p>
        {file && (
          <p className="text-sm text-green-600 mt-1">
            ✓ File dipilih: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <textarea
        placeholder="Materi teks (optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border px-3 py-2 rounded w-full"
        disabled={uploading || loading}
      />

      {uploading && (
        <p className="text-sm text-blue-600">Mengupload file...</p>
      )}

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
        disabled={uploading || loading}
      >
        {uploading ? "Mengupload..." : loading ? "Menyimpan..." : "Tambah Lesson"}
      </button>
    </form>
  );
}
