
import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whatsappLink = "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20assistance%20today";

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-fablinks-blue-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Fablinks Online Café</h1>
              <p className="text-xs text-gray-500 -mt-1">Your Digital Gateway</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary transition-colors font-medium">Home</a>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors font-medium">Services</a>
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors font-medium">About</a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors font-medium">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call Us
            </Button>
            <Button 
              className="btn-whatsapp"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              <MessageCircle className="w-4 h-4" />
              Chat Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-primary transition-colors font-medium">Home</a>
              <a href="#services" className="text-gray-700 hover:text-primary transition-colors font-medium">Services</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors font-medium">Contact</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  +234 706 812 2861
                </Button>
                <Button 
                  className="btn-whatsapp w-full justify-center"
                  onClick={() => window.open(whatsappLink, '_blank')}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
