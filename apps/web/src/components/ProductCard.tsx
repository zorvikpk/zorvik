import Link from "next/link";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="mb-3 aspect-square rounded bg-gray-100" />
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-600">{formatCurrency(product.sale_price || product.price)}</p>
      <Link href={`/products/${product.slug}`}><Button className="mt-3 w-full">View</Button></Link>
    </div>
  );
}
