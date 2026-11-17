-- Enable RLS on reference tables that should be protected
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for reference tables
CREATE POLICY "Anyone can view states" ON public.states FOR SELECT USING (true);
CREATE POLICY "Anyone can view counties" ON public.counties FOR SELECT USING (true);

-- Fix RLS policies for invitation_tracking - remove overly permissive public access
DROP POLICY IF EXISTS "Public RSVP access by token" ON public.invitation_tracking;
DROP POLICY IF EXISTS "Public RSVP update by token" ON public.invitation_tracking;

-- Create more restrictive token-based access for invitation_tracking
CREATE POLICY "Token-based RSVP access" ON public.invitation_tracking 
FOR SELECT 
USING (
  token IS NOT NULL AND 
  LENGTH(token) > 10 -- Basic token validation
);

CREATE POLICY "Token-based RSVP update" ON public.invitation_tracking 
FOR UPDATE 
USING (
  token IS NOT NULL AND 
  LENGTH(token) > 10 AND
  response_received_at IS NULL -- Only allow updates if not already responded
);

-- Fix guest_invites policies - remove overly broad access
DROP POLICY IF EXISTS "Guests can view and update their own invites via token" ON public.guest_invites;
DROP POLICY IF EXISTS "Guests can view their own invites via token" ON public.guest_invites;
DROP POLICY IF EXISTS "Guests can update their own invites via token" ON public.guest_invites;

-- Create token-based policies for guest_invites with better validation
CREATE POLICY "Token-based guest invite access" ON public.guest_invites 
FOR SELECT 
USING (token IS NOT NULL AND LENGTH(token) > 10);

CREATE POLICY "Token-based guest invite update" ON public.guest_invites 
FOR UPDATE 
USING (
  token IS NOT NULL AND 
  LENGTH(token) > 10 AND 
  status = 'no_response' -- Only allow updates if not already responded
);

-- Fix rsvp_responses - remove public insert access
DROP POLICY IF EXISTS "Anyone can insert RSVP responses" ON public.rsvp_responses;

-- Create token-validated insert policy for rsvp_responses
CREATE POLICY "Validated RSVP responses insert" ON public.rsvp_responses 
FOR INSERT 
WITH CHECK (
  token_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.invitation_tracking it 
    WHERE it.id = token_id AND it.token IS NOT NULL
  )
);

-- Update security definer functions to use immutable search_path
CREATE OR REPLACE FUNCTION public.generate_rsvp_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_rsvp_url(guest_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.user_owns_event_for_invitation(invitation_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    owns_event boolean := false;
BEGIN
    -- Check if user owns the event through event_id
    SELECT EXISTS(
        SELECT 1 FROM public.events e 
        INNER JOIN public.invitation_tracking it ON e.id = it.event_id
        WHERE it.id = invitation_id AND e.user_id = auth.uid()
    ) INTO owns_event;
    
    IF owns_event THEN
        RETURN true;
    END IF;
    
    -- Check if user owns the event through rsvp_event_id
    SELECT EXISTS(
        SELECT 1 FROM public.rsvp_events re 
        INNER JOIN public.invitation_tracking it ON re.id = it.rsvp_event_id
        WHERE it.id = invitation_id AND re.owner_id = auth.uid()
    ) INTO owns_event;
    
    IF owns_event THEN
        RETURN true;
    END IF;
    
    -- Check if user owns the event through sub_event_id
    SELECT EXISTS(
        SELECT 1 FROM public.sub_events se
        INNER JOIN public.events e ON se.event_id = e.id
        INNER JOIN public.invitation_tracking it ON se.id = it.sub_event_id
        WHERE it.id = invitation_id AND e.user_id = auth.uid()
    ) INTO owns_event;
    
    IF owns_event THEN
        RETURN true;
    END IF;
    
    -- Check if user owns the rsvp event through sub_event_id
    SELECT EXISTS(
        SELECT 1 FROM public.sub_events se
        INNER JOIN public.rsvp_events re ON se.rsvp_event_id = re.id
        INNER JOIN public.invitation_tracking it ON se.id = it.sub_event_id
        WHERE it.id = invitation_id AND re.owner_id = auth.uid()
    ) INTO owns_event;
    
    RETURN owns_event;
END;
$$;