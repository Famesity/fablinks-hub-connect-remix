
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { getSetting } = useSiteSettings();
  
  const heroTitle = getSetting('hero_title', 'Welcome to EduPoint Services');
  const heroSubtitle = getSetting('hero_subtitle', 'Your one-stop solution for all educational needs');
  const heroCtaText = getSetting('hero_cta_text', 'Get Started');
  const heroCtaLink = getSetting('hero_cta_link', '/services');
  const heroBackground = getSetting('hero_background_image', '');

  return (
    <section 
      className="relative bg-gradient-to-br from-primary via-fablinks-blue to-fablinks-blue-dark text-white min-h-screen flex items-center"
      style={heroBackground ? { backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {heroSubtitle}
          </p>
          
          {/* Quick Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { icon: CheckCircle, text: "Fast" },
              { icon: CheckCircle, text: "Reliable" }, 
              { icon: CheckCircle, text: "Affordable" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <item.icon className="w-5 h-5 text-fablinks-accent" />
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <Link to={heroCtaLink}>
            <Button 
              size="lg"
              className="btn-whatsapp text-lg px-8 py-4 h-auto"
            >
              {heroCtaText}
            </Button>
          </Link>
          
          <p className="mt-4 text-white/80">
            Trusted by students across Nigeria
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
