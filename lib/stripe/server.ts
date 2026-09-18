// lib/stripe/server.ts
// Server-only Stripe client.
// SECURITY: uses STRIPE_SECRET_KEY (no NEXT_PUBLIC_ prefix) so it can NEVER be
// bundled into the browser. This key can move money — server-side only, always.
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
