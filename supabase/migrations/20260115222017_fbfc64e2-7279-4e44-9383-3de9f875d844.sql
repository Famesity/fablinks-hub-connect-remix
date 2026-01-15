
-- Create hero slides table for carousel
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  subtext TEXT,
  image_url TEXT,
  cta_primary_text TEXT DEFAULT 'Get Started',
  cta_primary_link TEXT DEFAULT '#',
  cta_secondary_text TEXT,
  cta_secondary_link TEXT,
  badge_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trust badges table
CREATE TABLE public.trust_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create how it works steps table
CREATE TABLE public.how_it_works_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.how_it_works_steps ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view active hero slides" ON public.hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active trust badges" ON public.trust_badges FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active how it works steps" ON public.how_it_works_steps FOR SELECT USING (is_active = true);

-- Admin policies for hero_slides
CREATE POLICY "Admins can manage hero slides" ON public.hero_slides FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Admin policies for trust_badges
CREATE POLICY "Admins can manage trust badges" ON public.trust_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Admin policies for how_it_works_steps
CREATE POLICY "Admins can manage how it works steps" ON public.how_it_works_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Add updated_at trigger for hero_slides
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero slides
INSERT INTO public.hero_slides (headline, subtext, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, display_order) VALUES
('Fast & Reliable Computer Services', 'Browse the internet, type documents, scan, print, and get everyday computer help — quickly and stress-free.', 'Chat on WhatsApp', 'https://wa.me/2348000000000', 'View Our Services', '/services', 1),
('Quality Printing & Document Solutions', 'Sharp printing, photocopying, scanning, lamination, and document formatting you can trust.', 'Send File on WhatsApp', 'https://wa.me/2348000000000', 'Visit Our Center', '/contact', 2),
('Online Registrations Made Easy', 'NYSC, JAMB, school portals, job applications, email setup, and online forms done correctly.', 'Register with Us', '/services', 'Chat on WhatsApp', 'https://wa.me/2348000000000', 3),
('Graphics, CVs & Business Support', 'Professional CV writing, graphic design, business documents, and digital support services.', 'Get Started', '/services', 'Talk to Us', '/contact', 4);

-- Insert default trust badges
INSERT INTO public.trust_badges (icon_name, title, display_order) VALUES
('Wifi', 'Fast Internet', 1),
('Printer', 'Quality Printing', 2),
('Shield', 'Secure Services', 3),
('BadgeDollarSign', 'Affordable Pricing', 4),
('Users', 'Trusted by Customers', 5);

-- Insert default how it works steps
INSERT INTO public.how_it_works_steps (step_number, title, description, icon_name) VALUES
(1, 'Contact Us or Walk In', 'Reach out via WhatsApp, phone, or simply walk into our center.', 'MessageCircle'),
(2, 'Tell Us What You Need', 'Describe the service you require and we will guide you through the process.', 'FileText'),
(3, 'Get It Done Fast', 'We complete your task professionally and efficiently.', 'Zap');
