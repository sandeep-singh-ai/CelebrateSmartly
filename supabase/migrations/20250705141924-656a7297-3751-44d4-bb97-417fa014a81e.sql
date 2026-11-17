
-- First, disable RLS temporarily to clear everything
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (including any we might have missed)
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'events' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.events';
    END LOOP;
END $$;

-- Drop any functions that might cause recursion
DROP FUNCTION IF EXISTS public.user_can_access_event(uuid);

-- Re-enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "events_select_own" ON public.events
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "events_select_public" ON public.events  
FOR SELECT USING (is_public = true);

CREATE POLICY "events_insert_own" ON public.events
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "events_update_own" ON public.events
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "events_delete_own" ON public.events
FOR DELETE USING (user_id = auth.uid());
