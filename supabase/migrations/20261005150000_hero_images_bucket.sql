-- Create storage bucket for hero carousel images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true);

-- RLS policies for hero-images bucket
CREATE POLICY "Public read access for hero images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hero-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update hero images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hero-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete hero images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hero-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);
