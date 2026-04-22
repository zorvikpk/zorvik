import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold">{STORE_NAME || "StorePK"}</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/track">Track</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
