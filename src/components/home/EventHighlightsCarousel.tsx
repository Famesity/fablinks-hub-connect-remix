import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Clapperboard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HighlightItem {
  id: string;
  media_type: string;
  media_url: string;
  caption: string | null;
}

/** Hard cap — the section never renders more than 8 slides. */
const MAX_HIGHLIGHTS = 8;

interface EventHighlightsCarouselProps {
  /** Section heading context — the landing page and /experience word it differently. */
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Past-event image & video highlights — a carousel on every device
 * (swipe on touch, arrows + keyboard everywhere), max 8 slides.
 * Managed from Admin → Landing page → Event highlights.
 * The section hides itself while loading or when there is nothing to show.
 */
const EventHighlightsCarousel = ({
  eyebrow = 'From the archive',
  title = 'Past event highlights',
  subtitle = 'The best moments from events at the hub — photos and videos from floors that were packed.',
}: EventHighlightsCarouselProps) => {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchHighlights = async () => {
      try {
        const { data, error } = await supabase
          .from('event_highlights')
          .select('id, media_type, media_url, caption, display_order, is_active')
          .order('display_order', { ascending: true })
          .limit(MAX_HIGHLIGHTS);

        if (error) throw error;
        if (!cancelled) setItems((data ?? []).slice(0, MAX_HIGHLIGHTS));
      } catch (error) {
        // Table not created yet (migration pending) or query failed — hide the section
        console.warn('Using no event highlights:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHighlights();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="section-padding bg-ent-paper">
      <div className="container-custom">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold-ink">
              {eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold text-ent-ink md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 leading-relaxed text-ent-ink/70">{subtitle}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ent-ink/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-ent-ink/60">
            <Clapperboard className="h-4 w-4 text-ent-gold-ink" />
            {items.length} {items.length === 1 ? 'reel' : 'reels'}
          </span>
        </div>

        <Carousel
          opts={{ align: 'start', loop: items.length >= 3 }}
          className="mt-10 w-full"
        >
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <figure className="group relative overflow-hidden rounded-2xl border border-ent-ink/10 bg-ent-ink">
                  {item.media_type === 'video' ? (
                    <video
                      src={item.media_url}
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-video w-full bg-ent-ink object-contain"
                    />
                  ) : (
                    <img
                      src={item.media_url}
                      alt={item.caption || 'Past event highlight'}
                      loading="lazy"
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {item.caption && (
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ent-ink/90 via-ent-ink/60 to-transparent p-4 pt-10 text-sm font-semibold text-white">
                      <span className="line-clamp-2">{item.caption}</span>
                    </figcaption>
                  )}
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Arrows stay visible on every device — swipe works on touch. */}
          <CarouselPrevious className="-left-2 sm:-left-4 md:-left-12" />
          <CarouselNext className="-right-2 sm:-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default EventHighlightsCarousel;
