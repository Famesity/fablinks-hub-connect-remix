import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import * as LucideIcons from 'lucide-react';
import { LucideIcon, GraduationCap, FileText, Users, Smartphone, CreditCard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FeaturedService {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  color_class: string;
  whatsapp_message: string;
  display_order: number;
}

// Fallback services if database is empty
const defaultServices = [
  {
    icon: GraduationCap,
    title: "WAEC & NECO Results",
    description: "Get your exam results instantly with scratch cards and verification pins",
    whatsappMessage: "Hello Fablinks Online Café, I would like to buy a WAEC Scratch Card.",
    color: "bg-blue-500"
  },
  {
    icon: FileText,
    title: "JAMB Services",
    description: "Registration, result printing, admission letters and profile management",
    whatsappMessage: "Hello Fablinks Online Café, I need help with JAMB Original Result Printing.",
    color: "bg-green-500"
  },
  {
    icon: Users,
    title: "NYSC Registration", 
    description: "Complete NYSC services including registration and call-up letters",
    whatsappMessage: "Hello Fablinks Online Café, I need help with NYSC Registration.",
    color: "bg-purple-500"
  },
  {
    icon: Smartphone,
    title: "Airtime & Data",
    description: "Quick top-ups for all networks with instant delivery",
    whatsappMessage: "Hello Fablinks Online Café, I want to buy Airtime.",
    color: "bg-orange-500"
  },
  {
    icon: CreditCard,
    title: "Bill Payments",
    description: "Pay electricity, water, cable TV and internet bills easily",
    whatsappMessage: "Hello Fablinks Online Café, I want to pay my Electricity Bill.",
    color: "bg-red-500"
  },
  {
    icon: Globe,
    title: "Academic Projects",
    description: "Professional project writing, assignments and research support",
    whatsappMessage: "Hello Fablinks Online Café, I need help with Project Writing.",
    color: "bg-indigo-500"
  }
];

const FeaturedServices = () => {
  const [services, setServices] = useState<FeaturedService[]>([]);
  const [loading, setLoading] = useState(true);
  const { getSetting } = useSiteSettings();
  
  const whatsapp = getSetting('whatsapp_number', '2348106411463');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching featured services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string): LucideIcon => {
    return (LucideIcons as any)[iconName] || LucideIcons.Star;
  };

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsapp}?text=${encodedMessage}`, '_blank');
  };

  // Use database services if available, otherwise fallback to defaults
  const hasDbServices = services.length > 0;

  return (
    <section id="services" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for your academic journey and daily digital needs, 
            all available through instant WhatsApp chat.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-muted rounded-lg mr-4"></div>
                  <div className="h-6 bg-muted rounded w-32"></div>
                </div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-6"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : hasDbServices ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = getIconComponent(service.icon_name);
              return (
                <div key={service.id} className="service-card group">
                  <div className="flex items-center mb-4">
                    <div className={`${service.color_class} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Button 
                    className="w-full btn-whatsapp justify-center"
                    onClick={() => openWhatsApp(service.whatsapp_message)}
                  >
                    Get Started
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="service-card group">
                  <div className="flex items-center mb-4">
                    <div className={`${service.color} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Button 
                    className="w-full btn-whatsapp justify-center"
                    onClick={() => openWhatsApp(service.whatsappMessage)}
                  >
                    Get Started
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/services">
            <Button 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg"
            >
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
