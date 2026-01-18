import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Pencil, Trash2, Save, Shield } from 'lucide-react';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { ADMIN_PERMISSIONS } from '@/hooks/usePermissions';

interface TrustBadge {
  id: string;
  icon_name: string;
  title: string;
  display_order: number;
  is_active: boolean;
}

const availableIcons = [
  'Wifi', 'Printer', 'Shield', 'BadgeDollarSign', 'Users', 'Star', 'Zap', 'Clock', 
  'CheckCircle', 'Award', 'Heart', 'ThumbsUp', 'Lock', 'Globe', 'Headphones', 'Target'
];

const AdminTrustBadges = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<TrustBadge | null>(null);
  const [formData, setFormData] = useState({ icon_name: 'Star', title: '', display_order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchBadges();
    }
  }, [adminLoading, isAdmin]);

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('trust_badges')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Failed to load trust badges');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (badge?: TrustBadge) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        icon_name: badge.icon_name,
        title: badge.title,
        display_order: badge.display_order,
        is_active: badge.is_active,
      });
    } else {
      setEditingBadge(null);
      setFormData({ icon_name: 'Star', title: '', display_order: badges.length + 1, is_active: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      if (editingBadge) {
        const { error } = await supabase
          .from('trust_badges')
          .update(formData)
          .eq('id', editingBadge.id);

        if (error) throw error;
        toast.success('Badge updated successfully');
      } else {
        const { error } = await supabase
          .from('trust_badges')
          .insert([formData]);

        if (error) throw error;
        toast.success('Badge created successfully');
      }

      setIsDialogOpen(false);
      fetchBadges();
    } catch (error) {
      console.error('Error saving badge:', error);
      toast.error('Failed to save badge');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this badge?')) return;

    try {
      const { error } = await supabase.from('trust_badges').delete().eq('id', id);
      if (error) throw error;
      toast.success('Badge deleted successfully');
      fetchBadges();
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast.error('Failed to delete badge');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from('trust_badges').update({ is_active: isActive }).eq('id', id);
      if (error) throw error;
      toast.success(isActive ? 'Badge activated' : 'Badge deactivated');
      fetchBadges();
    } catch (error) {
      console.error('Error updating badge:', error);
      toast.error('Failed to update badge');
    }
  };

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    const IconComponent = icons[iconName] || icons['Star'];
    return <IconComponent className="w-5 h-5" />;
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
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_TRUST_BADGES}>
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Trust Badges</h1>
              <p className="text-muted-foreground">Manage trust strip icons</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Badge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBadge ? 'Edit Badge' : 'Add New Badge'}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {availableIcons.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon_name: iconName })}
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          formData.icon_name === iconName 
                            ? 'border-primary bg-primary/10' 
                            : 'border-transparent hover:border-muted'
                        }`}
                      >
                        {getIcon(iconName)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Fast Internet"
                  />
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
                  {saving ? 'Saving...' : 'Save Badge'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Badges List */}
        <div className="grid gap-4 md:grid-cols-2">
          {badges.length === 0 ? (
            <Card className="col-span-2">
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No trust badges yet</h3>
                <p className="text-muted-foreground mb-4">Add badges to build trust with visitors</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Badge
                </Button>
              </CardContent>
            </Card>
          ) : (
            badges.map((badge) => (
              <Card key={badge.id} className={!badge.is_active ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      {getIcon(badge.icon_name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{badge.title}</h3>
                      <p className="text-sm text-muted-foreground">Order: {badge.display_order}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={badge.is_active}
                        onCheckedChange={(checked) => handleToggleActive(badge.id, checked)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(badge)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(badge.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
    </PermissionGate>
  );
};

export default AdminTrustBadges;
