import React, { useEffect, useRef, useState } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface RevealProps {
  children: React.ReactNode;
  /** Optional extra classes for the wrapper (layout only, never animation). */
  className?: string;
}

const ANIMATION_STYLES = ['fade-up', 'fade-in', 'zoom-in', 'slide-right'];

/**
 * Scroll-reveal wrapper for page sections.
 *
 * The animation style and the on/off toggle come from `site_settings`
 * (`animations_style`, `animations_enabled`) so admins can change them any
 * time from Admin → Settings → Animations; changes apply on the next page
 * load. Disabled or unknown styles render plain, always-visible content —
 * wrapping/unwrapping or toggling can never hide a section, and
 * `prefers-reduced-motion` disables the animation at the CSS level.
 */
const Reveal = ({ children, className = '' }: RevealProps) => {
  const { getSetting } = useSiteSettings();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // No observer support — show content immediately, unanimated.
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      // Any visible pixel counts, so very tall sections always trigger.
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const enabled = getSetting('animations_enabled', 'on') !== 'off';
  const requestedStyle = getSetting('animations_style', 'fade-up');
  const style = ANIMATION_STYLES.includes(requestedStyle) ? requestedStyle : 'fade-up';

  const revealClass = enabled
    ? `reveal reveal-${style}${inView ? ' is-visible' : ''}`
    : '';

  return (
    <div ref={ref} className={`${className} ${revealClass}`.trim()}>
      {children}
    </div>
  );
};

export default Reveal;
