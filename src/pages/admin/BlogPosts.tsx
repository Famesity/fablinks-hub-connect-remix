import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, ArrowLeft, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RichTextEditor from "@/components/RichTextEditor";
import ImageGallery from "@/components/ImageGallery";
import SEOFields from "@/components/SEOFields";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { ADMIN_PERMISSIONS } from "@/hooks/usePermissions";
import { useActivityLog } from "@/hooks/useActivityLog";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  featured: boolean;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_date: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface ImageAttachment {
  image_url: string;
  caption?: string;
  alt_text?: string;
  display_order: number;
}

export default function AdminBlogPosts() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<ImageAttachment[]>([]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
      fetchCategories();
      fetchTags();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts((data || []) as BlogPost[]);
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

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");
    if (data) setCategories(data);
  };

  const fetchTags = async () => {
    const { data } = await supabase
      .from("blog_tags")
      .select("*")
      .order("name");
    if (data) setTags(data);
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    const slug = generateSlug(newCategory);
    const { data, error } = await supabase
      .from("blog_categories")
      .insert({ name: newCategory, slug })
      .select()
      .single();
    
    if (!error && data) {
      setCategories([...categories, data]);
      setSelectedCategories([...selectedCategories, data.id]);
      setNewCategory("");
      toast({ title: "Category created" });
    }
  };

  const createTag = async () => {
    if (!newTag.trim()) return;
    const slug = generateSlug(newTag);
    const { data, error } = await supabase
      .from("blog_tags")
      .insert({ name: newTag, slug })
      .select()
      .single();
    
    if (!error && data) {
      setTags([...tags, data]);
      setSelectedTags([...selectedTags, data.id]);
      setNewTag("");
      toast({ title: "Tag created" });
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingPost) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
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
    setExcerpt("");
    setContent("");
    setImageUrl("");
    setPublished(false);
    setFeatured(false);
    setStatus('draft');
    setScheduledDate("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setOgImage("");
    setGalleryImages([]);
    setEditingPost(null);
  };

  const handleEdit = async (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setImageUrl(post.image_url || "");
    setPublished(post.published);
    setFeatured(post.featured || false);
    setStatus(post.status || 'draft');
    setScheduledDate(post.scheduled_date || "");
    setSeoTitle(post.seo_title || "");
    setSeoDescription(post.seo_description || "");
    setSeoKeywords(post.seo_keywords || "");
    setOgImage(post.og_image || "");

    // Fetch gallery images
    const { data: images } = await supabase
      .from("image_attachments")
      .select("*")
      .eq("entity_type", "blog_post")
      .eq("entity_id", post.id)
      .order("display_order");

    if (images) {
      setGalleryImages(images);
    }

    // Fetch categories
    const { data: postCategories } = await supabase
      .from("blog_post_categories")
      .select("category_id")
      .eq("post_id", post.id);
    
    if (postCategories) {
      setSelectedCategories(postCategories.map(pc => pc.category_id));
    }

    // Fetch tags
    const { data: postTags } = await supabase
      .from("blog_post_tags")
      .select("tag_id")
      .eq("post_id", post.id);
    
    if (postTags) {
      setSelectedTags(postTags.map(pt => pt.tag_id));
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

      const postData = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image_url: imageUrl || null,
        published: status === 'published',
        featured,
        status,
        scheduled_date: scheduledDate || null,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        seo_keywords: seoKeywords || null,
        og_image: ogImage || null,
        author_id: user?.id,
      };

      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;

        // Update gallery images
        await supabase
          .from("image_attachments")
          .delete()
          .eq("entity_type", "blog_post")
          .eq("entity_id", editingPost.id);

        if (galleryImages.length > 0) {
          const imageData = galleryImages.map((img, index) => ({
            entity_type: "blog_post",
            entity_id: editingPost.id,
            image_url: img.image_url,
            caption: img.caption,
            alt_text: img.alt_text,
            display_order: index,
          }));

          await supabase.from("image_attachments").insert(imageData);
        }

        // Update categories
        await supabase
          .from("blog_post_categories")
          .delete()
          .eq("post_id", editingPost.id);
        
        if (selectedCategories.length > 0) {
          await supabase
            .from("blog_post_categories")
            .insert(selectedCategories.map(catId => ({
              post_id: editingPost.id,
              category_id: catId
            })));
        }

        // Update tags
        await supabase
          .from("blog_post_tags")
          .delete()
          .eq("post_id", editingPost.id);
        
        if (selectedTags.length > 0) {
          await supabase
            .from("blog_post_tags")
            .insert(selectedTags.map(tagId => ({
              post_id: editingPost.id,
              tag_id: tagId
            })));
        }

        toast({ title: "Blog post updated successfully" });
      } else {
        const { error, data } = await supabase
          .from("blog_posts")
          .insert([postData])
          .select()
          .single();

        if (error) throw error;

        // Insert gallery images
        if (galleryImages.length > 0) {
          const imageData = galleryImages.map((img, index) => ({
            entity_type: "blog_post",
            entity_id: data.id,
            image_url: img.image_url,
            caption: img.caption,
            alt_text: img.alt_text,
            display_order: index,
          }));

          await supabase.from("image_attachments").insert(imageData);
        }

        // Insert categories
        if (selectedCategories.length > 0) {
          await supabase
            .from("blog_post_categories")
            .insert(selectedCategories.map(catId => ({
              post_id: data.id,
              category_id: catId
            })));
        }

        // Insert tags
        if (selectedTags.length > 0) {
          await supabase
            .from("blog_post_tags")
            .insert(selectedTags.map(tagId => ({
              post_id: data.id,
              tag_id: tagId
            })));
        }

        toast({ title: "Blog post created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Blog post deleted successfully" });
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_BLOG}>
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
            <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? "bg-success/10 text-success"
                            : post.status === 'scheduled'
                            ? "bg-primary/10 text-primary"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {post.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {post.featured && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          ⭐ Featured
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.scheduled_date && new Date(post.scheduled_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
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
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="taxonomy">Categories & Tags</TabsTrigger>
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
                  placeholder="Post title"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
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
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Featured"
                    className="mt-2 w-full h-48 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <Label>Content *</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your blog post..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Post Status *</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === 'scheduled' && (
                  <div>
                    <Label htmlFor="scheduled-date">Scheduled Date</Label>
                    <Input
                      id="scheduled-date"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">⭐ Featured Post</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="taxonomy" className="space-y-6">
              <div>
                <Label>Categories</Label>
                <div className="space-y-2 mt-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                          }
                        }}
                        className="rounded border-input"
                      />
                      <Label className="font-normal">{cat.name}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button type="button" onClick={createCategory} size="sm">
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => {
                        if (selectedTags.includes(tag.id)) {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id));
                        } else {
                          setSelectedTags([...selectedTags, tag.id]);
                        }
                      }}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="New tag name"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button type="button" onClick={createTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>
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
              {editingPost ? "Update" : "Create"} Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </PermissionGate>
  );
}
