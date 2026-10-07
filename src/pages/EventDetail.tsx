import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { buildRegisterLink } from '@/lib/eventLinks';

interface EventDetailRow {
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

const formatFullDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Public event detail page — /events/:id. Reached by clicking any event
 * card on the landing page or /experience. CTA precedence is shared with
 * the cards via src/lib/eventLinks.
 */
const EventDetail = () => {
  const { id } = useParams();
  const { getSetting } = useSiteSettings();
  const siteTitle = getSetting('site_title', 'Defabs Media');
  const whatsapp = getSetting('whatsapp_number', '2348106411463');
  const [event, setEvent] = useState<EventDetailRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const baseColumns = 'id, title, description, category, event_date, event_time, venue';
      try {
        let row: EventDetailRow | null = null;
        const { data, error } = await supabase
          .from('events')
          .select(`${baseColumns}, registration_url, whatsapp_number, image_url, price`)
          .eq('id', id)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          // Registration/media columns may not exist yet (migration pending) —
          // retry with the base schema so the page still renders.
          const retry = await supabase
            .from('events')
            .select(baseColumns)
            .eq('id', id)
            .eq('is_active', true)
            .maybeSingle();
          if (retry.error) throw retry.error;
          row = retry.data;
        } else {
          row = data;
        }

        if (!cancelled) setEvent(row);
      } catch (error) {
        // Invalid id, missing table, or query failed — render the not-found state.
        console.warn('Could not load event:', error);
        if (!cancelled) setEvent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const register = event
    ? buildRegisterLink(
        {
          title: event.title,
          time: event.event_time,
          registrationUrl: event.registration_url,
          whatsappNumber: event.whatsapp_number,
        },
        { siteTitle, whatsapp }
      )
    : null;

  const ctaClass =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-ent-gold px-6 py-3 text-sm font-semibold text-ent-ink transition-colors hover:bg-ent-gold-deep';

  const notFoundContent = (
    <section className="relative overflow-hidden bg-ent-ink pb-20 pt-10">
      <div className="absolute inset-0 ent-grid-bg opacity-50" />
      <div className="container-custom relative z-10 max-w-3xl text-center">
        <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">
          Event not found
        </h1>
        <p className="mt-4 leading-relaxed text-white/60">
          This event doesn't exist or is no longer published — the line-up may have moved on.
        </p>
        <Link
          to="/#whats-on"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ent-gold px-6 py-3 text-sm font-semibold text-ent-ink transition-colors hover:bg-ent-gold-deep"
        >
          <ArrowLeft className="h-4 w-4" />
          See what's on
        </Link>
      </div>
    </section>
  );

  return (
    <Layout>
      <SEOHead
        title={event ? `${event.title} · Events` : 'Event · Defabs Media'}
        description={
          event?.description
            ? event.description.slice(0, 160)
            : 'Event details from the Defabs Media hub — dates, venue, tickets and registration.'
        }
        ogImage={event?.image_url ?? undefined}
        ogType="article"
      />

      {loading ? (
        <section className="flex min-h-[50vh] items-center justify-center bg-ent-ink">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-ent-gold border-t-transparent" />
        </section>
      ) : !event || !register ? (
        notFoundContent
      ) : (
        <section className="relative overflow-hidden bg-ent-ink pb-16 pt-10 md:pb-20">
          <div className="absolute inset-0 ent-grid-bg opacity-50" />
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-ent-gold opacity-10 blur-3xl" />

          <div className="container-custom relative z-10 max-w-3xl">
            <Link
              to="/#whats-on"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to what's on
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-ent-gold/40 bg-ent-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ent-gold">
                {event.category || 'Event'}
              </span>
              {event.price && (
                <span className="rounded-full bg-ent-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-ent-ink">
                  {event.price}
                </span>
              )}
            </div>

            <h1 className="font-display mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
              {event.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-ent-gold" />
                {formatFullDate(event.event_date)}
              </span>
              {event.event_time && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-ent-gold" />
                  {event.event_time}
                </span>
              )}
              {event.venue && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-ent-gold" />
                  {event.venue}
                </span>
              )}
            </div>

            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
                loading="lazy"
                className="mt-8 max-h-[420px] w-full rounded-2xl border border-white/10 object-cover"
              />
            )}

            {event.description && (
              <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-white/70">
                {event.description}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {register.external ? (
                <a
                  href={register.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaClass}
                >
                  {register.href.includes('wa.me') ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  {register.label}
                </a>
              ) : (
                <Link to={register.href} className={ctaClass}>
                  {register.label}
                </Link>
              )}
              <Link
                to="/#whats-on"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-ent-gold/50 hover:bg-white/10 hover:text-ent-gold"
              >
                See all events
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default EventDetail;
