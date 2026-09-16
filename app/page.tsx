import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1.5rem",
      fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Body By Elly</h1>
      <p style={{ fontSize: "1.15rem", color: "#555" }}>
        Your 6-week transformation starts here.
      </p>

      <Link href="/signup"
        style={{ padding: ".7rem 1.5rem", borderRadius: 8, background: "#0F766E",
          color: "white", fontWeight: 600, textDecoration: "none" }}>
        Sign up
      </Link>
    </main>
  );
}
