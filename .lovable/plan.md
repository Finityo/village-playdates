

# Comprehensive Codebase Audit and Fixes

## 1. Video Idea
This will need separate creative discussion -- skipping for now as it is not a code task.

---

## 2. Auth Credential Check

**Current status:** Auth is working for confirmed users. The recent auth logs show:
- User `christian.r.t@outlook.com` (Penny) successfully logged in at 18:30 UTC
- User `shelby@wcorwin.com` signed up but **never confirmed her email** -- she cannot log in
- The `handle_new_user` trigger on `auth.users` is functioning correctly and creates profile rows

**Issue found:** The Signup page redirects with `emailRedirectTo: window.location.origin` (the root `/` landing page). When a user clicks the verification link in their email, they land on `/` -- the public landing page -- with no indication they are now verified and should sign in. They are not auto-redirected to the dashboard.

**Fix:** After email confirmation redirect, detect the auth event in `useAuth` and navigate the confirmed user to `/dashboard` (or `/onboarding` if profile is incomplete).

---

## 3. Dead Code Inventory

Here is every piece of dead code found, what it does, and what depends on it:

### A. `src/components/Navbar.tsx` -- DEAD
- **What it does:** A desktop/mobile navbar with links to "Find Moms", "How it Works", "Safety", "Premium" and "Sign In" / "Join Free" buttons
- **Imported by:** Nothing. Zero imports anywhere in the codebase
- **Connections:** Links to `/browse`, hash anchors (`/#how`, `/#safety`, `/#premium`)
- **Safe to delete:** Yes -- the app uses `MobileTopBar` and `BottomNav` instead

### B. `src/components/NavLink.tsx` -- DEAD
- **What it does:** A wrapper around React Router's `NavLink` with `forwardRef` support and `activeClassName`/`pendingClassName` props
- **Imported by:** Nothing. Zero imports anywhere in the codebase
- **Connections:** None
- **Safe to delete:** Yes

### C. `src/assets/hero-image.jpg` -- DEAD
- **What it does:** An image asset (the app uses `hero-landing.jpg` instead)
- **Imported by:** Nothing. Zero imports anywhere in the codebase
- **Connections:** None
- **Safe to delete:** Yes

### D. `src/assets/social-og.jpg` -- DEAD (duplicate)
- **What it does:** Social sharing OG image
- **Imported by:** Nothing. There is also a `public/social-og.jpg` (which is the correct location for static assets). The `src/` copy is never referenced
- **Connections:** None
- **Safe to delete:** Yes (keep the `public/` copy)

### E. `src/App.css` -- DEAD
- **What it does:** Vite's default starter CSS with logo spin animation, `.card` padding, and `.read-the-docs` color. None of these classes are used
- **Imported by:** Nothing. The app uses `index.css` with Tailwind
- **Connections:** None
- **Safe to delete:** Yes

### F. `src/features/stripe-identity/` (entire folder) -- UNUSED (but keep)
- **What it does:** Complete Stripe Identity verification feature (VerifiedBadge, VerifyIdentityButton, VerificationStatusBanner, useStripeIdentity hook, types, edge function reference)
- **Imported by:** Nothing outside the feature folder itself. No page or component imports any stripe-identity export
- **Connections:** The edge function `supabase/functions/stripe-identity/` exists but the feature is not wired into any UI
- **Recommendation:** This is a prepared feature module, not dead code per se. Keep it but note it is not active. When you want to add identity verification, you just import the components into Profile or Onboarding pages

### G. `src/hooks/use-toast.ts` vs `src/components/ui/use-toast.ts` -- DUPLICATE
- `src/components/ui/use-toast.ts` simply re-exports from `src/hooks/use-toast.ts`
- All actual usage imports from `@/hooks/use-toast` directly
- The `src/components/ui/use-toast.ts` wrapper is technically dead
- **Safe to delete:** Yes

### H. `src/pages/Messages.tsx` -- internal `BottomNavBar` component (lines 457-490) -- DUPLICATE
- **What it does:** A local bottom nav bar used only inside the Messages page (because Messages suppresses the global shell nav)
- **This is NOT dead code** -- it is used. But it duplicates logic from `src/components/BottomNav.tsx`
- **Recommendation:** Could be refactored to reuse the shared BottomNav, but not strictly dead

### I. Favicon variants -- POTENTIALLY DEAD
- `public/favicon-option1.png` through `favicon-option4.png` -- these appear to be design alternatives. Only `public/favicon.ico` is used by `index.html`
- **Safe to delete:** Yes, if you have chosen your final favicon

### J. `src/test/example.test.ts` -- LIKELY DEAD
- A boilerplate test file from project setup
- **Safe to delete:** Yes, once real tests are in place

---

## 4. Email Verification Flow

**Current behavior:**
1. User signs up on `/signup`
2. `supabase.auth.signUp()` is called with `emailRedirectTo: window.location.origin` (which is the root `/`)
3. User is told "Check your email to confirm your account, then sign in"
4. When user clicks the verification link in their email, Supabase confirms their email and redirects to `/` (the public landing page)
5. User lands on the landing page with no indication they are verified. They must manually click "Sign In"

**Problem:** The user is NOT directed to the dashboard after clicking the verification link. They end up on the landing page.

**Fix:**
- Change `emailRedirectTo` to point to `/dashboard` (or `/login`)
- In the `AuthProvider` (`useAuth.tsx`), listen for the `SIGNED_IN` event from `onAuthStateChange` -- when it fires after email confirmation (token exchange), the session is set and `ProtectedRoute` will allow access to `/dashboard`
- Alternatively, redirect to `/login` with a success message like "Email confirmed! Please sign in."

**Recommended approach:** Set `emailRedirectTo: window.location.origin + '/dashboard'`. Since `onAuthStateChange` will fire with the new session from the confirmation link, the user will be authenticated and land directly on the dashboard. If their profile is incomplete, the dashboard already shows the "Complete your profile" nudge linking to `/onboarding`.

---

## 5. New Users Cannot Create Accounts / Not Receiving Verification Email

**Database evidence:**
- `shelby@wcorwin.com` created an account on Feb 20 at 16:33 UTC but `email_confirmed_at` is NULL -- she never confirmed
- Another user `testmaya.momcircle@mailinator.com` also has NULL `email_confirmed_at`

**Root cause analysis:**
The signup code itself works (profiles are created via the trigger). The issue is with **email delivery**:

1. **Lovable Cloud uses Supabase's built-in email service** which has rate limits and may have deliverability issues with certain email providers (e.g., Outlook, custom domains)
2. The confirmation email may be landing in spam/junk folders
3. Supabase's default email templates use a generic sender that some email providers flag

**Fixes to implement:**
- Add a "Resend verification email" button on the Login page for users who haven't confirmed yet
- Show a clearer post-signup screen that explains where to look for the email (including spam folder)
- Consider adding a custom SMTP provider (Resend, SendGrid) via Lovable Cloud secrets for better deliverability -- this requires configuring the Auth email settings

---

## Summary of Changes to Implement

### Phase 1: Dead Code Cleanup
Delete the following files (no dependencies, safe to remove):
- `src/components/Navbar.tsx`
- `src/components/NavLink.tsx`
- `src/assets/hero-image.jpg`
- `src/assets/social-og.jpg`
- `src/App.css`
- `src/components/ui/use-toast.ts`
- `public/favicon-option1.png` through `favicon-option4.png` (if final favicon chosen)

### Phase 2: Email Verification Flow Fix
- Update `emailRedirectTo` in `Signup.tsx` to `window.location.origin + '/dashboard'`
- Ensure `onAuthStateChange` in `useAuth.tsx` handles the token exchange from the confirmation link

### Phase 3: Improve Signup Experience
- Add "Resend verification email" functionality to the Login page
- Improve post-signup messaging (check spam folder, etc.)
- Add a "Didn't receive the email?" link with resend capability

### Technical Details

**Files to modify:**
- `src/pages/Signup.tsx` -- update `emailRedirectTo` and improve post-signup toast message
- `src/pages/Login.tsx` -- add "Resend verification email" option
- `src/hooks/useAuth.tsx` -- no changes needed (already handles auth state correctly)

**Files to delete:**
- `src/components/Navbar.tsx`
- `src/components/NavLink.tsx`
- `src/assets/hero-image.jpg`
- `src/assets/social-og.jpg`
- `src/App.css`
- `src/components/ui/use-toast.ts`

**No database changes needed.**

