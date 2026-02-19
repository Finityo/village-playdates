/**
 * Stripe Identity — VerifyIdentityButton Component
 *
 * A self-contained button that:
 *  1. Creates a Stripe Identity session via the edge function
 *  2. Redirects the user to Stripe's hosted verification flow
 *
 * Usage:
 *   import { VerifyIdentityButton } from "@/features/stripe-identity/components/VerifyIdentityButton";
 *   <VerifyIdentityButton userId={user.id} onVerified={() => refetchProfile()} />
 */

import { Loader2, ShieldCheck } from "lucide-react";
import { useStripeIdentity } from "../hooks/useStripeIdentity";

interface VerifyIdentityButtonProps {
  userId: string;
  onVerified?: () => void;
  className?: string;
  label?: string;
}

export function VerifyIdentityButton({
  userId,
  onVerified,
  className = "",
  label = "Verify My Identity",
}: VerifyIdentityButtonProps) {
  const { loading, error, startVerification } = useStripeIdentity({
    userId,
    onVerified,
  });

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={startVerification}
        disabled={loading}
        className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 bg-primary text-primary-foreground hover:opacity-90 ${className}`}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShieldCheck className="h-5 w-5" />
        )}
        {loading ? "Starting verification…" : label}
      </button>

      {error && (
        <p className="text-xs text-destructive font-medium text-center px-2">
          {error}. Please try again.
        </p>
      )}

      <p className="text-[11px] text-muted-foreground text-center px-4 leading-relaxed">
        Powered by Stripe Identity. Your ID is never stored on our servers.
      </p>
    </div>
  );
}
