import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Announcement {
  id: string;
  message: string;
  link_text: string | null;
  link_url: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
}

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        // Check if user already dismissed this announcement
        const dismissedId = localStorage.getItem('dismissed_announcement');
        if (dismissedId !== data.id) {
          setAnnouncement(data);
        }
      }
    };

    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem('dismissed_announcement', announcement.id);
    }
    setDismissed(true);
  };

  if (!announcement || dismissed) return null;

  return (
    <div 
      className="relative py-2 px-4 text-center text-sm"
      style={{ 
        backgroundColor: announcement.background_color,
        color: announcement.text_color 
      }}
    >
      <div className="container-custom flex items-center justify-center gap-2">
        <span>{announcement.message}</span>
        {announcement.link_text && announcement.link_url && (
          <Link 
            to={announcement.link_url}
            className="underline font-medium hover:opacity-80"
          >
            {announcement.link_text}
          </Link>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
