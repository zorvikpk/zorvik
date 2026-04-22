"use client";

import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WHATSAPP } from "@/lib/constants";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="mx-auto min-h-[75vh] max-w-6xl px-4 py-6">{children}</main>
            <Footer />
            {WHATSAPP && (
              <a href={`https://wa.me/${WHATSAPP}`} className="fixed bottom-4 right-4 rounded-full bg-green-500 px-4 py-3 text-white">
                WhatsApp
              </a>
            )}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
