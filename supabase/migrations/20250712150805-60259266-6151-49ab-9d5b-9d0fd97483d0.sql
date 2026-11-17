-- Create table for storing event pages
CREATE TABLE public.event_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  template_id TEXT NOT NULL,
  html_content TEXT NOT NULL,
  css_content TEXT NOT NULL,
  featured_image_url TEXT,
  meta_tags JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  custom_domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own event pages" 
ON public.event_pages 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Published event pages are publicly viewable" 
ON public.event_pages 
FOR SELECT 
USING (is_published = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_event_pages_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_event_pages_updated_at
BEFORE UPDATE ON public.event_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_event_pages_updated_at_column();

-- Create storage bucket for event page images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

-- Create storage policies for event images
CREATE POLICY "Event images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-images');

CREATE POLICY "Users can upload event images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their event images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their event images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);