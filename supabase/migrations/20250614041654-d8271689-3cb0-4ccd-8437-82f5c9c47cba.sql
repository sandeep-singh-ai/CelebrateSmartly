
-- Add search radius and search query to vendor_searches table if not exists
ALTER TABLE public.vendor_searches 
ADD COLUMN IF NOT EXISTS search_radius INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS search_query TEXT;

-- Update vendors table to include Google data and images
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS google_data JSONB,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS last_google_update TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create indexes for better performance
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
CREATE TABLE IF NOT EXISTS public.event_themes (
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

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view themes for own events" ON public.event_themes;
DROP POLICY IF EXISTS "Users can create themes for own events" ON public.event_themes;

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

-- Create storage bucket for vendor images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('vendor-images', 'vendor-images', true, 52428800, '{"image/*"}')
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view vendor images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload vendor images" ON storage.objects;

-- Create storage policies for vendor images
CREATE POLICY "Anyone can view vendor images" ON storage.objects
  FOR SELECT USING (bucket_id = 'vendor-images');

CREATE POLICY "Authenticated users can upload vendor images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vendor-images' AND auth.role() = 'authenticated');
