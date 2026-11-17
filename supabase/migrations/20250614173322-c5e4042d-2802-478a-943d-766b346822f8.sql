
-- Create a new storage bucket for vendor images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-images', 'vendor-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public access
-- Delete existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Vendor images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to vendor-images." ON storage.objects;

-- Grant public read access
CREATE POLICY "Vendor images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'vendor-images' );

-- Allow uploads
CREATE POLICY "Anyone can upload to vendor-images."
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'vendor-images' );
