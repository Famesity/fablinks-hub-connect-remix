import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageAttachment {
  id?: string;
  image_url: string;
  caption?: string;
  alt_text?: string;
  display_order: number;
}

interface ImageGalleryProps {
  images: ImageAttachment[];
  onChange: (images: ImageAttachment[]) => void;
  maxImages?: number;
}

export default function ImageGallery({ images, onChange, maxImages = 10 }: ImageGalleryProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageAttachment | null>(null);

  const handleUpload = async (file: File) => {
    if (images.length >= maxImages) {
      toast({
        title: 'Limit reached',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      const newImage: ImageAttachment = {
        image_url: data.publicUrl,
        display_order: images.length,
        caption: '',
        alt_text: file.name.split('.')[0],
      };

      onChange([...images, newImage]);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onChange(newImages);
  };

  const handleUpdateAltText = (index: number, alt_text: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], alt_text };
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Image Gallery ({images.length}/{maxImages})</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || images.length >= maxImages}
          onClick={() => document.getElementById('gallery-upload')?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload Image
        </Button>
        <input
          id="gallery-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <img
              src={image.image_url}
              alt={image.alt_text || `Gallery image ${index + 1}`}
              className="w-full h-32 object-cover cursor-pointer"
              onClick={() => setSelectedImage(image)}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                {image.caption}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || 'Gallery image'}
                className="w-full rounded-lg"
              />
              <div>
                <Label>Caption</Label>
                <Input
                  value={selectedImage.caption || ''}
                  onChange={(e) => {
                    const index = images.findIndex(img => img.image_url === selectedImage.image_url);
                    if (index !== -1) handleUpdateCaption(index, e.target.value);
                  }}
                  placeholder="Add a caption..."
                />
              </div>
              <div>
                <Label>Alt Text (for SEO)</Label>
                <Input
                  value={selectedImage.alt_text || ''}
                  onChange={(e) => {
                    const index = images.findIndex(img => img.image_url === selectedImage.image_url);
                    if (index !== -1) handleUpdateAltText(index, e.target.value);
                  }}
                  placeholder="Describe the image..."
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
