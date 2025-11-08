-- Create custom pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  template VARCHAR(50) DEFAULT 'default',
  published BOOLEAN DEFAULT false,
  show_in_menu BOOLEAN DEFAULT false,
  menu_order INTEGER DEFAULT 0,
  parent_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create image attachments table for multiple images
CREATE TABLE public.image_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'blog_post', 'page', 'comment'
  entity_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages
CREATE POLICY "Anyone can view published pages"
ON public.pages
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all pages"
ON public.pages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for image attachments
CREATE POLICY "Anyone can view image attachments"
ON public.image_attachments
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage image attachments"
ON public.image_attachments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add SEO fields to blog_posts
ALTER TABLE public.blog_posts
ADD COLUMN seo_title TEXT,
ADD COLUMN seo_description TEXT,
ADD COLUMN seo_keywords TEXT,
ADD COLUMN og_image TEXT;

-- Create indexes for performance
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_published ON public.pages(published);
CREATE INDEX idx_pages_parent_id ON public.pages(parent_id);
CREATE INDEX idx_image_attachments_entity ON public.image_attachments(entity_type, entity_id);
CREATE INDEX idx_image_attachments_order ON public.image_attachments(entity_id, display_order);