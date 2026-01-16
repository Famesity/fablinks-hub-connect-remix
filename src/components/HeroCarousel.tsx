import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

// Import hero images
import heroComputerServices from '@/assets/hero-computer-services.jpg';
import heroPrintingServices from '@/assets/hero-printing-services.jpg';
import heroOnlineRegistrations from '@/assets/hero-online-registrations.jpg';
import heroGraphicsDesign from '@/assets/hero-graphics-design.jpg';

interface HeroSlide {
  id: string;
  headline: string;
  subtext: string | null;
  image_url: string | null;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  badge_text: string | null;
  display_order: number;
}

// Default fallback images based on slide position
const defaultImages = [
  heroComputerServices,
  heroPrintingServices,
  heroOnlineRegistrations,
  heroGraphicsDesign
];

const HeroCarousel = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  const isExternalLink = (link: string) => {
    return link?.startsWith('http') || link?.startsWith('https');
  };

  const renderCTAButton = (text: string | null, link: string | null, variant: 'primary' | 'secondary') => {
    if (!text || !link) return null;

    const buttonClasses = variant === 'primary' 
      ? "btn-whatsapp text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto"
      : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto";

    if (isExternalLink(link)) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className={buttonClasses}>
            {text}
          </Button>
        </a>
      );
    }

    return (
      <Link to={link}>
        <Button size="lg" className={buttonClasses}>
          {text}
        </Button>
      </Link>
    );
  };

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-white min-h-[80vh] flex items-center">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mb-8"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-white/20 rounded w-40"></div>
              <div className="h-12 bg-white/20 rounded w-40"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-white min-h-[80vh] flex items-center">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Fablinks Computers</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">Your trusted partner for all computer services</p>
        </div>
      </section>
    );
  }

  const slide = slides[currentSlide];
  const slideImage = slide.image_url || defaultImages[currentSlide % defaultImages.length];

  return (
    <section 
      className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-white min-h-[80vh] flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Overlay */}
      {slideImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${slideImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50"></div>
        </div>
      )}

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {slide.badge_text && (
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/30">
                {slide.badge_text}
              </span>
            )}
            
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight transition-all duration-500"
              key={`headline-${currentSlide}`}
            >
              {slide.headline}
            </h1>
            
            {slide.subtext && (
              <p 
                className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 transition-all duration-500"
                key={`subtext-${currentSlide}`}
              >
                {slide.subtext}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {renderCTAButton(slide.cta_primary_text, slide.cta_primary_link, 'primary')}
              {renderCTAButton(slide.cta_secondary_text, slide.cta_secondary_link, 'secondary')}
            </div>
          </div>

          {/* Image (Mobile shows on top, Desktop on right) */}
          {slideImage && (
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <img 
                  src={slideImage} 
                  alt={slide.headline}
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute -inset-4 bg-white/10 rounded-3xl -z-10 blur-xl"></div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {slides.length > 1 && (
          <>
            {/* Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-300 border border-white/30"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-300 border border-white/30"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-6 md:w-8' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
