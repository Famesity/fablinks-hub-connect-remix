-- Create featured_services table for landing page services
CREATE TABLE public.featured_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Star',
  color_class TEXT NOT NULL DEFAULT 'bg-primary',
  whatsapp_message TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_services ENABLE ROW LEVEL SECURITY;

-- Public can read active featured services
CREATE POLICY "Anyone can view active featured services"
ON public.featured_services
FOR SELECT
USING (is_active = true);

-- Admins can manage featured services
CREATE POLICY "Admins can manage featured services"
ON public.featured_services
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_featured_services_updated_at
BEFORE UPDATE ON public.featured_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default featured services
INSERT INTO public.featured_services (title, description, icon_name, color_class, whatsapp_message, display_order) VALUES
('WAEC & NECO Results', 'Get your exam results instantly with scratch cards and verification pins', 'GraduationCap', 'bg-blue-500', 'Hello Fablinks Online Café, I would like to buy a WAEC Scratch Card.', 1),
('JAMB Services', 'Registration, result printing, admission letters and profile management', 'FileText', 'bg-green-500', 'Hello Fablinks Online Café, I need help with JAMB Original Result Printing.', 2),
('NYSC Registration', 'Complete NYSC services including registration and call-up letters', 'Users', 'bg-purple-500', 'Hello Fablinks Online Café, I need help with NYSC Registration.', 3),
('Airtime & Data', 'Quick top-ups for all networks with instant delivery', 'Smartphone', 'bg-orange-500', 'Hello Fablinks Online Café, I want to buy Airtime.', 4),
('Bill Payments', 'Pay electricity, water, cable TV and internet bills easily', 'CreditCard', 'bg-red-500', 'Hello Fablinks Online Café, I want to pay my Electricity Bill.', 5),
('Academic Projects', 'Professional project writing, assignments and research support', 'Globe', 'bg-indigo-500', 'Hello Fablinks Online Café, I need help with Project Writing.', 6);