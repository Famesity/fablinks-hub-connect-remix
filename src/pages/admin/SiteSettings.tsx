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
import { Loader2, ArrowLeft, Save, Eye, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

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

  const themePresets = {
    'Ocean Blue': {
      theme_primary_color: '210 100% 50%',
      theme_primary_foreground: '0 0% 100%',
      theme_accent_color: '190 100% 45%',
      theme_background: '0 0% 100%',
      theme_foreground: '222 47% 11%',
    },
    'Forest Green': {
      theme_primary_color: '142 71% 45%',
      theme_primary_foreground: '0 0% 100%',
      theme_accent_color: '160 60% 50%',
      theme_background: '0 0% 100%',
      theme_foreground: '222 47% 11%',
    },
    'Sunset Orange': {
      theme_primary_color: '25 95% 53%',
      theme_primary_foreground: '0 0% 100%',
      theme_accent_color: '45 100% 51%',
      theme_background: '0 0% 100%',
      theme_foreground: '222 47% 11%',
    },
    'Royal Purple': {
      theme_primary_color: '271 81% 56%',
      theme_primary_foreground: '0 0% 100%',
      theme_accent_color: '291 47% 51%',
      theme_background: '0 0% 100%',
      theme_foreground: '222 47% 11%',
    },
    'Crimson Red': {
      theme_primary_color: '348 83% 47%',
      theme_primary_foreground: '0 0% 100%',
      theme_accent_color: '0 72% 51%',
      theme_background: '0 0% 100%',
      theme_foreground: '222 47% 11%',
    },
  };

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

  const applyThemePreset = (presetName: keyof typeof themePresets) => {
    const preset = themePresets[presetName];
    const newSettings = settings.map(s => {
      if (preset[s.key as keyof typeof preset]) {
        return { ...s, value: preset[s.key as keyof typeof preset] };
      }
      return s;
    });
    setSettings(newSettings);
    if (previewMode) {
      setPreviewSettings(newSettings);
      applyThemePreview();
    }
    toast({
      title: "Theme Preset Applied",
      description: `${presetName} theme has been applied. Click 'Save Settings' to persist.`,
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
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b sticky top-0 z-40 bg-background">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-2 sm:mb-4">
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="text-sm">Back</span>
          </Button>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">Site Settings</h1>
            <div className="flex gap-2">
              <Button onClick={handlePreview} variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Eye className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="flex-1 sm:flex-none">
                <Save className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="general" className="w-full">
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-max sm:w-full sm:grid sm:grid-cols-7 gap-1 mb-4">
              <TabsTrigger value="general" className="text-xs sm:text-sm px-3 sm:px-4">General</TabsTrigger>
              <TabsTrigger value="hero" className="text-xs sm:text-sm px-3 sm:px-4">Hero</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs sm:text-sm px-3 sm:px-4">Contact</TabsTrigger>
              <TabsTrigger value="cta" className="text-xs sm:text-sm px-3 sm:px-4">CTA</TabsTrigger>
              <TabsTrigger value="footer" className="text-xs sm:text-sm px-3 sm:px-4">Footer</TabsTrigger>
              <TabsTrigger value="social" className="text-xs sm:text-sm px-3 sm:px-4">Social</TabsTrigger>
              <TabsTrigger value="theme" className="text-xs sm:text-sm px-3 sm:px-4">Theme</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your site's basic information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderSetting("site_title", "Site Title")}
                {renderSetting("site_description", "Site Description", true)}
                
                {/* Logo Upload Section */}
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="logo" className="text-base font-semibold">Site Logo</Label>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                      Also used as favicon
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Recommended:</strong> Square image (e.g., 200×200px or 512×512px), PNG or JPG format, max 2MB. 
                    This image will appear in the header and as the browser tab icon.
                  </p>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Please upload an image smaller than 2MB",
                            variant: "destructive",
                          });
                          return;
                        }
                        setLogoFile(file);
                      }
                    }}
                  />
                  {(logoFile || settings.find(s => s.key === 'site_logo')?.value) && (
                    <div className="flex items-center gap-4 mt-3 p-3 bg-background rounded-lg border">
                      <div className="relative">
                        <img 
                          src={logoFile ? URL.createObjectURL(logoFile) : settings.find(s => s.key === 'site_logo')?.value} 
                          alt="Logo preview" 
                          className="h-16 w-16 object-contain rounded-lg border"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {logoFile ? 'New logo selected' : 'Current logo'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {logoFile ? `${logoFile.name} (${(logoFile.size / 1024).toFixed(1)}KB)` : 'Uploaded previously'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLogoFile(null);
                          updateSetting('site_logo', '');
                        }}
                      >
                        Remove
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
                <CardDescription>Update your contact details and location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderSetting("contact_email", "Email")}
                {renderSetting("contact_phone", "Phone")}
                {renderSetting("contact_address", "Address (used for map location)", true)}
                {renderSetting("contact_whatsapp", "WhatsApp Number")}
                {renderSetting("whatsapp_number", "WhatsApp Number (alternate)")}
                {renderSetting("opening_hours", "Opening Hours")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta">
            <Card>
              <CardHeader>
                <CardTitle>Call-to-Action Section</CardTitle>
                <CardDescription>Customize the CTA section on the landing page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderSetting("cta_title", "CTA Title")}
                {renderSetting("cta_subtitle", "CTA Subtitle", true)}
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
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Quick Theme Presets
                  </CardTitle>
                  <CardDescription>Apply a beautiful theme with one click</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.keys(themePresets).map((presetName) => (
                      <Button
                        key={presetName}
                        variant="outline"
                        className="h-auto flex-col gap-2 p-4 hover:scale-105 transition-transform"
                        onClick={() => applyThemePreset(presetName as keyof typeof themePresets)}
                      >
                        <div 
                          className="w-full h-16 rounded-md shadow-md"
                          style={{ 
                            background: `linear-gradient(135deg, hsl(${themePresets[presetName as keyof typeof themePresets].theme_primary_color}), hsl(${themePresets[presetName as keyof typeof themePresets].theme_accent_color}))` 
                          }}
                        />
                        <span className="text-sm font-medium">{presetName}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Color Theme</CardTitle>
                  <CardDescription>Fine-tune your color scheme (HSL format: hue saturation% lightness%)</CardDescription>
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
            </div>
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

      <AdminBottomNav />
    </div>
  );
}
