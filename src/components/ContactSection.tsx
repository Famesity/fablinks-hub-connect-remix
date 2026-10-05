
import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const ContactSection = () => {
  const { getSetting } = useSiteSettings();
  
  const whatsappLink = `https://wa.me/${(getSetting('whatsapp_number', '') || getSetting('contact_whatsapp', '2347068122861')).replace(/\+/g, '')}`;
  const contactPhone = getSetting('contact_phone', '+234 706 812 2861');
  const contactEmail = getSetting('contact_email', 'hello@defabsmedia.com');
  const contactAddress = getSetting('contact_address', 'Shop NO 35, Student Affairs, Abia State University Uturu, Abia State, Nigeria');
  const openingHours = getSetting('opening_hours', 'Mon-Sat: 8:00 AM - 8:00 PM');

  return (
    <section id="contact" className="section-padding bg-slate-800/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to get started? Contact us through any of these channels and we'll 
            respond immediately to assist with your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">WhatsApp Chat</h3>
                    <p className="text-gray-600">Instant response guaranteed</p>
                    <Button 
                      className="mt-2 btn-whatsapp"
                      onClick={() => window.open(whatsappLink, '_blank')}
                    >
                      Start Chat Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone Call</h3>
                    <p className="text-gray-600">{contactPhone}</p>
                    <p className="text-sm text-gray-500">Available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Support</h3>
                    <p className="text-gray-600">{contactEmail}</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Operating Hours</h3>
                    <p className="text-gray-600">{openingHours}</p>
                    <p className="text-sm text-gray-500">Always here to help</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-defabs-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Join thousands of Nigerian students who trust Defabs Media 
                for their academic and digital service needs. Chat with us now and 
                experience the difference.
              </p>
              
              <div className="space-y-4">
                <Button 
                  className="w-full btn-whatsapp justify-center text-lg py-4"
                  onClick={() => window.open(whatsappLink, '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start WhatsApp Chat
                </Button>
                
                <div className="text-sm text-gray-500">
                  Or call us directly at <span className="font-semibold text-primary">{contactPhone}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">24/7</div>
                  <div className="text-xs text-gray-500">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">99.9%</div>
                  <div className="text-xs text-gray-500">Success</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-500">Instant</div>
                  <div className="text-xs text-gray-500">Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
