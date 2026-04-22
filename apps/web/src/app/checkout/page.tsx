"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { apiFetch } from "@/lib/api";
import { CITIES, DELIVERY_FEE, PAYMENT_METHODS, PHONE_REGEX } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].id);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const grand = useMemo(() => total + DELIVERY_FEE, [total]);

  async function place(e: FormEvent) {
    e.preventDefault();
    if (!PHONE_REGEX.test(phone)) return setError("Phone must be like 03XXXXXXXXX");
    if (items.length === 0) return setError("Cart is empty");
    try {
      setBusy(true);
      setError("");
      const publicProducts = (await apiFetch("/products/public")) as
        | { products?: Array<Record<string, unknown>> }
        | Array<Record<string, unknown>>;
      const rows = Array.isArray(publicProducts) ? publicProducts : (publicProducts.products ?? []);
      const first = rows[0];
      const storeId = (first?.storeId as string | undefined) || (first?.store_id as string | undefined);
      if (!storeId) throw new Error("Store is not configured");
      const res = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          storeId,
          customerName: name,
          customerPhone: phone,
          customerCity: city,
          customerAddress: address,
          items: items.map((i) => ({ productId: i.product_id, quantity: i.qty })),
          paymentMethod: payment,
        }),
      });
      const data = res as { order?: { id: string }; id?: string };
      clearCart();
      router.push(`/order-confirmation/${data.order?.id || data.id}`);
    } catch {
      setError("Could not place order. Please verify store setup.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={place} className="mx-auto max-w-xl space-y-3 rounded border bg-white p-5">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder="03XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <select className="w-full rounded-md border px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <Textarea placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <select className="w-full rounded-md border px-3 py-2" value={payment} onChange={(e) => setPayment(e.target.value)}>{PAYMENT_METHODS.map((m) => <option value={m.id} key={m.id}>{m.label}</option>)}</select>
      <p className="text-sm">Delivery Fee: {DELIVERY_FEE} PKR</p>
      <p className="font-medium">Grand Total: {grand} PKR</p>
      <Button disabled={busy} type="submit">{busy ? "Placing..." : "Place Order"}</Button>
    </form>
  );
}
