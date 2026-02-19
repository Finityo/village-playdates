
-- ══════════════════════════════════════════════════════════
-- CHILD SAFETY: Tighten RLS policies
-- ══════════════════════════════════════════════════════════

-- ── 1. PROFILES: Restrict access to lat/lng via column-level security ──────────
-- Revoke the sensitive GPS columns from the general authenticated role.
-- Safe browsing columns (name, bio, avatar, neighborhood, interests, 
-- verification status) remain fully accessible.
-- lat/lng are not used by any browse/map feature (map uses static park data).

REVOKE SELECT (lat, lng) ON public.profiles FROM authenticated;

GRANT SELECT (
  id,
  created_at,
  updated_at,
  verified,
  bio,
  avatar_url,
  verification_status,
  display_name,
  neighborhood,
  kids_ages,
  interests
) ON public.profiles TO authenticated;

-- Create a security definer function so the profile OWNER can still read
-- their own GPS coordinates (for profile editing / onboarding).
CREATE OR REPLACE FUNCTION public.get_my_location()
RETURNS TABLE(lat double precision, lng double precision)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.lat, p.lng
  FROM public.profiles p
  WHERE p.id = auth.uid()
$$;

-- ── 2. PLAYDATE RSVPs: Restrict to own RSVPs + playdates the user created ──────
DROP POLICY IF EXISTS "Authenticated users can view all rsvps" ON public.playdate_rsvps;

CREATE POLICY "Users can view their own RSVPs and RSVPs for their playdates"
ON public.playdate_rsvps
FOR SELECT
USING (
  -- Own RSVP
  auth.uid() = user_id
  OR
  -- Creator of the playdate can see who RSVP'd
  EXISTS (
    SELECT 1
    FROM public.playdates pd
    WHERE pd.id = playdate_rsvps.playdate_id
      AND pd.creator_id = auth.uid()
  )
);
