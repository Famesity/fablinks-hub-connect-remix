import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Save, Megaphone } from "lucide-react";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

interface Announcement {
  id: string;
  message: string;
  link_text: string | null;
  link_url: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
}

export default function AdminAnnouncement() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnnouncement();
    }
  }, [isAdmin]);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from("announcement_bar")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setAnnouncement(data);
      } else {
        // Create default announcement if none exists
        const { data: newData, error: createError } = await supabase
          .from("announcement_bar")
          .insert({
            message: "Welcome! Check out our latest services.",
            is_active: false,
            background_color: "#1A73E8",
            text_color: "#FFFFFF"
          })
          .select()
          .single();
        
        if (!createError && newData) {
          setAnnouncement(newData);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!announcement) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("announcement_bar")
        .update({
          message: announcement.message,
          link_text: announcement.link_text,
          link_url: announcement.link_url,
          background_color: announcement.background_color,
          text_color: announcement.text_color,
          is_active: announcement.is_active,
        })
        .eq("id", announcement.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement bar updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
      <header className="border-b sticky top-0 z-40 bg-background">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/landing")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Landing
          </Button>
          <div className="flex justify-between items-center mt-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Megaphone className="h-6 w-6" />
              Announcement Bar
            </h1>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {announcement && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>This is how your announcement bar will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="py-2 px-4 text-center text-sm rounded-lg"
                  style={{ 
                    backgroundColor: announcement.background_color,
                    color: announcement.text_color 
                  }}
                >
                  {announcement.message}
                  {announcement.link_text && (
                    <span className="ml-2 underline font-medium">
                      {announcement.link_text}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Show Announcement Bar</Label>
                    <p className="text-sm text-muted-foreground">Toggle the announcement bar visibility</p>
                  </div>
                  <Switch
                    id="active"
                    checked={announcement.is_active}
                    onCheckedChange={(checked) => setAnnouncement({ ...announcement, is_active: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Announcement Message</Label>
                  <Input
                    id="message"
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                    placeholder="Enter your announcement message"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link_text">Link Text (Optional)</Label>
                    <Input
                      id="link_text"
                      value={announcement.link_text || ""}
                      onChange={(e) => setAnnouncement({ ...announcement, link_text: e.target.value })}
                      placeholder="e.g., Learn More"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link_url">Link URL (Optional)</Label>
                    <Input
                      id="link_url"
                      value={announcement.link_url || ""}
                      onChange={(e) => setAnnouncement({ ...announcement, link_url: e.target.value })}
                      placeholder="e.g., /services"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bg_color">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg_color"
                        type="color"
                        value={announcement.background_color}
                        onChange={(e) => setAnnouncement({ ...announcement, background_color: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={announcement.background_color}
                        onChange={(e) => setAnnouncement({ ...announcement, background_color: e.target.value })}
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
                        onChange={(e) => setAnnouncement({ ...announcement, text_color: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={announcement.text_color}
                        onChange={(e) => setAnnouncement({ ...announcement, text_color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <AdminBottomNav />
    </div>
  );
}
