-- Create FAQ table for dynamic content management
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "FAQs are publicly viewable" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_faqs_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_faqs_updated_at_column();

-- Insert sample FAQ data
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('How do I create my first event?', 'Creating your first event is easy! Click "Create Event" from your dashboard, fill in the event details like name, date, and location, then our AI will help generate themes and suggestions. You can then customize everything to match your vision.', 'event-creation', 1),
('Is the platform really completely free?', 'Yes! CelebrateSmartly is 100% free during our beta phase. You get unlimited events, unlimited RSVPs, AI-powered theme generation, local vendor discovery, and all premium features at no cost.', 'pricing', 1),
('How do I send RSVP invitations to my guests?', 'Once you create your event and add guests to your guest list, you can send RSVP invitations directly through the platform. Guests will receive a personalized link to respond, and you can track all responses in real-time from your dashboard.', 'rsvp', 1),
('How does the local vendor discovery work?', 'Our platform connects you with local vendors in your area. Search by category (catering, photography, venues, etc.) and location. We show verified local businesses with ratings, photos, and contact information to help you find the perfect vendors for your event.', 'vendors', 1),
('Can I customize my event website?', 'Absolutely! Our website builder lets you create beautiful, personalized event pages. Choose from AI-generated themes, customize colors and layouts, add your own content, and share the link with your guests.', 'website-builder', 2),
('How do I manage guest lists?', 'You can create multiple guest lists for different events, import guests from CSV files, manually add guests, and organize them by categories. All guest management is done through your dashboard with easy-to-use tools.', 'guest-management', 2),
('What if I need help or have technical issues?', 'We''re here to help! Check our Help section for detailed guides, browse these FAQs, or contact our support team. Since we''re in beta, we''re actively improving based on user feedback.', 'support', 3),
('Is my data secure and private?', 'Yes, we take data security seriously. All your personal information and event data is encrypted and stored securely. We never share your data with third parties without your consent. See our Privacy Policy for full details.', 'privacy', 3),
('Can I use this for corporate events?', 'Yes! Our platform works great for both personal and corporate events. Whether it''s a birthday party, wedding, corporate meeting, or large conference, our tools adapt to your needs.', 'general', 4),
('How do I cancel or delete an event?', 'You can cancel or delete events from your dashboard. Go to your events list, click on the event you want to manage, and use the delete option. Note that this action cannot be undone, so make sure you really want to delete the event.', 'event-management', 4);