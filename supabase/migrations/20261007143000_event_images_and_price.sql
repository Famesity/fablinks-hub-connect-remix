-- Rich event cards for the landing page's "On the radar / What's on at the hub"
-- section — each card can show an uploaded image, price/prize badge, title,
-- date, short description and a CTA.
--   image_url : uploaded card image — rendered at its natural aspect ratio
--               (the card auto-adjusts to the image dimensions).
--   price     : free-text price/prize line shown as a badge
--               ("Free", "₦500", "Win ₦50,000", …).
-- Both optional: events without them keep the themed placeholder panel.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS price TEXT;

-- Storage bucket for event card images (same shape as hero-images).
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for the event-images bucket: public read, admin-only write.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND policyname = 'Public read access for event images'
  ) THEN
    CREATE POLICY "Public read access for event images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'event-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND policyname = 'Admins can upload event images'
  ) THEN
    CREATE POLICY "Admins can upload event images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'event-images' AND
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND policyname = 'Admins can update event images'
  ) THEN
    CREATE POLICY "Admins can update event images"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'event-images' AND
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND policyname = 'Admins can delete event images'
  ) THEN
    CREATE POLICY "Admins can delete event images"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'event-images' AND
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;
