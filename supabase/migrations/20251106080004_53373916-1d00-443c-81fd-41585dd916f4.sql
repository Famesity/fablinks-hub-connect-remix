-- Create storage bucket for blog post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Create storage bucket for school logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-logos', 'school-logos', true);

-- RLS policies for blog-images bucket
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS policies for school-logos bucket
CREATE POLICY "Anyone can view school logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-logos');

CREATE POLICY "Admins can upload school logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'school-logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update school logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'school-logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete school logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'school-logos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add logo_url column to schools table
ALTER TABLE public.schools
ADD COLUMN IF NOT EXISTS logo_url TEXT;