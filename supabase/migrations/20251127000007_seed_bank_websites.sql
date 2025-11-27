-- Seed websites for existing banks
UPDATE public.banks 
SET website = 'https://www.bankA.com'
WHERE name = 'Bank A';

UPDATE public.banks 
SET website = 'https://www.bankB.com'
WHERE name = 'Bank B';

UPDATE public.banks 
SET website = 'https://www.bankC.com'
WHERE name = 'Bank C';