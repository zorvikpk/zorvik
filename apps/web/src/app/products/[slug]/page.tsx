"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { WHATSAPP } from "@/lib/constants";
import type { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { StockBadge } from "@/components/StockBadge";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    apiFetch(`/products/public/${slug}`).then((res) => {
      const data = res as { product?: Product } | Product;
      setProduct((data as { product?: Product }).product ?? (data as Product));
    });
  }, [slug]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="aspect-square rounded bg-gray-100" />
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-lg font-medium">{formatCurrency(product.sale_price || product.price)}</p>
        <StockBadge stock={product.stock} />
        <p className="text-sm text-gray-600">{product.description}</p>
        <Button onClick={() => addItem({ product_id: product.id, name: product.name, price: product.sale_price || product.price, qty: 1, image: product.images?.[0] || "" })}>Add to Cart</Button>
        <a className="block text-sm text-green-700 underline" href={`https://wa.me/${WHATSAPP}?text=I want ${encodeURIComponent(product.name)}`}>WhatsApp Inquiry</a>
      </div>
    </div>
  );
}
