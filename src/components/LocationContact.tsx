import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const LocationContact = () => {
  const { getSetting } = useSiteSettings();
  
  const businessName = getSetting('site_title', 'Fablinks Computers');
  const address = getSetting('contact_address', 'Shop NO 35, Student Affairs, Abia State University Uturu, Abia State, Nigeria');
  const phone = getSetting('contact_phone', '');
  const email = getSetting('contact_email', '');
  const whatsapp = getSetting('whatsapp_number', '') || getSetting('contact_whatsapp', '2347068122861');
  const openingHours = getSetting('opening_hours', 'Mon-Sat: 8:00 AM - 8:00 PM');

  const contactItems = [
    { icon: MapPin, label: 'Address', value: address },
    { icon: Phone, label: 'Phone', value: phone },
    { icon: Mail, label: 'Email', value: email },
    { icon: Clock, label: 'Opening Hours', value: openingHours },
  ].filter(item => item.value);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find <span className="gradient-text">Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visit our center or reach out to us via phone or WhatsApp
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-6">{businessName}</h3>
            
            <div className="space-y-6">
              {contactItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {whatsapp && (
                <a 
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="btn-whatsapp w-full justify-center">
                    <MessageCircle className="w-5 h-5" />
                    Chat on WhatsApp
                  </Button>
                </a>
              )}
              
              {address && (
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white">
                    <MapPin className="w-5 h-5 mr-2" />
                    Get Directions
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Map Placeholder or Embed */}
          <div className="rounded-2xl overflow-hidden h-[300px] md:h-[400px] bg-muted/30 flex items-center justify-center border border-border">
            {address ? (
              <iframe
                title="Business Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Map location not configured</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationContact;
