
-- Create playdates table
CREATE TABLE public.playdates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  park TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create playdate_rsvps table (one row per user per playdate)
CREATE TABLE public.playdate_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playdate_id UUID NOT NULL REFERENCES public.playdates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playdate_id, user_id)
);

-- Enable RLS
ALTER TABLE public.playdates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playdate_rsvps ENABLE ROW LEVEL SECURITY;

-- Playdates policies
CREATE POLICY "Authenticated users can view all playdates"
  ON public.playdates FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create playdates"
  ON public.playdates FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their playdates"
  ON public.playdates FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their playdates"
  ON public.playdates FOR DELETE
  USING (auth.uid() = creator_id);

-- RSVP policies
CREATE POLICY "Authenticated users can view all rsvps"
  ON public.playdate_rsvps FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own rsvp"
  ON public.playdate_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rsvp"
  ON public.playdate_rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at on playdates
CREATE TRIGGER update_playdates_updated_at
  BEFORE UPDATE ON public.playdates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.playdates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.playdate_rsvps;
