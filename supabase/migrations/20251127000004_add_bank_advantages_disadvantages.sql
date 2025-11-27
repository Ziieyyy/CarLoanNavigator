-- Add advantages and disadvantages columns to banks table
ALTER TABLE public.banks 
ADD COLUMN IF NOT EXISTS advantages TEXT[],
ADD COLUMN IF NOT EXISTS disadvantages TEXT[];