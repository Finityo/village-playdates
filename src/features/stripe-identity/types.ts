/**
 * Stripe Identity — Shared TypeScript Types
 *
 * These types mirror what the Stripe Identity API returns
 * and what the edge function sends back to the client.
 */

export type VerificationStatus = "unverified" | "pending" | "verified" | "failed";

export interface StripeVerificationSession {
  /** Stripe session ID, e.g. "vs_1AbCdEfGhIjK" */
  id: string;
  /** URL to redirect the user to for Stripe's hosted verification flow */
  url: string;
  /** Current status of the session */
  status: "requires_input" | "processing" | "verified" | "canceled";
}

export interface CreateSessionRequest {
  /** Supabase user ID — stored as metadata on the Stripe session */
  userId: string;
  /** Where Stripe should redirect after verification is complete */
  returnUrl: string;
}

export interface CreateSessionResponse {
  /** The redirect URL to send the user to */
  url: string;
  /** The Stripe session ID (store this to poll status later) */
  sessionId: string;
}

export interface PollSessionRequest {
  /** The Stripe session ID returned from createSession */
  sessionId: string;
}

export interface PollSessionResponse {
  status: StripeVerificationSession["status"];
  /** Whether Stripe has marked the session as fully verified */
  verified: boolean;
}

export interface WebhookEvent {
  type: "identity.verification_session.verified" | string;
  data: {
    object: {
      id: string;
      status: string;
      metadata: {
        user_id: string;
      };
    };
  };
}
