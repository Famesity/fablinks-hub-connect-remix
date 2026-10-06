-- Customizable "All updates" button in the landing page's
-- "On the radar / What's on at the hub" section (src/components/home/EventsHighlights.tsx).
-- Label + destination are editable in Admin → Settings → What's On.
-- Defaults navigate to the /experience page.
-- DO NOTHING on conflict so admin customizations survive re-runs.

INSERT INTO public.site_settings (key, value, category)
VALUES
  ('whats_on_cta_label', to_jsonb('All updates'::text), 'landing'),
  ('whats_on_cta_link', to_jsonb('/experience'::text), 'landing')
ON CONFLICT (key) DO NOTHING;
