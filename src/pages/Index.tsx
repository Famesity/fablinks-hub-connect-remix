
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedServices from '@/components/FeaturedServices';
import WhyChooseUs from '@/components/WhyChooseUs';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedServices />
      <WhyChooseUs />
      <ContactSection />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
