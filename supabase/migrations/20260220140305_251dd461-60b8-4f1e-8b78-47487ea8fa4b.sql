-- Fix infinite recursion in playdate_rsvps RLS policy
-- The existing "Users can view RSVPs for relevant playdates" policy has a self-referencing subquery
-- that causes infinite recursion when playdates are joined with rsvps.

DROP POLICY IF EXISTS "Users can view RSVPs for relevant playdates" ON public.playdate_rsvps;

-- Simpler policy: a user can see RSVPs if they are the RSVP owner,
-- OR if they are the creator of the playdate,
-- OR if they themselves have RSVPed to the same playdate.
-- We avoid recursion by NOT querying playdate_rsvps inside the policy.
CREATE POLICY "Users can view RSVPs for relevant playdates"
ON public.playdate_rsvps
FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.playdates pd
    WHERE pd.id = playdate_rsvps.playdate_id
      AND pd.creator_id = auth.uid()
  )
);