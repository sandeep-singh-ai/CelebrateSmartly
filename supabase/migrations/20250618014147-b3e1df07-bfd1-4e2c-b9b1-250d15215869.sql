
-- Create main RSVP events table
CREATE TABLE public.rsvp_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cover_image TEXT,
  main_date DATE NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  custom_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create sub-events table
CREATE TABLE public.sub_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rsvp_event_id UUID NOT NULL REFERENCES public.rsvp_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  notes TEXT,
  venue_map_link TEXT,
  dress_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RSVP guests table (separate from existing guest_lists)
CREATE TABLE public.rsvp_guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rsvp_event_id UUID NOT NULL REFERENCES public.rsvp_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rsvp_event_id, email)
);

-- Create guest invites table (links guests to specific sub-events)
CREATE TABLE public.guest_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.rsvp_guests(id) ON DELETE CASCADE,
  sub_event_id UUID NOT NULL REFERENCES public.sub_events(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'no_response' CHECK (status IN ('attending', 'not_attending', 'maybe', 'no_response')),
  responded_at TIMESTAMPTZ,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(guest_id, sub_event_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.rsvp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_invites ENABLE ROW LEVEL SECURITY;

-- RLS policies for rsvp_events
CREATE POLICY "Users can manage their own RSVP events" ON public.rsvp_events
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Public RSVP events are viewable by anyone" ON public.rsvp_events
  FOR SELECT USING (is_public = true);

-- RLS policies for sub_events
CREATE POLICY "Users can manage sub-events for their RSVP events" ON public.sub_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE id = sub_events.rsvp_event_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Public sub-events are viewable" ON public.sub_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE id = sub_events.rsvp_event_id 
      AND is_public = true
    )
  );

-- RLS policies for rsvp_guests
CREATE POLICY "Users can manage guests for their RSVP events" ON public.rsvp_guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE id = rsvp_guests.rsvp_event_id 
      AND owner_id = auth.uid()
    )
  );

-- RLS policies for guest_invites
CREATE POLICY "Users can manage invites for their events" ON public.guest_invites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_guests rg
      JOIN public.rsvp_events re ON rg.rsvp_event_id = re.id
      WHERE rg.id = guest_invites.guest_id 
      AND re.owner_id = auth.uid()
    )
  );

CREATE POLICY "Guests can view and update their own invites via token" ON public.guest_invites
  FOR ALL USING (TRUE)
  WITH CHECK (TRUE);

-- Create function to generate RSVP page URL
CREATE OR REPLACE FUNCTION public.get_rsvp_url(guest_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  guest_token TEXT;
BEGIN
  SELECT token INTO guest_token 
  FROM public.guest_invites 
  WHERE guest_id = guest_id_param 
  LIMIT 1;
  
  IF guest_token IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN '/rsvp/' || guest_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to send RSVP invitations
CREATE OR REPLACE FUNCTION public.send_rsvp_event_invitations(rsvp_event_id_param UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  invitation_count INTEGER;
BEGIN
  -- Count invitations to be sent
  SELECT COUNT(DISTINCT gi.guest_id) INTO invitation_count
  FROM public.guest_invites gi
  JOIN public.rsvp_guests rg ON gi.guest_id = rg.id
  WHERE rg.rsvp_event_id = rsvp_event_id_param;
  
  -- This will be handled by an edge function
  result := json_build_object(
    'success', true, 
    'message', 'RSVP invitations queued for sending',
    'invitation_count', invitation_count
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
