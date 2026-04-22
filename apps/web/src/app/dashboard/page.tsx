"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import type { Order, Stats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    authFetch("/stores/my/stats").then((r) => setStats(r as Stats)).catch(() => setStats(null));
    authFetch("/orders").then((r) => setOrders(((r as { orders?: Order[] }).orders ?? []) as Order[])).catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatsCard label="Today Orders" value={stats?.today_orders ?? 0} />
        <StatsCard label="Today Revenue" value={stats?.today_revenue ?? 0} />
        <StatsCard label="Month Orders" value={stats?.month_orders ?? 0} />
        <StatsCard label="Pending" value={stats?.pending_orders ?? 0} />
      </div>
      <div className="rounded border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">ID</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr></thead>
          <tbody>{orders.slice(0, 5).map((o) => <tr key={o.id} className="border-t"><td className="p-3">{o.id}</td><td className="p-3">{o.customer_name}</td><td className="p-3">{o.total}</td><td className="p-3">{o.order_status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
