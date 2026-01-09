"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  courseId?: number;
  initialData?: {
    title: string;
    description: string;
    imageUrl?: string | null;
  };
  onClose?: () => void;
};

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CourseForm({
  courseId,
  initialData,
  onClose,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.imageUrl ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 UPLOAD IMAGE KE CLOUDINARY
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🛑 VALIDASI FRONTEND
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only JPG, PNG, or WEBP allowed");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("Max image size is 2MB");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setImageUrl(data.secure_url);
    setUploading(false);
  }

  // 🔹 SUBMIT COURSE
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(
      courseId ? `/api/tutor/courses/${courseId}` : `/api/tutor/courses`,
      {
        method: courseId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    setLoading(false);
    onClose?.();
    location.reload();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {courseId ? "Edit Course" : "Create New Course"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <div className="space-y-2">
            <Label>Course Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Course Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {uploading && (
              <p className="text-sm text-muted-foreground">
                Uploading image...
              </p>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded border"
              />
            )}
          </div>

          {/* ACTION */}
          <div className="flex gap-3">
            <Button disabled={loading || uploading}>
              {courseId ? "Update Course" : "Create Course"}
            </Button>

            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
