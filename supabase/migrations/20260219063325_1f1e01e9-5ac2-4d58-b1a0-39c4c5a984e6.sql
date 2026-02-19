-- Add verification columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified';
-- verification_status values: 'unverified' | 'pending' | 'verified' | 'failed'
