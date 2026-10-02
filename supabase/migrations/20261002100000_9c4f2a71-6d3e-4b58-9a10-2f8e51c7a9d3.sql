-- Events highlights for the entertainment landing page
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Event',
  event_date DATE NOT NULL,
  event_time TEXT,
  venue TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can read active events
CREATE POLICY "Anyone can view active events" ON public.events
  FOR SELECT USING (is_active = true);

-- Admins can manage events
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Seed the launch line-up if the table is empty
INSERT INTO public.events (title, description, category, event_date, event_time, venue, display_order)
SELECT v.title, v.description, v.category, v.event_date::date, v.event_time, v.venue, v.display_order
FROM (VALUES
  ('Game Night: FIFA & eFootball Showdown',
   'Knockout bracket on the big screen — winners take the campus bragging rights plus a free printing voucher.',
   'Tournament', '2026-10-10', '5:00 PM', 'Fablinks Lounge, Student Affairs', 1),
  ('Premier League Watch Party',
   'Match day with the loudest crowd on campus — big screen, live commentary and halftime giveaways.',
   'Screening', '2026-10-17', '3:00 PM', 'Fablinks Lounge, Student Affairs', 2),
  ('Flyers, Posters & Content Clinic',
   'Bring your idea — we design, print and package it while you wait, with a free portfolio review for campus creatives.',
   'Workshop', '2026-10-24', '1:00 PM', 'Design Corner, Shop 35', 3),
  ('Campus Creators Meet-Up',
   'Musicians, comedians, bloggers and designers swap ideas, trade collabs and preview the December line-up.',
   'Community', '2026-11-07', '2:00 PM', 'Fablinks Lounge, Student Affairs', 4)
) AS v(title, description, category, event_date, event_time, venue, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.events LIMIT 1);
