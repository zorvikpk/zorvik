"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import type { Order } from "@/types";

const statuses = ["new", "confirmed", "shipped", "delivered", "cancelled"];

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const load = () => authFetch("/orders").then((r) => setOrders(((r as { orders?: Order[] }).orders ?? []) as Order[])).catch(() => setOrders([]));
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await authFetch(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders Management</h1>
      <div className="rounded border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">ID</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
          <tbody>{orders.map((o) => <tr key={o.id} className="border-t"><td className="p-3">{o.id}</td><td className="p-3">{o.customer_name}</td><td className="p-3">{o.total}</td><td className="p-3"><select value={o.order_status} onChange={(e) => updateStatus(o.id, e.target.value)} className="rounded border px-2 py-1">{statuses.map((s) => <option key={s}>{s}</option>)}</select></td><td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
