-- Add categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add post_categories junction table
CREATE TABLE IF NOT EXISTS public.blog_post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);

-- Add post_tags junction table
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Add featured and scheduled columns to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published'));

-- Update existing posts to have correct status based on published field
UPDATE public.blog_posts 
SET status = CASE 
  WHEN published = TRUE THEN 'published'
  ELSE 'draft'
END
WHERE status IS NULL;

-- Enable RLS on new tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
CREATE POLICY "Anyone can view categories"
  ON public.blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.blog_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for tags
CREATE POLICY "Anyone can view tags"
  ON public.blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON public.blog_tags FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for post_categories
CREATE POLICY "Anyone can view post categories"
  ON public.blog_post_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage post categories"
  ON public.blog_post_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for post_tags
CREATE POLICY "Anyone can view post tags"
  ON public.blog_post_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage post tags"
  ON public.blog_post_tags FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post_id ON public.blog_post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON public.blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_date ON public.blog_posts(scheduled_date) WHERE scheduled_date IS NOT NULL;