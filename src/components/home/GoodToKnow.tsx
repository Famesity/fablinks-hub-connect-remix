import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Clock,
  FileText,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Newspaper,
  Phone,
  Search,
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const quickLinks = [
  { label: 'Our story', to: '/about', icon: HeartHandshake },
  { label: 'Request a service', to: '/request', icon: FileText },
  { label: 'All articles', to: '/blog', icon: Newspaper },
  { label: 'Search the site', to: '/search', icon: Search },
];

/**
 * "Other information" block — the essentials visitors look for:
 * opening hours, how to find us and how to reach us.
 */
const GoodToKnow = () => {
  const { getSetting } = useSiteSettings();

  const hours = getSetting('opening_hours', 'Monday – Saturday · 8:00 AM – 6:00 PM');
  const address = getSetting(
    'contact_address',
    'Shop NO 35, Student Affairs, Abia State University Uturu, Abia State, Nigeria'
  );
  const phone = getSetting('contact_phone', '+234 706 812 2861');
  const email = getSetting('contact_email', 'hello@defabsmedia.com');
  const whatsapp = getSetting('whatsapp_number', '2348106411463');
  const siteTitle = getSetting('site_title', 'Defabs Media');

  const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  const whatsappLink = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${siteTitle}, I need assistance.`
  )}`;

  const cardBase =
    'flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ent-gold/60 hover:shadow-lg';
  const tile = 'mb-5 inline-flex rounded-xl bg-ent-ink p-3 text-ent-gold';

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold-deep">
            Other information
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold md:text-4xl">
            Good to know before you come
          </h2>
          <p className="mt-4 text-muted-foreground">
            The essentials — when we're open, where to find us and the fastest way to reach the
            team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Opening hours */}
          <div className={cardBase}>
            <span className={tile}>
              <Clock className="h-6 w-6" />
            </span>
            <h3 className="font-display text-lg font-bold">Opening hours</h3>
            <p className="mt-2 text-lg font-semibold text-primary">{hours}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Walk-ins welcome — message us ahead of time for priority pickup.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center pt-5 text-sm font-semibold text-primary transition-colors hover:text-ent-gold-deep"
            >
              Check before you come
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          {/* Find us */}
          <div className={cardBase}>
            <span className={tile}>
              <MapPin className="h-6 w-6" />
            </span>
            <h3 className="font-display text-lg font-bold">Find us</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{address}</p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-5"
            >
              <Button
                variant="outline"
                className="w-full border-ent-ink text-ent-ink hover:bg-ent-ink hover:text-ent-gold"
              >
                Get directions
              </Button>
            </a>
          </div>

          {/* Talk to us */}
          <div className={cardBase}>
            <span className={tile}>
              <MessageCircle className="h-6 w-6" />
            </span>
            <h3 className="font-display text-lg font-bold">Talk to us</h3>
            <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                {email}
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-5"
            >
              <Button className="btn-whatsapp w-full justify-center">Chat on WhatsApp</Button>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center justify-between rounded-xl border border-border bg-background px-5 py-4 transition-all duration-300 hover:border-ent-gold/60 hover:shadow-md"
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Icon className="h-4 w-4 text-primary transition-colors group-hover:text-ent-gold-deep" />
                  {link.label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-ent-gold-deep" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GoodToKnow;
