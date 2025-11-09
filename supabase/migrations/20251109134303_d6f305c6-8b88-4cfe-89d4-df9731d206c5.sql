-- Create admin_profiles table for profile management
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admins can view all profiles
CREATE POLICY "Admins can view all admin profiles"
  ON public.admin_profiles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update their own profile
CREATE POLICY "Admins can update own profile"
  ON public.admin_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can insert their own profile
CREATE POLICY "Admins can insert own profile"
  ON public.admin_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();