-- Fix invitation_tracking RLS policies for INSERT operations
-- The current policy tries to look up invitation by ID which doesn't exist during INSERT

-- Drop the problematic policy that uses the function
DROP POLICY IF EXISTS "Users can manage invitation tracking for own events" ON public.invitation_tracking;

-- Create separate policies for different operations
-- For INSERT: Check ownership based on the foreign key relationships directly
CREATE POLICY "Users can create invitation tracking for own events" ON public.invitation_tracking
FOR INSERT 
WITH CHECK (
  -- Check if user owns the event (for regular events)
  (event_id IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.events e 
    WHERE e.id = event_id AND e.user_id = auth.uid()
  ))
  OR
  -- Check if user owns the RSVP event
  (rsvp_event_id IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.rsvp_events re 
    WHERE re.id = rsvp_event_id AND re.owner_id = auth.uid()
  ))
  OR
  -- Check if user owns the event through sub_event_id (regular events)
  (sub_event_id IS NOT NULL AND event_id IS NULL AND rsvp_event_id IS NULL AND EXISTS(
    SELECT 1 FROM public.sub_events se
    INNER JOIN public.events e ON se.event_id = e.id
    WHERE se.id = sub_event_id AND e.user_id = auth.uid()
  ))
  OR
  -- Check if user owns the RSVP event through sub_event_id
  (sub_event_id IS NOT NULL AND rsvp_event_id IS NOT NULL AND EXISTS(
    SELECT 1 FROM public.sub_events se
    INNER JOIN public.rsvp_events re ON se.rsvp_event_id = re.id
    WHERE se.id = sub_event_id AND re.owner_id = auth.uid()
  ))
);

-- For SELECT, UPDATE, DELETE: Use the existing function which works for existing records
CREATE POLICY "Users can manage existing invitation tracking for own events" ON public.invitation_tracking
FOR SELECT USING (public.user_owns_event_for_invitation(id));

CREATE POLICY "Users can update invitation tracking for own events" ON public.invitation_tracking
FOR UPDATE USING (public.user_owns_event_for_invitation(id));

CREATE POLICY "Users can delete invitation tracking for own events" ON public.invitation_tracking
FOR DELETE USING (public.user_owns_event_for_invitation(id));