import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  Film,
  Image,
  Upload,
  Loader2,
  X,
  Clapperboard,
} from 'lucide-react';
import { toast } from 'sonner';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { ADMIN_PERMISSIONS } from '@/hooks/usePermissions';

interface HighlightRow {
  id: string;
  media_type: string;
  media_url: string;
  caption: string | null;
  display_order: number;
  is_active: boolean;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

/**
 * Admin → Landing page → Event highlights — manages the past-event
 * image/video carousel shown on the landing page and /experience
 * (max 8 slides, carousel on all devices).
 */
const AdminEventHighlights = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [items, setItems] = useState<HighlightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HighlightRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    media_type: 'image',
    media_url: '',
    caption: '',
    display_order: 0,
    is_active: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchItems();
    }
  }, [adminLoading, isAdmin]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('event_highlights')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching event highlights:', error);
      toast.error(
        'Could not load highlights. If this is a new setup, apply supabase/migrations/20261007150000_event_highlights.sql first.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: HighlightRow) => {
    if (item) {
      setEditing(item);
      setFormData({
        media_type: item.media_type || 'image',
        media_url: item.media_url || '',
        caption: item.caption || '',
        display_order: item.display_order,
        is_active: item.is_active,
      });
    } else {
      setEditing(null);
      setFormData({ ...emptyForm, display_order: items.length + 1 });
    }
    setIsDialogOpen(true);
  };

  const handleMediaUpload = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isImage && !isVideo) {
      toast.error('Please select an image or video file');
      return;
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      toast.error('Image must be 5 MB or smaller');
      return;
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      toast.error('Video must be 50 MB or smaller');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `highlights/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        media_url: data.publicUrl,
        media_type: isVideo ? 'video' : 'image',
      });
      toast.success('Media uploaded successfully');
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.media_url.trim()) {
      toast.error('Upload or paste a media URL first');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        media_type: formData.media_type,
        media_url: formData.media_url.trim(),
        caption: formData.caption.trim() || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (editing) {
        const { error } = await supabase
          .from('event_highlights')
          .update(payload)
          .eq('id', editing.id);
        if (error) throw error;
        toast.success('Highlight updated successfully');
      } else {
        const { error } = await supabase.from('event_highlights').insert([payload]);
        if (error) throw error;
        toast.success('Highlight created successfully');
      }

      setIsDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving highlight:', error);
      const message = (error as Error)?.message || '';
      if (/event_highlights|relation/i.test(message)) {
        toast.error(
          'The highlights table is not in the database yet — apply supabase/migrations/20261007150000_event_highlights.sql, then save again.'
        );
      } else {
        toast.error('Failed to save highlight');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this highlight?')) return;

    try {
      const { error } = await supabase.from('event_highlights').delete().eq('id', id);
      if (error) throw error;
      toast.success('Highlight deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting highlight:', error);
      toast.error('Failed to delete highlight');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('event_highlights')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
      toast.success(isActive ? 'Highlight published' : 'Highlight hidden');
      fetchItems();
    } catch (error) {
      console.error('Error updating highlight:', error);
      toast.error('Failed to update highlight');
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate('/auth');
    return null;
  }

  return (
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_EVENTS}>
      <div className="min-h-screen bg-muted/30 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/landing')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Event Highlights</h1>
                <p className="text-muted-foreground">
                  Photos & videos from past events — the carousel on the landing page and
                  /experience (max 8 shown)
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editing ? 'Edit Highlight' : 'Add New Highlight'}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label>Media type</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={formData.media_type === 'image' ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, media_type: 'image' })}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Image
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={formData.media_type === 'video' ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, media_type: 'video' })}
                      >
                        <Film className="h-4 w-4 mr-2" />
                        Video
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uploads switch this automatically — set it manually only when pasting a URL.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="highlight-media-upload">Media</Label>
                    <div className="flex items-start gap-4">
                      {formData.media_url ? (
                        <div className="relative shrink-0">
                          {formData.media_type === 'video' ? (
                            <div className="flex h-20 w-28 items-center justify-center rounded-lg border bg-muted">
                              <Film className="h-6 w-6 text-muted-foreground" />
                            </div>
                          ) : (
                            <img
                              src={formData.media_url}
                              alt="Highlight preview"
                              className="h-20 w-28 rounded-lg border object-cover"
                            />
                          )}
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-md"
                            onClick={() => setFormData({ ...formData, media_url: '' })}
                            disabled={uploading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                          <Clapperboard className="h-6 w-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1 space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading}
                          onClick={() =>
                            document.getElementById('highlight-media-upload')?.click()
                          }
                        >
                          {uploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="mr-2 h-4 w-4" />
                          )}
                          {uploading
                            ? 'Uploading…'
                            : formData.media_url
                              ? 'Replace media'
                              : 'Upload media'}
                        </Button>
                        <input
                          id="highlight-media-upload"
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMediaUpload(file);
                            e.target.value = '';
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Images up to 5 MB, videos up to 50 MB (JPG, PNG, WebP, MP4).
                        </p>
                      </div>
                    </div>

                    <Input
                      id="highlight-media-url"
                      value={formData.media_url}
                      onChange={(e) =>
                        setFormData({ ...formData, media_url: e.target.value })
                      }
                      placeholder="…or paste a media URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="highlight-caption">Caption</Label>
                    <Input
                      id="highlight-caption"
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      placeholder="e.g., Watch party finals night"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional — shown over the bottom of the slide.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="highlight-order">Display Order</Label>
                      <Input
                        id="highlight-order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            display_order: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <div className="flex items-center gap-3">
                        <Switch
                          id="highlight-active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_active: checked })
                          }
                        />
                        <Label htmlFor="highlight-active">Published</Label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Highlight'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Highlights list */}
          <div className="grid gap-4 md:grid-cols-2">
            {items.length === 0 ? (
              <Card className="col-span-2">
                <CardContent className="py-12 text-center">
                  <Clapperboard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No highlights yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add photos and videos from past events to fill the carousel
                  </p>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Highlight
                  </Button>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {item.media_type === 'video' ? (
                        <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border bg-muted">
                          <Film className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ) : (
                        <img
                          src={item.media_url}
                          alt=""
                          className="h-14 w-20 shrink-0 rounded-lg border object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                            {item.media_type}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-ent-gold/20 px-2 py-0.5 text-ent-gold-ink">
                            #{item.display_order}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1 truncate">
                          {item.caption || 'Untitled highlight'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={(checked) =>
                            handleToggleActive(item.id, checked)
                          }
                        />
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {items.length > 0 && (
            <p className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
              <Clapperboard className="h-3.5 w-3.5" />
              The carousel shows at most 8 highlights, ordered by display order. Unpublished
              items stay hidden from visitors.
            </p>
          )}
        </div>
      </div>
    </PermissionGate>
  );
};

export default AdminEventHighlights;
