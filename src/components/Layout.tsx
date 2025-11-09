import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showWhatsApp?: boolean;
}

export default function Layout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  showWhatsApp = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <main>{children}</main>
      {showFooter && <Footer />}
      {showWhatsApp && <WhatsAppFloat />}
    </div>
  );
}
