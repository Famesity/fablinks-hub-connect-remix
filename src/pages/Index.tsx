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
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <Layout>
      <SEOHead 
        description="Fablinks Computers - Your one-stop shop for WAEC, JAMB, NECO, NYSC registrations, printing services, passport photos, and all computer-assisted services in Nigeria. Fast, reliable, and affordable."
        keywords="Fablinks Computers, WAEC scratch card, JAMB registration, NECO result, NYSC registration, printing services, passport photo, computer cafe, Nigeria, Abia State University"
      />
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
