
-- Fix the infinite recursion in events table RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Events accessible via invitation token" ON public.events;
DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Users can view public events" ON public.events;

-- Create a security definer function to check user access to events
CREATE OR REPLACE FUNCTION public.user_can_access_event(event_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user owns the event or if event is public
  RETURN EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = event_id 
    AND (user_id = auth.uid() OR is_public = true)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies without recursion
CREATE POLICY "Users can view accessible events" ON public.events
FOR SELECT USING (
  user_id = auth.uid() 
  OR is_public = true 
  OR EXISTS (
    SELECT 1 FROM public.invitation_tracking 
    WHERE invitation_tracking.event_id = events.id 
    AND invitation_tracking.token IS NOT NULL
  )
);

CREATE POLICY "Users can create events" ON public.events
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own events" ON public.events
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own events" ON public.events
FOR DELETE USING (user_id = auth.uid());

-- Fix guest_lists policies to avoid similar issues
DROP POLICY IF EXISTS "Users can manage guest lists for own events" ON public.guest_lists;

CREATE POLICY "Users can view guest lists for own events" ON public.guest_lists
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = guest_lists.event_id 
    AND e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create guest lists for own events" ON public.guest_lists
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = guest_lists.event_id 
    AND e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update guest lists for own events" ON public.guest_lists
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = guest_lists.event_id 
    AND e.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete guest lists for own events" ON public.guest_lists
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = guest_lists.event_id 
    AND e.user_id = auth.uid()
  )
);
