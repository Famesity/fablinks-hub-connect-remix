-- Add theme customization settings
INSERT INTO site_settings (key, value, category) VALUES
  ('theme_primary_color', '"217 91% 50%"', 'theme'),
  ('theme_primary_foreground', '"0 0% 98%"', 'theme'),
  ('theme_secondary_color', '"210 40% 96.1%"', 'theme'),
  ('theme_accent_color', '"217 91% 50%"', 'theme'),
  ('theme_background', '"0 0% 100%"', 'theme'),
  ('theme_foreground', '"222.2 84% 4.9%"', 'theme'),
  ('theme_border_radius', '"0.75rem"', 'theme')
ON CONFLICT (key) DO NOTHING;