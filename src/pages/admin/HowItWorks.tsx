import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Pencil, Trash2, Save, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { getLucideIcon } from '@/lib/lucideIconMap';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { ADMIN_PERMISSIONS } from '@/hooks/usePermissions';

interface Step {
  id: string;
  step_number: number;
  title: string;
  description: string | null;
  icon_name: string | null;
  is_active: boolean;
}

const availableIcons = [
  'MessageCircle', 'FileText', 'Zap', 'Phone', 'Mail', 'MapPin', 'User', 'CheckCircle',
  'Star', 'Heart', 'ThumbsUp', 'Send', 'Clock', 'Target', 'Award', 'Briefcase'
];

const AdminHowItWorks = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [formData, setFormData] = useState({ step_number: 1, title: '', description: '', icon_name: 'Star', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchSteps();
    }
  }, [adminLoading, isAdmin]);

  const fetchSteps = async () => {
    try {
      const { data, error } = await supabase
        .from('how_it_works_steps')
        .select('*')
        .order('step_number', { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Error fetching steps:', error);
      toast.error('Failed to load steps');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (step?: Step) => {
    if (step) {
      setEditingStep(step);
      setFormData({
        step_number: step.step_number,
        title: step.title,
        description: step.description || '',
        icon_name: step.icon_name || 'Star',
        is_active: step.is_active,
      });
    } else {
      setEditingStep(null);
      setFormData({ step_number: steps.length + 1, title: '', description: '', icon_name: 'Star', is_active: true });
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
      if (editingStep) {
        const { error } = await supabase
          .from('how_it_works_steps')
          .update(formData)
          .eq('id', editingStep.id);

        if (error) throw error;
        toast.success('Step updated successfully');
      } else {
        const { error } = await supabase
          .from('how_it_works_steps')
          .insert([formData]);

        if (error) throw error;
        toast.success('Step created successfully');
      }

      setIsDialogOpen(false);
      fetchSteps();
    } catch (error) {
      console.error('Error saving step:', error);
      toast.error('Failed to save step');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this step?')) return;

    try {
      const { error } = await supabase.from('how_it_works_steps').delete().eq('id', id);
      if (error) throw error;
      toast.success('Step deleted successfully');
      fetchSteps();
    } catch (error) {
      console.error('Error deleting step:', error);
      toast.error('Failed to delete step');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from('how_it_works_steps').update({ is_active: isActive }).eq('id', id);
      if (error) throw error;
      toast.success(isActive ? 'Step activated' : 'Step deactivated');
      fetchSteps();
    } catch (error) {
      console.error('Error updating step:', error);
      toast.error('Failed to update step');
    }
  };

  const getIcon = (iconName: string | null) => {
    const IconComponent = getLucideIcon(iconName || 'Star');
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
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_HOW_IT_WORKS}>
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">How It Works</h1>
              <p className="text-muted-foreground">Manage process steps</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingStep ? 'Edit Step' : 'Add New Step'}</DialogTitle>
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
                  <Label htmlFor="step_number">Step Number *</Label>
                  <Input
                    id="step_number"
                    type="number"
                    value={formData.step_number}
                    onChange={(e) => setFormData({ ...formData, step_number: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Contact Us"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this step"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Step'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ListChecks className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No steps yet</h3>
                <p className="text-muted-foreground mb-4">Add steps to show how your service works</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Step
                </Button>
              </CardContent>
            </Card>
          ) : (
            steps.map((step) => (
              <Card key={step.id} className={!step.is_active ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-primary/10 p-3 rounded-full text-primary">
                        {getIcon(step.icon_name)}
                      </div>
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {step.step_number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      {step.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{step.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={step.is_active}
                        onCheckedChange={(checked) => handleToggleActive(step.id, checked)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(step)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(step.id)}>
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

export default AdminHowItWorks;
