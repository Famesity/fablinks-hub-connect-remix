import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, MessageCircle, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

const SocialShareButtons = ({ title, url, className = '' }: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Share:</span>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
        onClick={() => openShareWindow(shareLinks.facebook)}
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
        onClick={() => openShareWindow(shareLinks.twitter)}
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
        onClick={() => openShareWindow(shareLinks.whatsapp)}
        title="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 hover:bg-primary hover:text-white hover:border-primary transition-colors"
        onClick={copyToClipboard}
        title="Copy link"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SocialShareButtons;
