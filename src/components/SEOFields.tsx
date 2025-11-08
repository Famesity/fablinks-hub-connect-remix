import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SEOFieldsProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSeoKeywordsChange: (value: string) => void;
  onOgImageChange: (value: string) => void;
}

export default function SEOFields({
  seoTitle,
  seoDescription,
  seoKeywords,
  ogImage,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onSeoKeywordsChange,
  onOgImageChange,
}: SEOFieldsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>
          Optimize your content for search engines and social media
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="seo-title">SEO Title</Label>
          <Input
            id="seo-title"
            value={seoTitle}
            onChange={(e) => onSeoTitleChange(e.target.value)}
            placeholder="Enter SEO title (max 60 characters)"
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {seoTitle.length}/60 characters
          </p>
        </div>

        <div>
          <Label htmlFor="seo-description">Meta Description</Label>
          <Textarea
            id="seo-description"
            value={seoDescription}
            onChange={(e) => onSeoDescriptionChange(e.target.value)}
            placeholder="Enter meta description (max 160 characters)"
            maxLength={160}
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {seoDescription.length}/160 characters
          </p>
        </div>

        <div>
          <Label htmlFor="seo-keywords">Keywords</Label>
          <Input
            id="seo-keywords"
            value={seoKeywords}
            onChange={(e) => onSeoKeywordsChange(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate keywords with commas
          </p>
        </div>

        <div>
          <Label htmlFor="og-image">Open Graph Image URL</Label>
          <Input
            id="og-image"
            value={ogImage}
            onChange={(e) => onOgImageChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Image for social media sharing (1200x630px recommended)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
