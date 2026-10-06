-- Admin-configurable section animations for the public pages.
-- Rendered by src/components/Reveal.tsx; editable in
-- Admin → Settings → Animations (animations_style / animations_enabled).
-- DO NOTHING on conflict so admin customizations survive re-runs.

INSERT INTO public.site_settings (key, value, category)
VALUES
  ('animations_style', to_jsonb('fade-up'::text), 'animations'),
  ('animations_enabled', to_jsonb('on'::text), 'animations')
ON CONFLICT (key) DO NOTHING;
