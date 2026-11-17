
-- Add a new column to sub_events to reference regular events
ALTER TABLE public.sub_events 
ADD COLUMN event_id UUID REFERENCES public.events(id) ON DELETE CASCADE;

-- Make both rsvp_event_id and event_id nullable since only one should be used
ALTER TABLE public.sub_events 
ALTER COLUMN rsvp_event_id DROP NOT NULL;

-- Add a check constraint to ensure either rsvp_event_id or event_id is provided (but not both)
ALTER TABLE public.sub_events 
ADD CONSTRAINT sub_events_parent_check 
CHECK (
  (rsvp_event_id IS NOT NULL AND event_id IS NULL) OR 
  (rsvp_event_id IS NULL AND event_id IS NOT NULL)
);

-- Update RLS policies to work with both regular events and rsvp_events
DROP POLICY IF EXISTS "Users can view sub-events for their rsvp events" ON public.sub_events;
DROP POLICY IF EXISTS "Users can create sub-events for their rsvp events" ON public.sub_events;
DROP POLICY IF EXISTS "Users can update sub-events for their rsvp events" ON public.sub_events;
DROP POLICY IF EXISTS "Users can delete sub-events for their rsvp events" ON public.sub_events;

-- New policies that work with both event types
CREATE POLICY "Users can view sub-events for their events" 
  ON public.sub_events FOR SELECT 
  USING (
    (rsvp_event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )) OR
    (event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = sub_events.event_id 
      AND events.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create sub-events for their events" 
  ON public.sub_events FOR INSERT 
  WITH CHECK (
    (rsvp_event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )) OR
    (event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = sub_events.event_id 
      AND events.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can update sub-events for their events" 
  ON public.sub_events FOR UPDATE 
  USING (
    (rsvp_event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )) OR
    (event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = sub_events.event_id 
      AND events.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can delete sub-events for their events" 
  ON public.sub_events FOR DELETE 
  USING (
    (rsvp_event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.rsvp_events 
      WHERE rsvp_events.id = sub_events.rsvp_event_id 
      AND rsvp_events.owner_id = auth.uid()
    )) OR
    (event_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = sub_events.event_id 
      AND events.user_id = auth.uid()
    ))
  );
