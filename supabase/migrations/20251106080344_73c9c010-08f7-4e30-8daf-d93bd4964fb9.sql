-- Create site_settings table for customizable website content
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view site settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can manage site settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, category) VALUES
  -- General settings
  ('site_title', '"EduPoint Services"', 'general'),
  ('site_description', '"Your trusted partner for educational services"', 'general'),
  ('site_logo', '""', 'general'),
  
  -- Hero section
  ('hero_title', '"Welcome to EduPoint Services"', 'hero'),
  ('hero_subtitle', '"Your one-stop solution for all educational needs. From school services to JAMB registration, we''ve got you covered."', 'hero'),
  ('hero_cta_text', '"Get Started"', 'hero'),
  ('hero_cta_link', '"/services"', 'hero'),
  ('hero_background_image', '""', 'hero'),
  
  -- Contact information
  ('contact_email', '"info@edupointservices.com"', 'contact'),
  ('contact_phone', '"+234 XXX XXX XXXX"', 'contact'),
  ('contact_address', '"Lagos, Nigeria"', 'contact'),
  ('contact_whatsapp', '"+234XXXXXXXXXX"', 'contact'),
  
  -- Footer
  ('footer_text', '"© 2024 EduPoint Services. All rights reserved."', 'footer'),
  ('footer_description', '"Your trusted partner in educational services across Nigeria."', 'footer'),
  
  -- Social media
  ('social_facebook', '""', 'social'),
  ('social_twitter', '""', 'social'),
  ('social_instagram', '""', 'social'),
  ('social_linkedin', '""', 'social'),
  
  -- Features section
  ('features_title', '"Why Choose Us"', 'features'),
  ('features_subtitle', '"We provide comprehensive educational services with professionalism and care"', 'features');