"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TutorApplication = {
  id: number;
  fullName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

export default function AdminTutorApplicationsPage() {
  const [data, setData] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/tutor-applications")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tutor Applications</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.fullName}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        app.status === "PENDING"
                          ? "secondary"
                          : app.status === "APPROVED"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {app.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/tutor-applications/${app.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No applications
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
