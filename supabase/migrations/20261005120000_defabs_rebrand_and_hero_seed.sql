-- Defabs Media rebrand + hero carousel seed (2026-10-05)
--
-- Replays the production rebrand so a fresh environment (migrations applied in
-- order) converges to the same state as the live database. Idempotent:
-- - text replacements are no-ops on already-rebranded content
-- - the hero seed is delete + insert of the canonical 4 slides
--
-- Scope note: these are exactly the tables whose earlier seed migrations
-- (20260115222017 hero_slides, 20261002100000 events, 20260116083703
-- featured_services, 20260116141144 pages + announcement_bar) injected the old
-- "Fablinks Computers" branding, plus the JSONB site_settings blob. Content
-- created later through the admin CMS lives only in the live database and is
-- not part of replay.

-- ---------------------------------------------------------------------------
-- 1) Rebrand text columns in the seed-bearing content tables.
--    Ordered, case-tiered replace chains (most specific first) matching the
--    rebrand applied to production on 2026-10-05.
-- ---------------------------------------------------------------------------

UPDATE public.events
SET title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(description,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    venue = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(venue,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    category = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(category,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs')
WHERE title ~* 'fablink' OR description ~* 'fablink' OR venue ~* 'fablink' OR category ~* 'fablink';

UPDATE public.featured_services
SET title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(description,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    whatsapp_message = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(whatsapp_message,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs')
WHERE title ~* 'fablink' OR description ~* 'fablink' OR whatsapp_message ~* 'fablink';

UPDATE public.pages
SET title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    content = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    excerpt = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(excerpt,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    seo_title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_title,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    seo_description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_description,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    seo_keywords = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(seo_keywords,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    slug = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(slug,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs')
WHERE title ~* 'fablink' OR content ~* 'fablink' OR excerpt ~* 'fablink'
   OR seo_title ~* 'fablink' OR seo_description ~* 'fablink'
   OR seo_keywords ~* 'fablink' OR slug ~* 'fablink';

UPDATE public.announcement_bar
SET message = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(message,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    link_text = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(link_text,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs'),
    link_url = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(link_url,
             'Fablinks Computers', 'Defabs Media'), 'fablinkscomputers', 'defabsmedia'),
             'FABLINKS COMPUTERS', 'DEFABS MEDIA'), 'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
             'Fablinks', 'Defabs'), 'FABLINKS', 'DEFABS'), 'fablinks', 'defabs')
WHERE message ~* 'fablink' OR link_text ~* 'fablink' OR link_url ~* 'fablink';

-- ---------------------------------------------------------------------------
-- 2) Rebrand the JSONB site_settings blob (recursive via text round-trip).
-- ---------------------------------------------------------------------------

UPDATE public.site_settings
SET value = (
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE((value)::text,
    'Fablinks Computers', 'Defabs Media'),
    'fablinkscomputers', 'defabsmedia'),
    'FABLINKS COMPUTERS', 'DEFABS MEDIA'),
    'FABLINKSCOMPUTERS', 'DEFABSMEDIA'),
    'Fablinks', 'Defabs'),
    'FABLINKS', 'DEFABS'),
    'fablinks', 'defabs')
)::jsonb
WHERE (value)::text ~* 'fablink';

-- ---------------------------------------------------------------------------
-- 3) Hero carousel seed — exactly the 4 Defabs Media slides, in order.
--    image_url is left NULL ("ready for upload"): the HeroCarousel renders its
--    branded gradient for imageless slides. Upload real artwork via Supabase
--    Storage or the /admin/hero-slides CMS at any time.
-- ---------------------------------------------------------------------------

DELETE FROM public.hero_slides;

INSERT INTO public.hero_slides
  (headline, subtext, image_url, cta_primary_text, cta_primary_link,
   cta_secondary_text, cta_secondary_link, display_order, is_active)
VALUES
  ('Entertainment. Services. One Hub.',
   'Experience live events, premium content, and professional digital services — all under one roof.',
   NULL, 'Explore Defabs', '/about', 'What’s On', '/#whats-on', 1, true),
  ('Where the Moments Happen',
   'Watch parties, live screenings, tournaments, and unforgettable experiences.',
   NULL, 'See Upcoming Events', '/#whats-on', 'Join the Experience', '/experience', 2, true),
  ('Fast. Reliable. Professional.',
   'High-quality printing, graphic design, registrations, and more — delivered with precision.',
   NULL, 'Browse Services', '/services', 'Get Started', '/request', 3, true),
  ('Create. Enjoy. Connect.',
   'More than services — a creative space for content, community, and everything in between.',
   NULL, 'Discover Defabs Media', '/about', 'Learn More', '/contact', 4, true);
