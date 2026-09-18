// app/dashboard/page.tsx
// Members-only page. Server Component — auth check and role read run on the
// server, so they can be trusted (never exposed to the browser).

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

export default async function Dashboard() {
  const supabase = await createClient();

  // SECURITY (C1/C3): confirm the user server-side (defence in depth alongside middleware).
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // SECURITY (E2): RLS returns only THIS user's own profile row.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1rem",
      fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Members area</h1>
      <p>Logged in as <strong>{user.email}</strong></p>
      <p>Role: <strong>{profile?.role ?? "unknown"}</strong></p>

      {/* Only admins see the door to /admin. The real gate is server-side in requireAdmin(). */}
      {isAdmin && (
        <Link href="/admin" style={{ color: "#0F766E", fontWeight: 600 }}>
          Go to Admin area
        </Link>
      )}

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
