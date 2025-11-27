-- Add category and financing_text columns to cars table
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Car',
ADD COLUMN IF NOT EXISTS financing_text TEXT;