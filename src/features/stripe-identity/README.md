# Stripe Identity — ID Verification Integration

This folder contains **everything** needed to integrate Stripe Identity into MomCircle's
authentication flow. Nothing in this folder imports from the rest of the app's business
logic, making it fully portable and easy to wire up when you're ready.

---

## Folder Structure

```
src/features/stripe-identity/
├── README.md                          ← You are here
├── index.ts                           ← Public API barrel export
├── types.ts                           ← Shared TypeScript types
├── edge-function.ts.txt               ← Edge function code (copy to supabase/functions/)
├── hooks/
│   └── useStripeIdentity.ts           ← React hook – create & poll verification sessions
└── components/
    ├── VerifiedBadge.tsx              ← "Verified ✓" shield badge (drop-in anywhere)
    ├── VerifyIdentityButton.tsx       ← CTA button that opens Stripe's verification flow
    └── VerificationStatusBanner.tsx   ← Banner shown on Profile / post-signup
```

---

## Prerequisites

| Requirement | Details |
|---|---|
| Stripe account | https://dashboard.stripe.com |
| Stripe Identity enabled | Dashboard → Settings → Identity |
| Secret key | `STRIPE_SECRET_KEY` (starts with `sk_live_` or `sk_test_`) |
| Database columns | `verified boolean`, `verification_status text` already in `public.profiles` |

---

## Setup Steps

### 1. Add the Stripe Secret Key

In Lovable Cloud, add the secret:
- Name: `STRIPE_SECRET_KEY`
- Value: your Stripe secret key from https://dashboard.stripe.com/apikeys

### 2. Deploy the Edge Function

Copy `edge-function.ts.txt` to `supabase/functions/stripe-identity/index.ts`
(rename it — the `.txt` extension prevents the TypeScript compiler from picking it up).

Add to `supabase/config.toml`:
```toml
[functions.stripe-identity]
verify_jwt = false
```

### 3. Wire the UI Components

**Post-signup verification banner** — add to your post-auth screen:
```tsx
import { VerificationStatusBanner } from "@/features/stripe-identity/components/VerificationStatusBanner";

<VerificationStatusBanner userId={user.id} verificationStatus={profile.verification_status} />
```

**Verified badge** — add to Browse and Profile cards:
```tsx
import { VerifiedBadge } from "@/features/stripe-identity/components/VerifiedBadge";

{profile.verified && <VerifiedBadge />}
```

**Trigger button** — standalone button to start verification:
```tsx
import { VerifyIdentityButton } from "@/features/stripe-identity/components/VerifyIdentityButton";

<VerifyIdentityButton userId={user.id} onVerified={() => refetchProfile()} />
```

---

## Verification Flow

```
User signs up
     ↓
Email confirmed → Login
     ↓
VerificationStatusBanner appears (status = "unverified")
     ↓
User clicks "Verify My Identity"
     ↓
Edge function creates Stripe Identity session → returns session URL
     ↓
User completes ID scan on Stripe-hosted page
     ↓
Stripe webhook → Edge function updates profiles.verification_status = "verified"
     profiles.verified = true
     ↓
VerifiedBadge appears on their Browse & Profile cards
```

---

## Webhook Setup (Required for Production)

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://<your-project>.supabase.co/functions/v1/stripe-identity`
3. Select event: `identity.verification_session.verified`
4. Copy the **Webhook Signing Secret** → add as `STRIPE_WEBHOOK_SECRET` in Lovable Cloud secrets

---

## Test Mode

Use `sk_test_` key and Stripe's test document images:
https://stripe.com/docs/identity/verification-checks?type=document#test-data

---

## Cost

~$1.50 per successful verification (Stripe Identity pricing).
No charge for failed or cancelled sessions.
