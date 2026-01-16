"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnrollButton({ 
  courseId, 
  isEnrolled 
}: { 
  courseId: number;
  isEnrolled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    if (isEnrolled) {
      return; // Don't allow re-enrollment
    }

    try {
      setLoading(true);

      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal enroll");
        return;
      }

      alert("Berhasil enroll! 🎉");
      router.refresh();
    } catch (err) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <button
        disabled
        className="w-full bg-green-600 text-white py-3 rounded-lg cursor-not-allowed opacity-70"
      >
        ✓ Sudah Terdaftar
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
    >
      {loading ? "Memproses..." : "Daftar Sekarang"}
    </button>
  );
}