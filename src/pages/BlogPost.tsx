import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  author_name: string;
  content: string;
  admin_reply: string | null;
  created_at: string;
  approved: boolean;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data: postData } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!postData) return;

      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", postData.id)
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!authorName || !authorEmail || !commentText) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!post) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("blog_comments").insert({
        post_id: post.id,
        user_id: user?.id || null,
        author_name: authorName,
        author_email: authorEmail,
        content: commentText,
        approved: false,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment submitted for approval",
      });

      setAuthorName("");
      setAuthorEmail("");
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <Layout>
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => navigate("/blog")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </main>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.seo_title || post.title}</title>
        <meta
          name="description"
          content={post.seo_description || post.excerpt || ""}
        />
        {post.seo_keywords && (
          <meta name="keywords" content={post.seo_keywords} />
        )}
        {post.og_image && <meta property="og:image" content={post.og_image} />}
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta
          property="og:description"
          content={post.seo_description || post.excerpt || ""}
        />
      </Helmet>

      <Layout>
        <main className="flex-1">
        <article className="container mx-auto px-4 py-16">
          <Button
            onClick={() => navigate("/blog")}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-muted-foreground mb-8">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div
            className="prose prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="border-t pt-16">
            <h2 className="text-3xl font-bold mb-8">Comments ({comments.length})</h2>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSubmitComment} disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Submit Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{comment.author_name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{comment.content}</p>
                    {comment.admin_reply && (
                      <div className="pl-4 border-l-2 border-primary">
                        <p className="text-sm font-semibold text-primary mb-1">
                          Admin Reply:
                        </p>
                        <p className="text-sm">{comment.admin_reply}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </article>
      </main>
      </Layout>
    </>
  );
}
