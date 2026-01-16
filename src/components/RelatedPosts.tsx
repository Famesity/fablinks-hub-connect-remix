import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  limit?: number;
}

const RelatedPosts = ({ currentPostId, limit = 3 }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId]);

  const fetchRelatedPosts = async () => {
    try {
      // Get categories of current post
      const { data: currentCategories } = await supabase
        .from('blog_post_categories')
        .select('category_id')
        .eq('post_id', currentPostId);

      let relatedPosts: RelatedPost[] = [];

      if (currentCategories && currentCategories.length > 0) {
        const categoryIds = currentCategories.map(c => c.category_id);
        
        // Get posts with same categories
        const { data: categoryPosts } = await supabase
          .from('blog_post_categories')
          .select('post_id')
          .in('category_id', categoryIds)
          .neq('post_id', currentPostId);

        if (categoryPosts && categoryPosts.length > 0) {
          const postIds = [...new Set(categoryPosts.map(p => p.post_id))];
          
          const { data } = await supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, image_url, created_at')
            .in('id', postIds)
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(limit);

          if (data) relatedPosts = data;
        }
      }

      // If not enough related posts, fill with recent posts
      if (relatedPosts.length < limit) {
        const existingIds = [currentPostId, ...relatedPosts.map(p => p.id)];
        const { data: recentPosts } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, image_url, created_at')
          .eq('published', true)
          .not('id', 'in', `(${existingIds.join(',')})`)
          .order('created_at', { ascending: false })
          .limit(limit - relatedPosts.length);

        if (recentPosts) {
          relatedPosts = [...relatedPosts, ...recentPosts];
        }
      }

      setPosts(relatedPosts);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full rounded-t-lg" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-12">
      <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="h-40 w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No image</span>
                </div>
              )}
              <CardContent className="p-4">
                <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;