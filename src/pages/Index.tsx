import React from 'react';
import Layout from '@/components/Layout';
import HeroCarousel from '@/components/HeroCarousel';
import InfoTicker from '@/components/home/InfoTicker';
import TrustStrip from '@/components/TrustStrip';
import EventsHighlights from '@/components/home/EventsHighlights';
import FeaturedBlogPosts from '@/components/FeaturedBlogPosts';
import FeaturedServices from '@/components/FeaturedServices';
import GoodToKnow from '@/components/home/GoodToKnow';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import CTASection from '@/components/CTASection';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <Layout>
      <SEOHead
        description="Fablinks is the entertainment hub for campus life — event highlights, blog stories and everyday digital services like WAEC, JAMB and NECO registration, printing, passport photos and graphics design in Nigeria."
        keywords="entertainment hub, campus events, blog highlights, Fablinks, WAEC scratch card, JAMB registration, NECO result, printing services, graphics design, Nigeria, Abia State University"
      />

      {/* Brand hero carousel (Defabs Media) */}
      <HeroCarousel />

      {/* Other information band */}
      <InfoTicker />

      {/* Social proof */}
      <TrustStrip />

      {/* Events highlights */}
      <EventsHighlights />

      {/* Blog post highlights */}
      <FeaturedBlogPosts
        title="Fresh off the feed"
        subtitle="Stories, guides and recaps from campus life — the highlights you'll want to read before your friends do"
      />

      {/* Services highlighted */}
      <FeaturedServices
        title="The"
        titleAccent="Line-up of Services"
        subtitle="From exam registrations and printing to graphics, design and project support — the digital services students count on, started in a single WhatsApp message."
      />

      {/* Other information */}
      <GoodToKnow />

      {/* Newsletter signup */}
      <NewsletterSignup />

      <CTASection />
    </Layout>
  );
};

export default Index;
