/**
 * Stripe Identity — VerificationStatusBanner Component
 *
 * A contextual banner that shows the user's current verification status
 * and prompts them to verify if not yet done.
 *
 * Shows:
 *  - "unverified" → prompt to verify with CTA button
 *  - "pending"    → "We're reviewing your ID" message
 *  - "verified"   → success confirmation (optionally hidden)
 *  - "failed"     → prompt to retry
 *
 * Usage:
 *   import { VerificationStatusBanner } from "@/features/stripe-identity/components/VerificationStatusBanner";
 *   <VerificationStatusBanner
 *     userId={user.id}
 *     verificationStatus={profile.verification_status}
 *     onVerified={() => refetchProfile()}
 *   />
 */

import { useEffect } from "react";
import { Shield, ShieldCheck, ShieldAlert, Clock, X } from "lucide-react";
import { VerifyIdentityButton } from "./VerifyIdentityButton";
import { useStripeIdentity } from "../hooks/useStripeIdentity";
import type { VerificationStatus } from "../types";

interface VerificationStatusBannerProps {
  userId: string;
  verificationStatus: VerificationStatus | string;
  onVerified?: () => void;
  /** Hide the "verified" success state (e.g. already shown via badge) */
  hideWhenVerified?: boolean;
  onDismiss?: () => void;
}

export function VerificationStatusBanner({
  userId,
  verificationStatus,
  onVerified,
  hideWhenVerified = false,
  onDismiss,
}: VerificationStatusBannerProps) {
  const { pollStatus } = useStripeIdentity({ userId, onVerified });

  // On mount, check if user returned from Stripe (URL has ?verify_return=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isReturn = params.get("verify_return") === "1";
    const sessionId = sessionStorage.getItem("stripe_identity_session_id");

    if (isReturn && sessionId && verificationStatus !== "verified") {
      sessionStorage.removeItem("stripe_identity_session_id");
      pollStatus(sessionId).then(() => {
        // Clean up URL param
        const url = new URL(window.location.href);
        url.searchParams.delete("verify_return");
        window.history.replaceState({}, "", url.toString());
      });
    }
  }, []);

  if (hideWhenVerified && verificationStatus === "verified") return null;

  if (verificationStatus === "verified") {
    return (
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-4">
        <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-primary">Identity Verified ✓</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your account has been verified. Your Verified badge is now visible to other moms.
          </p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <div className="flex items-start gap-3 bg-muted/50 border border-border rounded-2xl p-4 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold">Verification in progress</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            We're reviewing your ID. This usually takes a few minutes. We'll update your profile automatically.
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-destructive">Verification failed</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              We couldn't verify your identity. Please try again with a clear photo of your government-issued ID.
            </p>
          </div>
        </div>
        <VerifyIdentityButton userId={userId} onVerified={onVerified} label="Try Again" />
      </div>
    );
  }

  // Default: unverified — prompt to verify
  return (
    <div className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-card">
      <div className="flex items-start gap-3 mb-4">
        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold">Get your Verified badge 🛡️</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verify your identity to earn a "Verified ✓" badge. It takes about 2 minutes and
            builds trust with other moms in your community.
          </p>
        </div>
      </div>
      <VerifyIdentityButton userId={userId} onVerified={onVerified} />
    </div>
  );
}
