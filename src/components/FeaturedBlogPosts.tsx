import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

export default function FeaturedBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, image_url, created_at")
        .eq("featured", true)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and insightful blog posts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full group">
                {post.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4">
                    <span className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
