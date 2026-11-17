
-- Drop ALL existing policies on events table to start fresh
DROP POLICY IF EXISTS "Users can view accessible events" ON public.events;
DROP POLICY IF EXISTS "Events accessible via invitation token" ON public.events;
DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Users can view public events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.events;
DROP POLICY IF EXISTS "Allow owners to delete their own events" ON public.events;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.user_can_access_event(uuid);

-- Create a clean, simple set of policies without recursion
CREATE POLICY "Users can view own events" ON public.events
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public events" ON public.events
FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view events via invitation" ON public.events
FOR SELECT USING (
  EXISTS (
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
