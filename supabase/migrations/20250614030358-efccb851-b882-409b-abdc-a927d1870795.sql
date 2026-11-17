
-- Create event categories table
CREATE TABLE public.event_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default event categories
INSERT INTO public.event_categories (name, description) VALUES
('Birthday Party', 'Birthday celebrations for all ages'),
('Wedding', 'Wedding ceremonies and receptions'),
('Graduation', 'Graduation parties and ceremonies'),
('Anniversary', 'Wedding anniversaries and milestone celebrations'),
('Baby Shower', 'Baby shower celebrations'),
('Corporate Event', 'Business meetings, conferences, and corporate parties'),
('Holiday Party', 'Christmas, New Year, and other holiday celebrations'),
('Retirement Party', 'Retirement celebrations'),
('Engagement Party', 'Engagement celebrations'),
('Housewarming', 'New home celebrations'),
('Bridal Shower', 'Pre-wedding bridal celebrations'),
('Quinceañera', 'Sweet 15 celebrations'),
('Sweet 16', 'Sweet 16 birthday celebrations'),
('Fundraiser', 'Charity and fundraising events'),
('Reunion', 'Family and class reunions');

-- Create vendor searches table to track user searches
CREATE TABLE public.vendor_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  location TEXT NOT NULL,
  category_id UUID REFERENCES public.event_categories(id),
  search_radius INTEGER DEFAULT 25,
  search_query TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on vendor searches
ALTER TABLE public.vendor_searches ENABLE ROW LEVEL SECURITY;

-- Vendor searches policies
CREATE POLICY "Users can view own searches" ON public.vendor_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create searches" ON public.vendor_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update vendors table to include Google data
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS google_data JSONB,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS last_google_update TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for vendor searches
CREATE INDEX IF NOT EXISTS vendors_location_idx ON public.vendors (address);
CREATE INDEX IF NOT EXISTS vendors_business_type_idx ON public.vendors (business_type);
CREATE INDEX IF NOT EXISTS vendors_premium_idx ON public.vendors (is_premium);

-- Update events table to include new fields
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.event_categories(id),
ADD COLUMN IF NOT EXISTS number_of_people INTEGER,
ADD COLUMN IF NOT EXISTS themes JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS selected_theme JSONB;

-- Create event themes table for AI-generated themes
CREATE TABLE public.event_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  theme_name TEXT NOT NULL,
  colors JSONB NOT NULL,
  party_suppliers JSONB NOT NULL,
  food_recommendations JSONB NOT NULL,
  additional_recommendations JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on event themes
ALTER TABLE public.event_themes ENABLE ROW LEVEL SECURITY;

-- Event themes policies
CREATE POLICY "Users can view themes for own events" ON public.event_themes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_themes.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create themes for own events" ON public.event_themes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_themes.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Create blog posts cache table for WordPress content
CREATE TABLE public.blog_posts_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wordpress_id INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT NOT NULL,
  featured_image_url TEXT,
  author_name TEXT,
  published_date TIMESTAMPTZ NOT NULL,
  categories JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  seo_title TEXT,
  seo_description TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for blog posts
CREATE INDEX IF NOT EXISTS blog_posts_published_date_idx ON public.blog_posts_cache (published_date DESC);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts_cache (slug);
