// app/admin/page.tsx
// Admin-only area. The lock is the point of this stage, not the contents —
// uploads / member list / earnings arrive in Increment 5.

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { logout } from "@/app/logout/actions";

export default async function AdminPage() {
  // SECURITY (D3/D4/D5): one line guards the whole page, server-side.
  const { user } = await requireAdmin();

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1rem",
      fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Admin area</h1>
      <p>Signed in as <strong>{user.email}</strong> (admin)</p>
      <p style={{ color: "#555" }}>Member management and uploads coming soon.</p>
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
