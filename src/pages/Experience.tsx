import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CalendarDays,
  Clapperboard,
  Gamepad2,
  GraduationCap,
  Laptop,
  Lightbulb,
  MonitorPlay,
  Printer,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import TrustStrip from '@/components/TrustStrip';
import EventsHighlights from '@/components/home/EventsHighlights';
import EventHighlightsCarousel from '@/components/home/EventHighlightsCarousel';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import FeaturedBlogPosts from '@/components/FeaturedBlogPosts';
import CTASection from '@/components/CTASection';
import LocationContact from '@/components/LocationContact';
import ContactSection from '@/components/ContactSection';
import SEOHead from '@/components/SEOHead';
import Reveal from '@/components/Reveal';

interface Pillar {
  tag: string;
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** The entertainment menu — what a night at the hub actually looks like. */
const pillars: Pillar[] = [
  {
    tag: 'Every weekend',
    title: 'Big-screen watch parties',
    text: 'Match day with the loudest crowd in town — live commentary, packed floor and halftime giveaways.',
    icon: MonitorPlay,
  },
  {
    tag: 'Monthly',
    title: 'Gaming tournaments',
    text: 'FIFA and eFootball knockout brackets on the big screen — winners take the bragging rights.',
    icon: Gamepad2,
  },
  {
    tag: 'On the reel',
    title: 'Screenings & premières',
    text: 'Campus film nights, drop parties and premiere viewings on the lounge screens.',
    icon: Clapperboard,
  },
  {
    tag: 'For creators',
    title: 'Content clinics & workshops',
    text: 'Bring your idea — we design, print and package it while you review the portfolio.',
    icon: Lightbulb,
  },
  {
    tag: 'Community',
    title: 'Open-mic & meet-ups',
    text: 'Musicians, comedians, bloggers and designers swapping sets, jokes and collabs.',
    icon: Users,
  },
  {
    tag: 'Any day',
    title: 'A lounge that hangs out',
    text: 'Pull up, plug in, charge up and stay for whatever the night turns into.',
    icon: CalendarDays,
  },
];

interface DeskItem {
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** The subtle nod to the computer-services side of the hub. */
const deskItems: DeskItem[] = [
  {
    title: 'Registrations & exams',
    text: 'WAEC, JAMB, NECO, NYSC and school-portal payments handled while you wait.',
    icon: GraduationCap,
  },
  {
    title: 'Printing & documents',
    text: 'Printing, photocopy, binding, lamination and passport photographs.',
    icon: Printer,
  },
  {
    title: 'Airtime, data & bills',
    text: 'Top-ups, cable TV and electricity payments without the queue.',
    icon: Smartphone,
  },
  {
    title: 'Training & quick fixes',
    text: 'Computer classes, software set-up, diagnostics and data recovery.',
    icon: Laptop,
  },
];

/**
 * The full Defabs Media entertainment experience — the complete line-up,
 * with the computer-services desk that keeps the floor running folded in.
 */
const Experience = () => {
  const scrollToLineUp = () => {
    document.getElementById('whats-on')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <SEOHead
        title="The Experience"
        description="The full Defabs Media entertainment experience — watch parties, gaming tournaments, screenings, creator meet-ups and the computer services desk that keeps the hub running, all in one place."
        keywords="Defabs Media experience, entertainment hub Nigeria, watch party, gaming tournament, campus events, cyber cafe Nigeria, WAEC JAMB NECO registration, printing services, Abia State University"
      />

      {/* Full-bleed entertainment hero */}
      <section className="relative overflow-hidden bg-ent-ink text-white">
        <div className="absolute inset-0 ent-grid-bg opacity-60" />
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-ent-gold opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-ent-stage opacity-60 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ent-gold/60 to-transparent" />

        <div className="container-custom relative z-10 pt-14 pb-16 md:pt-20 md:pb-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-ent-gold/40 bg-ent-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ent-gold">
            <Sparkles className="h-3.5 w-3.5" />
            The Defabs Media experience
          </span>

          <h1 className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Where the campus comes to <span className="gradient-gold">show up</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            Watch parties, tournaments, screenings, clinics and meet-ups — the complete
            entertainment line-up of the hub, with the computer-services desk quietly
            running in the background.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="bg-ent-gold font-semibold text-ent-ink hover:bg-ent-gold-deep"
              onClick={scrollToLineUp}
            >
              See what's on
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
              >
                Browse services
              </Button>
            </Link>
          </div>

          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {[
              { term: 'Live & loud', detail: 'Events every week' },
              { term: 'Big screen', detail: 'Watch parties & screenings' },
              { term: 'Hands-on', detail: 'Clinics & workshops' },
              { term: 'One roof', detail: 'Plus the digital desk' },
            ].map((fact) => (
              <div key={fact.term}>
                <dt className="font-display text-base font-bold text-ent-gold">{fact.term}</dt>
                <dd className="mt-1 text-sm text-white/50">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Social proof */}
      <Reveal>
        <TrustStrip />
      </Reveal>

      {/* The entertainment menu */}
      <Reveal>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold-ink">
              Inside the experience
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold text-ent-ink md:text-4xl">
              A full night out, <span className="gradient-gold-ink">every week</span>
            </h2>
            <p className="mt-4 leading-relaxed text-ent-ink/70">
              The hub is built for the hours after class — show up for the headline
              event, stay for everything happening around it.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className="group rounded-2xl border border-ent-ink/10 bg-ent-paper/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ent-gold/60 hover:shadow-lg hover:shadow-ent-gold/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-xl bg-ent-gold/25 p-3 text-ent-gold-ink transition-colors group-hover:bg-ent-gold group-hover:text-ent-ink">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ent-ink/40">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="font-display mt-5 text-xl font-bold text-ent-ink transition-colors group-hover:text-ent-gold-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ent-ink/60">{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Full events line-up (managed from Admin → Landing Page → Events) */}
      <Reveal>
        <EventsHighlights limit={8} />
      </Reveal>

      {/* Past event photo & video highlights */}
      <Reveal>
        <EventHighlightsCarousel
          eyebrow="Seen at the hub"
          title="Relive past events"
          subtitle="Photos and videos from watch parties, tournaments and clinics — swipe through the archive."
        />
      </Reveal>

      {/* Student reviews */}
      <Reveal>
        <TestimonialsCarousel />
      </Reveal>

      {/* Subtle computer-services band */}
      <Reveal>
      <section className="section-padding bg-ent-paper">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold-ink">
              Also at the hub
            </p>
            <h2 className="font-display mt-3 text-2xl font-extrabold leading-snug text-ent-ink md:text-3xl">
              The computer desk keeps the floor running
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ent-ink/70">
              Between the fun, get life done. Registrations, printing, top-ups and quick
              fixes are all handled at the next counter — no second trip across town.
            </p>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ent-gold-ink transition-colors hover:text-ent-amber"
            >
              Explore all computer services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {deskItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-ent-ink/10 bg-white/70 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-ent-gold/25 p-2 text-ent-gold-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-ent-ink">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ent-ink/60">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Process & trust */}
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <WhyChooseUs />
      </Reveal>

      {/* Recaps */}
      <Reveal>
        <FeaturedBlogPosts
          title="Recaps from the floor"
          subtitle="Stories, guides and event round-ups from the Defabs Media lounge — the reads you'll want before everyone else"
        />
      </Reveal>

      <Reveal>
        <CTASection />
      </Reveal>
      <Reveal>
        <LocationContact />
      </Reveal>
      <Reveal>
        <ContactSection />
      </Reveal>
    </Layout>
  );
};

export default Experience;
