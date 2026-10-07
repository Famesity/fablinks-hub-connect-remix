import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Pencil, Trash2, Save, CalendarDays, MapPin, Clock, Image, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { ADMIN_PERMISSIONS } from '@/hooks/usePermissions';

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  registration_url: string | null;
  whatsapp_number: string | null;
  image_url: string | null;
  price: string | null;
  display_order: number;
  is_active: boolean;
}

const formatDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const dayOfMonth = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '--';
  return String(date.getDate()).padStart(2, '0');
};

const monthShort = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-NG', { month: 'short' });
};

const AdminEvents = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    title: '',
    description: '',
    category: 'Event',
    event_date: '',
    event_time: '',
    venue: '',
    registration_url: '',
    whatsapp_number: '',
    price: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchEvents();
    }
  }, [adminLoading, isAdmin]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error(
        'Could not load events. If this is a new setup, the events migration may not be applied yet.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (event?: EventRow) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        category: event.category || 'Event',
        event_date: event.event_date,
        event_time: event.event_time || '',
        venue: event.venue || '',
        registration_url: event.registration_url || '',
        whatsapp_number: event.whatsapp_number || '',
        price: event.price || '',
        image_url: event.image_url || '',
        display_order: event.display_order,
        is_active: event.is_active,
      });
    } else {
      setEditingEvent(null);
      setFormData({ ...emptyForm, display_order: events.length + 1 });
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.event_date) {
      toast.error('Event date is required');
      return;
    }

    setSaving(true);
    try {
      const registrationUrl = formData.registration_url.trim();
      const registerWhatsapp = formData.whatsapp_number.replace(/\D/g, '');
      const payload = {
        title: formData.title,
        description: formData.description.trim() || null,
        category: formData.category,
        event_date: formData.event_date,
        event_time: formData.event_time.trim() || null,
        venue: formData.venue.trim() || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
        // Only send the optional registration/media columns when they are in
        // use or being cleared, so saving plain events still works even if
        // migrations 20261006120000 / 20261007143000 are not applied yet.
        ...(registrationUrl || editingEvent?.registration_url
          ? { registration_url: registrationUrl || null }
          : {}),
        ...(registerWhatsapp || editingEvent?.whatsapp_number
          ? { whatsapp_number: registerWhatsapp || null }
          : {}),
        ...(formData.price.trim() || editingEvent?.price
          ? { price: formData.price.trim() || null }
          : {}),
        ...(formData.image_url.trim() || editingEvent?.image_url
          ? { image_url: formData.image_url.trim() || null }
          : {}),
      };

      if (editingEvent) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
        toast.success('Event created successfully');
      }

      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      const message = (error as Error)?.message || '';
      if (/registration_url|whatsapp_number|image_url|price|column/i.test(message)) {
        toast.error(
          'Registration fields are not in the database yet — apply supabase/migrations/20261006120000_event_registration_links.sql, then save again.'
        );
      } else {
        toast.error('Failed to save event');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from('events').update({ is_active: isActive }).eq('id', id);
      if (error) throw error;
      toast.success(isActive ? 'Event published' : 'Event hidden');
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
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
                <h1 className="text-2xl md:text-3xl font-bold">Events Highlights</h1>
                <p className="text-muted-foreground">
                  Manage the event line-up shown on the landing page
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Title *</Label>
                    <Input
                      id="event-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Game Night Tournament"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What happens at this event?"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Date *</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-time">Time</Label>
                      <Input
                        id="event-time"
                        value={formData.event_time}
                        onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                        placeholder="e.g., 5:00 PM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-category">Category</Label>
                      <Input
                        id="event-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Tournament"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-order">Display Order</Label>
                      <Input
                        id="event-order"
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-venue">Venue</Label>
                    <Input
                      id="event-venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g., Defabs Media Lounge, Student Affairs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-price">Price / prize</Label>
                    <Input
                      id="event-price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., Free, ₦500, Win ₦50,000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional — the price shows as a badge on the event card.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-image-upload">Card image</Label>
                    <div className="flex items-start gap-4">
                      {formData.image_url ? (
                        <div className="relative shrink-0">
                          <img
                            src={formData.image_url}
                            alt="Event preview"
                            className="h-20 w-28 rounded-lg border object-cover"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-md"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            disabled={uploading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                          <Image className="h-6 w-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1 space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading}
                          onClick={() => document.getElementById('event-image-upload')?.click()}
                        >
                          {uploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="mr-2 h-4 w-4" />
                          )}
                          {uploading
                            ? 'Uploading…'
                            : formData.image_url
                              ? 'Replace Image'
                              : 'Upload Image'}
                        </Button>
                        <input
                          id="event-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                            e.target.value = '';
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG or WebP up to 5 MB — the card auto-adjusts to the image
                          dimensions. Leave empty for the themed placeholder.
                        </p>
                      </div>
                    </div>

                    <Input
                      id="event-image-url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="…or paste an image URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-registration-url">Registration URL</Label>
                    <Input
                      id="event-registration-url"
                      value={formData.registration_url}
                      onChange={(e) =>
                        setFormData({ ...formData, registration_url: e.target.value })
                      }
                      placeholder="https://… or a full wa.me link"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional — the card's Register button opens this link as-is.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-whatsapp">WhatsApp number for registrations</Label>
                    <Input
                      id="event-whatsapp"
                      value={formData.whatsapp_number}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp_number: e.target.value })
                      }
                      placeholder="e.g., 2348106411463"
                    />
                    <p className="text-xs text-muted-foreground">
                      Visitors are taken to WhatsApp with a prefilled registration message
                      about this event — just like the services page. Leave both fields empty
                      to keep the site-wide "Reserve a spot" link.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      id="event-active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                    <Label htmlFor="event-active">Published (visible on landing page)</Label>
                  </div>

                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Event'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Events List */}
          <div className="grid gap-4 md:grid-cols-2">
            {events.length === 0 ? (
              <Card className="col-span-2">
                <CardContent className="py-12 text-center">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add events to fill the "What's on" section of the landing page
                  </p>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id} className={!event.is_active ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 rounded-lg bg-primary/10 px-3 py-2 text-center leading-none text-primary">
                        <span className="block text-xl font-bold">{dayOfMonth(event.event_date)}</span>
                        <span className="mt-1 block text-[10px] font-semibold uppercase">
                          {monthShort(event.event_date)}
                        </span>
                      </div>
                      {event.image_url && (
                        <img
                          src={event.image_url}
                          alt=""
                          className="h-12 w-16 shrink-0 rounded-lg border object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{event.title}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                            {event.category}
                          </span>
                          {(event.registration_url || event.whatsapp_number) && (
                            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
                              Register set
                            </span>
                          )}
                          {event.price && (
                            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-ent-gold/20 px-2 py-0.5 text-ent-gold-ink">
                              {event.price}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(event.event_date)}
                          {event.event_time ? ` · ${event.event_time}` : ''}
                        </p>
                        {event.venue && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {event.venue}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Switch
                          checked={event.is_active}
                          onCheckedChange={(checked) => handleToggleActive(event.id, checked)}
                        />
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(event)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
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

          {events.length > 0 && (
            <p className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Events are listed on the landing page by date, newest upcoming first. Unpublished
              events stay hidden from visitors.
            </p>
          )}
        </div>
      </div>
    </PermissionGate>
  );
};

export default AdminEvents;
