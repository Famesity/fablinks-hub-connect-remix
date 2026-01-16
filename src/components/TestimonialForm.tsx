import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TestimonialForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    author_name: '',
    author_role: '',
    content: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author_name.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and review.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          author_name: formData.author_name.trim(),
          author_role: formData.author_role.trim() || null,
          content: formData.content.trim(),
          rating: rating,
          approved: false,
          featured: false
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Thank You!",
        description: "Your review has been submitted and is pending approval.",
      });

      // Reset form after delay
      setTimeout(() => {
        setFormData({ author_name: '', author_role: '', content: '' });
        setRating(5);
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your review has been submitted successfully and is pending approval.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Share Your Experience</CardTitle>
        <CardDescription>
          We'd love to hear about your experience with our services. Your feedback helps us improve!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="author_name">Your Name *</Label>
            <Input
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleInputChange}
              placeholder="John Doe"
              maxLength={100}
              required
            />
          </div>

          {/* Role/Title */}
          <div className="space-y-2">
            <Label htmlFor="author_role">Your Title/Role (Optional)</Label>
            <Input
              id="author_role"
              name="author_role"
              value={formData.author_role}
              onChange={handleInputChange}
              placeholder="e.g., Student, Business Owner"
              maxLength={100}
            />
          </div>

          {/* Review */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Tell us about your experience..."
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.content.length}/500 characters
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your review will be published after approval by our team.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;
