-- Create admin permissions table to store granular permissions for each admin
CREATE TABLE public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    permission TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, permission)
);

-- Enable Row Level Security
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Only admins can view permissions
CREATE POLICY "Admins can view all permissions" 
ON public.admin_permissions 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can manage permissions (insert, update, delete)
CREATE POLICY "Admins can manage permissions" 
ON public.admin_permissions 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Super admins (those with no restrictions) have all permissions
  -- Regular admins need to check the permissions table
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM public.admin_permissions WHERE user_id = _user_id
    ) THEN 
      -- No permissions set means full access (super admin)
      public.has_role(_user_id, 'admin')
    ELSE
      -- Check specific permission
      EXISTS (
        SELECT 1 FROM public.admin_permissions 
        WHERE user_id = _user_id AND permission = _permission
      )
  END
$$;

-- Create trigger for updating updated_at
CREATE TRIGGER update_admin_permissions_updated_at
BEFORE UPDATE ON public.admin_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();