"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RejectDialog } from "@/components/admin/rejectdialog";

export default function TutorApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Ensure id is a string (useParams can return string | string[])
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectOpen, setRejectOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    fetch(`/api/admin/tutor-applications/${id}`, {
      credentials: "include", // penting agar Clerk session dikirim
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Failed to fetch" }));
          console.error("API ERROR:", err);
          return null;
        }
        return res.json();
      })
      .then(setApp)
      .catch((error) => {
        console.error("Fetch error:", error);
        setApp(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApprove() {
    if (!id) return;
    
    const res = await fetch(`/api/admin/tutor-applications/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    console.log("APPROVE RESPONSE:", data);
    router.push("/admin/tutor-applications");
  }

  async function handleReject(reason: string) {
    if (!id) return;
    
    const res = await fetch(`/api/admin/tutor-applications/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
      credentials: "include",
    });

    const data = await res.json();
    console.log("REJECT RESPONSE:", data);
    router.push("/admin/tutor-applications");
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!app) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">Application not found</p>
        <Button onClick={() => router.push("/admin/tutor-applications")} className="mt-4">
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {app.fullName}
            <Badge>{app.status}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <section>
            <h3 className="font-semibold">Bio</h3>
            <p className="text-sm text-muted-foreground">{app.bio}</p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {app.skills?.map((skill: string) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold">Portfolio</h3>
            <ul className="list-disc ml-5 text-sm">
              {app.portfolioLinks?.map((link: string) => (
                <li key={link}>
                  <a
                    href={link}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold">Teaching Plan</h3>
            <p className="text-sm text-muted-foreground">
              {app.teachingPlan}
            </p>
          </section>

          {app.status === "PENDING" && (
            <>
              <Separator />
              <div className="flex gap-3">
                <Button onClick={handleApprove}>Approve</Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleReject}
      />
    </div>
  );
}
