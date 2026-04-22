import { redirect } from "next/navigation";

/** Root URL — no page existed here, so Railway/Vercel showed 404. */
export default function AdminHomePage() {
  redirect("/login");
}
