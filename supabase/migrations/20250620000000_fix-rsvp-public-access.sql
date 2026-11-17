-- Fix RSVP public access policies
-- This migration adds policies to allow unauthenticated users to access RSVP functionality

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public RSVP access by token" ON public.invitation_tracking;
DROP POLICY IF EXISTS "Public RSVP update by token" ON public.invitation_tracking;
DROP POLICY IF EXISTS "Users can view their own invitation tracking" ON public.invitation_tracking;
DROP POLICY IF EXISTS "Events accessible via invitation token" ON public.events;
DROP POLICY IF EXISTS "RSVP events accessible via invitation token" ON public.rsvp_events;
DROP POLICY IF EXISTS "Sub-events accessible via invitation token" ON public.sub_events;
DROP POLICY IF EXISTS "RSVP guests accessible via invitation token" ON public.rsvp_guests;

-- Create policy for users to manage their own invitation tracking (for viewing and updating)
CREATE POLICY "Users can manage their own invitation tracking" 
  ON public.invitation_tracking 
  FOR SELECT 
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
    ) OR
    EXISTS (
      SELECT 1 FROM public.guest_lists gl
      JOIN public.events e ON gl.event_id = e.id
      WHERE gl.id = invitation_tracking.guest_list_id AND e.user_id = auth.uid()
    )
  );

-- Create policy for users to insert invitation tracking records (when sending invitations)
CREATE POLICY "Users can insert invitation tracking" 
  ON public.invitation_tracking 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guest_lists gl
      JOIN public.events e ON gl.event_id = e.id
      WHERE gl.id = invitation_tracking.guest_list_id AND e.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.guest_lists gl
      JOIN public.rsvp_events re ON gl.linked_rsvp_event_id = re.id
      WHERE gl.id = invitation_tracking.guest_list_id AND re.owner_id = auth.uid()
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

-- Create policy for RSVP events access via invitation token (allows unauthenticated users to view RSVP event details)
CREATE POLICY "RSVP events accessible via invitation token" 
  ON public.rsvp_events 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.invitation_tracking 
      WHERE rsvp_event_id = rsvp_events.id 
      AND token IS NOT NULL
    )
  );

-- Create policy for sub-events access via invitation token (allows unauthenticated users to view sub-event details)
CREATE POLICY "Sub-events accessible via invitation token" 
  ON public.sub_events 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.invitation_tracking 
      WHERE sub_event_id = sub_events.id 
      AND token IS NOT NULL
    )
  );

-- Create policy for RSVP guests access via invitation token (allows unauthenticated users to view guest details)
CREATE POLICY "RSVP guests accessible via invitation token" 
  ON public.rsvp_guests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.guest_invites 
      WHERE guest_id = rsvp_guests.id 
      AND token IS NOT NULL
    )
  ); 