import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText, Briefcase, BookOpen, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';

interface SearchResult {
  id: string;
  title: string;
  type: 'blog' | 'service' | 'page';
  slug: string;
  excerpt?: string;
  category?: string;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getSetting } = useSiteSettings();
  const searchPlaceholder = getSetting('search_placeholder', 'Search...');

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search blog posts
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt')
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(10);

      if (blogPosts) {
        blogPosts.forEach(post => {
          searchResults.push({
            id: post.id,
            title: post.title,
            type: 'blog',
            slug: post.slug,
            excerpt: post.excerpt || undefined,
          });
        });
      }

      // Search services
      const { data: services } = await supabase
        .from('services')
        .select('id, name, description, category')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(10);

      if (services) {
        services.forEach(service => {
          searchResults.push({
            id: service.id,
            title: service.name,
            type: 'service',
            slug: 'services',
            excerpt: service.description || undefined,
            category: service.category,
          });
        });
      }

      // Search pages
      const { data: pages } = await supabase
        .from('pages')
        .select('id, title, slug, excerpt')
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(10);

      if (pages) {
        pages.forEach(page => {
          searchResults.push({
            id: page.id,
            title: page.title,
            type: 'page',
            slug: page.slug,
            excerpt: page.excerpt || undefined,
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    performSearch(query);
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'blog':
        return <BookOpen className="w-5 h-5 text-primary" />;
      case 'service':
        return <Briefcase className="w-5 h-5 text-accent" />;
      case 'page':
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'blog':
        return 'Blog Post';
      case 'service':
        return 'Service';
      case 'page':
        return 'Page';
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'blog':
        return `/blog/${result.slug}`;
      case 'service':
        return '/services';
      case 'page':
        return `/page/${result.slug}`;
    }
  };

  return (
    <Layout>
      <SEOHead
        title={initialQuery ? `Search results for "${initialQuery}"` : 'Search'}
        description="Search our website for blog posts, services, and pages."
      />
      
      <div className="min-h-screen bg-background">
        <div className="container-custom py-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          {/* Search Header */}
          <div className="max-w-2xl mx-auto mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
              Search
            </h1>
            
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-24 h-12 text-base bg-background border-border"
                autoFocus
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Results Section */}
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : initialQuery && results.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{initialQuery}"
                </p>
                <div className="space-y-4">
                  {results.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      to={getResultLink(result)}
                      className="block p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-muted rounded-lg shrink-0">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {result.title}
                            </h3>
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground shrink-0">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          {result.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {result.excerpt}
                            </p>
                          )}
                          {result.category && (
                            <p className="text-xs text-primary mt-1">
                              Category: {result.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : initialQuery ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-foreground mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  No results found for "{initialQuery}". Try different keywords.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-foreground mb-2">Start searching</h2>
                <p className="text-muted-foreground">
                  Enter a search term to find blog posts, services, and pages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
