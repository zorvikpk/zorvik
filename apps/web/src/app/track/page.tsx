"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TrackPage() {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      setError("");
      const q = new URLSearchParams();
      if (id) q.set("id", id);
      if (phone) q.set("phone", phone);
      const res = await apiFetch(`/orders/track?${q.toString()}`);
      setOrder((res as { order?: Order }).order ?? (res as Order));
    } catch {
      setOrder(null);
      setError("Order not found");
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <form onSubmit={submit} className="space-y-3 rounded border bg-white p-5">
        <h1 className="text-2xl font-semibold">Track Order</h1>
        <Input placeholder="Order ID" value={id} onChange={(e) => setId(e.target.value)} />
        <Input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button type="submit">Track</Button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {order && (
        <div className="rounded border bg-white p-4">
          <p><b>ID:</b> {order.id}</p>
          <p><b>Status:</b> {order.order_status}</p>
          <p><b>Total:</b> {order.total}</p>
        </div>
      )}
    </div>
  );
}
