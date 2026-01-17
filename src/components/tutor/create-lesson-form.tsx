"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isYouTubeUrl, normalizeVideoUrl } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB untuk file materi
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB untuk video
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain",
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
];

export default function CreateLessonForm({ chapterId }: { chapterId: number }) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle file upload to Cloudinary (untuk PDF, DOC, TXT)
  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Wajib menggunakan preset khusus untuk file lesson, jangan fallback ke image preset
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_LESSON_PRESET;
    
    if (!uploadPreset) {
      throw new Error(
        `Environment variable NEXT_PUBLIC_CLOUDINARY_LESSON_PRESET belum di-set. ` +
        `Tambahkan di .env.local: NEXT_PUBLIC_CLOUDINARY_LESSON_PRESET=lesson-files`
      );
    }
    
    formData.append("upload_preset", uploadPreset);
    // Cloudinary auto-detect resource type dari file, tapi tetap gunakan endpoint spesifik untuk raw files

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Cloudinary upload error:", data);
      const errorMessage = data.error?.message || data.message || "Failed to upload file";
      
      if (errorMessage.includes("format") || errorMessage.includes("not allowed")) {
        throw new Error(
          `Upload gagal: Format file tidak diizinkan. ` +
          `Pastikan upload preset di Cloudinary mengizinkan format: PDF, DOC, DOCX, TXT. ` +
          `Buka Cloudinary Dashboard > Settings > Upload > Upload presets dan set "Allowed formats: pdf,doc,docx,txt".`
        );
      }
      
      throw new Error(`Upload gagal: ${errorMessage}`);
    }
    return data.secure_url;
  };

  // Handle video upload to Cloudinary
  const handleVideoUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Wajib menggunakan preset khusus untuk video, jangan fallback ke image preset
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_PRESET;
    
    if (!uploadPreset) {
      throw new Error(
        `Environment variable NEXT_PUBLIC_CLOUDINARY_VIDEO_PRESET belum di-set. ` +
        `Tambahkan di .env.local: NEXT_PUBLIC_CLOUDINARY_VIDEO_PRESET=lesson-videos`
      );
    }
    
    formData.append("upload_preset", uploadPreset);
    // Cloudinary auto-detect resource type dari file, tapi tetap gunakan endpoint spesifik untuk video
    // untuk memastikan video diproses dengan benar

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("Cloudinary video upload error:", data);
      console.error("Upload preset used:", uploadPreset);
      console.error("File type:", file.type);
      console.error("File name:", file.name);
      
      const errorMessage = data.error?.message || data.message || JSON.stringify(data);
      
      if (errorMessage.includes("format") || errorMessage.includes("not allowed") || errorMessage.includes("Invalid")) {
        throw new Error(
          `Upload video gagal: Format video tidak diizinkan. ` +
          `Detail: ${errorMessage}. ` +
          `Pastikan preset "${uploadPreset}" di Cloudinary memiliki: ` +
          `- Allowed formats: mp4,webm,mov,avi ` +
          `- Preset name harus sesuai dengan yang ada di Cloudinary Dashboard`
        );
      }
      
      throw new Error(`Upload video gagal: ${errorMessage}`);
    }
    return data.secure_url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      alert("Hanya file PDF, DOC, DOCX, atau TXT yang diizinkan");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_VIDEO_TYPES.includes(selectedFile.type)) {
      alert("Hanya file video MP4, WebM, MOV, atau AVI yang diizinkan");
      return;
    }

    if (selectedFile.size > MAX_VIDEO_SIZE) {
      alert("Ukuran video maksimal 100MB");
      return;
    }

    setVideoFile(selectedFile);
    setVideoUrl(""); // Clear URL input jika upload file
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      let fileUrl = null;
      let finalVideoUrl = null;

      // Upload video file jika ada
      if (videoFile) {
        setUploadingVideo(true);
        finalVideoUrl = await handleVideoUpload(videoFile);
        setUploadingVideo(false);
      } else if (videoUrl) {
        // Normalize video URL (convert YouTube to embed format)
        finalVideoUrl = normalizeVideoUrl(videoUrl);
      }

      // Upload file materi jika ada
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
          videoUrl: finalVideoUrl,
          content,
          chapterId,
          fileUrl,
        }),
      });

      router.refresh();
      setTitle("");
      setVideoUrl("");
      setVideoFile(null);
      setContent("");
      setFile(null);
      
      // Reset file inputs
      const fileInput = document.getElementById("lesson-file") as HTMLInputElement;
      const videoInput = document.getElementById("lesson-video") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      if (videoInput) videoInput.value = "";
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error?.message || "Gagal mengupload file. Silakan coba lagi.";
      alert(errorMessage);
    } finally {
      setLoading(false);
      setUploading(false);
      setUploadingVideo(false);
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
        disabled={uploading || uploadingVideo || loading}
      />

      {/* Video Upload atau URL */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Video - Optional
        </label>
        
        {/* Upload Video File */}
        <div className="mb-2">
          <input
            id="lesson-video"
            type="file"
            accept="video/*"
            onChange={handleVideoFileChange}
            className="border px-3 py-2 rounded w-full"
            disabled={uploading || uploadingVideo || loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload video file (MP4, WebM, MOV, AVI - Maks. 100MB)
          </p>
          {videoFile && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Video dipilih: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Atau masukkan URL */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ATAU</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Masukkan URL YouTube atau Cloudinary"
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            if (e.target.value) setVideoFile(null); // Clear file jika input URL
          }}
          className="border px-3 py-2 rounded w-full"
          disabled={uploading || uploadingVideo || loading}
        />
        {videoUrl && isYouTubeUrl(videoUrl) && (
          <p className="text-xs text-green-600 mt-1">
            ✓ URL YouTube terdeteksi - akan dikonversi ke format embed
          </p>
        )}
        {videoUrl && !isYouTubeUrl(videoUrl) && videoUrl.includes("cloudinary") && (
          <p className="text-xs text-blue-600 mt-1">
            ℹ️ URL Cloudinary terdeteksi
          </p>
        )}
        <p className="text-xs text-blue-600 mt-1">
          💡 Preset: lesson-videos | Format: MP4, WebM, MOV, AVI | Max: 100MB
        </p>
      </div>

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
          disabled={uploading || uploadingVideo || loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Format: PDF, DOC, DOCX, atau TXT (Maks. 10MB)
        </p>
        <p className="text-xs text-blue-600 mt-1">
          💡 Preset: lesson-files | Format: PDF, DOC, DOCX, TXT | Max: 10MB
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
        disabled={uploading || uploadingVideo || loading}
      />

      {uploading && (
        <p className="text-sm text-blue-600">Mengupload file materi...</p>
      )}
      {uploadingVideo && (
        <p className="text-sm text-blue-600">Mengupload video... (ini mungkin memakan waktu beberapa menit)</p>
      )}

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
        disabled={uploading || uploadingVideo || loading}
      >
        {uploading ? "Mengupload..." : loading ? "Menyimpan..." : "Tambah Lesson"}
      </button>
    </form>
  );
}
