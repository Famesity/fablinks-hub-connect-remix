import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { LucideIcon, Globe, Printer, FileText, Palette, Scan, Briefcase, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | null;
  whatsapp_message: string | null;
}

// Default services if none in database
const defaultServices = [
  { icon: Globe, title: 'Internet Browsing', description: 'Fast and reliable internet access for all your browsing needs', color: 'bg-blue-500' },
  { icon: Printer, title: 'Printing & Photocopy', description: 'High-quality printing, photocopying, and document services', color: 'bg-green-500' },
  { icon: FileText, title: 'Online Registrations', description: 'JAMB, NYSC, school portals, and all online form filling', color: 'bg-purple-500' },
  { icon: Palette, title: 'Graphics Design & Typing', description: 'Professional design, document formatting, and typing services', color: 'bg-orange-500' },
  { icon: Scan, title: 'Scanning & Lamination', description: 'Document scanning, lamination, and binding services', color: 'bg-red-500' },
  { icon: Briefcase, title: 'CV Writing & Job Applications', description: 'Professional CV writing and job application support', color: 'bg-indigo-500' },
];

const ServicesGrid = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { getSetting } = useSiteSettings();
  
  const whatsapp = getSetting('whatsapp_number', '2348106411463');

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
      'internet': Globe,
      'printing': Printer,
      'registration': FileText,
      'design': Palette,
      'scanning': Scan,
      'cv': Briefcase,
    };
    return categoryIcons[category.toLowerCase()] || Star;
  };

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      'internet': 'bg-blue-500',
      'printing': 'bg-green-500',
      'registration': 'bg-purple-500',
      'design': 'bg-orange-500',
      'scanning': 'bg-red-500',
      'cv': 'bg-indigo-500',
    };
    return categoryColors[category.toLowerCase()] || 'bg-primary';
  };

  const openWhatsApp = (serviceName: string, customMessage?: string | null) => {
    const message = customMessage 
      ? encodeURIComponent(customMessage)
      : encodeURIComponent(`Hello Defabs Media, I'm interested in: ${serviceName}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  // Use default services if none found in database
  const displayServices = services.length > 0 ? services : null;

  return (
    <section id="services" className="section-padding bg-muted/20">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional computer and internet services tailored for your needs
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
                    onClick={() => openWhatsApp(service.name, service.whatsapp_message)}
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

export default ServicesGrid;
