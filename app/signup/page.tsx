"use client";

import { useActionState } from "react";
import { signUp } from "./actions";

const initialState: { error?: string; success?: string } = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          Create your account
        </h1>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email"
              style={{ padding: ".6rem", borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
            <span>Password</span>
            <input name="password" type="password" required minLength={8} autoComplete="new-password"
              style={{ padding: ".6rem", borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <button type="submit" disabled={pending}
            style={{ padding: ".7rem", borderRadius: 8, border: "none", fontWeight: 600,
              background: "#0F766E", color: "white", cursor: "pointer", opacity: pending ? 0.6 : 1 }}>
            {pending ? "Creating account..." : "Sign up"}
          </button>

          {state?.error && <p style={{ color: "crimson", margin: 0 }}>{state.error}</p>}
          {state?.success && <p style={{ color: "green", margin: 0 }}>{state.success}</p>}
        </form>
      </div>
    </main>
  );
}
