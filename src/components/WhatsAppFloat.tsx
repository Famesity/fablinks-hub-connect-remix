
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const WhatsAppFloat = () => {
  const { getSetting } = useSiteSettings();
  const whatsappLink = `https://wa.me/${getSetting('contact_whatsapp', '2347068122861').replace(/\+/g, '')}?text=Hello,%20I%20need%20assistance`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us on WhatsApp
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
      </div>
    </a>
  );
};

export default WhatsAppFloat;
