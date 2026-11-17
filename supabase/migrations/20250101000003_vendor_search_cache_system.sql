-- Vendor Search Cache System
-- This migration adds tables for caching vendor search results from Google Places API
-- and implements a 30-day refresh system for vendor data

-- Create vendor search cache table to store Google Places API results
CREATE TABLE IF NOT EXISTS public.vendor_search_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  category_id UUID REFERENCES public.event_categories(id),
  search_radius INTEGER NOT NULL,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  vendor_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_refresh_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Composite unique constraint for location + category + radius
  UNIQUE(location, category_id, search_radius)
);

-- Create vendor search results table to store individual vendor data from Google
CREATE TABLE IF NOT EXISTS public.vendor_search_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_id UUID NOT NULL REFERENCES public.vendor_search_cache(id) ON DELETE CASCADE,
  google_place_id TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  business_type TEXT,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  rating DECIMAL(3, 2),
  review_count INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  google_data JSONB,
  images JSONB DEFAULT '[]',
  is_premium BOOLEAN DEFAULT FALSE,
  slug TEXT,
  last_google_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vendor search history table to track user searches
CREATE TABLE IF NOT EXISTS public.vendor_search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_id UUID NOT NULL REFERENCES public.vendor_search_cache(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  results_count INTEGER NOT NULL,
  search_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS vendor_search_cache_location_idx ON public.vendor_search_cache(location);
CREATE INDEX IF NOT EXISTS vendor_search_cache_category_idx ON public.vendor_search_cache(category_id);
CREATE INDEX IF NOT EXISTS vendor_search_cache_postal_code_idx ON public.vendor_search_cache(postal_code);
CREATE INDEX IF NOT EXISTS vendor_search_cache_next_refresh_idx ON public.vendor_search_cache(next_refresh_date);
CREATE INDEX IF NOT EXISTS vendor_search_cache_location_category_idx ON public.vendor_search_cache(location, category_id);

CREATE INDEX IF NOT EXISTS vendor_search_results_google_place_id_idx ON public.vendor_search_results(google_place_id);
CREATE INDEX IF NOT EXISTS vendor_search_results_cache_id_idx ON public.vendor_search_results(cache_id);
CREATE INDEX IF NOT EXISTS vendor_search_results_location_idx ON public.vendor_search_results(latitude, longitude);
CREATE INDEX IF NOT EXISTS vendor_search_results_business_type_idx ON public.vendor_search_results(business_type);

CREATE INDEX IF NOT EXISTS vendor_search_history_user_id_idx ON public.vendor_search_history(user_id);
CREATE INDEX IF NOT EXISTS vendor_search_history_cache_id_idx ON public.vendor_search_history(cache_id);
CREATE INDEX IF NOT EXISTS vendor_search_history_search_date_idx ON public.vendor_search_history(search_date);

-- Enable RLS on all tables
ALTER TABLE public.vendor_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vendor_search_cache
CREATE POLICY "Anyone can view vendor search cache" ON public.vendor_search_cache
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create vendor search cache" ON public.vendor_search_cache
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "System can update vendor search cache" ON public.vendor_search_cache
  FOR UPDATE USING (TRUE);

-- RLS Policies for vendor_search_results
CREATE POLICY "Anyone can view vendor search results" ON public.vendor_search_results
  FOR SELECT USING (TRUE);

CREATE POLICY "System can manage vendor search results" ON public.vendor_search_results
  FOR ALL USING (TRUE);

-- RLS Policies for vendor_search_history
CREATE POLICY "Users can view own search history" ON public.vendor_search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create search history" ON public.vendor_search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to extract postal code from address
CREATE OR REPLACE FUNCTION extract_postal_code(address_text TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Extract US postal code pattern (5 digits or 5+4 format)
  RETURN regexp_replace(address_text, '.*(\d{5}(?:-\d{4})?).*', '\1');
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if cache needs refresh
CREATE OR REPLACE FUNCTION should_refresh_vendor_cache(
  p_location TEXT,
  p_category_id UUID,
  p_search_radius INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  cache_record RECORD;
BEGIN
  SELECT * INTO cache_record
  FROM public.vendor_search_cache
  WHERE location = p_location 
    AND category_id = p_category_id 
    AND search_radius = p_search_radius;
  
  -- Return true if no cache exists or if it's time to refresh
  RETURN cache_record IS NULL OR cache_record.next_refresh_date <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cached vendor results
CREATE OR REPLACE FUNCTION get_cached_vendor_results(
  p_location TEXT,
  p_category_id UUID,
  p_search_radius INTEGER
)
RETURNS TABLE(
  id UUID,
  business_name TEXT,
  business_type TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  rating DECIMAL,
  review_count INTEGER,
  latitude DECIMAL,
  longitude DECIMAL,
  images JSONB,
  is_premium BOOLEAN,
  slug TEXT,
  google_place_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vsr.id,
    vsr.business_name,
    vsr.business_type,
    vsr.description,
    vsr.address,
    vsr.phone,
    vsr.email,
    vsr.website,
    vsr.rating,
    vsr.review_count,
    vsr.latitude,
    vsr.longitude,
    vsr.images,
    vsr.is_premium,
    vsr.slug,
    vsr.google_place_id
  FROM public.vendor_search_results vsr
  JOIN public.vendor_search_cache vsc ON vsr.cache_id = vsc.id
  WHERE vsc.location = p_location
    AND vsc.category_id = p_category_id
    AND vsc.search_radius = p_search_radius
  ORDER BY vsr.rating DESC NULLS LAST, vsr.review_count DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update cache refresh date
CREATE OR REPLACE FUNCTION update_cache_refresh_date(
  p_location TEXT,
  p_category_id UUID,
  p_search_radius INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.vendor_search_cache
  SET next_refresh_date = NOW() + INTERVAL '30 days',
      last_updated = NOW()
  WHERE location = p_location 
    AND category_id = p_category_id 
    AND search_radius = p_search_radius;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample event categories if they don't exist
INSERT INTO public.event_categories (name, description) VALUES
('Catering', 'Food and beverage services for events'),
('Photography', 'Event photography and videography services'),
('Venues', 'Event spaces and locations'),
('Entertainment', 'Live music, DJs, and performers'),
('Decorations', 'Event styling and decoration services'),
('Transportation', 'Guest transportation and shuttle services'),
('Planning', 'Event planning and coordination services')
ON CONFLICT (name) DO NOTHING;
