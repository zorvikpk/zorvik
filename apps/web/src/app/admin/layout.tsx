"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    const role = (user as unknown as { role?: string } | null)?.role;
    if (!loading && (!isAuthenticated || role !== "admin")) router.replace("/dashboard");
  }, [loading, isAuthenticated, user, router]);

  return <div className="rounded border bg-white p-4">{children}</div>;
}
