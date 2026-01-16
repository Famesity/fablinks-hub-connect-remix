import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Briefcase, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  type: 'blog' | 'service' | 'page';
  slug: string;
  excerpt?: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.trim().length < 2) {
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
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
          .limit(3);

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
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(3);

        if (services) {
          services.forEach(service => {
            searchResults.push({
              id: service.id,
              title: service.name,
              type: 'service',
              slug: 'services',
              excerpt: service.description || undefined,
            });
          });
        }

        // Search pages
        const { data: pages } = await supabase
          .from('pages')
          .select('id, title, slug, excerpt')
          .eq('published', true)
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
          .limit(3);

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
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    
    switch (result.type) {
      case 'blog':
        navigate(`/blog/${result.slug}`);
        break;
      case 'service':
        navigate('/services');
        break;
      case 'page':
        navigate(`/page/${result.slug}`);
        break;
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'blog':
        return <BookOpen className="w-4 h-4 text-primary" />;
      case 'service':
        return <Briefcase className="w-4 h-4 text-accent" />;
      case 'page':
        return <FileText className="w-4 h-4 text-muted-foreground" />;
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

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-8 w-40 lg:w-56 h-9 bg-background border-border focus:ring-primary"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors border-b border-border last:border-b-0 flex items-start gap-3"
                >
                  <div className="mt-0.5">{getIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {result.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground shrink-0">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    {result.excerpt && (
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {result.excerpt}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
