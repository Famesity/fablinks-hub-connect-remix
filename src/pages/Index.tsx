import React from 'react';
import Layout from '@/components/Layout';
import HeroCarousel from '@/components/HeroCarousel';
import TrustStrip from '@/components/TrustStrip';
import ServicesGrid from '@/components/ServicesGrid';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import LocationContact from '@/components/LocationContact';
import CTASection from '@/components/CTASection';
import FeaturedBlogPosts from '@/components/FeaturedBlogPosts';

const Index = () => {
  return (
    <Layout>
      <HeroCarousel />
      <TrustStrip />
      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />
      <FeaturedBlogPosts />
      <CTASection />
      <LocationContact />
    </Layout>
  );
};

export default Index;
