import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";
import ImageGallery from "@/components/ImageGallery";
import SEOFields from "@/components/SEOFields";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  template: string;
  published: boolean;
  show_in_menu: boolean;
  menu_order: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image: string;
  created_at: string;
}

interface ImageAttachment {
  image_url: string;
  caption?: string;
  alt_text?: string;
  display_order: number;
}

export default function AdminPages() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [template, setTemplate] = useState("default");
  const [published, setPublished] = useState(false);
  const [showInMenu, setShowInMenu] = useState(false);
  const [menuOrder, setMenuOrder] = useState(0);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<ImageAttachment[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPages();
    }
  }, [isAdmin]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive",
      });
    } finally {
      setLoadingPages(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingPage) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `page-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setFeaturedImage(data.publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setFeaturedImage("");
    setTemplate("default");
    setPublished(false);
    setShowInMenu(false);
    setMenuOrder(0);
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setOgImage("");
    setGalleryImages([]);
    setEditingPage(null);
  };

  const handleEdit = async (page: Page) => {
    setEditingPage(page);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setExcerpt(page.excerpt || "");
    setFeaturedImage(page.featured_image || "");
    setTemplate(page.template);
    setPublished(page.published);
    setShowInMenu(page.show_in_menu);
    setMenuOrder(page.menu_order);
    setSeoTitle(page.seo_title || "");
    setSeoDescription(page.seo_description || "");
    setSeoKeywords(page.seo_keywords || "");
    setOgImage(page.og_image || "");

    // Fetch gallery images
    const { data: images } = await supabase
      .from("image_attachments")
      .select("*")
      .eq("entity_type", "page")
      .eq("entity_id", page.id)
      .order("display_order");

    if (images) {
      setGalleryImages(images);
    }

    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const pageData = {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        template,
        published,
        show_in_menu: showInMenu,
        menu_order: menuOrder,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        og_image: ogImage,
        author_id: user?.id,
      };

      if (editingPage) {
        const { error, data } = await supabase
          .from("pages")
          .update(pageData)
          .eq("id", editingPage.id)
          .select()
          .single();

        if (error) throw error;

        // Update gallery images
        await supabase
          .from("image_attachments")
          .delete()
          .eq("entity_type", "page")
          .eq("entity_id", editingPage.id);

        if (galleryImages.length > 0) {
          const imageData = galleryImages.map((img, index) => ({
            entity_type: "page",
            entity_id: editingPage.id,
            image_url: img.image_url,
            caption: img.caption,
            alt_text: img.alt_text,
            display_order: index,
          }));

          await supabase.from("image_attachments").insert(imageData);
        }

        toast({
          title: "Success",
          description: "Page updated successfully",
        });
      } else {
        const { error, data } = await supabase
          .from("pages")
          .insert(pageData)
          .select()
          .single();

        if (error) throw error;

        // Insert gallery images
        if (galleryImages.length > 0) {
          const imageData = galleryImages.map((img, index) => ({
            entity_type: "page",
            entity_id: data.id,
            image_url: img.image_url,
            caption: img.caption,
            alt_text: img.alt_text,
            display_order: index,
          }));

          await supabase.from("image_attachments").insert(imageData);
        }

        toast({
          title: "Success",
          description: "Page created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error: any) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save page",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const { error } = await supabase.from("pages").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page deleted successfully",
      });

      fetchPages();
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingPages) {
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Manage Pages</h1>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Page
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Menu</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="font-mono text-sm">{page.slug}</TableCell>
                    <TableCell>{page.template}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          page.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {page.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {page.show_in_menu && (
                        <span className="text-xs text-muted-foreground">
                          Order: {page.menu_order}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/page/${page.slug}`, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(page)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Edit Page" : "Create New Page"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Page title"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="page-url-slug"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description"
                />
              </div>

              <div>
                <Label>Content *</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your page content..."
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <Label htmlFor="featured-image">Featured Image</Label>
                <Input
                  id="featured-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={uploading}
                />
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="template">Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="sidebar">With Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-in-menu"
                  checked={showInMenu}
                  onCheckedChange={setShowInMenu}
                />
                <Label htmlFor="show-in-menu">Show in Menu</Label>
              </div>

              {showInMenu && (
                <div>
                  <Label htmlFor="menu-order">Menu Order</Label>
                  <Input
                    id="menu-order"
                    type="number"
                    value={menuOrder}
                    onChange={(e) => setMenuOrder(parseInt(e.target.value) || 0)}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="gallery">
              <ImageGallery images={galleryImages} onChange={setGalleryImages} />
            </TabsContent>

            <TabsContent value="seo">
              <SEOFields
                seoTitle={seoTitle}
                seoDescription={seoDescription}
                seoKeywords={seoKeywords}
                ogImage={ogImage}
                onSeoTitleChange={setSeoTitle}
                onSeoDescriptionChange={setSeoDescription}
                onSeoKeywordsChange={setSeoKeywords}
                onOgImageChange={setOgImage}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingPage ? "Update" : "Create"} Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
