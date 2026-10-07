-- Per-event registration links (Admin → Landing Page → Events Highlights).
--   registration_url : any URL — a ticket/registration page or a full wa.me link
--   whatsapp_number  : event-specific WhatsApp number; the public card builds a
--                      wa.me deep link with a prefilled registration message,
--                      exactly like the services page does.
-- Both optional: events without them keep the site-wide "Reserve a spot" link.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS registration_url TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
