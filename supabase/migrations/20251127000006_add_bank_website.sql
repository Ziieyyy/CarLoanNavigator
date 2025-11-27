-- Add website column to banks table
ALTER TABLE public.banks 
ADD COLUMN IF NOT EXISTS website TEXT;