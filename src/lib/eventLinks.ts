/**
 * Shared WhatsApp / registration link builders for event cards on the
 * landing page, the full line-up on /experience and the /events/:id
 * detail page — one source of truth for the CTA destination precedence.
 */

export interface EventLinkContext {
  /** Site title used in the prefilled message (site_settings `site_title`). */
  siteTitle: string;
  /** Site-wide WhatsApp number used for the "Reserve a spot" fallback. */
  whatsapp: string;
}

export interface EventLinkTargets {
  title: string;
  time?: string | null;
  /** Admin-provided registration URL (optional). */
  registrationUrl?: string | null;
  /** Admin-provided WhatsApp number for this event (optional). */
  whatsappNumber?: string | null;
}

export interface RegisterLink {
  href: string;
  label: string;
  external: boolean;
}

/** Site-wide fallback — the classic "Reserve a spot" WhatsApp deep link. */
export const buildReserveLink = (eventTitle: string, ctx: EventLinkContext): string =>
  `https://wa.me/${ctx.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${ctx.siteTitle}, I'd like to reserve a spot for "${eventTitle}".`
  )}`;

/**
 * Where an event's CTA goes — precedence:
 * 1. Admin-provided registration URL, opened as-is (normalized to https).
 * 2. Event-specific WhatsApp number → wa.me deep link with a prefilled
 *    registration message about this event, exactly like the services page.
 * 3. Site-wide WhatsApp fallback (the classic "Reserve a spot").
 */
export const buildRegisterLink = (
  event: EventLinkTargets,
  ctx: EventLinkContext
): RegisterLink => {
  const message = encodeURIComponent(
    `Hello ${ctx.siteTitle}, I'd like to register for "${event.title}"${
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
  return {
    href: buildReserveLink(event.title, ctx),
    label: 'Reserve a spot',
    external: true,
  };
};
