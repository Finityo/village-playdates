-- Fix RSVP visibility: allow seeing all RSVPs for any playdate you've RSVP'd to (for attendee count/avatars)
-- Also allow seeing RSVPs for all playdates (count is needed for UX) but not who specifically attended
-- Best balance: allow seeing RSVPs for playdates you RSVP'd to or created, keep strangers from mass-harvesting

DROP POLICY IF EXISTS "Users can view their own RSVPs and RSVPs for their playdates" ON public.playdate_rsvps;

CREATE POLICY "Users can view RSVPs for relevant playdates"
ON public.playdate_rsvps
FOR SELECT
USING (
  -- Own RSVP
  auth.uid() = user_id
  OR
  -- Creator of the playdate can see all who RSVP'd
  EXISTS (
    SELECT 1
    FROM public.playdates pd
    WHERE pd.id = playdate_rsvps.playdate_id
      AND pd.creator_id = auth.uid()
  )
  OR
  -- If you've RSVP'd to this playdate, you can see fellow attendees
  EXISTS (
    SELECT 1
    FROM public.playdate_rsvps my_rsvp
    WHERE my_rsvp.playdate_id = playdate_rsvps.playdate_id
      AND my_rsvp.user_id = auth.uid()
  )
);
