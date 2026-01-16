-- Create why_choose_us_features table for editable features
CREATE TABLE public.why_choose_us_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name TEXT NOT NULL DEFAULT 'Shield',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.why_choose_us_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active why choose us features" 
ON public.why_choose_us_features 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage why choose us features" 
ON public.why_choose_us_features 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create statistics table for editable stats
CREATE TABLE public.site_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active statistics" 
ON public.site_statistics 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage statistics" 
ON public.site_statistics 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default features
INSERT INTO public.why_choose_us_features (icon_name, title, description, display_order)
VALUES 
  ('Shield', '100% Trusted', 'Secure and reliable services with guaranteed results for all transactions', 1),
  ('Clock', '24/7 Support', 'Round-the-clock customer service to assist you whenever you need help', 2),
  ('Zap', 'Instant Delivery', 'Lightning-fast processing for all services with immediate confirmation', 3),
  ('Users', '10,000+ Students Served', 'Trusted by thousands of Nigerian students across all academic levels', 4),
  ('Award', 'Expert Team', 'Experienced professionals who understand Nigerian educational systems', 5),
  ('Heart', 'Student-Focused', 'Designed specifically for Nigerian students with affordable pricing', 6);

-- Insert default statistics
INSERT INTO public.site_statistics (label, value, display_order)
VALUES 
  ('Happy Students', '10,000+', 1),
  ('Service Types', '50+', 2),
  ('Support Available', '24/7', 3),
  ('Success Rate', '99.9%', 4);