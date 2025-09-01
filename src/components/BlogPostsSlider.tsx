
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPostsSlider = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to WAEC Result Checking 2024",
      excerpt: "Learn the step-by-step process to check your WAEC results online, including troubleshooting common issues and verification tips.",
      image: "/api/placeholder/400/250",
      author: "Fablinks Team",
      date: "Dec 15, 2024",
      category: "Education",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "NYSC Registration: Complete Guide for Fresh Graduates",
      excerpt: "Everything you need to know about NYSC registration, required documents, and how to avoid common mistakes during the process.",
      image: "/api/placeholder/400/250",
      author: "Fablinks Team", 
      date: "Dec 12, 2024",
      category: "NYSC",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Top 5 Mistakes to Avoid in JAMB Applications",
      excerpt: "Don't let simple errors ruin your university admission chances. Here are the most common JAMB application mistakes and how to avoid them.",
      image: "/api/placeholder/400/250",
      author: "Fablinks Team",
      date: "Dec 10, 2024",
      category: "JAMB",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "How to Pay School Fees Online: University Portal Guide",
      excerpt: "Step-by-step instructions for paying school fees through various university portals across Nigeria, including troubleshooting tips.",
      image: "/api/placeholder/400/250",
      author: "Fablinks Team",
      date: "Dec 8, 2024",
      category: "University",
      readTime: "4 min read"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="gradient-text">Blog Posts</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest tips, guides, and news about Nigerian education and digital services.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {blogPosts.map((post) => (
              <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-primary/80 p-0"
                        onClick={() => window.location.href = '/blog'}
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center mt-8">
          <Button 
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => window.location.href = '/blog'}
          >
            View All Blog Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPostsSlider;
