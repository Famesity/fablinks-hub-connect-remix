import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Calendar, User, Share2, MessageCircle, Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  published: boolean;
}

const Blog = () => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareArticle = (title: string, slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`;
    const text = `Check out this article: ${title} ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-fablinks-blue-dark text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
            <p className="text-xl">Helpful guides, tips, and updates for Nigerian students</p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="section-padding">
          <div className="container-custom">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">No blog posts yet</h2>
                <p className="text-muted-foreground">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {article.image_url && (
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <Link to={`/blog/${article.slug}`}>
                        <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary cursor-pointer">
                          {article.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/blog/${article.slug}`} className="flex-1">
                          <Button className="w-full">
                            Read More
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => shareArticle(article.title, article.slug)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-fablinks-gray-light">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Any Service?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find what you're looking for? Our team is ready to assist you 24/7
            </p>
            <Button 
              className="btn-whatsapp"
              onClick={() => window.open("https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20assistance%20today", '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Us Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Blog;
