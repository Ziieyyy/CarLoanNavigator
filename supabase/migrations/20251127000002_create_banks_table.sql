-- Create banks table
CREATE TABLE IF NOT EXISTS public.banks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    interest_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.banks ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE public.banks TO authenticated;
GRANT ALL ON TABLE public.banks TO anon;

-- Create policies
CREATE POLICY "Banks are viewable by everyone" ON banks
    FOR SELECT USING (true);

CREATE POLICY "Banks are insertable by admins" ON banks
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    ));

CREATE POLICY "Banks are updatable by admins" ON banks
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    ));

CREATE POLICY "Banks are deletable by admins" ON banks
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    ));