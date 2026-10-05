import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import TrustStrip from '@/components/TrustStrip';
import FeaturedServices from '@/components/FeaturedServices';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import LocationContact from '@/components/LocationContact';
import CTASection from '@/components/CTASection';
import FeaturedBlogPosts from '@/components/FeaturedBlogPosts';
import ContactSection from '@/components/ContactSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import SEOHead from '@/components/SEOHead';

/**
 * The full Defabs Media line-up — everything that used to live on the
 * landing page now has its own sub page, while the landing page
 * leads with highlights.
 */
const Experience = () => {
  return (
    <Layout>
      <SEOHead
        title="The Experience"
        description="Dig into the full Defabs Media line-up: our services, story, process, student reviews, location and the fastest ways to reach us."
        keywords="Defabs Media experience, cyber cafe Nigeria, WAEC JAMB NECO registration, printing services, passport photo, Abia State University"
      />

      {/* Intro banner */}
      <section className="relative overflow-hidden bg-ent-ink text-white">
        <div className="absolute inset-0 ent-grid-bg opacity-60" />
        <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-ent-gold opacity-20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ent-gold/60 to-transparent" />

        <div className="container-custom relative z-10 py-12 md:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-ent-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to highlights
          </Link>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-ent-gold">
            The full line-up
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            Everything Defabs Media, in one place
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/60">
            Explore the complete line-up — every service we offer, why students trust us, how it
            works, real reviews, and the fastest ways to reach the team.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link to="/services">
              <Button className="bg-ent-gold font-semibold text-ent-ink hover:bg-ent-gold-deep">
                Browse all services
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
              >
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <HeroCarousel />
      <TrustStrip />
      <FeaturedServices />
      <WhyChooseUs />
      <HowItWorks />
      <TestimonialsCarousel />
      <FeaturedBlogPosts />
      <CTASection />
      <LocationContact />
      <ContactSection />
    </Layout>
  );
};

export default Experience;
