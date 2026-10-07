import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, Clock, ExternalLink, MapPin, MessageCircle } from 'lucide-react';
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
  /** Admin-provided registration URL (optional). */
  registrationUrl?: string | null;
  /** Admin-provided WhatsApp number for this event (optional). */
  whatsappNumber?: string | null;
  /** Uploaded card image — rendered at its natural aspect ratio (optional). */
  imageUrl?: string | null;
  /** Free-text price/prize badge shown on the card (optional). */
  price?: string | null;
}

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  registration_url?: string | null;
  whatsapp_number?: string | null;
  image_url?: string | null;
  price?: string | null;
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
    registrationUrl: row.registration_url ?? null,
    whatsappNumber: row.whatsapp_number ?? null,
    imageUrl: row.image_url ?? null,
    price: row.price ?? null,
  };
};

/**
 * Events highlights shown on the landing page (and the full line-up on
 * /experience). Events are managed from Admin → Landing Page → Events
 * Highlights. The section's "All updates" button label and destination are
 * customizable via the site_settings keys `whats_on_cta_label` /
 * `whats_on_cta_link` (Admin → Settings → What's On).
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

interface EventsHighlightsProps {
  /** How many upcoming events to show — the experience page shows a fuller line-up. */
  limit?: number;
}

const EventsHighlights = ({ limit = 4 }: EventsHighlightsProps) => {
  const { getSetting } = useSiteSettings();
  const siteTitle = getSetting('site_title', 'Defabs Media');
  const whatsapp = getSetting('whatsapp_number', '2348106411463');
  const allUpdatesLabel = getSetting('whats_on_cta_label', 'All updates');
  const allUpdatesLink = getSetting('whats_on_cta_link', '/experience');
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);

  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      const baseColumns = 'id, title, description, category, event_date, event_time, venue';
      try {
        let rows: EventRow[] = [];
        const { data, error } = await supabase
          .from('events')
          .select(`${baseColumns}, registration_url, whatsapp_number, image_url, price`)
          .eq('is_active', true)
          .order('event_date', { ascending: true })
          .limit(limit);

        if (error) {
          // The registration columns may not exist yet (migration pending) —
          // retry with the base schema so events keep rendering without them.
          const retry = await supabase
            .from('events')
            .select(baseColumns)
            .eq('is_active', true)
            .order('event_date', { ascending: true })
            .limit(limit);
          if (retry.error) throw retry.error;
          rows = retry.data ?? [];
        } else {
          rows = data ?? [];
        }

        if (!cancelled && rows.length > 0) {
          setEvents(rows.map(rowToEvent));
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
  }, [limit]);

  const reserveLink = (eventTitle: string) =>
    `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
      `Hello ${siteTitle}, I'd like to reserve a spot for "${eventTitle}".`
    )}`;

  /**
   * Where the card's register button goes — precedence:
   * 1. Admin-provided registration URL, opened as-is (normalized to https).
   * 2. Event-specific WhatsApp number → wa.me deep link with a prefilled
   *    registration message about this event, exactly like the services page.
   * 3. Site-wide WhatsApp fallback (the classic "Reserve a spot").
   */
  const registerLink = (event: EventItem) => {
    const message = encodeURIComponent(
      `Hello ${siteTitle}, I'd like to register for "${event.title}"${
        event.time ? ` (${event.time})` : ''
      }.`
    );

    if (event.registrationUrl?.trim()) {
      const raw = event.registrationUrl.trim();
      const href = /^(https?:\/\/|\/|#|mailto:)/i.test(raw) ? raw : `https://${raw}`;
      return { href, label: 'Register', external: /^https?:\/\//i.test(href) };
    }
    if (event.whatsappNumber?.trim()) {
      return {
        href: `https://wa.me/${event.whatsappNumber.replace(/\D/g, '')}?text=${message}`,
        label: 'Register',
        external: true,
      };
    }
    return { href: reserveLink(event.title), label: 'Reserve a spot', external: true };
  };

  const isInternalLink = allUpdatesLink.startsWith('/') || allUpdatesLink.startsWith('#');
  const allUpdatesButton = (
    <Button
      variant="outline"
      className="border-white/25 bg-white/5 text-white hover:border-ent-gold/50 hover:bg-white/10 hover:text-ent-gold"
    >
      {allUpdatesLabel}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );

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
          <div className="shrink-0">
            {isInternalLink ? (
              <Link to={allUpdatesLink}>{allUpdatesButton}</Link>
            ) : (
              <a href={allUpdatesLink} target="_blank" rel="noopener noreferrer">
                {allUpdatesButton}
              </a>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => {
            const register = registerLink(event);
            const registerClass =
              'mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-ent-gold/40 bg-ent-gold/10 px-4 py-2.5 text-sm font-semibold text-ent-gold transition-colors hover:bg-ent-gold hover:text-ent-ink';
            const registerIcon = !register.external ? (
              <ArrowRight className="h-4 w-4" />
            ) : register.href.includes('wa.me') ? (
              <MessageCircle className="h-4 w-4" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            );
            return (
              <article
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-ent-gold/50"
              >
                {/* Media — an uploaded image renders at its natural aspect
                    ratio (the card auto-adjusts to the image dimensions);
                    otherwise a themed placeholder panel keeps the rhythm. */}
                <div className="relative overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      loading="lazy"
                      className="h-auto max-h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="ent-grid-bg flex h-32 w-full items-center justify-center bg-gradient-to-br from-ent-stage via-ent-ink to-ent-ink">
                      <CalendarDays className="h-8 w-8 text-ent-gold/40" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-xl bg-ent-gold px-2.5 py-1.5 text-center leading-none text-ent-ink shadow-lg shadow-ent-ink/20">
                    <span className="font-display block text-lg font-extrabold">
                      {event.day}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-widest">
                      {event.month}
                    </span>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-ent-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ent-gold backdrop-blur">
                    {event.category}
                  </span>
                  {event.price && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-ent-gold px-3 py-1 text-xs font-bold text-ent-ink shadow-lg shadow-ent-ink/20">
                      {event.price}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    {event.weekday}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-ent-gold">
                    {event.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
                    {event.description}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-white/50">
                    <p className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-ent-gold" />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-ent-gold" />
                      {event.venue}
                    </p>
                  </div>

                  {register.external ? (
                    <a
                      href={register.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={registerClass}
                    >
                      {registerIcon}
                      {register.label}
                    </a>
                  ) : (
                    <Link to={register.href} className={registerClass}>
                      {registerIcon}
                      {register.label}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
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
