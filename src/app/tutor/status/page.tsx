"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Status = "PENDING" | "APPROVED" | "REJECTED";

export default function TutorStatusPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }

    fetch("/api/tutor/application")
      .then(async (res) => {
        if (res.status === 404) {
          router.push("/tutor/apply");
          return;
        }

        const data = await res.json();
        setStatus(data.status);

        if (data.status === "APPROVED") {
          // optional auto redirect
          // router.push("/tutor/dashboard");
        }
      })
      .finally(() => setLoading(false));
  }, [isLoaded, user, router]);

  if (loading) {
    return <p className="text-center mt-10">Loading status...</p>;
  }

  if (!status) return null;

  return (
    <Card className="max-w-xl mx-auto mt-12">
      <CardHeader>
        <CardTitle>Status Pendaftaran Tutor</CardTitle>
        <CardDescription>
          Pantau status aplikasi tutor kamu di sini
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* PENDING */}
        {status === "PENDING" && (
          <>
            <Badge variant="secondary">PENDING</Badge>
            <Alert>
              <AlertDescription>
                Aplikasi kamu sedang direview oleh admin.  
                Mohon tunggu proses verifikasi.
              </AlertDescription>
            </Alert>
          </>
        )}

        {/* APPROVED */}
        {status === "APPROVED" && (
          <>
            <Badge className="bg-green-600">APPROVED</Badge>
            <Alert>
              <AlertDescription>
                Selamat! Kamu telah disetujui sebagai Tutor.
              </AlertDescription>
            </Alert>

            <Button
              className="w-full"
              onClick={() => router.push("/tutor/dashboard")}
            >
              Masuk Dashboard Tutor
            </Button>
          </>
        )}

        {/* REJECTED */}
        {status === "REJECTED" && (
          <>
            <Badge variant="destructive">REJECTED</Badge>
            <Alert variant="destructive">
              <AlertDescription>
                Aplikasi kamu ditolak.  
                Silakan perbaiki data & portfolio lalu apply ulang.
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/tutor/apply")}
            >
              Apply Ulang
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
