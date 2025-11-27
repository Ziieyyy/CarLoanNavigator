-- Add specification fields to cars table
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS model_name TEXT,
ADD COLUMN IF NOT EXISTS engine TEXT,
ADD COLUMN IF NOT EXISTS horsepower TEXT,
ADD COLUMN IF NOT EXISTS top_speed TEXT,
ADD COLUMN IF NOT EXISTS acceleration TEXT,
ADD COLUMN IF NOT EXISTS fuel_consumption TEXT,
ADD COLUMN IF NOT EXISTS safety_features TEXT,
ADD COLUMN IF NOT EXISTS disclaimer_text TEXT;