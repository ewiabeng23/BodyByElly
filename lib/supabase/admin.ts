// lib/supabase/admin.ts
// PRIVILEGED server-only Supabase client. Uses the service-role key, which
// BYPASSES RLS. This is the ONLY client permitted to write to entitlements.
// SECURITY: never import this into a client component or anything browser-bound.
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
