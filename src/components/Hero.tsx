
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-fablinks-blue to-fablinks-blue-dark text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            All your school, exam, and digital needs in 
            <span className="block text-fablinks-accent"> one click</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Your Digital Gateway, Anytime, Anywhere.
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
          <Button 
            size="lg"
            className="btn-whatsapp text-lg px-8 py-4 h-auto"
            onClick={() => window.open('https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20assistance%20today.', '_blank')}
          >
            Chat Now on WhatsApp
          </Button>
          
          <p className="mt-4 text-white/80">
            Trusted by students across Nigeria
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
