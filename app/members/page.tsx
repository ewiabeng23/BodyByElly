// app/members/page.tsx
// The paid members' area — where the workout clips live.
// SECURITY (paywall): only users with an ACTIVE entitlement can view this page.
// (Video-level token protection is added in the next stage.)

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

// Test clip for now — real clips come from Elly's uploads later.
const TEST_VIDEO = {
  libraryId: "756848",
  videoId: "07f3443d-b2d8-48e9-b20b-37a5f40c4f9f",
  title: "Test clip",
};

export default async function MembersPage() {
  const supabase = await createClient();

  // SECURITY: must be logged in.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // SECURITY (paywall): must have an active entitlement, checked server-side.
  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("status")
    .eq("user_id", user.id)
    .eq("product", "challenge")
    .maybeSingle();

  // No active entitlement → send them to the dashboard to join.
  if (entitlement?.status !== "active") redirect("/dashboard");

  const embedSrc = `https://iframe.mediadelivery.net/embed/${TEST_VIDEO.libraryId}/${TEST_VIDEO.videoId}?autoplay=false&loop=true&muted=false&preload=true&responsive=true`;

  return (
    <main style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: ".5rem" }}>The Challenge — Your Workouts</h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>Welcome, {user.email}. Full access unlocked. ✓</p>

      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: ".5rem" }}>{TEST_VIDEO.title}</h2>
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>
          <iframe
            src={embedSrc}
            loading="lazy"
            style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
            allowFullScreen
          />
        </div>
      </div>

      <form action={logout}>
        <button type="submit" style={{ padding: ".6rem 1.25rem", borderRadius: 8, border: "1px solid #ccc", fontWeight: 600, cursor: "pointer", background: "white" }}>
          Log out
        </button>
      </form>
    </main>
  );
}
