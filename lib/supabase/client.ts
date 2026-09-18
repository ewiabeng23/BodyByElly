// lib/supabase/client.ts
// Supabase client for BROWSER (client component) use.
// SECURITY: uses only the PUBLIC anon key — safe to expose. Everything it can
// do is still constrained by RLS, so even fully visible it can't read or change
// data the logged-in user isn't allowed to. Never use the service-role key here.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
