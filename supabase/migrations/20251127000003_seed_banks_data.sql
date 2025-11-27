-- Seed data for banks table
INSERT INTO public.banks (name, interest_rate) VALUES
    ('Bank A', 2.50),
    ('Bank B', 2.70),
    ('Bank C', 3.00)
ON CONFLICT (name) DO NOTHING;