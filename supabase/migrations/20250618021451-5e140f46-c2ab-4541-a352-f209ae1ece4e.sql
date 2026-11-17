
-- Add any missing columns or constraints to support the sub-event workflow
-- Update sub_events table to ensure it has all needed fields
ALTER TABLE public.sub_events 
ADD COLUMN IF NOT EXISTS event_time time without time zone;

-- Ensure rsvp_guests table has proper foreign key relationships
-- (This should already exist based on the schema but let's ensure it's properly set up)

-- Create indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_sub_events_rsvp_event_id ON public.sub_events(rsvp_event_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_guests_rsvp_event_id ON public.rsvp_guests(rsvp_event_id);
CREATE INDEX IF NOT EXISTS idx_guest_invites_sub_event_id ON public.guest_invites(sub_event_id);
CREATE INDEX IF NOT EXISTS idx_guest_invites_status ON public.guest_invites(status);

-- Enable RLS on all tables and create appropriate policies
ALTER TABLE public.sub_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_invites ENABLE ROW LEVEL SECURITY;

-- Policies for sub_events (users can manage sub-events for their own rsvp_events)
CREATE POLICY "Users can view sub-events for their rsvp events" 
  ON public.sub_events FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sub-events for their rsvp events" 
  ON public.sub_events FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sub-events for their rsvp events" 
  ON public.sub_events FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sub-events for their rsvp events" 
  ON public.sub_events FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

-- Policies for rsvp_guests (users can manage guests for their rsvp_events)
CREATE POLICY "Users can view guests for their rsvp events" 
  ON public.rsvp_guests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = rsvp_guests.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create guests for their rsvp events" 
  ON public.rsvp_guests FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = rsvp_guests.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update guests for their rsvp events" 
  ON public.rsvp_guests FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = rsvp_guests.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete guests for their rsvp events" 
  ON public.rsvp_guests FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = rsvp_guests.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )
  );

-- Policies for guest_invites
CREATE POLICY "Users can view invites for their events" 
  ON public.guest_invites FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_guests rg
      JOIN public.rsvp_events re ON re.id = rg.rsvp_event_id
      WHERE rg.id = guest_invites.guest_id 
      AND re.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create invites for their events" 
  ON public.guest_invites FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rsvp_guests rg
      JOIN public.rsvp_events re ON re.id = rg.rsvp_event_id
      WHERE rg.id = guest_invites.guest_id 
      AND re.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invites for their events" 
  ON public.guest_invites FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_guests rg
      JOIN public.rsvp_events re ON re.id = rg.rsvp_event_id
      WHERE rg.id = guest_invites.guest_id 
      AND re.owner_id = auth.uid()
    )
  );

-- Allow guests to view and update their own invites via token
CREATE POLICY "Guests can view their own invites via token" 
  ON public.guest_invites FOR SELECT 
  USING (true); -- This will be restricted by the token in the application logic

CREATE POLICY "Guests can update their own invites via token" 
  ON public.guest_invites FOR UPDATE 
  USING (true); -- This will be restricted by the token in the application logic

-- Create a function to automatically create guest invites when a sub-event is created
CREATE OR REPLACE FUNCTION create_guest_invites_for_sub_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Create invites for all guests of the rsvp_event when a new sub_event is created
  INSERT INTO public.guest_invites (guest_id, sub_event_id, token)
  SELECT 
    rg.id,
    NEW.id,
    encode(gen_random_bytes(32), 'base64url')
  FROM public.rsvp_guests rg
  WHERE rg.rsvp_event_id = NEW.rsvp_event_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create guest invites
DROP TRIGGER IF EXISTS trigger_create_guest_invites ON public.sub_events;
CREATE TRIGGER trigger_create_guest_invites
  AFTER INSERT ON public.sub_events
  FOR EACH ROW
  EXECUTE FUNCTION create_guest_invites_for_sub_event();
