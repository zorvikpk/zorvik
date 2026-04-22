"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { products, isLoading } = useProducts(search);
  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);
  const [category, setCategory] = useState("All");
  const list = products.filter((p) => category === "All" || p.category === category);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <Input placeholder="Search product" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex gap-2 overflow-auto">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`rounded px-3 py-1 text-sm ${category === c ? "bg-black text-white" : "bg-white border"}`}>{c}</button>
        ))}
      </div>
      {isLoading ? <LoadingSpinner /> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  );
}
