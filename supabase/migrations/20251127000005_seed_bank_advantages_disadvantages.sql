-- Seed advantages and disadvantages for existing banks
UPDATE public.banks 
SET 
  advantages = ARRAY[
    'Competitive interest rates for qualified borrowers',
    'Flexible repayment terms up to 9 years',
    'Quick loan approval process',
    'Online application available',
    'No hidden fees or charges'
  ],
  disadvantages = ARRAY[
    'Strict eligibility criteria',
    'Higher interest rates for borrowers with lower credit scores',
    'Processing fees may apply'
  ]
WHERE name = 'Bank A';

UPDATE public.banks 
SET 
  advantages = ARRAY[
    'Wide branch network across the country',
    'Special financing programs for first-time car buyers',
    'Competitive rates for luxury vehicle financing',
    'Digital banking with mobile app',
    'Customer loyalty rewards program'
  ],
  disadvantages = ARRAY[
    'Longer processing time for loan approval',
    'Early repayment penalties may apply',
    'Requires comprehensive documentation'
  ]
WHERE name = 'Bank B';

UPDATE public.banks 
SET 
  advantages = ARRAY[
    'Special promotions for hybrid and electric vehicles',
    'Financing options for commercial vehicles',
    'Personalized loan packages',
    '24/7 customer service hotline',
    'Transparent fee structure'
  ],
  disadvantages = ARRAY[
    'Limited branch locations',
    'Higher down payment requirements',
    'Restrictions on vehicle age for financing'
  ]
WHERE name = 'Bank C';