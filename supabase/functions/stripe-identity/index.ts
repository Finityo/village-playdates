/**
 * Stripe Identity — Edge Function (with JWT authentication)
 *
 * Supported actions (POST body):
 *  { action: "create_session", userId: string, returnUrl: string }
 *  { action: "poll_session", sessionId: string }
 *  POST with Stripe-Signature header → webhook handler
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// ── Stripe helpers ──────────────────────────────────────────────────────────

async function stripeRequest(
  path: string,
  method: "GET" | "POST",
  body?: Record<string, string>
): Promise<Response> {
  const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY secret is not configured");

  const url = `https://api.stripe.com/v1${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const encodedBody = body ? new URLSearchParams(body).toString() : undefined;
  return fetch(url, { method, headers, body: encodedBody });
}

// ── Webhook signature verification ─────────────────────────────────────────

async function verifyStripeWebhook(
  payload: string,
  sigHeader: string
): Promise<boolean> {
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) return false;

  const parts = sigHeader.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  const v1Part = parts.find((p) => p.startsWith("v1="));
  if (!tPart || !v1Part) return false;

  const timestamp = tPart.slice(2);
  const expectedSig = v1Part.slice(3);
  const signedPayload = `${timestamp}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );

  const computed = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === expectedSig;
}

// ── JWT Authentication helper ───────────────────────────────────────────────

async function authenticateRequest(
  req: Request,
  supabase: ReturnType<typeof createClient>
): Promise<{ user: { id: string } | null; error: string | null }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid Authorization header" };
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: "Invalid or expired token" };
  }

  return { user, error: null };
}

// ── Main handler ────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── Stripe webhook (bypasses JWT auth — verified by Stripe signature instead)
  const stripeSignature = req.headers.get("stripe-signature");
  if (stripeSignature) {
    const rawBody = await req.text();
    const valid = await verifyStripeWebhook(rawBody, stripeSignature);

    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const event = JSON.parse(rawBody);

    if (event.type === "identity.verification_session.verified") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({ verified: true, verification_status: "verified" })
          .eq("id", userId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: corsHeaders,
    });
  }

  // ── All other requests require a valid JWT ──────────────────────────────
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  // Authenticate the request
  const { user, error: authError } = await authenticateRequest(req, supabase);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: authError ?? "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  let body: {
    action?: string;
    userId?: string;
    returnUrl?: string;
    sessionId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // ── create_session ────────────────────────────────────────────────────
  if (body.action === "create_session") {
    const { userId, returnUrl } = body;

    if (!userId || !returnUrl) {
      return new Response(
        JSON.stringify({ error: "userId and returnUrl are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Security: ensure the authenticated user can only create sessions for themselves
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: "Forbidden: cannot create session for another user" }),
        { status: 403, headers: corsHeaders }
      );
    }

    const res = await stripeRequest("/identity/verification_sessions", "POST", {
      type: "document",
      "metadata[user_id]": userId,
      "options[document][require_matching_selfie]": "true",
      return_url: returnUrl,
    });

    if (!res.ok) {
      const err = await res.json();
      return new Response(
        JSON.stringify({ error: err.error?.message ?? "Stripe error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const session = await res.json();

    // Mark profile as pending
    await supabase
      .from("profiles")
      .update({ verification_status: "pending" })
      .eq("id", userId);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── poll_session ──────────────────────────────────────────────────────
  if (body.action === "poll_session") {
    const { sessionId } = body;

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const res = await stripeRequest(
      `/identity/verification_sessions/${sessionId}`,
      "GET"
    );

    if (!res.ok) {
      const err = await res.json();
      return new Response(
        JSON.stringify({ error: err.error?.message ?? "Stripe error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const session = await res.json();

    // Security: ensure the session belongs to the authenticated user
    if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Forbidden: session does not belong to this user" }),
        { status: 403, headers: corsHeaders }
      );
    }

    const verified = session.status === "verified";

    return new Response(
      JSON.stringify({ status: session.status, verified }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), {
    status: 400,
    headers: corsHeaders,
  });
});
