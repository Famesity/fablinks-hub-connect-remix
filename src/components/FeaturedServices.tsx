import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import * as LucideIcons from 'lucide-react';
import { LucideIcon, GraduationCap, FileText, Users, Smartphone, CreditCard, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | null;
}

// Default services if none in database
const defaultServices = [
  {
    icon: GraduationCap,
    title: "WAEC & NECO Results",
    description: "Get your exam results instantly with scratch cards and verification pins",
    color: "bg-blue-500"
  },
  {
    icon: FileText,
    title: "JAMB Services",
    description: "Registration, result printing, admission letters and profile management",
    color: "bg-green-500"
  },
  {
    icon: Users,
    title: "NYSC Registration", 
    description: "Complete NYSC services including registration and call-up letters",
    color: "bg-purple-500"
  },
  {
    icon: Smartphone,
    title: "Airtime & Data",
    description: "Quick top-ups for all networks with instant delivery",
    color: "bg-orange-500"
  },
  {
    icon: CreditCard,
    title: "Bill Payments",
    description: "Pay electricity, water, cable TV and internet bills easily",
    color: "bg-red-500"
  },
  {
    icon: Globe,
    title: "Academic Projects",
    description: "Professional project writing, assignments and research support",
    color: "bg-indigo-500"
  }
];

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { getSetting } = useSiteSettings();
  
  const whatsapp = getSetting('whatsapp_number', '2347068122861');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string): LucideIcon => {
    const categoryIcons: Record<string, LucideIcon> = {
      'education & exams': LucideIcons.GraduationCap,
      'jamb': LucideIcons.FileText,
      'nysc': LucideIcons.Users,
      'airtime': LucideIcons.Smartphone,
      'bills': LucideIcons.CreditCard,
      'projects': LucideIcons.Globe,
      'printing': LucideIcons.Printer,
      'design': LucideIcons.Palette,
    };
    return categoryIcons[category.toLowerCase()] || LucideIcons.Star;
  };

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      'education & exams': 'bg-blue-500',
      'jamb': 'bg-green-500',
      'nysc': 'bg-purple-500',
      'airtime': 'bg-orange-500',
      'bills': 'bg-red-500',
      'projects': 'bg-indigo-500',
      'printing': 'bg-teal-500',
      'design': 'bg-pink-500',
    };
    return categoryColors[category.toLowerCase()] || 'bg-primary';
  };

  const openWhatsApp = (serviceName: string) => {
    const message = encodeURIComponent(`Hello Fablinks, I'm interested in: ${serviceName}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  // Use default services if none found in database
  const displayServices = services.length > 0 ? services : null;

  return (
    <section id="services" className="section-padding bg-muted/20">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for your academic journey and daily digital needs, 
            all available through instant WhatsApp chat.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
        ) : displayServices ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayServices.map((service) => {
              const IconComponent = getCategoryIcon(service.category);
              const colorClass = getCategoryColor(service.category);
              return (
                <div key={service.id} className="service-card group">
                  <div className="flex items-center mb-4">
                    <div className={`${colorClass} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description || 'Professional service delivered with care and expertise.'}
                  </p>
                  <Button 
                    className="w-full btn-whatsapp justify-center"
                    onClick={() => openWhatsApp(service.name)}
                  >
                    Get Started
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                    onClick={() => openWhatsApp(service.title)}
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
