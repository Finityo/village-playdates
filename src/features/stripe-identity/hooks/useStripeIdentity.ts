/**
 * Stripe Identity — useStripeIdentity Hook
 *
 * Every request to the edge function is authenticated with the user's JWT.
 * The edge function validates the token and enforces that users can only
 * create/poll their own verification sessions.
 */

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  CreateSessionResponse,
  PollSessionResponse,
  VerificationStatus,
} from "../types";

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-identity`;

interface UseStripeIdentityOptions {
  userId: string;
  onVerified?: () => void;
}

interface UseStripeIdentityReturn {
  loading: boolean;
  error: string | null;
  startVerification: () => Promise<void>;
  pollStatus: (sessionId: string) => Promise<VerificationStatus | null>;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("You must be signed in to verify your identity.");
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.access_token}`,
  };
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
      const headers = await getAuthHeaders();
      const returnUrl = `${window.location.origin}/profile?verify_return=1`;

      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers,
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
        const headers = await getAuthHeaders();

        const res = await fetch(EDGE_FUNCTION_URL, {
          method: "POST",
          headers,
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
