import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  template: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image: string;
  created_at: string;
}

interface ImageAttachment {
  id: string;
  image_url: string;
  caption: string;
  alt_text: string;
  display_order: number;
}

export default function Page() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      setPage(data);

      // Fetch gallery images
      const { data: galleryImages } = await supabase
        .from("image_attachments")
        .select("*")
        .eq("entity_type", "page")
        .eq("entity_id", data.id)
        .order("display_order");

      if (galleryImages) {
        setImages(galleryImages);
      }
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <Layout>
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </main>
      </Layout>
    );
  }

  const renderTemplate = () => {
    const baseClasses = "container mx-auto px-4 py-16";
    
    switch (page.template) {
      case "full-width":
        return (
          <div className="w-full py-16">
            <article className="max-w-7xl mx-auto px-4">
              {renderContent()}
            </article>
          </div>
        );
      
      case "landing":
        return (
          <div className="w-full">
            {page.featured_image && (
              <div
                className="h-[60vh] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${page.featured_image})` }}
              >
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">{page.title}</h1>
                    {page.excerpt && (
                      <p className="text-xl md:text-2xl">{page.excerpt}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <article className={baseClasses}>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
              {renderGallery()}
            </article>
          </div>
        );
      
      case "sidebar":
        return (
          <div className={baseClasses}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <article className="lg:col-span-2">
                {renderContent()}
              </article>
              <aside className="space-y-6">
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="/" className="text-primary hover:underline">Home</a></li>
                    <li><a href="/services" className="text-primary hover:underline">Services</a></li>
                    <li><a href="/contact" className="text-primary hover:underline">Contact</a></li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        );
      
      default:
        return (
          <article className={baseClasses}>
            {renderContent()}
          </article>
        );
    }
  };

  const renderContent = () => (
    <>
      {page.featured_image && page.template !== "landing" && (
        <img
          src={page.featured_image}
          alt={page.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      
      {page.excerpt && (
        <p className="text-xl text-muted-foreground mb-8">{page.excerpt}</p>
      )}

      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />

      {renderGallery()}
    </>
  );

  const renderGallery = () => {
    if (images.length === 0) return null;

    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.image_url}
                alt={image.alt_text || "Gallery image"}
                className="w-full h-64 object-cover rounded-lg"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{page.seo_title || page.title}</title>
        <meta
          name="description"
          content={page.seo_description || page.excerpt || ""}
        />
        {page.seo_keywords && (
          <meta name="keywords" content={page.seo_keywords} />
        )}
        {page.og_image && <meta property="og:image" content={page.og_image} />}
        <meta property="og:title" content={page.seo_title || page.title} />
        <meta
          property="og:description"
          content={page.seo_description || page.excerpt || ""}
        />
      </Helmet>

      <Layout>
        <main className="flex-1">
          {renderTemplate()}
        </main>
      </Layout>
    </>
  );
}
