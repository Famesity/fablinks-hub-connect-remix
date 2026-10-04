import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { resolveAssetUrl } from '@/lib/assetResolver';

/* =========================================================
   DATA LAYER — zero hardcoded content
   ========================================================= */

/**
 * Shape of one hero slide as stored in the Supabase `hero_slides` table.
 * Every visible string/CTA/image comes from this row — nothing is hardcoded.
 */
export interface HeroSlide {
  id: string;
  /** Large bold headline (required). */
  headline: string;
  /** Supporting paragraph. */
  subtext: string | null;
  /** Optional small pill above the headline. */
  badge_text: string | null;
  /** Background image (bundled asset path, public path or external URL). */
  image_url: string | null;
  /** Primary CTA — solid accent button. */
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  /** Secondary CTA — glass/outline button. */
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  /** Sort key (ascending). */
  display_order: number;
  /** Only active slides are published. */
  is_active: boolean;
}

const SLIDE_DURATION_MS = 6_000; // feature #2: autoplay every 6 seconds
const CROSSFADE_MS = 900; // must match the fade duration in the slide class
const DRAG_COMMIT_THRESHOLD = 60; // px of horizontal drag required to change slide

/**
 * Fetches the published hero slides, ordered for display.
 *
 * PLACEHOLDER DATA FETCHER: swap the body for any API/REST/GraphQL endpoint
 * as long as it resolves to HeroSlide[]. Everything else in the component is
 * already fully dynamic and driven by the returned array.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data ?? []) as HeroSlide[];
}

/* =========================================================
   SMALL HELPERS
   ========================================================= */

/** Zero-pads a 1-based slide number: 1 → "01" (feature #7). */
const pad2 = (n: number) => String(n).padStart(2, '0');

const isExternalLink = (link: string) =>
  link.startsWith('http://') || link.startsWith('https://');

/** Renders one CTA as an anchor (external) or router Link (internal). */
const SlideCTA: React.FC<{
  text: string | null;
  link: string | null;
  variant: 'primary' | 'secondary';
}> = ({ text, link, variant }) => {
  if (!text || !link) return null;

  const className =
    variant === 'primary'
      ? 'inline-flex items-center justify-center rounded-xl bg-defabs-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-defabs-dark/30 transition-colors duration-300 hover:bg-defabs-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-defabs-accent'
      : 'inline-flex items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:border-white/60 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  if (isExternalLink(link)) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={className}>
        {text}
      </a>
    );
  }
  return (
    <Link to={link} className={className}>
      {text}
    </Link>
  );
};

/* =========================================================
   COMPONENT
   ========================================================= */

const HeroCarousel: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Autoplay control: hover, any user interaction, or a swipe in flight
     pauses the timer so it never fights the user (feature #2). */
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  /* SCROLL PARALLAX (feature #6): the section's background wrapper is
     translated on Y based on how far the hero has scrolled out of view.
     Written to a ref + applied via rAF — never React state — so scrolling
     cannot trigger re-renders. */
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  /* SWIPE / DRAG (feature #4): pointer events unify touch and mouse. Only
     horizontal intent is tracked — vertical deltas are ignored so the page
     keeps scrolling normally on mobile. */
  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragLockedRef = useRef(false); // true once horizontal intent is locked in

  /* Autoplay timeline state (feature #3): accumulated elapsed ms survives
     pauses so the progress bar resumes instead of restarting from zero. */
  const progressRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const interactionTimeoutRef = useRef<number | null>(null);

  /* Load slides (DB/API only — no hardcoded fallback content). */
  useEffect(() => {
    let cancelled = false;

    getHeroSlides()
      .then((data) => {
        if (cancelled) return;
        setSlides(data);
        setLoadFailed(false);
      })
      .catch((err) => {
        console.error('HeroCarousel: failed to load slides', err);
        if (!cancelled) setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      elapsedRef.current = 0; // a new slide starts a fresh 6s window
      setActiveIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goToSlide(activeIndex + 1), [goToSlide, activeIndex]);
  const prev = useCallback(() => goToSlide(activeIndex - 1), [goToSlide, activeIndex]);

  /* Interaction pause: arrows/dots/swipes set a flag that outlives the
     gesture by one full slide duration so autoplay resumes cleanly from the
     newly selected slide. Replaces any pending timer from earlier clicks. */
  const handleManualNavigation = useCallback((navigate: () => void) => {
    setIsInteracting(true);
    navigate();
    if (interactionTimeoutRef.current !== null) {
      window.clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsInteracting(false);
      interactionTimeoutRef.current = null;
    }, SLIDE_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current !== null) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  /* AUTOPLAY + PROGRESS BAR (features #2 & #3). One rAF timeline drives both:
     elapsed/SLIDE_DURATION_MS fills the bar (scaleX) and reaching 1.0 advances
     the slide. The effect restarts whenever the slide or pause state changes;
     accumulated progress is preserved across pauses via elapsedRef. */
  useEffect(() => {
    const shouldRun =
      slides.length > 1 && !isHovered && !isInteracting && !isDragging;

    if (!shouldRun) return; // bar simply freezes at its last painted fill

    startRef.current = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = elapsedRef.current + (now - startRef.current);
      const fraction = Math.min(elapsed / SLIDE_DURATION_MS, 1);

      // PROGRESS BAR: scaleX on the compositor instead of animating width —
      // zero layout work per frame.
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${fraction})`;
      }

      if (fraction >= 1) {
        elapsedRef.current = 0; // next slide starts from an empty bar
        startRef.current = 0; // tells the cleanup below not to accumulate
        setActiveIndex((i) => (i + 1) % slides.length);
        return; // effect re-runs on index change and restarts the timeline
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      // Pause or slide change: remember how far the bar filled so the next
      // run resumes (unless we just advanced, which zeroed everything).
      if (startRef.current) {
        elapsedRef.current += performance.now() - startRef.current;
      }
      cancelAnimationFrame(raf);
    };
  }, [activeIndex, slides.length, isHovered, isInteracting, isDragging]);

  /* SCROLL PARALLAX (feature #6), continued. The background layer shifts
     downward to ~12% of the section's height as the hero scrolls away,
     creating depth between the slower background and the page content. */
  useEffect(() => {
    const section = sectionRef.current;
    const layer = parallaxRef.current;
    if (!section || !layer) return;

    const update = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      // 0 when the hero's top aligns with the viewport top → ~1 once scrolled past.
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      layer.style.transform = `translate3d(0, ${progress * rect.height * 0.12}px, 0)`;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [slides.length]);

  /* SWIPE / DRAG handlers (feature #4). Pointer capture guarantees we see
     pointerup even when the finger/mouse is released outside the section. */
  const onPointerDown = (e: React.PointerEvent) => {
    // Only the left button for mouse; touch/pen are always fine.
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragLockedRef.current = false;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer may already be gone — dragging just won't capture */
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null || dragStartYRef.current === null) return;
    const dx = e.clientX - dragStartXRef.current;
    const dy = e.clientY - dragStartYRef.current;

    // Lock in horizontal intent once the gesture clearly leans horizontal.
    if (!dragLockedRef.current) {
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        dragLockedRef.current = true;
        setIsDragging(true); // pauses autoplay while the swipe is in flight
      } else if (Math.abs(dy) > 12) {
        // Vertical gesture — abandon tracking and let the page scroll.
        dragStartXRef.current = null;
        dragStartYRef.current = null;
        return;
      } else {
        return;
      }
    }

    // Commit the slide change once the drag passes the threshold…
    if (Math.abs(dx) >= DRAG_COMMIT_THRESHOLD) {
      const direction = dx < 0 ? 1 : -1; // swipe left → next, swipe right → prev
      dragStartXRef.current = e.clientX; // …but keep tracking for chained swipes
      handleManualNavigation(direction > 0 ? next : prev);
    }
  };

  const onPointerEnd = () => {
    dragStartXRef.current = null;
    dragStartYRef.current = null;
    dragLockedRef.current = false;
    setIsDragging(false);
  };

  /* ---------- Loading skeleton (feature #12) ---------- */
  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-label="Loading featured highlights"
        className="relative flex h-[85vh] min-h-[600px] max-h-[900px] items-center overflow-hidden bg-defabs-dark"
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-defabs-primary/60 via-defabs-dark to-defabs-primary/60" />
        <div className="container-custom relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="mb-6 h-8 w-44 animate-pulse rounded-full bg-white/10" />
            <div className="mb-4 h-12 w-4/5 animate-pulse rounded-lg bg-white/10 sm:h-14 md:h-16" />
            <div className="mb-3 h-12 w-3/5 animate-pulse rounded-lg bg-white/10 sm:h-14 md:h-16" />
            <div className="mb-8 h-5 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="flex flex-wrap gap-4">
              <div className="h-14 w-44 animate-pulse rounded-xl bg-defabs-accent/40" />
              <div className="h-14 w-44 animate-pulse rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Empty / error state (feature #12) ---------- */
  if (slides.length === 0) {
    return (
      <section
        aria-label="Featured highlights"
        className="relative flex h-[85vh] min-h-[600px] max-h-[900px] items-center overflow-hidden bg-gradient-to-br from-defabs-dark via-defabs-primary to-defabs-dark"
      >
        <div className="absolute inset-0 ent-grid-bg opacity-40" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            {loadFailed ? (
              <p className="text-lg text-white/70">
                Featured content is temporarily unavailable — please check back shortly.
              </p>
            ) : (
              <div className="flex items-center gap-4 text-white/60">
                <ImageOff className="h-8 w-8 shrink-0 text-defabs-accent" aria-hidden="true" />
                <p className="text-lg">No featured content has been published yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  const activeSlide = slides[activeIndex];
  const total = slides.length;

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      className="group relative h-[85vh] min-h-[600px] max-h-[900px] touch-pan-y select-none overflow-hidden bg-defabs-dark text-white md:cursor-grab md:active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {/* Background layer — the parallax wrapper translates on scroll (feature
          #6); each slide cross-fades inside it (feature #1). */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          // Only resolve when a URL actually exists — resolveAssetUrl falls
          // back to the site logo, which would hardcode content the DB never
          // provided. Slides without an image use the gradient branch below.
          const image = slide.image_url ? resolveAssetUrl(slide.image_url) : null;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity ease-in-out ${
                isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
              style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
            >
              {/* KEN BURNS (feature #5): only the active slide animates, so the
                  slow zoom + pan restarts on every change; even/odd slides play
                  it in mirrored directions for subtle variety. */}
              {image ? (
                <div
                  className={`absolute inset-0 bg-cover bg-center will-change-transform ${
                    isActive
                      ? index % 2 === 0
                        ? 'hero-kenburns'
                        : 'hero-kenburns-alt'
                      : ''
                  }`}
                  style={{ backgroundImage: `url(${image})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-defabs-primary via-defabs-dark to-defabs-primary" />
              )}
            </div>
          );
        })}
      </div>

      {/* DARK GRADIENT OVERLAY (feature #8): layered — a strong left-to-right
          wash for the left-aligned text plus a bottom scrim for the controls. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-defabs-dark/95 via-defabs-dark/70 to-defabs-dark/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-defabs-dark/80 via-transparent to-defabs-dark/30" />
      </div>

      {/* Slide content — remounted per active slide (key) so the fade +
          upward entrance replays on every change (feature #10); each child
          carries a staggered animation-delay. */}
      <div className="container-custom relative z-30 flex h-full items-center">
        <div key={activeSlide.id} className="max-w-3xl py-20">
          {activeSlide.badge_text && (
            <span className="hero-text-in inline-block rounded-full border border-defabs-accent/50 bg-defabs-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-defabs-accent backdrop-blur-sm">
              {activeSlide.badge_text}
            </span>
          )}

          <h1
            className="hero-text-in mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: '90ms' }}
          >
            {activeSlide.headline}
          </h1>

          {activeSlide.subtext && (
            <p
              className="hero-text-in mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg md:text-xl"
              style={{ animationDelay: '180ms' }}
            >
              {activeSlide.subtext}
            </p>
          )}

          <div
            className="hero-text-in mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '270ms' }}
          >
            <SlideCTA
              text={activeSlide.cta_primary_text}
              link={activeSlide.cta_primary_link}
              variant="primary"
            />
            <SlideCTA
              text={activeSlide.cta_secondary_text}
              link={activeSlide.cta_secondary_link}
              variant="secondary"
            />
          </div>
        </div>
      </div>

      {/* Prev / next arrows (feature #9) — appear on hover on desktop and are
          hidden on touch devices where swiping is the natural gesture. */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => handleManualNavigation(prev)}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-full border border-white/25 bg-defabs-dark/40 p-3 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-defabs-dark/60 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:block md:group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleManualNavigation(next)}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-full border border-white/25 bg-defabs-dark/40 p-3 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-defabs-dark/60 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:block md:group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Bottom control bar: thin accent progress bar just above the dots
          (feature #3), zero-padded counter bottom-left (feature #7) and
          pagination dots bottom-right (feature #9). */}
      {total > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-40">
          <div className="container-custom pb-5">
            {/* PROGRESS BAR (feature #3): thin accent track positioned just
                above the dots and counter. The autoplay timeline scales it on
                the X axis — a compositor-only transform, no layout thrash. */}
            <div
              className="mb-4 h-[3px] w-full overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-label="Slide progress"
            >
              <div
                ref={progressRef}
                className="h-full w-full origin-left bg-defabs-accent will-change-transform"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>

            <div className="flex items-end justify-between gap-6">
              {/* Counter, e.g. "01 / 05" */}
              <p
                className="font-display text-xs font-semibold tracking-[0.3em] text-white/80 sm:text-sm"
                aria-live="polite"
                aria-label={`Slide ${activeIndex + 1} of ${total}`}
              >
                {pad2(activeIndex + 1)}
                <span className="mx-1.5 text-white/40">/</span>
                <span className="text-white/50">{pad2(total)}</span>
              </p>

              {/* Dots */}
              <div className="flex items-center gap-2.5">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === activeIndex}
                    onClick={() => handleManualNavigation(() => goToSlide(index))}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'w-8 bg-defabs-accent'
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
