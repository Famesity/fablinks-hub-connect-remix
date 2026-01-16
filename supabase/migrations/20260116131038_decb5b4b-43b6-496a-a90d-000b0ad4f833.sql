-- Announcement bar table
CREATE TABLE public.announcement_bar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  link_text TEXT,
  link_url TEXT,
  background_color TEXT DEFAULT '#1A73E8',
  text_color TEXT DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcement_bar ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Announcement bar is publicly readable" 
ON public.announcement_bar 
FOR SELECT 
USING (true);

-- Admin write policy
CREATE POLICY "Admins can manage announcement bar" 
ON public.announcement_bar 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Cookie consent settings (stored in site_settings, but we need a consent_logs table)
CREATE TABLE public.cookie_consent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE public.cookie_consent_logs ENABLE ROW LEVEL SECURITY;

-- Public insert for logging consent
CREATE POLICY "Anyone can log consent" 
ON public.cookie_consent_logs 
FOR INSERT 
WITH CHECK (true);

-- Admin read policy
CREATE POLICY "Admins can view consent logs" 
ON public.cookie_consent_logs 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Service requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  school_id UUID REFERENCES public.schools(id),
  service_type TEXT NOT NULL,
  service_details TEXT,
  urgency TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Public insert for service requests
CREATE POLICY "Anyone can submit service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins can manage service requests" 
ON public.service_requests 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Add cookie and announcement settings to site_settings
INSERT INTO site_settings (key, value, category) VALUES 
  ('cookie_consent_enabled', 'true', 'general'),
  ('cookie_consent_message', '"We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies."', 'general'),
  ('cookie_policy_link', '"/page/privacy-policy"', 'general'),
  ('dark_mode_enabled', 'true', 'theme')
ON CONFLICT (key) DO NOTHING;

-- Insert default announcement bar entry
INSERT INTO public.announcement_bar (message, is_active) 
VALUES ('Welcome to Fablinks! Get 10% off your first service.', false);