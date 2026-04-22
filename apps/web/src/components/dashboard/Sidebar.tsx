"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 border-r p-4">
      <div className="space-y-1">
        {links.map((x) => (
          <Link key={x.href} href={x.href} className={`block rounded px-3 py-2 text-sm ${path === x.href ? "bg-black text-white" : "hover:bg-gray-100"}`}>
            {x.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
