"use client";

import { FormEvent, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const load = () => authFetch("/products").then((r) => setProducts(((r as { products?: Product[] }).products ?? []) as Product[])).catch(() => setProducts([]));
  useEffect(() => { load(); }, []);

  async function addProduct(e: FormEvent) {
    e.preventDefault();
    await authFetch("/products", { method: "POST", body: JSON.stringify({ name, price: Number(price), category: "General", description: name, stock: 10 }) });
    setName(""); setPrice(""); load();
  }

  async function del(id: string) { await authFetch(`/products/${id}`, { method: "DELETE" }); load(); }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Products Management</h1>
      <form onSubmit={addProduct} className="flex gap-2"><Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><Input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} /><Button type="submit">Add Product</Button></form>
      <div className="rounded border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
          <tbody>{products.map((p) => <tr key={p.id} className="border-t"><td className="p-3">{p.name}</td><td className="p-3">{p.price}</td><td className="p-3">{p.stock}</td><td className="p-3">{p.is_active ? "active" : "inactive"}</td><td className="p-3"><Button className="bg-red-600" onClick={() => del(p.id)}>Delete</Button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
