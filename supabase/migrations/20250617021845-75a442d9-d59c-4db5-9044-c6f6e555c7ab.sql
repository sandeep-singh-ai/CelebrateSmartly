
-- Create RSVP tokens table for secure guest responses
CREATE TABLE public.rsvp_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_list_id UUID NOT NULL REFERENCES public.guest_lists(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.guest_lists(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RSVP responses table
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_list_id UUID NOT NULL REFERENCES public.guest_lists(id) ON DELETE CASCADE,
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  response TEXT NOT NULL CHECK (response IN ('attending', 'not_attending', 'maybe')),
  message TEXT,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  token_id UUID REFERENCES public.rsvp_tokens(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add title and description to guest_lists table
ALTER TABLE public.guest_lists 
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN invitation_sent_at TIMESTAMPTZ,
ADD COLUMN reminder_sent_at TIMESTAMPTZ;

-- Enable RLS on new tables
ALTER TABLE public.rsvp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for rsvp_tokens
CREATE POLICY "Users can manage tokens for own guest lists" ON public.rsvp_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.guest_lists gl
      JOIN public.events e ON gl.event_id = e.id
      WHERE gl.id = rsvp_tokens.guest_list_id 
      AND e.user_id = auth.uid()
    )
  );

-- RLS policies for rsvp_responses  
CREATE POLICY "Users can view responses for own guest lists" ON public.rsvp_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.guest_lists gl
      JOIN public.events e ON gl.event_id = e.id
      WHERE gl.id = rsvp_responses.guest_list_id 
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert RSVP responses" ON public.rsvp_responses
  FOR INSERT WITH CHECK (TRUE);

-- Create function to generate RSVP tokens
CREATE OR REPLACE FUNCTION generate_rsvp_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Create function to send RSVP invitations (placeholder for edge function)
CREATE OR REPLACE FUNCTION public.send_rsvp_invitations(guest_list_id_param UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- This will be handled by an edge function
  -- For now, just return success
  result := '{"success": true, "message": "Invitations queued for sending"}'::JSON;
  
  -- Update invitation sent timestamp
  UPDATE public.guest_lists 
  SET invitation_sent_at = NOW()
  WHERE id = guest_list_id_param;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
