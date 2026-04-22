"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {items.map((item) => (
        <CartItem
          key={item.product_id}
          item={item}
          onPlus={() => updateQty(item.product_id, item.qty + 1)}
          onMinus={() => updateQty(item.product_id, item.qty - 1)}
          onRemove={() => removeItem(item.product_id)}
        />
      ))}
      <div className="rounded border bg-white p-4">
        <p className="text-lg font-semibold">Total: {formatCurrency(total)}</p>
        <Link href="/checkout"><Button className="mt-3">Proceed to Checkout</Button></Link>
      </div>
    </div>
  );
}
