// app/dashboard/page.tsx
// Members-only page. Server Component — auth + role + entitlement read on the
// server, so all of it can be trusted (never exposed to the browser).

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";
import { startCheckout } from "@/app/checkout/actions";

export default async function Dashboard() {
  const supabase = await createClient();

  // SECURITY (C1/C3): confirm the user server-side.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // SECURITY (E2): RLS returns only THIS user's own rows.
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  const { data: entitlement } = await supabase
    .from("entitlements").select("status")
    .eq("user_id", user.id).eq("product", "challenge").maybeSingle();

  const isAdmin = profile?.role === "admin";
  const hasPaid = entitlement?.status === "active";

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1rem",
      fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Members area</h1>
      <p>Logged in as <strong>{user.email}</strong></p>
      <p>Role: <strong>{profile?.role ?? "unknown"}</strong></p>

      {hasPaid ? (
        <p style={{ color: "green", fontWeight: 600 }}>✓ You have full access to the challenge.</p>
      ) : (
        <form action={startCheckout}>
          <button type="submit"
            style={{ padding: ".8rem 1.75rem", borderRadius: 8, border: "none",
              background: "#0F766E", color: "white", fontWeight: 700, fontSize: "1.05rem", cursor: "pointer" }}>
            Join the challenge — £40
          </button>
        </form>
      )}

      {isAdmin && <Link href="/admin" style={{ color: "#0F766E", fontWeight: 600 }}>Go to Admin area</Link>}

      <form action={logout}>
        <button type="submit"
          style={{ padding: ".6rem 1.25rem", borderRadius: 8, border: "1px solid #ccc",
            fontWeight: 600, cursor: "pointer", background: "white" }}>
          Log out
        </button>
      </form>
    </main>
  );
}
