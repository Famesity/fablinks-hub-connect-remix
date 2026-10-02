import React from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/**
 * Scrolling "other information" band — opening hours, where to find us,
 * and quick service reminders. Values come from site settings where possible.
 */
const InfoTicker = () => {
  const { getSetting } = useSiteSettings();

  const address = getSetting(
    'contact_address',
    'Shop NO 35, Student Affairs, Abia State University Uturu, Abia State, Nigeria'
  );
  const phone = getSetting('contact_phone', '+234 706 812 2861');
  const hours = getSetting('opening_hours', 'Monday – Saturday · 8:00 AM – 6:00 PM');

  const items = [
    hours,
    `Visit us · ${address}`,
    `Call ${phone}`,
    'WAEC & NECO tokens in minutes',
    'JAMB registration & result printing',
    'Graphics, flyers & passport photos',
    'Event tickets, posters & banners printed same day',
    'Fresh event recaps on the blog every week',
  ];

  const renderGroup = (groupIndex: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={groupIndex === 1}>
      {items.map((item, index) => (
        <span
          key={`${groupIndex}-${index}`}
          className="flex shrink-0 items-center whitespace-nowrap text-xs font-bold uppercase tracking-[0.15em]"
        >
          {item}
          <span className="mx-6 text-sm opacity-60">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y-2 border-ent-ink bg-ent-gold py-3 text-ent-ink">
      <div className="ent-marquee flex w-max">
        {renderGroup(0)}
        {renderGroup(1)}
      </div>
    </div>
  );
};

export default InfoTicker;
