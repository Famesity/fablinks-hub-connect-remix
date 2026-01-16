import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Megaphone, Save } from 'lucide-react';
import AdminBottomNav from '@/components/admin/AdminBottomNav';

interface AnnouncementData {
  id?: string;
  message: string;
  link_text: string;
  link_url: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
}

const AnnouncementBarAdmin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [announcement, setAnnouncement] = useState<AnnouncementData>({
    message: '',
    link_text: '',
    link_url: '',
    background_color: '#1A73E8',
    text_color: '#FFFFFF',
    is_active: false,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/auth');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setAnnouncement({
          id: data.id,
          message: data.message || '',
          link_text: data.link_text || '',
          link_url: data.link_url || '',
          background_color: data.background_color || '#1A73E8',
          text_color: data.text_color || '#FFFFFF',
          is_active: data.is_active ?? false,
        });
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
      toast.error('Failed to load announcement settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!announcement.message.trim()) {
      toast.error('Please enter an announcement message');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        message: announcement.message,
        link_text: announcement.link_text || null,
        link_url: announcement.link_url || null,
        background_color: announcement.background_color,
        text_color: announcement.text_color,
        is_active: announcement.is_active,
      };

      if (announcement.id) {
        const { error } = await supabase
          .from('announcement_bar')
          .update(payload)
          .eq('id', announcement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('announcement_bar')
          .insert(payload);
        if (error) throw error;
      }

      toast.success('Announcement saved successfully');
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container-custom py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Announcement Bar
              </h1>
              <p className="text-xs text-muted-foreground">Manage site-wide announcements</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </header>

      <main className="container-custom py-6 space-y-6">
        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>This is how your announcement will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="py-2 px-4 text-center text-sm rounded"
              style={{ 
                backgroundColor: announcement.background_color,
                color: announcement.text_color
              }}
            >
              <span>{announcement.message || 'Your announcement message here'}</span>
              {announcement.link_text && (
                <span className="ml-2 underline font-medium">{announcement.link_text}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Announcement Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Enable Announcement</Label>
                <p className="text-sm text-muted-foreground">Show announcement bar on site</p>
              </div>
              <Switch
                id="is_active"
                checked={announcement.is_active}
                onCheckedChange={(checked) => setAnnouncement(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Announcement Message *</Label>
              <Input
                id="message"
                value={announcement.message}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                placeholder="e.g., 🎉 Get 10% off your first service!"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link_text">Link Text (optional)</Label>
                <Input
                  id="link_text"
                  value={announcement.link_text}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, link_text: e.target.value }))}
                  placeholder="e.g., Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL (optional)</Label>
                <Input
                  id="link_url"
                  value={announcement.link_url}
                  onChange={(e) => setAnnouncement(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="e.g., /services"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="background_color">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background_color"
                    type="color"
                    value={announcement.background_color}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, background_color: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={announcement.background_color}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, background_color: e.target.value }))}
                    placeholder="#1A73E8"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_color">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text_color"
                    type="color"
                    value={announcement.text_color}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, text_color: e.target.value }))}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={announcement.text_color}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, text_color: e.target.value }))}
                    placeholder="#FFFFFF"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <AdminBottomNav />
    </div>
  );
};

export default AnnouncementBarAdmin;
