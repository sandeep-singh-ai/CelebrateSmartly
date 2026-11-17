-- Add missing columns to invitation_tracking table
ALTER TABLE public.invitation_tracking 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'no_response',
ADD COLUMN IF NOT EXISTS checked_in_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS opened_at timestamp with time zone;

-- Update existing records to have consistent status
UPDATE public.invitation_tracking 
SET status = response_status 
WHERE status IS NULL;