import React, { useState } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { resolveAssetUrl, defaultLogo } from '@/lib/assetResolver';
import SearchBar from '@/components/SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Safely get location with fallback for hot reload
  let location;
  try {
    location = useLocation();
  } catch (e) {
    // Fallback during hot reload when Router context is temporarily unavailable
    location = { pathname: '/' };
  }
  
  const { getSetting } = useSiteSettings();

  const whatsappLink = `https://wa.me/${getSetting('contact_whatsapp', '2347068122861').replace(/\+/g, '')}?text=Hello,%20I%20need%20assistance`;
  const siteTitle = getSetting('site_title', 'Fablinks Computers');
  const siteLogo = getSetting('site_logo', '');
  const contactPhone = getSetting('contact_phone', '+234 XXX XXX XXXX');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Use custom logo if set, otherwise use default logo
  const logoSrc = resolveAssetUrl(siteLogo, defaultLogo);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-1 sm:gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 shrink-0 min-w-0">
            <img 
              src={logoSrc} 
              alt={siteTitle} 
              className="h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm md:text-lg font-bold gradient-text leading-tight truncate">{siteTitle}</h1>
              <p className="text-[9px] sm:text-xs text-gray-500 -mt-0.5 hidden sm:block truncate">{getSetting('site_description', 'Your Digital Gateway')}</p>
            </div>
          </Link>

          {/* Mobile Search - Between logo and menu */}
          <div className="md:hidden w-24 shrink-0">
            <SearchBar isMobile />
          </div>

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
            <Link 
              to="/auth" 
              className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                isActive('/auth') ? 'text-primary' : ''
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Search and CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <SearchBar />
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
            className="md:hidden p-2 shrink-0"
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
              <Link 
                to="/auth" 
                className={`text-gray-700 hover:text-primary transition-colors font-medium ${
                  isActive('/auth') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  {contactPhone}
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
