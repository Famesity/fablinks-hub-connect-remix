import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, CheckCircle2, MonitorPlay, Newspaper, Sparkles } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface LineUpItem {
  tag: string;
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  hash?: string;
}

const lineUp: LineUpItem[] = [
  {
    tag: 'Now showing',
    title: 'Blog highlights & recaps',
    text: 'Stories, guides and event round-ups straight from the Fablinks floor.',
    icon: Newspaper,
    link: '/blog',
  },
  {
    tag: 'This week',
    title: "What's on at the hub",
    text: 'Tournaments, watch parties and campus meet-ups worth showing up for.',
    icon: CalendarDays,
    hash: '#whats-on',
  },
  {
    tag: 'Always open',
    title: 'Digital services on tap',
    text: 'Registrations, printing, design and more — started in one WhatsApp message.',
    icon: MonitorPlay,
    link: '/services',
  },
];

const EntertainmentHero = () => {
  const { getSetting } = useSiteSettings();
  const siteTitle = getSetting('site_title', 'Fablinks Computers');

  return (
    <section className="relative overflow-hidden bg-ent-ink text-white">
      {/* Stage backdrop */}
      <div className="absolute inset-0 ent-grid-bg opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-ent-ink to-ent-stage" />
      <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-ent-gold opacity-20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary opacity-20 blur-3xl" />
      {/* Spotlight beams */}
      <div className="absolute -top-24 left-1/3 h-[140%] w-40 -rotate-12 bg-gradient-to-b from-ent-gold/15 via-ent-gold/5 to-transparent blur-2xl" />
      <div className="absolute -top-32 right-1/4 h-[130%] w-28 rotate-12 bg-gradient-to-b from-primary/25 to-transparent blur-2xl" />

      <div className="container-custom relative z-10 grid gap-12 pt-14 pb-16 md:pt-20 md:pb-24 lg:grid-cols-12 lg:gap-10">
        {/* Headline column */}
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-ent-gold/40 bg-ent-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ent-gold">
            <Sparkles className="h-3.5 w-3.5" />
            {siteTitle} · Entertainment Hub
          </span>

          <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Every highlight on campus,{' '}
            <span className="gradient-gold">in one place</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Events worth showing up for, stories worth reading, and the digital services you
            already count on — registrations, printing, design and more — all under one roof.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="h-auto bg-ent-gold px-7 py-3.5 font-semibold text-ent-ink shadow-lg shadow-ent-gold/20 hover:bg-ent-gold-deep"
              onClick={() =>
                document.getElementById('whats-on')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              See what's on
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="h-auto border-white/25 bg-white/5 px-7 py-3.5 font-semibold text-white hover:border-white/50 hover:bg-white/10"
              >
                Browse services
              </Button>
            </Link>

            <Link
              to="/experience"
              className="text-sm font-semibold text-white/70 underline-offset-4 transition-colors hover:text-ent-gold hover:underline"
            >
              The full Fablinks experience →
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
            {['Open Monday – Saturday', 'Same-day turnaround', 'WhatsApp support'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ent-gold" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Line-up poster cards */}
        <div className="flex flex-col justify-center gap-4 lg:col-span-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            The line-up
          </p>
          {lineUp.map((item) => {
            const Icon = item.icon;
            const body = (
              <div className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-ent-gold/50 hover:bg-white/10">
                <div className="rounded-xl bg-ent-gold/15 p-3 text-ent-gold transition-colors duration-300 group-hover:bg-ent-gold group-hover:text-ent-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ent-gold">
                    {item.tag}
                  </p>
                  <h3 className="font-display mt-1 text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{item.text}</p>
                  <span className="mt-2 inline-flex items-center text-xs font-semibold text-white/80 transition-colors group-hover:text-ent-gold">
                    Explore
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );

            return item.hash ? (
              <a key={item.title} href={item.hash}>
                {body}
              </a>
            ) : (
              <Link key={item.title} to={item.link || '/'}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ent-gold/60 to-transparent" />
    </section>
  );
};

export default EntertainmentHero;
