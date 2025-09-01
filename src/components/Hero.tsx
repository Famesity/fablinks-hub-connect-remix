
import React from 'react';
import { MessageCircle, CheckCircle, Zap, Shield, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const Hero = () => {
  const whatsappLink = "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20assistance%20today";

  const studentImages = [
    {
      src: "/api/placeholder/600/400",
      alt: "African students studying together"
    },
    {
      src: "/api/placeholder/600/400", 
      alt: "Nigerian student using laptop"
    },
    {
      src: "/api/placeholder/600/400",
      alt: "Group of African university students"
    },
    {
      src: "/api/placeholder/600/400",
      alt: "Student checking exam results online"
    }
  ];

  return (
    <section id="home" className="hero-section section-padding min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="hero-title">
              All Your School, Exam & Digital Needs 
              <span className="block text-yellow-300">In One Click</span>
            </h1>
            <p className="hero-subtitle max-w-2xl mx-auto lg:mx-0">
              From WAEC results to JAMB registration, NYSC services to bill payments - 
              your trusted digital gateway for everything academic and beyond.
            </p>
            
            {/* Quick Highlights */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Affordable</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="btn-hero text-lg px-8 py-4"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat Now on WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View All Services
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className="mt-8 flex items-center gap-2 justify-center lg:justify-start">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="text-sm opacity-90">Trusted by 10,000+ Nigerian students</span>
            </div>
          </div>

          {/* Hero Visual with Sliding Images */}
          <div className="relative">
            {/* Student Images Carousel */}
            <div className="mb-6">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {studentImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative rounded-2xl overflow-hidden">
                        <img 
                          src={image.src} 
                          alt={image.alt}
                          className="w-full h-64 md:h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Service Highlights */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/20 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">WAEC Result ✓</p>
                    <p className="text-sm opacity-80">Instant verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/20 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">JAMB Services ✓</p>
                    <p className="text-sm opacity-80">Registration & results</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/20 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Bill Payments ✓</p>
                    <p className="text-sm opacity-80">Airtime, data & utilities</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-300 rounded-full opacity-80 float-animation"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/30 rounded-full pulse-slow"></div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl"></div>
    </section>
  );
};

export default Hero;
