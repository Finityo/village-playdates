/**
 * Stripe Identity — Public API
 *
 * Import everything you need from this single entry point:
 *
 *   import {
 *     VerifiedBadge,
 *     VerifyIdentityButton,
 *     VerificationStatusBanner,
 *     useStripeIdentity,
 *   } from "@/features/stripe-identity";
 */

// Components
export { VerifiedBadge } from "./components/VerifiedBadge";
export { VerifyIdentityButton } from "./components/VerifyIdentityButton";
export { VerificationStatusBanner } from "./components/VerificationStatusBanner";

// Hooks
export { useStripeIdentity } from "./hooks/useStripeIdentity";

// Types
export type {
  VerificationStatus,
  StripeVerificationSession,
  CreateSessionRequest,
  CreateSessionResponse,
  PollSessionRequest,
  PollSessionResponse,
  WebhookEvent,
} from "./types";
