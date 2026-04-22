"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types";

type CartCtx = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const ex = prev.find((x) => x.product_id === item.product_id);
      if (!ex) return [...prev, item];
      return prev.map((x) => (x.product_id === item.product_id ? { ...x, qty: x.qty + item.qty } : x));
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((x) => x.product_id !== id));
  }

  function updateQty(id: string, qty: number) {
    setItems((prev) => prev.map((x) => (x.product_id === id ? { ...x, qty } : x)).filter((x) => x.qty > 0));
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
