
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';
import TestimonialForm from '@/components/TestimonialForm';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import SEOHead from '@/components/SEOHead';

const Contact = () => {
  const { getSetting } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const contactEmail = getSetting('contact_email', 'hello@defabsmedia.com');
  const contactPhone = getSetting('contact_phone', '+234 706 812 2861');
  const contactAddress = getSetting('contact_address', 'Shop NO 35, Student Affairs, Abia State University Uturu, Abia State, Nigeria');
  const whatsappNumber = getSetting('contact_whatsapp', '2347068122861');
  const socialFacebook = getSetting('social_facebook', '');
  const socialInstagram = getSetting('social_instagram', '');
  const socialTwitter = getSetting('social_twitter', '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );
    window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <SEOHead 
        title="Contact Us"
        description="Get in touch with Defabs Media. Visit us at Abia State University or contact us via WhatsApp, phone, or email for fast assistance with all your computer service needs."
        keywords="contact Defabs Media, WhatsApp support, Abia State University, computer cafe contact, customer support Nigeria"
      />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-defabs-dark text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl">Get in touch with our team for quick assistance</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      value={formData.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-8">
                  {/* WhatsApp */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500 p-3 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">WhatsApp (Preferred)</h3>
                      <p className="text-gray-600 mb-2">{contactPhone}</p>
                      <Button 
                        className="btn-whatsapp"
                        onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=Hello%20Defabs Media%20Online%20Café,%20I%20need%20assistance%20today`, '_blank')}
                      >
                        Chat Now
                      </Button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-gray-600">{contactPhone}</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-500 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-gray-600">{contactEmail}</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-500 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Location</h3>
                      <p className="text-gray-600">{contactAddress}</p>
                      <p className="text-sm text-gray-500">Serving students nationwide</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialFacebook && (
                      <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition-colors">
                        <Facebook className="w-6 h-6 text-white" />
                      </a>
                    )}
                    {socialInstagram && (
                      <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="bg-pink-500 p-3 rounded-lg hover:bg-pink-600 transition-colors">
                        <Instagram className="w-6 h-6 text-white" />
                      </a>
                    )}
                    {socialTwitter && (
                      <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="bg-blue-400 p-3 rounded-lg hover:bg-blue-500 transition-colors">
                        <Twitter className="w-6 h-6 text-white" />
                      </a>
                    )}
                    <a 
                      href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 p-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-6 h-6 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Form Section */}
        <section className="section-padding bg-muted/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have you used our services? We'd love to hear your feedback! Submit a review and help others make informed decisions.
              </p>
            </div>
            <TestimonialForm />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Contact;
