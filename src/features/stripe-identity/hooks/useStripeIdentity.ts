/**
 * Stripe Identity — useStripeIdentity Hook
 *
 * Handles:
 *  1. Creating a Stripe Identity verification session via the edge function
 *  2. Redirecting the user to Stripe's hosted verification page
 *  3. Polling the session status after the user returns (via ?session_id= param)
 *
 * Usage:
 *   const { startVerification, pollStatus, loading, error } = useStripeIdentity(userId);
 */

import { useState, useCallback } from "react";
import type {
  CreateSessionResponse,
  PollSessionResponse,
  VerificationStatus,
} from "../types";

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-identity`;

interface UseStripeIdentityOptions {
  userId: string;
  /**
   * Called when the user's profile is confirmed as verified.
   * Use this to refetch the profile or update local state.
   */
  onVerified?: () => void;
}

interface UseStripeIdentityReturn {
  loading: boolean;
  error: string | null;
  /** Redirects the user to Stripe's hosted verification flow */
  startVerification: () => Promise<void>;
  /** Call this when the user returns from Stripe (e.g. on page load with ?session_id= in URL) */
  pollStatus: (sessionId: string) => Promise<VerificationStatus | null>;
}

export function useStripeIdentity({
  userId,
  onVerified,
}: UseStripeIdentityOptions): UseStripeIdentityReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startVerification = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const returnUrl = `${window.location.origin}/profile?verify_return=1`;

      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_session",
          userId,
          returnUrl,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const data: CreateSessionResponse = await res.json();

      // Persist the session ID so we can poll status when the user returns
      sessionStorage.setItem("stripe_identity_session_id", data.sessionId);

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setLoading(false);
    }
  }, [userId]);

  const pollStatus = useCallback(
    async (sessionId: string): Promise<VerificationStatus | null> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(EDGE_FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "poll_session", sessionId }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        const data: PollSessionResponse = await res.json();

        if (data.verified) {
          onVerified?.();
          return "verified";
        }

        if (data.status === "processing") return "pending";
        if (data.status === "canceled") return "failed";
        return "unverified";
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [onVerified]
  );

  return { loading, error, startVerification, pollStatus };
}
