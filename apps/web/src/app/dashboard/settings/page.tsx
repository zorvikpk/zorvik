"use client";

import { FormEvent, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardSettingsPage() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    authFetch("/stores/my").then((r) => {
      const store = (r as { store?: { name?: string; whatsappNumber?: string; logoUrl?: string } }).store;
      setName(store?.name || "");
      setWhatsapp(store?.whatsappNumber || "");
      setLogo(store?.logoUrl || "");
    });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    await authFetch("/stores/my", { method: "PUT", body: JSON.stringify({ name, whatsappNumber: whatsapp, logoUrl: logo }) });
  }

  return (
    <form onSubmit={save} className="max-w-xl space-y-3">
      <h1 className="text-xl font-semibold">Settings</h1>
      <Input placeholder="Store Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
      <Input placeholder="Logo URL" value={logo} onChange={(e) => setLogo(e.target.value)} />
      <Button type="submit">Save Settings</Button>
    </form>
  );
}
