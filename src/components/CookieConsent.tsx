import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { getSetting } = useSiteSettings();
  
  const isEnabled = getSetting('cookie_consent_enabled', 'true') === 'true';
  const message = getSetting('cookie_consent_message', 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.');
  const policyLink = getSetting('cookie_policy_link', '/page/privacy-policy');

  useEffect(() => {
    if (!isEnabled) return;
    
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Delay showing the banner slightly for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, [isEnabled]);

  const handleAccept = async () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);

    // Log consent (optional - for compliance records)
    const visitorId = localStorage.getItem('visitor_id') || crypto.randomUUID();
    localStorage.setItem('visitor_id', visitorId);
    
    try {
      await supabase.from('cookie_consent_logs').insert({
        visitor_id: visitorId,
        consent_given: true,
      });
    } catch (error) {
      console.error('Failed to log consent:', error);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner || !isEnabled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-lg">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {message}{' '}
            <Link to={policyLink} className="text-primary underline hover:no-underline">
              Learn more
            </Link>
          </p>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleDecline}>
              Decline
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
