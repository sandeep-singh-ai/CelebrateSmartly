
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  country TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vendor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create membership tiers table
CREATE TABLE public.membership_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10,2) NOT NULL,
  max_events INTEGER NOT NULL,
  max_rsvps INTEGER NOT NULL,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default membership tiers
INSERT INTO public.membership_tiers (name, price_monthly, max_events, max_rsvps, features) VALUES
('Free', 0.00, 1, 10, '{"basic_features": true}'),
('Silver', 4.99, 5, 50, '{"enhanced_customization": true, "priority_support": true}'),
('Gold', 15.99, 500, -1, '{"premium_themes": true, "advanced_analytics": true, "white_label": true}');

-- Create subscribers table for Stripe subscriptions
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'Free',
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Subscribers policies
CREATE POLICY "Users can view own subscription" ON public.subscribers
  FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can update own subscription" ON public.subscribers
  FOR UPDATE USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Users can insert subscription" ON public.subscribers
  FOR INSERT WITH CHECK (TRUE);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  budget_range TEXT,
  expected_guests INTEGER,
  is_public BOOLEAN DEFAULT FALSE,
  custom_slug TEXT UNIQUE,
  theme TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view own events" ON public.events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public events" ON public.events
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE USING (user_id = auth.uid());

-- Create guest lists table
CREATE TABLE public.guest_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on guest lists
ALTER TABLE public.guest_lists ENABLE ROW LEVEL SECURITY;

-- Guest lists policies
CREATE POLICY "Users can manage guest lists for own events" ON public.guest_lists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = guest_lists.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Create event RSVPs table
CREATE TABLE public.event_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  response TEXT NOT NULL CHECK (response IN ('attending', 'not_attending', 'maybe')),
  guest_message TEXT,
  dietary_restrictions TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  qr_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on event RSVPs
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- RSVP policies
CREATE POLICY "Users can view RSVPs for own events" ON public.event_rsvps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_rsvps.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create RSVP" ON public.event_rsvps
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update RSVPs for own events" ON public.event_rsvps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_rsvps.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Create states table for geographic organization
CREATE TABLE public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create counties table
CREATE TABLE public.counties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_id UUID NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vendors table for local businesses
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  county_id UUID REFERENCES public.counties(id),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Vendors policies
CREATE POLICY "Anyone can view vendors" ON public.vendors
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage own vendor profile" ON public.vendors
  FOR ALL USING (user_id = auth.uid());

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  
  -- Insert subscriber record with Free tier
  INSERT INTO public.subscribers (user_id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'Free');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample states and counties
INSERT INTO public.states (name, abbreviation) VALUES
('California', 'CA'),
('New York', 'NY'),
('Texas', 'TX'),
('Florida', 'FL');

INSERT INTO public.counties (state_id, name)
SELECT s.id, county
FROM public.states s
CROSS JOIN UNNEST(ARRAY[
  'Los Angeles County',
  'Orange County',
  'San Diego County'
]) AS county
WHERE s.abbreviation = 'CA';
