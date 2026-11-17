-- Add guest list linking to events
ALTER TABLE public.guest_lists 
ADD COLUMN IF NOT EXISTS linked_event_id uuid REFERENCES public.events(id),
ADD COLUMN IF NOT EXISTS linked_rsvp_event_id uuid REFERENCES public.rsvp_events(id),
ADD COLUMN IF NOT EXISTS linked_sub_event_id uuid REFERENCES public.sub_events(id);

-- Create table to track individual invitation sends and responses
CREATE TABLE IF NOT EXISTS public.invitation_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_list_id uuid NOT NULL REFERENCES public.guest_lists(id) ON DELETE CASCADE,
  guest_email text NOT NULL,
  guest_name text NOT NULL,
  event_id uuid REFERENCES public.events(id),
  rsvp_event_id uuid REFERENCES public.rsvp_events(id),
  sub_event_id uuid REFERENCES public.sub_events(id),
  invitation_sent_at timestamp with time zone,
  response_status text NOT NULL DEFAULT 'no_response',
  response_received_at timestamp with time zone,
  guest_message text,
  token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on invitation_tracking
ALTER TABLE public.invitation_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for invitation_tracking (users can only see their own event invitations)
CREATE POLICY "Users can view their own invitation tracking" 
  ON public.invitation_tracking 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.events e WHERE e.id = invitation_tracking.event_id AND e.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.rsvp_events re WHERE re.id = invitation_tracking.rsvp_event_id AND re.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.sub_events se 
      JOIN public.events e ON se.event_id = e.id 
      WHERE se.id = invitation_tracking.sub_event_id AND e.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.sub_events se 
      JOIN public.rsvp_events re ON se.rsvp_event_id = re.id 
      WHERE se.id = invitation_tracking.sub_event_id AND re.owner_id = auth.uid()
    )
  );

-- Create policy for public RSVP access by token (allows unauthenticated users to access their invitation)
CREATE POLICY "Public RSVP access by token" 
  ON public.invitation_tracking 
  FOR SELECT 
  USING (token IS NOT NULL);

-- Create policy for public RSVP updates by token (allows unauthenticated users to update their response)
CREATE POLICY "Public RSVP update by token" 
  ON public.invitation_tracking 
  FOR UPDATE 
  USING (token IS NOT NULL);

-- Create policy for events access via invitation token (allows unauthenticated users to view event details for RSVP)
CREATE POLICY "Events accessible via invitation token" 
  ON public.events 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.invitation_tracking 
      WHERE event_id = events.id 
      AND token IS NOT NULL
    )
  );

-- Function to create invitation tracking records when sending invitations
CREATE OR REPLACE FUNCTION public.create_invitation_tracking_records(
  p_guest_list_id uuid,
  p_event_id uuid DEFAULT NULL,
  p_rsvp_event_id uuid DEFAULT NULL,
  p_sub_event_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  guest_record RECORD;
  invitation_count INTEGER := 0;
BEGIN
  -- Create tracking records for each guest in the guest list
  FOR guest_record IN 
    SELECT name, email FROM public.guest_lists 
    WHERE event_id IN (
      SELECT event_id FROM public.guest_lists WHERE id = p_guest_list_id
    )
    AND name IS NOT NULL 
    AND email IS NOT NULL
  LOOP
    INSERT INTO public.invitation_tracking (
      guest_list_id,
      guest_email,
      guest_name,
      event_id,
      rsvp_event_id,
      sub_event_id,
      invitation_sent_at
    ) VALUES (
      p_guest_list_id,
      guest_record.email,
      guest_record.name,
      p_event_id,
      p_rsvp_event_id,
      p_sub_event_id,
      NOW()
    )
    ON CONFLICT (token) DO NOTHING;
    
    invitation_count := invitation_count + 1;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'invitation_count', invitation_count,
    'message', 'Invitation tracking records created'
  );
END;
$$;
