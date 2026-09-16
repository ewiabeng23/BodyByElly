import { createClient } from "@supabase/supabase-js";

// Reads the two NEXT_PUBLIC_ values from your environment.
// These are the safe, browser-exposable Supabase credentials.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
