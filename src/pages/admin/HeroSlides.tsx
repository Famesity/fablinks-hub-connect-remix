import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical, Save, Image } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSlide {
  id: string;
  headline: string;
  subtext: string | null;
  image_url: string | null;
  cta_primary_text: string | null;
  cta_primary_link: string | null;
  cta_secondary_text: string | null;
  cta_secondary_link: string | null;
  badge_text: string | null;
  display_order: number;
  is_active: boolean;
}

const defaultSlide: Omit<HeroSlide, 'id'> = {
  headline: '',
  subtext: '',
  image_url: '',
  cta_primary_text: 'Get Started',
  cta_primary_link: '#',
  cta_secondary_text: '',
  cta_secondary_link: '',
  badge_text: '',
  display_order: 0,
  is_active: true,
};

const AdminHeroSlides = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState(defaultSlide);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchSlides();
    }
  }, [adminLoading, isAdmin]);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        headline: slide.headline,
        subtext: slide.subtext || '',
        image_url: slide.image_url || '',
        cta_primary_text: slide.cta_primary_text || '',
        cta_primary_link: slide.cta_primary_link || '',
        cta_secondary_text: slide.cta_secondary_text || '',
        cta_secondary_link: slide.cta_secondary_link || '',
        badge_text: slide.badge_text || '',
        display_order: slide.display_order,
        is_active: slide.is_active,
      });
    } else {
      setEditingSlide(null);
      setFormData({ ...defaultSlide, display_order: slides.length + 1 });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.headline.trim()) {
      toast.error('Headline is required');
      return;
    }

    setSaving(true);
    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update(formData)
          .eq('id', editingSlide.id);

        if (error) throw error;
        toast.success('Slide updated successfully');
      } else {
        const { error } = await supabase
          .from('hero_slides')
          .insert([formData]);

        if (error) throw error;
        toast.success('Slide created successfully');
      }

      setIsDialogOpen(false);
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      toast.error('Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      toast.success(isActive ? 'Slide activated' : 'Slide deactivated');
      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
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
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Hero Carousel</h1>
              <p className="text-muted-foreground">Manage hero section slides</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline *</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="Enter headline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtext">Subtext</Label>
                  <Textarea
                    id="subtext"
                    value={formData.subtext || ''}
                    onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                    placeholder="Enter supporting text"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge_text">Badge Text (Optional)</Label>
                  <Input
                    id="badge_text"
                    value={formData.badge_text || ''}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    placeholder="e.g., Most Requested"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta_primary_text">Primary CTA Text</Label>
                    <Input
                      id="cta_primary_text"
                      value={formData.cta_primary_text || ''}
                      onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
                      placeholder="Get Started"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_primary_link">Primary CTA Link</Label>
                    <Input
                      id="cta_primary_link"
                      value={formData.cta_primary_link || ''}
                      onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
                      placeholder="/services or https://wa.me/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta_secondary_text">Secondary CTA Text</Label>
                    <Input
                      id="cta_secondary_text"
                      value={formData.cta_secondary_text || ''}
                      onChange={(e) => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                      placeholder="Learn More"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_secondary_link">Secondary CTA Link</Label>
                    <Input
                      id="cta_secondary_link"
                      value={formData.cta_secondary_link || ''}
                      onChange={(e) => setFormData({ ...formData, cta_secondary_link: e.target.value })}
                      placeholder="/about"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Slide'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Slides List */}
        <div className="space-y-4">
          {slides.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No slides yet</h3>
                <p className="text-muted-foreground mb-4">Create your first hero slide to get started</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Slide
                </Button>
              </CardContent>
            </Card>
          ) : (
            slides.map((slide) => (
              <Card key={slide.id} className={!slide.is_active ? 'opacity-60' : ''}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="hidden md:flex items-center text-muted-foreground cursor-move">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {slide.image_url && (
                      <img 
                        src={slide.image_url} 
                        alt={slide.headline}
                        className="w-20 h-20 object-cover rounded-lg hidden sm:block"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {slide.badge_text && (
                            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-2">
                              {slide.badge_text}
                            </span>
                          )}
                          <h3 className="font-semibold text-lg truncate">{slide.headline}</h3>
                          {slide.subtext && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{slide.subtext}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Switch
                            checked={slide.is_active}
                            onCheckedChange={(checked) => handleToggleActive(slide.id, checked)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(slide)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(slide.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                        <span>Order: {slide.display_order}</span>
                        {slide.cta_primary_text && <span>• CTA: {slide.cta_primary_text}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeroSlides;
