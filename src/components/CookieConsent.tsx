import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    const visitorId = getVisitorId();
    
    try {
      await supabase.from('cookie_consent_logs').insert({
        visitor_id: visitorId,
        consent_given: true,
      });
    } catch (error) {
      console.error('Error logging consent:', error);
    }

    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };

  const getVisitorId = () => {
    let id = localStorage.getItem('visitor_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('visitor_id', id);
    }
    return id;
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-3xl mx-auto shadow-lg border-2">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">We value your privacy</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience and analyze site traffic. 
                By clicking "Accept", you consent to our use of cookies. Read our{' '}
                <Link to="/page/privacy-policy" className="text-primary underline hover:no-underline">
                  Privacy Policy
                </Link>{' '}
                for more information.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={handleDecline} className="flex-1 md:flex-initial">
                Decline
              </Button>
              <Button onClick={handleAccept} className="flex-1 md:flex-initial">
                Accept
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;