import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import FeaturedServices from '@/components/FeaturedServices';
import WhyChooseUs from '@/components/WhyChooseUs';
import BlogPostsSlider from '@/components/BlogPostsSlider';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedServices />
      <WhyChooseUs />
      <BlogPostsSlider />
      <ContactSection />
    </Layout>
  );
};

export default Index;
