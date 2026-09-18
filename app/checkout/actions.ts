// app/checkout/actions.ts
// Server Action: starts a Stripe Checkout session for the £40 challenge.
"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

export async function startCheckout() {
  // SECURITY: only a logged-in user can start checkout, resolved server-side.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Don't let someone pay twice — if they already own it, send them in.
  const { data: existing } = await supabase
    .from("entitlements")
    .select("status")
    .eq("user_id", user.id)
    .eq("product", "challenge")
    .maybeSingle();
  if (existing?.status === "active") redirect("/members");

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    success_url: `${origin}/members?paid=1`,
    cancel_url: `${origin}/dashboard?canceled=1`,
  });

  if (!session.url) throw new Error("Could not create checkout session.");
  redirect(session.url);
}
