"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ApplyTutorPage() {
  const { user, isLoaded } = useUser();

  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    portfolioLinks: "",
    skills: "",
    teachingPlan: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isLoaded) return null;
  if (!user) return <p className="text-center mt-10">Silakan login terlebih dahulu</p>;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const res = await fetch("/api/tutor/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        bio: form.bio,
        portfolioLinks: form.portfolioLinks
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        skills: form.skills
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        teachingPlan: form.teachingPlan,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || { general: [data.message] });
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <Card className="max-w-xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>🎉 Application Submitted</CardTitle>
          <CardDescription>
            Pendaftaran tutor kamu sedang direview oleh admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Kami akan menghubungi kamu jika sudah disetujui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto mt-12">
      <CardHeader>
        <CardTitle>Apply as Tutor</CardTitle>
        <CardDescription>
          Lengkapi data di bawah untuk mendaftar sebagai tutor
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nama lengkap kamu"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName[0]}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <Label>Bio</Label>
            <Textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Ceritakan pengalaman kamu"
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio[0]}</p>
            )}
          </div>

          {/* Portfolio */}
          <div className="space-y-1">
            <Label>Portfolio Links</Label>
            <Input
              name="portfolioLinks"
              value={form.portfolioLinks}
              onChange={handleChange}
              placeholder="https://artstation.com/..., https://linkedin.com/..."
            />
            {errors.portfolioLinks && (
              <p className="text-sm text-red-500">
                {errors.portfolioLinks[0]}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <Label>Skills</Label>
            <Input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Blender, 3D Modeling, Sculpting"
            />
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills[0]}</p>
            )}
          </div>

          {/* Teaching Plan */}
          <div className="space-y-1">
            <Label>Teaching Plan</Label>
            <Textarea
              name="teachingPlan"
              value={form.teachingPlan}
              onChange={handleChange}
              placeholder="Apa yang ingin kamu ajarkan?"
            />
            {errors.teachingPlan && (
              <p className="text-sm text-red-500">
                {errors.teachingPlan[0]}
              </p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general[0]}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Apply as Tutor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
