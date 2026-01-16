import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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
    const dismissedId = sessionStorage.getItem('announcement_dismissed');
    if (!dismissedId) {
      fetchAnnouncement();
    }
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setAnnouncement(data);
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  const handleDismiss = () => {
    if (announcement) {
      sessionStorage.setItem('announcement_dismissed', announcement.id);
    }
    setDismissed(true);
  };

  if (!announcement || dismissed) return null;

  const bgColor = announcement.background_color || '#1A73E8';
  const textColor = announcement.text_color || '#FFFFFF';

  return (
    <div
      className="relative py-2 px-4 text-center text-sm"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="container mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span>{announcement.message}</span>
        {announcement.link_text && announcement.link_url && (
          <Link
            to={announcement.link_url}
            className="underline font-semibold hover:opacity-80 transition-opacity"
          >
            {announcement.link_text}
          </Link>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-white/20"
        style={{ color: textColor }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AnnouncementBar;