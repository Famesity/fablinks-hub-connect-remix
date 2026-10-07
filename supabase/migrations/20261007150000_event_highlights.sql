-- Past-event media highlights — an image/video carousel shown on the landing
-- page and /experience ("carousel on all devices", max 8 items rendered).
--   media_type : 'image' or 'video'
--   media_url  : public URL in the event-images bucket (folder `highlights/`)
--                or any pasted URL
--   caption    : short line shown over the slide
-- Active rows are publicly readable; admins manage everything.

CREATE TABLE public.event_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.event_highlights ENABLE ROW LEVEL SECURITY;

-- Everyone can view active highlights
CREATE POLICY "Anyone can view active event highlights"
ON public.event_highlights
FOR SELECT
TO public
USING (is_active = true);

-- Admins see (and manage) everything, active or not
CREATE POLICY "Admins can manage event highlights"
ON public.event_highlights
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger (public.update_updated_at_column already exists)
CREATE TRIGGER update_event_highlights_updated_at
BEFORE UPDATE ON public.event_highlights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
