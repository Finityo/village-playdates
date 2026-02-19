
-- Explicitly deny UPDATE and DELETE on messages (messages are immutable by design)
CREATE POLICY "Messages cannot be updated"
ON public.messages FOR UPDATE
USING (false);

CREATE POLICY "Messages cannot be deleted"
ON public.messages FOR DELETE
USING (false);
