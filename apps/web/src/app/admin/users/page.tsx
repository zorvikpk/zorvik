"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

type AdminUser = { id: string; name: string; email: string; plan?: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  useEffect(() => {
    authFetch("/admin/users").then((r) => setUsers(((r as { users?: AdminUser[] }).users ?? []) as AdminUser[])).catch(() => setUsers([]));
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Users</h1>
      <div className="rounded border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Plan</th></tr></thead>
          <tbody>{users.map((u) => <tr key={u.id} className="border-t"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{u.plan || "free"}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
