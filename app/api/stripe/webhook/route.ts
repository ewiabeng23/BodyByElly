// app/api/stripe/webhook/route.ts
// Receives payment events from Stripe and grants access. This is the ONLY
// thing that grants entitlements — never the browser, never the success page.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  // SECURITY: verify the message REALLY came from Stripe. Without this, anyone
  // could POST "user X paid". A bad/forged signature is rejected here.
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: `Webhook signature failed: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.client_reference_id;
    const sessionId = session.id;
    const customerId =
      typeof session.customer === "string" ? session.customer : null;

    if (userId && session.payment_status === "paid") {
      const admin = createAdminClient();

      // Grant access. Unique constraints make this idempotent — a duplicate
      // webhook can't double-grant.
      const { error } = await admin.from("entitlements").upsert(
        {
          user_id: userId,
          product: "challenge",
          status: "active",
          stripe_customer_id: customerId,
          stripe_checkout_session_id: sessionId,
        },
        { onConflict: "user_id,product" }
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
