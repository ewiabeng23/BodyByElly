// app/dashboard/page.tsx
// Members-only page. Server Component — runs on the server, so the
// auth check and role read can be trusted (never exposed to the browser).

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

export default async function Dashboard() {
  const supabase = await createClient();

  // SECURITY (C1/C3): confirm the user server-side. Middleware also guards
  // this route, but we re-check here as defence in depth. Never trust the client.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // SECURITY (E2): RLS lets a user read only their OWN profile row.
  // This query returns nothing for anyone but the owner, enforced at the DB.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1rem",
      fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Members area</h1>
      <p>Logged in as <strong>{user.email}</strong></p>
      <p>Role: <strong>{profile?.role ?? "unknown"}</strong></p>
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
