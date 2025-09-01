
import React from 'react';
import { GraduationCap, FileText, Users, Smartphone, CreditCard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedServices = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "WAEC & NECO Results",
      description: "Get your exam results instantly with scratch cards and verification pins",
      whatsappLink: "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20would%20like%20to%20buy%20a%20WAEC%20Scratch%20Card.",
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      title: "JAMB Services",
      description: "Registration, result printing, admission letters and profile management",
      whatsappLink: "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20JAMB%20Original%20Result%20Printing.",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "NYSC Registration", 
      description: "Complete NYSC services including registration and call-up letters",
      whatsappLink: "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20NYSC%20Registration.",
      color: "bg-purple-500"
    },
    {
      icon: Smartphone,
      title: "Airtime & Data",
      description: "Quick top-ups for all networks with instant delivery",
      whatsappLink: "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20buy%20Airtime.",
      color: "bg-orange-500"
    },
    {
      icon: CreditCard,
      title: "Bill Payments",
      description: "Pay electricity, water, cable TV and internet bills easily",
      whatsappLink: "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20pay%20my%20Electricity%20Bill.",
      color: "bg-red-500"
    },
    {
      icon: Globe,
      title: "Academic Projects",
      description: "Professional project writing, assignments and research support",
      whatsappLink: "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20help%20with%20Project%20Writing.",
      color: "bg-indigo-500"
    }
  ];

  return (
    <section id="services" className="section-padding bg-fablinks-gray-light">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for your academic journey and daily digital needs, 
            all available through instant WhatsApp chat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="service-card group">
                <div className="flex items-center mb-4">
                  <div className={`${service.color} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Button 
                  className="w-full btn-whatsapp justify-center"
                  onClick={() => window.open(service.whatsappLink, '_blank')}
                >
                  Get Started
                </Button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg"
            onClick={() => window.open("https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20want%20to%20see%20all%20available%20services.", '_blank')}
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
