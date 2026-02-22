
-- Notifications table for in-app alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications (via trigger with SECURITY DEFINER)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Trigger function: notify attendees when playdate is updated
CREATE OR REPLACE FUNCTION public.notify_playdate_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only notify if meaningful fields changed
  IF OLD.park IS DISTINCT FROM NEW.park
    OR OLD.date IS DISTINCT FROM NEW.date
    OR OLD.time IS DISTINCT FROM NEW.time
    OR OLD.description IS DISTINCT FROM NEW.description
  THEN
    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    SELECT
      r.user_id,
      'playdate_updated',
      'Playdate Updated 📝',
      'The playdate at ' || NEW.park || ' on ' || NEW.date || ' has been updated by the host.',
      jsonb_build_object('playdate_id', NEW.id, 'park', NEW.park, 'date', NEW.date, 'time', NEW.time)
    FROM public.playdate_rsvps r
    WHERE r.playdate_id = NEW.id
      AND r.user_id != NEW.creator_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_playdate_updated
  AFTER UPDATE ON public.playdates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_playdate_updated();

-- Trigger function: notify attendees when playdate is deleted
CREATE OR REPLACE FUNCTION public.notify_playdate_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, body, metadata)
  SELECT
    r.user_id,
    'playdate_deleted',
    'Playdate Cancelled 😢',
    'The playdate at ' || OLD.park || ' on ' || OLD.date || ' at ' || OLD.time || ' has been cancelled by the host.',
    jsonb_build_object('playdate_id', OLD.id, 'park', OLD.park, 'date', OLD.date, 'time', OLD.time)
  FROM public.playdate_rsvps r
  WHERE r.playdate_id = OLD.id
    AND r.user_id != OLD.creator_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_playdate_deleted
  BEFORE DELETE ON public.playdates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_playdate_deleted();
