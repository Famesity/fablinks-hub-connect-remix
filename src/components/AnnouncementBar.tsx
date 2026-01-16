import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  message: string;
  link_text: string | null;
  link_url: string | null;
  background_color: string | null;
  text_color: string | null;
  is_active: boolean | null;
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
        .single();

      if (!error && data) {
        // Check if this announcement was dismissed in this session
        const dismissedId = sessionStorage.getItem('dismissed_announcement');
        if (dismissedId !== data.id) {
          setAnnouncement(data);
        }
      }
    };

    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      sessionStorage.setItem('dismissed_announcement', announcement.id);
    }
    setDismissed(true);
  };

  if (!announcement || dismissed) return null;

  return (
    <div 
      className="relative py-2 px-4 text-center text-sm"
      style={{ 
        backgroundColor: announcement.background_color || '#1A73E8',
        color: announcement.text_color || '#FFFFFF'
      }}
    >
      <div className="container-custom flex items-center justify-center gap-2">
        <span>{announcement.message}</span>
        {announcement.link_text && announcement.link_url && (
          <a 
            href={announcement.link_url}
            className="underline font-medium hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {announcement.link_text}
          </a>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
