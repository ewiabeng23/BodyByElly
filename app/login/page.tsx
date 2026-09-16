"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "./actions";

const initialState: { error?: string } = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          Log in
        </h1>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email"
              style={{ padding: ".6rem", borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <span>Password</span>
            <input name="password" type="password" required autoComplete="current-password"
              style={{ padding: ".6rem", borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <button type="submit" disabled={pending}
            style={{ padding: ".7rem", borderRadius: 8, border: "none", fontWeight: 600,
              background: "#0F766E", color: "white", cursor: "pointer", opacity: pending ? 0.6 : 1 }}>
            {pending ? "Logging in..." : "Log in"}
          </button>

          {state?.error && <p style={{ color: "crimson", margin: 0 }}>{state.error}</p>}
        </form>

        <p style={{ marginTop: "1rem", fontSize: ".9rem" }}>
          No account? <Link href="/signup" style={{ color: "#0F766E" }}>Sign up</Link>
        </p>
      </div>
    </main>
  );
}
