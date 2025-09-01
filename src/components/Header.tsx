
import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const whatsappLink = "https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20assistance%20today";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-fablinks-blue-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">Fablinks Online Café</h1>
              <p className="text-xs text-gray-500 -mt-1">Your Digital Gateway</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                isActive('/') ? 'text-primary' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                isActive('/services') ? 'text-primary' : ''
              }`}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                isActive('/about') ? 'text-primary' : ''
              }`}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                isActive('/blog') ? 'text-primary' : ''
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                isActive('/contact') ? 'text-primary' : ''
              }`}
            >
              Contact
            </Link>
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
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                  isActive('/') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                  isActive('/services') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/about" 
                className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                  isActive('/about') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/blog" 
                className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                  isActive('/blog') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                  isActive('/contact') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
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
