import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
}

export default function AdminSiteSettings() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("category");

      if (error) throw error;
      
      // Parse JSONB values
      const parsedSettings = data?.map(setting => ({
        ...setting,
        value: typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value).replace(/^"|"$/g, '')
      })) || [];
      
      setSettings(parsedSettings);
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

  const handleImageUpload = async (file: File, bucket: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Handle logo upload
      if (logoFile) {
        const logoUrl = await handleImageUpload(logoFile, 'school-logos');
        if (logoUrl) {
          updateSetting('site_logo', logoUrl);
          const logoSetting = settings.find(s => s.key === 'site_logo');
          if (logoSetting) {
            await supabase
              .from("site_settings")
              .update({ value: JSON.stringify(logoUrl) })
              .eq("key", "site_logo");
          }
        }
      }

      // Handle hero background upload
      if (heroFile) {
        const heroUrl = await handleImageUpload(heroFile, 'blog-images');
        if (heroUrl) {
          updateSetting('hero_background_image', heroUrl);
          const heroSetting = settings.find(s => s.key === 'hero_background_image');
          if (heroSetting) {
            await supabase
              .from("site_settings")
              .update({ value: JSON.stringify(heroUrl) })
              .eq("key", "hero_background_image");
          }
        }
      }

      // Update all text settings
      for (const setting of settings) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: JSON.stringify(setting.value) })
          .eq("key", setting.key);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Site settings updated successfully",
      });

      setLogoFile(null);
      setHeroFile(null);
      fetchSettings();
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

  const renderSetting = (key: string, label: string, isTextarea: boolean = false) => {
    const setting = settings.find(s => s.key === key);
    if (!setting) return null;

    return (
      <div className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        {isTextarea ? (
          <Textarea
            id={key}
            value={setting.value}
            onChange={(e) => updateSetting(key, e.target.value)}
            rows={3}
          />
        ) : (
          <Input
            id={key}
            value={setting.value}
            onChange={(e) => updateSetting(key, e.target.value)}
          />
        )}
      </div>
    );
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
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Site Settings</h1>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your site's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderSetting("site_title", "Site Title")}
                {renderSetting("site_description", "Site Description", true)}
                <div className="space-y-2">
                  <Label htmlFor="logo">Site Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setLogoFile(file);
                    }}
                  />
                  {settings.find(s => s.key === 'site_logo')?.value && (
                    <img 
                      src={settings.find(s => s.key === 'site_logo')?.value} 
                      alt="Logo preview" 
                      className="h-20 w-20 object-contain mt-2"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Customize your landing page hero section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderSetting("hero_title", "Hero Title")}
                {renderSetting("hero_subtitle", "Hero Subtitle", true)}
                {renderSetting("hero_cta_text", "CTA Button Text")}
                {renderSetting("hero_cta_link", "CTA Button Link")}
                <div className="space-y-2">
                  <Label htmlFor="hero_bg">Hero Background Image</Label>
                  <Input
                    id="hero_bg"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setHeroFile(file);
                    }}
                  />
                  {settings.find(s => s.key === 'hero_background_image')?.value && (
                    <img 
                      src={settings.find(s => s.key === 'hero_background_image')?.value} 
                      alt="Hero background preview" 
                      className="h-32 w-full object-cover mt-2 rounded"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderSetting("contact_email", "Email")}
                {renderSetting("contact_phone", "Phone")}
                {renderSetting("contact_address", "Address")}
                {renderSetting("contact_whatsapp", "WhatsApp Number")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Footer Settings</CardTitle>
                <CardDescription>Configure your footer content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderSetting("footer_text", "Copyright Text")}
                {renderSetting("footer_description", "Footer Description", true)}
                {renderSetting("features_title", "Features Section Title")}
                {renderSetting("features_subtitle", "Features Section Subtitle", true)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Add your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderSetting("social_facebook", "Facebook URL")}
                {renderSetting("social_twitter", "Twitter URL")}
                {renderSetting("social_instagram", "Instagram URL")}
                {renderSetting("social_linkedin", "LinkedIn URL")}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
