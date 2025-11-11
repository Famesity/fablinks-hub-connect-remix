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
  const [previewMode, setPreviewMode] = useState(false);
  const [previewSettings, setPreviewSettings] = useState<Setting[]>([]);

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
    if (previewMode) {
      setPreviewSettings(previewSettings.map(s => s.key === key ? { ...s, value } : s));
    }
  };

  const handlePreview = () => {
    setPreviewSettings([...settings]);
    setPreviewMode(true);
  };

  const applyThemePreview = () => {
    const root = document.documentElement;
    previewSettings.forEach(setting => {
      if (setting.category === 'theme') {
        const cssVar = setting.key.replace('theme_', '--');
        root.style.setProperty(cssVar, setting.value);
      }
    });
  };

  useEffect(() => {
    if (previewMode) {
      applyThemePreview();
    }
  }, [previewMode, previewSettings]);

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
              .update({ value: logoUrl })
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
              .update({ value: heroUrl })
              .eq("key", "hero_background_image");
          }
        }
      }

      // Update all text settings - store as JSONB strings
      for (const setting of settings) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: setting.value })
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
            <div className="flex gap-2">
              <Button onClick={handlePreview} variant="outline">
                Preview Changes
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
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
                    <div className="relative inline-block mt-2">
                      <img 
                        src={settings.find(s => s.key === 'site_logo')?.value} 
                        alt="Logo preview" 
                        className="h-20 w-20 object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => updateSetting('site_logo', '')}
                      >
                        ✕
                      </Button>
                    </div>
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
                    <div className="relative mt-2">
                      <img 
                        src={settings.find(s => s.key === 'hero_background_image')?.value} 
                        alt="Hero background preview" 
                        className="h-32 w-full object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => updateSetting('hero_background_image', '')}
                      >
                        Remove
                      </Button>
                    </div>
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

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Color Theme</CardTitle>
                <CardDescription>Customize your website's color scheme (HSL format: hue saturation% lightness%)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme_primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="theme_primary_color"
                        value={settings.find(s => s.key === 'theme_primary_color')?.value || ''}
                        onChange={(e) => updateSetting('theme_primary_color', e.target.value)}
                        placeholder="217 91% 50%"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: `hsl(${settings.find(s => s.key === 'theme_primary_color')?.value || '217 91% 50%'})` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme_primary_foreground">Primary Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="theme_primary_foreground"
                        value={settings.find(s => s.key === 'theme_primary_foreground')?.value || ''}
                        onChange={(e) => updateSetting('theme_primary_foreground', e.target.value)}
                        placeholder="0 0% 98%"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: `hsl(${settings.find(s => s.key === 'theme_primary_foreground')?.value || '0 0% 98%'})` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme_accent_color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="theme_accent_color"
                        value={settings.find(s => s.key === 'theme_accent_color')?.value || ''}
                        onChange={(e) => updateSetting('theme_accent_color', e.target.value)}
                        placeholder="217 91% 50%"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: `hsl(${settings.find(s => s.key === 'theme_accent_color')?.value || '217 91% 50%'})` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme_background">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="theme_background"
                        value={settings.find(s => s.key === 'theme_background')?.value || ''}
                        onChange={(e) => updateSetting('theme_background', e.target.value)}
                        placeholder="0 0% 100%"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: `hsl(${settings.find(s => s.key === 'theme_background')?.value || '0 0% 100%'})` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme_foreground">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="theme_foreground"
                        value={settings.find(s => s.key === 'theme_foreground')?.value || ''}
                        onChange={(e) => updateSetting('theme_foreground', e.target.value)}
                        placeholder="222.2 84% 4.9%"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: `hsl(${settings.find(s => s.key === 'theme_foreground')?.value || '222.2 84% 4.9%'})` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme_border_radius">Border Radius</Label>
                    <Input
                      id="theme_border_radius"
                      value={settings.find(s => s.key === 'theme_border_radius')?.value || ''}
                      onChange={(e) => updateSetting('theme_border_radius', e.target.value)}
                      placeholder="0.75rem"
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">💡 <strong>HSL Color Format:</strong></p>
                  <p className="text-sm text-muted-foreground">Use format: "hue saturation% lightness%" (e.g., "217 91% 50%")</p>
                  <p className="text-sm text-muted-foreground mt-1">Tip: Use <a href="https://hslpicker.com" target="_blank" rel="noopener" className="text-primary hover:underline">HSL Color Picker</a> to choose colors</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {previewMode && (
          <Card className="mt-8 border-primary">
            <CardHeader>
              <CardTitle>Preview Mode Active</CardTitle>
              <CardDescription>You are viewing your changes in preview mode. Save to apply permanently.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={() => window.open('/', '_blank')} variant="outline">
                  Open Homepage Preview
                </Button>
                <Button onClick={() => setPreviewMode(false)} variant="outline">
                  Exit Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
