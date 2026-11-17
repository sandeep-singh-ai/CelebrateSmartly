
-- Create template categories table
CREATE TABLE public.template_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website templates table
CREATE TABLE public.website_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID NOT NULL,
  thumbnail_url TEXT,
  preview_url TEXT,
  html_content TEXT NOT NULL,
  css_content TEXT NOT NULL,
  js_content TEXT DEFAULT '',
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (category_id) REFERENCES public.template_categories(id) ON DELETE CASCADE
);

-- Add Row Level Security
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for template categories (public read access)
CREATE POLICY "Anyone can view template categories" 
ON public.template_categories 
FOR SELECT 
USING (is_active = true);

-- Create policies for website templates (public read access)
CREATE POLICY "Anyone can view active templates" 
ON public.website_templates 
FOR SELECT 
USING (is_active = true);

-- Insert initial template categories
INSERT INTO public.template_categories (name, description, icon, sort_order) VALUES
('wedding', 'Beautiful wedding celebration templates', 'Heart', 1),
('birthday', 'Fun birthday party templates', 'Cake', 2),
('baby-shower', 'Sweet baby shower templates', 'Baby', 3),
('general', 'General event templates', 'Sparkles', 4);

-- Insert sample templates
INSERT INTO public.website_templates (name, description, category_id, thumbnail_url, html_content, css_content, tags) VALUES
(
  'Modern Wedding',
  'Elegant white and gold theme with sophisticated typography',
  (SELECT id FROM public.template_categories WHERE name = 'wedding'),
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
  '<div class="wedding-page"><header class="hero-section"><h1>{{event_title}}</h1><p>{{event_date}}</p></header><section class="details"><p>{{event_description}}</p></section></div>',
  '.wedding-page { font-family: Georgia, serif; } .hero-section { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); text-align: center; padding: 100px 20px; } .hero-section h1 { font-size: 3rem; color: #333; margin-bottom: 20px; }',
  ARRAY['elegant', 'modern', 'sophisticated']
),
(
  'Birthday Bash',
  'Colorful and fun theme with bold typography and confetti',
  (SELECT id FROM public.template_categories WHERE name = 'birthday'),
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop',
  '<div class="birthday-page"><header class="party-header"><h1>{{event_title}}</h1><p>{{event_date}}</p></header><section class="celebration"><p>{{event_description}}</p></section></div>',
  '.birthday-page { font-family: "Comic Sans MS", cursive; } .party-header { background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7); text-align: center; padding: 80px 20px; } .party-header h1 { font-size: 2.5rem; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }',
  ARRAY['colorful', 'fun', 'party']
),
(
  'Baby Shower Bliss',
  'Soft and sweet theme with pastel colors and cute elements',
  (SELECT id FROM public.template_categories WHERE name = 'baby-shower'),
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
  '<div class="baby-shower-page"><header class="baby-header"><h1>{{event_title}}</h1><p>{{event_date}}</p></header><section class="shower-details"><p>{{event_description}}</p></section></div>',
  '.baby-shower-page { font-family: "Trebuchet MS", sans-serif; } .baby-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center; padding: 80px 20px; color: white; } .baby-header h1 { font-size: 2.5rem; margin-bottom: 15px; }',
  ARRAY['sweet', 'pastel', 'cute']
);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_template_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_template_categories_updated_at
BEFORE UPDATE ON public.template_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_template_updated_at_column();

CREATE TRIGGER update_website_templates_updated_at
BEFORE UPDATE ON public.website_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_template_updated_at_column();
