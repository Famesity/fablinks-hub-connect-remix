import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface EventItem {
  id: string;
  month: string;
  day: string;
  weekday: string;
  category: string;
  title: string;
  description: string;
  time: string;
  venue: string;
}

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  event_date: string;
  event_time: string | null;
  venue: string | null;
}

const monthShort = (date: Date) =>
  date.toLocaleDateString('en-NG', { month: 'short' });
const weekdayLong = (date: Date) =>
  date.toLocaleDateString('en-NG', { weekday: 'long' });

const rowToEvent = (row: EventRow): EventItem => {
  const date = new Date(`${row.event_date}T00:00:00`);
  const valid = !Number.isNaN(date.getTime());
  return {
    id: row.id,
    month: valid ? monthShort(date) : '',
    day: valid ? String(date.getDate()).padStart(2, '0') : '--',
    weekday: valid ? weekdayLong(date) : '',
    category: row.category || 'Event',
    title: row.title,
    description: row.description || '',
    time: row.event_time || '',
    venue: row.venue || '',
  };
};

/**
 * Events highlights shown on the landing page.
 * Events are managed from Admin → Landing Page → Events Highlights.
 * This fallback line-up renders until the events table is available.
 */
const fallbackEvents: EventItem[] = [
  {
    id: 'fallback-1',
    month: 'Oct',
    day: '10',
    weekday: 'Saturday',
    category: 'Tournament',
    title: 'Game Night: FIFA & eFootball Showdown',
    description:
      'Knockout bracket on the big screen — winners take the bragging rights plus a free printing voucher.',
    time: '5:00 PM',
    venue: 'Defabs Media Lounge, Student Affairs',
  },
  {
    id: 'fallback-2',
    month: 'Oct',
    day: '17',
    weekday: 'Saturday',
    category: 'Screening',
    title: 'Premier League Watch Party',
    description:
      'Match day with the loudest crowd in town — big screen, live commentary and halftime giveaways.',
    time: '3:00 PM',
    venue: 'Defabs Media Lounge, Student Affairs',
  },
  {
    id: 'fallback-3',
    month: 'Oct',
    day: '24',
    weekday: 'Saturday',
    category: 'Workshop',
    title: 'Flyers, Posters & Content Clinic',
    description:
      'Bring your idea — we design, print and package it while you wait, with a free portfolio review for local creatives.',
    time: '1:00 PM',
    venue: 'Design Corner, Shop 35',
  },
  {
    id: 'fallback-4',
    month: 'Nov',
    day: '07',
    weekday: 'Saturday',
    category: 'Community',
    title: 'Creators Meet-Up',
    description:
      'Musicians, comedians, bloggers and designers swap ideas, trade collabs and preview the December line-up.',
    time: '2:00 PM',
    venue: 'Defabs Media Lounge, Student Affairs',
  },
];

const EventsHighlights = () => {
  const { getSetting } = useSiteSettings();
  const siteTitle = getSetting('site_title', 'Defabs Media');
  const whatsapp = getSetting('whatsapp_number', '2348106411463');
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);

  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, title, description, category, event_date, event_time, venue')
          .eq('is_active', true)
          .order('event_date', { ascending: true })
          .limit(4);

        if (error) throw error;
        if (!cancelled && data && data.length > 0) {
          setEvents(data.map(rowToEvent));
        }
      } catch (error) {
        // Table not created yet (migration pending) or query failed — keep the fallback line-up
        console.warn('Using fallback events line-up:', error);
      }
    };

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const reserveLink = (eventTitle: string) =>
    `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
      `Hello ${siteTitle}, I'd like to reserve a spot for "${eventTitle}".`
    )}`;

  return (
    <section id="whats-on" className="relative overflow-hidden bg-ent-ink scroll-mt-20 py-16 md:py-20">
      <div className="absolute inset-0 ent-grid-bg opacity-50" />
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-ent-gold opacity-10 blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold">
              On the radar
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold text-white md:text-4xl">
              What's on at the hub
            </h2>
            <p className="mt-4 leading-relaxed text-white/60">
              Tournaments, watch parties, workshops and meet-ups — the moments that make the
              Defabs Media floor feel like home.
            </p>
          </div>
          <Link to="/blog" className="shrink-0">
            <Button
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:border-ent-gold/50 hover:bg-white/10 hover:text-ent-gold"
            >
              All updates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ent-gold/50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-ent-gold px-3 py-2 text-center leading-none text-ent-ink">
                  <span className="font-display block text-2xl font-extrabold">{event.day}</span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest">
                    {event.month}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ent-gold">
                    {event.category}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">{event.weekday}</p>
                </div>
              </div>

              <h3 className="font-display mt-5 text-lg font-bold leading-snug text-white transition-colors group-hover:text-ent-gold">
                {event.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">
                {event.description}
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-white/50">
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-ent-gold" />
                  {event.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-ent-gold" />
                  {event.venue}
                </p>
              </div>

              <a
                href={reserveLink(event.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-ent-gold/40 bg-ent-gold/10 px-4 py-2.5 pt-2.5 text-sm font-semibold text-ent-gold transition-colors hover:bg-ent-gold hover:text-ent-ink"
              >
                <MessageCircle className="h-4 w-4" />
                Reserve a spot
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center">
          <p className="text-sm text-white/60">
            Line-ups change weekly — recaps and fresh dates land on the blog first.
          </p>
          <Link to="/blog">
            <Button className="bg-ent-gold font-semibold text-ent-ink hover:bg-ent-gold-deep">
              Read the blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsHighlights;
