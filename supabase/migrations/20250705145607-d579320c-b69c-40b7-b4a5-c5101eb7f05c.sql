
-- Fix invitation_tracking table policies to prevent infinite recursion
ALTER TABLE public.invitation_tracking DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on invitation_tracking
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'invitation_tracking' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.invitation_tracking';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE public.invitation_tracking ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for invitation_tracking
CREATE POLICY "Public RSVP access by token" ON public.invitation_tracking
FOR SELECT USING (token IS NOT NULL);

CREATE POLICY "Public RSVP update by token" ON public.invitation_tracking
FOR UPDATE USING (token IS NOT NULL);

-- Create a security definer function to check event ownership
CREATE OR REPLACE FUNCTION public.user_owns_event_for_invitation(invitation_id uuid)
RETURNS boolean AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create policy for event owners to manage invitation tracking
CREATE POLICY "Users can manage invitation tracking for own events" ON public.invitation_tracking
FOR ALL USING (public.user_owns_event_for_invitation(id));
