// lib/auth/requireAdmin.ts
// Server-side gate for admin-only pages. Call this at the top of any admin
// page/action. One place to get right, reused everywhere — so a new admin
// page can never accidentally ship without the check.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  // SECURITY (D5): resolve the user server-side. Never trust a role claim
  // sent from the browser — always read it fresh from the database here.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // SECURITY (E2/D5): RLS lets a user read only their own profile row.
  // We read THIS user's role server-side and gate on it.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // A non-admin (or missing profile) gets bounced to their normal dashboard.
  if (profile?.role !== "admin") redirect("/dashboard");

  return { user, role: profile.role };
}
