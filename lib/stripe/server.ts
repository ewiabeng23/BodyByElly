// lib/stripe/server.ts
// Server-only Stripe client, created lazily (only when first used) so a missing
// key at build time can't crash the build — only an actual request would fail.
// SECURITY: uses STRIPE_SECRET_KEY (no NEXT_PUBLIC_ prefix) — server-only, always.
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}
