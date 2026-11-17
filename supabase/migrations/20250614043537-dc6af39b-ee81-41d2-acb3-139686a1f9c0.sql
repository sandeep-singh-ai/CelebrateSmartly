
-- First, let's add some additional event categories for celebrations
INSERT INTO public.event_categories (name, description) VALUES
('Bar Mitzvah', 'Bar Mitzvah celebrations'),
('Bat Mitzvah', 'Bat Mitzvah celebrations'),
('Communion', 'First Communion celebrations'),
('Confirmation', 'Confirmation celebrations'),
('Gender Reveal', 'Gender reveal parties'),
('Christening', 'Christening ceremonies'),
('Memorial Service', 'Memorial and remembrance services'),
('Going Away Party', 'Farewell and going away parties'),
('Promotion Party', 'Job promotion celebrations'),
('New Year Party', 'New Year celebrations'),
('Halloween Party', 'Halloween celebrations'),
('Thanksgiving', 'Thanksgiving gatherings'),
('Easter', 'Easter celebrations'),
('Christmas Party', 'Christmas celebrations'),
('Valentine''s Day', 'Valentine''s Day celebrations'),
('St. Patrick''s Day', 'St. Patrick''s Day celebrations'),
('Fourth of July', 'Independence Day celebrations'),
('Cinco de Mayo', 'Cinco de Mayo celebrations'),
('Mardi Gras', 'Mardi Gras celebrations'),
('Oktoberfest', 'Oktoberfest celebrations')
ON CONFLICT (name) DO NOTHING;

-- Update the vendors table to include a last_updated field for monthly refresh tracking
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ DEFAULT NOW();

-- Create an index on last_updated for efficient queries
CREATE INDEX IF NOT EXISTS vendors_last_updated_idx ON public.vendors (last_updated);

-- Create an index on google_place_id for efficient upserts
CREATE INDEX IF NOT EXISTS vendors_google_place_id_idx ON public.vendors (google_place_id) WHERE google_place_id IS NOT NULL;
