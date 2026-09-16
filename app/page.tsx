import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic"; // always read fresh, no caching for this test

export default async function Home() {
  const { data, error } = await supabase
    .from("connection_test")
    .select("message")
    .limit(1)
    .single();

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1rem",
      fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Body By Elly</h1>
      {error ? (
        <p style={{ color: "crimson" }}>Supabase error: {error.message}</p>
      ) : (
        <p style={{ fontSize: "1.25rem" }}>{data?.message}</p>
      )}
    </main>
  );
}
