// lib/supabase/middleware.ts
// Runs on every request: refreshes the auth session cookie so logins survive
// page loads, and blocks logged-out users from protected routes at the edge.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // SECURITY: refresh the session. Do NOT put code between createServerClient
  // and getUser() — it must run first, or sessions won't refresh correctly.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // SECURITY (C1): protected routes require a logged-in user. This is an
  // edge-level "are you logged in?" check. The finer-grained "are you an
  // admin?" check lives in requireAdmin() on the /admin page itself.
  const path = request.nextUrl.pathname;
  const protectedPrefixes = ["/dashboard", "/admin"];
  if (protectedPrefixes.some((p) => path.startsWith(p)) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
