"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { products, isLoading, error } = useProducts();
  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-black p-8 text-white">
        <p className="text-sm">Premium Pakistani Store</p>
        <h1 className="mt-2 text-3xl font-bold">One Clean Store</h1>
        <Link href="/products"><Button className="mt-4 bg-white text-black">Shop Products</Button></Link>
      </section>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {["Fast Delivery", "COD Available", "Secure Checkout", "Trusted Quality"].map((x) => (
          <div key={x} className="rounded border bg-white p-3 text-sm font-medium">{x}</div>
        ))}
      </section>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
      </section>
    </div>
  );
}
