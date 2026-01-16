import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    // Generate visitor ID
    const visitorId = crypto.randomUUID();
    
    // Store consent locally
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('visitor_id', visitorId);

    // Log consent to database (optional, for compliance)
    try {
      await supabase.from('cookie_consent_logs').insert({
        visitor_id: visitorId,
        consent_given: true,
      });
    } catch (error) {
      console.error('Error logging consent:', error);
    }

    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Cookie Consent</h4>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience and analyze site traffic. 
                By clicking "Accept", you consent to our use of cookies. Read our{' '}
                <Link to="/page/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{' '}
                for more information.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleDecline}>
              Decline
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
