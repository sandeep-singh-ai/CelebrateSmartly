-- Ensure invitation_tracking table has proper structure for QR code system
-- This migration adds missing columns and indexes if they don't exist

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add opened_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitation_tracking' AND column_name = 'opened_at') THEN
        ALTER TABLE public.invitation_tracking ADD COLUMN opened_at TIMESTAMPTZ;
    END IF;

    -- Add checked_in_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitation_tracking' AND column_name = 'checked_in_at') THEN
        ALTER TABLE public.invitation_tracking ADD COLUMN checked_in_at TIMESTAMPTZ;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitation_tracking' AND column_name = 'status') THEN
        ALTER TABLE public.invitation_tracking ADD COLUMN status TEXT DEFAULT 'sent';
    END IF;

    -- Add guest_id column if it doesn't exist (for linking to guests table)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitation_tracking' AND column_name = 'guest_id') THEN
        ALTER TABLE public.invitation_tracking ADD COLUMN guest_id UUID;
    END IF;

    -- Add event_id column if it doesn't exist (for linking to events table)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'invitation_tracking' AND column_name = 'event_id') THEN
        ALTER TABLE public.invitation_tracking ADD COLUMN event_id UUID;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invitation_tracking_token ON public.invitation_tracking(token);
CREATE INDEX IF NOT EXISTS idx_invitation_tracking_guest_id ON public.invitation_tracking(guest_id);
CREATE INDEX IF NOT EXISTS idx_invitation_tracking_event_id ON public.invitation_tracking(event_id);
CREATE INDEX IF NOT EXISTS idx_invitation_tracking_status ON public.invitation_tracking(status);

-- Add constraints if they don't exist
DO $$
BEGIN
    -- Add foreign key constraint for guest_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'invitation_tracking_guest_id_fkey') THEN
        ALTER TABLE public.invitation_tracking 
        ADD CONSTRAINT invitation_tracking_guest_id_fkey 
        FOREIGN KEY (guest_id) REFERENCES public.guests(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key constraint for event_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'invitation_tracking_event_id_fkey') THEN
        ALTER TABLE public.invitation_tracking 
        ADD CONSTRAINT invitation_tracking_event_id_fkey 
        FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update existing records to have proper status values
UPDATE public.invitation_tracking 
SET status = CASE 
    WHEN checked_in_at IS NOT NULL THEN 'checked_in'
    WHEN opened_at IS NOT NULL THEN 'opened'
    ELSE 'sent'
END
WHERE status IS NULL OR status = '';

-- Create a function to generate unique invitation tokens
CREATE OR REPLACE FUNCTION public.generate_unique_invitation_token()
RETURNS TEXT AS $$
DECLARE
    token TEXT;
    attempts INTEGER := 0;
    max_attempts INTEGER := 10;
BEGIN
    LOOP
        -- Generate a token with timestamp and random components
        token := 'inv_' || 
                 EXTRACT(EPOCH FROM NOW())::TEXT || '_' ||
                 encode(gen_random_bytes(8), 'base64url');
        
        -- Check if token already exists
        IF NOT EXISTS (SELECT 1 FROM public.invitation_tracking WHERE token = generate_unique_invitation_token.token) THEN
            RETURN token;
        END IF;
        
        attempts := attempts + 1;
        IF attempts >= max_attempts THEN
            RAISE EXCEPTION 'Unable to generate unique token after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.generate_unique_invitation_token() TO authenticated;

-- Create a trigger to automatically update status based on timestamps
CREATE OR REPLACE FUNCTION public.update_invitation_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status based on timestamps
    IF NEW.checked_in_at IS NOT NULL THEN
        NEW.status := 'checked_in';
    ELSIF NEW.opened_at IS NOT NULL THEN
        NEW.status := 'opened';
    ELSIF NEW.sent_at IS NOT NULL THEN
        NEW.status := 'sent';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_update_invitation_status ON public.invitation_tracking;
CREATE TRIGGER trigger_update_invitation_status
    BEFORE INSERT OR UPDATE ON public.invitation_tracking
    FOR EACH ROW
    EXECUTE FUNCTION public.update_invitation_status();

-- Add comments to the table and columns
COMMENT ON TABLE public.invitation_tracking IS 'Tracks invitation status and QR code tokens for guests';
COMMENT ON COLUMN public.invitation_tracking.token IS 'Unique invitation token used for QR codes and RSVP links';
COMMENT ON COLUMN public.invitation_tracking.status IS 'Current status: sent, opened, checked_in';
COMMENT ON COLUMN public.invitation_tracking.opened_at IS 'When the invitation was first opened/viewed';
COMMENT ON COLUMN public.invitation_tracking.checked_in_at IS 'When the guest was checked in at the event';
COMMENT ON COLUMN public.invitation_tracking.guest_id IS 'Reference to the guest who received the invitation';
COMMENT ON COLUMN public.invitation_tracking.event_id IS 'Reference to the event the invitation is for';
