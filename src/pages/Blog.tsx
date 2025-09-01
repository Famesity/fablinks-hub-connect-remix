
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Button } from '@/components/ui/button';
import { Calendar, User, Share2, MessageCircle } from 'lucide-react';

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "How to Check WAEC Result Online - Complete Guide 2024",
      excerpt: "Step-by-step guide on checking your WAEC results online using scratch cards and verification pins.",
      author: "Fablinks Team",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Education",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "NYSC Registration Guide: Everything You Need to Know",
      excerpt: "Complete guide for NYSC registration, requirements, and common mistakes to avoid.",
      author: "Fablinks Team",
      date: "December 12, 2024",
      readTime: "8 min read",
      category: "NYSC",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Top 5 Mistakes to Avoid in JAMB Applications",
      excerpt: "Learn about the most common JAMB application mistakes and how to avoid them for a successful registration.",
      author: "Fablinks Team",
      date: "December 10, 2024",
      readTime: "6 min read",
      category: "JAMB",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "University Portal Services: A Student's Complete Guide",
      excerpt: "Navigate university portals with ease - from acceptance fees to course registration.",
      author: "Fablinks Team",
      date: "December 8, 2024",
      readTime: "7 min read",
      category: "University",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Digital Bill Payments: Safe and Secure Methods",
      excerpt: "Learn how to safely pay your electricity, water, and cable TV bills online.",
      author: "Fablinks Team",
      date: "December 5, 2024",
      readTime: "4 min read",
      category: "Bills",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Project Writing Tips for Nigerian Students",
      excerpt: "Professional tips for writing outstanding academic projects and research papers.",
      author: "Fablinks Team",
      date: "December 3, 2024",
      readTime: "10 min read",
      category: "Academic",
      image: "/placeholder.svg"
    }
  ];

  const categories = ["All", "Education", "JAMB", "NYSC", "University", "Bills", "Academic"];

  const shareArticle = (title: string) => {
    const text = `Check out this article: ${title}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-fablinks-blue-dark text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
            <p className="text-xl">Helpful guides, tips, and updates for Nigerian students</p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-fablinks-gray-light">
          <div className="container-custom">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm ml-auto">{article.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary cursor-pointer">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {article.date}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Read More
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => shareArticle(article.title)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-fablinks-gray-light">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Any Service?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find what you're looking for? Our team is ready to assist you 24/7
            </p>
            <Button 
              className="btn-whatsapp"
              onClick={() => window.open("https://wa.me/2347068122861?text=Hello%20Fablinks%20Online%20Café,%20I%20need%20assistance%20today", '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Us Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Blog;
