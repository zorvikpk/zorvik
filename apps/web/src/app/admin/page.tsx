"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

export default function AdminPage() {
  const [stats, setStats] = useState<{ totalStores: number; totalUsers: number } | null>(null);
  useEffect(() => {
    authFetch("/admin/stats")
      .then((r) => {
        const s = r as { totals?: { stores?: number; users?: number } };
        setStats({ totalStores: s.totals?.stores ?? 0, totalUsers: s.totals?.users ?? 0 });
      })
      .catch(() => setStats({ totalStores: 0, totalUsers: 0 }));
  }, []);
  return <div className="grid grid-cols-2 gap-3"><div className="rounded border p-4">Total Stores: {stats?.totalStores ?? 0}</div><div className="rounded border p-4">Total Users: {stats?.totalUsers ?? 0}</div></div>;
}
