import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Save, Megaphone } from 'lucide-react';
import AdminBottomNav from '@/components/admin/AdminBottomNav';

interface Announcement {
  id: string;
  message: string;
  link_text: string | null;
  link_url: string | null;
  background_color: string | null;
  text_color: string | null;
  is_active: boolean | null;
}

const AdminAnnouncement = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    message: '',
    link_text: '',
    link_url: '',
    background_color: '#1A73E8',
    text_color: '#FFFFFF',
    is_active: true,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/admin');
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
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setAnnouncement(data);
        setFormData({
          message: data.message,
          link_text: data.link_text || '',
          link_url: data.link_url || '',
          background_color: data.background_color || '#1A73E8',
          text_color: data.text_color || '#FFFFFF',
          is_active: data.is_active ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.message.trim()) {
      toast({ title: 'Error', description: 'Message is required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        message: formData.message,
        link_text: formData.link_text || null,
        link_url: formData.link_url || null,
        background_color: formData.background_color,
        text_color: formData.text_color,
        is_active: formData.is_active,
      };

      if (announcement) {
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

      toast({ title: 'Announcement saved!' });
      fetchAnnouncement();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast({ title: 'Error', description: 'Failed to save announcement', variant: 'destructive' });
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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Announcement Bar</h1>
        </div>

        {/* Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="py-2 px-4 text-center text-sm rounded-lg"
              style={{
                backgroundColor: formData.background_color,
                color: formData.text_color,
              }}
            >
              <span>{formData.message || 'Your announcement message here...'}</span>
              {formData.link_text && (
                <span className="ml-2 underline font-semibold">{formData.link_text}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Announcement</Label>
                <p className="text-sm text-muted-foreground">Show the announcement bar on your site</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Input
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="🎉 Welcome! Get 10% off your first service."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="link_text">Link Text (Optional)</Label>
                <Input
                  id="link_text"
                  value={formData.link_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_text: e.target.value }))}
                  placeholder="Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL (Optional)</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="/services"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bg_color">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="bg_color"
                    value={formData.background_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_color">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="text_color"
                    value={formData.text_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.text_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Announcement
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      <AdminBottomNav />
    </div>
  );
};

export default AdminAnnouncement;