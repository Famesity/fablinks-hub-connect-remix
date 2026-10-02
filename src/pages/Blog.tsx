import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, MessageCircle, Share2 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string | null;
  featured: boolean | null;
  commentCount: number;
  categories: string[];
}

const formatDate = (date: string | null) => date
  ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  : 'Recently';

function ArticleCard({ article, onShare }: { article: BlogPost; onShare: (title: string, slug: string) => void }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/blog/${article.slug}`} className="block aspect-[16/9] overflow-hidden bg-slate-100">
        {article.image_url ? (
          <img src={article.image_url} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary">Fablinks Journal</div>
        )}
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="truncate rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            {article.categories[0] || 'Blog'}
          </span>
          <time className="shrink-0 text-xs text-slate-500">{formatDate(article.created_at)}</time>
        </div>
        <Link to={`/blog/${article.slug}`}>
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary">{article.title}</h3>
        </Link>
        {article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{article.excerpt}</p>}
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link to={`/blog/${article.slug}`} className="inline-flex items-center text-sm font-semibold text-primary">
            Read story <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Button variant="outline" size="icon" aria-label={`Share ${article.title}`} onClick={() => onShare(article.title, article.slug)}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function RecentArticleRow({ article, onShare }: { article: BlogPost; onShare: (title: string, slug: string) => void }) {
  return (
    <article className="flex min-h-[92px] min-w-0 gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] p-2.5 transition-colors hover:bg-white/[0.08]">
      <Link to={`/blog/${article.slug}`} className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg bg-slate-800">
        {article.image_url ? (
          <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-[10px] font-semibold text-slate-400">NEWS</span>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <span className="w-fit max-w-full truncate rounded-full bg-white/[0.08] px-2 py-0.5 text-[9px] font-semibold text-slate-300">
          {article.categories[0] || 'Blog'}
        </span>
        <Link to={`/blog/${article.slug}`}>
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-slate-100 transition-colors hover:text-amber-300 sm:text-sm">{article.title}</h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <time>{formatDate(article.created_at)}</time>
            <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" />{article.commentCount}</span>
          </div>
          <button type="button" aria-label={`Share ${article.title}`} onClick={() => onShare(article.title, article.slug)} className="text-slate-400 transition-colors hover:text-white">
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
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
        .select('id, title, slug, excerpt, image_url, created_at, featured')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      let categoryRows: { post_id: string; blog_categories: { name: string } | null }[] = [];
      let commentRows: { post_id: string }[] = [];
      if (data?.length) {
        const postIds = data.map((article) => article.id);
        const [categoryResult, commentResult] = await Promise.all([
          supabase.from('blog_post_categories').select('post_id, blog_categories(name)').in('post_id', postIds),
          supabase.from('blog_comments').select('post_id').eq('approved', true).in('post_id', postIds),
        ]);

        if (categoryResult.error) {
          console.error('Error fetching blog categories:', categoryResult.error);
        } else {
          categoryRows = categoryResult.data || [];
        }
        if (commentResult.error) {
          console.error('Error fetching blog comments:', commentResult.error);
        } else {
          commentRows = commentResult.data || [];
        }
      }

      const categoriesByPost = new Map<string, string[]>();
      categoryRows.forEach(({ post_id, blog_categories }) => {
        if (!blog_categories) return;
        categoriesByPost.set(post_id, [...(categoriesByPost.get(post_id) || []), blog_categories.name]);
      });

      const commentsByPost = new Map<string, number>();
      commentRows.forEach(({ post_id }) => commentsByPost.set(post_id, (commentsByPost.get(post_id) || 0) + 1));

      setArticles((data || []).map((article) => ({
        ...article,
        categories: categoriesByPost.get(article.id) || [],
        commentCount: commentsByPost.get(article.id) || 0,
      })));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareArticle = (title: string, slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`;
    const text = `Check out this article: ${title} ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const engagedArticles = articles
    .filter((article) => article.featured || article.commentCount > 0)
    .sort((first, second) => second.commentCount - first.commentCount || Number(second.featured) - Number(first.featured));
  const trendingArticles = (engagedArticles.length ? engagedArticles : articles).slice(0, 3);
  const trendingIds = new Set(trendingArticles.map((article) => article.id));
  const recentArticles = articles.slice(0, 9);
  const recentIds = new Set(recentArticles.map((article) => article.id));
  const missedArticles = articles.filter((article) => !recentIds.has(article.id) && !trendingIds.has(article.id));

  return (
    <Layout>
      <SEOHead
        title="Blog & Resources"
        description="Helpful guides, tips, and updates for Nigerian students. Learn about WAEC, JAMB, NECO registration, university applications, and more from Fablinks Computers."
        keywords="student blog Nigeria, WAEC tips, JAMB guide, university admission tips, Nigerian education blog"
      />
      <main className="pt-20">
        <section className="bg-gradient-to-r from-primary to-fablinks-blue-dark py-16 text-white">
          <div className="container-custom text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/75">Stories, guides & updates</p>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Blog & Resources</h1>
            <p className="text-lg text-white/85 md:text-xl">Helpful guides, tips, and updates for Nigerian students</p>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : articles.length === 0 ? (
          <section className="container-custom py-24 text-center">
            <h2 className="mb-3 text-2xl font-bold">No blog posts yet</h2>
            <p className="text-muted-foreground">Check back soon for new content!</p>
          </section>
        ) : (
          <>
            {trendingArticles.length > 0 && (
              <section className="section-padding">
                <div className="container-custom">
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Featured & discussed</p>
                      <h2 className="text-3xl font-bold text-slate-900">Trending</h2>
                      <p className="mt-2 text-sm text-slate-600">Featured stories and posts readers are discussing.</p>
                    </div>
                    <span className="hidden rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 sm:inline-flex">{trendingArticles.length} stories</span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {trendingArticles.map((article) => <ArticleCard key={article.id} article={article} onShare={shareArticle} />)}
                  </div>
                </div>
              </section>
            )}

            {recentArticles.length > 0 && (
              <section className="bg-[#191b25] py-14 sm:py-16">
                <div className="container-custom">
                  <div className="mb-7 flex items-center gap-3">
                    <span className="rounded-full bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300">Most recent</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                    {recentArticles.map((article) => <RecentArticleRow key={article.id} article={article} onShare={shareArticle} />)}
                  </div>
                </div>
              </section>
            )}

            {missedArticles.length > 0 && (
              <section className="section-padding bg-slate-50">
                <div className="container-custom">
                  <div className="mb-8">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">From the archive</p>
                    <h2 className="text-3xl font-bold text-slate-900">You missed</h2>
                    <p className="mt-2 text-sm text-slate-600">More stories and useful guides from our blog.</p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {missedArticles.map((article) => <ArticleCard key={article.id} article={article} onShare={shareArticle} />)}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <section className="section-padding bg-fablinks-gray-light">
          <div className="container-custom text-center">
            <h2 className="mb-4 text-3xl font-bold">Need Help with Any Service?</h2>
            <p className="mb-8 text-lg text-gray-600">Can't find what you're looking for? Our team is ready to assist you 24/7</p>
            <Button
              className="btn-whatsapp"
              onClick={() => window.open('https://wa.me/2347068122861?text=Hello%20Fablinks%20Computers,%20I%20need%20assistance%20today', '_blank')}
            >
              <MessageCircle className="h-5 w-5" />
              Chat with Us Now
            </Button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Blog;
