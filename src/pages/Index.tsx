import React from 'react';
import Layout from '@/components/Layout';
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

const Index = () => {
  return (
    <Layout>
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

export default Index;
