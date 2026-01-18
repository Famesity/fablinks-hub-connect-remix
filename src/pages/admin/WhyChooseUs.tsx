import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { ADMIN_PERMISSIONS } from "@/hooks/usePermissions";

interface Feature {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

interface Statistic {
  id: string;
  label: string;
  value: string;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  'Shield', 'Clock', 'Users', 'Award', 'Heart', 'Zap', 'Star', 'CheckCircle', 'Target', 'Lightbulb', 'Rocket', 'TrendingUp', 'ThumbsUp'
];

export default function AdminWhyChooseUs() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [features, setFeatures] = useState<Feature[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingStat, setEditingStat] = useState<Statistic | null>(null);
  const [formData, setFormData] = useState({ icon_name: 'Shield', title: '', description: '', display_order: 0 });
  const [statsFormData, setStatsFormData] = useState({ label: '', value: '', display_order: 0 });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [featuresRes, statsRes] = await Promise.all([
        supabase.from('why_choose_us_features').select('*').order('display_order'),
        supabase.from('site_statistics').select('*').order('display_order')
      ]);

      if (featuresRes.data) setFeatures(featuresRes.data);
      if (statsRes.data) setStatistics(statsRes.data);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (feature?: Feature) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        icon_name: feature.icon_name,
        title: feature.title,
        description: feature.description,
        display_order: feature.display_order
      });
    } else {
      setEditingFeature(null);
      setFormData({ icon_name: 'Shield', title: '', description: '', display_order: features.length + 1 });
    }
    setDialogOpen(true);
  };

  const handleOpenStatsDialog = (stat?: Statistic) => {
    if (stat) {
      setEditingStat(stat);
      setStatsFormData({ label: stat.label, value: stat.value, display_order: stat.display_order });
    } else {
      setEditingStat(null);
      setStatsFormData({ label: '', value: '', display_order: statistics.length + 1 });
    }
    setStatsDialogOpen(true);
  };

  const handleSaveFeature = async () => {
    try {
      if (editingFeature) {
        const { error } = await supabase
          .from('why_choose_us_features')
          .update(formData)
          .eq('id', editingFeature.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('why_choose_us_features')
          .insert([{ ...formData, is_active: true }]);
        if (error) throw error;
      }
      toast({ title: "Success", description: "Feature saved successfully" });
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSaveStatistic = async () => {
    try {
      if (editingStat) {
        const { error } = await supabase
          .from('site_statistics')
          .update(statsFormData)
          .eq('id', editingStat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_statistics')
          .insert([{ ...statsFormData, is_active: true }]);
        if (error) throw error;
      }
      toast({ title: "Success", description: "Statistic saved successfully" });
      setStatsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    try {
      const { error } = await supabase.from('why_choose_us_features').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Feature deleted" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteStatistic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return;
    try {
      const { error } = await supabase.from('site_statistics').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Statistic deleted" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleFeature = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase.from('why_choose_us_features').update({ is_active: !is_active }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleStatistic = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase.from('site_statistics').update({ is_active: !is_active }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_WHY_CHOOSE_US}>
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Why Choose Us Section</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="features">
          <TabsList className="mb-6">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Features</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingFeature ? 'Edit Feature' : 'Add Feature'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Icon</Label>
                      <Select value={formData.icon_name} onValueChange={(val) => setFormData({ ...formData, icon_name: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} />
                    </div>
                    <Button onClick={handleSaveFeature} className="w-full">Save Feature</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {features.map((feature) => (
                <Card key={feature.id} className={!feature.is_active ? 'opacity-50' : ''}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground mr-2">[{feature.icon_name}]</span>
                        <span className="font-semibold">{feature.title}</span>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={feature.is_active} onCheckedChange={() => handleToggleFeature(feature.id, feature.is_active)} />
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(feature)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteFeature(feature.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Statistics Bar</h2>
              <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenStatsDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Statistic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingStat ? 'Edit Statistic' : 'Add Statistic'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Value (e.g., 10,000+)</Label>
                      <Input value={statsFormData.value} onChange={(e) => setStatsFormData({ ...statsFormData, value: e.target.value })} />
                    </div>
                    <div>
                      <Label>Label (e.g., Happy Students)</Label>
                      <Input value={statsFormData.label} onChange={(e) => setStatsFormData({ ...statsFormData, label: e.target.value })} />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input type="number" value={statsFormData.display_order} onChange={(e) => setStatsFormData({ ...statsFormData, display_order: parseInt(e.target.value) || 0 })} />
                    </div>
                    <Button onClick={handleSaveStatistic} className="w-full">Save Statistic</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {statistics.map((stat) => (
                <Card key={stat.id} className={!stat.is_active ? 'opacity-50' : ''}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-bold text-lg">{stat.value}</span>
                        <span className="ml-2 text-muted-foreground">{stat.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={stat.is_active} onCheckedChange={() => handleToggleStatistic(stat.id, stat.is_active)} />
                      <Button variant="ghost" size="icon" onClick={() => handleOpenStatsDialog(stat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteStatistic(stat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </PermissionGate>
  );
}
