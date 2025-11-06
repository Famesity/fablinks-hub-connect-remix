
import React from 'react';
import { MessageCircle, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Footer = () => {
  const { getSetting } = useSiteSettings();
  
  const whatsappLink = `https://wa.me/${getSetting('contact_whatsapp', '2347068122861').replace(/\+/g, '')}`;
  const siteTitle = getSetting('site_title', 'EduPoint Services');
  const siteLogo = getSetting('site_logo', '');
  const footerText = getSetting('footer_text', '© 2024 EduPoint Services. All rights reserved.');
  const footerDescription = getSetting('footer_description', 'Your trusted partner in educational services');
  const contactEmail = getSetting('contact_email', 'info@edupointservices.com');
  const contactPhone = getSetting('contact_phone', '+234 XXX XXX XXXX');
  const socialFacebook = getSetting('social_facebook', '');
  const socialTwitter = getSetting('social_twitter', '');
  const socialInstagram = getSetting('social_instagram', '');
  const socialLinkedin = getSetting('social_linkedin', '');

  const services = [
    "WAEC Scratch Cards",
    "JAMB Services", 
    "NYSC Registration",
    "Bill Payments",
    "Academic Projects",
    "University Portals"
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <footer className="bg-fablinks-gray text-white">
      {/* Main Footer */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                {siteLogo ? (
                  <img src={siteLogo} alt={siteTitle} className="h-10 w-auto object-contain" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-fablinks-blue-dark rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{siteTitle.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{siteTitle}</h3>
                      <p className="text-sm text-gray-400">{getSetting('site_description', 'Your Digital Gateway')}</p>
                    </div>
                  </>
                )}
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                {footerDescription}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{contactPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-green-400 hover:text-green-300"
                    onClick={() => window.open(whatsappLink, '_blank')}
                  >
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Popular Services</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <span className="text-gray-300 text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links & CTA */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Follow us:</span>
                <div className="flex gap-3">
                  {socialFacebook && (
                    <Button size="icon" variant="ghost" className="hover:bg-blue-600" onClick={() => window.open(socialFacebook, '_blank')}>
                      <Facebook className="w-5 h-5" />
                    </Button>
                  )}
                  {socialInstagram && (
                    <Button size="icon" variant="ghost" className="hover:bg-pink-600" onClick={() => window.open(socialInstagram, '_blank')}>
                      <Instagram className="w-5 h-5" />
                    </Button>
                  )}
                  {socialTwitter && (
                    <Button size="icon" variant="ghost" className="hover:bg-blue-400" onClick={() => window.open(socialTwitter, '_blank')}>
                      <Twitter className="w-5 h-5" />
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="hover:bg-green-600"
                    onClick={() => window.open(whatsappLink, '_blank')}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Button 
                className="btn-whatsapp"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                <MessageCircle className="w-4 h-4" />
                Need Help? Chat Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>{footerText}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
