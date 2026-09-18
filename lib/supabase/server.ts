// lib/supabase/server.ts
// Supabase client for SERVER (Server Components / Actions) use.
// Reads and writes the auth session via cookies, so the server knows who the
// user is on each request. Still uses the public anon key + RLS — not a
// privileged client — so it too is bound by row-level security.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component (can't set cookies there) —
            // safe to ignore; the middleware refreshes the session instead.
          }
        },
      },
    }
  );
}
