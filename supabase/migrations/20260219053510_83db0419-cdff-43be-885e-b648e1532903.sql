-- Enable realtime for profiles table so new nearby moms trigger the badge
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;