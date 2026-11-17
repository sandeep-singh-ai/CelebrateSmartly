
-- Enable RLS on event_categories table and add policy to allow public read access
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read event categories (they should be publicly accessible)
CREATE POLICY "Anyone can view event categories" 
  ON public.event_categories 
  FOR SELECT 
  USING (true);
