-- Create admin_activity_logs table
CREATE TABLE public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    admin_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    entity_title TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster querying
CREATE INDEX idx_activity_logs_admin ON public.admin_activity_logs(admin_id);
CREATE INDEX idx_activity_logs_created ON public.admin_activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_entity ON public.admin_activity_logs(entity_type, entity_id);

-- Enable RLS
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert activity logs
CREATE POLICY "Admins can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add comment for clarity
COMMENT ON TABLE public.admin_activity_logs IS 'Tracks admin actions for audit purposes';