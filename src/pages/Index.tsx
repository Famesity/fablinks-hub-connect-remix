import React from 'react';
import Layout from '@/components/Layout';
import HeroCarousel from '@/components/HeroCarousel';
import InfoTicker from '@/components/home/InfoTicker';
import TrustStrip from '@/components/TrustStrip';
import EventsHighlights from '@/components/home/EventsHighlights';
import EventHighlightsCarousel from '@/components/home/EventHighlightsCarousel';
import FeaturedBlogPosts from '@/components/FeaturedBlogPosts';
import FeaturedServices from '@/components/FeaturedServices';
import GoodToKnow from '@/components/home/GoodToKnow';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import CTASection from '@/components/CTASection';
import SEOHead from '@/components/SEOHead';
import Reveal from '@/components/Reveal';

const Index = () => {
  return (
    <Layout>
      <SEOHead
        description="Defabs Media is the entertainment hub for live events, premium content and professional digital services — printing, graphic design, registrations and more, all under one roof in Nigeria."
        keywords="Defabs Media, entertainment hub, live events, watch parties, blog highlights, WAEC scratch card, JAMB registration, NECO result, printing services, graphics design, Nigeria"
      />

      {/* Brand hero carousel (Defabs Media) */}
      <HeroCarousel />

      {/* Other information band */}
      <InfoTicker />

      {/* Social proof */}
      <Reveal>
        <TrustStrip />
      </Reveal>

      {/* Events highlights */}
      <Reveal>
        <EventsHighlights />
      </Reveal>

      {/* Past event photo & video highlights */}
      <Reveal>
        <EventHighlightsCarousel />
      </Reveal>

      {/* Blog post highlights */}
      <Reveal>
        <FeaturedBlogPosts
          title="Fresh off the feed"
          subtitle="Stories, guides and highlights from the Defabs world — the reads you'll want to catch before everyone else"
        />
      </Reveal>

      {/* Services highlighted */}
      <Reveal>
        <FeaturedServices
          title="The"
          titleAccent="Line-up of Services"
          subtitle="From registrations and printing to graphics, design and project support — the digital services our community counts on, started in a single WhatsApp message."
        />
      </Reveal>

      {/* Other information */}
      <Reveal>
        <GoodToKnow />
      </Reveal>

      {/* Newsletter signup */}
      <Reveal>
        <NewsletterSignup />
      </Reveal>

      <Reveal>
        <CTASection />
      </Reveal>
    </Layout>
  );
};

export default Index;
